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
 * Enhanced date intelligence - converts natural language to actual dates
 */
export const parseNaturalDates = (query: string): { checkInDate?: string; checkOutDate?: string } => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  const queryLower = query.toLowerCase();
  
  // Calculate next weekend (Friday-Sunday)
  if (queryLower.includes('next weekend') || queryLower.includes('this weekend')) {
    let daysUntilFriday;
    
    if (queryLower.includes('next weekend')) {
      // Next weekend - find next Friday
      daysUntilFriday = currentDay <= 5 ? (5 - currentDay + 7) : (5 - currentDay + 14);
    } else {
      // This weekend - find this Friday or next Friday if past Friday
      daysUntilFriday = currentDay <= 5 ? (5 - currentDay) : (5 - currentDay + 7);
    }
    
    const checkInDate = new Date(today);
    checkInDate.setDate(today.getDate() + daysUntilFriday);
    
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkInDate.getDate() + 2); // Friday to Sunday
    
    return {
      checkInDate: checkInDate.toISOString().split('T')[0],
      checkOutDate: checkOutDate.toISOString().split('T')[0]
    };
  }
  
  // Calculate next week
  if (queryLower.includes('next week')) {
    const daysUntilNextMonday = currentDay === 0 ? 1 : (8 - currentDay);
    const checkInDate = new Date(today);
    checkInDate.setDate(today.getDate() + daysUntilNextMonday);
    
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkInDate.getDate() + 3); // 3-day stay
    
    return {
      checkInDate: checkInDate.toISOString().split('T')[0],
      checkOutDate: checkOutDate.toISOString().split('T')[0]
    };
  }
  
  // Calculate specific month mentions
  const months = {
    'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5,
    'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11
  };
  
  for (const [monthName, monthIndex] of Object.entries(months)) {
    if (queryLower.includes(monthName)) {
      const year = today.getFullYear();
      const targetMonth = monthIndex;
      
      // If month is in the past this year, use next year
      const targetYear = targetMonth < today.getMonth() ? year + 1 : year;
      
      const checkInDate = new Date(targetYear, targetMonth, 15); // Mid-month
      const checkOutDate = new Date(targetYear, targetMonth, 18); // 3-day stay
      
      return {
        checkInDate: checkInDate.toISOString().split('T')[0],
        checkOutDate: checkOutDate.toISOString().split('T')[0]
      };
    }
  }
  
  // Default to near future if no specific dates found but availability mentioned
  if (queryLower.includes('available') || queryLower.includes('book')) {
    const checkInDate = new Date(today);
    checkInDate.setDate(today.getDate() + 7); // Next week
    
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkInDate.getDate() + 3);
    
    return {
      checkInDate: checkInDate.toISOString().split('T')[0],
      checkOutDate: checkOutDate.toISOString().split('T')[0]
    };
  }
  
  return {};
};

/**
 * Get website content for AI training context
 */
