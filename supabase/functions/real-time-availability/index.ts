import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AvailabilityRequest {
  hotelId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    if (req.method === 'POST') {
      const { hotelId, checkIn, checkOut, guests }: AvailabilityRequest = await req.json();
      
      // Get hotel rooms
      const { data: rooms, error: roomsError } = await supabase
        .from('hotel_rooms')
        .select('*')
        .eq('hotel_id', hotelId)
        .gte('capacity', guests);

      if (roomsError) {
        throw roomsError;
      }

      // Check availability for each room
      const availableRooms = [];
      
      for (const room of rooms || []) {
        const { data: bookings, error: bookingError } = await supabase
          .from('room_bookings')
          .select('*')
          .eq('room_id', room.id)
          .eq('booking_status', 'confirmed')
          .or(`check_in.lte.${checkOut},check_out.gte.${checkIn}`);

        if (bookingError) {
          console.error('Booking check error:', bookingError);
          continue;
        }

        // If no conflicting bookings, room is available
        if (!bookings || bookings.length === 0) {
          // Get room availability settings
          const { data: availability } = await supabase
            .from('room_availability')
            .select('*')
            .eq('room_id', room.id)
            .gte('date', checkIn)
            .lte('date', checkOut)
            .eq('is_available', true);

          availableRooms.push({
            ...room,
            availability: availability || [],
            isAvailable: true
          });
        }
      }

      return new Response(JSON.stringify({ 
        available: availableRooms.length > 0,
        rooms: availableRooms,
        totalRooms: availableRooms.length
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET request - check general availability
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const hotelId = url.searchParams.get('hotelId');
      
      if (!hotelId) {
        return new Response(JSON.stringify({ error: 'Hotel ID required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data: rooms, error } = await supabase
        .from('hotel_rooms')
        .select(`
          *,
          room_availability(*)
        `)
        .eq('hotel_id', hotelId);

      if (error) {
        throw error;
      }

      return new Response(JSON.stringify({ rooms }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in real-time-availability function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

serve(handler);