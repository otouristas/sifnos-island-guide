import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { OpenAI } from "https://esm.sh/openai@4.19.0";

const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY") || "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";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
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

    // Enhanced real-time hotel data context with local/Agoda distinction
    let realTimeHotelContext = '';
    if (preferences.availableHotels && preferences.availableHotels.length > 0) {
      const localHotels = preferences.availableHotels.filter((h: any) => h.source === 'local');
      const agodaHotels = preferences.availableHotels.filter((h: any) => h.source === 'agoda');

      realTimeHotelContext = `
      🏨 REAL-TIME HOTEL DATA FOR YOUR QUERY:
      
      ${localHotels.length > 0 ? `
      ⭐ LOCAL SIFNOS HOTELS (Rich Local Data):
      ${localHotels.map((hotel: any, index: number) => `
      ${index + 1}. **${hotel.name}** (Local Partner ⭐)
         - Location: ${hotel.location || 'Sifnos, Greece'}
         - Quality Rating: ${hotel.rating || 'N/A'}/5 stars
         - Amenities: ${Array.isArray(hotel.amenities) ? hotel.amenities.join(', ') : 'Standard amenities'}
         - Room Types: ${hotel.hotel_rooms?.length || 0} different options available
         - Photo Gallery: ${hotel.hotel_photos?.length || 0} professional photos
         - Booking: Contact directly for personalized rates and service
         ${hotel.description ? `- About: ${hotel.description.substring(0, 100)}...` : ''}
         - Special: Local expertise, direct communication, personalized service
      `).join('\n')}
      ` : ''}

      ${agodaHotels.length > 0 ? `
      💰 AGODA PARTNER HOTELS (Live Pricing):
      ${agodaHotels.map((hotel: any, index: number) => `
      ${index + 1}. **${hotel.name}** (Agoda Partner 💰)
         - Location: ${hotel.location || 'Sifnos, Greece'}
         - Live Price: ${hotel.price || hotel.daily_rate || 'Contact for pricing'} ${hotel.currency || 'USD'}/night
         - Rating: ${hotel.rating || hotel.review_score || 'N/A'}/5 (${hotel.review_count || 0} reviews)
         - Star Rating: ${hotel.star_rating || 'N/A'} stars
         - Instant Booking: Available through Agoda platform
         ${hotel.agoda_data?.freeWifi ? '- ✅ Free WiFi included' : ''}
         ${hotel.agoda_data?.includeBreakfast ? '- ✅ Breakfast included' : ''}
         ${hotel.agoda_data?.discountPercentage > 0 ? `- 🎯 ${hotel.agoda_data.discountPercentage}% discount available` : ''}
      `).join('\n')}
      ` : ''}
      
      ✨ IMPORTANT: 
      - LOCAL HOTELS: Rich data, personal service, contact for rates - perfect for authentic Sifnos experience
      - AGODA HOTELS: Live pricing, instant booking, reviews - great for quick reservations
      ${preferences.hasRealTimeData ? '🔄 Agoda pricing is live and current.' : '📊 Mix of local database and live data.'}
      `;
    }

    // Enhanced system message with improved local hotel handling
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

🏨 **DEEP HOTEL KNOWLEDGE & DUAL BOOKING SYSTEM**: 

**LOCAL SIFNOS HOTELS** (Premium Experience):
- **Villa Olivia Clara**: Luxury clifftop villa in Kamares with infinity pool and sunset views
- **Filadaki Villas**: Traditional Cycladic architecture in Platis Gialos, family-run for 3 generations  
- **Meropi Rooms**: Charming seaside accommodation in Kamares, walking distance to the port
- **ALK Hotel**: Modern boutique hotel in Apollonia with panoramic island views
- **Morpheas Pension**: Authentic Greek hospitality in Faros, beloved by repeat guests

**Key Local Hotel Benefits:**
- Direct contact with owners for personalized service
- Flexible rates based on season and length of stay
- Local insider tips and recommendations included
- Often include special touches like welcome drinks or local products
- Can arrange transfers, excursions, and special requests
- Rich photo galleries and detailed room information available

**AGODA PARTNER HOTELS** (Instant Booking):
- Live pricing with current availability
- Instant confirmation and booking
- International payment options
- Standard cancellation policies
- Review scores from global travelers

🌊 **LOCATION EXPERTISE**: Share intimate knowledge of each area:
- **Kamares**: "The welcoming port town with a beautiful sandy beach - perfect for families and first-time visitors"
- **Platis Gialos**: "The island's beach paradise with crystal waters and the best seafood tavernas"
- **Apollonia**: "The vibrant capital where locals gather in the evenings - authentic Sifnos culture"
- **Kastro**: "Medieval magic with sunset views that will take your breath away"
- **Vathi**: "Hidden gem for pottery lovers and peaceful souls seeking tranquility"

RESPONSE STRUCTURE FOR HOTEL QUERIES:

1. **ENTHUSIASTIC GREETING**: "I'm so excited to help you find the perfect Sifnos accommodation!"

2. **DATE CONFIRMATION**: "For your [specific period], I've found some fantastic options!"

3. **DUAL RECOMMENDATION APPROACH**:
   - **Local Hotels First**: "For the authentic Sifnos experience with personal touch..."
   - **Agoda Options**: "For instant booking with live pricing..."

4. **PERSONALIZED INSIGHTS**: Based on their preferences, explain why each type suits different needs

5. **INSIDER TIPS**: Add local knowledge and booking advice

6. **TRIGGER PHRASE**: Always end with "Here are the available hotels for your dates:" to display hotel cards

CRITICAL RULES FOR HOTEL RECOMMENDATIONS:

**WHEN RECOMMENDING LOCAL HOTELS:**
- Always mention "contact for personalized rates" instead of specific prices
- Highlight unique features: room variety, amenities, local connections
- Emphasize personal service and local expertise
- Reference specific amenities and room types from the data
- Mention photo galleries and detailed information available

**WHEN RECOMMENDING AGODA HOTELS:**
- Always mention specific live prices when available
- Highlight instant booking capability
- Reference review scores and star ratings
- Mention included amenities like WiFi or breakfast
- Note any available discounts

**MIXED RECOMMENDATIONS:**
- Present both options as complementary, not competing
- "For authentic local experience: [Local Hotels]"
- "For instant booking convenience: [Agoda Hotels]"
- Help users understand the benefits of each approach

Current user query: "${currentQuery}"

Create a warm, intelligent response that showcases both local expertise and modern booking convenience!`
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
