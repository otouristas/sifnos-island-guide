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
  searchHotels, 
  callTouristasAI, 
  processStreamingResponse,
  trackConversationContext,
  ConversationContext
} from './services/ChatService';

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
  const [userPreferences, setUserPreferences] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    scrollToBottom();
    
    // Scroll to top on initial load
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = 0;
    }
  }, [messages]);
  
  // Auto scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Focus on chat container
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = 0;
    }
    
    // Focus on the input field after load
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 500);
  }, []);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // Critical: Prevent default form submission behavior
    e.preventDefault();
    
    // Ensure default navigation doesn't happen
    e.stopPropagation();
    
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
      // Extract user preferences from the message
      const newPreferences = extractUserPreferencesFromMessage(input);
      
      // Update user preferences with new information
      const updatedPreferences = { ...userPreferences, ...newPreferences };
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
      
      // Add temporary assistant message - WITHOUT HOTELS INITIALLY
      const assistantId = (Date.now() + 1).toString();
      setMessages((prev) => [...prev, { 
        id: assistantId, 
        role: 'assistant', 
        content: '', 
        preferences: updatedPreferences
      }]);
      
      // Prepare messages for the AI service with correct format
      const aiMessages: AIRequestMessage[] = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        id: msg.id
      }));
      
      // Add the current user message
      aiMessages.push({
        role: userMessage.role,
        content: userMessage.content,
        id: userMessage.id
      });
      
      // Track conversation context for better continuity
      const conversationContexts: ConversationContext[] = trackConversationContext([...messages, userMessage]);
      
      // Call the AI travel assistant function with preferences and context
      const response = await callTouristasAI(aiMessages, updatedPreferences, conversationContexts);
      
      if (!response) {
        throw new Error("Failed to get response from AI");
      }
      
      // Process the streaming response
      const reader = response.getReader();
      const fullContent = await processStreamingResponse(reader, assistantId, setMessages);
      
      // Ensure we maintain focus on the chat area and don't scroll to another section
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        chatContainerRef.current.focus();
      }
      
      // Only AFTER the AI text response is complete, search for hotels if needed
      let relevantHotels: any[] = [];
      
      // Only search for hotels if it's a hotel-related query
      if (shouldShowHotels) {
        // Build the search query with all the extracted information
        let searchQuery = input;
        
        // If a specific hotel name was mentioned, prioritize that in search
        if (hotelNameFromQuery) {
          searchQuery = hotelNameFromQuery;
        }
        
        // Search for hotels based on user query and preferences
        relevantHotels = await searchHotels(searchQuery, {
          ...updatedPreferences,
          amenities: amenitiesFromQuery.length > 0 ? amenitiesFromQuery.join(',') : undefined,
          hotelName: hotelNameFromQuery || undefined
        });
        
        console.log("Found relevant hotels:", relevantHotels.length);
        
        // Filter hotels by exact amenity match if specifically requested
        if (amenitiesFromQuery.includes('pool')) {
          console.log("Filtering hotels by pool amenity");
          relevantHotels = relevantHotels.filter(hotel => 
            hotel.hotel_amenities?.some(a => 
              a.amenity.toLowerCase().includes('pool') || 
              a.amenity.toLowerCase().includes('swimming')
            )
          );
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
        
        // After getting the full response, check if we should show hotels
        const locationsInResponse = extractLocationsFromResponse(fullContent);
        const showHotelsByTrigger = shouldShowHotelsInResponse(fullContent);
        
        // Set the location to show for hotels - prioritize location from user query, then locations from response
        let locationToShow = locationFromQuery;
        if (!locationToShow && locationsInResponse.length === 1) {
          locationToShow = locationsInResponse[0];
        }
        
        // If we have hotels to show after all filtering, update the message with hotels
        if (relevantHotels.length > 0) {
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
          
          // Ensure we scroll to view the hotels within the chat container only
          setTimeout(() => {
            scrollToBottom();
            // Keep focus on the chat container
            if (chatContainerRef.current) {
              chatContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 200);
        }
      }
      
      // If no content was received, show fallback message
      if (!fullContent) {
        const fallbackMessage = locationFromQuery
          ? `I found some hotel options in ${locationFromQuery} that might interest you. Feel free to ask me more about them!`
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
      
      // Focus on the input field after sending
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  };

  return (
    <div 
      ref={chatContainerRef}
      className="flex flex-col h-[calc(100vh-200px)] min-h-[600px] rounded-xl overflow-hidden bg-gradient-to-b from-white to-gray-50 border border-gray-200 shadow-xl"
      tabIndex={0} // Make div focusable with tab order
      onClick={(e) => {
        // Keep focus within the chat when clicking inside
        e.stopPropagation();
        if (chatContainerRef.current) {
          chatContainerRef.current.focus();
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
            // Extra prevention of default form submission behavior
            handleSubmit(e);
            return false; // Additional prevention
          }} 
          className="flex gap-2" 
          onClick={(e) => e.stopPropagation()}
        >
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about hotels in Platis Gialos, Apollonia, etc..."
            className="flex-1 border-gray-300 focus-visible:ring-sifnos-deep-blue rounded-full pl-4"
            disabled={isLoading}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              // Prevent form submission on Enter key with these modifications
              if (e.key === 'Enter') {
                e.preventDefault();
                if (!isLoading && input.trim()) {
                  handleSubmit(e);
                }
              }
            }}
          />
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="bg-sifnos-deep-blue hover:bg-sifnos-deep-blue/90 rounded-full w-10 h-10 p-0 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              if (!isLoading && input.trim()) {
                handleSubmit(e);
              }
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
