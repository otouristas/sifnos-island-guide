import { supabase } from '@/integrations/supabase/client';

export interface UnifiedHotel {
  id: string;
  name: string;
  location?: string;
  description?: string;
  rating: number;
  price: number;
  source: 'local' | 'agoda';
  
  // Common required fields for both types
  price_per_night: number;
  amenities: string[];
  image_url: string;
  
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

export interface Hotel {
  id: number;
  name: string;
  location: string;
  price: number; // Keep as 'price' to match database
  rating: number;
  image_url: string;
  amenities: string[];
  description: string;
  source: 'local' | 'agoda';
  
  // Optional Agoda-specific fields
  agoda_hotel_id?: number;
  agoda_data?: any;
  star_rating?: number;
  review_score?: number;
  review_count?: number;
  daily_rate?: number;
  currency?: string;
  landing_url?: string;
  
  // Optional local hotel fields
  hotel_types?: string[];
  hotel_photos?: any[];
  hotel_amenities?: any[];
  hotel_rooms?: any[];
  
  // Optional match information for enhanced display
  matchInfo?: {
    matchedWith?: string;
    confidence?: number;
    similarity?: number;
  };
}

export interface AgodaHotel {
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
  latitude?: number;
  longitude?: number;
}

const validateDates = (checkInDate: string, checkOutDate: string): boolean => {
  const today = new Date().toISOString().split('T')[0];
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  if (checkInDate < today) {
    throw new Error('Check-in date cannot be in the past');
  }

  if (checkOutDate <= checkInDate) {
    throw new Error('Check-out date must be after check-in date');
  }

  // Check if stay is too long (more than 30 days)
  const diffTime = checkOut.getTime() - checkIn.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays > 30) {
    throw new Error('Maximum stay is 30 days');
  }

  return true;
};

const convertAgodaToHotel = (agodaHotel: AgodaHotel): Hotel => {
  const amenities = [];
  if (agodaHotel.freeWifi) amenities.push('Free WiFi');
  if (agodaHotel.includeBreakfast) amenities.push('Breakfast Included');
  if (agodaHotel.discountPercentage > 0) amenities.push(`${agodaHotel.discountPercentage}% Discount`);

  return {
    id: agodaHotel.hotelId,
    name: agodaHotel.hotelName,
    location: 'Sifnos, Greece',
    price_per_night: agodaHotel.dailyRate,
    rating: agodaHotel.reviewScore,
    image_url: agodaHotel.imageURL,
    amenities,
    star_rating: agodaHotel.starRating,
    review_score: agodaHotel.reviewScore,
    review_count: agodaHotel.reviewCount,
    agoda_hotel_id: agodaHotel.hotelId,
    source: 'agoda',
    agoda_data: agodaHotel,
    daily_rate: agodaHotel.dailyRate,
    currency: agodaHotel.currency,
    landing_url: agodaHotel.landingURL
  };
};

const searchAgodaHotels = async (params: SearchParams): Promise<Hotel[]> => {
  try {
    console.log('Searching Agoda hotels with params:', params);

    // Validate dates
    if (params.checkInDate && params.checkOutDate) {
      validateDates(params.checkInDate, params.checkOutDate);
    }

    // Check if proxy server is available, fallback to Supabase function
    let response;
    let useProxy = false;

    try {
      // Try proxy server first
      const proxyResponse = await fetch('http://localhost:3001/api/agoda-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checkInDate: params.checkInDate,
          checkOutDate: params.checkOutDate,
          numberOfAdults: params.numberOfAdults || 2,
          numberOfChildren: params.numberOfChildren || 0
        })
      });

      if (proxyResponse.ok) {
        response = await proxyResponse.json();
        useProxy = true;
        console.log('Using proxy server for Agoda search');
      }
    } catch (proxyError) {
      console.log('Proxy server not available, trying Supabase function...');
    }

    // Fallback to Supabase function if proxy not available
    if (!useProxy) {
      const { data, error } = await supabase.functions.invoke('agoda-search', {
        body: {
          checkInDate: params.checkInDate,
          checkOutDate: params.checkOutDate,
          numberOfAdults: params.numberOfAdults || 2,
          numberOfChildren: params.numberOfChildren || 0
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        return [];
      }

      response = data;
    }

    if (!response || !response.results) {
      console.log('No Agoda results found');
      return [];
    }

    console.log(`Found ${response.results.length} Agoda hotels`);
    return response.results.map(convertAgodaToHotel);

  } catch (error) {
    console.error('Error searching Agoda hotels:', error);
    return [];
  }
};

