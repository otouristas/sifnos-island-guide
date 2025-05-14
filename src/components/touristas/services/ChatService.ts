import { Message, MessageRole, analyzeMessageTopic } from '../utils/chat-utils';
import { 
  extractLocationFromMessage, 
  extractAmenityFromMessage, 
  extractUserPreferencesFromMessage,
  isFerryRelatedQuery,
  extractPortsFromMessage,
  extractDateFromMessage,
  getFerryInfoForResponse
} from '../utils/chat-utils';

// Use this interface for sending messages to the AI service
export interface AIRequestMessage {
  role: MessageRole;
  content: string;
  id: string;
}

export interface ConversationContext {
  topic: string;
  summary: string;
  timestamp: number;
}

export const callTouristasAI = async (
  messages: AIRequestMessage[],
  preferences: Record<string, string>,
  conversationContexts: ConversationContext[]
): Promise<ReadableStream<Uint8Array> | null> => {
  try {
    // Check if the latest message is ferry related and if we have local data to handle it
    const latestMessage = messages[messages.length - 1];
    const ferryInfo = getFerryInfoForResponse(latestMessage.content);
    
    // If we have ferry data locally, we can use it instead of calling the AI
    if (ferryInfo) {
      // Create a simple transform stream to simulate AI response with our ferry data
      const encoder = new TextEncoder();
      let responseText = `Here's information about the ferry route you asked about:\n\n${ferryInfo}\n\nWould you like to know about any other ferry routes or have questions about accommodations in Sifnos?`;
      
      const stream = new ReadableStream({
        start(controller) {
          // Send the response text in chunks to simulate streaming
          const chunks = responseText.split(' ');
          let i = 0;
          
          function sendNextChunk() {
            if (i < chunks.length) {
              controller.enqueue(encoder.encode(chunks[i] + ' '));
              i++;
              setTimeout(sendNextChunk, 30); // simulate delay
            } else {
              controller.close();
            }
          }
          
          sendNextChunk();
        }
      });
      
      return stream;
    }
    
    // Continue with regular AI call if not ferry-related or we don't have local data
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-travel-assistant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        messages,
        preferences,
        previousConversations: conversationContexts
      })
    });
    
    if (!response.ok) {
      console.error('Error calling AI assistant:', await response.text());
      return null;
    }
    
    return response.body;
  } catch (error) {
    console.error('Error in AI chat service:', error);
    return null;
  }
};

