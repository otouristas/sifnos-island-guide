
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
export const extractLocationFromMessage = (message: string): string | undefined => {
  const lowercaseMessage = message.toLowerCase();
  
  // Dictionary of locations with alternative spellings/mentions
  const locationDictionary = {
    'apollonia': ['apollonia', 'capital', 'town center', 'main town', 'center of the island'],
    'kamares': ['kamares', 'port', 'main port', 'ferry port', 'port area'],
    'platis gialos': ['platis gialos', 'platy gialo', 'platys gialos', 'platis yialos', 'plati gialos'],
    'vathi': ['vathi', 'vathy', 'vati'],
    'kastro': ['kastro', 'castro', 'medieval village', 'old fort', 'fortress'],
    'faros': ['faros', 'pharos', 'lighthouse'],
    'artemonas': ['artemonas', 'artemonas village', 'artemona'],
    'exambela': ['exambela', 'exabela'],
    'chrysopigi': ['chrysopigi', 'chrisopigi', 'chrissopigi', 'monastery'],
    'herronisos': ['herronisos', 'heronissos', 'heronnisos', 'north'],
    'kato petali': ['kato petali', 'lower petali'],
    'pano petali': ['pano petali', 'upper petali', 'pano petale'],
    'troullaki': ['troullaki', 'troulaki']
  };

  // Check for each location and its variations
  for (const [primaryLocation, variations] of Object.entries(locationDictionary)) {
    for (const variant of variations) {
      if (lowercaseMessage.includes(variant)) {
        return primaryLocation; // Return standardized location name
      }
    }
  }

  // Check for general beach area references
  if (lowercaseMessage.includes('beach area') || 
      lowercaseMessage.includes('beachfront') || 
      lowercaseMessage.includes('by the beach') ||
      lowercaseMessage.includes('beach hotel')) {
    // Default to the most popular beach area if specific beach not mentioned
    return 'platis gialos';
  }

  return undefined;
};

/**
 * Enhanced amenity extractor with better contextual understanding
 * @param message The message to analyze
 * @returns The extracted amenities as an array
 */
export const extractAmenityFromMessage = (message: string): string[] => {
  const lowercaseMessage = message.toLowerCase();
  const amenities = [
    // Swimming
    {key: 'pool', variations: ['pool', 'swimming pool', 'swim']},
    // Food
    {key: 'breakfast', variations: ['breakfast', 'morning meal', 'brunch']},
    {key: 'restaurant', variations: ['restaurant', 'dining', 'food service', 'place to eat']},
    // Connectivity
    {key: 'wifi', variations: ['wifi', 'wi-fi', 'internet', 'connection', 'online']},
    // Climate
    {key: 'air conditioning', variations: ['air conditioning', 'ac', 'air-con', 'cooling', 'climate control']},
    // Views
    {key: 'sea view', variations: ['sea view', 'ocean view', 'beach view', 'water view', 'view of the sea']},
    // Facilities
    {key: 'parking', variations: ['parking', 'car park', 'place to park']},
    {key: 'gym', variations: ['gym', 'fitness', 'workout', 'exercise']},
    {key: 'spa', variations: ['spa', 'massage', 'wellness', 'relaxation']},
    {key: 'room service', variations: ['room service', 'service to room']},
    {key: 'bar', variations: ['bar', 'lounge', 'drinks']},
    {key: '24-hour reception', variations: ['24 hour', '24-hour', 'reception', 'front desk', 'all hours']},
    // Special needs
    {key: 'family friendly', variations: ['family friendly', 'kids', 'children', 'for families']},
    {key: 'pet friendly', variations: ['pet friendly', 'pets', 'dogs', 'cats', 'animals']},
    {key: 'accessible', variations: ['accessible', 'disabled', 'wheelchair', 'handicap']},
    // Outdoor
    {key: 'balcony', variations: ['balcony', 'terrace', 'patio', 'outdoor space', 'veranda']},
    {key: 'beach access', variations: ['beach access', 'private beach', 'direct beach', 'beach entry']},
    // Self-catering
    {key: 'kitchen', variations: ['kitchen', 'kitchenette', 'cooking', 'self-catering']}
  ];

  // Find all amenities mentioned in the message
  const foundAmenities: string[] = [];

  for (const amenity of amenities) {
    if (amenity.variations.some(variant => lowercaseMessage.includes(variant))) {
      foundAmenities.push(amenity.key);
    }
  }

  return foundAmenities;
};

