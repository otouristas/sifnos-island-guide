import { useState, useEffect, useRef, memo } from 'react';
import { Link } from 'react-router-dom';
import { X, Send, MessageSquare, Star, Copy, Share2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTouristas } from '@/contexts/TouristasContext';
import { supabase } from '@/integrations/supabase/client';
import { hotelTypes } from '@/data/hotelTypes';
import { sifnosLocations } from '@/data/locations';
import { determineHotelLogoUrl, determineHotelImageUrl } from '@/utils/image-utils';
import { useToast } from '@/hooks/use-toast';

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
  const { isOpen, closeChat, initialPrompt } = useTouristas();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [allHotels, setAllHotels] = useState<HotelData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

  // Load chat history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('touristas-chat-history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } catch (e) {
        console.error('Failed to load chat history');
      }
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 1) { // Don't save just greeting
      localStorage.setItem('touristas-chat-history', JSON.stringify(messages));
    }
  }, [messages]);

  // Initial greeting when chat opens (supports pre-filled prompts)
  useEffect(() => {
    if (!isOpen) return;

    if (messages.length === 0) {
      const greeting: Message = {
        id: Date.now().toString(),
        content: "Welcome! I'm Touristas AI, your Sifnos travel assistant. I can help you with:\n\n• Hotels & Accommodation\n• Ferries & Transportation\n• Beaches & Activities\n• Restaurants & Dining\n• Local Tips & Recommendations\n\nWhat would you like to know about Sifnos?",
        sender: 'touristas',
        timestamp: new Date(),
        suggestions: ['Budget hotels', 'Luxury hotels', 'How to get to Sifnos', 'Best beaches']
      };
      setMessages([greeting]);
    }
  }, [isOpen, messages.length]);

  // Handle initial prompt separately
  useEffect(() => {
    if (initialPrompt && isOpen && messages.length === 1) {
      // Only the greeting message exists
      setTimeout(() => {
        handleSend(initialPrompt);
      }, 500);
    }
  }, [initialPrompt, isOpen]);

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

  const handleSend = async (messageText?: string) => {
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

    try {
      // Call the real AI function instead of pattern matching
      const { callTouristasAI, processStreamingResponse } = await import('./touristas/services/ChatService');
      
      const aiMessages = [
        ...messages.map(msg => ({
          role: (msg.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
          content: msg.content,
          id: msg.id
        })),
        {
          role: 'user' as const,
          content: textToSend,
          id: userMessage.id
        }
      ];

      const response = await callTouristasAI(aiMessages, {}, []);
      
      if (!response) {
        throw new Error('No response from AI');
      }

      // Add assistant message placeholder
      const assistantId = (Date.now() + 1).toString();
      const assistantMessage: Message = {
        id: assistantId,
        content: '',
        sender: 'touristas',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Process streaming response
      const reader = response.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullContent += chunk;

        // Update message with streaming content
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantId
              ? { ...msg, content: fullContent }
              : msg
          )
        );
      }

      // Final update
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantId
            ? { ...msg, content: fullContent }
            : msg
        )
      );

    } catch (error) {
      console.error('Error calling AI:', error);
      setError('Sorry, something went wrong. Please try again.');
      
      // Show error message in chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble processing your request. Please try again or rephrase your question.",
        sender: 'touristas',
        timestamp: new Date(),
        suggestions: ['Budget hotels', 'Luxury hotels', 'Best beaches', 'Show all hotels']
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  const copyHotelDetails = (hotel: any) => {
    const details = `${hotel.name}
Location: ${hotel.location}
Price: €${hotel.price}/night
Rating: ${hotel.rating}/5
${hotel.short_description || ''}`;
    
    navigator.clipboard.writeText(details);
    toast({
      title: "Copied!",
      description: "Hotel details copied to clipboard",
    });
  };

  const shareConversation = () => {
    const conversationText = messages
      .map(msg => `${msg.sender === 'user' ? 'You' : 'Touristas AI'}: ${msg.content}`)
      .join('\n\n');
    
    if (navigator.share) {
      navigator.share({
        title: 'Touristas AI Conversation',
        text: conversationText,
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(conversationText);
        toast({
          title: "Copied!",
          description: "Conversation copied to clipboard",
        });
      });
    } else {
      navigator.clipboard.writeText(conversationText);
      toast({
        title: "Copied!",
        description: "Conversation copied to clipboard",
      });
    }
  };

  const clearHistory = () => {
    const greeting: Message = {
      id: Date.now().toString(),
      content: "Welcome! I'm Touristas AI, your Sifnos travel assistant. I can help you with:\n\n• Hotels & Accommodation\n• Ferries & Transportation\n• Beaches & Activities\n• Restaurants & Dining\n• Local Tips & Recommendations\n\nWhat would you like to know about Sifnos?",
      sender: 'touristas',
      timestamp: new Date(),
      suggestions: ['Budget hotels', 'Luxury hotels', 'How to get to Sifnos', 'Best beaches']
    };
    setMessages([greeting]);
    localStorage.removeItem('touristas-chat-history');
    toast({
      title: "History cleared",
      description: "Chat history has been cleared",
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 w-full sm:w-[450px] h-full sm:h-[700px] sm:max-h-[calc(100vh-3rem)] z-50 animate-fade-in"
      role="complementary"
      aria-label="Touristas AI Chat Assistant"
    >
      <div className="h-full bg-background border-2 border-border rounded-none sm:rounded-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div 
          className="bg-[#1E2E48] text-white px-4 sm:px-6 py-3 sm:py-4 rounded-t-none sm:rounded-t-2xl flex items-center justify-between border-b border-border"
          role="banner"
          aria-label="Chat header"
        >
          <div>
            <h3 className="font-heading font-bold text-lg sm:text-xl">Touristas AI</h3>
            <p className="text-xs text-white/80">Your Sifnos Travel Assistant</p>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              onClick={shareConversation}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 h-8 w-8 sm:h-10 sm:w-10"
              aria-label="Share conversation"
              title="Share conversation"
            >
              <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              onClick={clearHistory}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 h-8 w-8 sm:h-10 sm:w-10"
              aria-label="Clear history"
              title="Clear history"
            >
              <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              onClick={closeChat}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 h-8 w-8 sm:h-10 sm:w-10"
              aria-label="Close chat"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div 
          className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 bg-muted/30"
          role="log"
          aria-live="polite"
          aria-label="Chat conversation"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 sm:gap-3 ${
                message.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
              role="article"
              aria-label={`${message.sender === 'user' ? 'Your' : 'Touristas AI'} message`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                message.sender === 'touristas' 
                  ? 'bg-[#1E2E48] text-white' 
                  : 'bg-[#FFD700] text-[#1E2E48]'
              }`}>
                {message.sender === 'touristas' ? (
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <span className="font-bold text-sm">U</span>
                )}
              </div>

              {/* Message Content */}
              <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                <div className={`rounded-xl px-3 py-2 sm:px-4 sm:py-3 break-words ${
                  message.sender === 'touristas'
                    ? 'bg-background border border-border'
                    : 'bg-[#E3D7C3] text-[#1E2E48]'
                }`}>
                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>

                {/* Hotel Cards */}
                {message.hotels && message.hotels.length > 0 && (
                  <div className="space-y-2 sm:space-y-3">
                    {message.hotels.map((hotel) => (
                      <Link
                        key={hotel.id}
                        to={`/hotels/${hotel.name.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={closeChat}
                        className="block bg-background border-2 border-border hover:border-[#FFD700] rounded-lg sm:rounded-xl p-2 sm:p-3 transition-all duration-200 hover:shadow-lg group"
                      >
                        <div className="flex gap-2 sm:gap-3">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-md sm:rounded-lg overflow-hidden flex-shrink-0 bg-muted relative">
                            {(() => {
                              // Try to get hotel logo first
                              const logoUrl = determineHotelLogoUrl(hotel);
                              if (logoUrl) {
                                return (
                                  <div className="w-full h-full flex items-center justify-center bg-white p-2">
                                    <img
                                      src={logoUrl}
                                      alt={`${hotel.name} logo`}
                                      className="w-full h-full object-contain"
                                      loading="lazy"
                                      onError={(e) => {
                                        // Fallback to hotel photo if logo fails
                                        const photoUrl = hotel.hotel_photos?.[0]?.photo_url;
                                        if (photoUrl) {
                                          const imageUrl = determineHotelImageUrl(hotel, photoUrl);
                                          e.currentTarget.src = imageUrl;
                                          e.currentTarget.className = 'w-full h-full object-cover';
                                        } else {
                                          e.currentTarget.style.display = 'none';
                                          e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-muted-foreground"><svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg></div>';
                                        }
                                      }}
                                    />
                                  </div>
                                );
                              }
                              // Fallback to hotel photo
                              const photoUrl = hotel.hotel_photos?.[0]?.photo_url;
                              if (photoUrl) {
                                const imageUrl = determineHotelImageUrl(hotel, photoUrl);
                                return (
                                  <img
                                    src={imageUrl}
                                    alt={hotel.name}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                      e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-muted-foreground"><svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg></div>';
                                    }}
                                  />
                                );
                              }
                              // Final fallback to icon
                              return (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                  <MessageSquare className="h-8 w-8" />
                                </div>
                              );
                            })()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm sm:text-base text-foreground group-hover:text-[#1E2E48] truncate mb-1">
                              {hotel.name}
                            </h4>
                            <p className="text-xs sm:text-sm text-muted-foreground truncate mb-1">{hotel.location}</p>
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
                    ))}
                  </div>
                )}

                {/* Suggestion Chips */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {message.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm bg-background border border-[#1E2E48] text-[#1E2E48] rounded-full hover:bg-[#1E2E48] hover:text-white transition-colors whitespace-nowrap"
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

        {/* Input Area */}
        <div className="border-t border-border p-3 sm:p-4 bg-background rounded-b-none sm:rounded-b-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
            role="search"
            aria-label="Ask Touristas AI"
          >
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about hotels, beaches, or travel tips..."
              className="flex-1 text-sm sm:text-base"
              disabled={isTyping}
              aria-label="Type your question here"
            />
            <Button 
              type="submit" 
              size="icon"
              className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#1E2E48] flex-shrink-0"
              disabled={isTyping || !input.trim()}
              aria-label="Send message"
            >
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
