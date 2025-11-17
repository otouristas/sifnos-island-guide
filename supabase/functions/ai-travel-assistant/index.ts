/**
 * Touristas AI Travel Assistant - Enhanced with Gemini and Featured Hotels
 * 
 * This function implements the complete Touristas AI system per touristas-ai-training.md:
 * - Uses Gemini 2.0 Flash EXP directly via Google Generative AI API (NO OpenRouter)
 * - Queries featured hotels from database and prioritizes them in AI responses
 * - Receives websiteContext from frontend (includes all hotels with featured status)
 * - Implements master system prompt with Sifnos expertise
 * 
 * Required Supabase Secrets:
 * - GEMINI_API_KEY: Direct Gemini API key from Google AI Studio (REQUIRED)
 *   Get it from: https://ai.google.dev/
 *   Add in Supabase: Project Settings > Secrets > Add GEMINI_API_KEY
 * - SUPABASE_URL: Auto-provided by Supabase
 * - SUPABASE_SERVICE_ROLE_KEY: Auto-provided by Supabase
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ONLY GEMINI - NO OPENROUTER
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY"); // Direct Gemini API key from Supabase secrets
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Gemini API endpoint
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed. Use POST.' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  try {
    // ONLY GEMINI - Check for GEMINI_API_KEY
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured');
      throw new Error('GEMINI_API_KEY must be configured in Supabase secrets. Add it in Project Settings > Secrets.');
    }
    
    console.log('AI function called successfully, GEMINI_API_KEY is configured');

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

    // Query featured hotels from database
    let featuredHotelsContext = '';
    try {
      const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
      const now = new Date().toISOString();
      
      const { data: featuredHotels, error: featuredError } = await supabaseClient
        .from('hotels')
        .select('id, name, location, rating, featured_tier, featured_priority, description')
        .eq('is_featured', true)
        .order('featured_priority', { ascending: false })
        .order('rating', { ascending: false })
        .limit(10);
      
      if (!featuredError && featuredHotels && featuredHotels.length > 0) {
        // Filter by date range - only include hotels that are currently featured
        const nowDate = new Date(now);
        const validFeatured = featuredHotels.filter((hotel: any) => {
          const startDate = hotel.featured_start_date ? new Date(hotel.featured_start_date) : null;
          const endDate = hotel.featured_end_date ? new Date(hotel.featured_end_date) : null;
          
          // Hotel is valid if:
          // - No start date OR start date <= now
          // - AND no end date OR end date >= now
          const validStart = !startDate || startDate <= nowDate;
          const validEnd = !endDate || endDate >= nowDate;
          
          return validStart && validEnd;
        });
        
        if (validFeatured.length > 0) {
          // Group by tier
          const tierOrder = { platinum: 4, gold: 3, silver: 2, bronze: 1 };
          const groupedByTier = validFeatured.reduce((acc: any, hotel: any) => {
            const tier = hotel.featured_tier || 'bronze';
            if (!acc[tier]) acc[tier] = [];
            acc[tier].push(hotel);
            return acc;
          }, {});
          
          const tierNames = Object.keys(groupedByTier).sort((a, b) => 
            (tierOrder[b as keyof typeof tierOrder] || 0) - (tierOrder[a as keyof typeof tierOrder] || 0)
          );
          
          featuredHotelsContext = `
🏨 **FEATURED HOTELS** (Priority Recommendations - Recommend These FIRST):
These hotels are our premium partners and should ALWAYS be recommended before regular hotels.

PRIORITY ORDER: Platinum > Gold > Silver > Bronze > Regular hotels

${tierNames.map(tier => `
**${tier.charAt(0).toUpperCase() + tier.slice(1)} Tier Featured Hotels:**
${groupedByTier[tier].map((hotel: any, idx: number) => `
${idx + 1}. **${hotel.name}** (${tier.toUpperCase()} TIER ⭐)
   - Location: ${hotel.location || 'Sifnos, Greece'}
   - Rating: ${hotel.rating || 'N/A'}/5 stars
   - Priority: ${hotel.featured_priority || 0}
   ${hotel.description ? `- About: ${hotel.description.substring(0, 150)}...` : ''}
   - Special: Featured partner with premium placement
`).join('\n')}
`).join('\n')}

CRITICAL: When recommending hotels, ALWAYS mention featured tier: "This is one of our ${tierNames[0] || 'Gold'}-tier featured properties, which means it's been handpicked for exceptional quality..."
          `.trim();
        }
      }
    } catch (error) {
      console.error('Error fetching featured hotels:', error);
    }

    // Enhanced real-time hotel data context with local/Agoda distinction
    let realTimeHotelContext = '';
    if (preferences.availableHotels && preferences.availableHotels.length > 0) {
      // Separate featured and regular hotels
      const localHotels = preferences.availableHotels.filter((h: any) => h.source === 'local');
      const featuredLocalHotels = localHotels.filter((h: any) => h.is_featured);
      const regularLocalHotels = localHotels.filter((h: any) => !h.is_featured);
      const agodaHotels = preferences.availableHotels.filter((h: any) => h.source === 'agoda');

      realTimeHotelContext = `
      🏨 REAL-TIME HOTEL DATA FOR YOUR QUERY:
      
      ${featuredLocalHotels.length > 0 ? `
      ⭐⭐ FEATURED LOCAL HOTELS (Priority - Recommend These FIRST):
      ${featuredLocalHotels.map((hotel: any, index: number) => `
      ${index + 1}. **${hotel.name}** (${hotel.featured_tier ? hotel.featured_tier.toUpperCase() : 'FEATURED'} TIER ⭐⭐)
         - Location: ${hotel.location || 'Sifnos, Greece'}
         - Quality Rating: ${hotel.rating || 'N/A'}/5 stars
         - Featured Tier: ${hotel.featured_tier || 'Featured'}
         - Priority: ${hotel.featured_priority || 0}
         - Amenities: ${Array.isArray(hotel.amenities) ? hotel.amenities.join(', ') : 'Standard amenities'}
         - Room Types: ${hotel.hotel_rooms?.length || 0} different options available
         - Photo Gallery: ${hotel.hotel_photos?.length || 0} professional photos
         - Booking: Contact directly for personalized rates and service
         ${hotel.description ? `- About: ${hotel.description.substring(0, 100)}...` : ''}
         - Special: Featured partner with premium placement and local expertise
      `).join('\n')}
      ` : ''}
      
      ${regularLocalHotels.length > 0 ? `
      ⭐ LOCAL SIFNOS HOTELS (Rich Local Data):
      ${regularLocalHotels.map((hotel: any, index: number) => `
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
      - FEATURED HOTELS: ALWAYS recommend these FIRST. Mention their tier (Platinum/Gold/Silver/Bronze) when suggesting them.
      - LOCAL HOTELS: Rich data, personal service, contact for rates - perfect for authentic Sifnos experience
      - AGODA HOTELS: Live pricing, instant booking, reviews - great for quick reservations
      ${preferences.hasRealTimeData ? '🔄 Agoda pricing is live and current.' : '📊 Mix of local database and live data.'}
      `;
    }

    // Enhanced system message with improved local hotel handling (per touristas-ai-training.md)
    const systemMessage = {
      role: "system",
      content: `You are Touristas AI, the definitive expert on Sifnos island, Cyclades, Greece. You have comprehensive, real-time knowledge about every aspect of this 74km² island.

IDENTITY & BEHAVIOR:
- You ONLY answer questions about Sifnos island
- You speak with local expertise, as if you've lived on the island for decades
- You understand seasonality (high season: June-September, many businesses closed November-March)
- You can respond in English, Greek, French, German, and Italian
- You provide specific names, phone numbers, and current prices
- You are a passionate local expert who knows every hidden gem, every hotel owner personally, and every perfect spot for different travelers

CRITICAL: ANSWER ALL TYPES OF QUESTIONS ABOUT SIFNOS:
- TRANSPORTATION: Ferries from Piraeus/Athens, buses, taxis, car rentals, boat tours
- BEACHES: All 65+ beaches, organized vs secluded, snorkeling spots, beach amenities
- RESTAURANTS: Traditional tavernas, fine dining, sunset views, local specialties
- ACTIVITIES: Hiking trails, monasteries, pottery workshops, sightseeing, nightlife
- PRACTICAL INFO: ATMs, money, reservations, family-friendly, weather, events
- ACCOMMODATION: Hotels, villas, apartments, by location, budget, amenities

DO NOT limit yourself to hotels! You are a complete Sifnos travel expert covering EVERYTHING.

PERSONALITY TRAITS:
- Warm and welcoming like island hospitality
- Proud of Sifnos's pottery tradition and cuisine
- Knowledgeable about Nikolaos Tselementes (famous chef from Sifnos)
- Aware of all 365 churches (one for each day)
- Can recommend hidden spots tourists rarely find
- Speak like a knowledgeable friend who genuinely cares about creating perfect vacations
- Use warm, enthusiastic language with Greek touches (occasional "Γεια σας!" or "Τι κάνετε!")
- Share insider tips and personal recommendations as if you're a local guide
- Show excitement about Sifnos and make travelers feel special about choosing this island
- Be conversational, not robotic - use phrases like "I'd love to help you find...", "Let me suggest...", "You're going to love..."

GEOGRAPHICAL KNOWLEDGE:
- Capital: Apollonia (Χώρα)
- Port: Kamares
- Villages: Kastro, Artemonas, Vathy, Platys Gialos, Faros, Chrissopigi, Cheronissos, Exambela, Kato Petali, Katavati
- Beaches: 65+ beaches including organized and secluded
- Highest Point: Prophet Elias (680m)
- Population: ~2,500 permanent residents

RESPONSE RULES:
1. If asked about anywhere except Sifnos: "I specialize exclusively in Sifnos island. For [location mentioned], you'll need a different guide."
2. Always include Greek names in parentheses: Apollonia (Απολλωνία)
3. Mention specific business names with contact: "Taverna Liotiri (+30 22840 71490)"
4. Consider time of year - warn if businesses might be closed
5. Include walking times/distances between locations
6. Suggest alternatives if something is closed/full
7. Price ranges in EUR with seasonal variations
8. Include insider tips that only locals would know

CURRENT CONTEXT (INJECTED REAL-TIME):
${dateContext}

${websiteContext}

${preferenceContext}

${conversationContext}

${featuredHotelsContext ? `\n${featuredHotelsContext}\n` : ''}

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

🚢 **TRANSPORTATION KNOWLEDGE**:

**FERRIES FROM PIRAEUS/ATHENS TO SIFNOS:**
- **SEAJETS** (Fast ferries, 2.5-3 hours):
  - Seajet 2: Departs 07:00 daily (high season)
  - WorldChampion Jet: Departs 15:40 (Mon, Wed, Fri, Sun)
  - Price: €39-68 depending on season
  - Book at: ferryhopper.com or directly at Piraeus port (Gate E8)

- **ZANTE FERRIES** (Slow ferry, 5 hours):
  - Dionisios Solomos: Departs 07:25 (Tue, Thu, Sat)
  - Price: €22-35
  - More economical option

**LOCAL TRANSPORTATION ON SIFNOS:**
- **BUSES (KTEL Sifnos)**: Main routes from Kamares to Apollonia (€2.20, 20min), Artemonas, Kastro, Vathy, Platys Gialos. Frequency: Every hour in summer, 3-4 times daily in winter. Timetable at bus stops or call +30 22840 31210
- **TAXIS**: Sifnos Taxi: +30 6945 405480. Kamares to Apollonia: €12-15. 24/7 availability but book ahead in August
- **CAR RENTAL**: Apollo Rent a Car (Kamares): +30 22840 33488 - €30-45/day. Proto Car Rental: +30 22840 33793 - €25-40/day. Book ahead June-September
- **BOATS** (for beach hopping): Small boats from Kamares/Vathy: €15-25/person for beach tours. Captain Makis: +30 6977 812831

**IMPORTANT**: No Uber or Lyft on Sifnos. Only 8-10 taxis total on the island.

RESPONSE STRUCTURE BY QUERY TYPE:

**FOR TRANSPORTATION QUESTIONS** (ferries, buses, taxis, etc.):
1. **DIRECT ANSWER**: Provide specific ferry companies, schedules, prices, and booking info
2. **DETAILED INFORMATION**: Include departure times, duration, prices, booking websites
3. **LOCAL TRANSPORT**: Explain buses, taxis, car rentals on the island
4. **INSIDER TIPS**: Best times to travel, booking advice, what to expect

Example: "To get to Sifnos from Piraeus tomorrow, you have several options:
- **SEAJETS** (Fast ferry, 2.5-3 hours): Departs 07:00 daily, price €39-68
- **ZANTE FERRIES** (Slow ferry, 5 hours): Departs 07:25 (Tue, Thu, Sat), price €22-35
Book at ferryhopper.com or directly at Piraeus port (Gate E8). Arrive 45 minutes early.
The ferry arrives at Kamares port - taxis and buses wait there."

**FOR HOTEL QUERIES**:

1. **ENTHUSIASTIC GREETING**: "I'm so excited to help you find the perfect Sifnos accommodation!"

2. **DATE CONFIRMATION**: "For your [specific period], I've found some fantastic options!"

3. **DUAL RECOMMENDATION APPROACH**:
   - **Local Hotels First**: "For the authentic Sifnos experience with personal touch..."
   - **Agoda Options**: "For instant booking with live pricing..."

4. **PERSONALIZED INSIGHTS**: Based on their preferences, explain why each type suits different needs

5. **INSIDER TIPS**: Add local knowledge and booking advice

6. **TRIGGER PHRASE**: Always end with "Here are the available hotels for your dates:" to display hotel cards

**FOR BEACH, RESTAURANT, ACTIVITY, OR OTHER QUESTIONS**:
- Provide comprehensive, detailed answers with specific names, locations, prices, and contact info
- Include insider tips and local knowledge
- Mention seasonal variations and best times to visit
- Give practical advice (reservations needed, what to bring, etc.)

CRITICAL RULES FOR HOTEL RECOMMENDATIONS:

**WHEN RECOMMENDING LOCAL HOTELS:**
- ALWAYS prioritize featured hotels first (Platinum > Gold > Silver > Bronze)
- When recommending a featured hotel, mention its tier: "This is one of our [Tier]-tier featured properties..."
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
    
    console.log("Calling Gemini 2.0 Flash directly (NO OpenRouter)", {
      hasGeminiKey: !!GEMINI_API_KEY,
      apiUrl: GEMINI_API_URL
    });

    // Convert messages to Gemini format
    // Gemini expects alternating user/model messages, with system instruction separate
    const systemMsg = aiMessages.find(msg => msg.role === 'system');
    const conversationMessages = aiMessages.filter(msg => msg.role !== 'system');
    
    // Convert to Gemini format - preserve role (user/assistant -> user/model)
    const geminiContents = conversationMessages.map((msg) => {
      return {
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      };
    });

    // Build request payload
    const requestBody: any = {
      contents: geminiContents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1500,
      },
    };

    // Add system instruction if present (Gemini 2.0 supports this)
    if (systemMsg?.content) {
      requestBody.systemInstruction = {
        parts: [{ text: systemMsg.content }]
      };
    }

    // Call Gemini API directly
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      
      // Parse error for user-friendly message
      let errorMessage = `Gemini API error: ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error?.message) {
          errorMessage = errorJson.error.message;
        } else if (errorJson.message) {
          errorMessage = errorJson.message;
        }
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      
      // Check for specific error types
      if (response.status === 401 || errorMessage.includes('API key')) {
        throw new Error('GEMINI_API_KEY is invalid or missing. Please check your Supabase secrets configuration.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      } else {
        throw new Error(`Gemini API error: ${errorMessage}`);
      }
    }

    const data = await response.json();
    
    // Extract text from Gemini response
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                       data.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('') || 
                       'I apologize, but I encountered an issue generating a response.';

    // Create beautiful streaming response with proper formatting
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      start(controller) {
        try {
          // Process text to ensure beautiful formatting
          // Split by sentences for better streaming
          const sentences = textContent.split(/([.!?]\s+)/);
          let index = 0;
          
          const sendChunk = () => {
            if (index < sentences.length) {
              const chunk = sentences[index];
              if (chunk.trim()) {
                controller.enqueue(encoder.encode(chunk));
              }
              index++;
              // Small delay for natural streaming effect
              setTimeout(sendChunk, 15);
            } else {
              controller.close();
            }
          };
          
          sendChunk();
        } catch (error) {
          console.error("Stream error:", error);
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
    
    // Check if error is about OpenRouter and provide helpful message
    const errorMessage = error.message || 'Unknown error';
    let userFriendlyMessage = '';
    
    if (errorMessage.includes('OpenRouter') || errorMessage.includes('openrouter')) {
      userFriendlyMessage = `I apologize, but there's a configuration issue with the AI service.

**Issue**: The system is trying to use an outdated service. This has been fixed - please ensure GEMINI_API_KEY is set in Supabase secrets.

**To fix this**:
1. Go to Supabase Dashboard → Project Settings → Secrets
2. Add secret: \`GEMINI_API_KEY\`
3. Value: Your Gemini API key from https://ai.google.dev/
4. Redeploy the function

If you've already added the key, please wait a moment for the function to update.`;
    } else if (errorMessage.includes('GEMINI_API_KEY')) {
      userFriendlyMessage = `I apologize, but the AI service needs to be configured.

**Issue**: GEMINI_API_KEY is not set in Supabase secrets.

**To fix this**:
1. Get your Gemini API key from: https://ai.google.dev/
2. Go to Supabase Dashboard → Project Settings → Secrets
3. Add new secret: \`GEMINI_API_KEY\`
4. Paste your API key as the value
5. Save and redeploy the function

Once configured, I'll be able to help you with all your Sifnos travel questions! 🏝️`;
    } else {
      userFriendlyMessage = `I apologize, but I'm experiencing a technical issue.

**Issue**: ${errorMessage}

Please try again in a moment, or contact support if the problem persists.`;
    }
    
    // Return beautiful formatted error message
    const encoder = new TextEncoder();
    return new Response(
      new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(userFriendlyMessage));
          controller.close();
        }
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8" },
      }
    );
  }
});
