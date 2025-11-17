import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Checking for abandoned bookings...');

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find abandoned bookings from 2-24 hours ago that haven't received recovery email
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: abandonedBookings, error: fetchError } = await supabase
      .from('abandoned_bookings')
      .select('*')
      .eq('recovery_email_sent', false)
      .eq('converted', false)
      .gte('created_at', twentyFourHoursAgo)
      .lte('created_at', twoHoursAgo)
      .not('user_email', 'is', null);

    if (fetchError) {
      throw fetchError;
    }

    console.log(`Found ${abandonedBookings?.length || 0} abandoned bookings to recover`);

    const results = [];

    // Send recovery email for each abandoned booking
    for (const booking of abandonedBookings || []) {
      try {
        console.log(`Sending recovery email for booking ${booking.id}`);
        
        // Call the send-recovery-email function
        const response = await fetch(
          `${supabaseUrl}/functions/v1/send-recovery-email`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              abandonedBookingId: booking.id
            })
          }
        );

        const result = await response.json();
        results.push({
          bookingId: booking.id,
          success: result.success,
          error: result.error
        });
      } catch (error) {
        console.error(`Failed to send recovery email for booking ${booking.id}:`, error);
        results.push({
          bookingId: booking.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      processed: results.length,
      results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in check-abandoned-bookings:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
