import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BookingRequest {
  hotelId: string;
  roomId?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  userEmail: string;
  userPhone?: string;
  guestName: string;
  specialRequests?: string;
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
      const bookingData: BookingRequest = await req.json();
      
      // Validate required fields
      if (!bookingData.hotelId || !bookingData.checkIn || !bookingData.checkOut) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(bookingData.userEmail)) {
        return new Response(JSON.stringify({ error: 'Invalid email format' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Validate dates
      const checkIn = new Date(bookingData.checkIn);
      const checkOut = new Date(bookingData.checkOut);
      if (checkOut <= checkIn) {
        return new Response(JSON.stringify({ error: 'Check-out must be after check-in' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      // Generate session ID
      const sessionId = crypto.randomUUID();

      // Get current user ID if authenticated
      const authHeader = req.headers.get('Authorization');
      let userId = null;
      if (authHeader) {
        try {
          const token = authHeader.replace('Bearer ', '');
          const { data: { user } } = await supabase.auth.getUser(token);
          userId = user?.id;
        } catch (error) {
          console.error('Error getting user from token:', error);
        }
      }
      
      // Create booking session with user_id
      const { data: session, error: sessionError } = await supabase
        .from('booking_sessions')
        .insert({
          session_id: sessionId,
          hotel_id: bookingData.hotelId,
          room_id: bookingData.roomId,
          check_in_date: bookingData.checkIn,
          check_out_date: bookingData.checkOut,
          guests: bookingData.guests,
          user_email: bookingData.userEmail,
          user_phone: bookingData.userPhone,
          user_id: userId,
          status: 'pending'
        })
        .select()
        .single();

      if (sessionError) {
        throw sessionError;
      }

      // Calculate total price
      let totalPrice = 0;
      if (bookingData.roomId) {
        const { data: room } = await supabase
          .from('hotel_rooms')
          .select('price')
          .eq('id', bookingData.roomId)
          .single();
        
        if (room) {
          const checkInDate = new Date(bookingData.checkIn);
          const checkOutDate = new Date(bookingData.checkOut);
          const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
          totalPrice = room.price * nights;
        }
      }

      // Create the actual booking
      const { data: booking, error: bookingError } = await supabase
        .from('room_bookings')
        .insert({
          room_id: bookingData.roomId,
          check_in: bookingData.checkIn,
          check_out: bookingData.checkOut,
          guest_name: bookingData.guestName,
          guest_email: bookingData.userEmail,
          guest_phone: bookingData.userPhone,
          special_requests: bookingData.specialRequests,
          total_price: totalPrice,
          booking_status: 'confirmed'
        })
        .select()
        .single();

      if (bookingError) {
        throw bookingError;
      }

      // Update session status
      await supabase
        .from('booking_sessions')
        .update({ status: 'completed' })
        .eq('id', session.id);

      // Trigger email campaign
      await supabase.functions.invoke('email-automation', {
        body: {
          trigger: 'booking_confirmed',
          userEmail: bookingData.userEmail,
          bookingId: booking.id,
          sessionId: sessionId
        }
      });

      // Create social proof event
      await supabase
        .from('social_proof_events')
        .insert({
          event_type: 'booking',
          hotel_id: bookingData.hotelId,
          anonymous_user_id: sessionId
        });

      return new Response(JSON.stringify({ 
        success: true,
        booking,
        sessionId,
        totalPrice
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET request - retrieve booking
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const sessionId = url.searchParams.get('sessionId');
      
      if (!sessionId) {
        return new Response(JSON.stringify({ error: 'Session ID required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data: session, error } = await supabase
        .from('booking_sessions')
        .select(`
          *,
          hotels(*),
          hotel_rooms(*)
        `)
        .eq('session_id', sessionId)
        .single();

      if (error) {
        throw error;
      }

      return new Response(JSON.stringify({ session }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in booking-engine function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

serve(handler);