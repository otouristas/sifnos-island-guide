import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { location = 'Sifnos', date } = await req.json();

    // Simulate weather API call (replace with actual weather service)
    const mockWeatherData = {
      condition: ['sunny', 'cloudy', 'rainy', 'windy'][Math.floor(Math.random() * 4)],
      temperature: Math.floor(Math.random() * 10) + 20, // 20-30°C
      humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
      windSpeed: Math.floor(Math.random() * 20) + 5 // 5-25 km/h
    };

    // Get weather-based recommendations
    const { data: recommendations, error } = await supabase
      .from('weather_recommendations')
      .select('*')
      .eq('location', location)
      .eq('weather_condition', mockWeatherData.condition)
      .order('priority_score', { ascending: false });

    if (error) {
      throw error;
    }

    // Get recommended hotels based on weather
    let recommendedHotels = [];
    
    if (recommendations && recommendations.length > 0) {
      for (const rec of recommendations) {
        if (rec.hotel_types && rec.hotel_types.length > 0) {
          const { data: hotels } = await supabase
            .from('hotels')
            .select('*')
            .overlaps('hotel_types', rec.hotel_types)
            .eq('location', location)
            .order('rating', { ascending: false })
            .limit(3);

          if (hotels) {
            recommendedHotels = [...recommendedHotels, ...hotels];
          }
        }
      }
    }

    // Remove duplicates
    const uniqueHotels = recommendedHotels.filter((hotel, index, self) =>
      index === self.findIndex(h => h.id === hotel.id)
    );

    // Generate weather-specific recommendations
    const weatherAdvice = generateWeatherAdvice(mockWeatherData);

    return new Response(JSON.stringify({
      weather: mockWeatherData,
      recommendations: recommendations || [],
      recommendedHotels: uniqueHotels.slice(0, 6),
      advice: weatherAdvice,
      location
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in weather-recommendations function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

function generateWeatherAdvice(weather: any) {
  const advice = [];
  
  switch (weather.condition) {
    case 'sunny':
      advice.push('Perfect weather for beach activities!');
      advice.push('Consider hotels with pools or beach access');
      advice.push('Don\'t forget sunscreen and stay hydrated');
      break;
    case 'cloudy':
      advice.push('Great weather for exploring villages');
      advice.push('Perfect for hiking and sightseeing');
      advice.push('Comfortable temperature for outdoor activities');
      break;
    case 'rainy':
      advice.push('Ideal time for spa treatments and relaxation');
      advice.push('Visit museums and indoor attractions');
      advice.push('Enjoy cozy restaurants and local cuisine');
      break;
    case 'windy':
      advice.push('Great conditions for windsurfing!');
      advice.push('Perfect for sailing activities');
      advice.push('Consider sheltered accommodations');
      break;
  }

  if (weather.temperature > 25) {
    advice.push('High temperature - seek air-conditioned accommodation');
  } else if (weather.temperature < 20) {
    advice.push('Cool weather - bring light jacket for evenings');
  }

  return advice;
}

serve(handler);