import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AgodaSearchRequest {
  checkInDate: string;
  checkOutDate: string;
  numberOfAdults?: number;
  numberOfChildren?: number;
  currency?: string;
  maxResult?: number;
}

interface AgodaHotel {
  hotelId: number;
  hotelName: string;
  starRating: number;
  reviewScore: number;
  reviewCount: number;
  currency: string;
  dailyRate: number;
  crossedOutRate: number;
  discountPercentage: number;
  imageURL: string;
  landingURL: string;
  includeBreakfast: boolean;
  freeWifi: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { checkInDate, checkOutDate, numberOfAdults, numberOfChildren = 0, maxResult = 50, currency = 'USD' } = await req.json()

    console.log('Received parameters:', {
      checkInDate,
      checkOutDate,
      numberOfAdults,
      numberOfChildren,
      maxResult,
      currency
    })

    // Validate required parameters
    if (!checkInDate || !checkOutDate || !numberOfAdults) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: checkInDate, checkOutDate, numberOfAdults' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Prepare Agoda API request - Exact match to official documentation
    const agodaRequest = {
      criteria: {
        additional: {
          currency,
          language: "en-us",
          maxResult,
          occupancy: {
            numberOfAdult: numberOfAdults,
            numberOfChildren: numberOfChildren
          },
          sortBy: "Recommended"
        },
        checkInDate,
        checkOutDate,
        cityId: 105165 // Sifnos city ID - may need verification
      }
    }

    console.log('Agoda API request body:', JSON.stringify(agodaRequest, null, 2))

    // Make request to Agoda API - Exact headers per documentation
    const agodaResponse = await fetch('http://affiliateapi7643.agoda.com/affiliateservice/lt_v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip,deflate',
        'Authorization': '1943066:97ce4b44-8c2d-4333-a8c6-9dfe389cec9a'
      },
      body: JSON.stringify(agodaRequest)
    })

    console.log('Agoda API response status:', agodaResponse.status)
    console.log('Agoda API response headers:', Object.fromEntries(agodaResponse.headers.entries()))

    const agodaData = await agodaResponse.text()
    console.log('Agoda API raw response:', agodaData)

    let parsedAgodaData
    try {
      parsedAgodaData = JSON.parse(agodaData)
    } catch (parseError) {
      console.error('Failed to parse Agoda response as JSON:', parseError)
      return new Response(
        JSON.stringify({ 
          error: 'Invalid response from Agoda API',
          raw_response: agodaData,
          status: agodaResponse.status
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Parsed Agoda data:', JSON.stringify(parsedAgodaData, null, 2))

    if (!agodaResponse.ok) {
      console.error('Agoda API error response:', parsedAgodaData)
      return new Response(
        JSON.stringify({
          error: 'Agoda API error',
          agoda_error: parsedAgodaData,
          status: agodaResponse.status
        }),
        { status: agodaResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check for Agoda API error format
    if (parsedAgodaData.error) {
      console.error('Agoda API returned error:', parsedAgodaData.error)
      return new Response(
        JSON.stringify({
          error: 'Agoda API error',
          agoda_error: parsedAgodaData.error
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Cache results in Supabase (optional - can be commented out for testing)
    /*
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    if (parsedAgodaData.results && parsedAgodaData.results.length > 0) {
      const hotelsToInsert = parsedAgodaData.results.map((hotel: any) => ({
        agoda_hotel_id: hotel.hotelId,
        name: hotel.hotelName,
        star_rating: hotel.starRating,
        review_score: hotel.reviewScore,
        daily_rate: hotel.dailyRate,
        currency: hotel.currency,
        image_url: hotel.imageURL,
        landing_url: hotel.landingURL,
        free_wifi: hotel.freeWifi,
        include_breakfast: hotel.includeBreakfast,
        discount_percentage: hotel.discountPercentage,
        crossed_out_rate: hotel.crossedOutRate,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        number_of_adults: numberOfAdults,
        number_of_children: numberOfChildren
      }))

      const { error: insertError } = await supabase
        .from('agoda_hotels')
        .upsert(hotelsToInsert, { onConflict: 'agoda_hotel_id,check_in_date,check_out_date' })

      if (insertError) {
        console.error('Error caching Agoda results:', insertError)
      } else {
        console.log(`Cached ${hotelsToInsert.length} Agoda hotels`)
      }
    }
    */

    return new Response(
      JSON.stringify({ 
        success: true,
        agoda_data: parsedAgodaData,
        debug_info: {
          request_sent: agodaRequest,
          response_status: agodaResponse.status,
          has_results: !!(parsedAgodaData.results && parsedAgodaData.results.length > 0)
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message,
        stack: error.stack
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
