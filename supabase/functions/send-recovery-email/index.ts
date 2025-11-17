import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RecoveryEmailRequest {
  abandonedBookingId: string;
}

const serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { abandonedBookingId }: RecoveryEmailRequest = await req.json();

    // Initialize Supabase client with service role
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch abandoned booking details
    const { data: booking, error: fetchError } = await supabase
      .from('abandoned_bookings')
      .select(`
        *,
        hotels:hotel_id(name, location, price),
        travel_packages:package_id(name, final_price, discount_percentage)
      `)
      .eq('id', abandonedBookingId)
      .single();

    if (fetchError || !booking) {
      throw new Error('Abandoned booking not found');
    }

    // Check if email already sent
    if (booking.recovery_email_sent) {
      return new Response(JSON.stringify({ message: 'Recovery email already sent' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build email content based on booking type
    let emailSubject = '';
    let emailHtml = '';

    if (booking.booking_type === 'package') {
      const pkg = booking.travel_packages;
      emailSubject = `Complete Your Sifnos ${pkg.name} Booking - Save ${pkg.discount_percentage}%!`;
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1E2E48;">Don't Miss Out on Your Perfect Sifnos Getaway!</h1>
          <p>Hi ${booking.user_name || 'there'},</p>
          <p>We noticed you were interested in our <strong>${pkg.name}</strong>.</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1E2E48; margin-top: 0;">${pkg.name}</h2>
            <p style="font-size: 18px; color: #666;">Save ${pkg.discount_percentage}% - Only €${pkg.final_price}</p>
            <p style="text-decoration: line-through; color: #999;">Regular price: €${booking.estimated_price}</p>
          </div>

          <p><strong>This exclusive deal includes:</strong></p>
          <ul>
            <li>Round-trip ferry tickets</li>
            <li>Premium accommodation</li>
            <li>Special amenities & perks</li>
            <li>Best price guarantee</li>
          </ul>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://hotelssifnos.com/packages?resume=${booking.session_id}" 
               style="background: #1E2E48; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Complete My Booking Now
            </a>
          </div>

          <p style="font-size: 12px; color: #999;">This offer is available for a limited time. Book now to secure your spot!</p>
        </div>
      `;
    } else if (booking.booking_type === 'hotel') {
      const hotel = booking.hotels;
      emailSubject = `Finish Your ${hotel.name} Booking - Exclusive Offer Inside!`;
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1E2E48;">Your Sifnos Hotel is Waiting!</h1>
          <p>Hi ${booking.user_name || 'there'},</p>
          <p>You were just one step away from booking <strong>${hotel.name}</strong> in ${hotel.location}.</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1E2E48; margin-top: 0;">${hotel.name}</h2>
            <p style="font-size: 18px; color: #666;">From €${hotel.price} per night</p>
            <p>Check-in: ${booking.check_in_date} | Check-out: ${booking.check_out_date}</p>
            <p>Guests: ${booking.guests}</p>
          </div>

          <p><strong>🎁 Special Offer: Complete your booking now and get 5% off!</strong></p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://hotelssifnos.com/hotels/${hotel.name.toLowerCase().replace(/\s+/g, '-')}?resume=${booking.session_id}" 
               style="background: #1E2E48; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Complete My Booking
            </a>
          </div>

          <p style="font-size: 12px; color: #999;">Rooms are filling fast! Don't miss out on your perfect Sifnos escape.</p>
        </div>
      `;
    }

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: "Sifnos Hotels <bookings@hotelssifnos.com>",
      to: [booking.user_email],
      subject: emailSubject,
      html: emailHtml,
    });

    console.log("Recovery email sent successfully:", emailResponse);

    // Update abandoned booking record
    await supabase
      .from('abandoned_bookings')
      .update({
        recovery_email_sent: true,
        recovery_email_sent_at: new Date().toISOString()
      })
      .eq('id', abandonedBookingId);

    return new Response(JSON.stringify({
      success: true,
      emailId: emailResponse.id
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error("Error in send-recovery-email:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
