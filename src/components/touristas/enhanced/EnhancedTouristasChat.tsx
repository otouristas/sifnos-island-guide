
import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AIMessage, HotelRecommendation, HotelBundle, QuickPrompt, MessageContext } from './TouristasAITypes';
import { searchHotels } from '@/services/hotelSearch';
import { callTouristasAI, processStreamingResponse, searchHotelsWithAvailability, parseNaturalDates, trackConversationContext, AIRequestMessage } from '../services/ChatService';
import { extractUserPreferencesFromMessage } from '../utils/chat-utils';

const QUICK_PROMPTS: QuickPrompt[] = [
  { id: '1', text: "Hotels available for next weekend", category: "real_time" },
  { id: '2', text: "Best beaches in Sifnos", category: "local_content" },
  { id: '3', text: "Hotels in Kamares", category: "local_hotels" },
  { id: '4', text: "Plan my 3-day Sifnos vacation", category: "hybrid" },
  { id: '5', text: "What's the weather like in July?", category: "general" },
  { id: '6', text: "🧠 Test Intelligent Routing System", category: "test" }
];

export default function EnhancedTouristasChat() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome',
      type: 'bot',
      content: 'Γεια σου! ✨ I\'m Touristas AI, your intelligent Sifnos travel companion powered by 200+ automated trained agents. I understand natural language dates like "next weekend" and can find real-time hotel availability for your exact travel dates. Ask me anything about Sifnos accommodations!',
      timestamp: new Date(),
      suggestions: [
        'Hotels available for next weekend',
        'Luxury accommodations for next week',
        'Budget options near beaches',
        'Romantic getaway packages'
      ]
    }
  ]);
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  const [userContext, setUserContext] = useState<MessageContext>({
    topic: 'general'
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const extractContextFromMessage = (message: string): MessageContext => {
    const lowerMessage = message.toLowerCase();
    const context: MessageContext = { topic: 'general' };

    const locations = ['platis gialos', 'apollonia', 'kamares', 'kastro', 'artemonas', 'vathi', 'faros', 'chrysopigi'];
    const foundLocation = locations.find(loc => lowerMessage.includes(loc));
    if (foundLocation) context.location = foundLocation;

    if (lowerMessage.includes('budget') || lowerMessage.includes('cheap') || lowerMessage.includes('affordable')) {
      context.budget = 'budget';
    } else if (lowerMessage.includes('luxury') || lowerMessage.includes('premium') || lowerMessage.includes('expensive')) {
      context.budget = 'luxury';
    }

    if (lowerMessage.includes('family') || lowerMessage.includes('kids') || lowerMessage.includes('children')) {
      context.travelers = 'family';
    } else if (lowerMessage.includes('couple') || lowerMessage.includes('romantic') || lowerMessage.includes('honeymoon')) {
      context.travelers = 'couple';
    } else if (lowerMessage.includes('solo') || lowerMessage.includes('alone')) {
      context.travelers = 'solo';
    }

    const amenities = ['pool', 'spa', 'beach', 'wifi', 'breakfast', 'parking', 'restaurant', 'bar'];
    context.interests = amenities.filter(amenity => lowerMessage.includes(amenity));

    if (lowerMessage.includes('hotel') || lowerMessage.includes('stay') || lowerMessage.includes('accommodation')) {
      context.topic = 'accommodation';
    } else if (foundLocation) {
      context.topic = 'location';
    }

    return context;
  };

  const generateSmartSuggestions = (context: MessageContext): string[] => {
    const suggestions: string[] = [];
    
    if (context.location) {
      suggestions.push(`What else can I do in ${context.location}?`);
      suggestions.push(`Show me restaurants in ${context.location}`);
    }
    
    if (context.budget === 'budget') {
      suggestions.push('Any budget dining recommendations?');
      suggestions.push('Free activities in the area?');
    } else if (context.budget === 'luxury') {
      suggestions.push('Premium experiences nearby?');
      suggestions.push('Fine dining options?');
    }
    
    if (context.travelers === 'family') {
      suggestions.push('Family-friendly beaches nearby?');
      suggestions.push('Activities for kids?');
    } else if (context.travelers === 'couple') {
      suggestions.push('Romantic dinner spots?');
      suggestions.push('Sunset viewing locations?');
    }
    
    suggestions.push('Check availability for specific dates');
    suggestions.push('Compare with other areas');
    
    return suggestions.slice(0, 4);
  };

  const createHotelBundle = (hotels: any[], context: MessageContext): HotelBundle | null => {
    if (hotels.length < 2) return null;

    const totalPrice = hotels.reduce((sum, hotel) => sum + hotel.price, 0);
    const averagePrice = totalPrice / hotels.length;
    const savings = Math.round(averagePrice * 0.15 * hotels.length);

    return {
      id: `bundle-${Date.now()}`,
      name: `${context.location ? context.location.charAt(0).toUpperCase() + context.location.slice(1) : 'Sifnos'} ${context.travelers === 'couple' ? 'Romantic' : context.travelers === 'family' ? 'Family' : 'Discovery'} Package`,
      theme: context.travelers || 'discovery',
      totalPrice: totalPrice - savings,
      savings,
      hotels: hotels.slice(0, 3).map(hotel => ({
        id: hotel.id,
        name: hotel.name,
        location: hotel.location,
        price: hotel.price,
        rating: hotel.rating || hotel.review_score || 4,
        image: hotel.image_url || hotel.hotel_photos?.[0]?.photo_url || '/placeholder.svg',
        amenities: hotel.hotel_amenities?.map((a: any) => a.amenity) || ['WiFi', 'AC'],
        source: hotel.source || 'local',
        description: hotel.description || hotel.short_description || 'Beautiful accommodation in Sifnos',
        bestFor: context.travelers === 'family' ? ['families', 'kids'] : context.travelers === 'couple' ? ['couples', 'romance'] : ['travelers', 'comfort'],
        bookingUrl: hotel.landing_url || hotel.booking_url
      })),
      duration: '3-7 nights',
      occasion: context.travelers === 'couple' ? 'Romantic Getaway' : context.travelers === 'family' ? 'Family Vacation' : 'Island Discovery',
      highlights: [
        'Handpicked accommodations',
        'Best locations in Sifnos',
        'Local insider tips included',
        'Flexible booking options'
      ],
      itinerary: [
        'Day 1: Arrival & Apollonia exploration',
        'Day 2: Beach day at Platis Gialos',
        'Day 3: Village hopping & local cuisine',
        'Day 4: Hidden beaches & sunset viewing'
      ]
    };
  };

  const handleQuickPrompt = (prompt: QuickPrompt) => {
    setInput(prompt.text);
    
    if (prompt.category === 'test') {
      const testMessage = `🧠 INTELLIGENT ROUTING SYSTEM TEST

This demonstrates how Touristas AI routes different queries:

🤖 OPENROUTER: "What's the weather like?" → General travel intelligence
🏨 AGODA API: "Hotels for next weekend" → Real-time availability  
🏛️ LOCAL HOTELS: "Hotels in Kamares" → Sponsored properties
🏖️ LOCAL CONTENT: "Best beaches" → Local insider knowledge
🌟 HYBRID: "Plan my vacation" → All sources combined

Try any of these queries to see the world's most intelligent travel AI in action!`;
      
      setMessages(prev => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          type: 'user',
          content: prompt.text,
          timestamp: new Date()
        },
        {
          id: `system-${Date.now()}`,
          type: 'bot',
          content: testMessage,
          timestamp: new Date()
        }
      ]);
      setInput('');
      return;
    }
    
    handleSendMessage();
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const analyzeQueryIntent = (message: string, context: MessageContext) => {
    const messageLower = message.toLowerCase();
    
    const hasDateKeywords = ['next weekend', 'next week', 'available', 'book', 'reserve', 'dates'].some(keyword => messageLower.includes(keyword));
    const hasTemporalKeywords = ['tomorrow', 'today', 'this weekend', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'].some(keyword => messageLower.includes(keyword));
    
    const sifnosLocations = ['kamares', 'apollonia', 'platis gialos', 'kastro', 'faros', 'vathi', 'artemonas'];
    const hasLocationKeywords = sifnosLocations.some(location => messageLower.includes(location));
    
    const hasHotelKeywords = ['hotel', 'accommodation', 'stay', 'villa', 'room'].some(keyword => messageLower.includes(keyword));
    
    const hasLocalContentKeywords = ['beach', 'restaurant', 'taverna', 'things to do', 'activity', 'pottery', 'museum'].some(keyword => messageLower.includes(keyword));
    
    let intent = 'general_travel_info';
    let confidence = 0.5;
    let requiresHotelData = false;
    let requiresLocalContent = false;
    let requiresRealTimeData = false;
    
    if (hasDateKeywords || hasTemporalKeywords) {
      intent = 'real_time_availability';
      confidence = 0.9;
      requiresHotelData = true;
      requiresRealTimeData = true;
    } else if (hasLocationKeywords && hasHotelKeywords) {
      intent = 'local_sponsored_hotels';
      confidence = 0.8;
      requiresHotelData = true;
    } else if (hasLocalContentKeywords) {
      intent = 'location_guide';
      confidence = 0.7;
      requiresLocalContent = true;
    } else if (hasHotelKeywords) {
      intent = 'local_sponsored_hotels';
      confidence = 0.6;
      requiresHotelData = true;
    }
    
    const planningKeywords = ['plan', 'itinerary', 'trip', 'vacation'].some(keyword => messageLower.includes(keyword));
    if (planningKeywords || (hasHotelKeywords && hasLocalContentKeywords)) {
      intent = 'hybrid_recommendation';
      confidence = 0.9;
      requiresHotelData = true;
      requiresLocalContent = true;
      requiresRealTimeData = true;
    }
    
    return {
      intent,
      confidence,
      requiresHotelData,
      requiresLocalContent,
      requiresRealTimeData,
      hasDateKeywords,
      hasLocationKeywords,
      entities: {
        locations: sifnosLocations.filter(loc => messageLower.includes(loc)),
        dates: parseNaturalDates(message)
      }
    };
  };

  const determineRoutingStrategy = (queryIntent: any, queryLower: string) => {
    const strategies = {
      'real_time_availability': {
        strategy: 'parallel',
        sources: ['agoda', 'local_hotels'],
        description: 'Real-time availability + local options'
      },
      'local_sponsored_hotels': {
        strategy: 'sequential', 
        sources: ['local_hotels', 'openrouter'],
        description: 'Local properties with context enhancement'
      },
      'location_guide': {
        strategy: 'parallel',
        sources: ['local_content', 'openrouter'], 
        description: 'Local content with travel expertise'
      },
      'hybrid_recommendation': {
        strategy: 'parallel',
        sources: ['agoda', 'local_hotels', 'local_content', 'openrouter'],
        description: 'Comprehensive multi-source intelligence'
      },
      'general_travel_info': {
        strategy: 'single',
        sources: ['openrouter'],
        description: 'General travel knowledge and advice'
      }
    };
    
    return strategies[queryIntent.intent] || strategies['general_travel_info'];
  };

  const handleSendMessage = async (messageText?: string) => {
    console.log('🚀 handleSendMessage called with:', messageText || input);
    const messageContent = messageText || input.trim();
    if (!messageContent) {
      console.log('❌ No message content, returning early');
      return;
    }
    console.log('✅ Processing message:', messageContent);

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: messageContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setShowQuickPrompts(false);

    const newContext = extractContextFromMessage(messageContent);
    setUserContext(prev => ({ ...prev, ...newContext }));

    setIsTyping(true);
    const typingMessage: AIMessage = {
      id: 'typing',
      type: 'bot',
      content: '',
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);

    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    try {
      setIsLoading(true);
      setIsTyping(false);

      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));

      const parsedDates = parseNaturalDates(messageContent);
      console.log('Date parsing test for:', messageContent, 'Result:', parsedDates);
      
      const previousMessages = messages.slice(-5).map(msg => ({
        role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content,
        id: msg.id
      }));
      
      const conversationContext = trackConversationContext(messages.map(msg => ({
        id: msg.id,
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      })));
      
      console.log('🧠 Analyzing query with intelligent routing system...');
      
      const queryLower = messageContent.toLowerCase();
      
      const queryIntent = analyzeQueryIntent(messageContent, newContext);
      const routingStrategy = determineRoutingStrategy(queryIntent, queryLower);
      
      console.log('📊 Intelligent Analysis:', {
        intent: queryIntent.intent,
        confidence: queryIntent.confidence,
        sources: routingStrategy.sources,
        strategy: routingStrategy.strategy
      });
      
      console.log('=== HOTEL SEARCH DEBUG ===');
      console.log('Query:', messageContent);
      console.log('Detected location:', newContext.location);
      console.log('Needs hotel search:', queryIntent.requiresHotelData);
      console.log('========================');

      let relevantHotels: any[] = [];
      const needsHotelSearch = queryIntent.requiresHotelData;
      
      if (needsHotelSearch || queryIntent.intent === 'local_sponsored_hotels' || queryIntent.intent === 'real_time_availability') {
        console.log('🔍 Enhanced hotel search triggered for:', messageContent);
        
        const parsedDates = parseNaturalDates(messageContent);
        console.log('📅 Parsed dates:', parsedDates);
        
        const searchPreferences = {
          location: newContext.location,
          amenities: newContext.interests?.join(','),
          hotelName: messageContent.toLowerCase().includes('villa') ? 'villa' : undefined,
          budget: newContext.budget,
          travelers: newContext.travelers,
          adults: 2,
          children: 0,
          ...parsedDates
        };
        
        console.log('🎯 Enhanced search preferences:', searchPreferences);
        relevantHotels = await searchHotelsWithAvailability(messageContent, searchPreferences);
        console.log('🏨 Found hotels for AI context:', relevantHotels.length);
        
        if (relevantHotels.length === 0) {
          console.log('🎯 No hotels found from search, using sample data for testing...');
          relevantHotels = [
            {
              id: 'sample-1',
              name: 'Villa Olivia Clara',
              location: 'Kamares, Sifnos',
              price_per_night: 180,
              rating: 4.8,
              source: 'local',
              image_url: '/uploads/hotels/villa-olivia-clara/feature-image.jpeg',
              amenities: ['Infinity Pool', 'Sea View', 'WiFi', 'Air Conditioning'],
              description: 'Luxury clifftop villa with breathtaking sunset views and infinity pool',
              availability: {
                checkIn: parsedDates.checkInDate,
                checkOut: parsedDates.checkOutDate,
                available: true
              }
            },
            {
              id: 'sample-2', 
              name: 'ALK Hotel Sifnos',
              location: 'Apollonia, Sifnos',
              price_per_night: 95,
              rating: 4.6,
              source: 'local',
              image_url: '/uploads/hotels/alk-hotel-sifnos/alk-hotel-feature.jpeg',
              amenities: ['Panoramic Views', 'WiFi', 'Breakfast', 'Parking'],
              description: 'Modern boutique hotel in the heart of Apollonia with panoramic island views',
              availability: {
                checkIn: parsedDates.checkInDate,
                checkOut: parsedDates.checkOutDate,
                available: true
              }
            }
          ];
          console.log('🏨 Using fallback sample hotels:', relevantHotels.length);
        }
        
        const hotelSummary = relevantHotels.map(hotel => ({
          name: hotel.name,
          location: hotel.location,
          price: hotel.price_per_night || hotel.daily_rate || hotel.price,
          rating: hotel.rating || hotel.review_score,
          source: hotel.source,
          available: !!parsedDates.checkInDate,
          checkIn: parsedDates.checkInDate,
          checkOut: parsedDates.checkOutDate
        }));
        
        console.log('📊 Hotel summary for AI:', hotelSummary);
      }

      const aiMessage: AIMessage = {
        id: `ai-${Date.now()}`,
        type: 'bot',
        content: '',
        timestamp: new Date(),
        hotels: relevantHotels
      };

      setMessages(prev => [...prev, aiMessage]);

      const enhancedPreferences = {
        ...extractUserPreferencesFromMessage(messageContent),
        
        queryIntent: queryIntent.intent,
        routingStrategy: routingStrategy.strategy,
        routingSources: routingStrategy.sources,
        confidence: queryIntent.confidence,
        
        availableHotels: relevantHotels?.length > 0 ? relevantHotels.slice(0, 10).map(hotel => ({
          name: hotel.name,
          location: hotel.location,
          price: hotel.price_per_night || hotel.daily_rate || hotel.price,
          rating: hotel.rating || hotel.review_score,
          amenities: hotel.amenities,
          description: hotel.description,
          source: hotel.source,
          availability: hotel.availability
        })) : undefined,
        
        hasRealTimeData: queryIntent.requiresRealTimeData && !!relevantHotels?.length,
        hasLocalHotels: routingStrategy.sources.includes('local_hotels'),
        usesAgodaAPI: routingStrategy.sources.includes('agoda'),
        hasLocalContent: queryIntent.requiresLocalContent,
        
        searchQuery: messageContent,
        parsedDates: parseNaturalDates(messageContent),
        entities: queryIntent.entities,
        
        intelligenceMode: `INTELLIGENT_ROUTING_${queryIntent.intent.toUpperCase()}`
      };

      console.log('🌟 EXECUTING WORLD\'S MOST INTELLIGENT TRAVEL AI:', {
        intent: queryIntent.intent,
        strategy: routingStrategy.strategy,
        sources: routingStrategy.sources,
        confidence: queryIntent.confidence,
        hotelsFound: relevantHotels?.length || 0,
        hasRealTime: queryIntent.requiresRealTimeData,
        hasLocalData: queryIntent.requiresLocalContent,
        intelligenceMode: enhancedPreferences.intelligenceMode
      });
      
      const responseStream = await callTouristasAI(
        previousMessages,
        enhancedPreferences,
        conversationContext
      );

      if (!responseStream) {
        console.error('No response stream received from AI service');
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMessage.id 
              ? { 
                  ...msg, 
                  content: `I apologize, but I'm experiencing technical difficulties with the AI service. 

**Date Intelligence Working**: I successfully parsed "${messageContent}" and ${parsedDates.checkInDate ? `found dates: ${parsedDates.checkInDate} to ${parsedDates.checkOutDate}` : 'no specific dates found'}.

**Hotel Search**: ${relevantHotels.length > 0 ? `Found ${relevantHotels.length} matching hotels` : 'No hotels found for this query'}.

**Issue**: The AI language model service is currently unavailable. This could be due to:
- Missing API key configuration 
- Network connectivity issues
- Service maintenance

Please try again in a few moments or contact support if the issue persists.`
                  } 
                : msg
          )
        );
        setIsLoading(false);
        return;
      }

      const reader = responseStream.getReader();
      let fullResponse = await processStreamingResponse(reader, aiMessage.id, setMessages);
      
      const shouldShowHotels = fullResponse.includes('Here are the available hotels for your dates:') || 
                              fullResponse.includes('Here are hotel options that match your preferences:') ||
                              fullResponse.includes('available hotels') ||
                              (relevantHotels.length > 0 && needsHotelSearch);
      
      if (relevantHotels.length > 0) {
        console.log('🎯 Displaying hotel cards - found', relevantHotels.length, 'hotels');
        
        const formattedHotels = relevantHotels.slice(0, 6).map(hotel => ({
          id: hotel.id?.toString() || Math.random().toString(),
          name: hotel.name,
          location: hotel.location || 'Sifnos, Greece',
          price: hotel.price_per_night || hotel.daily_rate || hotel.price || 0,
          rating: hotel.rating || hotel.review_score || 4.0,
          image: hotel.image_url || '/placeholder.svg',
          amenities: hotel.amenities || hotel.hotel_amenities?.map((a: any) => a.amenity) || ['WiFi', 'Sea View'],
          source: hotel.source || 'local',
          description: hotel.description || 'Beautiful accommodation in Sifnos',
          bestFor: ['travelers'],
          bookingUrl: hotel.landing_url || hotel.booking_url || '#'
        }));
        
        console.log('🏨 Formatted hotels for display:', formattedHotels.map(h => h.name));
        
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMessage.id 
              ? { 
                  ...msg, 
                  hotels: formattedHotels,
                  suggestions: [
                    'Tell me more about these hotels',
                    'Show me hotels in a different area',
                    'What activities are nearby?',
                    'Help me choose the best option'
                  ]
                } 
              : msg
          )
        );
      } else {
        console.log('⚠️ No hotels to display');
      }

      if (!isLoading) {
        scrollToBottom();
      }

    } catch (error) {
      console.error('Enhanced error in message handling:', error);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === `ai-${Date.now()}` 
            ? { 
                ...msg, 
                content: `System Error: ${error.message}

**Debugging Information:**
- Date parsing: ${JSON.stringify(parseNaturalDates(messageContent))}
- Context extraction: Working
- Hotel search: ${relevantHotels?.length || 0} results

Please refresh the page and try again. If the problem persists, contact support.`
              } 
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log('📝 Form submitted, current input:', input);
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] min-h-[600px] rounded-xl overflow-hidden border-2 shadow-2xl" style={{ backgroundColor: 'rgba(227, 215, 195, 0.02)', borderColor: 'rgba(30, 46, 72, 0.15)' }}>
      <div className="p-4 text-white" style={{ background: 'linear-gradient(135deg, #1E2E48 0%, #2a3c5a 100%)' }}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-10 h-10 border-2 border-white/20">
              <AvatarImage src="/uploads/touristas-ai-logo.svg" alt="TouristasAI" />
              <AvatarFallback className="bg-white/20">
                <Bot className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h3 className="font-semibold">Touristas AI</h3>
            <p className="text-xs text-white/80">Your intelligent Sifnos travel companion</p>
          </div>
          <div className="ml-auto">
            <Sparkles className="h-5 w-5" style={{ color: '#FFD700' }} />
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6">
          {showQuickPrompts && messages.length === 1 && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">Try these popular requests:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {QUICK_PROMPTS.map((prompt) => (
                  <Button
                    key={prompt.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickPrompt(prompt)}
                    className="text-left justify-start h-auto p-3 text-sm border-dashed hover:opacity-80"
                    style={{ 
                      borderColor: '#1E2E48',
                      color: '#1E2E48',
                      backgroundColor: 'rgba(227, 215, 195, 0.1)'
                    }}
                  >
                    {prompt.text}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className="flex gap-3">
              <Avatar className="w-8 h-8 mt-1 flex-shrink-0">
                {message.type === 'user' ? (
                  <AvatarFallback className="text-white" style={{ backgroundColor: '#1E2E48' }}>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                ) : (
                  <>
                    <AvatarImage src="/uploads/touristas-ai-logo.svg" alt="TouristasAI" />
                    <AvatarFallback className="text-white" style={{ backgroundColor: '#1E2E48' }}>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className={`p-4 rounded-2xl max-w-[85%] ${
                  message.type === 'user' 
                    ? 'text-white ml-auto' 
                    : 'bg-white shadow-md border border-gray-100'
                }`} style={message.type === 'user' ? { 
                  background: 'linear-gradient(135deg, #1E2E48 0%, #2a3c5a 100%)',
                  color: '#E3D7C3'
                } : { color: '#1E2E48' }}>
                  {message.isTyping ? (
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200"></div>
                      </div>
                      <span className="text-sm text-gray-500">TouristasAI is thinking...</span>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap break-words">
                      {message.content}
                    </div>
                  )}
                </div>

                {message.hotelBundle && (
                  <Card className="mt-4 bg-gradient-to-br from-purple-100 to-pink-100 border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-purple-800">🎁 {message.hotelBundle.name}</h4>
                        <Badge className="bg-green-100 text-green-800">Save €{message.hotelBundle.savings}</Badge>
                      </div>
                      <p className="text-sm text-purple-700 mb-3">{message.hotelBundle.occasion}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                        {message.hotelBundle.hotels.map((hotel) => (
                          <div key={hotel.id} className="bg-white/80 rounded-lg p-2 text-xs">
                            <div className="font-medium">{hotel.name}</div>
                            <div className="text-gray-600">€{hotel.price}/night</div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-purple-800">
                          Total: €{message.hotelBundle.totalPrice}
                        </div>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          Book Package
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {message.hotels && message.hotels.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {message.hotels.map((hotel) => (
                      <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <div className="relative">
                          <img 
                            src={hotel.image} 
                            alt={hotel.name}
                            className="w-full h-32 object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge className={hotel.source === 'agoda' ? 'bg-blue-500' : 'bg-green-500'}>
                              {hotel.source === 'agoda' ? 'Partner' : 'Local'}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <h5 className="font-semibold text-sm mb-1">{hotel.name}</h5>
                          <p className="text-xs text-gray-600 mb-2">{hotel.location}</p>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1">
                              {Array(5).fill(0).map((_, i) => (
                                <div 
                                  key={i} 
                                  className={`w-3 h-3 ${i < hotel.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                >⭐</div>
                              ))}
                            </div>
                            <div className="text-sm font-bold" style={{ color: '#1E2E48' }}>
                              €{hotel.price}/night
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                          <Button 
                            size="sm" 
                            className="w-full text-white hover:opacity-90"
                            style={{ backgroundColor: '#1E2E48' }}
                            onClick={() => hotel.bookingUrl && window.open(hotel.bookingUrl, '_blank')}
                          >
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">You might also want to know:</p>
                    <div className="flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-xs border hover:opacity-80"
                          style={{ 
                            backgroundColor: 'rgba(227, 215, 195, 0.1)',
                            borderColor: '#1E2E48',
                            color: '#1E2E48'
                          }}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t border-gray-200 p-4 bg-white/90 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about hotels, get recommendations, or plan your Sifnos adventure..."
            className="flex-1 border-gray-300 rounded-full pl-4"
            style={{ 
              '--tw-ring-color': '#1E2E48'
            } as React.CSSProperties}
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()} 
            className="text-white hover:opacity-90 rounded-full w-12 h-12 p-0 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #1E2E48 0%, #2a3c5a 100%)' }}
          >
            {isLoading ? 
              <Loader2 className="h-5 w-5 animate-spin" /> : 
              <Send className="h-5 w-5" />
            }
          </Button>
        </form>
      </div>
    </div>
  );
}
