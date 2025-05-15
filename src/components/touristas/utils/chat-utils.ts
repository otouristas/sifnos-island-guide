type Location = 'platis gialos' | 'apollonia' | 'kamares' | 'vathi' | 'kastro' | 'faros' | 'artemonas';

// Enhanced hotel query detection with better NLU capabilities
export const isHotelRelatedQuery = (message: string): boolean => {
  // More specific hotel-related terms
  const hotelTerms = [
    'hotel', 'stay', 'accommodation', 'room', 'apartment', 'villa', 'place to stay',
    'where to stay', 'lodging', 'resort', 'motel', 'inn', 'hostel', 'pension',
    'where can i stay', 'places to stay', 'best hotel', 'recommend hotel',
    'good hotel', 'beach hotel', 'where should i stay', 'booking', 'reserve'
  ];
  const locationTerms = [
    'platis gialos', 'apollonia', 'kamares', 'vathi', 'kastro', 'faros', 
    'artemonas', 'platy gialo', 'in kamares', 'in apollonia', 'in vathi',
    'in kastro', 'in faros', 'in platis gialos', 'near kamares', 'near apollonia',
    'near platis gialos', 'near vathi', 'near kastro', 'near faros', 'chrysopigi'
  ];
  const searchPhrases = [
    'looking for', 'searching for', 'find me', 'can you suggest', 
    'recommend', 'show me', 'i need', 'i want', 'i\'m looking for', 'interested in',
    'plan', 'book', 'need a', 'options for', 'what about', 'tell me about'
  ];
  const beachTerms = [
    'beach', 'beachfront', 'by the sea', 'oceanfront', 'sea view', 
    'ocean view', 'waterfront', 'by the beach', 'near the beach',
    'close to the beach', 'on the beach', 'best beach', 'sandy'
  ];
  
  // Traveler type terms
  const travelerTypeTerms = [
    'family', 'families', 'kids', 'children', 'child-friendly',
    'luxury', 'luxurious', 'high-end', 'upscale', '5-star', 'five-star',
    'budget', 'affordable', 'cheap', 'inexpensive', 'economical',
    'couple', 'romantic', 'honeymoon', 'solo', 'group', 'friends'
  ];
  
  // Amenity/facility terms - expanded list
  const amenityTerms = [
    'pool', 'swimming pool', 'pools', 'swim', 
    'breakfast', 'restaurant', 'restaurants', 
    'wifi', 'internet', 'wi-fi',
    'air conditioning', 'ac', 'air-con',
    'sea view', 'ocean view', 'view', 'beach view', 
    'parking', 'free parking',
    'gym', 'fitness', 'workout',
    'spa', 'massage',
    'room service', 'service',
    'bar', 'lounge',
    'reception', '24 hour', '24-hour',
    'family friendly', 'kids', 'children',
    'pet friendly', 'pets',
    'accessible', 'disabled', 'wheelchair',
    'balcony', 'terrace', 'patio',
    'kitchen', 'kitchenette', 'self-catering',
    'shuttle', 'transfer', 'airport transfer',
    'private beach', 'garden', 'outdoor space'
  ];
  
  const travelActivityTerms = [
    'hiking', 'hike', 'walk', 'walking', 'trails',
    'swimming', 'swim', 'snorkeling', 'snorkel', 'diving', 
    'windsurfing', 'sailing', 'boat', 'kayak',
    'pottery', 'ceramic', 'art', 
    'cooking', 'food', 'culinary', 'gastronomy',
    'sightseeing', 'tour', 'explore', 'visit',
    'nightlife', 'party', 'evening', 'entertainment'
  ];
  
  const messageLower = message.toLowerCase();
  
  // Check for travel activities that might imply hotel needs
  for (const activity of travelActivityTerms) {
    if (messageLower.includes(activity) && (
      messageLower.includes('stay') || 
      messageLower.includes('near') || 
      messageLower.includes('close to') ||
      messageLower.includes('accommodation')
    )) {
      return true;
    }
  }
  
  // Check for traveler types that indicate hotel search
  for (const travelerType of travelerTypeTerms) {
    if ((messageLower.includes(travelerType + ' hotel') || 
         messageLower.includes(travelerType + ' accommodation') ||
         messageLower.includes(travelerType + ' friendly') ||
         messageLower.includes('for ' + travelerType)) &&
        (messageLower.includes('stay') || messageLower.includes('accommodation') || 
         messageLower.includes('hotel') || messageLower.includes('room'))) {
      return true;
    }
  }
  
  // Check for amenity queries first
  for (const amenity of amenityTerms) {
    if (messageLower.includes(amenity) && (
      messageLower.includes('hotel with') || 
      messageLower.includes('accommodation with') ||
      messageLower.includes('stay with') ||
      messageLower.includes('place with')
    )) {
      return true;
    }
  }
  
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
    'nice hotel', 'affordable hotel', 'hotel with pool',
    'hotel with view', 'hotel with beach access', 'hotel near center',
    'accommodation with breakfast', 'hotel with restaurant'
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
  
  // Check for itinerary or travel planning questions
  if ((messageLower.includes('itinerary') || messageLower.includes('plan') || 
       messageLower.includes('travel plan') || messageLower.includes('day trip') ||
       messageLower.includes('things to do')) && 
      (messageLower.includes('stay') || messageLower.includes('sleep') || 
       messageLower.includes('night'))) {
    return true;  
  }
  
  return false;
};

