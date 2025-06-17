
import { UnifiedHotel } from '@/services/hotelSearch';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  showHotels?: boolean;
  hotels?: UnifiedHotel[];
  location?: string;
  preferences?: Record<string, string>;
}

// Export HotelType interface for backward compatibility
export interface HotelType {
  id: string;
  name: string;
  location: string;
  rating?: number;
  description?: string;
  short_description?: string;
  hotel_types?: string[];
  hotel_amenities?: Array<{ amenity: string }>;
  hotel_photos?: Array<{ id: string; photo_url: string; is_main_photo: boolean }>;
  price?: number;
}

export const isHotelRelatedQuery = (message: string): boolean => {
  const hotelKeywords = [
    'hotel', 'hotels', 'accommodation', 'stay', 'room', 'rooms',
    'booking', 'book', 'reserve', 'availability', 'available',
    'where to stay', 'place to stay', 'lodging', 'resort', 'villa', 'villas',
    'guesthouse', 'pension', 'apartment', 'studio'
  ];
  
  const locationKeywords = [
    'platis gialos', 'apollonia', 'kamares', 'kastro', 'artemonas',
    'vathi', 'faros', 'chrysopigi', 'sifnos'
  ];
  
  const lowerMessage = message.toLowerCase();
  
  return hotelKeywords.some(keyword => lowerMessage.includes(keyword)) ||
         locationKeywords.some(location => lowerMessage.includes(location));
};

export const extractLocationFromMessage = (message: string): string | null => {
  const locations = [
    'platis gialos', 'apollonia', 'kamares', 'kastro', 'artemonas',
    'vathi', 'faros', 'chrysopigi'
  ];
  
  const lowerMessage = message.toLowerCase();
  
  for (const location of locations) {
    if (lowerMessage.includes(location)) {
      return location;
    }
  }
  
  return null;
};

export const extractAmenityFromMessage = (message: string): string[] => {
  const amenities = [
    'pool', 'swimming pool', 'wifi', 'breakfast', 'parking', 'spa',
    'gym', 'restaurant', 'bar', 'beach', 'sea view', 'balcony'
  ];
  
  const lowerMessage = message.toLowerCase();
  const foundAmenities: string[] = [];
  
  for (const amenity of amenities) {
    if (lowerMessage.includes(amenity)) {
      foundAmenities.push(amenity);
    }
  }
  
  return foundAmenities;
};

export const extractLocationsFromResponse = (response: string): string[] => {
  const locations = [
    'platis gialos', 'apollonia', 'kamares', 'kastro', 'artemonas',
    'vathi', 'faros', 'chrysopigi'
  ];
  
  const lowerResponse = response.toLowerCase();
  const foundLocations: string[] = [];
  
  for (const location of locations) {
    if (lowerResponse.includes(location)) {
      foundLocations.push(location);
    }
  }
  
  return foundLocations;
};

export const shouldShowHotelsInResponse = (response: string): boolean => {
  const triggers = [
    'hotels', 'accommodation', 'stay', 'recommend', 'suggest',
    'available', 'book', 'reserve'
  ];
  
  const lowerResponse = response.toLowerCase();
  return triggers.some(trigger => lowerResponse.includes(trigger));
};

export const extractUserPreferencesFromMessage = (message: string): Record<string, string> => {
  const preferences: Record<string, string> = {};
  const lowerMessage = message.toLowerCase();
  
  // Extract budget preferences
  if (lowerMessage.includes('budget') || lowerMessage.includes('cheap')) {
    preferences.budget = 'budget';
  } else if (lowerMessage.includes('luxury') || lowerMessage.includes('expensive')) {
    preferences.budget = 'luxury';
  }
  
  // Extract group size
  const adults = lowerMessage.match(/(\d+)\s*adults?/);
  if (adults) {
    preferences.adults = adults[1];
  }
  
  const children = lowerMessage.match(/(\d+)\s*children?/);
  if (children) {
    preferences.children = children[1];
  }
  
  // Extract dates
  const checkIn = lowerMessage.match(/check.?in\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/);
  if (checkIn) {
    preferences.checkIn = checkIn[1];
  }
  
  const checkOut = lowerMessage.match(/check.?out\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/);
  if (checkOut) {
    preferences.checkOut = checkOut[1];
  }
  
  return preferences;
};

export const extractHotelNameFromMessage = (message: string): string | null => {
  const lowerMessage = message.toLowerCase();
  
  // Look for specific hotel names or types
  if (lowerMessage.includes('villa') && !lowerMessage.includes('village')) {
    return 'villa';
  }
  
  // Add more specific hotel name extractions as needed
  return null;
};

// Add the missing analyzeMessageTopic function
export const analyzeMessageTopic = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  // Analyze message content to determine topic
  if (isHotelRelatedQuery(message)) {
    if (lowerMessage.includes('villa') || lowerMessage.includes('villas')) {
      return 'villa search';
    } else if (lowerMessage.includes('luxury') || lowerMessage.includes('expensive')) {
      return 'luxury accommodation';
    } else if (lowerMessage.includes('budget') || lowerMessage.includes('cheap')) {
      return 'budget accommodation';
    } else if (lowerMessage.includes('family')) {
      return 'family accommodation';
    } else if (lowerMessage.includes('beach')) {
      return 'beach accommodation';
    } else {
      return 'general accommodation';
    }
  }
  
  // Check for location-related queries
  if (extractLocationFromMessage(message)) {
    return 'location inquiry';
  }
  
  // Default topic
  return 'general inquiry';
};
