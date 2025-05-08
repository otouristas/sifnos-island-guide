
import React from 'react';
import { Bot, User } from 'lucide-react';
import { Message } from './utils/chat-utils';
import { HotelCarousel, Separator } from './HotelDisplay';
import { Hotel } from 'lucide-react';

interface ChatMessagesProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, messagesEndRef }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
        >
          <div 
            className={`flex gap-3 max-w-[80%] ${
              message.role === 'user' 
                ? 'flex-row-reverse' 
                : 'flex-row'
            }`}
          >
            {message.role === 'user' ? (
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sifnos-deep-blue to-blue-700 text-white flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4" />
              </div>
            ) : (
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4" />
              </div>
            )}
            
            <div 
              className={`rounded-2xl p-4 shadow-sm ${
                message.role === 'user' 
                  ? 'bg-sifnos-deep-blue text-white' 
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm md:text-base">
                {message.content}
              </div>
              
              {/* Hotel Recommendations Carousel - only show when specifically asked about hotels */}
              {message.showHotels && message.hotels && message.hotels.length > 0 && (
                <div className="mt-4 space-y-4">
                  <Separator />
                  
                  <div className="font-medium text-center px-2 py-1 mb-3">
                    {message.location ? (
                      <div className="flex items-center justify-center gap-2">
                        <Hotel className="h-4 w-4" />
                        <span>Recommended Hotels in {message.location.charAt(0).toUpperCase() + message.location.slice(1)}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Hotel className="h-4 w-4" />
                        <span>Top Recommended Hotels in Sifnos</span>
                      </div>
                    )}
                  </div>
                  
                  <HotelCarousel hotels={message.hotels} />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
