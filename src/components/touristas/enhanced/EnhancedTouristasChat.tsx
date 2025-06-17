
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
import { searchUnifiedHotels } from '@/services/hotelSearch';
import { callTouristasAI, processStreamingResponse } from '../services/ChatService';

const QUICK_PROMPTS: QuickPrompt[] = [
  { id: '1', text: 'Find romantic hotels in Platis Gialos', category: 'location', keywords: ['romantic', 'platis gialos'] },
  { id: '2', text: 'Budget-friendly options in Apollonia', category: 'budget', keywords: ['budget', 'apollonia'] },
  { id: '3', text: 'Family hotels with pool near beaches', category: 'amenity', keywords: ['family', 'pool', 'beach'] },
  { id: '4', text: 'Luxury villas for honeymoon', category: 'occasion', keywords: ['luxury', 'villa', 'honeymoon'] },
  { id: '5', text: 'Hotels available for next weekend', category: 'location', keywords: ['available', 'weekend'] },
];

export default function EnhancedTouristasChat() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome',
      type: 'bot',
      content: 'Γεια σου! ✨ I\'m your enhanced Sifnos travel assistant. I can help you find the perfect accommodation, create personalized hotel packages, and provide insider tips for your stay in beautiful Sifnos!',
      timestamp: new Date(),
      suggestions: [
        'Show me luxury hotels',
        'Budget options near beaches',
        'Hotels with pools',
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const extractContextFromMessage = (message: string): MessageContext => {
    const lowerMessage = message.toLowerCase();
    const context: MessageContext = { topic: 'general' };

    // Extract location
    const locations = ['platis gialos', 'apollonia', 'kamares', 'kastro', 'artemonas', 'vathi', 'faros', 'chrysopigi'];
    const foundLocation = locations.find(loc => lowerMessage.includes(loc));
    if (foundLocation) context.location = foundLocation;

    // Extract budget hints
    if (lowerMessage.includes('budget') || lowerMessage.includes('cheap') || lowerMessage.includes('affordable')) {
      context.budget = 'budget';
    } else if (lowerMessage.includes('luxury') || lowerMessage.includes('premium') || lowerMessage.includes('expensive')) {
      context.budget = 'luxury';
    }

    // Extract traveler type
    if (lowerMessage.includes('family') || lowerMessage.includes('kids') || lowerMessage.includes('children')) {
      context.travelers = 'family';
    } else if (lowerMessage.includes('couple') || lowerMessage.includes('romantic') || lowerMessage.includes('honeymoon')) {
      context.travelers = 'couple';
    } else if (lowerMessage.includes('solo') || lowerMessage.includes('alone')) {
      context.travelers = 'solo';
    }

    // Extract interests/amenities
    const amenities = ['pool', 'spa', 'beach', 'wifi', 'breakfast', 'parking', 'restaurant', 'bar'];
    context.interests = amenities.filter(amenity => lowerMessage.includes(amenity));

    // Determine topic
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
    const savings = Math.round(averagePrice * 0.15 * hotels.length); // 15% bundle discount

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
    setShowQuickPrompts(false);
    handleSendMessage(prompt.text);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleSendMessage = async (messageText?: string) => {
    const messageContent = messageText || input.trim();
    if (!messageContent) return;

    // Add user message
    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: messageContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setShowQuickPrompts(false);

    // Extract context from user message
    const newContext = extractContextFromMessage(messageContent);
    setUserContext(prev => ({ ...prev, ...newContext }));

    // Show typing indicator
    setIsTyping(true);
    const typingMessage: AIMessage = {
      id: 'typing',
      type: 'bot',
      content: '',
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);

    // Natural delay for AI response
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    try {
      setIsLoading(true);
      setIsTyping(false);

      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));

      // Search for hotels if it's accommodation related
      let relevantHotels: any[] = [];
      if (newContext.topic === 'accommodation' || messageContent.toLowerCase().includes('hotel')) {
        const searchParams = {
          location: newContext.location,
          amenities: newContext.interests?.join(','),
          hotelName: messageContent.toLowerCase().includes('villa') ? 'villa' : undefined
        };
        
        relevantHotels = await searchUnifiedHotels(messageContent, searchParams);
      }

      // Prepare AI messages
      const aiMessages = messages
        .filter(msg => msg.id !== 'typing')
        .map(msg => ({
          role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content,
          id: msg.id
        }));

      aiMessages.push({
        role: 'user',
        content: messageContent,
        id: userMessage.id
      });

      // Get AI response
      const response = await callTouristasAI(aiMessages, newContext);
      
      if (!response) {
        throw new Error("Failed to get AI response");
      }

      // Create assistant message
      const assistantId = (Date.now() + 1).toString();
      const assistantMessage: AIMessage = {
        id: assistantId,
        type: 'bot',
        content: '',
        timestamp: new Date(),
        context: newContext
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Process streaming response
      const reader = response.getReader();
      const fullContent = await processStreamingResponse(reader, assistantId, (updatedMessages) => {
        setMessages(updatedMessages as AIMessage[]);
      });

      // Add hotels and bundle if found
      if (relevantHotels.length > 0) {
        const hotelBundle = createHotelBundle(relevantHotels, newContext);
        const smartSuggestions = generateSmartSuggestions(newContext);

        setMessages(prev => 
          prev.map(msg => 
            msg.id === assistantId 
              ? { 
                  ...msg, 
                  hotels: relevantHotels.slice(0, 6).map(hotel => ({
                    id: hotel.id,
                    name: hotel.name,
                    location: hotel.location,
                    price: hotel.price || hotel.daily_rate || 0,
                    rating: hotel.rating || hotel.review_score || 4,
                    image: hotel.image_url || hotel.hotel_photos?.[0]?.photo_url || '/placeholder.svg',
                    amenities: hotel.hotel_amenities?.map((a: any) => a.amenity) || ['WiFi'],
                    source: hotel.source || 'local',
                    description: hotel.description || 'Beautiful accommodation',
                    bestFor: ['travelers'],
                    bookingUrl: hotel.landing_url || hotel.booking_url
                  })),
                  hotelBundle,
                  suggestions: smartSuggestions
                } 
              : msg
          )
        );
      } else {
        // Add suggestions even without hotels
        const smartSuggestions = generateSmartSuggestions(newContext);
        setMessages(prev => 
          prev.map(msg => 
            msg.id === assistantId 
              ? { ...msg, suggestions: smartSuggestions }
              : msg
          )
        );
      }

      scrollToBottom();

    } catch (error) {
      console.error('Error in enhanced chat:', error);
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      
      const errorMessage: AIMessage = {
        id: Date.now().toString(),
        type: 'bot',
        content: 'Apologies, I encountered an issue. Please try asking again!',
        timestamp: new Date(),
        suggestions: ['Try a different question', 'Ask about specific locations', 'Search for hotels']
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: 'Error',
        description: 'Failed to get AI response. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] min-h-[600px] rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 border border-gray-200 shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-sifnos-deep-blue to-sifnos-turquoise p-4 text-white">
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
            <h3 className="font-semibold">TouristasAI Enhanced</h3>
            <p className="text-xs text-white/80">Your intelligent Sifnos travel companion</p>
          </div>
          <div className="ml-auto">
            <Sparkles className="h-5 w-5 text-yellow-300" />
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6">
          {/* Quick Prompts - only show if no messages yet */}
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
                    className="text-left justify-start h-auto p-3 text-sm border-dashed hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50"
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
                  <AvatarFallback className="bg-sifnos-deep-blue text-white">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                ) : (
                  <>
                    <AvatarImage src="/uploads/touristas-ai-logo.svg" alt="TouristasAI" />
                    <AvatarFallback className="bg-sifnos-turquoise text-white">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
              
              <div className="flex-1 min-w-0">
                {/* Message Content */}
                <div className={`p-4 rounded-2xl max-w-[85%] ${
                  message.type === 'user' 
                    ? 'bg-gradient-to-r from-sifnos-deep-blue to-purple-600 text-white ml-auto' 
                    : 'bg-white shadow-md text-gray-900 border border-gray-100'
                }`}>
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

                {/* Hotel Bundle */}
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

                {/* Individual Hotels */}
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
                            <div className="text-sm font-bold text-sifnos-deep-blue">
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
                            className="w-full bg-sifnos-deep-blue hover:bg-sifnos-deep-blue/90"
                            onClick={() => hotel.bookingUrl && window.open(hotel.bookingUrl, '_blank')}
                          >
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Smart Suggestions */}
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
                          className="text-xs bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-purple-200"
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

      {/* Input Form */}
      <div className="border-t border-gray-200 p-4 bg-white/90 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about hotels, get recommendations, or plan your Sifnos adventure..."
            className="flex-1 border-gray-300 focus-visible:ring-sifnos-deep-blue rounded-full pl-4"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()} 
            className="bg-gradient-to-r from-sifnos-deep-blue to-purple-600 hover:from-sifnos-deep-blue/90 hover:to-purple-700 rounded-full w-12 h-12 p-0 flex items-center justify-center"
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
