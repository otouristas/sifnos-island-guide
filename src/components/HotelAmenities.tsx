
import { Wifi, Coffee, Tv, CircleParking, AirVent, Utensils, Waves, Home, Bath, Refrigerator, Shower, Bed, UtensilsCrossed, Power, ShirtFolded, Cigarette } from 'lucide-react';

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
    seaview: <Waves size={16} className="mr-1" />,
    balcony: <Home size={16} className="mr-1" />, // Replaced Balcony with Home
    bath: <Bath size={16} className="mr-1" />,
    'air conditioning': <AirVent size={16} className="mr-1" />,
    refrigerator: <Refrigerator size={16} className="mr-1" />,
    shower: <Shower size={16} className="mr-1" />, // Replaced ShowerHead with Shower
    'sea view': <Waves size={16} className="mr-1" />,
    'flat-screen tv': <Tv size={16} className="mr-1" />,
    'free wifi': <Wifi size={16} className="mr-1" />,
    'full bed': <Bed size={16} className="mr-1" />,
    'twin bed': <Bed size={16} className="mr-1" />,
    kitchenware: <UtensilsCrossed size={16} className="mr-1" />, // Replaced KitchenwareIcon with UtensilsCrossed
    'private bathroom': <Bath size={16} className="mr-1" />,
    'socket near the bed': <Power size={16} className="mr-1" />, // Replaced ElectricalOutlet with Power
    'wardrobe or closet': <ShirtFolded size={16} className="mr-1" />, // Replaced Shirt with ShirtFolded
    'no smoking': <Cigarette size={16} className="mr-1 line-through" />, // Replaced Smoking with Cigarette
  };

  return (
    <div className="flex flex-wrap gap-2">
      {amenities.map((amenity, index) => {
        // Normalize the amenity name for icon lookup
        const normalizedAmenity = amenity.toLowerCase().replace(/\s+/g, '');
        const alternativeKey = amenity.toLowerCase();
        
        return (
          <span 
            key={index} 
            className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded"
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
