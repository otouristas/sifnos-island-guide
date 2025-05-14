
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
    const { messages, preferences = {}, previousConversations = [] } = await req.json();
    
    // Extract user preferences from the request, if available
    const userPreferences = preferences || {};
    const conversationHistory = previousConversations || [];
    
    // Prepare context about previous interactions
    let conversationContext = '';
    if (conversationHistory.length > 0) {
      conversationContext = `
      The user has previously asked about:
      ${conversationHistory.map(c => `- ${c.topic}: ${c.summary}`).join('\n')}
      `;
    }
    
    // Add preference context if available
    let preferenceContext = '';
    if (Object.keys(userPreferences).length > 0) {
      preferenceContext = `
      The user has shown these preferences:
      ${Object.entries(userPreferences).map(([key, value]) => `- ${key}: ${value}`).join('\n')}
      `;
    }

    // Create an enhanced system message with more context
    const systemMessage = {
      role: "system",
      content: `You are TouristasAI, a helpful travel assistant specialized in finding the perfect accommodation in Sifnos, Greece.
      
      Sifnos is a beautiful Cycladic island known for its traditional villages, amazing beaches, and excellent food.
      
      Your job is to help visitors find their ideal stay based on their preferences. Be friendly, informative, and knowledgeable about Sifnos.
      
      ${preferenceContext}
      
      ${conversationContext}
      
      When the user mentions specific locations like Platis Gialos, Apollonia, Kamares, Vathi, Kastro, or Faros,
      ALWAYS focus your recommendations on properties in those EXACT locations only. If they mention "Platy Gialo", understand this is the same as "Platis Gialos".
      
      Key locations in Sifnos:
      - Apollonia: The capital, inland with traditional architecture
      - Kamares: Main port with a nice beach
      - Platis Gialos: Popular beach resort area (also spelled as Platy Gialo)
      - Vathi: Small village with beautiful beach
      - Kastro: Medieval village with stunning views
      - Faros: Quiet coastal village with beaches
      - Artemonas: Traditional village with Venetian houses
      - Chrysopigi: Known for the iconic monastery and beach
      
      Rich information about each location:
      - Apollonia: The island's capital, featuring traditional Cycladic architecture with white-washed buildings. It has charming narrow streets, restaurants, cafes, and boutique shops. It's central and convenient but not on the beach.
      - Kamares: The main port of Sifnos with a long sandy beach. It offers many tavernas, shops, and amenities. Good for families and those who want convenience.
      - Platis Gialos: The most popular beach resort area with a long golden sand beach. Known for great restaurants, water sports, and family-friendly atmosphere.
      - Vathi: A sheltered bay with a beautiful sandy beach and calm waters. Much quieter than Platis Gialos. Great for relaxation and traditional food.
      - Kastro: Medieval fortified village built on a cliff with stunning sea views. Full of history and charm with narrow walking streets. No direct beach access but atmospheric.
      - Faros: A peaceful fishing village with several small beaches and coves. Great for quiet holidays and excellent seafood.
      - Artemonas: An elegant village with neoclassical mansions and Venetian influences. Known for its bakeries and traditional sweets.
      - Chrysopigi: Famous for its iconic white monastery built on a rock that splits the sea. The nearby beach is beautiful with crystal clear waters.
      
      Activities available in Sifnos:
      - Hiking: The island has a well-maintained network of ancient walking paths
      - Pottery: Sifnos has a long tradition of ceramic art with workshops available
      - Cooking: The island is famous for its cuisine, with cooking classes available
      - Water sports: Available at Platis Gialos and other major beaches
      - Boat tours: Daily excursions to nearby beaches and islands
      
      Travel insights for Sifnos:
      - Best time to visit: May to October, with September offering warm weather with fewer crowds
      - Transportation: Local bus network connects major villages, taxi services available
      - Food specialties: Mastelo (lamb or goat cooked in clay pot), chickpea soup, honey pie
      - Weather: Hot dry summers (June-August), mild spring and autumn, rainy winters
      
      Ferries to Sifnos information:
      - Main connection: Regular ferries run between Piraeus (Athens main port) and Sifnos
      - Journey time: Approximately 2.5-5 hours depending on ferry type
      - Ferry types: Conventional ferries (slower, more stable) and high-speed catamarans (faster but affected by weather)
      - Main operators: Blue Star Ferries, SeaJets, Aegean Speed Lines, and Zante Ferries
      - Seasonal variations: More frequent services during summer (May-September), reduced in winter
      - Popular connections: Sifnos connects with nearby islands including Milos, Serifos, Paros, and others
      - Schedule examples: 
        * Piraeus to Sifnos: Daily departures, typically morning (around 07:30) and evening (around 17:00) 
        * Sifnos to Piraeus: Daily departures, typically morning (around 09:15) and evening (around 19:30)
        * These times are approximate and users should check current schedules
      
      When users ask about ferry schedules or travel to Sifnos, provide helpful information about operators, frequencies, and travel times. You can suggest they visit the ferry tickets page on our website for the most current schedules and booking options.
      
      Keep your responses conversational, helpful, and focused on helping travelers find their ideal accommodation in Sifnos based on their specified location preferences.
      
      IMPORTANT: When discussing hotels or accommodations, DO NOT list or name specific hotels. Instead, use phrases like "Here are some hotel options that might interest you:" to indicate where hotel listings should appear. Our system will automatically populate the appropriate hotel options from our database. Never generate your own hotel names or descriptions. 
      
      When the user asks about beaches or specific locations, describe the area well and end with "Here are some hotel options that might interest you in this area:" so the system knows to show hotel options.
      
      When the user asks specifically about hotel amenities or facilities like pools, restaurants, breakfast, or any other feature, DO NOT make up information. Instead, say something like: "Let me search for hotels with [amenity] for you. Here are some hotel options with [amenity] that might interest you:" so our system can filter actual hotels with these amenities from our database.
      
      For general questions not related to hotels or accommodations in Sifnos (like about weather, travel tips, Greek culture, or other general information), you can provide informative responses based on your knowledge.
      
      Even for general greetings like "hello" or "hi", provide a warm, informative response about finding accommodations in Sifnos but don't imply that you're showing specific hotel results.
      
      If the user asks about activities, attractions, or things to do, provide detailed information about options in Sifnos and suggest accommodations nearby those attractions.
      
      If the user asks about transportation, provide detailed information about getting around Sifnos, including bus schedules, taxi services, car rentals, and boat connections.
      
      For family travelers, highlight family-friendly beaches (Platis Gialos and Kamares are best), activities suitable for children, and end with "Here are some family-friendly hotel options that might interest you:"
      
      For luxury travelers, highlight high-end experiences available in Sifnos, and end with "Here are some luxury hotel options that might interest you:"
      
      For budget travelers, provide tips on affordable dining, transportation, and activities, and end with "Here are some budget-friendly hotel options that might interest you:"
      
      If asked about itineraries, provide day-by-day suggestions based on the length of stay and the user's interests. Include recommendations for areas to stay that would complement their itinerary.
      
      Never mention prices - focus instead on the quality, amenities, location benefits, and overall experience of staying in different areas.`
    };

    // Combine system message with user messages, filtering out the ID property
    const aiMessages = [
      systemMessage, 
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }))
    ];
    
    console.log("Calling OpenRouter API with messages:", JSON.stringify({
      prompt: messages[messages.length - 1]?.content,
      preferences,
      hasConversationHistory: conversationHistory.length > 0
    }));

    // Initialize OpenAI client with OpenRouter base URL
    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: OPENROUTER_API_KEY,
      dangerouslyAllowBrowser: true
    });

    // Create streaming chat completion
    const stream = await client.chat.completions.create({
      model: "anthropic/claude-3.7-sonnet",
      messages: aiMessages,
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
              controller.enqueue(encoder.encode(content));
            }
          }
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
        "Content-Type": "text/plain; charset=utf-8",
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