export const getWebsiteContext = async (): Promise<string> => {
  try {
    // Get all hotels from database for AI context
    const { data: hotels, error } = await supabase
      .from('hotels')
      .select(`
        *,
        hotel_amenities(amenity),
        hotel_photos(photo_url, is_main_photo),
        hotel_rooms(name, price, capacity)
      `)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching hotels for context:', error);
      return '';
    }

    let context = `CURRENT HOTELS DATABASE (${new Date().toDateString()}):\n\n`;
    
    hotels?.forEach(hotel => {
      context += `**${hotel.name}**\n`;
      context += `- Location: ${hotel.location}\n`;
      context += `- Price: €${hotel.price_per_night}/night\n`;
      context += `- Rating: ${hotel.rating}/5\n`;
      context += `- Description: ${hotel.description}\n`;
      
      if (hotel.hotel_amenities?.length > 0) {
        context += `- Amenities: ${hotel.hotel_amenities.map((a: any) => a.amenity).join(', ')}\n`;
      }
      
      if (hotel.hotel_rooms?.length > 0) {
        context += `- Room Types: ${hotel.hotel_rooms.map((r: any) => `${r.name} (€${r.price}, ${r.capacity} guests)`).join(', ')}\n`;
      }
      
      context += '\n';
    });

    // Add location-specific information
    context += `\nSIFNOS LOCATION GUIDE:\n\n`;
    context += `**Apollonia (Capital)**\n`;
    context += `- Inland traditional village with white Cycladic architecture\n`;
    context += `- Central location with restaurants, cafes, shops\n`;
    context += `- No direct beach access but great for exploring\n`;
    context += `- Best for: Cultural enthusiasts, dining, nightlife\n\n`;
    
    context += `**Kamares (Port)**\n`;
    context += `- Main ferry port with long sandy beach\n`;
    context += `- Many tavernas and tourist amenities\n`;
    context += `- Family-friendly beach with shallow waters\n`;
    context += `- Best for: Families, convenience, first-time visitors\n\n`;
    
    context += `**Platis Gialos**\n`;
    context += `- Most popular beach resort area\n`;
    context += `- Long golden sand beach with water sports\n`;
    context += `- Excellent restaurants and beach bars\n`;
    context += `- Best for: Beach lovers, water activities, dining\n\n`;
    
    context += `**Vathi**\n`;
    context += `- Peaceful bay with beautiful sandy beach\n`;
    context += `- Traditional pottery workshops\n`;
    context += `- Crystal clear waters, great for swimming\n`;
    context += `- Best for: Quiet holidays, pottery enthusiasts\n\n`;
    
    context += `**Kastro**\n`;
    context += `- Medieval fortified village on clifftop\n`;
    context += `- Stunning sunset views and historical sites\n`;
    context += `- Walking streets, no cars allowed\n`;
    context += `- Best for: History lovers, photography, sunsets\n\n`;
    
    context += `**Faros**\n`;
    context += `- Peaceful fishing village with multiple beaches\n`;
    context += `- Excellent seafood restaurants\n`;
    context += `- Less crowded, authentic Greek island feel\n`;
    context += `- Best for: Quiet relaxation, seafood, nature\n\n`;

    // Add seasonal information
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 4 && currentMonth <= 9) { // May to October
      context += `CURRENT SEASON: Peak tourist season (May-October)\n`;
      context += `- Weather: Warm and sunny, perfect for beaches\n`;
      context += `- All restaurants and hotels open\n`;
      context += `- Advance booking recommended\n`;
      context += `- Ferry connections: Multiple daily services\n\n`;
    } else {
      context += `CURRENT SEASON: Off-season (November-April)\n`;
      context += `- Weather: Mild, some rain possible\n`;
      context += `- Limited restaurant/hotel operations\n`;
      context += `- Ideal for hiking and cultural exploration\n`;
      context += `- Ferry connections: Reduced schedule\n\n`;
    }

    return context;
  } catch (error) {
    console.error('Error building website context:', error);
    return '';
  }
};

/**
 * Enhanced hotel search with intelligent date parsing and real availability
 */
export const searchHotelsWithAvailability = async (
  query: string, 
  preferences: Record<string, any> = {}
): Promise<any[]> => {
  const queryLower = query.toLowerCase();
  console.log('Enhanced hotel search with query:', query);
  
  // Parse natural language dates
  const parsedDates = parseNaturalDates(query);
  const finalCheckIn = preferences.checkInDate || parsedDates.checkInDate;
  const finalCheckOut = preferences.checkOutDate || parsedDates.checkOutDate;
  
  console.log('Parsed dates:', { finalCheckIn, finalCheckOut });
  
  try {
    // Search local hotels
    let supabaseQuery = supabase
      .from('hotels')
      .select(`
        *,
        hotel_amenities(amenity),
        hotel_photos(id, photo_url, is_main_photo),
        hotel_rooms(name, price, capacity)
      `)
      .eq('is_active', true)
      .order('rating', { ascending: false });
    
    // Apply location filter
    if (preferences.location) {
      supabaseQuery = supabaseQuery.ilike('location', `%${preferences.location}%`);
    }
    
    // Apply name filter
    if (preferences.hotelName) {
      supabaseQuery = supabaseQuery.ilike('name', `%${preferences.hotelName}%`);
    }
    
    const { data: localHotels, error } = await supabaseQuery;
    
    if (error) {
      console.error('Error searching local hotels:', error);
    }
    
    let allHotels = localHotels || [];
    
    // If dates are available, also search Agoda for real-time availability
    if (finalCheckIn && finalCheckOut) {
      console.log('Searching Agoda with dates:', finalCheckIn, finalCheckOut);
      
      try {
        // Try to call our hotel search service which includes Agoda
        const { searchHotels } = await import('@/services/hotelSearch');
        const searchParams = {
          checkInDate: finalCheckIn,
          checkOutDate: finalCheckOut,
          numberOfAdults: preferences.adults || 2,
          numberOfChildren: preferences.children || 0,
          location: preferences.location,
          amenities: preferences.amenities
        };
        
        const agodaResults = await searchHotels(searchParams);
        console.log('Agoda search completed, found:', agodaResults.length, 'hotels');
        
        // Add source information and merge
        const agodaHotelsFormatted = agodaResults
          .filter(hotel => hotel.source === 'agoda')
          .map(hotel => ({
            ...hotel,
            source: 'agoda',
            availability: {
              checkIn: finalCheckIn,
              checkOut: finalCheckOut,
              available: true
            }
          }));
        
        allHotels = [...allHotels, ...agodaHotelsFormatted];
        
      } catch (agodaError) {
        console.error('Error searching Agoda:', agodaError);
      }
    }
    
    // Apply post-search filters
    if (preferences.amenities?.includes('pool') || queryLower.includes('pool')) {
      allHotels = allHotels.filter(hotel => 
        hotel.hotel_amenities?.some((a: any) => 
          a.amenity.toLowerCase().includes('pool') || 
          a.amenity.toLowerCase().includes('swimming')
        ) || hotel.amenities?.some((a: string) => 
          a.toLowerCase().includes('pool') || 
          a.toLowerCase().includes('swimming')
        )
      );
    }
    
    // Apply budget filters
    if (preferences.budget === 'budget') {
      allHotels = allHotels.filter(hotel => 
        (hotel.price_per_night || hotel.daily_rate || 0) <= 100
      );
    } else if (preferences.budget === 'luxury') {
      allHotels = allHotels.filter(hotel => 
        (hotel.price_per_night || hotel.daily_rate || 0) >= 150
      );
    }
    
    console.log(`Total hotels found: ${allHotels.length}`);
    return allHotels;
    
  } catch (error) {
    console.error('Error in enhanced hotel search:', error);
    return [];
  }
};

