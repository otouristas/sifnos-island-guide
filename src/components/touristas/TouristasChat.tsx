
import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import ChatMessages from './ChatMessages';
import { Message, isHotelRelatedQuery, extractLocationFromMessage, extractLocationsFromResponse, shouldShowHotelsInResponse } from './utils/chat-utils';
import { AIRequestMessage, searchHotels, callTouristasAI, processStreamingResponse } from './services/ChatService';

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
        // Search for hotels based on user query
        relevantHotels = await searchHotels(input);
        console.log("Found relevant hotels:", relevantHotels.length);
      }

      // Extract location from user query
      const locationFromQuery = extractLocationFromMessage(input);

      // Add temporary assistant message
      const assistantId = (Date.now() + 1).toString();
      setMessages((prev) => [...prev, { 
        id: assistantId, 
        role: 'assistant', 
        content: '', 
        location: locationFromQuery, 
        hotels: shouldShowHotels && relevantHotels.length > 0 ? relevantHotels : undefined,
        showHotels: shouldShowHotels && relevantHotels.length > 0
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
      
      // Call the AI travel assistant function
      const response = await callTouristasAI(aiMessages);
      
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
      
      if ((locationsInResponse.length > 0 || showHotelsByTrigger) && !shouldShowHotels) {
        // Fetch hotels for the mentioned locations
        let query = input;
        if (locationsInResponse.length > 0) {
          // Add locations to the query for better search results
          query = `${input} ${locationsInResponse.join(' ')}`;
        }
        
        relevantHotels = await searchHotels(query);
        
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
      <ChatMessages messages={messages} messagesEndRef={messagesEndRef} />
      
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
