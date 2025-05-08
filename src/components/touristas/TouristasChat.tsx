import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Send, Loader2, Bot, User, MapPin, Info, X, Hotel, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useMediaQuery } from 'react-responsive';
import { filterHotelsByLocation, getHotelImageUrl, getHotelLogoUrl } from '@/utils/hotel-utils';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';

// Define types for better type safety
type MessageRole = 'user' | 'assistant' | 'system';

type Message = {
  id: string;
  role: MessageRole;
  content: string;
  location?: string;
  hotels?: any[];
  showHotels?: boolean;
};

type HotelDialogProps = {
  hotel: any;
  onClose: () => void;
};

// Separator component
const Separator = () => (
  <div className="flex items-center my-4">
    <div className="h-px bg-gray-200 flex-grow"></div>
    <div className="mx-2 text-xs text-gray-400 font-medium">Touristas AI</div>
    <div className="h-px bg-gray-200 flex-grow"></div>
  </div>
);

// Hotel Carousel Component
const HotelCarousel = ({ hotels }: { hotels: any[] }) => {
  if (!hotels?.length) return null;
  
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {hotels.map((hotel) => (
          <CarouselItem key={hotel.id} className="md:basis-1/2 lg:basis-1/3">
            <HotelCard hotel={hotel} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 bg-white/80 hover:bg-white" />
      <CarouselNext className="right-2 bg-white/80 hover:bg-white" />
    </Carousel>
  );
};

// Hotel info dialog/drawer component
const HotelDialog = ({ hotel, onClose }: HotelDialogProps) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  
  if (isMobile) {
    return (
      <DrawerContent className="h-[85vh]">
        <DrawerHeader className="border-b pb-3">
          <DrawerTitle className="flex justify-between">
            {hotel.name}
            <DrawerClose onClick={onClose}>
              <X className="h-4 w-4" />
            </DrawerClose>
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4 py-4 overflow-y-auto">
          <HotelContent hotel={hotel} />
        </div>
      </DrawerContent>
    );
  }
  
  return (
    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{hotel.name}</DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          {hotel.short_description || `A beautiful stay in ${hotel.location}, Sifnos`}
        </DialogDescription>
      </DialogHeader>
      <HotelContent hotel={hotel} />
    </DialogContent>
  );
};

// Hotel content component (used in both dialog and drawer)
const HotelContent = ({ hotel }: { hotel: any }) => {
  return (
    <div className="space-y-4">
      <div className="w-full h-60 overflow-hidden rounded-lg">
        <img 
          src={getHotelImageUrl(hotel)}
          alt={hotel.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error(`Failed to load image for ${hotel.name}`);
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
      </div>
      
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-full">
          <MapPin className="h-4 w-4 text-sifnos-deep-blue" />
          <span className="text-sm font-medium text-sifnos-deep-blue">{hotel.location}</span>
        </div>
      </div>
      
      {/* Amenities */}
      {hotel.hotel_amenities && hotel.hotel_amenities.length > 0 && (
        <div>
          <h4 className="font-medium mb-2 text-gray-700">Amenities</h4>
          <div className="flex flex-wrap gap-2">
            {hotel.hotel_amenities.map((amenity: any, i: number) => (
              <Badge key={i} variant="outline" className="bg-gray-50">
                {amenity.amenity}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {/* Description */}
      {hotel.description && (
        <div>
          <h4 className="font-medium mb-2 text-gray-700">About</h4>
          <p className="text-sm text-gray-600 leading-relaxed">{hotel.description}</p>
        </div>
      )}
    </div>
  );
};

// Hotel card component
const HotelCard = ({ hotel }: { hotel: any }) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100 mx-1">
      <div className="relative w-full h-40 overflow-hidden bg-gray-100">
        <img 
          src={getHotelImageUrl(hotel)}
          alt={hotel.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            console.error(`Failed to load image for ${hotel.name}`);
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
          loading="eager"
        />
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-white/80 backdrop-blur-sm text-xs">
              {hotel.location}
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="font-semibold text-base truncate">{hotel.name}</h3>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs text-gray-500">{hotel.hotel_types?.join(', ')}</span>
        </div>
      </div>
      
      {isMobile ? (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <Button className="w-full rounded-none bg-sifnos-deep-blue hover:bg-sifnos-deep-blue/90" onClick={() => setIsOpen(true)}>
            View Details
          </Button>
          {isOpen && <HotelDialog hotel={hotel} onClose={() => setIsOpen(false)} />}
        </Drawer>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <Button className="w-full rounded-none bg-sifnos-deep-blue hover:bg-sifnos-deep-blue/90" onClick={() => setIsOpen(true)}>
            View Details
          </Button>
          {isOpen && <HotelDialog hotel={hotel} onClose={() => setIsOpen(false)} />}
        </Dialog>
      )}
    </div>
  );
};

export default function TouristasChat() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Γεια σου! 👋 I\'m your Sifnos travel assistant. Tell me what location in Sifnos you\'re interested in staying - like Platis Gialos, Apollonia, Kamares, or Vathi. Or ask me general questions about Sifnos and its accommodations!',
      showHotels: false
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // This helper checks if a message is specifically asking about hotels or locations
  const isHotelRelatedQuery = (message: string): boolean => {
    // More specific hotel-related terms
    const hotelTerms = [
      'hotel', 'stay', 'accommodation', 'room', 'apartment', 'villa', 'place to stay',
      'where to stay', 'lodging', 'resort', 'motel', 'inn', 'hostel', 'pension',
      'where can i stay', 'places to stay', 'best hotel', 'recommend hotel',
      'good hotel'
    ];
    const locationTerms = [
      'platis gialos', 'apollonia', 'kamares', 'vathi', 'kastro', 'faros', 
      'artemonas', 'platy gialo', 'in kamares', 'in apollonia', 'in vathi',
      'in kastro', 'in faros', 'in platis gialos', 'near kamares', 'near apollonia',
      'near platis gialos', 'near vathi', 'near kastro', 'near faros'
    ];
    const searchPhrases = [
      'looking for', 'searching for', 'find me', 'can you suggest', 
      'recommend', 'show me', 'i need', 'i want', 'i\'m looking for'
    ];
    const beachTerms = [
      'beach', 'beachfront', 'by the sea', 'oceanfront', 'sea view', 
      'ocean view', 'waterfront', 'by the beach', 'near the beach',
      'close to the beach', 'on the beach'
    ];
    
    const messageLower = message.toLowerCase();
    
    // Check for phrases like "hotels in Kamares" or "accommodations near the beach"
    for (const hotelTerm of hotelTerms) {
      // Check for location-specific queries
      for (const locationTerm of locationTerms) {
        if (messageLower.includes(`${hotelTerm} in ${locationTerm}`) || 
            messageLower.includes(`${hotelTerm} near ${locationTerm}`) ||
            messageLower.includes(`${hotelTerm} at ${locationTerm}`) ||
            messageLower.includes(`${locationTerm} ${hotelTerm}`)) {
          return true;
        }
      }
      
      // Check for beach-related queries
      for (const beachTerm of beachTerms) {
        if (messageLower.includes(`${hotelTerm} ${beachTerm}`) || 
            messageLower.includes(`${beachTerm} ${hotelTerm}`)) {
          return true;
        }
      }
      
      // Check for search phrases + hotel terms
      for (const searchPhrase of searchPhrases) {
        if (messageLower.includes(`${searchPhrase} ${hotelTerm}`)) {
          return true;
        }
      }
    }
    
    // Check if message contains both a hotel term and a location term
    const hasHotelTerm = hotelTerms.some(term => messageLower.includes(term));
    const hasLocationTerm = locationTerms.some(term => messageLower.includes(term));
    
    if (hasHotelTerm && hasLocationTerm) {
      return true;
    }
    
    // Check for explicit beach hotel questions
    const hasBeachTerm = beachTerms.some(term => messageLower.includes(term));
    if (hasHotelTerm && hasBeachTerm) {
      return true;
    }
    
    // Check for questions about specific hotel types
    const hotelTypeQueries = [
      'luxury hotel', 'family hotel', 'budget hotel', 'cheap hotel', 
      'boutique hotel', 'best place to stay', 'good place to stay',
      'nice hotel', 'affordable hotel'
    ];
    
    for (const query of hotelTypeQueries) {
      if (messageLower.includes(query)) {
        return true;
      }
    }
    
    return false;
  };
  
  const extractLocationFromMessage = (message: string): string | undefined => {
    // List of known locations in Sifnos, with different spelling variations
    const locationMappings: Record<string, string[]> = {
      'platis gialos': ['platy gialo', 'plati gialo', 'plati gialos', 'platys gialos', 'platys', 'platys gialo'],
      'apollonia': ['appolonia', 'apollona', 'apollina', 'appolina'],
      'kamares': ['kamares', 'kamaris', 'kamari'],
      'vathi': ['vathi', 'vathy', 'vati'],
      'kastro': ['castro', 'kastro', 'casrto'],
      'faros': ['pharos', 'faros', 'pharo'],
      'artemonas': ['artemonas', 'artemona', 'artemones']
    };
    
    const messageLower = message.toLowerCase();
    
    // Check for each location and its variations
    for (const [standardName, variations] of Object.entries(locationMappings)) {
      // First check if the standard name is present
      if (messageLower.includes(standardName)) {
        return standardName;
      }
      
      // Then check variations
      for (const variation of variations) {
        if (messageLower.includes(variation)) {
          return standardName; // Return the standard name
        }
      }
    }
    
    // Check for prepositional phrases (in X, near X, at X)
    const prepositions = ['in ', 'near ', 'at ', 'to '];
    for (const [standardName, variations] of Object.entries(locationMappings)) {
      const allNames = [standardName, ...variations];
      
      for (const name of allNames) {
        for (const prep of prepositions) {
          if (messageLower.includes(`${prep}${name}`)) {
            return standardName;
          }
        }
      }
    }
    
    return undefined;
  };

  const searchHotels = async (query: string): Promise<any[]> => {
    try {
      const locationFromQuery = extractLocationFromMessage(query);
      console.log("Detected location from query:", locationFromQuery);
      
      // Get all hotels from Supabase
      const { data: hotels, error } = await supabase
        .from('hotels')
        .select(`
          *,
          hotel_amenities(amenity),
          hotel_photos(id, photo_url, is_main_photo)
        `)
        .order('rating', { ascending: false });
      
      if (error) {
        console.error('Error fetching hotels:', error);
        return [];
      }
      
      if (!hotels) return [];
      
      // Check for specific types of accommodations in the query
      const luxuryTerms = ['luxury', 'high-end', 'upscale', 'premium', 'exclusive', 'fancy', 'best'];
      const familyTerms = ['family', 'kid', 'children', 'family-friendly', 'child-friendly', 'kids'];
      const beachTerms = ['beach', 'beachfront', 'sea view', 'by the sea', 'ocean', 'coastal'];
      const budgetTerms = ['budget', 'affordable', 'cheap', 'inexpensive', 'economical', 'low cost'];
      
      const queryLower = query.toLowerCase();
      let filteredHotels = hotels;
      
      // Filter by location if specified
      if (locationFromQuery) {
        filteredHotels = filterHotelsByLocation(filteredHotels, locationFromQuery);
        console.log(`Filtered hotels by ${locationFromQuery}:`, filteredHotels.length);
      }
      
      // Apply additional filters based on the query
      if (luxuryTerms.some(term => queryLower.includes(term))) {
        filteredHotels = filteredHotels.filter(hotel => 
          hotel.hotel_types?.some((type: string) => type.toLowerCase().includes('luxury')) || 
          hotel.rating >= 4.5
        );
      }
      
      if (familyTerms.some(term => queryLower.includes(term))) {
        filteredHotels = filteredHotels.filter(hotel => 
          hotel.hotel_types?.some((type: string) => type.toLowerCase().includes('family'))
        );
      }
      
      if (beachTerms.some(term => queryLower.includes(term))) {
        // Filter for beach hotels - either by location or by description
        filteredHotels = filteredHotels.filter(hotel => 
          hotel.location?.toLowerCase().includes('platis gialos') || 
          hotel.location?.toLowerCase().includes('vathi') || 
          hotel.location?.toLowerCase().includes('kamares') ||
          hotel.hotel_types?.some((type: string) => type.toLowerCase().includes('beach')) ||
          (hotel.description && 
            beachTerms.some(term => hotel.description.toLowerCase().includes(term)))
        );
      }
      
      if (budgetTerms.some(term => queryLower.includes(term))) {
        // Assume budget hotels have lower prices
        filteredHotels = filteredHotels.filter(hotel => 
          hotel.price < 150 || 
          hotel.hotel_types?.some((type: string) => type.toLowerCase().includes('budget'))
        );
      }
      
      // Limit results to top 6
      return filteredHotels.slice(0, 6);
    } catch (error) {
      console.error('Error searching hotels:', error);
      return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = { 
      id: Date.now().toString(), 
      role: 'user', 
      content: input
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    // Clear input
    setInput('');
    
    // Loading state
    setIsLoading(true);
    
    try {
      // Check if this is a hotel-related query
      const shouldShowHotels = isHotelRelatedQuery(input);
      let relevantHotels: any[] = [];
      
      // Only search for hotels if it's a hotel-related query
      if (shouldShowHotels) {
        // Extract location from user message
        const locationFromMessage = extractLocationFromMessage(input);
        
        // Search for hotels based on user query
        relevantHotels = await searchHotels(input);
        console.log("Found relevant hotels:", relevantHotels.length);
      }

      // Add temporary assistant message
      const assistantId = (Date.now() + 1).toString();
      setMessages((prev) => [...prev, { 
        id: assistantId, 
        role: 'assistant', 
        content: '', 
        location: extractLocationFromMessage(input), 
        hotels: shouldShowHotels && relevantHotels.length > 0 ? relevantHotels : undefined,
        showHotels: shouldShowHotels && relevantHotels.length > 0
      }]);
      
      // Call the AI travel assistant function using Supabase client
      const response = await supabase.functions.invoke("ai-travel-assistant", {
        body: {
          messages: [
            ...messages.map(msg => ({ role: msg.role, content: msg.content })),
            { role: userMessage.role, content: userMessage.content }
          ],
        },
      });
      
      // Handle non-streaming response first to catch errors
      if (response.error) {
        console.error("Error from AI travel assistant:", response.error);
        throw new Error(`Error from AI travel assistant: ${response.error.message || response.error}`);
      }
      
      if (!response.data) {
        throw new Error("Empty response from AI travel assistant");
      }
      
      // Process the streaming response
      const reader = response.data.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // Decode the chunk and split by lines
        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n\n');
        
        for (const line of lines) {
          // Skip empty lines and DONE messages
          if (!line || line === 'data: [DONE]') continue;
          
          // Extract the JSON payload from the SSE format
          const dataMatch = line.match(/^data: (.+)$/m);
          if (!dataMatch) continue;
          
          try {
            const parsed = JSON.parse(dataMatch[1]);
            if (parsed.choices && parsed.choices[0]?.delta?.content) {
              const content = parsed.choices[0].delta.content;
              fullContent += content;
              
              // Update the message with accumulated content
              setMessages((prev) => 
                prev.map(msg => 
                  msg.id === assistantId 
                    ? { ...msg, content: fullContent } 
                    : msg
                )
              );
            }
          } catch (err) {
            console.error('Error parsing chunk:', err, 'Content:', dataMatch[1]);
          }
        }
      }
      
      // If the AI response suggests showing hotels but we initially didn't think so
      const showHotelsFromResponse = (
        fullContent.includes('Here are some hotel options') || 
        fullContent.includes('recommended hotels') || 
        fullContent.includes('suggest staying at') ||
        fullContent.includes('accommodation options') ||
        fullContent.includes('places to stay') ||
        fullContent.includes('consider staying at')
      );
      
      if (showHotelsFromResponse && (!shouldShowHotels || relevantHotels.length === 0)) {
        // Fetch hotels if the AI response suggests showing them but we didn't initially
        relevantHotels = await searchHotels(input);
        
        if (relevantHotels.length > 0) {
          // Update message to include hotels
          setMessages((prev) => 
            prev.map(msg => 
              msg.id === assistantId 
                ? { 
                    ...msg, 
                    hotels: relevantHotels,
                    showHotels: true,
                    location: extractLocationFromMessage(input)
                  } 
                : msg
            )
          );
        }
      }
      
      // If no content was received, show fallback message
      if (!fullContent) {
        const locationFromMessage = extractLocationFromMessage(input);
        const fallbackMessage = locationFromMessage 
          ? `I found some hotel options in ${locationFromMessage} that might interest you. Feel free to ask me more about them!`
          : "I found some hotel options in Sifnos that might interest you. Feel free to ask me more about them!";
          
        setMessages((prev) => 
          prev.map(msg => 
            msg.id === assistantId 
              ? { ...msg, content: fallbackMessage } 
              : msg
          )
        );
      }
    } catch (error) {
      console.error('Error in AI chat:', error);
      toast({
        title: 'Error',
        description: 'Failed to get AI response. Please try again.',
        variant: 'destructive'
      });
      setMessages((prev) => [
        ...prev, 
        { 
          id: Date.now().toString(), 
          role: 'assistant', 
          content: 'Sorry, I encountered an issue processing your request. Please try again.' 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] min-h-[600px] rounded-xl overflow-hidden bg-white border border-gray-200 shadow-xl">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div 
              className={`flex gap-3 max-w-[80%] ${
                message.role === 'user' 
                  ? 'flex-row-reverse' 
                  : 'flex-row'
              }`}
            >
              {message.role === 'user' ? (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sifnos-deep-blue to-blue-700 text-white flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4" />
                </div>
              ) : (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              
              <div 
                className={`rounded-2xl p-4 shadow-sm ${
                  message.role === 'user' 
                    ? 'bg-sifnos-deep-blue text-white' 
                    : 'bg-white border border-gray-200'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm md:text-base">
                  {message.content}
                </div>
                
                {/* Hotel Recommendations Carousel - only show when specifically asked about hotels */}
                {message.showHotels && message.hotels && message.hotels.length > 0 && (
                  <div className="mt-4 space-y-4">
                    <Separator />
                    
                    <div className="font-medium text-center px-2 py-1 mb-3">
                      {message.location ? (
                        <div className="flex items-center justify-center gap-2">
                          <Hotel className="h-4 w-4" />
                          <span>Recommended Hotels in {message.location.charAt(0).toUpperCase() + message.location.slice(1)}</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Hotel className="h-4 w-4" />
                          <span>Top Recommended Hotels in Sifnos</span>
                        </div>
                      )}
                    </div>
                    
                    <HotelCarousel hotels={message.hotels} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Form */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about hotels in Platis Gialos, Apollonia, etc..."
            className="flex-1 border-gray-300 focus-visible:ring-sifnos-deep-blue"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="bg-sifnos-deep-blue hover:bg-sifnos-deep-blue/90"
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
