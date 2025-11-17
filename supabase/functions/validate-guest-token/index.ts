import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ValidateTokenRequest {
  guestToken: string;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!
    );

    const { guestToken }: ValidateTokenRequest = await req.json();

    if (!guestToken) {
      return new Response(
        JSON.stringify({ error: 'Guest token is required' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get booking with hotel info
    const { data: booking, error: bookingError } = await supabase
      .from('room_bookings')
      .select(`
        id, guest_name, guest_email, check_in, check_out, booking_status,
        hotel_rooms!inner(
          id, name, hotel_id,
          hotels!inner(
            id, slug, name, logo_path, primary_color, secondary_color,
            guest_welcome_message, guest_wifi_name, guest_wifi_password,
            check_in_time, check_out_time, phone, email, address
          )
        )
      `)
      .eq('guest_token', guestToken)
      .single();

    if (bookingError || !booking) {
      console.error('Booking not found:', bookingError);
      return new Response(
        JSON.stringify({ error: 'Invalid or expired guest link' }), 
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if booking is active (within check-in/out dates + buffer)
    const now = new Date();
    const checkIn = new Date(booking.check_in);
    const checkOut = new Date(booking.check_out);
    
    // Allow access 1 day before check-in and 7 days after checkout
    checkIn.setDate(checkIn.getDate() - 1);
    checkOut.setDate(checkOut.getDate() + 7);

    if (now < checkIn || now > checkOut) {
      return new Response(
        JSON.stringify({ 
          error: 'Guest link expired',
          checkIn: booking.check_in,
          checkOut: booking.check_out,
          message: 'This guest link is only valid from 1 day before check-in until 7 days after checkout.'
        }), 
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const hotel = booking.hotel_rooms.hotels;

    return new Response(
      JSON.stringify({
        success: true,
        booking: {
          id: booking.id,
          guestName: booking.guest_name,
          guestEmail: booking.guest_email,
          checkIn: booking.check_in,
          checkOut: booking.check_out,
          roomName: booking.hotel_rooms.name,
          bookingStatus: booking.booking_status
        },
        hotel: {
          id: hotel.id,
          slug: hotel.slug,
          name: hotel.name,
          logoPath: hotel.logo_path,
          primaryColor: hotel.primary_color,
          secondaryColor: hotel.secondary_color,
          guestWelcomeMessage: hotel.guest_welcome_message,
          guestWifiName: hotel.guest_wifi_name,
          guestWifiPassword: hotel.guest_wifi_password,
          checkInTime: hotel.check_in_time,
          checkOutTime: hotel.check_out_time,
          phone: hotel.phone,
          email: hotel.email,
          address: hotel.address
        }
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error validating guest token:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});