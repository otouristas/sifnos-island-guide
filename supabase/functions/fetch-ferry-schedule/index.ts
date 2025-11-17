import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const FERRYHOPPER_API_KEY = Deno.env.get('FERRYHOPPER_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { from, to, date } = await req.json();

    if (!FERRYHOPPER_API_KEY) {
      throw new Error('Ferryhopper API key not configured');
    }

    console.log('Fetching ferry schedules:', { from, to, date });

    // Call Ferryhopper API
    const response = await fetch(
      `https://api.ferryhopper.com/v1/routes?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}`,
      {
        headers: {
          'Authorization': `Bearer ${FERRYHOPPER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ferryhopper API error:', response.status, errorText);
      throw new Error(`Ferryhopper API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Ferry schedules fetched successfully:', data.length, 'results');

    return new Response(JSON.stringify({
      success: true,
      schedules: data.schedules || [],
      cached: false,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-ferry-schedule:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      schedules: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
