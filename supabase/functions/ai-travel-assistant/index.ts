
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
    
    // Call OpenRouter API with streaming enabled
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://hotelssifnos.com",
        "X-Title": "Hotels Sifnos"
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-sonnet", // Updated model name
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
    
    // Return the streaming response with proper headers
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
