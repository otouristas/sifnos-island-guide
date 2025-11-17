import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { generateHotelUrl } from '@/lib/url-utils';
import { getHotelTypeIcon } from './icons/HotelTypeIcons';
import { Button } from '@/components/ui/button';
import HotelImage from './hotel/HotelImage';
import HotelLogo from './hotel/HotelLogo';
import HotelDetails from './hotel/HotelDetails';
import { determineHotelImageUrl, determineHotelLogoUrl } from '@/utils/image-utils';
import FavoriteButton from './auth/FavoriteButton';

// Define the HotelCard component that creates proper URLs
const HotelCard = ({ hotel, showLogo = true, ...props }) => {
  const [imageSrc, setImageSrc] = useState('/placeholder.svg');
  
  // Create the URL-friendly slug for the hotel
  const hotelSlug = generateHotelUrl(hotel.name);
  
  // Find the main photo for the hotel
  const mainPhoto = hotel.hotel_photos?.find(photo => photo.is_main_photo)?.photo_url || '';
  
  // Debug log for identifying the hotel and its main photo
  console.log(`HotelCard: Hotel name: ${hotel.name}, mainPhoto: ${mainPhoto}`);
  
  // Get the hotel logo URL
  const hotelLogoUrl = determineHotelLogoUrl(hotel);
  
  // Check if the hotel has a logo
  const hasLogo = Boolean(hotelLogoUrl);
  console.log(`HotelCard: Hotel ${hotel.name} has logo: ${hasLogo ? 'Yes' : 'No'}, logo URL: ${hotelLogoUrl || 'None'}`);
  
  useEffect(() => {
    // Determine the appropriate image URL
    const imageUrl = determineHotelImageUrl(hotel, mainPhoto);
    setImageSrc(imageUrl);
    
    // Force reload the image by creating a new Image object
    const img = new Image();
    img.onload = () => {
      setImageSrc(img.src);
    };
    img.src = imageUrl;
  }, [hotel.name, mainPhoto]);
  
  // Get the first hotel type for icon display (if any)
  const primaryType = hotel.hotel_types && hotel.hotel_types.length > 0 ? hotel.hotel_types[0] : null;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
      <Link to={`/hotels/${hotelSlug}`} className="block">
        {/* Hotel image with error handling and loading state */}
        <div className="relative">
          <HotelImage 
            hotel={hotel}
            imageSrc={imageSrc}
            primaryType={primaryType}
            getHotelTypeIcon={getHotelTypeIcon}
          />
          
          {/* Show prominent hotel logo in top-right if available - Now visible all the time */}
          {showLogo && hotelLogoUrl && (
            <HotelLogo 
              hotel={hotel}
              hotelLogoUrl={hotelLogoUrl}
              position="corner"
            />
          )}
          
          {/* Add favorite button */}
          <div className="absolute top-2 left-2">
            <FavoriteButton 
              hotelId={hotel.id} 
              variant="ghost"
              className="bg-white/80 hover:bg-white/90"
            />
          </div>
        </div>
        
        {/* Hotel details section */}
        <HotelDetails 
          hotel={hotel}
          hotelLogoUrl={hotelLogoUrl}
          showLogo={showLogo}
        />
      </Link>
      
      {/* Booking.com Affiliate Button */}
      <div className="px-4 pb-4">
        <Button 
          asChild
          className="w-full bg-[#003580] hover:bg-[#002855] text-white"
          size="sm"
        >
          <a 
            href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotel.name + ', Sifnos')}&aid=YOUR_AFFILIATE_ID`}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center justify-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-4 w-4" />
            Check Availability on Booking.com
          </a>
        </Button>
      </div>
    </div>
  );
};

export default HotelCard;