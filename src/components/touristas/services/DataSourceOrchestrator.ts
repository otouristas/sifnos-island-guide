import { QueryAnalysis, RoutingDecision, DataSource } from './IntelligentQueryRouter';
import { callTouristasAI, searchHotelsWithAvailability, getWebsiteContext } from './ChatService';
import { searchHotels } from '@/services/hotelSearch';
import { supabase } from '@/integrations/supabase/client';

export interface DataSourceResponse {
  source: DataSource;
  data: any;
  confidence: number;
  executionTime: number;
  success: boolean;
  error?: string;
}

export interface OrchestratedResponse {
  primaryResponse: string;
  hotels: any[];
  localContent: any[];
  metadata: {
    sources: DataSource[];
    confidence: number;
    executionTime: number;
    strategy: string;
  };
}

/**
 * World's Most Intelligent Data Source Orchestrator
 * Manages and executes queries across multiple specialized systems
 */
export class DataSourceOrchestrator {
  
  /**
   * Execute the routing strategy and return orchestrated results
   */
  public async executeStrategy(
    query: string,
    analysis: QueryAnalysis,
    strategy: RoutingDecision
  ): Promise<OrchestratedResponse> {
    const startTime = Date.now();
    
    console.log('🎯 Executing intelligent routing strategy:', {
      intent: analysis.intent,
      strategy: strategy.strategy,
      sources: strategy.sources.map(s => s.source)
    });

    let responses: DataSourceResponse[] = [];

    switch (strategy.strategy) {
      case 'single':
        responses = await this.executeSingle(query, analysis, strategy);
        break;
      case 'parallel':
        responses = await this.executeParallel(query, analysis, strategy);
        break;
      case 'sequential':
        responses = await this.executeSequential(query, analysis, strategy);
        break;
    }

    // Merge responses based on strategy
    const mergedResult = await this.mergeResponses(responses, strategy, analysis);
    
    const totalTime = Date.now() - startTime;
    
    return {
      ...mergedResult,
      metadata: {
        sources: responses.map(r => r.source),
        confidence: this.calculateOverallConfidence(responses, analysis),
        executionTime: totalTime,
        strategy: strategy.strategy
      }
    };
  }

  /**
   * Execute single source strategy (usually OpenRouter for general questions)
   */
  private async executeSingle(
    query: string,
    analysis: QueryAnalysis,
    strategy: RoutingDecision
  ): Promise<DataSourceResponse[]> {
    const source = strategy.sources[0];
    
    try {
      const response = await this.executeDataSource(source.source, query, analysis);
      return [response];
    } catch (error) {
      console.error('Single source execution failed:', error);
      return [{
        source: source.source,
        data: null,
        confidence: 0,
        executionTime: 0,
        success: false,
        error: error.message
      }];
    }
  }

  /**
   * Execute parallel strategy (for hybrid recommendations and real-time + local)
   */
  private async executeParallel(
    query: string,
    analysis: QueryAnalysis,
    strategy: RoutingDecision
  ): Promise<DataSourceResponse[]> {
    console.log('🚀 Executing parallel strategy with sources:', strategy.sources.map(s => s.source));
    
    const promises = strategy.sources.map(async (source) => {
      try {
        return await this.executeDataSource(source.source, query, analysis);
      } catch (error) {
        console.error(`Parallel execution failed for ${source.source}:`, error);
        return {
          source: source.source,
          data: null,
          confidence: 0,
          executionTime: 0,
          success: false,
          error: error.message
        };
      }
    });

    const results = await Promise.allSettled(promises);
    return results.map((result, index) => 
      result.status === 'fulfilled' 
        ? result.value 
        : {
            source: strategy.sources[index].source,
            data: null,
            confidence: 0,
            executionTime: 0,
            success: false,
            error: 'Promise rejected'
          }
    );
  }

  /**
   * Execute sequential strategy (for sponsored hotels + context)
   */
  private async executeSequential(
    query: string,
    analysis: QueryAnalysis,
    strategy: RoutingDecision
  ): Promise<DataSourceResponse[]> {
    const responses: DataSourceResponse[] = [];
    
    for (const source of strategy.sources) {
      try {
        const response = await this.executeDataSource(source.source, query, analysis);
        responses.push(response);
        
        // Use previous responses to enhance next queries
        if (response.success && response.data) {
          analysis = this.enhanceAnalysisWithPreviousData(analysis, response);
        }
      } catch (error) {
        console.error(`Sequential execution failed for ${source.source}:`, error);
        responses.push({
          source: source.source,
          data: null,
          confidence: 0,
          executionTime: 0,
          success: false,
          error: error.message
        });
      }
    }
    
    return responses;
  }

