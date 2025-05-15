
import { supabase } from '@/integrations/supabase/client';
import { Message, extractUserPreferencesFromMessage, analyzeMessageTopic } from '../utils/chat-utils';

// Use this interface for sending messages to the AI service
export type AIRequestMessage = {
  role: 'user' | 'assistant';
  content: string;
  id: string;
};

export type ConversationContext = {
  topic: string;
  summary: string;
  timestamp?: number;
};

/**
 * Search for hotels based on user query and preferences
 * @param query User's search query
 * @param preferences User's preferences
 * @returns Array of matching hotels
 */
export const searchHotels = async (query: string, preferences: Record<string, any> = {}) => {
  const queryLower = query.toLowerCase();
  console.log('Searching hotels with query:', query);
  console.log('Search preferences:', preferences);

  try {
    let supabaseQuery = supabase
      .from('hotels')
      .select(`
        *,
        hotel_amenities(amenity),
        hotel_photos(id, photo_url, is_main_photo)
      `)
      .order('rating', { ascending: false });
    
    // Filter by location if specified
    if (preferences.location) {
      supabaseQuery = supabaseQuery.ilike('location', `%${preferences.location}%`);
    }
    
    // Apply filters based on extracted amenities (as comma-separated string)
    if (preferences.amenities) {
      const amenitiesArray = preferences.amenities.split(',');
      console.log('Filtering by amenities:', amenitiesArray);
      
      // For each amenity, create a specific filter
      for (const amenity of amenitiesArray) {
        // Special case for pool - must have pool amenity
        if (amenity === 'pool') {
          // We'll use the response data to filter further as RLS doesn't support this kind of filtering
        }
        
        // For other amenities, adjust accordingly
        // This is left as a placeholder for future amenity filtering implementations
      }
    }
    
    // Apply filter for specific hotel name if provided
    if (preferences.hotelName) {
      console.log('Filtering by hotel name:', preferences.hotelName);
      
      // Check if it's a specific hotel name or a generic type
      if (['Villa Olivia Clara', 'Filadaki Villas', 'Meropi Rooms and Apartments', 'ALK HOTEL™', 'Morpheas Pension & Apartments'].includes(preferences.hotelName)) {
        // Exact hotel name match
        supabaseQuery = supabaseQuery.eq('name', preferences.hotelName);
      } else if (preferences.hotelName === 'villa') {
        // Generic villa type
        supabaseQuery = supabaseQuery.ilike('name', '%villa%');
      } else if (preferences.hotelName === 'hotel') {
        // Generic hotel type
        supabaseQuery = supabaseQuery.ilike('name', '%hotel%');
      } else if (preferences.hotelName === 'pension') {
        // Generic pension type
        supabaseQuery = supabaseQuery.ilike('name', '%pension%');
      } else {
        // Partial name match
        supabaseQuery = supabaseQuery.ilike('name', `%${preferences.hotelName}%`);
      }
    }
    
    // Execute the query
    const { data: hotels, error } = await supabaseQuery;
    
    if (error) {
      console.error('Error searching hotels:', error);
      return [];
    }
    
    // Apply post-query filters that can't be done in the database
    let filteredHotels = hotels || [];
    
    // Filter by pool if specifically requested
    if (preferences.amenities && preferences.amenities.includes('pool')) {
      filteredHotels = filteredHotels.filter(hotel => 
        hotel.hotel_amenities?.some((a: any) => 
          a.amenity.toLowerCase().includes('pool') || 
          a.amenity.toLowerCase().includes('swimming')
        )
      );
      console.log('After pool filter, hotels count:', filteredHotels.length);
    }
    
    // Apply traveler type filters
    if (preferences.travelerType) {
      if (preferences.travelerType === 'family') {
        filteredHotels = filteredHotels.filter(hotel => 
          hotel.hotel_types?.includes('family-friendly')
        );
      } else if (preferences.travelerType === 'luxury') {
        filteredHotels = filteredHotels.filter(hotel => hotel.rating >= 4);
      } else if (preferences.travelerType === 'budget') {
        filteredHotels = filteredHotels.filter(hotel => hotel.price <= 150);
      }
    }
    
    // Limit results to maximum 3 hotels
    return filteredHotels.slice(0, 3);
  } catch (error) {
    console.error('Error in hotel search:', error);
    return [];
  }
};

export const callTouristasAI = async (
  messages: AIRequestMessage[], 
  preferences?: Record<string, string>,
  previousConversations?: ConversationContext[]
): Promise<ReadableStream<Uint8Array> | null> => {
  try {
    // Hardcoded Supabase URL and anon key - no environment variables needed
    const supabaseUrl = 'https://wdzlruiekcznbcicjgrz.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkemxydWlla2N6bmJjaWNqZ3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyODAyNzYsImV4cCI6MjA1OTg1NjI3Nn0.NaoVf3tU3Xz08CWCHpQtq7_9H6G6ES9EjtCvPHa0aRk';
    
    console.log('Using hardcoded Supabase URL:', supabaseUrl);
    console.log('Messages for AI:', messages);
    
    // Extract user preferences if not provided
    const extractedPreferences = preferences || extractUserPreferencesFromMessage(messages[messages.length - 1].content);
    
    // Prepare request payload with enhanced context
    const requestPayload = {
      messages,
      preferences: extractedPreferences,
      previousConversations
    };
    
    const response = await fetch(`${supabaseUrl}/functions/v1/ai-travel-assistant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      console.error('AI response error:', response.status, response.statusText);
      return null;
    }

    return response.body;
  } catch (error) {
    console.error('Error calling AI assistant:', error);
    return null;
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
