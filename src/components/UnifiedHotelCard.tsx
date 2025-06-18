
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Wifi, Coffee, ExternalLink, Calendar, Award, Users } from 'lucide-react';
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
  const isLocalHotel = hotel.source === 'local';
  
  // Generate appropriate URL and image
  const hotelUrl = isAgodaHotel 
    ? hotel.agoda_data?.landingURL || hotel.landing_url || '#'
    : `/hotels/${generateHotelUrl(hotel.name)}`;
    
  const imageUrl = isAgodaHotel 
    ? hotel.agoda_data?.imageURL || hotel.image_url || '/placeholder.svg'
    : hotel.image_url || determineHotelImageUrl(hotel);

  // Get rating display
  const rating = isAgodaHotel 
    ? (hotel.agoda_data?.reviewScore || hotel.review_score || 0)
    : (hotel.rating || 0);
    
  const displayRating = isAgodaHotel 
    ? (rating / 2) // Convert 10-point to 5-point scale for stars
    : rating;

  // Price handling - only show for Agoda hotels
  const showPrice = isAgodaHotel && (hotel.agoda_data?.dailyRate || hotel.daily_rate || hotel.price_per_night);
  const price = isAgodaHotel 
    ? (hotel.agoda_data?.dailyRate || hotel.daily_rate || hotel.price_per_night || 0)
    : 0;
  const currency = isAgodaHotel ? (hotel.agoda_data?.currency || hotel.currency || 'USD') : 'EUR';

  // Get star rating
  const starRating = isAgodaHotel 
    ? (hotel.agoda_data?.starRating || hotel.star_rating || 0)
    : (hotel.star_rating || Math.round(rating));

  // Get review data
  const reviewScore = isAgodaHotel 
    ? (hotel.agoda_data?.reviewScore || hotel.review_score || 0)
    : (hotel.review_score || rating || 0);
  const reviewCount = isAgodaHotel 
    ? (hotel.agoda_data?.reviewCount || hotel.review_count || 0)
    : (hotel.review_count || 0);

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
    if (hotel.source === 'agoda' && (hotel.agoda_data?.landingURL || hotel.landing_url)) {
      window.open(hotel.agoda_data?.landingURL || hotel.landing_url, '_blank', 'noopener,noreferrer');
    } else if (onSelect) {
      onSelect(hotel);
    }
  };

  const CardContentComponent = () => (
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
          {isAgodaHotel ? (
            <Badge variant="secondary" className="bg-blue-600 text-white hover:bg-blue-700">
              <ExternalLink className="w-3 h-3 mr-1" />
              Agoda Partner
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-green-600 text-white hover:bg-green-700">
              <Award className="w-3 h-3 mr-1" />
              Local Partner
            </Badge>
          )}
        </div>

        {/* Discount badge for Agoda */}
        {isAgodaHotel && hotel.agoda_data?.discountPercentage > 0 && (
          <div className="absolute top-3 right-3">
            <Badge variant="destructive" className="bg-red-500 text-white">
              {hotel.agoda_data.discountPercentage}% OFF
            </Badge>
          </div>
        )}

        {/* Local hotel quality indicator */}
        {isLocalHotel && starRating >= 4 && (
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-amber-500 text-white">
              <Award className="w-3 h-3 mr-1" />
              Premium
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
          
          {/* Price section - only for Agoda hotels */}
          {showPrice && (
            <div className="text-right ml-3">
              <div className="text-2xl font-bold text-green-600">
                {formatPrice(price, currency)}
              </div>
              <div className="text-sm text-gray-500">per night</div>
            </div>
          )}

          {/* Local hotel - show "Contact for rates" */}
          {isLocalHotel && (
            <div className="text-right ml-3">
              <div className="text-sm font-medium text-blue-600">
                Contact for Rates
              </div>
              <div className="text-xs text-gray-500">Direct booking</div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Star rating and reviews */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {starRating > 0 && renderStarRating(displayRating)}
            <span className="text-sm text-gray-600">
              {starRating || 'N/A'} stars
            </span>
          </div>
          
          {reviewScore > 0 && (
            <div className="flex items-center gap-1">
              <div className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium">
                {reviewScore.toFixed(1)}
              </div>
              <span className="text-sm text-gray-600">
                ({reviewCount || 0} reviews)
              </span>
            </div>
          )}
        </div>

        {/* Enhanced amenities display */}
        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {hotel.amenities.slice(0, 4).map((amenity, index) => {
              const getAmenityIcon = (amenity: string) => {
                const amenityLower = amenity.toLowerCase();
                if (amenityLower.includes('wifi') || amenityLower.includes('internet')) return <Wifi className="w-3 h-3" />;
                if (amenityLower.includes('breakfast') || amenityLower.includes('coffee')) return <Coffee className="w-3 h-3" />;
                if (amenityLower.includes('pool') || amenityLower.includes('swimming')) return <Users className="w-3 h-3" />;
                return null;
              };

              return (
                <Badge key={index} variant="outline" className="text-xs flex items-center gap-1">
                  {getAmenityIcon(amenity)}
                  {amenity}
                </Badge>
              );
            })}
            {hotel.amenities.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{hotel.amenities.length - 4} more
              </Badge>
            )}
          </div>
        )}

        {/* Special Agoda features */}
        {isAgodaHotel && hotel.agoda_data && (
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

        {/* Description - enhanced for local hotels */}
        {hotel.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {hotel.description}
          </p>
        )}

        {/* Local hotel special features */}
        {isLocalHotel && hotel.hotel_rooms && hotel.hotel_rooms.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
              <Users className="w-3 h-3 mr-1" />
              {hotel.hotel_rooms.length} room types
            </Badge>
          </div>
        )}

        {/* Action button */}
        <Button 
          onClick={handleBooking}
          className="w-full mt-4"
          variant={isAgodaHotel ? 'default' : 'outline'}
        >
          {isAgodaHotel ? (
            <>
              <ExternalLink className="w-4 h-4 mr-2" />
              Book on Agoda
            </>
          ) : (
            <>
              <Calendar className="w-4 h-4 mr-2" />
              View Details & Contact
            </>
          )}
        </Button>

        {/* Hotel source indicator */}
        <div className="text-xs text-gray-400 mt-2 flex items-center justify-between">
          <span>
            {isAgodaHotel ? 'Live pricing from Agoda' : 'Local Sifnos hotel'}
          </span>
          {process.env.NODE_ENV === 'development' && (
            <span>ID: {hotel.id}</span>
          )}
        </div>
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
        <CardContentComponent />
      </a>
    );
  }

  return (
    <Link to={hotelUrl} className="block hover:no-underline">
      <CardContentComponent />
    </Link>
  );
};

export { UnifiedHotelCard };
export default UnifiedHotelCard;
