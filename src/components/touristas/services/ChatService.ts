
import { Message, MessageRole } from '../utils/chat-utils';

// Use this interface for sending messages to the AI service
export interface AIRequestMessage {
  role: MessageRole;
  content: string;
  id: string;
}

export const callTouristasAI = async (messages: AIRequestMessage[]): Promise<ReadableStream<Uint8Array> | null> => {
  try {
    // Hardcoded Supabase URL and anon key - no environment variables needed
    const supabaseUrl = 'https://wdzlruiekcznbcicjgrz.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkemxydWlla2N6bmJjaWNqZ3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyODAyNzYsImV4cCI6MjA1OTg1NjI3Nn0.NaoVf3tU3Xz08CWCHpQtq7_9H6G6ES9EjtCvPHa0aRk';
    
    console.log('Using hardcoded Supabase URL:', supabaseUrl);
    
    const response = await fetch(`${supabaseUrl}/functions/v1/ai-travel-assistant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({ messages }),
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

export const searchHotels = async (query: string): Promise<any[]> => {
  try {
    // Hardcoded Supabase URL and anon key - no environment variables needed
    const supabaseUrl = 'https://wdzlruiekcznbcicjgrz.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkemxydWlla2N6bmJjaWNqZ3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyODAyNzYsImV4cCI6MjA1OTg1NjI3Nn0.NaoVf3tU3Xz08CWCHpQtq7_9H6G6ES9EjtCvPHa0aRk';
    
    // Convert query to lowercase for better matching
    const searchQuery = query.toLowerCase();
    
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
    
    // Filter hotels based on the query - match location, name, or description
    let filteredHotels = hotels;
    
    // If location is mentioned, filter by that location
    if (searchQuery.includes('platis gialos') || searchQuery.includes('platy gialo')) {
      filteredHotels = hotels.filter(h => 
        h.location?.toLowerCase()?.includes('platis gialos') || 
        h.location?.toLowerCase()?.includes('platy gialo'));
    } else if (searchQuery.includes('apollonia')) {
      filteredHotels = hotels.filter(h => h.location?.toLowerCase()?.includes('apollonia'));
    } else if (searchQuery.includes('kamares')) {
      filteredHotels = hotels.filter(h => h.location?.toLowerCase()?.includes('kamares'));
    } else if (searchQuery.includes('vathi')) {
      filteredHotels = hotels.filter(h => h.location?.toLowerCase()?.includes('vathi'));
    } else if (searchQuery.includes('kastro')) {
      filteredHotels = hotels.filter(h => h.location?.toLowerCase()?.includes('kastro'));
    } else if (searchQuery.includes('faros')) {
      filteredHotels = hotels.filter(h => h.location?.toLowerCase()?.includes('faros'));
    }
    
    console.log(`Filtered hotels for "${searchQuery}":`, filteredHotels.length);
    
    // Sort by rating (highest first)
    filteredHotels.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    
    // Limit results to prevent flooding the UI
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
