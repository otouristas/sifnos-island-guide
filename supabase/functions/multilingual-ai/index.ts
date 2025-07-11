import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MultilingualRequest {
  messages: Array<{role: string, content: string}>;
  language: string;
  preferences: Record<string, any>;
}

const LANGUAGE_PROMPTS = {
  en: "You are a helpful travel assistant for Sifnos Island, Greece. Respond in English.",
  el: "Είσαι ένας χρήσιμος ταξιδιωτικός βοηθός για το νησί Σίφνος, Ελλάδα. Απάντησε στα ελληνικά.",
  fr: "Vous êtes un assistant de voyage utile pour l'île de Sifnos, en Grèce. Répondez en français.",
  de: "Sie sind ein hilfreicher Reiseassistent für die Insel Sifnos, Griechenland. Antworten Sie auf Deutsch.",
  it: "Sei un assistente di viaggio utile per l'isola di Sifnos, in Grecia. Rispondi in italiano.",
  es: "Eres un asistente de viaje útil para la isla de Sifnos, Grecia. Responde en español."
};

const serve_handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { messages, language = 'en', preferences = {} }: MultilingualRequest = await req.json();

    // Get language-specific system prompt
    const systemPrompt = LANGUAGE_PROMPTS[language as keyof typeof LANGUAGE_PROMPTS] || LANGUAGE_PROMPTS.en;

    // Get hotels data for context
    const { data: hotels } = await supabase
      .from('hotels')
      .select('id, name, location, description, rating, price, hotel_types')
      .order('rating', { ascending: false });

    // Get weather recommendations
    const { data: weatherRecommendations } = await supabase
      .from('weather_recommendations')
      .select('*')
      .eq('location', 'Sifnos');

    // Build context based on language
    let hotelContext = '';
    if (language === 'el') {
      hotelContext = 'Διαθέσιμα ξενοδοχεία στη Σίφνο:\n';
    } else if (language === 'fr') {
      hotelContext = 'Hôtels disponibles à Sifnos:\n';
    } else if (language === 'de') {
      hotelContext = 'Verfügbare Hotels in Sifnos:\n';
    } else if (language === 'it') {
      hotelContext = 'Hotel disponibili a Sifnos:\n';
    } else if (language === 'es') {
      hotelContext = 'Hoteles disponibles en Sifnos:\n';
    } else {
      hotelContext = 'Available hotels in Sifnos:\n';
    }

    hotels?.slice(0, 10).forEach(hotel => {
      hotelContext += `- ${hotel.name} (${hotel.location}) - €${hotel.price}/night - Rating: ${hotel.rating}/5\n`;
    });

    // Add user preferences to context
    let preferencesContext = '';
    if (Object.keys(preferences).length > 0) {
      if (language === 'el') {
        preferencesContext = '\nΠροτιμήσεις χρήστη:\n';
      } else if (language === 'fr') {
        preferencesContext = '\nPréférences utilisateur:\n';
      } else if (language === 'de') {
        preferencesContext = '\nBenutzereinstellungen:\n';
      } else if (language === 'it') {
        preferencesContext = '\nPreferenze utente:\n';
      } else if (language === 'es') {
        preferencesContext = '\nPreferencias del usuario:\n';
      } else {
        preferencesContext = '\nUser preferences:\n';
      }
      
      Object.entries(preferences).forEach(([key, value]) => {
        preferencesContext += `- ${key}: ${value}\n`;
      });
    }

    const fullSystemPrompt = `${systemPrompt}

${hotelContext}

${preferencesContext}

Always provide helpful, accurate information about Sifnos hotels, attractions, and travel advice. Be friendly and personalized based on user preferences.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: fullSystemPrompt },
          ...messages
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 1500
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    // Create a transform stream to process the OpenAI response
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        controller.enqueue(chunk);
      },
    });

    // Pipe the response through our transform stream
    const readableStream = response.body?.pipeThrough(transformStream);

    return new Response(readableStream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error in multilingual-ai function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

serve(serve_handler);