  /**
   * Execute specific data source
   */
  private async executeDataSource(
    source: DataSource,
    query: string,
    analysis: QueryAnalysis
  ): Promise<DataSourceResponse> {
    const startTime = Date.now();
    
    try {
      let data: any = null;
      
      switch (source) {
        case 'openrouter':
          data = await this.executeOpenRouter(query, analysis);
          break;
        case 'agoda':
          data = await this.executeAgodaAPI(query, analysis);
          break;
        case 'local_hotels':
          data = await this.executeLocalHotels(query, analysis);
          break;
        case 'local_content':
          data = await this.executeLocalContent(query, analysis);
          break;
        case 'hybrid':
          data = await this.executeHybrid(query, analysis);
          break;
      }
      
      return {
        source,
        data,
        confidence: data ? 0.9 : 0.1,
        executionTime: Date.now() - startTime,
        success: !!data
      };
    } catch (error) {
      return {
        source,
        data: null,
        confidence: 0,
        executionTime: Date.now() - startTime,
        success: false,
        error: error.message
      };
    }
  }

  /**
   * OpenRouter - General travel intelligence
   */
  private async executeOpenRouter(query: string, analysis: QueryAnalysis): Promise<any> {
    console.log('🤖 Executing OpenRouter for general travel intelligence...');
    
    const messages = [{
      role: 'user' as const,
      content: query,
      id: Date.now().toString()
    }];
    
    const preferences = {
      queryType: 'general_travel_info',
      confidence: analysis.confidence,
      intent: analysis.intent
    };
    
    const response = await callTouristasAI(messages, preferences, []);
    
    if (response) {
      // Convert stream to text for processing
      const reader = response.getReader();
      let fullText = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.choices?.[0]?.delta?.content) {
                fullText += parsed.choices[0].delta.content;
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
      
      return {
        type: 'ai_response',
        content: fullText,
        source: 'openrouter'
      };
    }
    
    return null;
  }

  /**
   * Agoda API - Real-time hotel availability and pricing
   */
  private async executeAgodaAPI(query: string, analysis: QueryAnalysis): Promise<any> {
    console.log('🏨 Executing Agoda API for real-time availability...');
    
    if (!analysis.dateRequested && !analysis.requiresRealTime) {
      return null;
    }
    
    const searchParams = {
      checkInDate: analysis.entities.dates?.[0] || this.getDefaultCheckIn(),
      checkOutDate: analysis.entities.dates?.[1] || this.getDefaultCheckOut(),
      numberOfAdults: 2,
      numberOfChildren: 0,
      location: analysis.entities.locations?.[0],
      amenities: analysis.entities.amenities?.join(',')
    };
    
    const hotels = await searchHotels(searchParams);
    
    return {
      type: 'hotel_results',
      hotels: hotels.filter(h => h.source === 'agoda'),
      searchParams,
      source: 'agoda'
    };
  }

  /**
   * Local Hotels Database - Sponsored and location-based properties
   */
  private async executeLocalHotels(query: string, analysis: QueryAnalysis): Promise<any> {
    console.log('🏛️ Executing local hotels database query...');
    
    let hotelQuery = supabase
      .from('hotels')
      .select(`
        *,
        hotel_amenities(amenity),
        hotel_photos(id, photo_url, is_main_photo),
        hotel_rooms(id, name, price, capacity)
      `)
      .eq('is_active', true);
    
    // Location filtering with improved search
    if (analysis.entities.locations && analysis.entities.locations.length > 0) {
      const location = analysis.entities.locations[0].toLowerCase();
      console.log('🎯 Filtering hotels by location:', location);
      
      // Direct location field matching - case insensitive
      hotelQuery = hotelQuery.ilike('location', `%${location}%`);
    }
    
    // Sponsored hotels priority, then by rating
    hotelQuery = hotelQuery
      .order('is_sponsored', { ascending: false })
      .order('rating', { ascending: false });
    
    const { data: hotels, error } = await hotelQuery;
    
    if (error) {
      console.error('❌ Local hotels query failed:', error);
      throw new Error(`Local hotels query failed: ${error.message}`);
    }
    
    console.log(`✅ Found ${hotels?.length || 0} local hotels`);
    
    // Transform hotels to include proper image URLs and amenities
    const transformedHotels = (hotels || []).map(hotel => {
      // Get main photo or first available photo
      const mainPhoto = hotel.hotel_photos?.find((p: any) => p.is_main_photo) || hotel.hotel_photos?.[0];
      const imageUrl = mainPhoto?.photo_url ? 
        (mainPhoto.photo_url.startsWith('http') ? mainPhoto.photo_url : `/uploads/hotels/${mainPhoto.photo_url}`) :
        '/placeholder.svg';
      
      // Extract amenities properly
      const amenities = hotel.hotel_amenities?.map((a: any) => a.amenity) || [];
      
      return {
        ...hotel,
        image_url: imageUrl,
        amenities: amenities,
        source: 'local',
        price_per_night: hotel.price || 0,
        // Ensure proper rating display
        rating: hotel.rating || 0,
        star_rating: Math.round(hotel.rating || 0)
      };
    });

    return {
      type: 'hotel_results',
      hotels: transformedHotels,
      source: 'local_hotels'
    };
  }

