
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
    console.log('Registration email function called')
    
    // Use the provided SMTP settings
    const SMTP_HOSTNAME = 'hotelssifnos.com'
    const SMTP_PORT = 465
    const SMTP_USERNAME = 'hello@hotelssifnos.com'
    const SMTP_PASSWORD = 'Gamiesai@@20'
    const ADMIN_EMAIL = 'hello@hotelssifnos.com'

    const { hotel, contactName, email, phone, location, plan, message, registrationId } = await req.json() as EmailPayload
    
    console.log('Received registration submission:', { hotel, contactName, email, location, plan })

    // Create SMTP client
    const client = new SmtpClient()
    console.log('Connecting to SMTP server...')
    
    try {
      await client.connectTLS({
        hostname: SMTP_HOSTNAME,
        port: SMTP_PORT,
        username: SMTP_USERNAME,
        password: SMTP_PASSWORD,
        tls: true,
      })
      
      console.log('Connected to SMTP server successfully')
    } catch (connError) {
      console.error('SMTP connection error:', connError)
      throw new Error(`SMTP connection failed: ${connError.message}`)
    }

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

    try {
      // Send email
      console.log('Sending email...')
      const sendResult = await client.send({
        from: SMTP_USERNAME,
        to: ADMIN_EMAIL,
        subject: `New Hotel Registration: ${hotel}`,
        content: emailBody,
        html: emailBody,
      })
      
      console.log('Email sent successfully:', sendResult)
    } catch (sendError) {
      console.error('Error sending email:', sendError)
      throw new Error(`Failed to send email: ${sendError.message}`)
    } finally {
      await client.close()
    }

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
    console.error('Error in registration email function:', error)
    
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
