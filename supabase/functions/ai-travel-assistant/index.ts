import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { OpenAI } from "https://esm.sh/openai@4.19.0";

const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY") || "";

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

    // Enhanced system message with comprehensive context
    const systemMessage = {
      role: "system",
      content: `You are Touristas AI, the most intelligent travel assistant for Sifnos, Greece. You have been trained on the complete Hotels Sifnos website and have access to real-time data.

${dateContext}

${websiteContext}

${preferenceContext}

${conversationContext}

CORE INTELLIGENCE CAPABILITIES:

1. **DATE INTELLIGENCE**: You understand natural language dates:
   - "next weekend" = automatically calculate the upcoming Friday-Sunday
   - "next week" = find the next Monday and suggest 3-day stays
   - "in June" = mid-June dates
   - "available hotels" = search with near-future dates
   - Always provide specific dates when users mention time periods

2. **REAL-TIME AVAILABILITY**: When you have parsed dates (check-in/check-out), you can access:
   - Live hotel pricing from Agoda partners (up to 50 hotels)
   - Real availability for the exact dates requested
   - Current pricing and discounts

3. **WEBSITE-TRAINED KNOWLEDGE**: You know everything about:
   - All 5 local hotels in the database with complete details
   - Current pricing, amenities, room types for each property
   - Exact locations and what makes each area special
   - Seasonal information and current tourist season status

4. **SMART RESPONSES**: 
   - When users ask about availability for specific times, confirm the exact dates you've calculated
   - Always mention when you're showing results for parsed dates
   - Combine local hotels with Agoda partner options
   - Provide context about why certain hotels are recommended

RESPONSE GUIDELINES:

When users mention time periods like "next weekend", "available hotels", etc.:
1. First acknowledge the specific dates you've calculated: "I've found availability for [specific dates]"
2. Explain briefly what period this covers: "That's Friday [date] to Sunday [date]"
3. Then provide hotel recommendations with real availability

For hotel searches with dates:
- Prioritize hotels with confirmed availability for those exact dates
- Mention both local properties and Agoda partner options
- Include pricing information when available
- Suggest bundle deals when multiple hotels are found

For general Sifnos questions:
- Use your extensive knowledge of the island
- Reference specific locations, restaurants, activities from your training
- Always connect back to accommodation recommendations

CRITICAL: When showing hotel results, always use the phrase "Here are the available hotels for your dates:" or "Here are hotel options that match your preferences:" so the system knows to display the actual hotel cards with real data.

Never invent hotel names, prices, or specific details - let the system populate real results.

Current user query: "${currentQuery}"

Respond intelligently based on all this context, showing your understanding of dates, preferences, and real-time availability.`
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