/**
 * Enhanced location extractor from AI responses
 * @param response The AI response to analyze
 * @returns Array of extracted locations
 */
export const extractLocationsFromResponse = (response: string): string[] => {
  if (!response) return [];
  
  const lowercaseResponse = response.toLowerCase();
  
  // Dictionary of locations with alternative spellings/mentions
  const locationDictionary = {
    'apollonia': ['apollonia', 'capital', 'town center', 'main town'],
    'kamares': ['kamares', 'port', 'main port', 'ferry port'],
    'platis gialos': ['platis gialos', 'platy gialo', 'platys gialos', 'platis yialos'],
    'vathi': ['vathi', 'vathy', 'vati'],
    'kastro': ['kastro', 'castro', 'medieval village', 'old fort'],
    'faros': ['faros', 'pharos'],
    'artemonas': ['artemonas', 'artemonas village'],
    'exambela': ['exambela', 'exabela'],
    'chrysopigi': ['chrysopigi', 'chrisopigi', 'chrissopigi'],
    'herronisos': ['herronisos', 'heronissos', 'heronnisos'],
    'kato petali': ['kato petali'],
    'pano petali': ['pano petali', 'pano petale'],
    'troullaki': ['troullaki', 'troulaki']
  };

  const foundLocations: string[] = [];

  // Check for each location and its variations
  for (const [primaryLocation, variations] of Object.entries(locationDictionary)) {
    for (const variant of variations) {
      if (lowercaseResponse.includes(variant)) {
        foundLocations.push(primaryLocation); // Add standardized location name
        break; // Once we find one variation, no need to check others for this location
      }
    }
  }
  
  return [...new Set(foundLocations)]; // Remove duplicates
};

/**
 * Enhanced hotel trigger detection in AI responses
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
    'hotels near',
    'hotels with',
    'options with',
    'properties with',
    'accommodations with',
    'following hotels',
    'these properties',
    'place to stay',
    'places you might consider'
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
  
  // Check for stay recommendations
  const stayRecommendations = [
    'i recommend staying',
    'you might enjoy staying',
    'consider booking',
    'i suggest looking at',
    'perfect for your stay',
    'ideal accommodation',
    'best area to stay',
    'great place to book'
  ];
  
  // If we detect a discussion about beaches, also trigger hotel results
  const hasBeachDiscussion = beachLocationMentions.some(phrase => 
    lowercaseResponse.includes(phrase.toLowerCase())
  );
  
  const hasStayRecommendation = stayRecommendations.some(phrase =>
    lowercaseResponse.includes(phrase.toLowerCase())
  );
  
  // Return true if any trigger phrase or beach location is mentioned
  return triggerPhrases.some(phrase => lowercaseResponse.includes(phrase.toLowerCase())) || 
         hasBeachDiscussion || 
         hasStayRecommendation;
};

/**
 * Extract user preference from message for personalization
 * @param message Message to analyze
 * @returns Object with extracted preferences
 */
