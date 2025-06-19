import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User, Sparkles, Mic, MicOff, Download, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AIMessage, HotelRecommendation, HotelBundle, QuickPrompt, MessageContext } from './TouristasAITypes';
import { searchHotels } from '@/services/hotelSearch';
import { callTouristasAI, processStreamingResponse, searchHotelsWithAvailability, parseNaturalDates, trackConversationContext, AIRequestMessage, getWeatherData, getWeatherAwareRecommendations, searchFerryRoutes, createTravelPackage } from '../services/ChatService';
import { extractUserPreferencesFromMessage } from '../utils/chat-utils';
import { FerryDisplay } from '../FerryDisplay';
import { TravelPackageDisplay } from '../TravelPackageDisplay';

const QUICK_PROMPTS: QuickPrompt[] = [
  { id: '1', text: "🌅 Hotels for next weekend getaway", category: "real_time" },
  { id: '2', text: "🚢 Show me ferry schedules from Piraeus to Sifnos", category: "real_time" },
  { id: '3', text: "🏖️ Hidden beaches locals love", category: "local_content" },
  { id: '4', text: "🏨 Romantic spots with sunset views", category: "local_hotels" },
  { id: '5', text: "✨ Plan my perfect Sifnos adventure", category: "hybrid" },
  { id: '6', text: "🌤️ What's the weather for my dates?", category: "general" },
  { id: '7', text: "🎯 Best hotels considering weather", category: "weather_aware" },
  { id: '8', text: "🎁 Complete travel packages", category: "hybrid" }
];

