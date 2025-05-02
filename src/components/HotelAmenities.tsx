
import { Wifi, Coffee, Tv, CircleParking, AirVent, Utensils, Waves } from 'lucide-react';

interface HotelAmenitiesProps {
  amenities: string[];
}

const HotelAmenities = ({ amenities }: HotelAmenitiesProps) => {
  // Enhanced amenity icons mapping with more options
  const amenityIcons: Record<string, JSX.Element> = {
    wifi: <Wifi size={16} className="mr-1" />,
    breakfast: <Coffee size={16} className="mr-1" />,
    tv: <Tv size={16} className="mr-1" />,
    parking: <CircleParking size={16} className="mr-1" />,
    airconditioning: <AirVent size={16} className="mr-1" />,
    restaurant: <Utensils size={16} className="mr-1" />,
    seaview: <Waves size={16} className="mr-1" />
  };

  return (
    <div className="flex flex-wrap gap-3 mb-4">
      {amenities.map((amenity, index) => {
        // Normalize the amenity name for icon lookup
        const normalizedAmenity = amenity.toLowerCase().replace(/\s+/g, '');
        
        return (
          <span 
            key={index} 
            className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded"
            title={amenity}
          >
            {amenityIcons[normalizedAmenity] || null} 
            {amenity}
          </span>
        );
      })}
    </div>
  );
};

export default HotelAmenities;
