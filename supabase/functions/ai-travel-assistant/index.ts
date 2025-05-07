
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    const { messages, hotelQuery } = await req.json();
    
    // Create a system message with context about Sifnos and the purpose of the assistant
    const systemMessage = {
      role: "system",
      content: `You are TouristasAI, a helpful travel assistant specialized in finding the perfect accommodation in Sifnos, Greece.
      
      Sifnos is a beautiful Cycladic island known for its traditional villages, amazing beaches, and excellent food.
      
      Your job is to help visitors find their ideal stay based on their preferences. Be friendly, informative, and knowledgeable about Sifnos.
      
      If the user asks about specific preferences (like beach access, luxury amenities, family-friendly, budget options),
      recommend appropriate areas and types of accommodation on the island.
      
      Key locations in Sifnos:
      - Apollonia: The capital, inland with traditional architecture
      - Kamares: Main port with a nice beach
      - Platis Gialos: Popular beach resort area
      - Vathi: Small village with beautiful beach
      - Kastro: Medieval village with stunning views
      - Faros: Quiet coastal village with beaches
      
      Keep your responses conversational, helpful, and focused on helping travelers find their ideal accommodation in Sifnos.`
    };

    // Combine system message with user messages
    const allMessages = [systemMessage, ...messages];
    
    console.log("Calling OpenRouter API with messages:", JSON.stringify(allMessages));
    
    // Call OpenRouter API with a valid model
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://hotelssifnos.com",
        "X-Title": "Hotels Sifnos"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o",
        messages: allMessages,
        temperature: 0.7,
        max_tokens: 1000,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", response.status, errorText);
      throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
    }
    
    // Return the streaming response directly without modifying it
    return new Response(response.body, {
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
