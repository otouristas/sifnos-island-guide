
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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { checkInDate, checkOutDate, numberOfAdults = 2, numberOfChildren = 0, currency = 'USD', maxResult = 30 } = await req.json() as AgodaSearchRequest

    // Check if we have cached results first
    const { data: cachedResults } = await supabase
      .from('agoda_hotels')
      .select('*')
      .eq('check_in_date', checkInDate)
      .eq('check_out_date', checkOutDate)
      .eq('number_of_adults', numberOfAdults)
      .eq('number_of_children', numberOfChildren)
      .gt('expires_at', new Date().toISOString())

    if (cachedResults && cachedResults.length > 0) {
      console.log('Returning cached Agoda results')
      return new Response(
        JSON.stringify({ results: cachedResults, source: 'cache' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Prepare Agoda API request
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
        cityId: 105165 // Sifnos city ID
      }
    }

    console.log('Making Agoda API request:', JSON.stringify(agodaRequest))

    // Make request to Agoda API
    const response = await fetch('http://affiliateapi7643.agoda.com/affiliateservice/lt_v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip,deflate',
        'Authorization': '1943066:97ce4b44-8c2d-4333-a8c6-9dfe389cec9a'
      },
      body: JSON.stringify(agodaRequest)
    })

    if (!response.ok) {
      console.error('Agoda API error:', response.status, response.statusText)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch from Agoda API', status: response.status }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const agodaData = await response.json()
    console.log('Agoda API response:', agodaData)

    if (agodaData.error) {
      console.error('Agoda API returned error:', agodaData.error)
      return new Response(
        JSON.stringify({ error: agodaData.error }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Cache the results in Supabase
    if (agodaData.results && agodaData.results.length > 0) {
      const hotelsToCache = agodaData.results.map((hotel: AgodaHotel) => ({
        agoda_hotel_id: hotel.hotelId,
        name: hotel.hotelName,
        star_rating: hotel.starRating,
        review_score: hotel.reviewScore,
        review_count: hotel.reviewCount,
        daily_rate: hotel.dailyRate,
        crossed_out_rate: hotel.crossedOutRate,
        discount_percentage: hotel.discountPercentage,
        currency: hotel.currency,
        image_url: hotel.imageURL,
        landing_url: hotel.landingURL,
        include_breakfast: hotel.includeBreakfast,
        free_wifi: hotel.freeWifi,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        number_of_adults: numberOfAdults,
        number_of_children: numberOfChildren
      }))

      const { error: insertError } = await supabase
        .from('agoda_hotels')
        .insert(hotelsToCache)

      if (insertError) {
        console.error('Error caching Agoda results:', insertError)
      } else {
        console.log('Successfully cached', hotelsToCache.length, 'Agoda hotels')
      }
    }

    return new Response(
      JSON.stringify({ results: agodaData.results || [], source: 'api' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
