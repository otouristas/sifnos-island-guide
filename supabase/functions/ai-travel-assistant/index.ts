
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
    const { messages } = await req.json();
    
    // Create a system message with location-focused context
    const systemMessage = {
      role: "system",
      content: `You are TouristasAI, a helpful travel assistant specialized in finding the perfect accommodation in Sifnos, Greece.
      
      Sifnos is a beautiful Cycladic island known for its traditional villages, amazing beaches, and excellent food.
      
      Your job is to help visitors find their ideal stay based on their preferences. Be friendly, informative, and knowledgeable about Sifnos.
      
      When the user mentions specific locations like Platis Gialos, Apollonia, Kamares, Vathi, Kastro, or Faros,
      ALWAYS focus your recommendations on properties in those EXACT locations only. If they mention "Platy Gialo", understand this is the same as "Platis Gialos".
      
      Key locations in Sifnos:
      - Apollonia: The capital, inland with traditional architecture
      - Kamares: Main port with a nice beach
      - Platis Gialos: Popular beach resort area (also spelled as Platy Gialo)
      - Vathi: Small village with beautiful beach
      - Kastro: Medieval village with stunning views
      - Faros: Quiet coastal village with beaches
      
      Keep your responses conversational, helpful, and focused on helping travelers find their ideal accommodation in Sifnos based on their specified location preferences.
      
      When the user asks about a specific location or type of hotel (beachfront, family-friendly, luxury, etc.), ALWAYS phrase part of your response as: "Here are some hotel options that might interest you:" to ensure the UI can show hotel recommendations.
      
      Even for general greetings like "hello" or "hi", provide a warm, informative response about finding accommodations in Sifnos but don't imply that you're showing specific hotel results.
      
      Never mention prices - focus instead on the quality, amenities, location benefits, and overall experience of each recommended property.`
    };

    // Combine system message with user messages
    const allMessages = [systemMessage, ...messages];
    
    console.log("Calling OpenRouter API with messages:", JSON.stringify(allMessages));

    // Initialize OpenAI client with OpenRouter base URL
    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: OPENROUTER_API_KEY,
      dangerouslyAllowBrowser: true
    });

    // Create streaming chat completion
    const stream = await client.chat.completions.create({
      model: "anthropic/claude-3-haiku:beta",
      messages: allMessages,
      temperature: 0.7,
      max_tokens: 1000,
      stream: true,
      extra_headers: {
        "HTTP-Referer": "https://hotelssifnos.com",
        "X-Title": "Hotels Sifnos"
      }
    });

    // Create a ReadableStream from the OpenAI stream
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              // Format as SSE
              const sseMessage = `data: ${JSON.stringify({
                choices: [{ delta: { content }, index: 0 }]
              })}\n\n`;
              controller.enqueue(encoder.encode(sseMessage));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        }
      }
    });

    // Return the streaming response with proper headers
    return new Response(readable, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
      },
    });
  } catch (error) {
    console.error("Error in AI travel assistant:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        status: 500,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
