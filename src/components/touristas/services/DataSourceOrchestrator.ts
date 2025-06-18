
import { supabase } from '@/integrations/supabase/client';
import { Hotel } from '@/services/hotelSearch';

export interface QueryIntent {
  type: 'hotel_search' | 'location_info' | 'general_info' | 'booking_help';
  confidence: number;
  entities: {
    location?: string;
    dates?: { checkIn?: string; checkOut?: string };
    preferences?: string[];
    budget?: string;
  };
}

export interface DataSource {
  name: string;
  type: 'local_hotels' | 'agoda_api' | 'local_content' | 'general_knowledge';
  priority: number;
  capabilities: string[];
}

export class DataSourceOrchestrator {
  private dataSources: DataSource[] = [
    {
      name: 'Local Hotels Database',
      type: 'local_hotels',
      priority: 1,
      capabilities: ['hotel_search', 'local_recommendations', 'detailed_info']
    },
    {
      name: 'Agoda API',
      type: 'agoda_api', 
      priority: 2,
      capabilities: ['live_pricing', 'availability', 'booking']
    },
    {
      name: 'Local Content',
      type: 'local_content',
      priority: 3,
      capabilities: ['location_info', 'travel_tips', 'cultural_info']
    },
    {
      name: 'General Knowledge',
      type: 'general_knowledge',
      priority: 4,
      capabilities: ['general_questions', 'basic_info']
    }
  ];

  analyzeQuery(query: string): QueryIntent {
    const lowerQuery = query.toLowerCase();
    
    // Hotel search detection
    const hotelKeywords = ['hotel', 'accommodation', 'stay', 'room', 'booking'];
    const hasHotelKeywords = hotelKeywords.some(keyword => lowerQuery.includes(keyword));
    
    // Location detection
    const locations = ['platis gialos', 'apollonia', 'kamares', 'kastro', 'artemonas', 'vathi', 'faros', 'chrysopigi'];
    const detectedLocation = locations.find(loc => lowerQuery.includes(loc));
    
    // Date detection (simple pattern)
    const datePattern = /\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4}/g;
    const dates = query.match(datePattern);
    
    if (hasHotelKeywords) {
      return {
        type: 'hotel_search',
        confidence: 0.9,
        entities: {
          location: detectedLocation,
          dates: dates ? { checkIn: dates[0], checkOut: dates[1] } : undefined,
          preferences: this.extractPreferences(query)
        }
      };
    }
    
    if (detectedLocation) {
      return {
        type: 'location_info',
        confidence: 0.8,
        entities: { location: detectedLocation }
      };
    }
    