export const searchHotels = async (query: string, preferences?: Record<string, string>): Promise<any[]> => {
  try {
    // Hardcoded Supabase URL and anon key - no environment variables needed
    const supabaseUrl = 'https://wdzlruiekcznbcicjgrz.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkemxydWlla2N6bmJjaWNqZ3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyODAyNzYsImV4cCI6MjA1OTg1NjI3Nn0.NaoVf3tU3Xz08CWCHpQtq7_9H6G6ES9EjtCvPHa0aRk';
    
    // Convert query to lowercase for better matching
    const searchQuery = query.toLowerCase();
    const userPrefs = preferences || {};
    
    // Log search parameters for debugging
    console.log("Searching hotels with query:", searchQuery);
    console.log("User preferences:", userPrefs);
    
    // Direct database fetch instead of using edge function
    const response = await fetch(`${supabaseUrl}/rest/v1/hotels?select=*,hotel_amenities(amenity),hotel_photos(id,photo_url,is_main_photo)`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'apikey': supabaseAnonKey,
        'Prefer': 'return=representation'
      }
    });

    if (!response.ok) {
      console.error('Hotel search error:', response.status, response.statusText);
      return [];
    }

    const hotels = await response.json();
    
    // Enhanced keyword search terms to better capture intent
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
      'balcony', 'terrace', 'patio'
    ];
    
    const travelerTypes = [
      'family', 'luxury', 'budget', 'couple', 'solo', 'group'
    ];

    // Improved filtering logic with scoring system
    let filteredHotels = hotels;
    let foundSpecificFilter = false;
    let scoreMap = new Map<string, number>(); // Hotel ID -> Relevance score
    
    // Initialize scores for all hotels
    hotels.forEach((hotel: any) => {
      scoreMap.set(hotel.id, 0);
    });
    
    // Apply traveler type boosting from preferences
    if (userPrefs.travelerType) {
      const travelerType = userPrefs.travelerType.toLowerCase();
      
      hotels.forEach((hotel: any) => {
        let currentScore = scoreMap.get(hotel.id) || 0;
        
        // Boost score for hotels matching traveler type
        if (travelerType === 'family' && hotel.hotel_types?.includes('family-friendly')) {
          scoreMap.set(hotel.id, currentScore + 10);
        } else if (travelerType === 'luxury' && hotel.rating >= 4) {
          scoreMap.set(hotel.id, currentScore + 10);
        } else if (travelerType === 'budget' && hotel.price && hotel.price <= 150) {
          scoreMap.set(hotel.id, currentScore + 10);
        } else if (travelerType === 'couple' && 
                  (hotel.description?.toLowerCase().includes('romantic') || 
                   hotel.description?.toLowerCase().includes('couple'))) {
          scoreMap.set(hotel.id, currentScore + 10);
        }
      });
      
      foundSpecificFilter = true;
    }
    
    // FIX: Extract location from query first - prioritize explicitly mentioned locations
    const locationMatches = {
      'kamares': ['kamares'],
      'apollonia': ['apollonia'],
      'platis gialos': ['platis gialos', 'platy gialo', 'platys gialos'],
      'vathi': ['vathi'],
      'kastro': ['kastro'],
      'faros': ['faros'],
      'artemonas': ['artemonas']
    };
    
    // Improved location extraction from query and preferences
    let locationToFilter = userPrefs.location;
    
    if (!locationToFilter) {
      // Look for location mentions in the query
      for (const [location, aliases] of Object.entries(locationMatches)) {
        if (aliases.some(alias => searchQuery.includes(alias))) {
          locationToFilter = location;
          break;
        }
      }
    }
    
    if (locationToFilter) {
      console.log("Filtering by location:", locationToFilter);
      
      hotels.forEach((hotel: any) => {
        if (hotel.location?.toLowerCase() === locationToFilter.toLowerCase()) {
          let currentScore = scoreMap.get(hotel.id) || 0;
          scoreMap.set(hotel.id, currentScore + 20); // High boost for exact location match
        }
      });
      
      foundSpecificFilter = true;
    }
    
    // Beach proximity filter from preferences
    if (userPrefs.beachProximity || searchQuery.includes('beach') || searchQuery.includes('sea')) {
      console.log("Boosting beach proximity hotels");
      
      // Beach locations
      const beachLocations = ['platis gialos', 'vathi', 'kamares', 'faros'];
      
      hotels.forEach((hotel: any) => {
        let currentScore = scoreMap.get(hotel.id) || 0;
        
        // Check if hotel is in a beach location
        if (hotel.location && beachLocations.includes(hotel.location.toLowerCase())) {
          scoreMap.set(hotel.id, currentScore + 15);
        }
        
        // Check if hotel description mentions beach proximity
        if (hotel.description?.toLowerCase().includes('beach') || 
            hotel.description?.toLowerCase().includes('meters from the sea') ||
            hotel.description?.toLowerCase().includes('by the sea')) {
          scoreMap.set(hotel.id, currentScore + 10);
        }
      });
      
      foundSpecificFilter = true;
    }
    
    // Amenity filter
    let targetAmenity = '';
    for (const amenity of amenityTerms) {
      if (searchQuery.includes(amenity)) {
        targetAmenity = amenity;
        console.log("Found amenity in query:", targetAmenity);
        break;
      }
    }
    
    if (targetAmenity) {
      hotels.forEach((hotel: any) => {
        const hasAmenity = hotel.hotel_amenities?.some((a: {amenity: string}) => 
          a.amenity.toLowerCase().includes(targetAmenity) || 
          targetAmenity.includes(a.amenity.toLowerCase())
        );
        
        if (hasAmenity) {
          let currentScore = scoreMap.get(hotel.id) || 0;
          scoreMap.set(hotel.id, currentScore + 25); // High boost for amenity match
        }
      });
      
      foundSpecificFilter = true;
    }
    
    // Activity interest boost
    if (userPrefs.activityInterest) {
      const interest = userPrefs.activityInterest.toLowerCase();
      
      // Mapping of interests to relevant locations
      const interestLocationMap: Record<string, string[]> = {
        'nature': ['vathi', 'faros', 'chrysopigi'],
        'culture': ['apollonia', 'kastro', 'artemonas'],
        'culinary': ['apollonia', 'artemonas'],
        'watersports': ['platis gialos', 'vathi', 'kamares']
      };
      
      const relevantLocations = interestLocationMap[interest] || [];
      
      hotels.forEach((hotel: any) => {
        if (hotel.location && relevantLocations.includes(hotel.location.toLowerCase())) {
          let currentScore = scoreMap.get(hotel.id) || 0;
          scoreMap.set(hotel.id, currentScore + 8);
        }
      });
      
      foundSpecificFilter = true;
    }
    
    // Apply basic rating boost
    hotels.forEach((hotel: any) => {
      let currentScore = scoreMap.get(hotel.id) || 0;
      // Add 1-5 points based on rating
      if (hotel.rating) {
        scoreMap.set(hotel.id, currentScore + Math.min(5, hotel.rating));
      }
    });
    
    // If no specific filter was found, fall back to broader location-based filtering
    if (!foundSpecificFilter) {
      if (searchQuery.includes('beach') || searchQuery.includes('sea') || searchQuery.includes('water')) {
        console.log("Filtering for beach hotels");
        filteredHotels = hotels.filter((hotel) => 
          hotel.description?.toLowerCase().includes('beach') || 
          ['platis gialos', 'vathi', 'kamares', 'faros'].includes(hotel.location?.toLowerCase() || '')
        );
      }
    } else {
      // Sort hotels by score and take top results
      const hotelScores = Array.from(scoreMap.entries());
      hotelScores.sort((a, b) => b[1] - a[1]); // Sort by descending score
      
      // Filter out low-scoring hotels (score < 5)
      const topHotelIds = hotelScores
        .filter(entry => entry[1] >= 5)
        .map(entry => entry[0]);
        
      console.log("Top hotel scores:", hotelScores.slice(0, 6).map(([id, score]) => {
        const hotel = hotels.find((h: any) => h.id === id);
        return `${hotel?.name || id}: ${score}`;
      }));
      
      filteredHotels = hotels.filter(hotel => topHotelIds.includes(hotel.id));
    }
    
    console.log(`Filtered hotels for "${searchQuery}":`, filteredHotels.length);
    
    // Additional location-specific filtering for explicit location queries
    if (locationToFilter) {
      const locationFilteredHotels = filteredHotels.filter(
        (hotel) => hotel.location?.toLowerCase() === locationToFilter?.toLowerCase()
      );
      
      // Only use location filtering if it doesn't eliminate all results
      if (locationFilteredHotels.length > 0) {
        filteredHotels = locationFilteredHotels;
        console.log(`Location-filtered hotels for "${locationToFilter}":`, filteredHotels.length);
      }
    }
    
    // Return final filtered and sorted results
    return filteredHotels.slice(0, 6);
  } catch (error) {
    console.error('Error searching hotels:', error);
    return [];
  }
};

