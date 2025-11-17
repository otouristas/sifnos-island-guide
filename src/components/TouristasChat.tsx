import { useState, useRef, useEffect, memo, useCallback } from 'react';
import { Send, Loader2, MessageSquare, X, Star, Copy, Share2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useTouristas } from '@/contexts/TouristasContext';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { determineHotelImageUrl } from '@/utils/image-utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'touristas';
  timestamp: Date;
  hotels?: any[];
  suggestions?: string[];
}

// Memoized hotel card component
const HotelCard = memo(({ hotel, onClick }: { hotel: any; onClick: () => void }) => (
  <Link
    to={`/hotels/${hotel.name.toLowerCase().replace(/\s+/g, '-')}`}
    onClick={onClick}
    className="block bg-background border-2 border-border hover:border-[#FFD700] rounded-lg sm:rounded-xl p-2 sm:p-3 transition-all duration-200 hover:shadow-lg group"
  >
    <div className="flex gap-2 sm:gap-3">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-md sm:rounded-lg overflow-hidden flex-shrink-0 bg-muted">
        <img
          src={determineHotelImageUrl(hotel, hotel.hotel_photos?.[0]?.photo_url)}
          alt={hotel.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-sm sm:text-base text-foreground group-hover:text-[#1E2E48] truncate">
          {hotel.name}
        </h4>
        <p className="text-xs sm:text-sm text-muted-foreground truncate">
          {hotel.location}
        </p>
        <div className="flex items-center gap-1 sm:gap-2 mt-1">
          <span className="text-xs sm:text-sm font-bold text-[#1E2E48]">
            €{hotel.price}
          </span>
          <span className="text-xs text-muted-foreground">/night</span>
        </div>
        {hotel.rating && (
          <div className="flex items-center gap-1 mt-1">
            <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-[#FFD700] text-[#FFD700]" />
            <span className="text-xs sm:text-sm font-medium">
              {hotel.rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>
    </div>
  </Link>
));

HotelCard.displayName = 'HotelCard';

export default function TouristasChat() {
  const { isOpen, closeChat } = useTouristas();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('touristas-chat-history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.length > 0 ? parsed : [getGreeting()];
      } catch (e) {
        return [getGreeting()];
      }
    }
    return [getGreeting()];
  });
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  function getGreeting(): Message {
    return {
      id: Date.now().toString(),
      content: "Welcome! I'm Touristas AI, your Sifnos travel assistant. I can help you with:\n\nHotels & Accommodation\nFerries & Transportation\nBeaches & Activities\nRestaurants & Dining\nLocal Tips & Recommendations\n\nWhat would you like to know about Sifnos?",
      sender: 'touristas',
      timestamp: new Date(),
      suggestions: ['Budget hotels', 'Luxury hotels', 'How to get to Sifnos', 'Best beaches']
    };
  }

  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem('touristas-chat-history', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const clearHistory = useCallback(() => {
    setMessages([getGreeting()]);
    localStorage.removeItem('touristas-chat-history');
    toast({ title: "Chat cleared", description: "Your conversation history has been cleared." });
  }, [toast]);

  const copyHotelDetails = useCallback((hotel: any) => {
    const details = `${hotel.name}\nLocation: ${hotel.location}\nPrice: €${hotel.price}/night\nRating: ${hotel.rating}/5\n${hotel.short_description || ''}`;
    navigator.clipboard.writeText(details);
    toast({ title: "Copied!", description: "Hotel details copied to clipboard." });
  }, [toast]);

  const shareConversation = useCallback(() => {
    const conversationText = messages
      .map(msg => `${msg.sender === 'user' ? 'You' : 'Touristas AI'}: ${msg.content}`)
      .join('\n\n');
    
    if (navigator.share) {
      navigator.share({ title: 'Touristas AI Conversation', text: conversationText }).catch(() => {});
    } else {
      navigator.clipboard.writeText(conversationText);
      toast({ title: "Copied!", description: "Conversation copied to clipboard." });
    }
  }, [messages, toast]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setInput(suggestion);
    setTimeout(() => handleSend(suggestion), 100);
  }, []);

  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim()) return;

    setError(null);
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const query = messageText.toLowerCase();
      let hotels: any[] = [];
      let responseText = '';
      let suggestions: string[] = [];

      if (query.includes('budget') || query.includes('cheap') || query.includes('affordable')) {
        const { data } = await supabase
          .from('hotels')
          .select('*, hotel_photos(id, photo_url, is_main_photo), hotel_amenities(amenity)')
          .lte('price', 100)
          .order('price', { ascending: true })
          .limit(5);
        
        hotels = data || [];
        responseText = "Here are some budget-friendly accommodation options in Sifnos. These hotels offer great value for money while maintaining quality and comfort.";
        suggestions = ['Luxury hotels', 'Beach hotels', 'Show all hotels'];
      } else if (query.includes('luxury') || query.includes('premium') || query.includes('upscale')) {
        const { data } = await supabase
          .from('hotels')
          .select('*, hotel_photos(id, photo_url, is_main_photo), hotel_amenities(amenity)')
          .gte('price', 150)
          .order('rating', { ascending: false })
          .limit(5);
        
        hotels = data || [];
        responseText = "Here are the finest luxury accommodations in Sifnos. These properties offer premium amenities, exceptional service, and stunning locations.";
        suggestions = ['Budget hotels', 'Family hotels', 'Beach hotels'];
      } else if (query.includes('beach') || query.includes('sea view') || query.includes('oceanfront')) {
        const { data } = await supabase
          .from('hotels')
          .select('*, hotel_photos(id, photo_url, is_main_photo), hotel_amenities(amenity)')
          .or('location.ilike.%Platis Gialos%,location.ilike.%Kamares%,location.ilike.%Faros%')
          .order('rating', { ascending: false })
          .limit(5);
        
        hotels = data || [];
        responseText = "Here are beautiful beachfront hotels in Sifnos. Perfect for enjoying the crystal-clear waters and stunning sea views.";
        suggestions = ['Hotels in Apollonia', 'Luxury hotels', 'Family hotels'];
      } else if (query.includes('family') || query.includes('kids') || query.includes('children')) {
        const { data } = await supabase
          .from('hotels')
          .select('*, hotel_photos(id, photo_url, is_main_photo), hotel_amenities(amenity)')
          .order('rating', { ascending: false })
          .limit(5);
        
        hotels = data || [];
        responseText = "Here are family-friendly accommodations in Sifnos. These properties offer spacious rooms and amenities suitable for families with children.";
        suggestions = ['Budget hotels', 'Beach hotels', 'Show all hotels'];
      } else if (query.includes('kamares') || query.includes('platis gialos') || query.includes('apollonia') || 
                 query.includes('vathi') || query.includes('faros') || query.includes('kastro')) {
        let location = '';
        if (query.includes('kamares')) location = 'Kamares';
        else if (query.includes('platis gialos')) location = 'Platis Gialos';
        else if (query.includes('apollonia')) location = 'Apollonia';
        else if (query.includes('vathi')) location = 'Vathi';
        else if (query.includes('faros')) location = 'Faros';
        else if (query.includes('kastro')) location = 'Kastro';

        const { data } = await supabase
          .from('hotels')
          .select('*, hotel_photos(id, photo_url, is_main_photo), hotel_amenities(amenity)')
          .ilike('location', `%${location}%`)
          .order('rating', { ascending: false });
        
        hotels = data || [];
        responseText = `Here are the hotels in ${location}. This area offers ${location === 'Kamares' ? 'convenient port access and beach proximity' : location === 'Platis Gialos' ? 'beautiful beaches and water sports' : location === 'Apollonia' ? 'the main town atmosphere with shops and restaurants' : 'a unique authentic experience'}.`;
        suggestions = ['Budget hotels', 'Luxury hotels', 'Show all hotels'];
      } else if (query.includes('villa') || query.includes('villas')) {
        const { data } = await supabase
          .from('hotels')
          .select('*, hotel_photos(id, photo_url, is_main_photo), hotel_amenities(amenity)')
          .ilike('name', '%Villa%')
          .order('rating', { ascending: false });
        
        hotels = data || [];
        responseText = "Here are private villas in Sifnos. Perfect for those seeking privacy, space, and exclusive accommodations.";
        suggestions = ['Budget hotels', 'Beach hotels', 'Show all hotels'];
      } else if (query.includes('price') || query.includes('cost') || query.includes('rate')) {
        const { data } = await supabase
          .from('hotels')
          .select('*, hotel_photos(id, photo_url, is_main_photo), hotel_amenities(amenity)')
          .order('price', { ascending: true })
          .limit(10);
        
        hotels = data || [];
        responseText = "Here are hotels sorted by price. You can find options ranging from budget-friendly to luxury accommodations.";
        suggestions = ['Budget hotels only', 'Luxury hotels only', 'Family hotels'];
      } else if (query.includes('all') || query.includes('show') || query.includes('list') || query.includes('hotels')) {
        const { data } = await supabase
          .from('hotels')
          .select('*, hotel_photos(id, photo_url, is_main_photo), hotel_amenities(amenity)')
          .order('rating', { ascending: false });
        
        hotels = data || [];
        responseText = "Here are all available hotels in Sifnos. Browse through our complete selection to find your perfect accommodation.";
        suggestions = ['Budget hotels', 'Luxury hotels', 'Beach hotels', 'Family hotels'];
      } else {
        responseText = "I can help you find the perfect accommodation in Sifnos. Try asking about:\n\nSpecific areas (Kamares, Platis Gialos, Apollonia)\nBudget or luxury options\nBeachfront hotels\nFamily-friendly properties\nPrivate villas\n\nWhat interests you?";
        suggestions = ['Show all hotels', 'Budget hotels', 'Luxury hotels', 'Beach hotels'];
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseText,
        sender: 'touristas',
        timestamp: new Date(),
        hotels: hotels.length > 0 ? hotels : undefined,
        suggestions
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setError('Sorry, something went wrong. Please try again.');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble processing your request. Please try again or rephrase your question.",
        sender: 'touristas',
        timestamp: new Date(),
        suggestions: ['Budget hotels', 'Luxury hotels', 'Best beaches']
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 w-full sm:w-[450px] h-full sm:h-[700px] sm:max-h-[calc(100vh-3rem)] z-50 animate-fade-in"
      role="complementary"
      aria-label="Touristas AI Chat Assistant"
    >
      <div className="h-full flex flex-col bg-background border border-border sm:rounded-2xl shadow-2xl">
        <div 
          className="bg-[#1E2E48] text-white p-3 sm:p-4 flex items-center justify-between sm:rounded-t-2xl"
          role="banner"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FFD700] flex items-center justify-center flex-shrink-0">
              <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-[#1E2E48]" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">Touristas AI</h3>
              <p className="text-xs text-white/80">Your Sifnos Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button onClick={shareConversation} variant="ghost" size="icon" className="text-white hover:bg-white/10 h-8 w-8 sm:h-9 sm:w-9">
              <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button onClick={clearHistory} variant="ghost" size="icon" className="text-white hover:bg-white/10 h-8 w-8 sm:h-9 sm:w-9">
              <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button onClick={closeChat} variant="ghost" size="icon" className="text-white hover:bg-white/10 h-8 w-8 sm:h-9 sm:w-9">
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border-b border-destructive text-destructive px-3 py-2 sm:px-4 text-xs sm:text-sm flex items-center justify-between">
            <span>{error}</span>
            <Button size="sm" variant="ghost" onClick={() => setError(null)} className="h-6 px-2">Dismiss</Button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 bg-muted/30">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-2 sm:gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                message.sender === 'touristas' ? 'bg-[#1E2E48] text-white' : 'bg-[#FFD700] text-[#1E2E48]'
              }`}>
                {message.sender === 'touristas' ? <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" /> : <span className="font-bold text-xs sm:text-sm">U</span>}
              </div>

              <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                <div className={`rounded-xl px-3 py-2 sm:px-4 sm:py-3 break-words ${
                  message.sender === 'touristas' ? 'bg-background border border-border' : 'bg-[#E3D7C3] text-[#1E2E48]'
                }`}>
                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>

                {message.hotels && message.hotels.length > 0 && (
                  <div className="space-y-2 sm:space-y-3">
                    {message.hotels.map((hotel) => (
                      <div key={hotel.id} className="relative group">
                        <HotelCard hotel={hotel} onClick={closeChat} />
                        <Button size="sm" variant="ghost" onClick={(e) => { e.preventDefault(); copyHotelDetails(hotel); }} 
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 h-7 w-7 p-0">
                          <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {message.suggestions.map((suggestion, idx) => (
                      <button key={idx} onClick={() => handleSuggestionClick(suggestion)}
                        className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm bg-background border border-[#1E2E48] text-[#1E2E48] rounded-full hover:bg-[#1E2E48] hover:text-white transition-colors whitespace-nowrap">
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2 sm:gap-3">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#1E2E48] text-white flex items-center justify-center">
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="bg-background border border-border rounded-xl px-3 py-2 sm:px-4 sm:py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-[#1E2E48] rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-[#1E2E48] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-[#1E2E48] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-border p-3 sm:p-4 bg-background sm:rounded-b-2xl">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about hotels, beaches, or travel tips..." className="flex-1 text-sm sm:text-base" disabled={isTyping} />
            <Button type="submit" size="icon" className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#1E2E48] flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10" disabled={isTyping || !input.trim()}>
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
