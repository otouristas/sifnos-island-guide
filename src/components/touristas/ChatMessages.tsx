
import React from 'react';
import { Bot, User, Hotel } from 'lucide-react';
import { Message } from './utils/chat-utils';
import { HotelCarousel, Separator } from './HotelDisplay';

interface ChatMessagesProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, messagesEndRef }) => {
  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-5 sm:space-y-7">
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
        >
          <div 
            className={`flex gap-3 max-w-[95%] sm:max-w-[85%] ${
              message.role === 'user' 
                ? 'flex-row-reverse' 
                : 'flex-row'
            }`}
          >
            {message.role === 'user' ? (
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-sifnos-deep-blue to-blue-700 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            ) : (
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            )}
            
            <div 
              className={`rounded-2xl shadow-sm backdrop-blur-sm ${
                message.role === 'user' 
                  ? 'bg-gradient-to-r from-sifnos-deep-blue to-blue-700 text-white' 
                  : 'bg-white/95 border border-gray-100 shadow-md'
              } overflow-hidden`}
            >
              {/* Text content - Always render this part first */}
              <div className="whitespace-pre-wrap text-sm md:text-base break-words p-3 sm:p-4">
                {message.content}
              </div>
              
              {/* Hotel Recommendations - Only after text content is shown */}
              {message.showHotels && message.hotels && message.hotels.length > 0 && (
                <div className="mt-1 space-y-3 max-w-full overflow-hidden">
                  <Separator />
                  
                  <div className="font-medium text-center px-2 py-2 text-sm sm:text-base">
                    {message.location ? (
                      <div className="flex items-center justify-center gap-2">
                        <Hotel className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span>Accommodation in {message.location.charAt(0).toUpperCase() + message.location.slice(1)}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Hotel className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span>Recommended Accommodation</span>
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
