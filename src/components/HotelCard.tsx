
import React from 'react';
import { Link } from 'react-router-dom';
import { generateHotelUrl } from '@/lib/url-utils';

// Define the HotelCard component that creates proper URLs
const HotelCard = ({ hotel, showLogo = false, ...props }) => {
  // Create the URL-friendly slug for the hotel
  const hotelSlug = generateHotelUrl(hotel.name);
  
  // Find the main photo for the hotel
  const mainPhoto = hotel.hotel_photos?.find(photo => photo.is_main_photo)?.photo_url || '';
  
  // If no main photo is found, use a default placeholder
  const imageUrl = mainPhoto || '/placeholder.svg';
  
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
          {showLogo && hotel.logo_url && (
            <div className="absolute bottom-2 right-2 bg-white p-1 rounded-md">
              <img 
                src={hotel.logo_url} 
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
