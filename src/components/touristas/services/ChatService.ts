
import { supabase } from '@/integrations/supabase/client';
import { filterHotelsByLocation } from '@/utils/hotel-utils';
import { Message, extractLocationFromMessage } from '../utils/chat-utils';

export async function searchHotels(query: string): Promise<any[]> {
  try {
    const locationFromQuery = extractLocationFromMessage(query);
    console.log("Detected location from query:", locationFromQuery);
    
    // Get all hotels from Supabase
    const { data: hotels, error } = await supabase
      .from('hotels')
      .select(`
        *,
        hotel_amenities(amenity),
        hotel_photos(id, photo_url, is_main_photo)
      `)
      .order('rating', { ascending: false });
    
    if (error) {
      console.error('Error fetching hotels:', error);
      return [];
    }
    
    if (!hotels) return [];
    
    // Check for specific types of accommodations in the query
    const luxuryTerms = ['luxury', 'high-end', 'upscale', 'premium', 'exclusive', 'fancy', 'best'];
    const familyTerms = ['family', 'kid', 'children', 'family-friendly', 'child-friendly', 'kids'];
    const beachTerms = ['beach', 'beachfront', 'sea view', 'by the sea', 'ocean', 'coastal'];
    const budgetTerms = ['budget', 'affordable', 'cheap', 'inexpensive', 'economical', 'low cost'];
    
    const queryLower = query.toLowerCase();
    let filteredHotels = hotels;
    
    // Filter by location if specified
    if (locationFromQuery) {
      filteredHotels = filterHotelsByLocation(filteredHotels, locationFromQuery);
      console.log(`Filtered hotels by ${locationFromQuery}:`, filteredHotels.length);
    }
    
    // Apply additional filters based on the query
    if (luxuryTerms.some(term => queryLower.includes(term))) {
      filteredHotels = filteredHotels.filter(hotel => 
        hotel.hotel_types?.some((type: string) => type.toLowerCase().includes('luxury')) || 
        hotel.rating >= 4.5
      );
    }
    
    if (familyTerms.some(term => queryLower.includes(term))) {
      filteredHotels = filteredHotels.filter(hotel => 
        hotel.hotel_types?.some((type: string) => type.toLowerCase().includes('family'))
      );
    }
    
    if (beachTerms.some(term => queryLower.includes(term))) {
      // Filter for beach hotels - either by location or by description
      filteredHotels = filteredHotels.filter(hotel => 
        hotel.location?.toLowerCase().includes('platis gialos') || 
        hotel.location?.toLowerCase().includes('vathi') || 
        hotel.location?.toLowerCase().includes('kamares') ||
        hotel.hotel_types?.some((type: string) => type.toLowerCase().includes('beach')) ||
        (hotel.description && 
          beachTerms.some(term => hotel.description.toLowerCase().includes(term)))
      );
    }
    
    if (budgetTerms.some(term => queryLower.includes(term))) {
      // Assume budget hotels have lower prices
      filteredHotels = filteredHotels.filter(hotel => 
        hotel.price < 150 || 
        hotel.hotel_types?.some((type: string) => type.toLowerCase().includes('budget'))
      );
    }
    
    // Limit results to top 6
    return filteredHotels.slice(0, 6);
  } catch (error) {
    console.error('Error searching hotels:', error);
    return [];
  }
}

export async function callTouristasAI(messages: Message[]): Promise<ReadableStream<Uint8Array> | null> {
  const response = await supabase.functions.invoke("ai-travel-assistant", {
    body: {
      messages: messages.map(msg => ({ role: msg.role, content: msg.content })),
    },
  });
  
  if (response.error) {
    console.error("Error from AI travel assistant:", response.error);
    throw new Error(`Error from AI travel assistant: ${response.error.message || response.error}`);
  }
  
  if (!response.data) {
    throw new Error("Empty response from AI travel assistant");
  }
  
  return response.data;
}

export async function processStreamingResponse(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  assistantId: string,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
): Promise<string> {
  const decoder = new TextDecoder();
  let fullContent = '';
  
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      // Decode the chunk and split by lines
      const text = decoder.decode(value, { stream: true });
      const lines = text.split('\n\n');
      
      for (const line of lines) {
        // Skip empty lines and DONE messages
        if (!line || line === 'data: [DONE]') continue;
        
        // Extract the JSON payload from the SSE format
        const dataMatch = line.match(/^data: (.+)$/m);
        if (!dataMatch) continue;
        
        try {
          const parsed = JSON.parse(dataMatch[1]);
          if (parsed.choices && parsed.choices[0]?.delta?.content) {
            const content = parsed.choices[0].delta.content;
            fullContent += content;
            
            // Update the message with accumulated content
            setMessages((prev) => 
              prev.map(msg => 
                msg.id === assistantId 
                  ? { ...msg, content: fullContent } 
                  : msg
              )
            );
          }
        } catch (err) {
          console.error('Error parsing chunk:', err, 'Content:', dataMatch[1]);
        }
      }
    }
  } catch (error) {
    console.error('Error processing stream:', error);
  }
  
  return fullContent;
}
