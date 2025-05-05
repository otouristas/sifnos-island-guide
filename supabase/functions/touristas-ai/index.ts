
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const supabaseUrl = "https://wdzlruiekcznbcicjgrz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkemxydWlla2N6bmJjaWNqZ3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyODAyNzYsImV4cCI6MjA1OTg1NjI3Nn0.NaoVf3tU3Xz08CWCHpQtq7_9H6G6ES9EjtCvPHa0aRk";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request
    const { query } = await req.json();
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    console.log("Touristas AI Query:", query);
    
    // Parse user query to extract key information
    const locations = ['kamares', 'apollonia', 'platis gialos', 'faros', 'vathi', 'kastro'];
    const amenities = ['wifi', 'breakfast', 'pool', 'parking', 'air conditioning', 'restaurant', 'sea view'];
    const hotelTypes = ['beach-hotels', 'boutique-hotels', 'family-hotels', 'luxury-hotels', 'traditional-hotels'];
    
    // Simple NLP to extract key parameters
    const queryLower = query.toLowerCase();
    
    let extractedParams = {
      location: locations.find(loc => queryLower.includes(loc.toLowerCase())),
      amenities: amenities.filter(amenity => queryLower.includes(amenity.toLowerCase())),
      hotelType: hotelTypes.find(type => {
        const typeWithoutDash = type.replace(/-/g, ' ');
        return queryLower.includes(typeWithoutDash);
      }),
      nearBeach: queryLower.includes('beach') || queryLower.includes('near beach') || queryLower.includes('close to beach'),
      days: (queryLower.match(/(\d+)\s*days?/) || [])[1]
    };
    
    console.log("Extracted parameters:", extractedParams);

    // Query the database based on extracted parameters
    let query = supabase
      .from('hotels')
      .select(`
        *,
        hotel_amenities(amenity),
        hotel_photos(id, photo_url, is_main_photo)
      `);
    
    // Filter by location if specified
    if (extractedParams.location) {
      query = query.ilike('location', `%${extractedParams.location}%`);
    }
    
    // Filter by hotel type if specified
    if (extractedParams.hotelType) {
      query = query.contains('hotel_types', [extractedParams.hotelType]);
    } else if (extractedParams.nearBeach) {
      // If no specific type but beach is mentioned, filter for beach hotels
      query = query.contains('hotel_types', ['beach-hotels']);
    }
    
    // Execute the query
    const { data: hotels, error } = await query;
    
    if (error) {
      throw error;
    }
    
    console.log(`Found ${hotels.length} matching hotels`);

    // Process and rank hotels based on the query
    const rankedHotels = hotels.map(hotel => {
      // Basic scoring system
      let score = 0;
      
      // Score based on amenities match
      const hotelAmenities = hotel.hotel_amenities.map(a => a.amenity.toLowerCase());
      if (extractedParams.amenities.length > 0) {
        const matchedAmenities = extractedParams.amenities.filter(
          a => hotelAmenities.some(ha => ha.includes(a))
        );
        score += (matchedAmenities.length / extractedParams.amenities.length) * 10;
      }
      
      // Score based on hotel type match
      if (extractedParams.hotelType && hotel.hotel_types?.includes(extractedParams.hotelType)) {
        score += 5;
      }
      
      // Score based on beach proximity for beach queries
      if (extractedParams.nearBeach && 
         (hotel.hotel_types?.includes('beach-hotels') || 
          hotel.description.toLowerCase().includes('beach') ||
          hotel.location.toLowerCase().includes('platis gialos') || 
          hotel.location.toLowerCase().includes('kamares') ||
          hotel.location.toLowerCase().includes('vathi'))) {
        score += 8;
      }
      
      // Add hotel rating to score
      score += hotel.rating;
      
      return {
        ...hotel,
        score
      };
    });
    
    // Sort hotels by score (descending)
    rankedHotels.sort((a, b) => b.score - a.score);
    
    // Take top 3 recommendations
    const topRecommendations = rankedHotels.slice(0, 3);
    
    // Generate AI response
    let aiResponse = `Based on your search for "${query}", I've found these top recommendations:\n\n`;
    
    topRecommendations.forEach((hotel, index) => {
      aiResponse += `${index + 1}. ${hotel.name} in ${hotel.location}\n`;
      aiResponse += `   Rating: ${hotel.rating}/5\n`;
      if (extractedParams.days) {
        // Calculate approximate total price based on daily rate and days
        const totalPrice = hotel.price * parseInt(extractedParams.days);
        aiResponse += `   Approximate price for ${extractedParams.days} days: €${totalPrice}\n`;
      } else {
        aiResponse += `   Price from: €${hotel.price} per night\n`;
      }
      aiResponse += `   Highlights: ${hotel.hotel_amenities.slice(0, 3).map(a => a.amenity).join(', ')}\n\n`;
    });
    
    if (topRecommendations.length === 0) {
      aiResponse = `I couldn't find any hotels matching your search for "${query}". Please try with different criteria.`;
    }
    
    // Return response
    return new Response(
      JSON.stringify({
        response: aiResponse,
        hotels: topRecommendations
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Failed to process request',
        details: error.message
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
