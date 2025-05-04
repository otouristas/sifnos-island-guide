
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RegistrationPayload {
  hotelName: string;
  contactName: string;
  email: string;
  phone: string;
  location: string;
  message?: string;
  selectedPlan: 'free' | 'standard' | 'premium';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body
    const payload: RegistrationPayload = await req.json();
    
    // Create email content
    const adminEmailContent = createAdminEmail(payload);
    const customerEmailContent = createCustomerEmail(payload);
    
    // Send emails
    // In a real implementation, this would use an email service like Resend
    // For now, we'll log the email content to the console
    console.log("Admin email content:", adminEmailContent);
    console.log("Customer email content:", customerEmailContent);
    
    // TODO: Implement actual email sending using a service like Resend
    // Example:
    // const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    // await resend.emails.send({
    //   from: "Hotels Sifnos <info@hotelssifnos.com>",
    //   to: "admin@hotelssifnos.com",
    //   subject: `New Hotel Registration: ${payload.hotelName}`,
    //   html: adminEmailContent,
    // });
    
    return new Response(
      JSON.stringify({ success: true, message: "Registration received" }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing registration:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 400,
      }
    );
  }
});

function createAdminEmail(payload: RegistrationPayload): string {
  const planName = payload.selectedPlan === 'free' ? 'Basic' : payload.selectedPlan === 'standard' ? 'Popular' : 'Premium';
  const planPrice = payload.selectedPlan === 'free' ? '0' : payload.selectedPlan === 'standard' ? '249' : '499';
  
  return `
    <h1>New Hotel Registration</h1>
    <p>A new hotel has registered for listing on HotelsSifnos.com</p>
    
    <h2>Registration Details:</h2>
    <ul>
      <li><strong>Hotel Name:</strong> ${payload.hotelName}</li>
      <li><strong>Contact Person:</strong> ${payload.contactName}</li>
      <li><strong>Email:</strong> ${payload.email}</li>
      <li><strong>Phone:</strong> ${payload.phone}</li>
      <li><strong>Location:</strong> ${payload.location}</li>
      <li><strong>Selected Plan:</strong> ${planName} (€${planPrice}/year)</li>
      <li><strong>Additional Information:</strong> ${payload.message || 'None provided'}</li>
    </ul>
    
    <p>Please contact the hotel within 24 hours to complete the registration process.</p>
  `;
}

function createCustomerEmail(payload: RegistrationPayload): string {
  const planName = payload.selectedPlan === 'free' ? 'Basic' : payload.selectedPlan === 'standard' ? 'Popular' : 'Premium';
  const planPrice = payload.selectedPlan === 'free' ? '0' : payload.selectedPlan === 'standard' ? '249' : '499';
  
  return `
    <h1>Thank You for Registering with Hotels Sifnos</h1>
    <p>Dear ${payload.contactName},</p>
    
    <p>Thank you for registering ${payload.hotelName} with Hotels Sifnos. We've received your registration for our ${planName} plan (€${planPrice}/year).</p>
    
    <h2>What happens next?</h2>
    <ol>
      <li>One of our team members will contact you within 24 hours via email or phone.</li>
      <li>We'll collect detailed information about your hotel, including photos and amenities.</li>
      <li>You'll receive payment instructions based on your selected plan (if applicable).</li>
      <li>Once payment is processed, we'll create your hotel listing and notify you when it's live.</li>
    </ol>
    
    <p>If you have any questions in the meantime, please don't hesitate to contact us at info@hotelssifnos.com.</p>
    
    <p>Best regards,<br>The Hotels Sifnos Team</p>
  `;
}
