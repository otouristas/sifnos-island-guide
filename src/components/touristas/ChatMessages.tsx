
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import TouristasLogo from '@/components/TouristasLogo';
import HotelDisplayUnified from './HotelDisplayUnified';
import { UnifiedHotel } from '@/services/hotelSearch';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  showHotels?: boolean;
  hotels?: UnifiedHotel[];
  location?: string;
  preferences?: Record<string, string>;
}

interface ChatMessagesProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

// Updated message interface to handle hotel display
interface ExtendedMessage extends Message {
  hotels?: any[];
}

export default function ChatMessages({ messages, messagesEndRef }: ChatMessagesProps) {
  return (
    <ScrollArea className="flex-1 p-6">
      <div className="space-y-6">
        {messages.map((message) => (
          <div key={message.id} className="flex gap-3">
            <Avatar className="w-8 h-8 mt-1 flex-shrink-0">
              {message.role === 'user' ? (
                <>
                  <AvatarFallback className="bg-sifnos-deep-blue text-white">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </>
              ) : (
                <>
                  <AvatarImage src="/uploads/touristas-ai-logo.svg" alt="Touristas AI" />
                  <AvatarFallback className="bg-sifnos-turquoise text-white flex items-center justify-center">
                    <TouristasLogo size="sm" />
                  </AvatarFallback>
                </>
              )}
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className={`p-4 rounded-2xl max-w-[85%] ${
                message.role === 'user' 
                  ? 'bg-sifnos-deep-blue text-white ml-auto' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <div className="whitespace-pre-wrap break-words">
                  {message.content}
                </div>
              </div>
              
              {/* Show unified hotels if available */}
              {((message as any).hotels && (message as any).hotels.length > 0) && (
                <div className="mt-4">
                  <HotelDisplayUnified 
                    hotels={(message as any).hotels} 
                    location={(message as any).location}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
