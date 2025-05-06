
import { 
  Wifi, Coffee, Tv, CircleParking, AirVent, Waves, Home, Bath, 
  Refrigerator, Bed, UtensilsCrossed, Power, Shirt, Cigarette, 
  Droplets, TreePine, Utensils 
} from 'lucide-react';
import { useMemo } from 'react';

interface HotelAmenitiesProps {
  amenities: string[];
}

const HotelAmenities = ({ amenities }: HotelAmenitiesProps) => {
  // Enhanced amenity icons mapping with more options - memoized to improve rendering performance
  const amenityIcons = useMemo(() => ({
    wifi: <Wifi size={14} className="mr-1" />,
    breakfast: <Coffee size={14} className="mr-1" />,
    tv: <Tv size={14} className="mr-1" />,
    parking: <CircleParking size={14} className="mr-1" />,
    airconditioning: <AirVent size={14} className="mr-1" />,
    seaview: <Waves size={14} className="mr-1" />,
    balcony: <Home size={14} className="mr-1" />,
    bath: <Bath size={14} className="mr-1" />,
    'air conditioning': <AirVent size={14} className="mr-1" />,
    refrigerator: <Refrigerator size={14} className="mr-1" />,
    shower: <Bath size={14} className="mr-1" />,
    'sea view': <Waves size={14} className="mr-1" />,
    'flat-screen tv': <Tv size={14} className="mr-1" />,
    'free wifi': <Wifi size={14} className="mr-1" />,
    'full bed': <Bed size={14} className="mr-1" />,
    'twin bed': <Bed size={14} className="mr-1" />,
    kitchenware: <UtensilsCrossed size={14} className="mr-1" />,
    'private bathroom': <Bath size={14} className="mr-1" />,
    'socket near the bed': <Power size={14} className="mr-1" />,
    'wardrobe or closet': <Shirt size={14} className="mr-1" />,
    'no smoking': <Cigarette size={14} className="mr-1 line-through" />,
    'private pool': <Droplets size={14} className="mr-1" />,
    'bbq': <Utensils size={14} className="mr-1" />,
    'private garden': <TreePine size={14} className="mr-1" />,
    'garden': <TreePine size={14} className="mr-1" />,
    'outdoor dining area': <TreePine size={14} className="mr-1" />,
    'pool bar': <Droplets size={14} className="mr-1" />,
    'fireplace': <Home size={14} className="mr-1" />,
    'free parking': <CircleParking size={14} className="mr-1" />,
    'fully equipped kitchen': <UtensilsCrossed size={14} className="mr-1" />,
    'smart tv': <Tv size={14} className="mr-1" />,
    'laundry facilities': <Shirt size={14} className="mr-1" />,
  }), []);

  // Filter out 'restaurant' from amenities and memoize the filtered list
  const filteredAmenities = useMemo(() => 
    amenities.filter(amenity => amenity.toLowerCase() !== 'restaurant'),
    [amenities]
  );

  return (
    <div className="flex flex-wrap gap-1.5">
      {filteredAmenities.map((amenity, index) => {
        // Normalize the amenity name for icon lookup
        const normalizedAmenity = amenity.toLowerCase().replace(/\s+/g, '');
        const alternativeKey = amenity.toLowerCase();
        
        return (
          <span 
            key={`${normalizedAmenity}-${index}`}
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
