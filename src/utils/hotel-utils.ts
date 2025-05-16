
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
  if (!hotel) {
    return '/placeholder.svg'; // Fallback image
  }
  
  // Generate cache-busting timestamp
  const timestamp = Date.now();
  const randomValue = Math.floor(Math.random() * 1000);
  const cacheBuster = `?v=${timestamp}-${randomValue}`;
  
  // Special case handling for specific hotels - hardcoded paths for reliability
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
  
  // Check if hotel has photos
  if (hotel.hotel_photos && hotel.hotel_photos.length > 0) {
    // First try to find the main photo
    const mainPhoto = hotel.hotel_photos.find((photo: any) => photo.is_main_photo);
    let photoUrl = mainPhoto?.photo_url || hotel.hotel_photos[0]?.photo_url;
    
    if (photoUrl) {
      // Check if the path already includes a subfolder
      if (photoUrl.includes('/')) {
        return `/uploads/hotels/${photoUrl}${cacheBuster}`;
      }
      
      // Default path for hotel images
      return `/uploads/hotels/${photoUrl}${cacheBuster}`;
    }
  }
  
  // Final fallback to placeholder
  return '/placeholder.svg';
};

/**
 * Get hotel logo URL with proper path handling
 * @param hotel Hotel object
 * @returns URL string for the hotel logo
 */
export const getHotelLogoUrl = (hotel: any): string => {
  if (!hotel) {
    return '/placeholder.svg';
  }
  
  const timestamp = Date.now();
  const randomValue = Math.floor(Math.random() * 1000);
  const cacheBuster = `?v=${timestamp}-${randomValue}`;
  
  // Special case for specific hotels - hardcoded paths for reliability
  if (hotel.name === 'Meropi Rooms and Apartments') {
    return `/uploads/hotels/meropi-logo.svg${cacheBuster}`;
  }
  
  if (hotel.name === 'Filadaki Villas') {
    return `/uploads/hotels/filadaki-studios/filadaki-logo.png${cacheBuster}`;
  }
  
  if (hotel.name === 'Villa Olivia Clara') {
    // Always use this direct path for Villa Olivia Clara logo
    return `/uploads/hotels/villa-olivia-clara/logo-villa-olivia.png${cacheBuster}`;
  }
  
  if (hotel.name === 'ALK HOTEL™') {
    return `/uploads/hotels/alk-hotel-sifnos/logo.png${cacheBuster}`;
  }
  
  if (hotel.name === 'Morpheas Pension & Apartments') {
    return `/uploads/hotels/morpheas-pension/logo.png${cacheBuster}`;
  }
  
  // If logo_path exists and contains a directory path
  if (hotel.logo_path) {
    if (hotel.logo_path.includes('/')) {
      return `/uploads/hotels/${hotel.logo_path}${cacheBuster}`;
    }
    
    return `/uploads/hotels/${hotel.logo_path}${cacheBuster}`;
  }
  
  // Final fallback to placeholder
  return '/placeholder.svg';
};

/**
 * Get booking platform logo URL
 * @param platform Booking platform name (e.g., 'booking.com', 'airbnb')
 * @returns URL string for the platform logo
 */
export const getBookingPlatformLogo = (platform: string | undefined): string | null => {
  if (!platform) return null;
  
  switch(platform.toLowerCase()) {
    case 'booking.com':
      return '/uploads/Booking.com.svg';
    case 'airbnb':
      return '/uploads/misc/airbnb-logo.png';
    case 'expedia':
      return '/uploads/misc/expedia-logo.png';
    default:
      return null;
  }
};

/**
 * Get similar hotels based on type and location
 * @param currentHotel The current hotel object
 * @param allHotels Array of all hotel objects
 * @param limit Maximum number of similar hotels to return
 * @returns Array of similar hotel objects
 */
export const getSimilarHotels = (currentHotel: any, allHotels: any[], limit: number = 3): any[] => {
  if (!currentHotel || !allHotels?.length) return [];
  
  // Filter out the current hotel
  const otherHotels = allHotels.filter(hotel => hotel.id !== currentHotel.id);
  
  // Get hotels with the same primary type
  let sameTypeHotels = [];
  if (currentHotel.hotel_types?.length > 0) {
    const primaryType = currentHotel.hotel_types[0];
    sameTypeHotels = otherHotels.filter(hotel => 
      hotel.hotel_types?.some((type: string) => type === primaryType)
    );
  }
  
  // Get hotels in the same location if we don't have enough with the same type
  let sameLocationHotels = [];
  if (sameTypeHotels.length < limit && currentHotel.location) {
    sameLocationHotels = otherHotels.filter(hotel => 
      hotel.location === currentHotel.location && 
      !sameTypeHotels.some(typeHotel => typeHotel.id === hotel.id)
    );
  }
  
  // Combine and limit the results
  const combinedHotels = [...sameTypeHotels, ...sameLocationHotels];
  
  // If we still don't have enough, add some random hotels
  if (combinedHotels.length < limit) {
    const remainingHotels = otherHotels.filter(hotel => 
      !combinedHotels.some(combinedHotel => combinedHotel.id === hotel.id)
    );
    
    // Sort by rating if available
    const sortedRemaining = remainingHotels.sort((a, b) => 
      (b.rating || 0) - (a.rating || 0)
    );
    
    combinedHotels.push(...sortedRemaining.slice(0, limit - combinedHotels.length));
  }
  
  return combinedHotels.slice(0, limit);
};
