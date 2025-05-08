
type Location = 'platis gialos' | 'apollonia' | 'kamares' | 'vathi' | 'kastro' | 'faros' | 'artemonas';

export const isHotelRelatedQuery = (message: string): boolean => {
  // More specific hotel-related terms
  const hotelTerms = [
    'hotel', 'stay', 'accommodation', 'room', 'apartment', 'villa', 'place to stay',
    'where to stay', 'lodging', 'resort', 'motel', 'inn', 'hostel', 'pension',
    'where can i stay', 'places to stay', 'best hotel', 'recommend hotel',
    'good hotel'
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
    'close to the beach', 'on the beach'
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
  
  return false;
};

export const extractLocationFromMessage = (message: string): string | undefined => {
  // List of known locations in Sifnos, with different spelling variations
  const locationMappings: Record<string, string[]> = {
    'platis gialos': ['platy gialo', 'plati gialo', 'plati gialos', 'platys gialos', 'platys', 'platys gialo'],
    'apollonia': ['appolonia', 'apollona', 'apollina', 'appolina'],
    'kamares': ['kamares', 'kamaris', 'kamari'],
    'vathi': ['vathi', 'vathy', 'vati'],
    'kastro': ['castro', 'kastro', 'casrto'],
    'faros': ['pharos', 'faros', 'pharo'],
    'artemonas': ['artemonas', 'artemona', 'artemones']
  };
  
  const messageLower = message.toLowerCase();
  
  // Check for each location and its variations
  for (const [standardName, variations] of Object.entries(locationMappings)) {
    // First check if the standard name is present
    if (messageLower.includes(standardName)) {
      return standardName;
    }
    
    // Then check variations
    for (const variation of variations) {
      if (messageLower.includes(variation)) {
        return standardName; // Return the standard name
      }
    }
  }
  
  // Check for prepositional phrases (in X, near X, at X)
  const prepositions = ['in ', 'near ', 'at ', 'to '];
  for (const [standardName, variations] of Object.entries(locationMappings)) {
    const allNames = [standardName, ...variations];
    
    for (const name of allNames) {
      for (const prep of prepositions) {
        if (messageLower.includes(`${prep}${name}`)) {
          return standardName;
        }
      }
    }
  }
  
  return undefined;
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
