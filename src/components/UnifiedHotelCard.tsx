
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Wifi, Coffee, ExternalLink, Calendar } from 'lucide-react';
import { generateHotelUrl } from '@/lib/url-utils';
import { determineHotelImageUrl } from '@/utils/image-utils';
import FavoriteButton from '@/components/auth/FavoriteButton';
import { UnifiedHotel } from '@/services/hotelSearch';

interface UnifiedHotelCardProps {
  hotel: UnifiedHotel;
  className?: string;
}

const UnifiedHotelCard = ({ hotel, className = '' }: UnifiedHotelCardProps) => {
  const isAgodaHotel = hotel.source === 'agoda';
  
  // Generate appropriate URL and image
  const hotelUrl = isAgodaHotel 
    ? hotel.landing_url || '#'
    : `/hotels/${generateHotelUrl(hotel.name)}`;
    
  const imageUrl = isAgodaHotel 
    ? hotel.image_url || '/placeholder.svg'
    : determineHotelImageUrl(hotel);

  // Get rating display
  const rating = isAgodaHotel 
    ? (hotel.review_score || 0)
    : (hotel.rating || 0);
    
  const maxRating = isAgodaHotel ? 10 : 5;
  const displayRating = isAgodaHotel 
    ? (rating / 2) // Convert 10-point to 5-point scale for stars
    : rating;

  // Get price display
  const price = isAgodaHotel ? hotel.daily_rate : hotel.price;
  const currency = isAgodaHotel ? hotel.currency : 'EUR';

  // Render star rating
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={i < Math.round(displayRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
        size={16}
      />
    ));
  };

  const CardContent = () => (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}>
      {/* Source Badge */}
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={hotel.name} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          {isAgodaHotel && (
            <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
              Agoda Partner
            </Badge>
          )}
          {hotel.discount_percentage && hotel.discount_percentage > 0 && (
            <Badge className="bg-red-500 hover:bg-red-600 text-white">
              -{hotel.discount_percentage}%
            </Badge>
          )}
        </div>
        {!isAgodaHotel && (
          <div className="absolute top-2 left-2">
            <FavoriteButton hotelId={hotel.id} />
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {hotel.name}
          </h3>
          {isAgodaHotel && (
            <ExternalLink size={16} className="text-gray-400 flex-shrink-0 ml-2" />
          )}
        </div>

        {hotel.location && (
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin size={14} className="mr-1" />
            <span className="text-sm">{hotel.location}</span>
          </div>
        )}

        {/* Star Rating */}
        <div className="flex items-center mb-2">
          {renderStars(displayRating)}
          <span className="ml-2 text-sm text-gray-600">
            {rating.toFixed(1)}/{maxRating}
            {isAgodaHotel && hotel.review_count && (
              <span className="text-xs text-gray-500"> ({hotel.review_count} reviews)</span>
            )}
          </span>
        </div>

        {/* Amenities */}
        <div className="flex items-center gap-3 mb-3">
          {(isAgodaHotel ? hotel.free_wifi : hotel.hotel_amenities?.some(a => a.amenity.toLowerCase().includes('wifi'))) && (
            <div className="flex items-center text-gray-600">
              <Wifi size={14} className="mr-1" />
              <span className="text-xs">Free WiFi</span>
            </div>
          )}
          {(isAgodaHotel ? hotel.include_breakfast : hotel.hotel_amenities?.some(a => a.amenity.toLowerCase().includes('breakfast'))) && (
            <div className="flex items-center text-gray-600">
              <Coffee size={14} className="mr-1" />
              <span className="text-xs">Breakfast</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex justify-between items-center">
          <div>
            {hotel.crossed_out_rate && hotel.crossed_out_rate > (price || 0) && (
              <span className="text-sm text-gray-500 line-through">
                {currency} {hotel.crossed_out_rate}
              </span>
            )}
            <div className="text-xl font-bold text-sifnos-deep-blue">
              {currency} {price}
              <span className="text-sm font-normal text-gray-600">/night</span>
            </div>
          </div>
          
          {isAgodaHotel && (
            <div className="flex items-center text-xs text-gray-500">
              <Calendar size={12} className="mr-1" />
              Live rates
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // For Agoda hotels, use external link; for local hotels, use internal routing
  if (isAgodaHotel) {
    return (
      <a 
        href={hotelUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block hover:no-underline"
      >
        <CardContent />
      </a>
    );
  }

  return (
    <Link to={hotelUrl} className="block hover:no-underline">
      <CardContent />
    </Link>
  );
};

export default UnifiedHotelCard;
