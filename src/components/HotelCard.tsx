
import React from 'react';
import { Link } from 'react-router-dom';
import { generateHotelUrl } from '@/lib/url-utils';
import { getHotelTypeIcon } from './icons/HotelTypeIcons';

// Define the HotelCard component that creates proper URLs
const HotelCard = ({ hotel, showLogo = false, ...props }) => {
  // Create the URL-friendly slug for the hotel
  const hotelSlug = generateHotelUrl(hotel.name);
  
  // Find the main photo for the hotel
  const mainPhoto = hotel.hotel_photos?.find(photo => photo.is_main_photo)?.photo_url || '';
  
  // Construct image URL based on hotel name and available photos
  let imageUrl = '/placeholder.svg';
  
  // Special case for Meropi hotel which has local images saved
  if (hotel.name === "Meropi Rooms and Apartments") {
    imageUrl = '/uploads/hotels/meropirooms-hero.webp';
  } else if (mainPhoto) {
    // For other hotels, use the photos from the database
    imageUrl = `/uploads/hotels/${mainPhoto}`;
  }
  
  // Get the first hotel type for icon display (if any)
  const primaryType = hotel.hotel_types && hotel.hotel_types.length > 0 ? hotel.hotel_types[0] : null;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
      <Link to={`/hotels/${hotelSlug}`} className="block">
        {/* Hotel image */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={hotel.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          {/* Display hotel type icon if available */}
          {primaryType && (
            <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm p-1 rounded-full">
              <div className="w-6 h-6 text-sifnos-turquoise">
                {getHotelTypeIcon(primaryType)}
              </div>
            </div>
          )}
          {showLogo && hotel.logo_url && (
            <div className="absolute bottom-2 right-2 bg-white p-1 rounded-md">
              <img 
                src={`/uploads/hotels/${hotel.logo_url}`} 
                alt={`${hotel.name} logo`} 
                className="h-8" 
              />
            </div>
          )}
        </div>
        
        {/* Hotel details */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{hotel.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{hotel.location}</p>
          
          {/* Hotel Types */}
          {hotel.hotel_types && hotel.hotel_types.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {hotel.hotel_types.map((type, index) => (
                <span key={index} className="text-xs bg-sifnos-turquoise/10 text-sifnos-deep-blue px-2 py-1 rounded-full">
                  {type.replace(/-/g, ' ').replace(/hotels/g, 'hotel')}
                </span>
              ))}
            </div>
          )}
          
          {/* Amenities */}
          {hotel.hotel_amenities && hotel.hotel_amenities.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {hotel.hotel_amenities.slice(0, 3).map((amenity, i) => (
                <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {amenity.amenity}
                </span>
              ))}
              {hotel.hotel_amenities.length > 3 && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  +{hotel.hotel_amenities.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default HotelCard;
