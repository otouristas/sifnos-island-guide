
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { SmtpClient } from 'https://deno.land/x/smtp@v0.7.0/mod.ts'

interface ContactFormPayload {
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

    const { name, email, subject, message } = await req.json() as ContactFormPayload

    // Create SMTP client
    const client = new SmtpClient()
    await client.connectTLS({
      hostname: SMTP_HOSTNAME,
      port: SMTP_PORT,
      username: SMTP_USERNAME,
      password: SMTP_PASSWORD,
    })

    // Format message with a beautiful HTML template specifically for contact form
    const emailBody = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contact Form Submission</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #10b981;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            background-color: #f9fafb;
            padding: 20px;
            border-radius: 0 0 5px 5px;
            border: 1px solid #e5e7eb;
            border-top: none;
          }
          .info-item {
            margin-bottom: 10px;
            padding: 10px;
            background-color: white;
            border-radius: 5px;
            border-left: 4px solid #10b981;
          }
          .info-label {
            font-weight: bold;
            color: #10b981;
          }
          .message-box {
            margin-top: 20px;
            padding: 15px;
            background-color: #f0fdf4;
            border-radius: 5px;
            border-left: 4px solid #10b981;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            color: #6b7280;
            font-size: 0.9em;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>New Contact Form Submission</h1>
          <p>Someone has reached out via the contact form on HotelsSifnos.com</p>
        </div>
        
        <div class="content">
          <div class="info-item">
            <span class="info-label">From:</span> ${name}
          </div>
          
          <div class="info-item">
            <span class="info-label">Email:</span> <a href="mailto:${email}">${email}</a>
          </div>
          
          <div class="info-item">
            <span class="info-label">Subject:</span> ${subject}
          </div>
          
          <div class="message-box">
            <strong>Message:</strong>
            <p>${message}</p>
          </div>
          
          <div class="footer">
            <p>This is an automated message from HotelsSifnos.com</p>
            <p>© ${new Date().getFullYear()} Hotels Sifnos. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
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
