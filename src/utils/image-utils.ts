
/**
 * Generates an image URL with cache busting parameters
 * @param path Base path of the image
 * @returns URL with cache busting
 */
export const generateCacheBustedUrl = (path: string): string => {
  const timestamp = Date.now();
  const randomValue = Math.floor(Math.random() * 1000);
  return `${path}?v=${timestamp}-${randomValue}`;
};

/**
 * Determines the appropriate image URL for a hotel
 * @param hotel Hotel object
 * @param mainPhoto Main photo from hotel data
 * @returns Image URL to use
 */
export const determineHotelImageUrl = (hotel: any, mainPhoto?: string): string => {
  const timestamp = Date.now();
  const randomValue = Math.floor(Math.random() * 1000);
  
  // Special case for hotels with local images saved in specific directories
  if (hotel.name === "Meropi Rooms and Apartments") {
    return `/uploads/hotels/meropirooms-hero.webp?v=${timestamp}-${randomValue}`;
  } else if (hotel.name === "Filadaki Villas") {
    // For Filadaki Villas, use one of the known images from the public directory
    return `/uploads/hotels/filadaki-studios/home-page_9151.jpg.jpeg?v=${timestamp}-${randomValue}`;
  } else if (hotel.name === "Morpheas Pension & Apartments") {
    // For Morpheas Pension, use its featured image with cache-busting
    return `/uploads/hotels/morpheas-pension/sifnos-accommodation.jpg.jpeg?v=${timestamp}-${randomValue}`;
  } else if (hotel.name === "Villa Olivia Clara") {
    // For Villa Olivia Clara, use its featured image with cache-busting
    return `/uploads/hotels/villa-olivia-clara/feature-image.jpeg?v=${timestamp}-${randomValue}`;
  } else if (hotel.name === "ALK HOTEL™") {
    // Updated ALK HOTEL feature image path
    return `/uploads/hotels/alk-hotel-sifnos/alk-hotel-feature.jpeg?v=${timestamp}-${randomValue}`;
  } else if (mainPhoto) {
    // For other hotels, use the photos from the database with cache-busting
    return `/uploads/hotels/${mainPhoto}?v=${timestamp}-${randomValue}`;
  }
  
  return `/placeholder.svg?v=${timestamp}-${randomValue}`;
};

/**
 * Determines the appropriate logo URL for a hotel
 * @param hotel Hotel object
 * @returns Logo URL to use
 */
export const determineHotelLogoUrl = (hotel: any): string | null => {
  const timestamp = Date.now();
  const randomValue = Math.floor(Math.random() * 1000);
  
  // Generate a logo URL with cache busting if there is a logo
  const logoUrl = hotel.logo_url ? `/uploads/hotels/${hotel.logo_url}?v=${timestamp}-${randomValue}` : null;
  
  if (logoUrl) return logoUrl;
  
  // Add hardcoded logos for known hotels if they don't have a logo in the database
  if (hotel.name === "Meropi Rooms and Apartments") {
    return `/uploads/hotels/meropi-logo.svg?v=${timestamp}-${randomValue}`;
  } else if (hotel.name === "Villa Olivia Clara") {
    return `/uploads/hotels/villa-olivia-clara/logo-villa-olivia.png?v=${timestamp}-${randomValue}`;
  } else if (hotel.name === "Filadaki Villas") {
    return `/uploads/hotels/filadaki-studios/filadaki-logo.png?v=${timestamp}-${randomValue}`;
  } else if (hotel.name === "Morpheas Pension & Apartments") {
    return `/uploads/hotels/morpheas-pension/logo.png?v=${timestamp}-${randomValue}`;
  } else if (hotel.name === "ALK HOTEL™") {
    return `/uploads/hotels/alk-hotel-sifnos/logo.png?v=${timestamp}-${randomValue}`;
  }
  
  return null;
};

/**
 * Determines the appropriate room image URL
 * @param hotel Hotel object
 * @param roomType Room type/name
 * @returns Room image URL to use
 */
export const determineRoomImageUrl = (hotel: any, roomType: string): string => {
  const timestamp = Date.now();
  const randomValue = Math.floor(Math.random() * 1000);
  
  if (hotel.name === "ALK HOTEL™") {
    if (roomType.toLowerCase().includes('comfort')) {
      // Updated ALK HOTEL comfort room image
      return `/uploads/hotels/alk-hotel-sifnos/comfort-room.webp?v=${timestamp}-${randomValue}`;
    } else if (roomType.toLowerCase().includes('superior') && roomType.toLowerCase().includes('sea')) {
      return `/uploads/hotels/alk-hotel-sifnos/superior-sea-view.jpeg?v=${timestamp}-${randomValue}`;
    } else if (roomType.toLowerCase().includes('superior')) {
      return `/uploads/hotels/alk-hotel-sifnos/superior-plus.jpeg?v=${timestamp}-${randomValue}`;
    } else if (roomType.toLowerCase().includes('triple')) {
      return `/uploads/hotels/alk-hotel-sifnos/triple-room.jpeg?v=${timestamp}-${randomValue}`;
    }
    return `/uploads/hotels/alk-hotel-sifnos/comfort-room.webp?v=${timestamp}-${randomValue}`;
  }
  
  // Default placeholder
  return `/placeholder.svg?v=${timestamp}-${randomValue}`;
};
