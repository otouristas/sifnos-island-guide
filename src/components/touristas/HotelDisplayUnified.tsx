
import React from 'react';
import UnifiedHotelCard from '@/components/UnifiedHotelCard';
import { UnifiedHotel } from '@/services/hotelSearch';

interface HotelDisplayUnifiedProps {
  hotels: UnifiedHotel[];
  location?: string;
}

const HotelDisplayUnified = ({ hotels, location }: HotelDisplayUnifiedProps) => {
  if (!hotels || hotels.length === 0) {
    return null;
  }

  const localHotels = hotels.filter(h => h.source === 'local');
  const agodaHotels = hotels.filter(h => h.source === 'agoda');

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-sifnos-deep-blue">
          Hotels {location && `in ${location}`}
        </h3>
        <div className="text-sm text-gray-600">
          {hotels.length} result{hotels.length !== 1 ? 's' : ''}
          {localHotels.length > 0 && agodaHotels.length > 0 && (
            <span className="ml-2">
              ({localHotels.length} local, {agodaHotels.length} partner)
            </span>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Show local hotels first, then Agoda hotels */}
        {localHotels.map((hotel) => (
          <UnifiedHotelCard key={hotel.id} hotel={hotel} />
        ))}
        {agodaHotels.map((hotel) => (
          <UnifiedHotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>
      
      {agodaHotels.length > 0 && (
        <div className="text-xs text-gray-500 mt-2 p-2 bg-blue-50 rounded">
          <strong>Partner Hotels:</strong> Prices and availability are provided by our booking partners. 
          Bookings are processed securely through their platforms.
        </div>
      )}
    </div>
  );
};

export default HotelDisplayUnified;
