
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateHotelUrl } from '@/lib/url-utils';
import { getHotelTypeIcon } from './icons/HotelTypeIcons';
import HotelLogo from './hotel/HotelLogo';
import HotelDetails from './hotel/HotelDetails';
import { determineHotelImageUrl, determineHotelLogoUrl } from '@/utils/image-utils';
import { ProgressiveImage } from './ui/progressive-image';

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
  }, [hotel.name, mainPhoto]);
  
  // Get the first hotel type for icon display (if any)
  const primaryType = hotel.hotel_types && hotel.hotel_types.length > 0 ? hotel.hotel_types[0] : null;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1 w-full">
      <Link to={`/hotels/${hotelSlug}`} className="block">
        {/* Hotel image with error handling and loading state - using ProgressiveImage component */}
        <div className="relative w-full">
          <ProgressiveImage 
            src={imageSrc}
            alt={`${hotel.name} - Sifnos Hotel`}
            containerClassName="w-full h-48"
            aspectRatio="aspect-[4/3]"
            width={800}
            height={600}
          />
          
          {/* Display hotel type icon if available */}
          {primaryType && (
            <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm p-1 rounded-full">
              <div className="w-6 h-6 text-sifnos-turquoise">
                {getHotelTypeIcon(primaryType)}
              </div>
            </div>
          )}
          
          {/* Show prominent hotel logo in top-right if available */}
          {showLogo && hotelLogoUrl && (
            <HotelLogo 
              hotel={hotel}
              hotelLogoUrl={hotelLogoUrl}
              position="corner"
            />
          )}
        </div>
        
        {/* Hotel details section */}
        <HotelDetails 
          hotel={hotel}
          hotelLogoUrl={hotelLogoUrl}
          showLogo={showLogo}
        />
      </Link>
    </div>
  );
};

export default HotelCard;
