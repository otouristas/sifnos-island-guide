
import { useState, useRef, useEffect, useCallback } from 'react';
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
  AIRequestMessage,
  ConversationContext
} from './utils/chat-utils';
import { 
  searchHotels, 
  callTouristasAI, 
  processStreamingResponse,
  trackConversationContext
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
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Debounced scroll to bottom for better performance
  const scrollToBottom = useCallback(() => {
    if (!messagesEndRef.current) return;
    
    // Use requestAnimationFrame for smoother scrolling
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
  }, []);
  
  // Use a separate effect to handle scroll position updates
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);
  
  // Prevent input field from causing scroll jumps
  const handleInputFocus = useCallback(() => {
    // Prevent auto-scrolling when input is focused
    if (chatContainerRef.current) {
      const currentScroll = chatContainerRef.current.scrollTop;
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = currentScroll;
        }
      }, 10);
    }
  }, []);

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
      // Extract user preferences from the message
      const newPreferences = extractUserPreferencesFromMessage(input);
      
      // Update user preferences with new information
      const updatedPreferences = { ...userPreferences, ...newPreferences };
      setUserPreferences(updatedPreferences);
      
      // Check if this is a hotel-related query
      const shouldShowHotels = isHotelRelatedQuery(input);
      let relevantHotels: any[] = [];
      
      // Extract location and amenities from user query
      const locationFromQuery = extractLocationFromMessage(input);
      const amenitiesFromQuery = extractAmenityFromMessage(input);
      
      console.log('Extracted preferences:', updatedPreferences);
      console.log('Location from query:', locationFromQuery);
      console.log('Amenities from query:', amenitiesFromQuery);
      console.log('Should show hotels:', shouldShowHotels);
      
      // Update preferences with amenities if any were found
      if (amenitiesFromQuery.length > 0) {
        updatedPreferences.amenity = amenitiesFromQuery[0]; // Use the first amenity found
      }
      
      // Only search for hotels if it's a hotel-related query
      if (shouldShowHotels) {
        // Search for hotels based on user query and preferences
        relevantHotels = await searchHotels(input, updatedPreferences);
        console.log("Found relevant hotels:", relevantHotels.length);
      }

      // Add temporary assistant message
      const assistantId = (Date.now() + 1).toString();
      setMessages((prev) => [...prev, { 
        id: assistantId, 
        role: 'assistant', 
        content: '', 
        location: locationFromQuery, 
        hotels: shouldShowHotels && relevantHotels.length > 0 ? relevantHotels : undefined,
        showHotels: shouldShowHotels && relevantHotels.length > 0,
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
      
      // After getting the full response, check if we should show hotels
      const locationsInResponse = extractLocationsFromResponse(fullContent);
      const showHotelsByTrigger = shouldShowHotelsInResponse(fullContent);
      
      // Set the location to show for hotels - prioritize location from user query, then locations from response
      let locationToShow = locationFromQuery;
      if (!locationToShow && locationsInResponse.length === 1) {
        locationToShow = locationsInResponse[0];
      }
      
      // Handle cases where original search didn't include hotels but the response suggests hotels
      if ((locationsInResponse.length > 0 || showHotelsByTrigger || amenitiesFromQuery.length > 0) && !shouldShowHotels) {
        let searchTerm = input;
        
        // Prioritize location from query, then from response
        if (locationToShow) {
          // Add explicit location query to ensure correct results
          searchTerm = `hotels in ${locationToShow}`;
        }
        
        // If amenities were mentioned in the question, add them to the search
        if (amenitiesFromQuery.length > 0) {
          searchTerm = `${searchTerm} ${amenitiesFromQuery.join(' ')}`;
        }
        
        console.log("Second search with term:", searchTerm);
        
        // Perform hotel search with enhanced query
        relevantHotels = await searchHotels(searchTerm, {
          ...updatedPreferences,
          location: locationToShow // Ensure location is explicitly set in preferences
        });
        
        console.log("Second search found hotels:", relevantHotels.length);
        
        if (relevantHotels.length > 0) {
          // Update message to include hotels
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
        }
      }
      
      // If no content was received, show fallback message
      if (!fullContent) {
        const fallbackMessage = locationToShow
          ? `I found some hotel options in ${locationToShow} that might interest you. Feel free to ask me more about them!`
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
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto">
        <ChatMessages messages={messages} messagesEndRef={messagesEndRef} />
      </div>
      
      {/* Input Form */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={handleInputFocus}
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
