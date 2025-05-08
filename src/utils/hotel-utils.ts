
// Hotel utility functions

/**
 * Filter hotels by location with case-insensitive matching
 * @param hotels Array of hotel objects
 * @param location Location string to filter by
 * @returns Filtered array of hotels
 */
export const filterHotelsByLocation = (hotels: any[], location: string): any[] => {
  if (!location || !hotels?.length) return hotels;
  
  const normalizedLocation = location.toLowerCase();
  return hotels.filter(hotel => 
    hotel.location && hotel.location.toLowerCase().includes(normalizedLocation)
  );
};

/**
 * Get the proper URL for a hotel image, handling different paths and ensuring proper caching
 * @param hotel Hotel object
 * @returns URL string for the hotel image
 */
export const getHotelImageUrl = (hotel: any): string => {
  if (!hotel || !hotel.hotel_photos || hotel.hotel_photos.length === 0) {
    return '/placeholder.svg'; // Fallback image
  }
  
  // First try to find the main photo
  const mainPhoto = hotel.hotel_photos.find((photo: any) => photo.is_main_photo);
  const photoUrl = mainPhoto?.photo_url || hotel.hotel_photos[0]?.photo_url;
  
  if (!photoUrl) {
    return '/placeholder.svg';
  }
  
  // Generate cache-busting timestamp
  const timestamp = Date.now();
  const randomValue = Math.floor(Math.random() * 1000);
  const cacheBuster = `?v=${timestamp}-${randomValue}`;
  
  // Special case handling for specific hotels
  if (hotel.name === 'Filadaki Villas') {
    return `/uploads/hotels/filadaki-studios/home-page_9151.jpg.jpeg${cacheBuster}`;
  }
  
  if (hotel.name === 'Villa Olivia Clara') {
    return `/uploads/hotels/villa-olivia-clara/feature-image.jpeg${cacheBuster}`;
  }
  
  if (hotel.name === 'ALK HOTEL™') {
    return `/uploads/hotels/alk-hotel-sifnos/alk-hotel-feature.jpeg${cacheBuster}`;
  }
  
  if (hotel.name === 'Morpheas Pension & Apartments') {
    return `/uploads/hotels/morpheas-pension/sifnos-accommodation.jpg.jpeg${cacheBuster}`;
  }
  
  // Handle hotel-specific paths for Meropi
  if (hotel.name === 'Meropi Rooms and Apartments') {
    return `/uploads/hotels/meropirooms-hero.webp${cacheBuster}`;
  }
  
  // Check if the path already includes a subfolder
  if (photoUrl.includes('/')) {
    return `/uploads/hotels/${photoUrl}${cacheBuster}`;
  }
  
  // Default path for hotel images
  return `/uploads/hotels/${photoUrl}${cacheBuster}`;
};

/**
 * Get hotel logo URL with proper path handling
 * @param hotel Hotel object
 * @returns URL string for the hotel logo
 */
export const getHotelLogoUrl = (hotel: any): string => {
  if (!hotel || !hotel.logo_path) {
    return '/placeholder.svg';
  }
  
  const timestamp = Date.now();
  const randomValue = Math.floor(Math.random() * 1000);
  const cacheBuster = `?v=${timestamp}-${randomValue}`;
  
  // Special case for specific hotels
  if (hotel.name === 'Meropi Rooms and Apartments') {
    return `/uploads/hotels/meropi-logo.svg${cacheBuster}`;
  }
  
  if (hotel.name === 'Filadaki Villas') {
    return `/uploads/hotels/filadaki-studios/filadaki-logo.png${cacheBuster}`;
  }
  
  if (hotel.name === 'Villa Olivia Clara') {
    return `/uploads/hotels/villa-olivia-clara/logo-villa-olivia.png${cacheBuster}`;
  }
  
  if (hotel.name === 'ALK HOTEL™') {
    return `/uploads/hotels/alk-hotel-sifnos/logo.png${cacheBuster}`;
  }
  
  if (hotel.name === 'Morpheas Pension & Apartments') {
    return `/uploads/hotels/morpheas-pension/logo.png${cacheBuster}`;
  }
  
  // If logo_path contains a directory path
  if (hotel.logo_path.includes('/')) {
    return `/uploads/hotels/${hotel.logo_path}${cacheBuster}`;
  }
  
  return `/uploads/hotels/${hotel.logo_path}${cacheBuster}`;
};