  /**
   * Local Content Database - Beaches, restaurants, activities
   */
  private async executeLocalContent(query: string, analysis: QueryAnalysis): Promise<any> {
    console.log('🏖️ Executing local content database query...');
    
    const contentTypes = this.determineContentTypes(query);
    const localContent: any[] = [];
    
    // Query beaches
    if (contentTypes.includes('beaches')) {
      const { data: beaches } = await supabase
        .from('beaches')
        .select('*')
        .eq('is_active', true)
        .order('popularity', { ascending: false });
      
      if (beaches) localContent.push(...beaches.map(b => ({ ...b, type: 'beach' })));
    }
    
    // Query restaurants/tavernas
    if (contentTypes.includes('restaurants')) {
      const { data: restaurants } = await supabase
        .from('restaurants')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false });
      
      if (restaurants) localContent.push(...restaurants.map(r => ({ ...r, type: 'restaurant' })));
    }
    
    // Query activities
    if (contentTypes.includes('activities')) {
      const { data: activities } = await supabase
        .from('activities')
        .select('*')
        .eq('is_active', true)
        .order('popularity', { ascending: false });
      
      if (activities) localContent.push(...activities.map(a => ({ ...a, type: 'activity' })));
    }
    
    return {
      type: 'local_content',
      content: localContent,
      contentTypes,
      source: 'local_content'
    };
  }

  /**
   * Hybrid execution - Combines multiple sources intelligently
   */
  private async executeHybrid(query: string, analysis: QueryAnalysis): Promise<any> {
    console.log('🌟 Executing hybrid multi-source strategy...');
    
    // This is handled by the parallel strategy above
    // Return null here as hybrid is managed at the strategy level
    return null;
  }

  /**
   * Merge responses based on the merging strategy
   */
  private async mergeResponses(
    responses: DataSourceResponse[],
    strategy: RoutingDecision,
    analysis: QueryAnalysis
  ): Promise<Omit<OrchestratedResponse, 'metadata'>> {
    
    const successfulResponses = responses.filter(r => r.success);
    
    if (successfulResponses.length === 0) {
      return {
        primaryResponse: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
        hotels: [],
        localContent: []
      };
    }
    
    switch (strategy.mergingStrategy) {
      case 'prioritize':
        return this.prioritizeMerge(successfulResponses, analysis);
      case 'combine':
        return this.combineMerge(successfulResponses, analysis);
      case 'overlay':
        return this.overlayMerge(successfulResponses, analysis);
      default:
        return this.prioritizeMerge(successfulResponses, analysis);
    }
  }

  private prioritizeMerge(responses: DataSourceResponse[], analysis: QueryAnalysis) {
    const primaryResponse = responses[0];
    
    return {
      primaryResponse: primaryResponse.data?.content || 'Response processed successfully.',
      hotels: this.extractHotels(responses),
      localContent: this.extractLocalContent(responses)
    };
  }

  private combineMerge(responses: DataSourceResponse[], analysis: QueryAnalysis) {
    const hotels = this.extractHotels(responses);
    const localContent = this.extractLocalContent(responses);
    
    // Create intelligent combined response
    const aiResponse = responses.find(r => r.data?.type === 'ai_response');
    const primaryResponse = aiResponse?.data?.content || this.generateCombinedResponse(hotels, localContent, analysis);
    
    return {
      primaryResponse,
      hotels,
      localContent
    };
  }

  private overlayMerge(responses: DataSourceResponse[], analysis: QueryAnalysis) {
    // Start with primary response and overlay additional data
    const hotels = this.extractHotels(responses);
    const localContent = this.extractLocalContent(responses);
    
    const aiResponse = responses.find(r => r.data?.type === 'ai_response');
    let primaryResponse = aiResponse?.data?.content || '';
    
    // Overlay local data context
    if (hotels.length > 0 || localContent.length > 0) {
      primaryResponse = this.enhanceResponseWithLocalData(primaryResponse, hotels, localContent, analysis);
    }
    
    return {
      primaryResponse,
      hotels,
      localContent
    };
  }

  private extractHotels(responses: DataSourceResponse[]): any[] {
    const allHotels: any[] = [];
    
    responses.forEach(response => {
      if (response.data?.type === 'hotel_results' && response.data.hotels) {
        allHotels.push(...response.data.hotels);
      }
    });
    
    // Remove duplicates and prioritize sources
    const uniqueHotels = this.deduplicateHotels(allHotels);
    return uniqueHotels.slice(0, 12); // Limit to 12 hotels
  }

  private extractLocalContent(responses: DataSourceResponse[]): any[] {
    const allContent: any[] = [];
    
    responses.forEach(response => {
      if (response.data?.type === 'local_content' && response.data.content) {
        allContent.push(...response.data.content);
      }
    });
    
    return allContent.slice(0, 8); // Limit to 8 content items
  }

  private generateCombinedResponse(hotels: any[], localContent: any[], analysis: QueryAnalysis): string {
    let response = "Based on your query, I've found some excellent options for you!\n\n";
    
    if (hotels.length > 0) {
      response += `🏨 I found ${hotels.length} great accommodation options with real-time availability and pricing.\n\n`;
    }
    
    if (localContent.length > 0) {
      response += `🌊 I also have insider information about ${localContent.length} local attractions and activities.\n\n`;
    }
    
    response += "Here are the available hotels for your dates:";
    
    return response;
  }

  private enhanceResponseWithLocalData(
    aiResponse: string, 
    hotels: any[], 
    localContent: any[], 
    analysis: QueryAnalysis
  ): string {
    if (!aiResponse) return this.generateCombinedResponse(hotels, localContent, analysis);
    
    // If AI response doesn't mention hotels but we have them, add trigger phrase
    if (hotels.length > 0 && !aiResponse.includes('Here are the available hotels')) {
      aiResponse += "\n\nHere are the available hotels for your dates:";
    }
    
    return aiResponse;
  }

  private deduplicateHotels(hotels: any[]): any[] {
    const seen = new Set();
    return hotels.filter(hotel => {
      const key = hotel.name?.toLowerCase() || hotel.id;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private calculateOverallConfidence(responses: DataSourceResponse[], analysis: QueryAnalysis): number {
    const successfulResponses = responses.filter(r => r.success);
    if (successfulResponses.length === 0) return 0;
    
    const avgConfidence = successfulResponses.reduce((sum, r) => sum + r.confidence, 0) / successfulResponses.length;
    return Math.min(avgConfidence * analysis.confidence, 1.0);
  }

  private enhanceAnalysisWithPreviousData(analysis: QueryAnalysis, response: DataSourceResponse): QueryAnalysis {
    // Enhance analysis based on previous response data
    return {
      ...analysis,
      confidence: Math.min(analysis.confidence + 0.1, 1.0)
    };
  }

  private determineContentTypes(query: string): string[] {
    const types: string[] = [];
    
    if (query.includes('beach') || query.includes('swimming')) types.push('beaches');
    if (query.includes('restaurant') || query.includes('taverna') || query.includes('food')) types.push('restaurants');
    if (query.includes('activity') || query.includes('things to do') || query.includes('visit')) types.push('activities');
    
    // Default to all types if none specified
    if (types.length === 0) types.push('beaches', 'restaurants', 'activities');
    
    return types;
  }

  private getDefaultCheckIn(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  private getDefaultCheckOut(): string {
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 3);
    return dayAfter.toISOString().split('T')[0];
  }
}

export const dataOrchestrator = new DataSourceOrchestrator(); 