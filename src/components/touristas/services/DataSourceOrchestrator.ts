
import { supabase } from '@/integrations/supabase/client';

export interface QueryIntent {
  type: 'accommodation' | 'activity' | 'dining' | 'general';
  confidence: number;
  requiresRealTime: boolean;
  location?: string;
  dateRange?: {
    checkIn: string;
    checkOut: string;
  };
}

export interface DataSourceResult {
  source: string;
  data: any[];
  metadata: {
    totalResults: number;
    searchTime: number;
    confidence: number;
  };
}

export class DataSourceOrchestrator {
  private static instance: DataSourceOrchestrator;
  
  public static getInstance(): DataSourceOrchestrator {
    if (!DataSourceOrchestrator.instance) {
      DataSourceOrchestrator.instance = new DataSourceOrchestrator();
    }
    return DataSourceOrchestrator.instance;
  }

  // Hotel data from local Supabase
  async getLocalHotels(location?: string, filters?: any): Promise<DataSourceResult> {
    const startTime = Date.now();
    
    try {
      const now = new Date().toISOString();
      
      // First, get featured hotels (prioritized)
      let featuredQuery = supabase
        .from('hotels')
        .select(`
          *,
          hotel_amenities(amenity),
          hotel_photos(id, photo_url, is_main_photo),
          hotel_rooms(id, name, price, capacity),
          hotel_reviews(rating, comment, reviewer_name)
        `)
        .eq('is_featured', true)
        .order('featured_priority', { ascending: false })
        .order('rating', { ascending: false });

      if (location) {
        featuredQuery = featuredQuery.ilike('location', `%${location}%`);
      }

      const { data: featuredHotels, error: featuredError } = await featuredQuery.limit(10);
      
      // Filter featured hotels by date range
      const nowDate = new Date(now);
      const validFeaturedHotels = (featuredHotels || []).filter(hotel => {
        const startDate = hotel.featured_start_date ? new Date(hotel.featured_start_date) : null;
        const endDate = hotel.featured_end_date ? new Date(hotel.featured_end_date) : null;
        const validStart = !startDate || startDate <= nowDate;
        const validEnd = !endDate || endDate >= nowDate;
        return validStart && validEnd;
      });

      // Then get regular hotels (non-featured)
      let regularQuery = supabase
        .from('hotels')
        .select(`
          *,
          hotel_amenities(amenity),
          hotel_photos(id, photo_url, is_main_photo),
          hotel_rooms(id, name, price, capacity),
          hotel_reviews(rating, comment, reviewer_name)
        `)
        .eq('is_featured', false)
        .order('rating', { ascending: false });

      if (location) {
        regularQuery = regularQuery.ilike('location', `%${location}%`);
      }

      const { data: regularHotels, error: regularError } = await regularQuery.limit(20);
      
      // Combine: featured first, then regular
      const hotels = [...validFeaturedHotels, ...(regularHotels || [])];
      const error = featuredError || regularError;

      if (error) {
        console.error('Error fetching local hotels:', error);
        return {
          source: 'local_hotels',
          data: [],
          metadata: {
            totalResults: 0,
            searchTime: Date.now() - startTime,
            confidence: 0
          }
        };
      }

      return {
        source: 'local_hotels',
        data: hotels || [],
        metadata: {
          totalResults: hotels?.length || 0,
          searchTime: Date.now() - startTime,
          confidence: 0.9
        }
      };

    } catch (error) {
      console.error('Error in getLocalHotels:', error);
      return {
        source: 'local_hotels',
        data: [],
        metadata: {
          totalResults: 0,
          searchTime: Date.now() - startTime,
          confidence: 0
        }
      };
    }
  }