export const extractUserPreferencesFromMessage = (message: string): Record<string, string> => {
  const lowercaseMessage = message.toLowerCase();
  const preferences: Record<string, string> = {};
  
  // Traveler type detection
  if (lowercaseMessage.includes('family') || 
      lowercaseMessage.includes('kid') || 
      lowercaseMessage.includes('child')) {
    preferences.travelerType = 'family';
  } else if (lowercaseMessage.includes('luxury') || 
             lowercaseMessage.includes('high-end') || 
             lowercaseMessage.includes('upscale')) {
    preferences.travelerType = 'luxury';
  } else if (lowercaseMessage.includes('budget') || 
             lowercaseMessage.includes('affordable') || 
             lowercaseMessage.includes('cheap')) {
    preferences.travelerType = 'budget';
  } else if (lowercaseMessage.includes('couple') || 
             lowercaseMessage.includes('romantic') || 
             lowercaseMessage.includes('honeymoon')) {
    preferences.travelerType = 'couple';
  }
  
  // Stay length detection
  if (lowercaseMessage.includes('weekend') || 
      lowercaseMessage.includes('2 day') || 
      lowercaseMessage.includes('two day')) {
    preferences.stayLength = 'short';
  } else if (lowercaseMessage.includes('week') || 
             lowercaseMessage.includes('7 day') || 
             lowercaseMessage.includes('5 day')) {
    preferences.stayLength = 'medium';
  } else if (lowercaseMessage.includes('two week') || 
             lowercaseMessage.includes('long stay') || 
             lowercaseMessage.includes('extended')) {
    preferences.stayLength = 'long';
  }
  
  // Location preference
  const locationPreference = extractLocationFromMessage(message);
  if (locationPreference) {
    preferences.location = locationPreference;
  }
  
  // Beach proximity preference
  if (lowercaseMessage.includes('beachfront') || 
      lowercaseMessage.includes('on the beach') || 
      lowercaseMessage.includes('by the beach')) {
    preferences.beachProximity = 'beachfront';
  } else if (lowercaseMessage.includes('near beach') || 
             lowercaseMessage.includes('close to beach') || 
             lowercaseMessage.includes('walking distance to beach')) {
    preferences.beachProximity = 'near beach';
  }
  
  // Activity preferences
  if (lowercaseMessage.includes('hiking') || 
      lowercaseMessage.includes('nature') || 
      lowercaseMessage.includes('walking')) {
    preferences.activityInterest = 'nature';
  } else if (lowercaseMessage.includes('history') || 
             lowercaseMessage.includes('culture') || 
             lowercaseMessage.includes('museum')) {
    preferences.activityInterest = 'culture';
  } else if (lowercaseMessage.includes('food') || 
             lowercaseMessage.includes('restaurant') || 
             lowercaseMessage.includes('dining')) {
    preferences.activityInterest = 'culinary';
  } else if (lowercaseMessage.includes('swimming') || 
             lowercaseMessage.includes('snorkel') || 
             lowercaseMessage.includes('water')) {
    preferences.activityInterest = 'watersports';
  }
  
  return preferences;
};

/**
 * Analyze a message to determine its main topic for context tracking
 */
export const analyzeMessageTopic = (message: string): string => {
  const lowercaseMessage = message.toLowerCase();
  
  if (lowercaseMessage.includes('beach') || lowercaseMessage.includes('swimming')) {
    return 'beaches';
  } else if (lowercaseMessage.includes('restaurant') || lowercaseMessage.includes('food') || 
             lowercaseMessage.includes('eat')) {
    return 'dining';
  } else if (lowercaseMessage.includes('hotel') || lowercaseMessage.includes('stay') || 
             lowercaseMessage.includes('accommodation')) {
    return 'accommodations';
  } else if (lowercaseMessage.includes('activ') || lowercaseMessage.includes('thing to do') || 
             lowercaseMessage.includes('attraction')) {
    return 'activities';
  } else if (lowercaseMessage.includes('transport') || lowercaseMessage.includes('bus') || 
             lowercaseMessage.includes('taxi') || lowercaseMessage.includes('get around')) {
    return 'transportation';
  } else if (lowercaseMessage.includes('weather') || lowercaseMessage.includes('temperature') || 
             lowercaseMessage.includes('rain')) {
    return 'weather';
  } else if (lowercaseMessage.includes('itinerary') || lowercaseMessage.includes('plan') || 
             lowercaseMessage.includes('day trip')) {
    return 'itinerary';
  }
  
  return 'general';
};

export type MessageRole = 'user' | 'assistant' | 'system';

export type Message = {
  id: string;
  role: MessageRole;
  content: string;
  location?: string;
  hotels?: any[];
  showHotels?: boolean;
  preferences?: Record<string, string>;
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

// Type for tracking conversation context
export type ConversationContext = {
  topic: string;
  summary: string;
  timestamp: number;
};
