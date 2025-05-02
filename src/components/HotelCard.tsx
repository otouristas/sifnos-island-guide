
import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { generateHotelUrl } from '@/lib/url-utils';
import HotelAmenities from './HotelAmenities';

// Define interfaces for props
interface HotelAmenity {
  amenity: string;
}

interface HotelPhoto {
  id: string;
  photo_url: string;
  is_main_photo: boolean;
}

interface Hotel {
  id: string;
  name: string;
  location: string;
  description: string;
  short_description?: string;
  rating: number;
  logo_path?: string;
  hotel_amenities?: HotelAmenity[];
  hotel_photos?: HotelPhoto[];
}

interface HotelCardProps {
  hotel: Hotel;
}

const HotelCard = ({ hotel }: HotelCardProps) => {
  // Function to render star rating
  const renderStarRating = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
        size={16}
      />
    ));
  };

  // Process amenities for display
  const getHotelAmenities = () => {
    if (hotel?.hotel_amenities && hotel.hotel_amenities.length > 0) {
      return hotel.hotel_amenities.map(item => item.amenity);
    }
    return [];
  };

  // Special case for Meropi Rooms
  const isMeropiRooms = hotel.id === '0c9632b6-db5c-4179-8122-0003896e465e';

  // Get main photo URL or fallback
  const getMainPhotoUrl = () => {
    // Special case for Meropi Rooms
    if (isMeropiRooms) {
      return '/uploads/hotels/meropirooms-hero.webp';
    }
    
    if (hotel?.hotel_photos && hotel.hotel_photos.length > 0) {
      const mainPhoto = hotel.hotel_photos.find(photo => photo.is_main_photo);
      if (mainPhoto) return `/uploads/hotels/${mainPhoto.photo_url}`;
      if (hotel.hotel_photos[0]?.photo_url) return `/uploads/hotels/${hotel.hotel_photos[0].photo_url}`;
    }
    return '/placeholder.svg';
  };

  // Get hotel logo or fallback
  const getHotelLogo = () => {
    // Special case for Meropi Rooms
    if (isMeropiRooms) {
      return '/uploads/hotels/meropi-logo.svg';
    }
    
    if (hotel.logo_path) {
      return `/uploads/hotels/${hotel.logo_path}`;
    }
    
    return null;
  };

  return (
    <div className="cycladic-card overflow-hidden flex flex-col md:flex-row">
      <div className="md:w-1/3">
        <div className="bg-sifnos-teal/20 h-48 md:h-full">
          <img 
            src={getMainPhotoUrl()} 
            alt={`${hotel.name} - Hotel in ${hotel.location}, Sifnos`}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.log(`Error loading image for hotel ${hotel.id}`);
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        </div>
      </div>
      <div className="md:w-2/3 p-6">
        <div className="flex flex-wrap justify-between items-start">
          <div className="flex items-start gap-3">
            {/* Hotel Logo */}
            {getHotelLogo() && (
              <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 bg-white flex items-center justify-center">
                <img 
                  src={getHotelLogo()}
                  alt={`${hotel.name} logo`}
                  className="w-full h-full object-contain p-1"
                  onError={(e) => {
                    console.log(`Error loading logo for hotel ${hotel.id}`);
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>
            )}
            <div>
              <h3 className="font-montserrat font-semibold text-xl">{hotel.name}</h3>
              <div className="flex items-center mt-1 mb-3">
                <MapPin size={16} className="text-sifnos-turquoise mr-1" />
                <span className="text-gray-600 text-sm">{hotel.location}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            {renderStarRating(hotel.rating)}
          </div>
        </div>
        
        <p className="text-gray-600 mb-4">{hotel.short_description || hotel.description.substring(0, 150) + '...'}</p>
        
        {/* Amenities */}
        <HotelAmenities amenities={getHotelAmenities()} />
        
        <div className="flex justify-end items-center mt-auto">
          <Link 
            to={`/hotels/${generateHotelUrl(hotel.name, hotel.id)}`} 
            className="bg-sifnos-turquoise hover:bg-sifnos-deep-blue text-white px-6 py-2 rounded-lg transition-colors duration-300 text-sm font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