/**
 * Enhanced AI call with website context and intelligent date handling
 */
export const callTouristasAI = async (
  messages: AIRequestMessage[], 
  preferences?: Record<string, string>,
  previousConversations?: ConversationContext[]
): Promise<ReadableStream<Uint8Array> | null> => {
  try {
    const supabaseUrl = 'https://wdzlruiekcznbcicjgrz.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkemxydWlla2N6bmJjaWNqZ3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyODAyNzYsImV4cCI6MjA1OTg1NjI3Nn0.NaoVf3tU3Xz08CWCHpQtq7_9H6G6ES9EjtCvPHa0aRk';
    
    console.log('Enhanced AI call with real-time context');
    
    const lastMessage = messages[messages.length - 1].content;
    
    // Get current website context (hotels, locations, seasonal info)
    const websiteContext = await getWebsiteContext();
    
    // Parse dates from natural language
    const parsedDates = parseNaturalDates(lastMessage);
    
    // Get current date/time context
    const now = new Date();
    const dateContext = `
    CURRENT DATE/TIME CONTEXT:
    - Today: ${now.toDateString()}
    - Current time: ${now.toLocaleTimeString()}
    - Day of week: ${now.toLocaleDateString('en-US', { weekday: 'long' })}
    - Month: ${now.toLocaleDateString('en-US', { month: 'long' })}
    - Year: ${now.getFullYear()}
    
    ${parsedDates.checkInDate ? `PARSED CHECK-IN: ${parsedDates.checkInDate}` : ''}
    ${parsedDates.checkOutDate ? `PARSED CHECK-OUT: ${parsedDates.checkOutDate}` : ''}
    `;
    
    // Extract user preferences
    const extractedPreferences = preferences || extractUserPreferencesFromMessage(lastMessage);
    
    // Enhanced preferences with parsed dates
    const enhancedPreferences = {
      ...extractedPreferences,
      ...parsedDates
    };
    
    // Prepare conversation context
    let conversationContext = '';
    if (previousConversations && previousConversations.length > 0) {
      conversationContext = `
      PREVIOUS CONVERSATION CONTEXT:
      ${previousConversations.map(c => `- ${c.topic}: ${c.summary}`).join('\n')}
      `;
    }
    
    // Prepare enhanced request payload
    const requestPayload = {
      messages,
      preferences: enhancedPreferences,
      previousConversations,
      websiteContext,
      dateContext,
      currentQuery: lastMessage
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
      console.error('Enhanced AI response error:', response.status, response.statusText);
      return null;
    }

    return response.body;
  } catch (error) {
    console.error('Error in enhanced AI call:', error);
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
      
      const chunk = decoder.decode(value, { stream: true });
      fullContent += chunk;
      
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
    console.error('Error processing enhanced stream:', error);
    return fullContent;
  }
};

/**
 * Enhanced conversation context tracking
 */
export const trackConversationContext = (messages: Message[]): ConversationContext[] => {
  const userMessages = messages.filter(msg => msg.role === 'user');
  
  if (userMessages.length === 0) {
    return [];
  }
  
  const contexts: ConversationContext[] = [];
  const recentUserMessages = userMessages.slice(-5); // More context
  
  for (const message of recentUserMessages) {
    const topic = analyzeMessageTopic(message.content);
    const parsedDates = parseNaturalDates(message.content);
    
    let summary = message.content;
    if (summary.length > 150) {
      summary = summary.substring(0, 147) + '...';
    }
    
    // Add date information to summary if found
    if (parsedDates.checkInDate) {
      summary += ` [Dates: ${parsedDates.checkInDate} to ${parsedDates.checkOutDate}]`;
    }
    
    contexts.push({
      topic,
      summary,
      timestamp: Date.now()
    });
  }
  
  return contexts;
};