    return {
      type: 'general_info',
      confidence: 0.6,
      entities: {}
    };
  }

  private extractPreferences(query: string): string[] {
    const preferences: string[] = [];
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('luxury') || lowerQuery.includes('premium')) preferences.push('luxury');
    if (lowerQuery.includes('budget') || lowerQuery.includes('cheap')) preferences.push('budget');
    if (lowerQuery.includes('family')) preferences.push('family');
    if (lowerQuery.includes('romantic') || lowerQuery.includes('couple')) preferences.push('romantic');
    if (lowerQuery.includes('pool')) preferences.push('pool');
    if (lowerQuery.includes('beach')) preferences.push('beach');
    if (lowerQuery.includes('wifi')) preferences.push('wifi');
    if (lowerQuery.includes('breakfast')) preferences.push('breakfast');
    
    return preferences;
  }

  async orchestrateDataSources(intent: QueryIntent): Promise<{
    hotels?: Hotel[];
    localContent?: any;
    agodaData?: any;
    recommendations?: string[];
  }> {
    const results: any = {};
    
    try {
      if (intent.type === 'hotel_search') {
        // Get local hotels first
        const localHotels = await this.getLocalHotels(intent);
        if (localHotels.length > 0) {
          results.hotels = localHotels;
        }
        
        // Add Agoda data if dates are provided
        if (intent.entities.dates?.checkIn && intent.entities.dates?.checkOut) {
          // Note: Agoda integration would go here
          console.log('Would fetch Agoda data for dates:', intent.entities.dates);
        }
      }
      
      if (intent.type === 'location_info') {
        const locationContent = await this.getLocationInfo(intent.entities.location!);
        results.localContent = locationContent;
      }
      
    } catch (error) {
      console.error('Error orchestrating data sources:', error);
    }
    
    return results;
  }

  private async getLocalHotels(intent: QueryIntent): Promise<Hotel[]> {
    try {
      let query = supabase
        .from('hotels')
        .select(`
          *,
          hotel_amenities(amenity),
          hotel_photos(id, photo_url, is_main_photo),
          hotel_rooms(id, name, price, capacity)
        `)
        .eq('source', 'local');

      if (intent.entities.location) {
        query = query.ilike('location', `%${intent.entities.location}%`);
      }

      const { data: hotels, error } = await query.order('rating', { ascending: false });

      if (error) {
        console.error('Error fetching local hotels:', error);
        return [];
      }

      return (hotels || []).map(hotel => ({
        id: parseInt(hotel.id) || 0,
        name: hotel.name,
        location: hotel.location,
        price_per_night: 0, // Local hotels don't show prices
        rating: hotel.rating || 0,
        image_url: hotel.hotel_photos?.[0]?.photo_url ? 
          (hotel.hotel_photos[0].photo_url.startsWith('http') ? 
            hotel.hotel_photos[0].photo_url : 
            `/uploads/hotels/${hotel.hotel_photos[0].photo_url}`) :
          '/placeholder.svg',
        amenities: hotel.hotel_amenities?.map((a: any) => a.amenity) || [],
        description: hotel.description || '',
        source: 'local' as const,
        hotel_types: hotel.hotel_types || [],
        hotel_photos: hotel.hotel_photos || [],
        hotel_amenities: hotel.hotel_amenities || [],
        hotel_rooms: hotel.hotel_rooms || []
      }));

    } catch (error) {
      console.error('Error in getLocalHotels:', error);
      return [];
    }
  }

  private async getLocationInfo(location: string): Promise<any> {
    // For now, return basic location info
    // In the future, this could query a locations/content table
    return {
      name: location,
      description: `Information about ${location} in Sifnos`,
      tips: [`Visit ${location} for a unique Cycladic experience`]
    };
  }

  selectOptimalSources(intent: QueryIntent): DataSource[] {
    const relevantSources = this.dataSources.filter(source => {
      switch (intent.type) {
        case 'hotel_search':
          return ['local_hotels', 'agoda_api'].includes(source.type);
        case 'location_info':
          return ['local_content', 'general_knowledge'].includes(source.type);
        default:
          return ['general_knowledge'].includes(source.type);
      }
    });
    
    return relevantSources.sort((a, b) => a.priority - b.priority);
  }

  async generateContextualPrompt(intent: QueryIntent, availableData: any): Promise<string> {
    const context = {
      queryType: intent.type,
      confidence: intent.confidence.toString(), // Convert to string
      intent: intent
    };

    let prompt = `You are Touristas AI, a specialized Sifnos travel assistant. `;
    
    switch (intent.type) {
      case 'hotel_search':
        prompt += `The user is looking for accommodation. `;
        if (availableData.hotels?.length > 0) {
          prompt += `I have found ${availableData.hotels.length} local hotels that match their criteria. `;
          prompt += `Focus on the unique features and local expertise these hotels offer. `;
          prompt += `Remember: local hotels in Sifnos offer personalized service and authentic experiences, though prices are available on request.`;
        }
        break;
        
      case 'location_info':
        prompt += `The user wants information about ${intent.entities.location}. `;
        prompt += `Provide detailed local insights, cultural information, and practical tips.`;
        break;
        
      default:
        prompt += `Answer the user's general question about Sifnos travel with helpful and accurate information.`;
    }
    
    return prompt;
  }
}

export const dataSourceOrchestrator = new DataSourceOrchestrator();
