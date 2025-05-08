
type Location = 'platis gialos' | 'apollonia' | 'kamares' | 'vathi' | 'kastro' | 'faros' | 'artemonas';

export const isHotelRelatedQuery = (message: string): boolean => {
  // More specific hotel-related terms
  const hotelTerms = [
    'hotel', 'stay', 'accommodation', 'room', 'apartment', 'villa', 'place to stay',
    'where to stay', 'lodging', 'resort', 'motel', 'inn', 'hostel', 'pension',
    'where can i stay', 'places to stay', 'best hotel', 'recommend hotel',
    'good hotel', 'beach hotel', 'where should i stay'
  ];
  const locationTerms = [
    'platis gialos', 'apollonia', 'kamares', 'vathi', 'kastro', 'faros', 
    'artemonas', 'platy gialo', 'in kamares', 'in apollonia', 'in vathi',
    'in kastro', 'in faros', 'in platis gialos', 'near kamares', 'near apollonia',
    'near platis gialos', 'near vathi', 'near kastro', 'near faros'
  ];
  const searchPhrases = [
    'looking for', 'searching for', 'find me', 'can you suggest', 
    'recommend', 'show me', 'i need', 'i want', 'i\'m looking for'
  ];
  const beachTerms = [
    'beach', 'beachfront', 'by the sea', 'oceanfront', 'sea view', 
    'ocean view', 'waterfront', 'by the beach', 'near the beach',
    'close to the beach', 'on the beach', 'best beach'
  ];
  
  const messageLower = message.toLowerCase();
  
  // Check for phrases like "hotels in Kamares" or "accommodations near the beach"
  for (const hotelTerm of hotelTerms) {
    // Check for location-specific queries
    for (const locationTerm of locationTerms) {
      if (messageLower.includes(`${hotelTerm} in ${locationTerm}`) || 
          messageLower.includes(`${hotelTerm} near ${locationTerm}`) ||
          messageLower.includes(`${hotelTerm} at ${locationTerm}`) ||
          messageLower.includes(`${locationTerm} ${hotelTerm}`)) {
        return true;
      }
    }
    
    // Check for beach-related queries
    for (const beachTerm of beachTerms) {
      if (messageLower.includes(`${hotelTerm} ${beachTerm}`) || 
          messageLower.includes(`${beachTerm} ${hotelTerm}`)) {
        return true;
      }
    }
    
    // Check for search phrases + hotel terms
    for (const searchPhrase of searchPhrases) {
      if (messageLower.includes(`${searchPhrase} ${hotelTerm}`)) {
        return true;
      }
    }
  }
  
  // Check if message contains both a hotel term and a location term
  const hasHotelTerm = hotelTerms.some(term => messageLower.includes(term));
  const hasLocationTerm = locationTerms.some(term => messageLower.includes(term));
  
  if (hasHotelTerm && hasLocationTerm) {
    return true;
  }
  
  // Check for explicit beach hotel questions
  const hasBeachTerm = beachTerms.some(term => messageLower.includes(term));
  if (hasHotelTerm && hasBeachTerm) {
    return true;
  }
  
  // Check for questions about specific hotel types
  const hotelTypeQueries = [
    'luxury hotel', 'family hotel', 'budget hotel', 'cheap hotel', 
    'boutique hotel', 'best place to stay', 'good place to stay',
    'nice hotel', 'affordable hotel'
  ];
  
  for (const query of hotelTypeQueries) {
    if (messageLower.includes(query)) {
      return true;
    }
  }
  
  // Check for "what's the best beach" type questions - these should also trigger hotel results
  if (messageLower.includes('best beach') || messageLower.includes('good beach') || 
      messageLower.includes('beautiful beach') || messageLower.includes('nice beach')) {
    return true;
  }
  
  return false;
};

/**
 * Extract location from a message
 * @param message The message to analyze
 * @returns The extracted location or undefined
 */
export const extractLocationFromMessage = (message: string): string | undefined => {
  const lowercaseMessage = message.toLowerCase();
  const locations = [
    'apollonia',
    'kamares',
    'platis gialos', 
    'platy gialo', // alternative spelling
    'vathi',
    'kastro',
    'faros',
    'artemonas',
    'exambela',
    'agios loukas',
    'chrysopigi',
    'herronisos',
    'kato petali',
    'pano petali',
    'troullaki'
  ];

  // Check for location mentions in the message
  for (const location of locations) {
    if (lowercaseMessage.includes(location)) {
      // Handle the special case of Platy Gialo (alternative spelling)
      if (location === 'platy gialo') {
        return 'platis gialos';
      }
      return location;
    }
  }

  return undefined;
};

/**
 * Extract locations from an AI response
 * @param response The AI response to analyze
 * @returns Array of extracted locations
 */
export const extractLocationsFromResponse = (response: string): string[] => {
  if (!response) return [];
  
  const lowercaseResponse = response.toLowerCase();
  const locations = [
    'apollonia',
    'kamares',
    'platis gialos', 
    'platy gialo', // alternative spelling
    'vathi',
    'kastro',
    'faros',
    'artemonas',
    'exambela',
    'agios loukas', 
    'chrysopigi',
    'herronisos',
    'kato petali',
    'pano petali',
    'troullaki'
  ];

  const foundLocations = locations.filter(location => 
    lowercaseResponse.includes(location)
  );
  
  // Handle the special case of Platy Gialo (alternative spelling)
  if (foundLocations.includes('platy gialo') && !foundLocations.includes('platis gialos')) {
    const index = foundLocations.indexOf('platy gialo');
    foundLocations[index] = 'platis gialos';
  }
  
  return [...new Set(foundLocations)]; // Remove duplicates
};

/**
 * Check if response requires showing hotel recommendations
 * @param response The AI response to analyze
 * @returns Boolean indicating if hotels should be shown
 */
export const shouldShowHotelsInResponse = (response: string): boolean => {
  if (!response) return false;
  
  // Check for specific phrases in the AI response that indicate hotel recommendations
  const triggerPhrases = [
    'here are some hotel options',
    'recommended hotels', 
    'suggest staying at',
    'accommodation options',
    'places to stay',
    'consider staying at',
    'hotels that might interest you',
    'hotel options that might interest you',
    'hotel options',
    'stay at',
    'hotels in',
    'hotels near'
  ];
  
  const lowercaseResponse = response.toLowerCase();
  
  // Also check for mentions of specific beach locations, which should trigger hotel recommendations
  const beachLocationMentions = [
    'platis gialos is',
    'platy gialo is',
    'vathi is',
    'kamares is',
    'best beach',
    'beautiful beach',
    'popular beach'
  ];
  
  // If we detect a discussion about beaches, also trigger hotel results
  const hasBeachDiscussion = beachLocationMentions.some(phrase => 
    lowercaseResponse.includes(phrase.toLowerCase())
  );
  
  // Return true if any trigger phrase or beach location is mentioned
  return triggerPhrases.some(phrase => lowercaseResponse.includes(phrase.toLowerCase())) || hasBeachDiscussion;
};

export type MessageRole = 'user' | 'assistant' | 'system';

export type Message = {
  id: string;
  role: MessageRole;
  content: string;
  location?: string;
  hotels?: any[];
  showHotels?: boolean;
};

export type HotelType = {
  id: string;
  name: string;
  description?: string;
  short_description?: string;
  location: string;
  hotel_types?: string[];
  rating?: number;
  price?: number;
  hotel_amenities?: { amenity: string }[];
  hotel_photos?: { id: string; photo_url: string; is_main_photo: boolean }[];
};
