
import React, { useState, useRef, useEffect } from 'react';
import { SendHorizonal, Bot, User, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import HotelCard from '@/components/HotelCard';
import { generateHotelUrl } from '@/lib/url-utils';
import { toast } from '@/hooks/use-toast';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type HotelRecommendation = {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: number;
  score: number;
  hotel_amenities: Array<{ amenity: string }>;
  hotel_photos: Array<{
    id: string;
    photo_url: string;
    is_main_photo: boolean;
  }>;
  hotel_types?: string[];
};

export default function TouristasAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m Touristas AI powered by Greececyclades.com. How can I help you find the perfect accommodation in Sifnos?',
      timestamp: new Date(),
    },
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<HotelRecommendation[]>([]);
  
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setRecommendations([]);
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('touristas-ai', {
        body: { query: input }
      });
      
      if (error) throw error;
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      if (data.hotels && data.hotels.length > 0) {
        setRecommendations(data.hotels);
      }
    } catch (error) {
      console.error('Error querying Touristas AI:', error);
      toast({
        title: "Error",
        description: "Failed to get hotel recommendations. Please try again.",
        variant: "destructive",
      });
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I couldn't process your request. Please try again later.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden h-[700px]">
      <div className="p-4 bg-sifnos-deep-blue text-white flex items-center">
        <Bot className="h-6 w-6 mr-2" />
        <h2 className="text-xl font-semibold">Touristas AI</h2>
        <span className="text-xs ml-2 bg-sifnos-turquoise rounded-full px-2 py-1">
          powered by Greececyclades.com
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-3/4 rounded-lg p-3 ${
                message.role === 'user' 
                  ? 'bg-sifnos-turquoise text-white rounded-br-none' 
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}
            >
              <div className="flex items-center mb-1">
                <Avatar className="h-6 w-6 mr-2">
                  {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </Avatar>
                <span className="text-xs opacity-75">
                  {message.role === 'user' ? 'You' : 'Touristas AI'}
                </span>
              </div>
              <div className="whitespace-pre-line">{message.content}</div>
              <div className="text-right text-xs opacity-50 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-4 rounded-bl-none flex items-center">
              <Loader2 className="h-5 w-5 mr-2 animate-spin text-sifnos-turquoise" />
              <span>Touristas AI is thinking...</span>
            </div>
          </div>
        )}
        
        {recommendations.length > 0 && (
          <div className="my-4">
            <h3 className="font-semibold text-lg mb-3">Recommended Hotels:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations.map(hotel => (
                <HotelCard key={hotel.id} hotel={hotel} showLogo={true} />
              ))}
            </div>
          </div>
        )}
        <div ref={messageEndRef} />
      </div>
      
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., I need a hotel near the beach for 5 days..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sifnos-turquoise"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="bg-sifnos-turquoise hover:bg-sifnos-deep-blue"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <SendHorizonal className="h-5 w-5" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
