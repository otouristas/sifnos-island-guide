import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import ChatMessages from './ChatMessages';
import { 
  Message, 
  isHotelRelatedQuery, 
  extractLocationFromMessage, 
  extractAmenityFromMessage,
  extractLocationsFromResponse, 
  shouldShowHotelsInResponse,
  extractUserPreferencesFromMessage,
  extractHotelNameFromMessage
} from './utils/chat-utils';
import { 
  AIRequestMessage, 
  callTouristasAI, 
  processStreamingResponse,
  trackConversationContext,
  ConversationContext
} from './services/ChatService';
import { searchHotelsUnified, extractDatesFromMessage } from './services/UnifiedHotelSearchService';

export default function TouristasChat() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Γεια σου! 👋 I\'m your Sifnos travel assistant. I can help you find hotels, check availability, and provide travel advice for Sifnos. Ask me about specific locations like Platis Gialos, Apollonia, Kamares, or search for hotels with specific dates!',
      showHotels: false
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userPreferences, setUserPreferences] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Effect to scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Keep focus within the chat container
    if (chatContainerRef.current) {
      chatContainerRef.current.focus();
    }
  }, [messages]);
  
  // Auto focus and scroll management on page load
  useEffect(() => {
    // Focus on the input field after load
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
      
      // Ensure we're at the correct scroll position within the chat
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
      }
    }, 300);
    
    // Set up click handler to keep focus in chat
    const handleOutsideClick = (e: MouseEvent) => {
      // If we click inside the chat, do nothing special
      if (chatContainerRef.current?.contains(e.target as Node)) {
        return;
      }
      
      // If we click outside, prevent any scroll changes
      e.preventDefault();
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);
  
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // Critical: Prevent ALL default form behavior
    e.preventDefault();
    e.stopPropagation();
    
    // Prevent any scrolling of the page
    window.scrollTo({
      top: window.scrollY,
      behavior: 'auto'
    });
    
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
    
    // Keep focus on input
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
      
      // Ensure we stay in the chat container
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollIntoView({ block: 'start', behavior: 'auto' });
      }
    }, 50);
    
    try {
      // Extract user preferences and dates from the message
      const newPreferences = extractUserPreferencesFromMessage(input);
      const datesFromMessage = extractDatesFromMessage(input);
      
      // Update user preferences with new information including dates
      const updatedPreferences = { 
        ...userPreferences, 
        ...newPreferences,
        ...(datesFromMessage.checkInDate && { checkInDate: datesFromMessage.checkInDate }),
        ...(datesFromMessage.checkOutDate && { checkOutDate: datesFromMessage.checkOutDate })
      };
      setUserPreferences(updatedPreferences);
      
      // Check if this is a hotel-related query
      const shouldShowHotels = isHotelRelatedQuery(input);
      
      // Extract location, amenities, and specific hotel name from user query
      const locationFromQuery = extractLocationFromMessage(input);
      const amenitiesFromQuery = extractAmenityFromMessage(input);
      const hotelNameFromQuery = extractHotelNameFromMessage(input);
      
      console.log('Extracted preferences:', updatedPreferences);
      console.log('Location from query:', locationFromQuery);
      console.log('Amenities from query:', amenitiesFromQuery);
      console.log('Hotel name from query:', hotelNameFromQuery);
      console.log('Should show hotels:', shouldShowHotels);
      
      // Add temporary assistant message
      const assistantId = (Date.now() + 1).toString();
      setMessages((prev) => [...prev, { 
        id: assistantId, 
        role: 'assistant', 
        content: '', 
        preferences: updatedPreferences
      }]);
      
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      
      // Prepare messages for the AI service
      const aiMessages: AIRequestMessage[] = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        id: msg.id
      }));
      
      aiMessages.push({
        role: userMessage.role,
        content: userMessage.content,
        id: userMessage.id
      });
      
      // Track conversation context for better continuity
      const conversationContexts: ConversationContext[] = trackConversationContext([...messages, userMessage]);
      
      // Call the AI travel assistant function
      const response = await callTouristasAI(aiMessages, updatedPreferences, conversationContexts);
      
      if (!response) {
        throw new Error("Failed to get response from AI");
      }
      
      // Process the streaming response
      const reader = response.getReader();
      const fullContent = await processStreamingResponse(reader, assistantId, setMessages);
      
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
        chatContainerRef.current.focus();
      }
      
      // Search for hotels using unified search if needed
      let relevantHotels: any[] = [];
      
      if (shouldShowHotels) {
        let searchQuery = input;
        
        if (hotelNameFromQuery) {
          searchQuery = hotelNameFromQuery;
        }
        
        // Search for hotels using unified search with enhanced preferences
        const searchPreferences = {
          ...updatedPreferences,
          location: locationFromQuery || undefined,
          amenities: amenitiesFromQuery.length > 0 ? amenitiesFromQuery.join(',') : undefined,
          hotelName: hotelNameFromQuery || undefined
        };
        
        console.log('Searching with preferences:', searchPreferences);
        
        relevantHotels = await searchHotelsUnified(searchQuery, searchPreferences);
        
        console.log("Found relevant hotels:", relevantHotels.length);
        
        // Filter hotels by exact amenity match if specifically requested
        if (amenitiesFromQuery.includes('pool')) {
          console.log("Filtering hotels by pool amenity");
          relevantHotels = relevantHotels.filter(hotel => {
            if (hotel.source === 'local') {
              return hotel.hotel_amenities?.some((a: any) => 
                a.amenity.toLowerCase().includes('pool') || 
                a.amenity.toLowerCase().includes('swimming')
              );
            }
            // For Agoda hotels, we don't have detailed amenity data in this implementation
            return true;
          });
          console.log("After pool filter:", relevantHotels.length);
        }
        
        // Handle specific villa request
        if (hotelNameFromQuery === 'villa' || (hotelNameFromQuery && hotelNameFromQuery.includes('Villa'))) {
          console.log("Filtering for villas only");
          relevantHotels = relevantHotels.filter(hotel => 
            hotel.name.toLowerCase().includes('villa')
          );
          console.log("After villa filter:", relevantHotels.length);
        }
        
        const locationsInResponse = extractLocationsFromResponse(fullContent);
        const showHotelsByTrigger = shouldShowHotelsInResponse(fullContent);
        
        let locationToShow = locationFromQuery;
        if (!locationToShow && locationsInResponse.length === 1) {
          locationToShow = locationsInResponse[0];
        }
        
        console.log("Final hotels to show:", relevantHotels.length, "for location:", locationToShow);
        
        if (relevantHotels.length > 0) {
          console.log("Updating message with unified hotels");
          setMessages((prev) => 
            prev.map(msg => 
              msg.id === assistantId 
                ? { 
                    ...msg, 
                    hotels: relevantHotels,
                    showHotels: true,
                    location: locationToShow
                  } 
                : msg
            )
          );
          
          setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 150);
        } else {
          console.log("No hotels found to display");
        }
      }
      
      // If no content was received, show fallback message
      if (!fullContent) {
        const fallbackMessage = locationFromQuery
          ? `I found some accommodation options in ${locationFromQuery} that might interest you. Feel free to ask me more about them!`
          : "I found some accommodation options in Sifnos that might interest you. Feel free to ask me more about them!";
          
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
      
      // Focus on the input field after sending and ensure we're in the chat area
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
        
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
        
        // Final scroll to bottom to show everything
        setTimeout(scrollToBottom, 200);
      }, 100);
    }
  };

  return (
    <div 
      ref={chatContainerRef}
      className="flex flex-col h-[calc(100vh-200px)] min-h-[600px] rounded-xl overflow-hidden bg-gradient-to-b from-white to-gray-50 border border-gray-200 shadow-xl"
      tabIndex={-1} // Make div focusable, but not in the tab order
      onClick={(e) => {
        // Prevent any default scroll behavior when clicking inside chat
        e.preventDefault();
        e.stopPropagation();
        
        // Keep focus within the chat
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }}
    >
      {/* Chat Messages */}
      <ChatMessages messages={messages} messagesEndRef={messagesEndRef} />
      
      {/* Input Form */}
      <div className="border-t border-gray-200 p-4 bg-white/90 backdrop-blur-sm">
        <form 
          ref={formRef} 
          onSubmit={(e) => {
            handleSubmit(e);
            return false; // Additional prevention of submission
          }} 
          className="flex gap-2"
          onClick={(e) => {
            // Prevent propagation to keep event within form
            e.stopPropagation();
          }}
        >
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about hotels in Platis Gialos, check availability for specific dates..."
            className="flex-1 border-gray-300 focus-visible:ring-sifnos-deep-blue rounded-full pl-4"
            disabled={isLoading}
            onClick={(e) => {
              // Prevent any scroll changes
              e.stopPropagation();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (!isLoading && input.trim()) {
                  handleSubmit(e);
                }
                // Prevent any scroll behavior
                if (chatContainerRef.current) {
                  chatContainerRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
                }
                return false;
              }
            }}
          />
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="bg-sifnos-deep-blue hover:bg-sifnos-deep-blue/90 rounded-full w-10 h-10 p-0 flex items-center justify-center"
            onClick={(e) => {
              // Prevent default behavior and stop propagation
              e.preventDefault();
              e.stopPropagation();
              
              if (!isLoading && input.trim()) {
                handleSubmit(e);
              }
              
              // Prevent any scroll changes
              return false;
            }}
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
