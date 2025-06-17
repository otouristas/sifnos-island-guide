
import { supabase } from '@/integrations/supabase/client';

export interface UnifiedHotel {
  id: string;
  name: string;
  location?: string;
  description?: string;
  rating: number;
  price: number;
  source: 'local' | 'agoda';
  
  // Local hotel fields
  hotel_types?: string[];
  hotel_photos?: {
    id: string;
    photo_url: string;
    is_main_photo?: boolean;
  }[];
  hotel_amenities?: {
    amenity: string;
  }[];
  hotel_rooms?: {
    id: string;
    name: string;
    price: number;
    capacity: number;
  }[];
  
  // Agoda hotel fields
  agoda_hotel_id?: number;
  star_rating?: number;
  review_score?: number;
  review_count?: number;
  daily_rate?: number;
  crossed_out_rate?: number;
  discount_percentage?: number;
  currency?: string;
  image_url?: string;
  landing_url?: string;
  include_breakfast?: boolean;
  free_wifi?: boolean;
}

export interface SearchParams {
  checkInDate?: string;
  checkOutDate?: string;
  numberOfAdults?: number;
  numberOfChildren?: number;
  location?: string;
  amenities?: string;
  hotelName?: string;
}

export async function searchUnifiedHotels(params: SearchParams): Promise<UnifiedHotel[]> {
  const results: UnifiedHotel[] = [];

  // Search local hotels
  try {
    let query = supabase
      .from('hotels')
      .select(`
        *,
        hotel_amenities(amenity),
        hotel_photos(id, photo_url, is_main_photo),
        hotel_rooms(id, name, price, capacity)
      `);

    // Apply location filter if provided
    if (params.location) {
      query = query.ilike('location', `%${params.location}%`);
    }

    // Apply hotel name filter if provided
    if (params.hotelName) {
      query = query.ilike('name', `%${params.hotelName}%`);
    }

    const { data: localHotels, error: localError } = await query;
    
    if (localError) {
      console.error('Error fetching local hotels:', localError);
    } else if (localHotels) {
      const mappedLocalHotels: UnifiedHotel[] = localHotels.map(hotel => ({
        id: hotel.id,
        name: hotel.name,
        location: hotel.location,
        description: hotel.description,
        rating: hotel.rating,
        price: hotel.price,
        source: 'local' as const,
        hotel_types: hotel.hotel_types,
        hotel_photos: hotel.hotel_photos,
        hotel_amenities: hotel.hotel_amenities,
        hotel_rooms: hotel.hotel_rooms
      }));
      
      results.push(...mappedLocalHotels);
    }
  } catch (error) {
    console.error('Error in local hotel search:', error);
  }

  // Search Agoda hotels if dates are provided
  if (params.checkInDate && params.checkOutDate) {
    try {
      const { data: agodaResponse, error: agodaError } = await supabase.functions.invoke('agoda-search', {
        body: {
          checkInDate: params.checkInDate,
          checkOutDate: params.checkOutDate,
          numberOfAdults: params.numberOfAdults || 2,
          numberOfChildren: params.numberOfChildren || 0
        }
      });

      if (agodaError) {
        console.error('Error calling Agoda function:', agodaError);
      } else if (agodaResponse?.results) {
        const mappedAgodaHotels: UnifiedHotel[] = agodaResponse.results.map((hotel: any) => ({
          id: `agoda-${hotel.agoda_hotel_id || hotel.hotelId}`,
          name: hotel.name || hotel.hotelName,
          rating: hotel.review_score || hotel.reviewScore || 0,
          price: hotel.daily_rate || hotel.dailyRate || 0,
          source: 'agoda' as const,
          agoda_hotel_id: hotel.agoda_hotel_id || hotel.hotelId,
          star_rating: hotel.star_rating || hotel.starRating,
          review_score: hotel.review_score || hotel.reviewScore,
          review_count: hotel.review_count || hotel.reviewCount,
          daily_rate: hotel.daily_rate || hotel.dailyRate,
          crossed_out_rate: hotel.crossed_out_rate || hotel.crossedOutRate,
          discount_percentage: hotel.discount_percentage || hotel.discountPercentage,
          currency: hotel.currency,
          image_url: hotel.image_url || hotel.imageURL,
          landing_url: hotel.landing_url || hotel.landingURL,
          include_breakfast: hotel.include_breakfast || hotel.includeBreakfast,
          free_wifi: hotel.free_wifi || hotel.freeWifi
        }));
        
        results.push(...mappedAgodaHotels);
      }
    } catch (error) {
      console.error('Error in Agoda hotel search:', error);
    }
  }

  return results;
}
