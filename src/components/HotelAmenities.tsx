
import { Wifi, Coffee, Tv, CircleParking } from 'lucide-react';

interface HotelAmenitiesProps {
  amenities: string[];
}

const HotelAmenities = ({ amenities }: HotelAmenitiesProps) => {
  // Amenity icons mapping
  const amenityIcons: Record<string, JSX.Element> = {
    wifi: <Wifi size={16} className="mr-1" />,
    breakfast: <Coffee size={16} className="mr-1" />,
    tv: <Tv size={16} className="mr-1" />,
    parking: <CircleParking size={16} className="mr-1" />
  };

  return (
    <div className="flex flex-wrap gap-3 mb-4">
      {amenities.map((amenity, index) => (
        <span key={index} className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
          {amenityIcons[amenity.toLowerCase()] || null} {amenity}
        </span>
      ))}
    </div>
  );
};

export default HotelAmenities;
