
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { SmtpClient } from 'https://deno.land/x/smtp@v0.7.0/mod.ts'

interface EmailPayload {
  hotel: string
  contactName: string
  email: string
  phone: string
  location: string
  plan: string
  message: string
  registrationId: string
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Use the provided SMTP settings
    const SMTP_HOSTNAME = 'hotelssifnos.com'
    const SMTP_PORT = 465
    const SMTP_USERNAME = 'hello@hotelssifnos.com'
    const SMTP_PASSWORD = 'Gamiesai@@20'
    const ADMIN_EMAIL = 'hello@hotelssifnos.com'

    const { hotel, contactName, email, phone, location, plan, message, registrationId } = await req.json() as EmailPayload

    // Create SMTP client
    const client = new SmtpClient()
    await client.connectTLS({
      hostname: SMTP_HOSTNAME,
      port: SMTP_PORT,
      username: SMTP_USERNAME,
      password: SMTP_PASSWORD,
      tls: true,
    })

    // Format message content
    const emailBody = `
      <h1>New Hotel Registration</h1>
      <p>A new hotel registration has been submitted on HotelsSifnos.com</p>
      
      <h2>Registration Details:</h2>
      <ul>
        <li><strong>Registration ID:</strong> ${registrationId}</li>
        <li><strong>Hotel Name:</strong> ${hotel}</li>
        <li><strong>Contact Person:</strong> ${contactName}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Phone:</strong> ${phone}</li>
        <li><strong>Location:</strong> ${location}</li>
        <li><strong>Selected Plan:</strong> ${plan}</li>
      </ul>
      
      ${message ? `<h2>Additional Message:</h2><p>${message}</p>` : ''}
      
      <p>Please log in to the admin dashboard to review this registration.</p>
    `

    // Send email
    await client.send({
      from: SMTP_USERNAME,
      to: ADMIN_EMAIL,
      subject: `New Hotel Registration: ${hotel}`,
      content: emailBody,
      html: emailBody,
    })

    await client.close()

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  } catch (error) {
    console.error('Error sending email:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  }
})
