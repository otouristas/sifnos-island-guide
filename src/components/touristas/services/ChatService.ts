import { supabase } from '@/integrations/supabase/client';
import { AIRequestMessage, ConversationContext } from '../utils/chat-utils';

/**
 * Call the Touristas AI function to get travel recommendations
 * @param messages Array of messages to send to the AI
 * @param preferences User preferences object
 * @param conversationContexts Array of conversation contexts
 * @returns ReadableStream of the AI's response
 */
export const callTouristasAI = async (
  messages: AIRequestMessage[],
  preferences: Record<string, string>,
  conversationContexts: ConversationContext[]
): Promise<ReadableStream<Uint8Array>> => {
  try {
    const functionUrl = process.env.NEXT_PUBLIC_AI_FUNCTION_URL || '';
    
    if (!functionUrl) {
      throw new Error("AI function URL is not defined in environment variables.");
    }
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        messages, 
        preferences,
        previousConversations: conversationContexts
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI function failed:', response.status, errorText);
      throw new Error(`AI function failed with status ${response.status}: ${errorText}`);
    }
    
    // Ensure the response body is a ReadableStream
    if (!response.body) {
      throw new Error("Response body is null");
    }
    
    return response.body;
  } catch (error) {
    console.error('Error calling AI function:', error);
    throw error;
  }
};

/**
 * Process the streaming response from the AI and update the chat messages
 * @param reader Reader from the AI's streaming response
 * @param assistantId ID of the assistant message to update
 * @param setMessages Function to update the chat messages state
 * @returns Full content of the AI's response
 */
export const processStreamingResponse = async (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  assistantId: string,
  setMessages: (messages: (prev: any) => any[]) => void
): Promise<string> => {
  let fullContent = '';
  const decoder = new TextDecoder();
  
  try {
    let chunkResult = await reader.read();
    
    while (!chunkResult.done) {
      const chunkValue = decoder.decode(chunkResult.value);
      fullContent += chunkValue;
      
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? { ...msg, content: fullContent }
            : msg
        )
      );
      
      chunkResult = await reader.read();
    }
  } catch (error) {
    console.error("Error reading stream:", error);
    throw error;
  } finally {
    reader.releaseLock();
  }
  
  return fullContent;
};

/**
 * Track conversation context for better continuity
 * @param messages Array of messages in the conversation
 * @returns Array of conversation contexts
 */
export const trackConversationContext = (messages: any[]): ConversationContext[] => {
  // Basic example: Summarize the last 3 turns
  const recentMessages = messages.slice(-3);
  
  return recentMessages.map(msg => ({
    topic: msg.role === 'user' ? 'User Query' : 'AI Response',
    summary: msg.content,
    timestamp: Date.now() // Add the timestamp property required by ConversationContext
  }));
};

// Define the proper types for our data
interface HotelWithAmenity {
  id: string;
  [key: string]: any;
}

// Define the proper type for RPC function parameters
interface GetHotelsWithAmenityParams {
  amenity_name: string;
}

/**
 * Search for hotels based on user query and preferences
 * @param query User's query text
 * @param preferences User preferences object
 * @returns Array of hotels matching the criteria
 */
export const searchHotels = async (query: string, preferences: Record<string, string> = {}): Promise<any[]> => {
  try {
    console.log("Searching hotels with query:", query);
    console.log("User preferences:", preferences);
    
    // Start building the query
    let supabaseQuery = supabase
      .from('hotels')
      .select(`
        *,
        hotel_amenities(amenity),
        hotel_photos(id, photo_url, is_main_photo)
      `);

    // If a location is specified in preferences, filter by it
    if (preferences.location) {
      const location = preferences.location.toLowerCase();
      supabaseQuery = supabaseQuery.ilike('location', `%${location}%`);
    }

    // Handle amenity filtering - properly check for pool in amenities
    if (query.toLowerCase().includes('pool') || 
        query.toLowerCase().includes('swimming') || 
        preferences.amenity?.toLowerCase().includes('pool')) {
      
      // Use the rpc method with correct type parameters - both input and output types
      const { data, error: poolError } = await supabase
        .rpc<GetHotelsWithAmenityParams, HotelWithAmenity[]>(
          'get_hotels_with_amenity', 
          { amenity_name: 'pool' }
        );
      
      // No need for explicit casting since types are properly set
      const poolHotels = data || [];
      
      if (poolError) {
        console.error("Error finding hotels with pools:", poolError);
        // Fallback to filtering after fetch if RPC fails
      } else if (poolHotels && poolHotels.length > 0) {
        // We have pool hotels from RPC, use their IDs to filter
        const poolHotelIds = poolHotels.map((hotel) => hotel.id);
        supabaseQuery = supabaseQuery.in('id', poolHotelIds);
      }
    }
    
    // Add additional filters based on user query
    if (query.toLowerCase().includes('beach') || preferences.beach === 'true') {
      supabaseQuery = supabaseQuery.or('location.ilike.%platis gialos%,location.ilike.%kamares%,location.ilike.%vathi%,description.ilike.%beach%');
    }
    
    if (query.toLowerCase().includes('family') || preferences.family === 'true') {
      supabaseQuery = supabaseQuery.contains('hotel_types', ['family-friendly']);
    }
    
    if (query.toLowerCase().includes('luxury') || preferences.luxury === 'true') {
      supabaseQuery = supabaseQuery.gte('rating', 4);
    }
    
    // Limit the number of results
    const { data: hotels, error } = await supabaseQuery.limit(5);
    
    if (error) {
      console.error("Error fetching hotels:", error);
      return [];
    }
    
    // Final verification for pool queries to ensure we filter properly
    if (query.toLowerCase().includes('pool') || 
        query.toLowerCase().includes('swimming') || 
        preferences.amenity?.toLowerCase().includes('pool')) {
      
      // Secondary filter to check hotel amenities directly
      return hotels.filter((hotel: any) => {
        return hotel.hotel_amenities?.some((amenity: any) => 
          amenity.amenity?.toLowerCase().includes('pool') ||
          amenity.amenity?.toLowerCase().includes('swimming')
        );
      });
    }
    
    return hotels || [];
  } catch (error) {
    console.error("Error in searchHotels:", error);
    return [];
  }
}

