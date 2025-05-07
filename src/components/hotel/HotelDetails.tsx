
import React from 'react';
import HotelLogo from './HotelLogo';

interface HotelDetailsProps {
  hotel: any;
  hotelLogoUrl: string | null;
  showLogo: boolean;
}

const HotelDetails = ({ hotel, hotelLogoUrl, showLogo }: HotelDetailsProps) => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-start gap-2 mb-2">
        {/* Display logo to the LEFT of hotel name using the HotelLogo component */}
        {showLogo && hotelLogoUrl && (
          <HotelLogo
            hotel={hotel}
            hotelLogoUrl={hotelLogoUrl}
            position="inline"
          />
        )}
        <h3 className="text-lg font-semibold text-gray-800">{hotel.name}</h3>
      </div>
      <p className="text-sm text-gray-600 mb-2">{hotel.location}</p>
      
      {/* Hotel Types */}
      {hotel.hotel_types && hotel.hotel_types.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {hotel.hotel_types.map((type: string, index: number) => (
            <span key={index} className="text-xs bg-sifnos-turquoise/10 text-sifnos-deep-blue px-2 py-1 rounded-full">
              {type.replace(/-/g, ' ').replace(/hotels/g, 'hotel')}
            </span>
          ))}
        </div>
      )}
      
      {/* Amenities */}
      {hotel.hotel_amenities && hotel.hotel_amenities.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {hotel.hotel_amenities.slice(0, 3).map((amenity: any, i: number) => (
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
  );
};

export default HotelDetails;
