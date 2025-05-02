
import { Wifi, Coffee, Tv, CircleParking, AirVent, Waves, Home, Bath, Refrigerator, Bed, UtensilsCrossed, Power, Shirt, Cigarette } from 'lucide-react';

interface HotelAmenitiesProps {
  amenities: string[];
}

const HotelAmenities = ({ amenities }: HotelAmenitiesProps) => {
  // Enhanced amenity icons mapping with more options
  const amenityIcons: Record<string, JSX.Element> = {
    wifi: <Wifi size={14} className="mr-1" />,
    breakfast: <Coffee size={14} className="mr-1" />,
    tv: <Tv size={14} className="mr-1" />,
    parking: <CircleParking size={14} className="mr-1" />,
    airconditioning: <AirVent size={14} className="mr-1" />,
    seaview: <Waves size={14} className="mr-1" />,
    balcony: <Home size={14} className="mr-1" />, // Using Home icon instead of Balcony
    bath: <Bath size={14} className="mr-1" />,
    'air conditioning': <AirVent size={14} className="mr-1" />,
    refrigerator: <Refrigerator size={14} className="mr-1" />,
    shower: <Bath size={14} className="mr-1" />, // Using Bath instead of Shower
    'sea view': <Waves size={14} className="mr-1" />,
    'flat-screen tv': <Tv size={14} className="mr-1" />,
    'free wifi': <Wifi size={14} className="mr-1" />,
    'full bed': <Bed size={14} className="mr-1" />,
    'twin bed': <Bed size={14} className="mr-1" />,
    kitchenware: <UtensilsCrossed size={14} className="mr-1" />,
    'private bathroom': <Bath size={14} className="mr-1" />,
    'socket near the bed': <Power size={14} className="mr-1" />,
    'wardrobe or closet': <Shirt size={14} className="mr-1" />, // Using Shirt instead of ShirtFolded
    'no smoking': <Cigarette size={14} className="mr-1 line-through" />,
  };

  // Filter out 'restaurant' from amenities
  const filteredAmenities = amenities.filter(amenity => amenity.toLowerCase() !== 'restaurant');

  return (
    <div className="flex flex-wrap gap-1.5">
      {filteredAmenities.map((amenity, index) => {
        // Normalize the amenity name for icon lookup
        const normalizedAmenity = amenity.toLowerCase().replace(/\s+/g, '');
        const alternativeKey = amenity.toLowerCase();
        
        return (
          <span 
            key={index} 
            className="flex items-center text-xs bg-gray-100 px-1.5 py-0.5 rounded"
            title={amenity}
          >
            {amenityIcons[normalizedAmenity] || amenityIcons[alternativeKey] || null} 
            {amenity}
          </span>
        );
      })}
    </div>
  );
};

export default HotelAmenities;
