import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateLinkRequest {
  bookingId: string;
  sendEmail?: boolean;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { bookingId, sendEmail = true }: GenerateLinkRequest = await req.json();

    // Get booking with hotel info
    const { data: booking, error: bookingError } = await supabase
      .from('room_bookings')
      .select(`
        id, guest_token, guest_name, guest_email, check_in, check_out, booking_status,
        room_id,
        hotel_rooms!inner(
          hotel_id,
          hotels!inner(
            id, slug, name, logo_path
          )
        )
      `)
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      console.error('Booking not found:', bookingError);
      return new Response(
        JSON.stringify({ error: 'Booking not found' }), 
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const hotel = booking.hotel_rooms.hotels;
    const siteUrl = Deno.env.get('SITE_URL') || 'https://hotelssifnos.com';
    const guestLink = `${siteUrl}/h/${hotel.slug}/g/${booking.guest_token}`;

    if (sendEmail && booking.guest_email) {
      // TODO: Send welcome email with guest link
      // This would call an email sending edge function
      console.log('Would send email to:', booking.guest_email);
      console.log('Guest link:', guestLink);

      // Update booking
      await supabase
        .from('room_bookings')
        .update({
          guest_link_sent: true,
          guest_link_sent_at: new Date().toISOString()
        })
        .eq('id', bookingId);
    }

    return new Response(
      JSON.stringify({
        success: true,
        guestLink,
        hotel: {
          name: hotel.name,
          slug: hotel.slug
        },
        booking: {
          guestName: booking.guest_name,
          checkIn: booking.check_in,
          checkOut: booking.check_out
        }
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error generating guest link:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});