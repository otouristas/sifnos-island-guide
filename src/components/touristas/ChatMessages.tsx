
import React, { useEffect } from 'react';
import { Bot, User, Hotel, MapPin, Star } from 'lucide-react';
import { Message } from './utils/chat-utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { generateHotelUrl } from '@/lib/url-utils';
import { getHotelImageUrl } from '@/utils/hotel-utils';

interface ChatMessagesProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const Separator = () => (
  <div className="flex items-center my-2 sm:my-4">
    <div className="h-px bg-gray-200 flex-grow"></div>
    <div className="mx-2 text-xs text-gray-400 font-medium">Touristas AI</div>
    <div className="h-px bg-gray-200 flex-grow"></div>
  </div>
);

const HotelCard = ({ hotel }: { hotel: any }) => {
  const hotelUrl = generateHotelUrl(hotel.name);
  
  return (
    <div className="relative overflow-hidden rounded-xl backdrop-blur-md bg-white/30 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
      <div className="relative h-36 sm:h-44 overflow-hidden">
        <img 
          src={getHotelImageUrl(hotel)}
          alt={hotel.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-3 text-white w-full">
            <div className="flex items-center gap-1.5 mb-1">
              <MapPin className="h-3.5 w-3.5 text-white/90" />
              <span className="text-xs font-medium">{hotel.location}</span>
            </div>
            {hotel.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-xs font-medium text-white/90">{hotel.rating}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-3 flex-1 flex flex-col">
        <h4 className="font-semibold text-sm sm:text-base line-clamp-2 mb-1.5 text-gray-800">{hotel.name}</h4>
        
        <div className="flex flex-wrap gap-1 mt-auto">
          {hotel.hotel_types?.slice(0, 2).map((type: string, index: number) => (
            <Badge key={index} variant="outline" className="text-xs bg-white/50 text-gray-700">
              {type.replace(/-/g, ' ')}
            </Badge>
          ))}
          
          {hotel.hotel_amenities && hotel.hotel_amenities.length > 0 && (
            <Badge variant="outline" className="text-xs bg-sifnos-deep-blue/10 text-sifnos-deep-blue">
              {hotel.hotel_amenities[0].amenity}
              {hotel.hotel_amenities.length > 1 && ` +${hotel.hotel_amenities.length - 1}`}
            </Badge>
          )}
        </div>
        
        <Link to={`/hotels/${hotelUrl}`} className="mt-3 block">
          <Button 
            size="sm" 
            variant="default" 
            className="w-full text-xs bg-sifnos-deep-blue hover:bg-sifnos-deep-blue/90 text-white rounded-full"
          >
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
};

const HotelResultsGrid = ({ hotels, location }: { hotels: any[], location?: string }) => {  
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <Hotel className="h-4 w-4 sm:h-5 sm:w-5" />
          {location ? (
            <h3 className="text-sm sm:text-base">Accommodations in {location.charAt(0).toUpperCase() + location.slice(1)}</h3>
          ) : (
            <h3 className="text-sm sm:text-base">Recommended Accommodation</h3>
          )}
        </div>
        
        <Badge className="bg-sifnos-deep-blue/90 text-xs py-1">{hotels.length} found</Badge>
      </div>
      
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 w-full">
        {hotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>
    </div>
  );
};

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, messagesEndRef }) => {
  // Debug log to check if we're correctly showing hotel results
  useEffect(() => {
    messages.forEach(msg => {
      if (msg.hotels && msg.hotels.length > 0) {
        console.log(`Message ${msg.id} has ${msg.hotels.length} hotels and showHotels=${msg.showHotels}`);
      }
    });
  }, [messages]);

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
              } overflow-hidden ${message.showHotels && message.hotels?.length > 0 ? 'w-full' : ''}`}
            >
              {/* Text content - Always render this part first */}
              <div className="whitespace-pre-wrap text-sm md:text-base break-words p-3 sm:p-4">
                {message.content}
              </div>
              
              {/* Hotel Recommendations - Only after text content is shown */}
              {message.showHotels && message.hotels && message.hotels.length > 0 && (
                <div className="mt-1 max-w-full overflow-hidden w-full">
                  <Separator />
                  
                  <div className="px-3 sm:px-4 pb-4 w-full">
                    <HotelResultsGrid hotels={message.hotels} location={message.location} />
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
