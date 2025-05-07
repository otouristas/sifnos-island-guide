
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Star, Award } from 'lucide-react';
import { generateHotelUrl } from '@/lib/url-utils';
import { determineHotelImageUrl, determineHotelLogoUrl } from '@/utils/image-utils';

interface SponsoredHotelCardProps {
  hotel: any;
}

const SponsoredHotelCard = ({ hotel }: SponsoredHotelCardProps) => {
  const hotelSlug = generateHotelUrl(hotel.name);
  
  // Special styling for ALK Hotel
  const mainPhotoUrl = determineHotelImageUrl(hotel, 'alk-hotel-sifnos/alk-hotel-feature.jpeg');
  const logoUrl = determineHotelLogoUrl(hotel) || 'uploads/hotels/alk-hotel-sifnos/logo.png';
  
  // Get rating stars
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={i < Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
        size={16}
      />
    ));
  };

  return (
    <div className="relative col-span-full mb-4">
      <div className="bg-gradient-to-r from-[#1A1F2C] to-[#6E59A5] rounded-lg shadow-xl overflow-hidden transition-transform hover:shadow-2xl transform hover:-translate-y-1">
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white font-semibold px-3 py-1 flex items-center gap-1">
            <Award size={14} className="mr-1" /> SPONSORED
          </Badge>
        </div>
        
        <Link to={`/hotels/${hotelSlug}`} className="block">
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="md:w-2/5 relative">
              <div className="h-64 md:h-full overflow-hidden">
                <img 
                  src={mainPhotoUrl} 
                  alt={hotel.name} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
              </div>
            </div>
            
            {/* Content Section */}
            <div className="md:w-3/5 p-6 bg-gradient-to-b from-[#1A1F2C] to-[#302A43] text-white">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  {logoUrl && (
                    <img 
                      src={logoUrl} 
                      alt={`${hotel.name} logo`} 
                      className="h-12 mr-3"
                    />
                  )}
                  <h3 className="text-2xl font-bold">{hotel.name}</h3>
                </div>
                <div className="flex items-center bg-[#9b87f5] px-3 py-1 rounded-full">
                  <span className="font-bold text-lg mr-1">{hotel.rating?.toFixed(1) || "5.0"}</span>
                  <span className="text-xs opacity-90">/ 5</span>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                {renderStars(hotel.rating || 5)}
                <span className="ml-2 text-sm text-gray-300">{hotel.review_count || "Exceptional"}</span>
              </div>
              
              <p className="text-gray-300 mb-4">{hotel.location || "Located at the heart of Platis Gialos, Sifnos"}</p>
              
              <div className="mb-4">
                <h4 className="text-[#D6BCFA] font-semibold mb-2">Amenities:</h4>
                <div className="flex flex-wrap gap-2">
                  {hotel.hotel_amenities?.slice(0, 4).map((amenity, i) => (
                    <span key={i} className="text-xs bg-[#6E59A5]/50 px-2 py-1 rounded-full">
                      {amenity.amenity}
                    </span>
                  )) || (
                    <>
                      <span className="text-xs bg-[#6E59A5]/50 px-2 py-1 rounded-full">Free WiFi</span>
                      <span className="text-xs bg-[#6E59A5]/50 px-2 py-1 rounded-full">Breakfast Included</span>
                      <span className="text-xs bg-[#6E59A5]/50 px-2 py-1 rounded-full">Sea View</span>
                      <span className="text-xs bg-[#6E59A5]/50 px-2 py-1 rounded-full">Pool Access</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="mt-auto">
                <div className="inline-block bg-[#9b87f5] hover:bg-[#7E69AB] transition-colors text-white font-semibold px-6 py-2 rounded-full">
                  View Details
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SponsoredHotelCard;