export const processStreamingResponse = async (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  messageId: string,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
): Promise<string> => {
  const decoder = new TextDecoder();
  let fullContent = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        break;
      }
      
      // Decode the chunk - now direct content, not SSE format
      const chunk = decoder.decode(value, { stream: true });
      fullContent += chunk;
      
      // Update the message with the accumulated content
      setMessages((prev) => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, content: fullContent } 
            : msg
        )
      );
    }
    
    return fullContent;
  } catch (error) {
    console.error('Error processing stream:', error);
    return fullContent;
  }
};

/**
 * Track conversation context for better AI responses
 * @param messages Array of conversation messages
 * @returns Array of conversation context objects
 */
export const trackConversationContext = (messages: Message[]): ConversationContext[] => {
  // Only process user messages
  const userMessages = messages.filter(msg => msg.role === 'user');
  
  if (userMessages.length === 0) {
    return [];
  }
  
  const contexts: ConversationContext[] = [];
  
  // Analyze the last 3 user messages for context
  const recentUserMessages = userMessages.slice(-3);
  
  for (const message of recentUserMessages) {
    const topic = analyzeMessageTopic(message.content);
    
    // Create a summary of the user's question
    let summary = message.content;
    if (summary.length > 100) {
      summary = summary.substring(0, 97) + '...';
    }
    
    contexts.push({
      topic,
      summary,
      timestamp: Date.now()
    });
  }
  
  return contexts;
};
