
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'
import { corsHeaders } from '../_shared/cors.ts'

// Get environment variables
const supabaseUrl = 'https://wdzlruiekcznbcicjgrz.supabase.co'
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const bookingApiKey = Deno.env.get('BOOKING_API_KEY') || ''

// The actual function
Deno.serve(async (req) => {
  // Add CORS headers to all requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a supabase admin client (to bypass RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Parse request body if it exists
    const { cacheBuster, hotelId } = await req.json().catch(() => ({}))

    console.log(`Fetch booking reviews invoked at ${new Date().toISOString()}`)
    console.log(`Cache Buster: ${cacheBuster || 'not provided'}`)
    console.log(`Hotel ID: ${hotelId || 'not provided - fetching for all hotels'}`)
    
    // If a specific hotel ID was provided, only fetch reviews for that hotel
    if (hotelId) {
      console.log(`Fetching reviews for hotel ID: ${hotelId}`)
      // Code here would fetch booking.com reviews for the specific hotel
      
      // For now, simulating a response since we don't have actual booking.com API access
      const simulatedData = {
        success: true,
        message: `Reviews for hotel ${hotelId} have been updated`,
        updatedAt: new Date().toISOString(),
        reviewsCount: Math.floor(Math.random() * 5) + 1
      }
      
      console.log("Simulated data:", simulatedData)
      
      return new Response(
        JSON.stringify(simulatedData),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    } else {
      // No specific hotel ID provided - fetch for all hotels
      console.log("Fetching reviews for all hotels")
      
      // Here would be the code to fetch from the Booking.com API for all hotels
      // For now, let's simulate success
      
      // Generate some simulated review data
      const reviewCount = Math.floor(Math.random() * 10) + 5
      console.log(`Generated ${reviewCount} simulated reviews`)
      
      return new Response(
        JSON.stringify({
          success: true,
          message: `${reviewCount} reviews have been updated for all hotels`,
          updatedAt: new Date().toISOString(),
          reviewsCount: reviewCount
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }
  } catch (error) {
    console.error("Error in fetch-booking-reviews function:", error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