const searchLocalHotels = async (params: SearchParams): Promise<Hotel[]> => {
  try {
    console.log('Searching local hotels with params:', params);
    
    let query = supabase
      .from('hotels')
      .select(`
        *,
        hotel_amenities(amenity),
        hotel_photos(id, photo_url, is_main_photo),
        hotel_rooms(id, name, price, capacity),
        hotel_reviews(rating, comment, reviewer_name)
      `)
      .eq('source', 'local');

    if (params.location) {
      const normalizedLocation = params.location.toLowerCase();
      query = query.ilike('location', `%${normalizedLocation}%`);
      console.log('Filtering by location:', normalizedLocation);
    }

    const { data: hotels, error } = await query.order('rating', { ascending: false });

    if (error) {
      console.error('Error fetching local hotels:', error);
      return [];
    }

    const localHotels: Hotel[] = (hotels || []).map(hotel => {
      // Get main photo or first photo
      const mainPhoto = hotel.hotel_photos?.find((p: any) => p.is_main_photo) || hotel.hotel_photos?.[0];
      const imageUrl = mainPhoto?.photo_url ? 
        (mainPhoto.photo_url.startsWith('http') ? mainPhoto.photo_url : `/uploads/hotels/${mainPhoto.photo_url}`) :
        '/placeholder.svg';

      // Extract amenities with enhanced processing
      const amenities = hotel.hotel_amenities?.map((a: any) => a.amenity) || [];

      // Calculate average rating from reviews if available
      const reviewRating = hotel.hotel_reviews?.length > 0 
        ? hotel.hotel_reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / hotel.hotel_reviews.length
        : hotel.rating || 0;

      const localHotel: Hotel = {
        id: parseInt(hotel.id) || 0,
        name: hotel.name,
        location: hotel.location,
        price: 0, // Local hotels don't show prices
        rating: reviewRating,
        image_url: imageUrl,
        amenities: amenities,
        description: hotel.description || '',
        source: 'local',
        // Enhanced local hotel data
        hotel_types: hotel.hotel_types || [],
        hotel_photos: hotel.hotel_photos || [],
        hotel_amenities: hotel.hotel_amenities || [],
        hotel_rooms: hotel.hotel_rooms || [],
        star_rating: hotel.rating || Math.round(reviewRating),
        review_count: hotel.hotel_reviews?.length || 0,
        review_score: reviewRating
      };

      return localHotel;
    });

    console.log(`Found ${localHotels.length} local hotels with enhanced data`);
    return localHotels;

  } catch (error) {
    console.error('Error searching local hotels:', error);
    return [];
  }
};

export const searchHotels = async (params: SearchParams = {}): Promise<Hotel[]> => {
  try {
    console.log('Unified hotel search with params:', params);

    // Search both local and Agoda hotels in parallel
    const [localHotels, agodaHotels] = await Promise.all([
      searchLocalHotels(params),
      params.checkInDate && params.checkOutDate ? searchAgodaHotels(params) : Promise.resolve([])
    ]);

    // Combine results with proper prioritization
    // Local hotels first (they show local expertise), then Agoda hotels
    const allHotels = [...localHotels, ...agodaHotels];
    
    // Enhanced sorting: Local hotels by rating, Agoda hotels by rating
    const sortedLocalHotels = localHotels.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    const sortedAgodaHotels = agodaHotels.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    
    const finalResults = [...sortedLocalHotels, ...sortedAgodaHotels];

    console.log(`Total hotels found: ${finalResults.length} (${localHotels.length} local, ${agodaHotels.length} Agoda)`);
    console.log('Local hotels data richness:', localHotels.map(h => ({
      name: h.name,
      amenities: h.amenities?.length || 0,
      photos: h.hotel_photos?.length || 0,
      rooms: h.hotel_rooms?.length || 0
    })));
    
    return finalResults;

  } catch (error) {
    console.error('Error in unified hotel search:', error);
    return [];
  }
};