/**
 * Enhanced location extractor with more precise detection and handling of variations
 * @param message The message to analyze
 * @returns The extracted location or undefined
 */
export const extractLocationFromMessage = (message: string): string => {
  const message_lower = message.toLowerCase().trim();
  const locationMatches = {
    'kamares': ['kamares', 'the port', 'port area', 'port of sifnos'],
    'apollonia': ['apollonia', 'capital'],
    'platis gialos': ['platis gialos', 'platys gialos', 'platy gialo', 'plati yialo'],
    'vathi': ['vathi', 'vathy'],
    'kastro': ['kastro', 'castle'],
    'faros': ['faros'],
    'artemonas': ['artemonas']
  };
  
  // First, check for direct location mentions
  for (const [location, aliases] of Object.entries(locationMatches)) {
    for (const alias of aliases) {
      if (message_lower.includes(alias)) {
        return location;
      }
    }
  }
  
  // Look for location patterns like "in [location]" or "at [location]"
  const locationRegexPatterns = [
    /in\s+(\w+)/i,
    /at\s+(\w+)/i,
    /near\s+(\w+)/i,
    /close\s+to\s+(\w+)/i,
    /around\s+(\w+)/i,
  ];
  
  for (const regex of locationRegexPatterns) {
    const match = message_lower.match(regex);
    if (match && match[1]) {
      const potentialLocation = match[1].toLowerCase();
      // Check if this potential location matches any known locations
      for (const [location, aliases] of Object.entries(locationMatches)) {
        if (aliases.some(alias => alias.includes(potentialLocation))) {
          return location;
        }
      }
    }
  }
  
  return '';
};

/**
 * Enhanced amenity extractor with better contextual understanding
 * @param message The message to analyze
 * @returns The extracted amenities as an array
 */
export const extractAmenityFromMessage = (message: string): string[] => {
  const message_lower = message.toLowerCase();
  const amenities: Record<string, string[]> = {
    'pool': ['pool', 'swimming pool', 'swim'],
    'breakfast': ['breakfast', 'morning meal', 'continental breakfast'],
    'wifi': ['wifi', 'wi-fi', 'internet', 'connection'],
    'air conditioning': ['ac', 'air conditioning', 'air-con', 'cool'],
    'sea view': ['view', 'sea view', 'ocean view', 'beach view', 'sea views'],
    'parking': ['parking', 'park', 'car park', 'parking lot'],
    'restaurant': ['restaurant', 'dining', 'eat', 'food'],
    'bar': ['bar', 'drinks', 'cocktails'],
    'family friendly': ['family', 'kids', 'children', 'child']
  };
  
  const result: string[] = [];
  
  for (const [amenity, keywords] of Object.entries(amenities)) {
    if (keywords.some(keyword => message_lower.includes(keyword))) {
      result.push(amenity);
    }
  }
  
  return result;
};

/**
 * Enhanced location extractor from AI responses
 * @param response The AI response to analyze
 * @returns Array of extracted locations
 */
export const extractLocationsFromResponse = (response: string): string[] => {
  const response_lower = response.toLowerCase();
  const locationMatches = {
    'kamares': ['kamares', 'the port', 'port area', 'port of sifnos'],
    'apollonia': ['apollonia', 'capital'],
    'platis gialos': ['platis gialos', 'platys gialos', 'platy gialo', 'plati yialo'],
    'vathi': ['vathi', 'vathy'],
    'kastro': ['kastro', 'castle'],
    'faros': ['faros'],
    'artemonas': ['artemonas']
  };
  
  const mentionedLocations: string[] = [];
  
  for (const [location, aliases] of Object.entries(locationMatches)) {
    if (aliases.some(alias => response_lower.includes(alias))) {
      mentionedLocations.push(location);
    }
  }
  
  return mentionedLocations;
};