/**
 * Extract location from user messages like "hotels in Platis Gialos"
 * @param message User's message text
 * @returns Location string if found, otherwise null
 */
export const extractLocationFromMessage = (message: string): string | null => {
  const locationPatterns = [
    /in\s+([A-Za-z\s]+)/i,          // "in Platis Gialos"
    /near\s+([A-Za-z\s]+)/i,        // "near Kamares"
    /at\s+([A-Za-z\s]+)/i,          // "at Vathi"
    /location\s+([A-Za-z\s]+)/i,    // "location Apollonia"
    /area\s+([A-Za-z\s]+)/i,        // "area Faros"
    /around\s+([A-Za-z\s]+)/i       // "around Kastro"
  ];
  
  for (const pattern of locationPatterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return null;
};

/**
 * Extract locations from AI response
 * @param response AI's response text
 * @returns Array of location strings found in the response
 */
export const extractLocationsFromResponse = (response: string): string[] => {
  const locationRegex = /(Platis Gialos|Apollonia|Kamares|Vathi|Kastro|Faros|Artemonas|Chrysopigi)/gi;
  const matches = response.match(locationRegex);
  return matches ? Array.from(new Set(matches)) : [];
};

/**
 * Determine if the AI response indicates that hotels should be shown
 * @param response AI's response text
 * @returns True if hotels should be shown, otherwise false
 */
export const shouldShowHotelsInResponse = (response: string): boolean => {
  const triggers = [
    /hotel options/i,
    /accommodation/i,
    /place to stay/i,
    /recommendations/i
  ];
  
  return triggers.some(trigger => trigger.test(response));
};

/**
 * Extract amenities from user messages like "hotels with a pool"
 * @param message User's message text
 * @returns Array of amenity keywords found in the message
 */
export const extractAmenityFromMessage = (message: string): string[] => {
  // Common amenities to look for
  const amenities = [
    'pool', 'swimming pool', 'breakfast', 'wifi', 'restaurant', 'view', 
    'balcony', 'beach access', 'air conditioning', 'air-conditioning', 'ac'
  ];
  
  const foundAmenities: string[] = [];
  const lowerMessage = message.toLowerCase();
  
  // Pattern matching for "with X" or "has X" phrases
  const amenityPatterns = [
    /with\s+(?:a\s+|an\s+)?([a-z\s-]+)/gi,
    /has\s+(?:a\s+|an\s+)?([a-z\s-]+)/gi,
    /offering\s+(?:a\s+|an\s+)?([a-z\s-]+)/gi,
    /featuring\s+(?:a\s+|an\s+)?([a-z\s-]+)/gi,
    /include\s+(?:a\s+|an\s+)?([a-z\s-]+)/gi
  ];
  
  // Check for direct mention of amenities
  amenities.forEach(amenity => {
    if (lowerMessage.includes(amenity.toLowerCase())) {
      foundAmenities.push(amenity);
    }
  });
  
  // Check for amenities mentioned in patterns
  amenityPatterns.forEach(pattern => {
    const matches = [...lowerMessage.matchAll(pattern)];
    matches.forEach(match => {
      if (match[1]) {
        const potentialAmenity = match[1].trim();
        // Check if this matches any known amenity
        amenities.forEach(amenity => {
          if (potentialAmenity.includes(amenity.toLowerCase())) {
            foundAmenities.push(amenity);
          }
        });
      }
    });
  });
  
  // Remove duplicates
  return [...new Set(foundAmenities)];
};

/**
 * Extract user preferences from the message
 * @param message User's message text
 * @returns Object containing user preferences
 */
export const extractUserPreferencesFromMessage = (message: string): Record<string, string> => {
  const preferences: Record<string, string> = {};
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('beach')) {
    preferences.beach = 'true';
  }
  if (lowerMessage.includes('family')) {
    preferences.family = 'true';
  }
   if (lowerMessage.includes('luxury')) {
    preferences.luxury = 'true';
  }
  
  return preferences;
};