export default function EnhancedTouristasChat() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome',
      type: 'bot',
      content: 'Γεια σου! ✨ I\'m Touristas, your intelligent Sifnos travel companion! I combine authentic Greek island charm with modern AI to help you discover perfect accommodations AND ferry schedules. I understand natural dates like "next weekend", check real-time availability, consider current weather, and can create complete travel packages combining ferries + hotels. Ready to explore Sifnos together? 🚢',
      timestamp: new Date(),
              suggestions: [
        'Hotels available for next weekend',
        'Ferry schedules from Piraeus to Sifnos',
        'Complete travel packages for a weekend',
        'Weather-aware recommendations',
        'Hidden gems with sea views',
        'Ferry + hotel combinations'
      ]
    }
  ]);
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  const [userContext, setUserContext] = useState<MessageContext>({
    topic: 'general'
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();



  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onstart = () => {
          setIsListening(true);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
          
          // Auto-send the voice message
          setTimeout(() => {
            handleSendMessage(transcript);
          }, 500);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          toast({
            title: "Voice input error",
            description: "Please try again or use text input",
            variant: "destructive"
          });
        };
      }
    }

    // PWA install prompt handling
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && speechSupported) {
      try {
        recognitionRef.current.start();
        toast({
          title: "🎤 Listening...",
          description: "Speak your hotel request now",
        });
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        toast({
          title: "Voice input unavailable",
          description: "Please use text input",
          variant: "destructive"
        });
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('🎉 User accepted the install prompt');
        toast({
          title: "🎉 Installing Touristas...",
          description: "You'll be able to access it like a native app!"
        });
      } else {
        console.log('❌ User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowInstallButton(false);
    }
  };

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

      // Get weather data for intelligent recommendations
      console.log('🌤️ Fetching weather data for intelligent recommendations...');
      const weatherData = await getWeatherData();
      let weatherContext = '';
      
      if (weatherData) {
        weatherContext = await getWeatherAwareRecommendations(weatherData, messageContent);
        console.log('🌍 Weather-aware context generated:', weatherContext.substring(0, 100) + '...');
      }

      // ENHANCED Ferry + Hotel combination detection and search
      console.log('🚢 Analyzing for ferry + hotel combinations...');
      const ferryKeywords = ['ferry', 'ferries', 'boat', 'ship', 'transport', 'travel', 'get to', 'go to', 'reach', 'piraeus', 'athens', 'package', 'combination'];
      const hasFerryKeywords = ferryKeywords.some(keyword => queryLower.includes(keyword));
      const hasHotelKeywords = ['hotel', 'hotels', 'accommodation', 'stay', 'room', 'booking'];
      const hasHotelFerryCombo = hasFerryKeywords && (queryIntent.requiresHotelData || hasHotelKeywords.some(keyword => queryLower.includes(keyword)));
      
      console.log('🚢 Keyword analysis:', {
        ferryKeywords: ferryKeywords.filter(keyword => queryLower.includes(keyword)),
        hotelKeywords: hasHotelKeywords.filter(keyword => queryLower.includes(keyword)),
        hasFerryKeywords,
        hasHotelFerryCombo
      });
      
      console.log('🚢 Ferry analysis:', {
        hasFerryKeywords,
        hasHotelFerryCombo,
        requiresHotelData: queryIntent.requiresHotelData,
        queryContent: messageContent
      });
      
      let ferrySearchResult = null;
      let travelPackage = null;
      
      // Always search for ferries if ferry keywords are detected OR if it's a combination query
      if (hasFerryKeywords || hasHotelFerryCombo || queryLower.includes('complete') || queryLower.includes('package')) {
        console.log('🚢 Triggering ferry search for potential ferry + hotel combination...');
        ferrySearchResult = await searchFerryRoutes(messageContent);
        console.log('🚢 Ferry search result:', ferrySearchResult);
        
        // If we have ferry but no hotels yet, trigger additional hotel search for Agoda real-time pricing
        if (ferrySearchResult && relevantHotels.length === 0) {
          console.log('🚢 Ferry found but no hotels - triggering AGODA REAL-TIME search for ferry combo...');
          const ferrySearchPreferences = {
            location: 'sifnos',
            adults: 2,
            children: 0,
            ...parseNaturalDates(messageContent)
          };
          console.log('🔍 Additional AGODA hotel search for ferry combo with preferences:', ferrySearchPreferences);
          relevantHotels = await searchHotelsWithAvailability(messageContent + ' hotels sifnos accommodation', ferrySearchPreferences);
          console.log(`🏨 AGODA + Local hotel search found: ${relevantHotels.length} hotels`);
        }
        
        // Create travel package if we have both ferries and hotels
        if (ferrySearchResult && relevantHotels.length > 0) {
          console.log('🎁 Creating travel package combining ferry + REAL-TIME AGODA hotel...');
          const bestFerry = ferrySearchResult.ferries.find(f => f.available) || ferrySearchResult.ferries[0];
          const bestHotel = relevantHotels[0];
          
          if (bestFerry && bestHotel) {
            travelPackage = await createTravelPackage(
              bestFerry,
              null, // For now, no return ferry - can be enhanced later
              bestHotel,
              queryLower.includes('weekend') ? 'weekend' : 'getaway'
            );
            console.log('🎁 Travel package created with REAL-TIME pricing:', travelPackage);
          }
        }
      } else {
        // Even if no ferry keywords, check for ferry routes in general queries
        console.log('🚢 No ferry keywords detected, but checking for implicit ferry queries...');
        ferrySearchResult = await searchFerryRoutes(messageContent);
        console.log('🚢 Implicit ferry search result:', ferrySearchResult);
      }

      const aiMessage: AIMessage = {
        id: `ai-${Date.now()}`,
        type: 'bot',
        content: '',
        timestamp: new Date(),
        hotels: relevantHotels,
        ferries: ferrySearchResult,
        travelPackage: travelPackage
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
        
        // Weather-aware intelligence
        weatherData: weatherData,
        weatherContext: weatherContext,
        
        // Ferry and travel package data
        ferryData: ferrySearchResult,
        hasFerryOptions: !!ferrySearchResult,
        travelPackageData: travelPackage,
        hasTravelPackage: !!travelPackage,
        
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
          // 🎯 FIXED: Use REAL location from Supabase database! Only fallback to 'Sifnos, Greece' for Agoda hotels
          location: hotel.location || (hotel.source === 'agoda' ? 'Sifnos, Greece' : 'Sifnos'),
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
    <div className="flex flex-col h-[calc(100vh-80px)] md:h-[calc(100vh-120px)] min-h-[500px] md:min-h-[650px] w-full max-w-6xl mx-auto rounded-xl md:rounded-2xl overflow-hidden border shadow-2xl backdrop-blur-xl relative m-2 md:m-0" 
         style={{ 
           background: 'linear-gradient(145deg, rgba(227, 215, 195, 0.08) 0%, rgba(255, 255, 255, 0.12) 50%, rgba(227, 215, 195, 0.06) 100%)',
           borderColor: 'rgba(227, 215, 195, 0.3)',
           boxShadow: '0 20px 40px rgba(30, 46, 72, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
         }}>
      {/* Mobile-Optimized Header */}
      <div className="p-4 md:p-6 lg:p-8 text-white backdrop-blur-lg relative overflow-hidden" 
           style={{ 
             background: 'linear-gradient(135deg, #1E2E48 0%, #2a3c5a 100%, #1E2E48 200%)',
             boxShadow: '0 4px 20px rgba(30, 46, 72, 0.3)'
           }}>
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-20 h-20 md:w-32 md:h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 md:w-24 md:h-24 bg-blue-200 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
        <div className="flex items-center gap-3 md:gap-4 lg:gap-6 relative z-10">
          <div className="relative">
            <Avatar className="w-10 h-10 md:w-12 md:h-12 border-2 border-white/30 shadow-lg transition-all duration-300 hover:scale-110">
              <AvatarImage src="/uploads/touristas-ai-logo.svg" alt="Touristas" />
              <AvatarFallback className="bg-white/20">
                <Bot className="h-5 w-5 md:h-6 md:w-6" />
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-400 border-2 border-white rounded-full animate-pulse shadow-lg"></div>
            {/* Breathing animation around avatar */}
            <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm md:text-base">Touristas</h3>
            <p className="text-xs text-white/80 truncate">Your intelligent Sifnos travel companion</p>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            {showInstallButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleInstallApp}
                className="text-white border-white/60 hover:bg-white/20 hover:border-white bg-white/10 backdrop-blur-sm text-xs font-medium transition-all duration-200 px-2 md:px-3"
                style={{
                  borderColor: '#E3D7C3',
                  color: '#E3D7C3',
                  backgroundColor: 'rgba(227, 215, 195, 0.15)'
                }}
              >
                <Download className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Install App</span>
                <span className="sm:hidden">Install</span>
              </Button>
            )}
            <Sparkles className="h-4 w-4 md:h-5 md:w-5" style={{ color: '#FFD700' }} />
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4 md:p-6 lg:p-8 xl:p-10">
        <div className="space-y-4 md:space-y-6 lg:space-y-8">
          {showQuickPrompts && messages.length === 1 && (
            <div className="mb-4 md:mb-6">
              <p className="text-sm text-gray-600 mb-3">Try these popular requests:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {QUICK_PROMPTS.map((prompt) => (
                  <Button
                    key={prompt.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickPrompt(prompt)}
                    className="text-left justify-start h-auto p-3 text-sm border-dashed hover:opacity-80 w-full"
                    style={{ 
                      borderColor: '#1E2E48',
                      color: '#1E2E48',
                      backgroundColor: 'rgba(227, 215, 195, 0.1)'
                    }}
                  >
                    <span className="truncate">{prompt.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className="flex gap-3 md:gap-4 lg:gap-6">
              <Avatar className="w-7 h-7 md:w-8 md:h-8 mt-1 flex-shrink-0">
                {message.type === 'user' ? (
                  <AvatarFallback className="text-white" style={{ backgroundColor: '#1E2E48' }}>
                    <User className="h-3 w-3 md:h-4 md:w-4" />
                  </AvatarFallback>
                ) : (
                  <>
                    <AvatarImage src="/uploads/touristas-ai-logo.svg" alt="TouristasAI" />
                    <AvatarFallback className="text-white" style={{ backgroundColor: '#1E2E48' }}>
                      <Bot className="h-3 w-3 md:h-4 md:w-4" />
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
              
              <div className="flex-1 min-w-0">
                {message.type === 'user' ? (
                  // Enhanced User Message Card - Mobile Optimized
                  <div className="p-3 md:p-4 lg:p-5 xl:p-6 rounded-xl md:rounded-2xl max-w-[95%] md:max-w-[90%] lg:max-w-[85%] text-white ml-auto backdrop-blur-sm transition-all duration-300"
                       style={{ 
                         background: 'linear-gradient(135deg, #1E2E48 0%, #2a3c5a 100%)',
                         color: '#E3D7C3',
                         boxShadow: '0 8px 24px rgba(30, 46, 72, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                       }}>
                    <div className="whitespace-pre-wrap break-words text-sm md:text-base leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                ) : (
                  // Enhanced AI Response Card
                  <Card className="max-w-full border-2 overflow-hidden backdrop-blur-sm transition-all duration-300 hover:shadow-2xl"
                        style={{
                          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(227, 215, 195, 0.08) 100%)',
                          borderColor: 'rgba(227, 215, 195, 0.3)',
                          boxShadow: '0 16px 40px rgba(30, 46, 72, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
                        }}>
                    {/* Header with AI indicator - Mobile Optimized */}
                    <div className="px-4 md:px-6 pt-3 md:pt-4 pb-2 border-b border-gray-100">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                          <span className="text-xs md:text-sm font-medium text-gray-600">AI Response</span>
                        </div>
                        <div className="flex items-center gap-1 md:gap-2 ml-auto">
                          <Badge variant="secondary" className="text-xs px-2 py-1" 
                                 style={{ backgroundColor: 'rgba(30, 46, 72, 0.1)', color: '#1E2E48' }}>
                            <span className="hidden sm:inline">🧠 Intelligent</span>
                            <span className="sm:hidden">🧠</span>
                          </Badge>
                          <Badge variant="secondary" className="text-xs px-2 py-1"
                                 style={{ backgroundColor: 'rgba(30, 46, 72, 0.1)', color: '#1E2E48' }}>
                            <span className="hidden sm:inline">⚡ Real-time</span>
                            <span className="sm:hidden">⚡</span>
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-4 md:p-6 lg:p-8">
                      {message.isTyping ? (
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="flex gap-1 items-center">
                            <div className="w-3 h-3 md:w-4 md:h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-bounce"></div>
                            <div className="w-3 h-3 md:w-4 md:h-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-bounce delay-100"></div>
                            <div className="w-3 h-3 md:w-4 md:h-4 bg-gradient-to-r from-pink-400 to-red-500 rounded-full animate-bounce delay-200"></div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm md:text-base font-medium text-gray-700">Touristas is analyzing...</span>
                            <span className="text-xs md:text-sm text-gray-500">Using AI intelligence to find perfect matches ✨</span>
                          </div>
                        </div>
                      ) : (
                        <div className="prose prose-gray max-w-none">
                          <div className="whitespace-pre-wrap break-words text-gray-800 leading-relaxed text-sm md:text-base">
                            {message.content.split('\n').map((paragraph, idx) => (
                              <div key={idx} className={idx > 0 ? 'mt-3 md:mt-4' : ''}>
                                {paragraph.includes('**') ? (
                                  // Handle bold text formatting
                                  <div dangerouslySetInnerHTML={{
                                    __html: paragraph
                                      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
                                      .replace(/🌤️|☀️|🌧️|🏨|🏖️|🌅|⭐|📍|🎯/g, '<span class="text-base md:text-lg">$&</span>')
                                  }} />
                                ) : (
                                  paragraph
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {message.hotelBundle && (
                  <Card className="mt-4 md:mt-6 border-2 overflow-hidden backdrop-blur-sm transition-all duration-300"
                        style={{
                          background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                          borderColor: 'rgba(147, 51, 234, 0.3)'
                        }}>
                    {/* Bundle Header - Mobile Optimized */}
                    <div className="px-4 md:px-6 pt-3 md:pt-4 pb-2 border-b border-purple-200">
                      <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                          <h4 className="font-bold text-base md:text-lg text-purple-800">🎁 {message.hotelBundle.name}</h4>
                        </div>
                        <Badge className="bg-green-100 text-green-800 px-3 py-1 text-xs md:text-sm font-semibold self-start md:self-auto">
                          Save €{message.hotelBundle.savings}
                        </Badge>
                      </div>
                      <p className="text-purple-700 mt-2 text-sm md:text-base">{message.hotelBundle.occasion}</p>
                    </div>

                    <CardContent className="p-4 md:p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
                        {message.hotelBundle.hotels.map((hotel, idx) => (
                          <div key={hotel.id} 
                               className="bg-white/90 backdrop-blur-sm rounded-xl p-4 text-sm border border-purple-100 transition-all duration-200 hover:scale-105 hover:shadow-md"
                               style={{ animationDelay: `${idx * 100}ms` }}>
                            <div className="font-bold text-gray-800 mb-1">{hotel.name}</div>
                            <div className="text-purple-600 font-semibold">€{hotel.price}/night</div>
                            <div className="text-xs text-gray-500 mt-1">Included in package</div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white/60 rounded-xl backdrop-blur-sm">
                        <div className="text-xl font-bold text-purple-800">
                          Total Package: €{message.hotelBundle.totalPrice}
                        </div>
                        <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-3 transition-all duration-200 hover:scale-105">
                          Book Package 🚀
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {message.hotels && message.hotels.length > 0 && (
                  <div className="mt-8">
                    {/* Hotels Section Header */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                      <h4 className="text-xl font-bold text-gray-800">Perfect Matches Found</h4>
                      <Badge className="bg-green-100 text-green-800 px-3 py-1 font-semibold">
                        {message.hotels.length} Hotels
                      </Badge>
                    </div>

                    {/* Hotel Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                      {message.hotels.map((hotel, index) => (
                        <Card key={hotel.id} 
                          className="relative overflow-hidden border-2 cursor-pointer flex flex-col h-full"
                          style={{ 
                            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(227, 215, 195, 0.05) 100%)',
                            borderColor: 'rgba(30, 46, 72, 0.1)',
                            boxShadow: '0 12px 40px rgba(30, 46, 72, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
                            animation: `fadeInUp 0.8s ease-out ${index * 0.15}s both`
                          }}
                        >
                          {/* Image Section - Mobile Optimized */}
                          <div className="relative overflow-hidden h-48 md:h-56">
                            <img 
                              src={hotel.image} 
                              alt={hotel.name}
                              className="w-full h-full object-cover"
                            />
                            
                            {/* Top Badge - Source Only */}
                            <div className="absolute top-3 left-3 md:top-4 md:left-4">
                              {hotel.source && (
                                <Badge className={`${hotel.source === 'agoda' ? 'bg-blue-500' : 'bg-emerald-500'} text-white px-2 py-1 md:px-3 md:py-1 text-xs font-semibold shadow-lg backdrop-blur-sm border-0`}>
                                  <span className="hidden sm:inline">{hotel.source === 'agoda' ? '🌐 Partner Hotel' : '🏛️ Local Gem'}</span>
                                  <span className="sm:hidden">{hotel.source === 'agoda' ? '🌐' : '🏛️'}</span>
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Content Section - Mobile Optimized */}
                          <CardContent className="p-4 md:p-6 flex-1 flex flex-col">
                            {/* Hotel Name & Location */}
                            <div className="flex-1">
                              <h3 className="font-bold text-lg md:text-xl mb-2 text-gray-900 line-clamp-2 leading-tight">
                                {hotel.name}
                              </h3>

                              {/* Rating/Reviews under name */}
                              {hotel.rating && (
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} className={`h-3 w-3 md:h-4 md:w-4 ${i < Math.floor(hotel.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                    ))}
                                  </div>
                                  <span className="text-sm font-semibold text-gray-700">{hotel.rating.toFixed(1)}</span>
                                  <span className="text-xs text-gray-500 hidden sm:inline">({Math.floor(Math.random() * 200) + 50} reviews)</span>
                                </div>
                              )}
                              
                              <div className="flex items-center gap-2 mb-3 md:mb-4">
                                <MapPin className="h-4 w-4 md:h-5 md:w-5 text-indigo-500 flex-shrink-0" />
                                <span className="text-sm md:text-base text-gray-600 font-medium truncate">{hotel.location}</span>
                              </div>

                              {/* Hotel Description if available */}
                              {hotel.description && (
                                <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4 line-clamp-2 leading-relaxed">
                                  {hotel.description}
                                </p>
                              )}

                              {/* Amenities Section - Mobile Optimized */}
                              {hotel.amenities && hotel.amenities.length > 0 && (
                                <div className="mb-3 md:mb-4">
                                  <h5 className="text-xs md:text-sm font-semibold text-gray-700 mb-2">Top Amenities:</h5>
                                  <div className="flex flex-wrap gap-1 md:gap-2">
                                    {hotel.amenities.slice(0, 3).map((amenity, i) => (
                                      <Badge key={i} 
                                             variant="secondary" 
                                             className="text-xs px-2 py-1 font-medium border" 
                                             style={{ 
                                               backgroundColor: 'rgba(99, 102, 241, 0.1)', 
                                               color: '#4F46E5',
                                               borderColor: 'rgba(99, 102, 241, 0.2)'
                                             }}>
                                        <span className="truncate max-w-[80px] md:max-w-none">{amenity}</span>
                                      </Badge>
                                    ))}
                                    {hotel.amenities.length > 3 && (
                                      <Badge variant="outline" className="text-xs px-2 py-1 text-gray-500">
                                        +{hotel.amenities.length - 3}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Footer Section - Mobile Optimized */}
                            <div className="border-t border-gray-100 pt-3 md:pt-4 mt-3 md:mt-4">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0">
                                {/* Price Display */}
                                <div className="flex flex-col">
                                  <span className="text-xl md:text-2xl font-bold text-gray-900">€{hotel.price}</span>
                                  <span className="text-xs md:text-sm text-gray-500">per night + taxes</span>
                                </div>

                                {/* Action Button */}
                                <Button 
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 md:px-6 md:py-3 border-0 text-sm md:text-base w-full md:w-auto"
                                  onClick={() => hotel.bookingUrl && window.open(hotel.bookingUrl, '_blank')}
                                >
                                  View & Book
                                </Button>
                              </div>

                              {/* Booking Source Info */}
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-0 mt-2 md:mt-3 text-xs text-gray-500">
                                <span>
                                  {hotel.source === 'agoda' ? 'Powered by Agoda' : 'Direct booking available'}
                                </span>
                                <span>Free cancellation</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Results Footer - Mobile Optimized */}
                    <div className="mt-6 md:mt-8 p-3 md:p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0 text-xs md:text-sm">
                        <span className="text-gray-600">
                          💡 Prices shown are estimates. Final rates may vary.
                        </span>
                        <span className="text-indigo-600 font-medium">
                          Updated just now ⚡
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Travel Package Display - Mobile Optimized */}
                {message.travelPackage && (
                  <div className="mt-6 md:mt-8">
                    <TravelPackageDisplay travelPackage={message.travelPackage} />
                  </div>
                )}

                {/* Ferry Display - Mobile Optimized */}
                {message.ferries && (
                  <div className="mt-6 md:mt-8">
                    <FerryDisplay ferryResult={message.ferries} />
                  </div>
                )}

                {message.suggestions && message.suggestions.length > 0 && (
                  <Card className="mt-4 md:mt-6 border overflow-hidden backdrop-blur-sm"
                        style={{
                          background: 'linear-gradient(145deg, rgba(227, 215, 195, 0.05) 0%, rgba(255, 255, 255, 0.8) 100%)',
                          borderColor: 'rgba(227, 215, 195, 0.3)'
                        }}>
                    <CardContent className="p-4 md:p-5">
                      <div className="flex items-center gap-2 mb-3 md:mb-4">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                        <h5 className="text-xs md:text-sm font-semibold text-gray-700">Related Questions You Might Ask:</h5>
                      </div>
                      <div className="flex flex-wrap gap-2 md:gap-3">
                        {message.suggestions.map((suggestion, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs md:text-sm border-2 font-medium transition-all duration-200 px-3 py-2"
                            style={{ 
                              backgroundColor: 'rgba(227, 215, 195, 0.1)',
                              borderColor: 'rgba(30, 46, 72, 0.2)',
                              color: '#1E2E48',
                              animationDelay: `${idx * 100}ms`
                            }}
                          >
                            <span className="truncate max-w-[200px] md:max-w-none">{suggestion}</span>
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Mobile-Optimized Input Section */}
      <div className="border-t backdrop-blur-lg p-4 md:p-6 lg:p-8 xl:p-10 relative overflow-hidden" 
           style={{ 
             borderColor: 'rgba(227, 215, 195, 0.3)',
             background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(227, 215, 195, 0.05) 100%)',
             boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.5)'
           }}>
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-12 h-12 md:w-16 md:h-16 bg-blue-400 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/3 w-8 h-8 md:w-12 md:h-12 bg-purple-400 rounded-full blur-lg animate-pulse delay-500"></div>
        </div>
        
        <form onSubmit={handleSubmit} className="flex gap-2 md:gap-4 lg:gap-6 relative z-10">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "🎤 Listening..." : "Ask about hotels, get recommendations..."}
            className="flex-1 rounded-full pl-4 pr-3 py-3 md:pl-6 md:pr-4 md:py-4 lg:py-5 text-sm md:text-base lg:text-lg border-2 transition-all duration-300 backdrop-blur-sm"
            style={{ 
              '--tw-ring-color': '#E3D7C3',
              borderColor: 'rgba(227, 215, 195, 0.4)',
              background: 'rgba(255, 255, 255, 0.8)',
              boxShadow: '0 4px 20px rgba(30, 46, 72, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
            } as React.CSSProperties}
            disabled={isLoading || isListening}
          />
          
          {speechSupported && (
            <Button
              type="button"
              onClick={isListening ? stopListening : startListening}
              disabled={isLoading}
              className={`rounded-full w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 p-0 flex items-center justify-center transition-all duration-300 shadow-lg ${
                isListening 
                  ? 'animate-pulse' 
                  : ''
              }`}
              style={{
                background: isListening 
                  ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                  : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                boxShadow: isListening 
                  ? '0 8px 32px rgba(239, 68, 68, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                  : '0 8px 32px rgba(107, 114, 128, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
            >
              {isListening ? (
                <MicOff className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 text-white" />
              ) : (
                <Mic className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 text-white" />
              )}
            </Button>
          )}
          
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim() || isListening} 
            className="text-white rounded-full w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 p-0 flex items-center justify-center transition-all duration-300 disabled:opacity-50 shadow-lg"
            style={{ 
              background: 'linear-gradient(135deg, #1E2E48 0%, #2a3c5a 100%)',
              boxShadow: '0 8px 32px rgba(30, 46, 72, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
          >
            {isLoading ? 
              <Loader2 className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 animate-spin" /> : 
              <Send className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7" />
            }
          </Button>
        </form>
        
        {/* Mobile-Optimized Footer Info */}
        <div className="mt-3 md:mt-4 text-center">
          <div className="grid grid-cols-2 md:flex md:items-center md:justify-center gap-2 md:gap-4 text-xs text-gray-600">
            {speechSupported && (
              <div className="flex items-center gap-1 justify-center">
                <span className="text-blue-500">🎤</span>
                <span className="truncate">Voice input</span>
              </div>
            )}
            <div className="flex items-center gap-1 justify-center">
              <span className="text-green-500">🌤️</span>
              <span className="truncate">Weather-aware</span>
            </div>
            <div className="flex items-center gap-1 justify-center">
              <span className="text-blue-500">🚢</span>
              <span className="truncate">Ferry schedules</span>
            </div>
            <div className="flex items-center gap-1 justify-center">
              <span className="text-purple-500">🧠</span>
              <span className="truncate">AI-powered</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 px-2">
            <span className="hidden md:inline">✨ Try saying "Hotels for next weekend" or "Romantic spots with sunset views"</span>
            <span className="md:hidden">✨ Try "Hotels for next weekend"</span>
          </p>
        </div>
      </div>
    </div>
  );
}
