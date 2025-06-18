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

export interface Hotel {
  id: number;
  name: string;
  location: string;
  price_per_night: number;
  rating: number;
  image_url: string;
  amenities: string[];
  description?: string;
  star_rating?: number;
  review_score?: number;
  review_count?: number;
  agoda_hotel_id?: number;
  source: 'local' | 'agoda';
  agoda_data?: any;
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
    agoda_data: agodaHotel
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
        hotel_rooms(id, name, price, capacity)
      `)
      .eq('is_active', true);

    if (params.location) {
      // Make the location search case-insensitive and handle partial matches
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

      // Extract amenities
      const amenities = hotel.hotel_amenities?.map((a: any) => a.amenity) || [];

      const localHotel: Hotel = {
        id: parseInt(hotel.id) || 0,
        name: hotel.name,
        location: hotel.location,
        price_per_night: hotel.price || 0,
        rating: hotel.rating || 0,
        image_url: imageUrl,
        amenities: amenities,
        description: hotel.description || '',
        source: 'local'
      };

      return localHotel;
    });

    console.log(`Found ${localHotels.length} local hotels`);
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

    // Combine and sort results
    const allHotels = [...localHotels, ...agodaHotels];
    
    // Sort by rating (highest first)
    allHotels.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    console.log(`Total hotels found: ${allHotels.length} (${localHotels.length} local, ${agodaHotels.length} Agoda)`);
    
    return allHotels;

  } catch (error) {
    console.error('Error in unified hotel search:', error);
    // Return empty array on error rather than throwing
    return [];
  }
};
