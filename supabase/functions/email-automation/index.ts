import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface EmailTrigger {
  trigger: string;
  userEmail: string;
  bookingId?: string;
  sessionId?: string;
  userName?: string;
  hotelName?: string;
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

    const { trigger, userEmail, bookingId, sessionId, userName, hotelName }: EmailTrigger = await req.json();

    // Get campaign for this trigger
    const { data: campaign, error: campaignError } = await supabase
      .from('email_campaigns')
      .select('*')
      .eq('trigger_event', trigger)
      .eq('is_active', true)
      .single();

    if (campaignError || !campaign) {
      console.log('No active campaign found for trigger:', trigger);
      return new Response(JSON.stringify({ success: false, message: 'No campaign found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Personalize email content
    let subject = campaign.subject_template;
    let body = campaign.body_template;

    if (userName) {
      subject = subject.replace('{userName}', userName);
      body = body.replace('{userName}', userName);
    }

    if (hotelName) {
      subject = subject.replace('{hotelName}', hotelName);
      body = body.replace('{hotelName}', hotelName);
    }

    // Add booking-specific content
    if (bookingId && trigger === 'booking_confirmed') {
      const { data: booking } = await supabase
        .from('room_bookings')
        .select(`
          *,
          hotel_rooms(
            name,
            hotels(name, address, phone, email)
          )
        `)
        .eq('id', bookingId)
        .single();

      if (booking) {
        body += `
          <div style="margin-top: 20px; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
            <h3>Booking Details</h3>
            <p><strong>Hotel:</strong> ${booking.hotel_rooms?.hotels?.name}</p>
            <p><strong>Room:</strong> ${booking.hotel_rooms?.name}</p>
            <p><strong>Check-in:</strong> ${booking.check_in}</p>
            <p><strong>Check-out:</strong> ${booking.check_out}</p>
            <p><strong>Total Price:</strong> €${booking.total_price}</p>
            <p><strong>Contact:</strong> ${booking.hotel_rooms?.hotels?.phone}</p>
          </div>
        `;
      }
    }

    // Add abandoned booking content
    if (trigger === 'booking_abandoned' && sessionId) {
      body += `
        <div style="margin-top: 20px; text-align: center;">
          <a href="https://hotelssifnos.gr/booking/complete?session=${sessionId}" 
             style="background-color: #e11d48; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Complete Your Booking with 10% OFF
          </a>
        </div>
      `;
    }

    // Send email
    const emailResponse = await resend.emails.send({
      from: "Sifnos Hotels <booking@hotelssifnos.gr>",
      to: [userEmail],
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://hotelssifnos.gr/uploads/touristas-ai-logo.svg" alt="Sifnos Hotels" style="height: 60px;">
          </div>
          ${body}
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 14px;">
            <p>Best regards,<br>The Sifnos Hotels Team</p>
            <p>Visit us at <a href="https://hotelssifnos.gr">hotelssifnos.gr</a></p>
          </div>
        </body>
        </html>
      `,
    });

    // Log email send
    await supabase
      .from('email_sends')
      .insert({
        campaign_id: campaign.id,
        recipient_email: userEmail,
        booking_session_id: sessionId,
        status: emailResponse.error ? 'failed' : 'sent'
      });

    if (emailResponse.error) {
      throw new Error(emailResponse.error.message);
    }

    console.log('Email sent successfully:', emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.data?.id,
      campaign: campaign.name
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in email-automation function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

serve(handler);