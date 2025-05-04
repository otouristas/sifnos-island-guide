
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { SmtpClient } from 'https://deno.land/x/smtp@v0.7.0/mod.ts'

interface ContactPayload {
  name: string
  email: string
  subject: string
  message: string
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
    // Get environment variables
    const SMTP_HOSTNAME = Deno.env.get('SMTP_HOSTNAME') || 'smtp.yourprovider.com'
    const SMTP_PORT = parseInt(Deno.env.get('SMTP_PORT') || '587')
    const SMTP_USERNAME = Deno.env.get('SMTP_USERNAME') || 'your_username'
    const SMTP_PASSWORD = Deno.env.get('SMTP_PASSWORD') || 'your_password'
    const ADMIN_EMAIL = 'hello@hotelssifnos.com'

    const { name, email, subject, message } = await req.json() as ContactPayload

    // Create SMTP client
    const client = new SmtpClient()
    await client.connectTLS({
      hostname: SMTP_HOSTNAME,
      port: SMTP_PORT,
      username: SMTP_USERNAME,
      password: SMTP_PASSWORD,
    })

    // Format message content
    const emailBody = `
      <h1>New Contact Form Submission</h1>
      <p>A new message has been submitted via the contact form on HotelsSifnos.com</p>
      
      <h2>Contact Details:</h2>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Subject:</strong> ${subject}</li>
      </ul>
      
      <h2>Message:</h2>
      <p>${message}</p>
    `

    // Send email
    await client.send({
      from: SMTP_USERNAME,
      to: ADMIN_EMAIL,
      subject: `Contact Form: ${subject}`,
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
