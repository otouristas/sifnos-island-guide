import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Wifi, Coffee, ExternalLink, Calendar } from 'lucide-react';
import { generateHotelUrl } from '@/lib/url-utils';
import { determineHotelImageUrl } from '@/utils/image-utils';
import FavoriteButton from '@/components/auth/FavoriteButton';
import { Hotel } from '@/services/hotelSearch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UnifiedHotelCardProps {
  hotel: Hotel;
  onSelect?: (hotel: Hotel) => void;
}

const UnifiedHotelCard = ({ hotel, onSelect }: UnifiedHotelCardProps) => {
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

  const formatPrice = (price: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating) 
                ? "fill-yellow-400 text-yellow-400" 
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const handleBooking = () => {
    if (hotel.source === 'agoda' && hotel.agoda_data?.landingURL) {
      window.open(hotel.agoda_data.landingURL, '_blank', 'noopener,noreferrer');
    } else if (onSelect) {
      onSelect(hotel);
    }
  };

  const CardContent = () => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <div className="relative">
        <img
          src={imageUrl}
          alt={hotel.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        
        {/* Source badge */}
        <div className="absolute top-3 left-3">
          {hotel.source === 'agoda' ? (
            <Badge variant="secondary" className="bg-blue-600 text-white hover:bg-blue-700">
              <ExternalLink className="w-3 h-3 mr-1" />
              Agoda Partner
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-green-600 text-white hover:bg-green-700">
              <MapPin className="w-3 h-3 mr-1" />
              Local Partner
            </Badge>
          )}
        </div>

        {/* Discount badge */}
        {hotel.source === 'agoda' && hotel.agoda_data?.discountPercentage > 0 && (
          <div className="absolute top-3 right-3">
            <Badge variant="destructive" className="bg-red-500 text-white">
              {hotel.agoda_data.discountPercentage}% OFF
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors">
              {hotel.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 text-sm text-gray-600 mt-1">
              <MapPin className="w-3 h-3" />
              {hotel.location}
            </CardDescription>
          </div>
          
          <div className="text-right ml-3">
            <div className="text-2xl font-bold text-green-600">
              {formatPrice(hotel.price_per_night, hotel.source === 'agoda' ? hotel.agoda_data?.currency : 'USD')}
            </div>
            <div className="text-sm text-gray-500">per night</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Star rating and reviews */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hotel.star_rating && renderStarRating(hotel.star_rating)}
            <span className="text-sm text-gray-600">
              {hotel.star_rating || 'N/A'} stars
            </span>
          </div>
          
          {hotel.review_score && (
            <div className="flex items-center gap-1">
              <div className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium">
                {hotel.review_score.toFixed(1)}
              </div>
              <span className="text-sm text-gray-600">
                ({hotel.review_count || 0} reviews)
              </span>
            </div>
          )}
        </div>

        {/* Amenities */}
        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {hotel.amenities.slice(0, 3).map((amenity, index) => {
              const getAmenityIcon = (amenity: string) => {
                if (amenity.toLowerCase().includes('wifi')) return <Wifi className="w-3 h-3" />;
                if (amenity.toLowerCase().includes('breakfast')) return <Coffee className="w-3 h-3" />;
                return null;
              };

              return (
                <Badge key={index} variant="outline" className="text-xs flex items-center gap-1">
                  {getAmenityIcon(amenity)}
                  {amenity}
                </Badge>
              );
            })}
            {hotel.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{hotel.amenities.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Special Agoda features */}
        {hotel.source === 'agoda' && hotel.agoda_data && (
          <div className="flex flex-wrap gap-2">
            {hotel.agoda_data.freeWifi && (
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                <Wifi className="w-3 h-3 mr-1" />
                Free WiFi
              </Badge>
            )}
            {hotel.agoda_data.includeBreakfast && (
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                <Coffee className="w-3 h-3 mr-1" />
                Breakfast Included
              </Badge>
            )}
          </div>
        )}

        {/* Description */}
        {hotel.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {hotel.description}
          </p>
        )}

        {/* Action button */}
        <Button 
          onClick={handleBooking}
          className="w-full mt-4"
          variant={hotel.source === 'agoda' ? 'default' : 'outline'}
        >
          {hotel.source === 'agoda' ? (
            <>
              <ExternalLink className="w-4 h-4 mr-2" />
              Book on Agoda
            </>
          ) : (
            'View Details'
          )}
        </Button>

        {/* Hotel ID for debugging */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs text-gray-400 mt-2">
            ID: {hotel.id} | Source: {hotel.source}
            {hotel.agoda_hotel_id && ` | Agoda ID: ${hotel.agoda_hotel_id}`}
          </div>
        )}
      </CardContent>
    </Card>
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

export { UnifiedHotelCard };
export default UnifiedHotelCard;
