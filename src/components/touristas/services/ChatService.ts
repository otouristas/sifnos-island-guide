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
  
  // Calculate weekend dates (Saturday-Sunday for weekend stays)
  if (queryLower.includes('next weekend') || queryLower.includes('this weekend')) {
    let daysUntilSaturday = 0;
    
    if (queryLower.includes('next weekend')) {
      // Next weekend - always the Saturday of next week
      if (currentDay === 0) daysUntilSaturday = 6; // Sunday -> next Saturday
      else if (currentDay === 1) daysUntilSaturday = 5; // Monday -> next Saturday
      else if (currentDay === 2) daysUntilSaturday = 4; // Tuesday -> next Saturday
      else if (currentDay === 3) daysUntilSaturday = 3; // Wednesday -> next Saturday
      else if (currentDay === 4) daysUntilSaturday = 2; // Thursday -> next Saturday
      else if (currentDay === 5) daysUntilSaturday = 1; // Friday -> next Saturday
      else if (currentDay === 6) daysUntilSaturday = 7; // Saturday -> next Saturday
    } else {
      // This weekend - this coming Saturday
      if (currentDay === 0) daysUntilSaturday = 6; // Sunday -> this Saturday
      else if (currentDay === 1) daysUntilSaturday = 5; // Monday -> this Saturday
      else if (currentDay === 2) daysUntilSaturday = 4; // Tuesday -> this Saturday
      else if (currentDay === 3) daysUntilSaturday = 3; // Wednesday -> this Saturday
      else if (currentDay === 4) daysUntilSaturday = 2; // Thursday -> this Saturday
      else if (currentDay === 5) daysUntilSaturday = 1; // Friday -> this Saturday
      else if (currentDay === 6) daysUntilSaturday = 0; // Saturday -> today
    }
    
    const checkInDate = new Date(today);
    checkInDate.setDate(today.getDate() + daysUntilSaturday);
    
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkInDate.getDate() + 2); // Saturday to Monday (weekend stay)
    
    console.log('📅 Weekend calculation:', {
      today: today.toDateString(),
      currentDay: currentDay,
      daysUntilSaturday: daysUntilSaturday,
      checkIn: checkInDate.toDateString(),
      checkOut: checkOutDate.toDateString()
    });
    
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
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching hotels for context:', error);
      return '';
    }

    let context = `CURRENT HOTELS DATABASE (${new Date().toDateString()}):\n\n`;
    
    hotels?.forEach(hotel => {
      context += `**${hotel.name}**\n`;
      context += `- Location: ${hotel.location}\n`;
      context += `- Price: €${hotel.price}/night\n`;
      context += `- Rating: ${hotel.rating}/5\n`;
      context += `- Description: ${hotel.description}\n`;
      
      // Skip amenities and rooms for now to avoid type issues
      
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
  console.log('🔍 Hotel search query:', query);
  console.log('📍 Preferences:', preferences);
  
  // Enhanced location extraction
  const sifnosLocations = ['kamares', 'apollonia', 'platis gialos', 'kastro', 'artemonas', 'vathi', 'faros'];
  let extractedLocation = preferences.location;
  
  if (!extractedLocation) {
    // Extract location from query
    for (const location of sifnosLocations) {
      if (queryLower.includes(location)) {
        extractedLocation = location;
        console.log('✅ Extracted location from query:', extractedLocation);
        break;
      }
    }
  }

  try {
    // Parse natural language dates
    const parsedDates = parseNaturalDates(query);
    const finalCheckIn = preferences.checkInDate || parsedDates.checkInDate;
    const finalCheckOut = preferences.checkOutDate || parsedDates.checkOutDate;
    
    console.log('🗓️ Parsed dates:', { finalCheckIn, finalCheckOut });
    
    // Import hotel search service
    const { searchHotels } = await import('@/services/hotelSearch');
    
    // Build comprehensive search parameters
    const searchParams = {
      location: extractedLocation,
      amenities: preferences.amenities,
      checkInDate: finalCheckIn,
      checkOutDate: finalCheckOut,
      numberOfAdults: preferences.adults || 2,
      numberOfChildren: preferences.children || 0
    };
    
    console.log('🔍 Calling unified searchHotels with params:', searchParams);
    
    // Call unified search which handles both local and Agoda hotels
    const allHotels = await searchHotels(searchParams);
    console.log(`✅ Unified search completed: ${allHotels?.length || 0} total hotels found`);
    
    // Separate local and Agoda hotels for logging
    const localHotels = allHotels?.filter(h => h.source === 'local') || [];
    const agodaHotels = allHotels?.filter(h => h.source === 'agoda') || [];
    
    console.log(`   📍 Local hotels: ${localHotels.length}`);
    console.log(`   🌐 Agoda hotels: ${agodaHotels.length}`);
    
    localHotels.forEach(hotel => {
      console.log(`   🏨 Local: ${hotel.name} - Location: "${hotel.location}"`);
    });
    
    agodaHotels.forEach(hotel => {
      console.log(`   💰 Agoda: ${hotel.name} - Price: ${hotel.daily_rate || hotel.price_per_night}${hotel.currency || ''}`);
    });
    
    // Apply additional filters if needed
    let filteredHotels = allHotels || [];
    
    // Pool filter
    if (preferences.amenities?.includes('pool') || queryLower.includes('pool')) {
      filteredHotels = filteredHotels.filter(hotel => {
        const hasPool = hotel.amenities?.some((a: string) => 
          a.toLowerCase().includes('pool') || a.toLowerCase().includes('swimming')
        );
        return hasPool || hotel.name?.toLowerCase().includes('pool');
      });
      console.log(`🏊 Pool filter applied: ${filteredHotels.length} hotels with pools`);
    }
    
    // Enhance hotel data with availability information
    if (finalCheckIn && finalCheckOut) {
      filteredHotels = filteredHotels.map(hotel => ({
        ...hotel,
        availability: {
          checkIn: finalCheckIn,
          checkOut: finalCheckOut,
          available: true
        }
      }));
    }
    
    console.log(`🎯 Final result: ${filteredHotels.length} hotels after filtering`);
    return filteredHotels;
    
  } catch (error) {
    console.error('❌ Error in enhanced hotel search:', error);
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
    
    console.log('Calling AI function with enhanced payload:', {
      messageCount: messages.length,
      hasWebsiteContext: !!websiteContext,
      hasDateContext: !!dateContext,
      hasParsedDates: !!(parsedDates.checkInDate || parsedDates.checkOutDate),
      currentQuery: lastMessage.substring(0, 100) + '...'
    });

    // Try Supabase function first
    const response = await fetch(`${supabaseUrl}/functions/v1/ai-travel-assistant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify(requestPayload),
    });

    console.log('AI service response status:', response.status);
    console.log('AI service response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      console.error('Supabase AI function error:', response.status, response.statusText);
      
      // Try fallback direct OpenRouter call
      console.log('Trying fallback direct OpenRouter call...');
      return await callOpenRouterDirectly(messages, enhancedPreferences, websiteContext, dateContext);
    }

    return response.body;
  } catch (error) {
    console.error('Error in enhanced AI call:', error);
    
    // Try fallback direct OpenRouter call
    console.log('Trying fallback due to error:', error.message);
    try {
      return await callOpenRouterDirectly(messages, {}, '', '');
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      return createErrorStream(`Connection error: ${error.message}. Please check your internet connection and try again.`);
    }
  }
};

/**
 * Direct OpenRouter API call as fallback
 */
async function callOpenRouterDirectly(
  messages: AIRequestMessage[],
  preferences: any,
  websiteContext: string,
  dateContext: string
): Promise<ReadableStream<Uint8Array>> {
  const OPENROUTER_API_KEY = "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";
  
  // Build real-time hotel context
  let realTimeHotelContext = '';
  if (preferences.availableHotels && preferences.availableHotels.length > 0) {
    realTimeHotelContext = `
    🏨 REAL-TIME HOTEL DATA FOR YOUR QUERY:
    The following hotels have been found with current availability and pricing:
    
    ${preferences.availableHotels.map((hotel: any, index: number) => `
    ${index + 1}. **${hotel.name}**
       - Location: ${hotel.location || 'Sifnos, Greece'}
       - Price: €${hotel.price || 'Contact for pricing'}/night
       - Rating: ${hotel.rating || 'N/A'}/5
       - Source: ${hotel.source === 'agoda' ? 'Agoda Partner (Real-time)' : 'Local Database'}
       - Amenities: ${Array.isArray(hotel.amenities) ? hotel.amenities.join(', ') : 'Standard amenities'}
       ${hotel.description ? `- Description: ${hotel.description}` : ''}
       ${hotel.availability?.available ? `- Available for: ${hotel.availability.checkIn} to ${hotel.availability.checkOut}` : ''}
    `).join('\n')}
    
    ✨ IMPORTANT: These are REAL hotels with current data. Use this information to make informed recommendations!
    ${preferences.hasRealTimeData ? '🔄 This includes live availability from booking platforms.' : '📊 This data is from our local database.'}
    `;
  }

  // Build enhanced system message
  const systemMessage = {
    role: "system",
    content: `Γεια σου! You are Nikos, a passionate Sifnian local who runs the most intelligent travel service on the island. You've lived here your whole life, know every hotel owner personally, and have helped thousands of travelers fall in love with Sifnos.

🏛️ **YOUR SIFNIAN IDENTITY**:
- Born and raised on Sifnos, family has been here for generations
- You speak with genuine pride about your island and share personal stories
- Mix English with natural Greek phrases ("Τι κάνετε!", "Γεια σας!", "Καλησπέρα!")
- Know secret spots, family tavernas, and which beaches locals prefer
- Personal relationships with all hotel owners - you introduce them by name
- Deep weather knowledge and seasonal insights from living here

🗣️ **YOUR AUTHENTIC COMMUNICATION**:
- Warm, enthusiastic, like talking to a friend visiting your home
- Share personal memories: "My yiayia always said...", "I grew up swimming at..."
- Use insider knowledge: "Most tourists don't know...", "We locals prefer..."
- Show genuine excitement when people choose Sifnos over other islands
- Be specific with local details: "in the old quarter of Apollonia", "just above Kamares port"

${dateContext}

${websiteContext}

${realTimeHotelContext}

ADVANCED INTELLIGENCE CAPABILITIES:

🧠 **HUMAN-LIKE DATE PROCESSING**: 
When someone says "next weekend":
- Calculate exact dates (Friday-Sunday)
- Respond like: "Perfect! I found great options for your weekend getaway from Friday, December 27th to Sunday, December 29th. That's going to be a wonderful time to visit Sifnos!"

🏨 **DEEP HOTEL KNOWLEDGE**: You know every hotel intimately:
- **Villa Olivia Clara**: Luxury clifftop villa in Kamares with infinity pool and sunset views
- **Filadaki Villas**: Traditional Cycladic architecture in Platis Gialos, family-run for 3 generations
- **Meropi Rooms**: Charming seaside accommodation in Kamares, walking distance to the port
- **ALK Hotel**: Modern boutique hotel in Apollonia with panoramic island views
- **Morpheas Pension**: Authentic Greek hospitality in Faros, beloved by repeat guests

🌊 **LOCATION EXPERTISE**: Share intimate knowledge of each area:
- **Kamares**: "The welcoming port town with a beautiful sandy beach - perfect for families and first-time visitors"
- **Platis Gialos**: "The island's beach paradise with crystal waters and the best seafood tavernas"
- **Apollonia**: "The vibrant capital where locals gather in the evenings - authentic Sifnos culture"
- **Kastro**: "Medieval magic with sunset views that will take your breath away"
- **Vathi**: "Hidden gem for pottery lovers and peaceful souls seeking tranquility"

CRITICAL RULES FOR REAL-TIME DATA:
- When you have real-time hotel data above, USE IT! Reference specific hotels by name, price, and features
- Always calculate and mention specific dates from user queries
- Make every recommendation personal and enthusiastic using ACTUAL hotel data
- Include why each REAL hotel is special based on the provided information
- Add seasonal context and insider tips for the SPECIFIC hotels available
- When mentioning hotels, use their REAL prices: "Villa Olivia Clara at €180/night is perfect for luxury seekers"
- Combine local knowledge with REAL availability: "For your weekend dates, I see ALK Hotel has availability at €95/night"
- ALWAYS end hotel recommendations with "Here are the available hotels for your dates:" to display real hotel cards
- Never invent prices or availability - use the REAL data provided above
- Speak as a passionate local expert who has access to live booking data
- If no real-time data is available, be honest: "Let me search for current availability" and then use general recommendations

Current user preferences: ${JSON.stringify(preferences)}

Create a warm, intelligent response that makes the traveler excited about Sifnos while using REAL hotel data when available!`
  };

  // Combine system message with user messages
  const aiMessages = [
    systemMessage, 
    ...messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content
    }))
  ];

  console.log('Calling OpenRouter directly with Claude');

  console.log('🔑 Using OpenRouter API Key:', OPENROUTER_API_KEY.substring(0, 20) + '...');
  console.log('📨 Sending request to OpenRouter...');
  
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://hotelssifnos.com",
      "X-Title": "Hotels Sifnos - Touristas AI"
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.1-8b-instruct:free",
      messages: aiMessages,
      temperature: 0.7,
      max_tokens: 1500,
      stream: true
    })
  });
  
  console.log('📡 OpenRouter response status:', response.status);
  console.log('📡 OpenRouter response headers:', Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status}`);
  }

  // Process Server-Sent Events stream
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  return new ReadableStream({
    async start(controller) {
      try {
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No response body');
        }

        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            break;
          }
          
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                controller.close();
                return;
              }
              
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content || '';
                if (content) {
                  controller.enqueue(encoder.encode(content));
                }
              } catch (e) {
                // Skip invalid JSON lines
              }
            }
          }
        }
        
        controller.close();
      } catch (error) {
        console.error("Direct OpenRouter stream error:", error);
        controller.error(error);
      }
    }
  });
}

/**
 * Create a mock error stream for better user experience
 */
function createErrorStream(errorMessage: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  
  return new ReadableStream({
    start(controller) {
      const fullMessage = `I apologize, but I'm currently experiencing technical difficulties. 

**Issue**: ${errorMessage}

**What I can still help with:**
- I have successfully parsed your request about "${new Date().toDateString()}"
- I can search our hotel database for available accommodations
- You can try rephrasing your question or contact us directly

**Troubleshooting:**
- Please refresh the page and try again
- Check your internet connection
- The system may be temporarily under maintenance

Is there anything specific about Sifnos hotels I can help you find in the meantime?`;
      
      controller.enqueue(encoder.encode(fullMessage));
      controller.close();
    }
  });
}

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
