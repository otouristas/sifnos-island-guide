
import { Link } from 'react-router-dom';
import { MapPin, Star, ExternalLink } from 'lucide-react';
import { getHotelImageUrl } from '@/utils/hotel-utils';
import { generateHotelUrl } from '@/lib/url-utils';
import { HotelType } from './utils/chat-utils';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type SidebarHotelCardProps = {
  hotel: HotelType;
  className?: string;
  compact?: boolean;
  showViewButton?: boolean;
};

export const SidebarHotelCard = ({ 
  hotel, 
  className = '',
  compact = false,
  showViewButton = false
}: SidebarHotelCardProps) => {
  // Generate the URL for the hotel page
  const hotelSlug = generateHotelUrl(hotel.name);
  
  // Function to render star rating
  const renderStarRating = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
        size={12}
      />
    ));
  };

  return (
    <Link 
      to={`/hotels/${hotelSlug}`} 
      className={cn(
        "block transition-all hover:transform hover:translate-y-[-2px]",
        className
      )}
    >
      <div className={cn(
        "bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col h-full",
        compact ? "p-0" : ""
      )}>
        {/* Image Container */}
        <div className={cn(
          "relative overflow-hidden bg-gray-100",
          compact ? "h-20" : "h-24"
        )}>
          <img 
            src={getHotelImageUrl(hotel)}
            alt={hotel.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              console.error(`Failed to load image for ${hotel.name}`);
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
            loading="lazy"
          />
          {hotel.location && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1">
              <Badge variant="outline" className="bg-white/80 backdrop-blur-sm text-xs px-1.5 py-0.5">
                <MapPin size={10} className="mr-0.5" /> {hotel.location}
              </Badge>
            </div>
          )}
        </div>
        
        {/* Hotel info */}
        <div className={cn(
          "flex-grow flex flex-col justify-between",
          compact ? "p-1.5" : "p-2"
        )}>
          <div>
            <h3 className="font-medium text-xs truncate">{hotel.name}</h3>
            {hotel.hotel_types && (
              <span className="text-xs text-gray-500 truncate block">{hotel.hotel_types?.join(', ')}</span>
            )}
          </div>
          
          {/* Rating */}
          <div className="flex items-center justify-between mt-1">
            {hotel.rating && (
              <div className="flex items-center">
                {renderStarRating(hotel.rating)}
              </div>
            )}
            
            {showViewButton && (
              <div className="text-xs text-sifnos-deep-blue flex items-center">
                View <ExternalLink size={10} className="ml-0.5" />
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
