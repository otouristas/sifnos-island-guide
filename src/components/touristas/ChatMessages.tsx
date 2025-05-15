
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
    <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4 sm:space-y-6">
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
        >
          <div 
            className={`flex gap-2 sm:gap-3 max-w-[80%] sm:max-w-[75%] md:max-w-[65%] ${
              message.role === 'user' 
                ? 'flex-row-reverse' 
                : 'flex-row'
            }`}
          >
            {message.role === 'user' ? (
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-sifnos-deep-blue to-blue-700 text-white flex items-center justify-center flex-shrink-0">
                <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
            ) : (
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0">
                <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
            )}
            
            <div 
              className={`rounded-2xl p-2.5 sm:p-3.5 shadow-sm overflow-hidden ${
                message.role === 'user' 
                  ? 'bg-sifnos-deep-blue text-white break-words' 
                  : 'bg-white border border-gray-200 break-words'
              }`}
            >
              <div className="whitespace-pre-wrap text-xs sm:text-sm md:text-base break-words overflow-hidden">
                {message.content}
              </div>
              
              {/* Hotel Recommendations Carousel - only show when specifically asked about hotels */}
              {message.showHotels && message.hotels && message.hotels.length > 0 && (
                <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4 w-full overflow-hidden">
                  <Separator />
                  
                  <div className="font-medium text-center px-2 py-1 mb-2 sm:mb-3 text-sm sm:text-base">
                    {message.location ? (
                      <div className="flex items-center justify-center gap-1 sm:gap-2">
                        <Hotel className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span>Recommended Hotels in {message.location.charAt(0).toUpperCase() + message.location.slice(1)}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1 sm:gap-2">
                        <Hotel className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span>Top Recommended Hotels in Sifnos</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="w-full overflow-hidden">
                    <HotelCarousel hotels={message.hotels} />
                  </div>
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