  // Agoda real-time data
  async getAgodaHotels(searchParams: any): Promise<DataSourceResult> {
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase.functions.invoke('agoda-search', {
        body: searchParams
      });

      if (error) {
        console.error('Error fetching Agoda hotels:', error);
        return {
          source: 'agoda',
          data: [],
          metadata: {
            totalResults: 0,
            searchTime: Date.now() - startTime,
            confidence: 0
          }
        };
      }

      return {
        source: 'agoda',
        data: data?.results || [],
        metadata: {
          totalResults: data?.results?.length || 0,
          searchTime: Date.now() - startTime,
          confidence: 0.8
        }
      };

    } catch (error) {
      console.error('Error in getAgodaHotels:', error);
      return {
        source: 'agoda',
        data: [],
        metadata: {
          totalResults: 0,
          searchTime: Date.now() - startTime,
          confidence: 0
        }
      };
    }
  }

  // Intelligent query routing
  async orchestrateQuery(
    query: string,
    intent: QueryIntent,
    userPreferences: Record<string, any>
  ): Promise<{
    results: DataSourceResult[];
    recommendation: string;
    confidence: number;
  }> {
    const results: DataSourceResult[] = [];
    
    // Route based on intent
    switch (intent.type) {
      case 'accommodation':
        // Get local hotels first
        const localHotels = await this.getLocalHotels(intent.location);
        results.push(localHotels);
        
        // If dates provided, also get Agoda data
        if (intent.requiresRealTime && intent.dateRange) {
          const agodaHotels = await this.getAgodaHotels({
            checkInDate: intent.dateRange.checkIn,
            checkOutDate: intent.dateRange.checkOut,
            numberOfAdults: userPreferences.adults || 2,
            numberOfChildren: userPreferences.children || 0
          });
          results.push(agodaHotels);
        }
        break;
        
      case 'general':
        // For general queries, we'll rely on OpenRouter through the chat service
        break;
        
      default:
        // Fallback to local content
        const fallbackHotels = await this.getLocalHotels();
        results.push(fallbackHotels);
    }

    // Calculate overall confidence
    const totalResults = results.reduce((sum, result) => sum + result.metadata.totalResults, 0);
    const avgConfidence = results.length > 0 
      ? results.reduce((sum, result) => sum + result.metadata.confidence, 0) / results.length 
      : 0;

    return {
      results,
      recommendation: this.generateRecommendation(results, intent),
      confidence: avgConfidence
    };
  }

  private generateRecommendation(results: DataSourceResult[], intent: QueryIntent): string {
    const totalResults = results.reduce((sum, result) => sum + result.metadata.totalResults, 0);
    
    if (totalResults === 0) {
      return "I didn't find specific results for your query, but I can provide general travel information about Sifnos.";
    }

    const localResults = results.find(r => r.source === 'local_hotels');
    const agodaResults = results.find(r => r.source === 'agoda');

    if (localResults && agodaResults) {
      return `I found ${localResults.metadata.totalResults} local hotels and ${agodaResults.metadata.totalResults} hotels with real-time availability. I'll show you both options with local insights and live pricing.`;
    } else if (localResults) {
      return `I found ${localResults.metadata.totalResults} local hotels in Sifnos. These are authentic accommodations with local expertise and personalized service.`;
    } else if (agodaResults) {
      return `I found ${agodaResults.metadata.totalResults} hotels with real-time availability and pricing for your dates.`;
    }

    return `I found ${totalResults} results that match your query.`;
  }

  // Helper method to analyze query intent
  analyzeQueryIntent(query: string, userContext?: any): QueryIntent {
    const queryLower = query.toLowerCase();
    
    // Check for accommodation keywords
    const accommodationKeywords = ['hotel', 'stay', 'accommodation', 'room', 'villa', 'book'];
    const hasAccommodationKeywords = accommodationKeywords.some(keyword => queryLower.includes(keyword));
    
    // Check for real-time requirements (dates)
    const dateKeywords = ['available', 'book', 'reserve', 'next week', 'weekend', 'dates'];
    const requiresRealTime = dateKeywords.some(keyword => queryLower.includes(keyword));
    
    // Extract location
    const locations = ['kamares', 'apollonia', 'platis gialos', 'kastro', 'faros', 'vathi', 'artemonas'];
    const location = locations.find(loc => queryLower.includes(loc));
    
    let type: QueryIntent['type'] = 'general';
    let confidence = 0.5;
    
    if (hasAccommodationKeywords) {
      type = 'accommodation';
      confidence = 0.8;
    }
    
    return {
      type,
      confidence,
      requiresRealTime,
      location
    };
  }
}

// Export singleton instance
export const dataOrchestrator = DataSourceOrchestrator.getInstance();
