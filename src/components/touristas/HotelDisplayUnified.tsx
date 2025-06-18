
import React from 'react';
import UnifiedHotelCard from '@/components/UnifiedHotelCard';
import { UnifiedHotel } from '@/services/hotelSearch';
import { Badge } from '@/components/ui/badge';
import { Award, ExternalLink, Info } from 'lucide-react';

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
    <div className="mt-4 space-y-6">
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

      {/* Local Hotels Section */}
      {localHotels.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1">
              <Award className="w-4 h-4 mr-2" />
              Local Sifnos Hotels
            </Badge>
            <div className="text-sm text-gray-600 flex items-center gap-1">
              <Info className="w-4 h-4" />
              Contact for personalized rates & service
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {localHotels.map((hotel) => (
              <UnifiedHotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
          
          <div className="text-xs text-gray-500 p-3 bg-green-50 rounded-lg border border-green-200">
            <strong>Local Hotels:</strong> Rich local knowledge, personalized service, flexible rates. 
            These are authentic Sifnos accommodations with direct owner contact for the best experience.
          </div>
        </div>
      )}

      {/* Agoda Hotels Section */}
      {agodaHotels.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1">
              <ExternalLink className="w-4 h-4 mr-2" />
              Agoda Partner Hotels
            </Badge>
            <div className="text-sm text-gray-600 flex items-center gap-1">
              <Info className="w-4 h-4" />
              Live pricing & instant booking
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agodaHotels.map((hotel) => (
              <UnifiedHotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
          
          <div className="text-xs text-gray-500 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <strong>Partner Hotels:</strong> Live pricing and availability from Agoda. 
            Instant booking with international payment options and standardized policies.
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelDisplayUnified;
