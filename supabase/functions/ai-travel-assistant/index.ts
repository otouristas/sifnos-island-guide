import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { OpenAI } from "https://esm.sh/openai@4.19.0";

const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY") || "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";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      messages, 
      preferences = {}, 
      previousConversations = [], 
      websiteContext = '', 
      dateContext = '',
      currentQuery = ''
    } = await req.json();
    
    console.log("Enhanced AI request received:", {
      messageCount: messages.length,
      hasWebsiteContext: !!websiteContext,
      hasDateContext: !!dateContext,
      hasParsedDates: !!(preferences.checkInDate || preferences.checkOutDate),
      hasAvailableHotels: !!preferences.availableHotels?.length,
      availableHotelsCount: preferences.availableHotels?.length || 0,
      hasRealTimeData: !!preferences.hasRealTimeData,
      currentQuery: currentQuery?.substring(0, 100) + '...'
    });
    
    // Build conversation history context
    let conversationContext = '';
    if (previousConversations.length > 0) {
      conversationContext = `
      CONVERSATION HISTORY:
      ${previousConversations.map(c => `- ${c.topic}: ${c.summary}`).join('\n')}
      `;
    }
    
    // Build preferences context
    let preferenceContext = '';
    if (Object.keys(preferences).length > 0) {
      preferenceContext = `
      EXTRACTED USER PREFERENCES:
      ${Object.entries(preferences).map(([key, value]) => `- ${key}: ${value}`).join('\n')}
      `;
    }

    // Build real-time hotel data context
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

    // Enhanced system message with comprehensive context
    const systemMessage = {
      role: "system",
      content: `You are Touristas AI, the world's most intelligent travel agent for Sifnos, Greece. You are a passionate local expert who has lived on Sifnos for years and knows every hidden gem, every hotel owner personally, and every perfect spot for different travelers.

PERSONALITY & COMMUNICATION STYLE:
- Speak like a knowledgeable friend who genuinely cares about creating perfect vacations
- Use warm, enthusiastic language with Greek touches (occasional "Γεια σας!" or "Τι κάνετε!")
- Share insider tips and personal recommendations as if you're a local guide
- Show excitement about Sifnos and make travelers feel special about choosing this island
- Be conversational, not robotic - use phrases like "I'd love to help you find...", "Let me suggest...", "You're going to love..."

${dateContext}

${websiteContext}

${preferenceContext}

${conversationContext}

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

RESPONSE STRUCTURE FOR HOTEL QUERIES:

1. **ENTHUSIASTIC GREETING**: "I'm so excited to help you find the perfect Sifnos accommodation!"

2. **DATE CONFIRMATION**: "For your [specific period], I've found some fantastic options!"

3. **PERSONALIZED RECOMMENDATIONS**: Based on their preferences, suggest 2-3 specific hotels with personality descriptions

4. **INSIDER TIPS**: Add local knowledge: "Pro tip: Book early for weekends as Sifnos is becoming quite popular!"

5. **TRIGGER PHRASE**: Always end with "Here are the available hotels for your dates:" to display real hotel cards

SAMPLE RESPONSES:

For "hotels available for next weekend":
"Γεια σας! How exciting that you're planning a weekend escape to beautiful Sifnos! 🌊

I've found wonderful availability for your dates - Friday, December 27th to Sunday, December 29th. This is actually a perfect time to visit as you'll experience that magical winter tranquility on the island.

Based on availability, I'd love to recommend:

🏨 **For Luxury**: Villa Olivia Clara in Kamares - imagine waking up to infinity pool views and Aegean sunrises!

🏛️ **For Authentic Charm**: Filadaki Villas in Platis Gialos - family-run for generations with traditional Cycladic architecture

🌅 **For Central Location**: ALK Hotel in Apollonia - perfect for exploring the island's vibrant capital

Each offers something special, and December is lovely for hiking the ancient paths and enjoying cozy taverna dinners without summer crowds.

Here are the available hotels for your dates:"

CRITICAL RULES FOR REAL-TIME DATA:
- When you have real-time hotel data above, USE IT! Reference specific hotels by name, price, and features
- Always calculate and mention specific dates from user queries
- Make every recommendation personal and enthusiastic using ACTUAL hotel data
- Include why each REAL hotel is special based on the provided information
- Add seasonal context and insider tips for the SPECIFIC hotels available
- When mentioning hotels, use their REAL prices: "Villa Olivia Clara at €180/night is perfect for luxury seekers"
- Combine local knowledge with REAL availability: "For your weekend dates, I see ALK Hotel has availability at €95/night"
- ALWAYS end hotel recommendations with the trigger phrase for hotel cards
- Never invent prices or availability - use the REAL data provided above
- Speak as a passionate local expert who has access to live booking data
- If no real-time data is available, be honest: "Let me search for current availability" and then use general recommendations

Current user query: "${currentQuery}"

Create a warm, intelligent response that makes the traveler excited about Sifnos while providing expert guidance!`
    };

    // Combine system message with user messages
    const aiMessages = [
      systemMessage, 
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }))
    ];
    
    console.log("Calling Claude 3.7 Sonnet with enhanced context");

    // Initialize OpenAI client with OpenRouter
    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: OPENROUTER_API_KEY,
      dangerouslyAllowBrowser: true
    });

    // Create streaming chat completion with Claude 3.7 Sonnet
    const stream = await client.chat.completions.create({
      model: "anthropic/claude-3.7-sonnet",
      messages: aiMessages,
      temperature: 0.7,
      max_tokens: 1500, // Increased for more detailed responses
      stream: true,
      extra_headers: {
        "HTTP-Referer": "https://hotelssifnos.com",
        "X-Title": "Hotels Sifnos - Enhanced Touristas AI"
      }
    });

    // Create streaming response
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        } catch (error) {
          console.error("Enhanced stream error:", error);
          controller.error(error);
        }
      }
    });

    return new Response(readable, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error in enhanced AI travel assistant:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        status: 500,
        context: "Enhanced AI processing failed"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
