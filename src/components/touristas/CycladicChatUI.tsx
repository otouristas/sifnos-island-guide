
import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Send, Loader2, Hotel, Star, MapPin, X, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useMediaQuery } from 'react-responsive';

type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  hotels?: any[];
};

export default function CycladicChatUI() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Γεια σου! 👋 I\'m your Sifnos travel assistant. Tell me what you\'re looking for in your perfect stay - beach access, luxury amenities, family-friendly options, or budget accommodations?'
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const searchHotels = async (query: string) => {
    try {
      // Extract key terms for hotel search
      const locationTerms = ['apollonia', 'kamares', 'platis gialos', 'vathi', 'kastro', 'faros', 'artemonas'];
      const amenityTerms = ['pool', 'beach', 'wifi', 'breakfast', 'air condition', 'restaurant', 'sea view'];
      const typeTerms = ['luxury', 'boutique', 'family-friendly', 'budget', 'beachfront', 'villa'];
      
      // Determine search parameters
      const lowercaseQuery = query.toLowerCase();
      let location = '';
      locationTerms.forEach(term => {
        if (lowercaseQuery.includes(term)) {
          location = term;
        }
      });
      
      let type = '';
      typeTerms.forEach(term => {
        if (lowercaseQuery.includes(term)) {
          type = term;
        }
      });
      
      // Perform the hotel search
      let { data: hotels, error } = await supabase
        .from('hotels')
        .select(`
          *,
          hotel_amenities(amenity),
          hotel_photos(id, photo_url, is_main_photo)
        `)
        .order('rating', { ascending: false });
      
      if (error) throw error;
      
      if (!hotels) return [];
      
      // Filter by location if specified
      if (location) {
        hotels = hotels.filter(hotel => 
          hotel.location.toLowerCase().includes(location)
        );
      }
      
      // Filter by hotel type if specified
      if (type) {
        hotels = hotels.filter(hotel => {
          if (!hotel.hotel_types) return false;
          return hotel.hotel_types.some((hotelType: string) => 
            hotelType.toLowerCase().includes(type.toLowerCase().replace('-', ''))
          );
        });
      }
      
      // Filter by budget keyword
      if (lowercaseQuery.includes('budget') || lowercaseQuery.includes('affordable')) {
        hotels = hotels.filter(hotel => hotel.price < 150);
      }
      
      // Filter by luxury keyword
      if (lowercaseQuery.includes('luxury') || lowercaseQuery.includes('high-end')) {
        hotels = hotels.filter(hotel => hotel.price > 200 || hotel.rating >= 4);
      }
      
      return hotels.slice(0, 3); // Return top 3 matches
    } catch (error) {
      console.error('Error searching hotels:', error);
      return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = { id: Date.now().toString(), role: 'user' as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    
    // Clear input
    setInput('');
    
    // Loading state
    setIsLoading(true);
    
    try {
      // Search for hotels based on user query
      const relevantHotels = await searchHotels(input);

      // Start streaming response from OpenRouter via edge function
      const response = await supabase.functions.invoke('ai-travel-assistant', {
        body: {
          messages: messages.map(msg => ({ role: msg.role, content: msg.content })).concat([userMessage]),
          hotelQuery: input
        }
      });
      
      if (!response.data) {
        throw new Error('Failed to get response from AI assistant');
      }
      
      // Create a new response message
      const aiMessageId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev, 
        { id: aiMessageId, role: 'assistant', content: '', hotels: relevantHotels }
      ]);

      // The response from supabase.functions.invoke is not a stream, so we need to convert it
      if (typeof response.data === 'string') {
        // For string responses, process as plain text
        setMessages((prev) => 
          prev.map(msg => 
            msg.id === aiMessageId 
              ? { ...msg, content: response.data as string } 
              : msg
          )
        );
      } else {
        // For structured responses that might contain EventSource data
        const responseText = response.data ? JSON.stringify(response.data) : '';
        const lines = responseText.split('\n');
        let assistantResponse = '';
        
        for (const line of lines) {
          if (line.startsWith('data:')) {
            const jsonStr = line.slice(5).trim();
            
            if (jsonStr === '[DONE]') continue;
            
            try {
              const data = JSON.parse(jsonStr);
              if (data.choices && data.choices[0]?.delta?.content) {
                assistantResponse += data.choices[0].delta.content;
                setMessages((prev) => 
                  prev.map(msg => 
                    msg.id === aiMessageId 
                      ? { ...msg, content: assistantResponse } 
                      : msg
                  )
                );
              }
            } catch (e) {
              console.error('Error parsing JSON:', e);
            }
          }
        }
        
        // If no response was built through streaming, use the whole response as content
        if (!assistantResponse && responseText) {
          setMessages((prev) => 
            prev.map(msg => 
              msg.id === aiMessageId 
                ? { ...msg, content: "I encountered an issue processing your request, but I've found some hotel options that might interest you. Feel free to ask me more about them!" } 
                : msg
            )
          );
        }
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
    <div className="flex flex-col h-[calc(100vh-200px)] min-h-[600px] rounded-xl overflow-hidden bg-gradient-to-b from-white to-gray-50 border border-white/30 shadow-xl">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`flex gap-3 max-w-[80%] animate-fade-in ${
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
                className={`rounded-2xl p-4 shadow-md ${
                  message.role === 'user' 
                    ? 'bg-sifnos-deep-blue text-white' 
                    : 'bg-white border border-gray-200'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm md:text-base">
                  {message.content}
                </div>
                
                {/* Hotel Recommendations */}
                {message.hotels && message.hotels.length > 0 && (
                  <div className="mt-4 space-y-4">
                    <div className="font-medium text-center px-2 py-1 bg-white/20 backdrop-blur-sm rounded-md">
                      Recommended Hotels
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {message.hotels.map((hotel) => (
                        <div 
                          key={hotel.id} 
                          className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                          {/* Hotel Image */}
                          <div className="w-full h-36 overflow-hidden bg-gray-100">
                            {hotel.hotel_photos?.find((photo: any) => photo.is_main_photo)?.photo_url ? (
                              <img 
                                src={`/uploads/hotels/${hotel.hotel_photos.find((photo: any) => photo.is_main_photo).photo_url}`}
                                alt={hotel.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <Hotel className="text-gray-400 h-10 w-10" />
                              </div>
                            )}
                          </div>
                          
                          {/* Hotel Info */}
                          <div className="p-3">
                            <div className="font-semibold text-base truncate">{hotel.name}</div>
                            <div className="flex items-center text-xs text-gray-600 space-x-2 mt-1">
                              <div className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span>{hotel.location}</span>
                              </div>
                              <div className="flex items-center">
                                <Star className="h-3 w-3 mr-1 text-amber-500" />
                                <span>{hotel.rating}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Hotel Details Button */}
                          {isMobile ? (
                            <Drawer>
                              <DrawerTrigger asChild>
                                <Button className="w-full rounded-none bg-sifnos-deep-blue hover:bg-sifnos-deep-blue/90">
                                  View Details
                                </Button>
                              </DrawerTrigger>
                              <DrawerContent className="h-[85vh]">
                                <div className="p-4 h-full overflow-y-auto">
                                  <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold">{hotel.name}</h3>
                                    <DrawerClose><X className="h-4 w-4" /></DrawerClose>
                                  </div>
                                  <div className="space-y-4">
                                    {/* Large Hotel Image */}
                                    <div className="w-full h-52 overflow-hidden rounded-lg">
                                      {hotel.hotel_photos?.find((photo: any) => photo.is_main_photo)?.photo_url ? (
                                        <img 
                                          src={`/uploads/hotels/${hotel.hotel_photos.find((photo: any) => photo.is_main_photo).photo_url}`}
                                          alt={hotel.name}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                          <Hotel className="text-gray-400 h-16 w-16" />
                                        </div>
                                      )}
                                    </div>
                                    
                                    {/* Hotel Details */}
                                    <div>
                                      <div className="flex items-center space-x-2">
                                        <MapPin className="h-4 w-4 text-sifnos-deep-blue" />
                                        <span className="text-gray-700">{hotel.location}</span>
                                      </div>
                                      <div className="flex items-center space-x-2 mt-1">
                                        <Star className="h-4 w-4 text-amber-500" />
                                        <span className="text-gray-700">Rating: {hotel.rating}</span>
                                      </div>
                                    </div>
                                    
                                    {/* Amenities */}
                                    {hotel.hotel_amenities && hotel.hotel_amenities.length > 0 && (
                                      <div>
                                        <h4 className="font-medium mb-1">Amenities</h4>
                                        <div className="flex flex-wrap gap-1">
                                          {hotel.hotel_amenities.map((amenity: any, i: number) => (
                                            <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                              {amenity.amenity}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {/* Description */}
                                    {hotel.description && (
                                      <div>
                                        <h4 className="font-medium mb-1">About</h4>
                                        <p className="text-sm text-gray-600">{hotel.description}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </DrawerContent>
                            </Drawer>
                          ) : (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button className="w-full rounded-none bg-sifnos-deep-blue hover:bg-sifnos-deep-blue/90">
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                                <div className="p-4">
                                  <h3 className="text-xl font-bold mb-4">{hotel.name}</h3>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Large Hotel Image */}
                                    <div className="w-full h-64 overflow-hidden rounded-lg">
                                      {hotel.hotel_photos?.find((photo: any) => photo.is_main_photo)?.photo_url ? (
                                        <img 
                                          src={`/uploads/hotels/${hotel.hotel_photos.find((photo: any) => photo.is_main_photo).photo_url}`}
                                          alt={hotel.name}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                          <Hotel className="text-gray-400 h-16 w-16" />
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div>
                                      {/* Hotel Details */}
                                      <div className="mb-4">
                                        <div className="flex items-center space-x-2">
                                          <MapPin className="h-4 w-4 text-sifnos-deep-blue" />
                                          <span className="text-gray-700">{hotel.location}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 mt-1">
                                          <Star className="h-4 w-4 text-amber-500" />
                                          <span className="text-gray-700">Rating: {hotel.rating}</span>
                                        </div>
                                      </div>
                                      
                                      {/* Amenities */}
                                      {hotel.hotel_amenities && hotel.hotel_amenities.length > 0 && (
                                        <div className="mb-4">
                                          <h4 className="font-medium mb-1">Amenities</h4>
                                          <div className="flex flex-wrap gap-1">
                                            {hotel.hotel_amenities.map((amenity: any, i: number) => (
                                              <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                                {amenity.amenity}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Description */}
                                  {hotel.description && (
                                    <div className="mt-4">
                                      <h4 className="font-medium mb-1">About</h4>
                                      <p className="text-sm text-gray-600">{hotel.description}</p>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Form */}
      <div className="border-t border-gray-200 p-4 bg-white/80 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What are you looking for in your perfect Sifnos stay?"
            className="flex-1 bg-white border-gray-200 focus-visible:ring-sifnos-deep-blue"
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
