
import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles, Clock, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import ChatMessages from '../ChatMessages';
import { AIMessage } from './TouristasAITypes';
import { 
  Message, 
  isHotelRelatedQuery, 
  extractLocationFromMessage, 
  extractUserPreferencesFromMessage
} from '../utils/chat-utils';

const quickPrompts = [
  { id: '1', text: "Show me luxury hotels in Platis Gialos with live pricing", category: 'real_time' as const, keywords: ['luxury', 'live pricing'] },
  { id: '2', text: "What are the best beaches in Sifnos?", category: 'local_content' as const, keywords: ['beaches'] },
  { id: '3', text: "Find family-friendly hotels in Apollonia", category: 'local_hotels' as const, keywords: ['family'] },
  { id: '4', text: "Compare local vs online booking options", category: 'hybrid' as const, keywords: ['booking options'] },
  { id: '5', text: "Plan a 5-day itinerary for Sifnos", category: 'general' as const, keywords: ['itinerary'] },
  { id: '6', text: "Test hotel search functionality", category: 'test' as const, keywords: ['test'] }
];

export default function EnhancedTouristasChat() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '🏛️ Καλώς ήρθατε! Welcome to Touristas AI - your intelligent Sifnos travel companion!\n\nI can help you with:\n• 🏨 Hotel recommendations (local expertise + live pricing)\n• 🏖️ Beach and location guides\n• 📅 Travel planning and itineraries\n• 💡 Insider tips and local insights\n\nTry asking about hotels in specific areas like "Show me hotels in Platis Gialos" or use the quick prompts below!',
      showHotels: false
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleQuickPrompt = (promptText: string) => {
    setInput(promptText);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Extract preferences from message
      const preferences = extractUserPreferencesFromMessage(input);
      const location = extractLocationFromMessage(input);
      const isHotelQuery = isHotelRelatedQuery(input);

      // Simulate AI response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand you're looking for information about ${location || 'Sifnos'}. Let me help you with that!`,
        location: location || undefined,
        preferences
      };

      // Add a delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error in AI chat:', error);
      toast({
        title: 'Error',
        description: 'Failed to get AI response. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPromptsByCategory = (category: string) => {
    return quickPrompts.filter(prompt => prompt.category === category);
  };

  const renderQuickPrompts = () => {
    const categories = ['real_time', 'local_content', 'local_hotels', 'hybrid'];
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {categories.map(category => {
          const prompts = getPromptsByCategory(category);
          if (prompts.length === 0) return null;

          const categoryIcons = {
            real_time: <Clock className="h-4 w-4" />,
            local_content: <Lightbulb className="h-4 w-4" />,
            local_hotels: <Sparkles className="h-4 w-4" />,
            hybrid: <Send className="h-4 w-4" />
          };

          const categoryTitles = {
            real_time: 'Live Data',
            local_content: 'Local Insights', 
            local_hotels: 'Local Hotels',
            hybrid: 'Booking Options'
          };

          return (
            <Card key={category} className="p-4">
              <div className="flex items-center gap-2 mb-3">
                {categoryIcons[category as keyof typeof categoryIcons]}
                <h3 className="font-semibold text-sm">
                  {categoryTitles[category as keyof typeof categoryTitles]}
                </h3>
              </div>
              <div className="space-y-2">
                {prompts.slice(0, 2).map(prompt => (
                  <Button
                    key={prompt.id}
                    variant="outline"
                    size="sm"
                    className="w-full text-left justify-start h-auto py-2 px-3 text-xs"
                    onClick={() => handleQuickPrompt(prompt.text)}
                  >
                    {prompt.text}
                  </Button>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-xl">
      <CardContent className="p-0">
        <div className="flex flex-col h-[600px]">
          {/* Header */}
          <div className="border-b border-gray-200 p-4 bg-gradient-to-r from-sifnos-deep-blue to-sifnos-turquoise text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <img 
                  src="/uploads/touristas-ai-logo.svg" 
                  alt="Touristas AI" 
                  className="h-6 w-6"
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Touristas AI</h2>
                <p className="text-sm text-white/80">Your Intelligent Sifnos Travel Assistant</p>
              </div>
              <div className="ml-auto">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Enhanced
                </Badge>
              </div>
            </div>
          </div>

          {/* Quick Prompts - Only show when no messages or just welcome */}
          {messages.length <= 1 && (
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Quick Start Options</h3>
              {renderQuickPrompts()}
            </div>
          )}

          {/* Chat Messages */}
          <ChatMessages messages={messages} messagesEndRef={messagesEndRef} />

          {/* Input Form */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about hotels, beaches, or plan your Sifnos trip..."
                className="flex-1 border-gray-300 focus-visible:ring-sifnos-deep-blue rounded-full pl-4"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="bg-sifnos-deep-blue hover:bg-sifnos-deep-blue/90 rounded-full w-10 h-10 p-0 flex items-center justify-center"
              >
                {isLoading ? 
                  <Loader2 className="h-5 w-5 animate-spin" /> : 
                  <Send className="h-5 w-5" />
                }
              </Button>
            </form>
            
            {/* Status indicator */}
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>AI-powered by 200+ trained agents</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Online</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
