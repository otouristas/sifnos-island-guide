import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTouristas } from '@/contexts/TouristasContext';
import { supabase } from '@/integrations/supabase/client';
import { hotelTypes } from '@/data/hotelTypes';
import { sifnosLocations } from '@/data/locations';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'touristas';
  timestamp: Date;
  suggestions?: string[];
  hotels?: any[];
}

interface HotelData {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  hotel_types: string[];
  short_description: string;
  hotel_photos?: { photo_url: string }[];
}

export function TouristasChat() {
  const { isOpen, closeChat } = useTouristas();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [allHotels, setAllHotels] = useState<HotelData[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch hotels on mount
  useEffect(() => {
    const fetchHotels = async () => {
      const { data } = await supabase
        .from('hotels')
        .select(`
          id,
          name,
          location,
          price,
          rating,
          hotel_types,
          short_description,
          hotel_photos (
            photo_url
          )
        `)
        .order('rating', { ascending: false });
      
      if (data) {
        setAllHotels(data);
      }
    };
    fetchHotels();
  }, []);

  // Initial greeting when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting: Message = {
        id: Date.now().toString(),
        content: "Welcome to Touristas AI. I can help you find the perfect hotel in Sifnos. What are you looking for?",
        sender: 'touristas',
        timestamp: new Date(),
        suggestions: ['Budget hotels', 'Luxury hotels', 'Beach hotels', 'Show all hotels']
      };
      setMessages([greeting]);
    }
  }, [isOpen]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // AI Response Logic - Pattern Matching
  const getAIResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();

    // Pattern 1: Budget/Economy queries
    if (
      lowerMessage.includes('cheap') ||
      lowerMessage.includes('budget') ||
      lowerMessage.includes('economy') ||
      lowerMessage.includes('affordable') ||
      lowerMessage.includes('inexpensive')
    ) {
      const budgetHotels = allHotels
        .filter(h => h.price <= 100)
        .sort((a, b) => a.price - b.price)
        .slice(0, 3);

      return {
        id: Date.now().toString(),
        content: "Here are our best budget-friendly options in Sifnos:",
        sender: 'touristas',
        timestamp: new Date(),
        suggestions: ['Show more budget hotels', 'Compare prices', 'Filter by location'],
        hotels: budgetHotels,
      };
    }

    // Pattern 2: Luxury queries
    if (
      lowerMessage.includes('luxury') ||
      lowerMessage.includes('premium') ||
      lowerMessage.includes('upscale') ||
      lowerMessage.includes('5 star') ||
      lowerMessage.includes('high-end')
    ) {
      const luxuryHotels = allHotels
        .filter(h => 
          h.hotel_types?.includes('luxury-hotels') || 
          h.price >= 200 ||
          h.rating >= 4.5
        )
        .slice(0, 3);

      return {
        id: Date.now().toString(),
        content: "Premium accommodations for your stay in Sifnos:",
        sender: 'touristas',
        timestamp: new Date(),
        suggestions: ['View amenities', 'Check availability', 'Compare luxury hotels'],
        hotels: luxuryHotels,
      };
    }

    // Pattern 3: Beach queries
    if (
      lowerMessage.includes('beach') ||
      lowerMessage.includes('sea') ||
      lowerMessage.includes('coast') ||
      lowerMessage.includes('waterfront') ||
      lowerMessage.includes('seaside')
    ) {
      const beachHotels = allHotels
        .filter(h => 
          h.hotel_types?.includes('beach-hotels') ||
          h.location.toLowerCase().includes('platis gialos') ||
          h.location.toLowerCase().includes('kamares') ||
          h.location.toLowerCase().includes('vathi')
        )
        .slice(0, 3);

      return {
        id: Date.now().toString(),
        content: "Beachfront hotels with stunning sea views:",
        sender: 'touristas',
        timestamp: new Date(),
        suggestions: ['Best beaches', 'Beach activities', 'Water sports'],
        hotels: beachHotels,
      };
    }

    // Pattern 4: Family queries
    if (
      lowerMessage.includes('family') ||
      lowerMessage.includes('kids') ||
      lowerMessage.includes('children') ||
      lowerMessage.includes('group')
    ) {
      const familyHotels = allHotels
        .filter(h => 
          h.hotel_types?.includes('family-hotels') ||
          h.hotel_types?.includes('apartment-hotels')
        )
        .slice(0, 3);

      return {
        id: Date.now().toString(),
        content: "Family-friendly accommodations in Sifnos:",
        sender: 'touristas',
        timestamp: new Date(),
        suggestions: ['Family activities', 'Child-friendly beaches', 'View all family hotels'],
        hotels: familyHotels,
      };
    }

    // Pattern 5: Location-specific queries
    const locationMatch = sifnosLocations.find(loc => 
      lowerMessage.includes(loc.slug) || 
      lowerMessage.includes(loc.name.toLowerCase())
    );

    if (locationMatch) {
      const locationHotels = allHotels
        .filter(h => h.location.toLowerCase().includes(locationMatch.name.toLowerCase()))
        .slice(0, 3);

      return {
        id: Date.now().toString(),
        content: `Hotels in ${locationMatch.name}:`,
        sender: 'touristas',
        timestamp: new Date(),
        suggestions: ['See on map', 'Other locations', 'Area information'],
        hotels: locationHotels,
      };
    }

    // Pattern 6: Hotel type queries
    const typeMatch = hotelTypes.find(type => 
      lowerMessage.includes(type.slug) || 
      lowerMessage.includes(type.title.toLowerCase())
    );

    if (typeMatch) {
      const typeHotels = allHotels
        .filter(h => h.hotel_types?.includes(typeMatch.id))
        .slice(0, 3);

      return {
        id: Date.now().toString(),
        content: `${typeMatch.title} in Sifnos:`,
        sender: 'touristas',
        timestamp: new Date(),
        suggestions: ['View all', 'Compare options', 'Check availability'],
        hotels: typeHotels,
      };
    }

    // Pattern 7: Price range queries
    if (lowerMessage.match(/\d+/)) {
      const priceMatch = lowerMessage.match(/(\d+)/);
      if (priceMatch) {
        const targetPrice = parseInt(priceMatch[1]);
        const priceRangeHotels = allHotels
          .filter(h => Math.abs(h.price - targetPrice) <= 50)
          .sort((a, b) => Math.abs(a.price - targetPrice) - Math.abs(b.price - targetPrice))
          .slice(0, 3);

        return {
          id: Date.now().toString(),
          content: `Hotels around €${targetPrice} per night:`,
          sender: 'touristas',
          timestamp: new Date(),
          suggestions: ['Cheaper options', 'Premium options', 'All hotels'],
          hotels: priceRangeHotels,
        };
      }
    }

    // Pattern 8: General "show all" or "hotels"
    if (
      lowerMessage.includes('show all') ||
      lowerMessage.includes('all hotels') ||
      lowerMessage.includes('view all') ||
      lowerMessage === 'hotels'
    ) {
      const topHotels = allHotels.slice(0, 3);

      return {
        id: Date.now().toString(),
        content: "Here are some of our top-rated hotels:",
        sender: 'touristas',
        timestamp: new Date(),
        suggestions: ['Filter by type', 'Filter by location', 'Filter by price'],
        hotels: topHotels,
      };
    }

    // Default fallback response
    return {
      id: Date.now().toString(),
      content: "I'd be happy to help you find a hotel. Could you tell me more about what you're looking for? For example: budget range, location preference, or hotel type.",
      sender: 'touristas',
      timestamp: new Date(),
      suggestions: ['Budget hotels', 'Luxury hotels', 'Beach hotels', 'Show all hotels'],
    };
  };

  const handleSend = (messageText?: string) => {
    const textToSend = messageText || input.trim();
    
    if (!textToSend) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: textToSend,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = getAIResponse(textToSend);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 w-full sm:w-[450px] h-full sm:h-[700px] z-50 animate-fade-in">
      <div className="h-full bg-background border-2 border-border rounded-none sm:rounded-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-primary text-primary-foreground px-6 py-4 rounded-t-none sm:rounded-t-2xl flex items-center justify-between border-b border-border">
          <div>
            <h3 className="font-heading font-bold text-xl">Touristas AI</h3>
            <p className="text-xs text-primary-foreground/80">Your Sifnos Travel Assistant</p>
          </div>
          <Button
            onClick={closeChat}
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/10"
            aria-label="Close chat"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-muted/30">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                message.sender === 'touristas' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-accent text-accent-foreground'
              }`}>
                {message.sender === 'touristas' ? (
                  <MessageSquare className="h-5 w-5" />
                ) : (
                  <span className="font-bold">U</span>
                )}
              </div>

              {/* Message Content */}
              <div className="flex-1 space-y-3">
                <div className={`rounded-xl px-4 py-3 ${
                  message.sender === 'touristas'
                    ? 'bg-background border border-border'
                    : 'bg-secondary text-secondary-foreground'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>

                {/* Hotel Cards */}
                {message.hotels && message.hotels.length > 0 && (
                  <div className="space-y-3">
                    {message.hotels.map((hotel) => (
                      <Link
                        key={hotel.id}
                        to={`/hotels/${hotel.name.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={closeChat}
                        className="block bg-background border-2 border-border hover:border-accent rounded-xl p-3 transition-all duration-200 hover:shadow-lg group"
                      >
                        <div className="flex gap-3">
                          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                            {hotel.hotel_photos?.[0]?.photo_url ? (
                              <img
                                src={hotel.hotel_photos[0].photo_url}
                                alt={hotel.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                <MessageSquare className="h-8 w-8" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-heading font-bold text-sm text-foreground group-hover:text-accent transition-colors mb-1 truncate">
                              {hotel.name}
                            </h4>
                            <p className="text-xs text-muted-foreground mb-2">{hotel.location}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-accent">€{hotel.price}/night</span>
                              <span className="text-xs text-muted-foreground">★ {hotel.rating}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Suggestion Chips */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-background border border-border hover:border-accent hover:bg-accent/5 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div className="bg-background border border-border rounded-xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-background rounded-b-none sm:rounded-b-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about hotels in Sifnos..."
              className="flex-1"
            />
            <Button type="submit" size="icon" className="flex-shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Powered by Touristas AI
          </p>
        </div>
      </div>
    </div>
  );
}