/**
 * Enhanced hotel trigger detection in AI responses
 * @param response The AI response to analyze
 * @returns Boolean indicating if hotels should be shown
 */
export const shouldShowHotelsInResponse = (response: string): boolean => {
  const response_lower = response.toLowerCase();
  const hotelTriggers = [
    'here are some hotel options',
    'here are some accommodation options',
    'here are some places to stay',
    'i recommend these hotels',
    'some hotels you might like',
    'these properties might interest you'
  ];
  
  return hotelTriggers.some(trigger => response_lower.includes(trigger));
};

/**
 * Extract user preference from message for personalization
 * @param message Message to analyze
 * @returns Object with extracted preferences
 */
export const extractUserPreferencesFromMessage = (message: string): Record<string, string> => {
  const message_lower = message.toLowerCase();
  const preferences: Record<string, string> = {};
  
  // Extract location preferences
  const location = extractLocationFromMessage(message_lower);
  if (location) {
    preferences.location = location;
  }
  
  // Extract traveler types
  const travelerTypes = {
    'family': ['family', 'with kids', 'with children', 'child-friendly'],
    'couple': ['couple', 'romantic', 'honeymoon', 'anniversary'],
    'solo': ['solo', 'alone', 'by myself'],
    'luxury': ['luxury', 'high-end', 'five star', '5 star', 'best'],
    'budget': ['budget', 'cheap', 'affordable', 'inexpensive']
  };
  
  for (const [type, keywords] of Object.entries(travelerTypes)) {
    if (keywords.some(keyword => message_lower.includes(keyword))) {
      preferences.travelerType = type;
      break; // Only one traveler type at a time
    }
  }
  
  // Extract beach proximity preference
  if (
    message_lower.includes('beach') || 
    message_lower.includes('by the sea') || 
    message_lower.includes('sea view') || 
    message_lower.includes('ocean view') ||
    message_lower.includes('near water')
  ) {
    preferences.beachProximity = 'true';
  }
  
  // Extract activity interests
  const activityInterests = {
    'nature': ['nature', 'hiking', 'natural', 'outdoors', 'landscape'],
    'culture': ['culture', 'history', 'museum', 'traditional', 'historic'],
    'culinary': ['food', 'restaurant', 'eating', 'cuisine', 'culinary'],
    'watersports': ['water sports', 'swimming', 'diving', 'snorkel', 'water activities']
  };
  
  for (const [interest, keywords] of Object.entries(activityInterests)) {
    if (keywords.some(keyword => message_lower.includes(keyword))) {
      preferences.activityInterest = interest;
      break; // Only one main activity interest at a time
    }
  }
  
  return preferences;
};

/**
 * Analyze a message to determine its main topic for context tracking
 */
export const analyzeMessageTopic = (message: string): string => {
  const message_lower = message.toLowerCase();
  
  const topics = {
    'hotel_query': ['hotel', 'stay', 'accommodation', 'room', 'place to stay'],
    'location_query': ['where', 'location', 'area', 'apollonia', 'kamares', 'platis gialos', 'vathi', 'kastro', 'faros'],
    'activity_query': ['do', 'activity', 'visit', 'see', 'beach', 'hiking', 'food', 'restaurant', 'museum'],
    'transport_query': ['get', 'travel', 'transport', 'bus', 'taxi', 'car', 'rental', 'how to reach'],
    'amenity_query': ['wifi', 'pool', 'breakfast', 'restaurant', 'view', 'air conditioning', 'ac'],
    'general_query': ['what', 'when', 'how', 'why', 'is there', 'can i', 'tell me']
  };
  
  for (const [topic, keywords] of Object.entries(topics)) {
    if (keywords.some(keyword => message_lower.includes(keyword))) {
      return topic;
    }
  }
  
  return 'other';
};

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  hotels?: HotelType[];
  location?: string;
  showHotels?: boolean;
  preferences?: Record<string, string>;
}

export type MessageRole = 'user' | 'assistant';

export interface HotelType {
  id: string;
  name: string;
  location: string;
  description?: string;
  short_description?: string;
  rating: number;
  price: number;
  logo_path?: string;
  hotel_photos?: {
    id: string;
    photo_url: string;
    is_main_photo?: boolean;
  }[];
  hotel_amenities?: {
    amenity: string;
  }[];
  hotel_types?: string[];
}

// Type for tracking conversation context
export type ConversationContext = {
  topic: string;
  summary: string;
  timestamp: number;
};
