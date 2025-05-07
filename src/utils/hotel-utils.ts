
import { getHotelRoomImagePath } from '@/integrations/supabase/client';

// Function to get the proper image URL for a hotel
export const getHotelImageUrl = (hotel: any): string => {
  if (!hotel || !hotel.hotel_photos) {
    return '/placeholder.svg';
  }
  
  // Find main photo or use the first one
  const mainPhoto = hotel.hotel_photos.find((photo: any) => photo.is_main_photo);
  const photoToUse = mainPhoto || hotel.hotel_photos[0];
  
  if (!photoToUse || !photoToUse.photo_url) {
    return '/placeholder.svg';
  }
  
  return getHotelRoomImagePath(photoToUse.photo_url, hotel.name);
};

// Function to normalize location names for better matching
export const normalizeLocation = (location: string): string => {
  location = location.toLowerCase().trim();
  
  // Handle common misspellings and variations
  if (location === 'platy gialo' || location === 'plati gialo' || location === 'plati gialos') {
    return 'platis gialos';
  }
  
  return location;
};

// Filter hotels by location with fuzzy matching
export const filterHotelsByLocation = (hotels: any[], location: string): any[] => {
  if (!location || !hotels?.length) return hotels;
  
  const normalizedLocation = normalizeLocation(location);
  
  return hotels.filter(hotel => {
    if (!hotel.location) return false;
    return normalizeLocation(hotel.location) === normalizedLocation;
  });
};
