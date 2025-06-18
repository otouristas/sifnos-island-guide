export type QueryIntent = 
  | 'general_travel_info'     // OpenRouter: "What's the weather like?" "Tell me about Greek culture"
  | 'real_time_availability'   // Agoda API: "Hotels for next weekend" "Available hotels with pools"
  | 'local_sponsored_hotels'   // Local DB: "Hotels in Kamares" "Show me Villa Olivia"
  | 'location_guide'          // Local DB: "Best beaches" "Things to do in Apollonia"
  | 'hybrid_recommendation';   // Combined: "Plan my 3-day trip" "Best hotels near beaches"

export type DataSource = 
  | 'openrouter'
  | 'agoda'
  | 'local_hotels'
  | 'local_content'
  | 'hybrid';

export interface QueryAnalysis {
  intent: QueryIntent;
  primarySource: DataSource;
  secondarySources: DataSource[];
  confidence: number;
  requiresRealTime: boolean;
  locationSpecific: boolean;
  dateRequested: boolean;
  keywords: string[];
  entities: {
    locations?: string[];
    dates?: string[];
    amenities?: string[];
    hotelNames?: string[];
  };
}

export interface RoutingDecision {
  strategy: 'single' | 'parallel' | 'sequential';
  sources: {
    source: DataSource;
    weight: number;
    purpose: string;
  }[];
  mergingStrategy: 'prioritize' | 'combine' | 'overlay';
}

/**
 * World's Most Intelligent Query Router for Travel AI
 * Analyzes user intent and routes to optimal data sources
 */
export class IntelligentQueryRouter {
  
  // Location keywords for Sifnos
  private sifnosLocations = [
    'kamares', 'apollonia', 'platis gialos', 'kastro', 'faros', 
    'vathi', 'artemonas', 'cheronissos', 'chrissopigi', 'exampela'
  ];

  // Hotel amenities that require real-time data
  private realTimeAmenities = [
    'available', 'booking', 'reservation', 'price', 'cost', 'rate',
    'discount', 'offer', 'deal', 'promotion', 'vacancy', 'rooms available'
  ];

  // Temporal keywords indicating date requirements
  private temporalKeywords = [
    'next weekend', 'next week', 'tomorrow', 'today', 'this weekend',
    'available', 'book', 'reserve', 'check availability', 'dates',
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];

  // Local content keywords
  private localContentKeywords = [
    'beach', 'restaurant', 'taverna', 'activity', 'things to do',
    'pottery', 'monastery', 'hiking', 'trail', 'museum', 'culture',
    'tradition', 'food', 'cuisine', 'nightlife', 'shopping'
  ];

  /**
   * Main analysis function - the brain of the router
   */
  public analyzeQuery(query: string): QueryAnalysis {
    const queryLower = query.toLowerCase();
    const words = queryLower.split(/\s+/);
    
    // Extract entities
    const entities = this.extractEntities(queryLower);
    
    // Analyze intent patterns
    const intent = this.determineIntent(queryLower, entities);
    
    // Determine data requirements
    const requiresRealTime = this.requiresRealTimeData(queryLower);
    const locationSpecific = this.isLocationSpecific(queryLower);
    const dateRequested = this.hasDateRequest(queryLower);
    
    // Calculate confidence based on pattern matching
    const confidence = this.calculateConfidence(queryLower, intent);
    
    // Determine primary and secondary sources
    const { primarySource, secondarySources } = this.determineSources(intent, requiresRealTime, locationSpecific);
    
    return {
      intent,
      primarySource,
      secondarySources,
      confidence,
      requiresRealTime,
      locationSpecific,
      dateRequested,
      keywords: this.extractKeywords(queryLower),
      entities
    };
  }

  /**
   * Create routing strategy based on analysis
   */
  public createRoutingStrategy(analysis: QueryAnalysis): RoutingDecision {
    switch (analysis.intent) {
      case 'real_time_availability':
        return {
          strategy: 'parallel',
          sources: [
            { source: 'agoda', weight: 0.7, purpose: 'Real-time availability and pricing' },
            { source: 'local_hotels', weight: 0.3, purpose: 'Local sponsored options' }
          ],
          mergingStrategy: 'combine'
        };

      case 'local_sponsored_hotels':
        return {
          strategy: 'sequential',
          sources: [
            { source: 'local_hotels', weight: 0.8, purpose: 'Sponsored local properties' },
            { source: 'openrouter', weight: 0.2, purpose: 'Contextual recommendations' }
          ],
          mergingStrategy: 'overlay'
        };

      case 'location_guide':
        return {
          strategy: 'parallel',
          sources: [
            { source: 'local_content', weight: 0.7, purpose: 'Detailed local information' },
            { source: 'openrouter', weight: 0.3, purpose: 'General travel context' }
          ],
          mergingStrategy: 'overlay'
        };

      case 'hybrid_recommendation':
        return {
          strategy: 'parallel',
          sources: [
            { source: 'agoda', weight: 0.4, purpose: 'Real-time hotel availability' },
            { source: 'local_hotels', weight: 0.3, purpose: 'Local sponsored properties' },
            { source: 'local_content', weight: 0.2, purpose: 'Local activities and places' },
            { source: 'openrouter', weight: 0.1, purpose: 'Travel expertise and planning' }
          ],
          mergingStrategy: 'combine'
        };

      default: // general_travel_info
        return {
          strategy: 'single',
          sources: [
            { source: 'openrouter', weight: 1.0, purpose: 'General travel information and advice' }
          ],
          mergingStrategy: 'prioritize'
        };
    }
  }

  private determineIntent(query: string, entities: any): QueryIntent {
    // Real-time availability patterns
    if (this.hasPattern(query, ['available', 'book', 'reserve']) || 
        this.hasPattern(query, ['next weekend', 'next week', 'dates']) ||
        this.hasPattern(query, ['hotels for', 'accommodation for'])) {
      return 'real_time_availability';
    }

    // Local sponsored hotels patterns
    if (this.hasLocationAndHotel(query, entities) ||
        this.hasPattern(query, ['hotels in', 'accommodation in']) ||
        this.hasSpecificHotelMention(query)) {
      return 'local_sponsored_hotels';
    }

    // Location guide patterns
    if (this.hasPattern(query, ['beach', 'restaurant', 'things to do']) ||
        this.hasPattern(query, ['visit', 'see', 'explore']) ||
        this.hasLocalContentKeywords(query)) {
      return 'location_guide';
    }

    // Hybrid recommendation patterns
    if (this.hasPattern(query, ['plan', 'itinerary', 'trip']) ||
        this.hasPattern(query, ['best', 'recommend', 'suggest']) ||
        this.hasMultipleRequirements(query)) {
      return 'hybrid_recommendation';
    }

    // Default to general travel info
    return 'general_travel_info';
  }

  private extractEntities(query: string) {
    const queryLower = query.toLowerCase();
    return {
      locations: this.sifnosLocations.filter(loc => queryLower.includes(loc.toLowerCase())),
      dates: this.extractDates(query),
      amenities: this.extractAmenities(query),
      hotelNames: this.extractHotelNames(query)
    };
  }

  private requiresRealTimeData(query: string): boolean {
    return this.realTimeAmenities.some(keyword => query.includes(keyword)) ||
           this.temporalKeywords.some(keyword => query.includes(keyword));
  }

  private isLocationSpecific(query: string): boolean {
    return this.sifnosLocations.some(location => query.includes(location));
  }

  private hasDateRequest(query: string): boolean {
    return this.temporalKeywords.some(keyword => query.includes(keyword));
  }

  private determineSources(intent: QueryIntent, requiresRealTime: boolean, locationSpecific: boolean) {
    const sourceMap = {
      'real_time_availability': {
        primarySource: 'agoda' as DataSource,
        secondarySources: ['local_hotels'] as DataSource[]
      },
      'local_sponsored_hotels': {
        primarySource: 'local_hotels' as DataSource,
        secondarySources: ['openrouter'] as DataSource[]
      },
      'location_guide': {
        primarySource: 'local_content' as DataSource,
        secondarySources: ['openrouter'] as DataSource[]
      },
      'hybrid_recommendation': {
        primarySource: 'hybrid' as DataSource,
        secondarySources: ['agoda', 'local_hotels', 'local_content'] as DataSource[]
      },
      'general_travel_info': {
        primarySource: 'openrouter' as DataSource,
        secondarySources: [] as DataSource[]
      }
    };

    return sourceMap[intent];
  }

  private calculateConfidence(query: string, intent: QueryIntent): number {
    // Implement confidence calculation based on pattern strength
    let confidence = 0.5;
    
    // Add confidence based on clear patterns
    if (this.hasStrongPatterns(query, intent)) confidence += 0.3;
    if (this.hasMultipleIndicators(query, intent)) confidence += 0.2;
    
    return Math.min(confidence, 1.0);
  }

  private extractKeywords(query: string): string[] {
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    return query.split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.includes(word))
      .slice(0, 10); // Limit to most relevant keywords
  }

  private hasPattern(query: string, patterns: string[]): boolean {
    return patterns.some(pattern => query.includes(pattern));
  }

  private hasLocationAndHotel(query: string, entities: any): boolean {
    return entities.locations.length > 0 && query.includes('hotel');
  }

  private hasSpecificHotelMention(query: string): boolean {
    const hotelNames = ['villa olivia', 'filadaki', 'meropi', 'alk hotel', 'morpheas'];
    return hotelNames.some(name => query.includes(name));
  }

  private hasLocalContentKeywords(query: string): boolean {
    return this.localContentKeywords.some(keyword => query.includes(keyword));
  }

  private hasMultipleRequirements(query: string): boolean {
    const requirements = [
      query.includes('hotel'),
      query.includes('beach'),
      query.includes('restaurant'),
      query.includes('activity')
    ];
    return requirements.filter(Boolean).length >= 2;
  }

  private extractDates(query: string): string[] {
    const dateMatches = query.match(/\b(next \w+|this \w+|\w+day|\d{1,2}\/\d{1,2}|\w+ \d{1,2})\b/g);
    return dateMatches || [];
  }

  private extractAmenities(query: string): string[] {
    const amenities = ['pool', 'spa', 'wifi', 'breakfast', 'parking', 'balcony', 'sea view'];
    return amenities.filter(amenity => query.includes(amenity));
  }

  private extractHotelNames(query: string): string[] {
    const hotels = ['villa olivia clara', 'filadaki villas', 'meropi rooms', 'alk hotel', 'morpheas pension'];
    return hotels.filter(hotel => query.includes(hotel));
  }

  private hasStrongPatterns(query: string, intent: QueryIntent): boolean {
    // Implementation for strong pattern detection
    return true;
  }

  private hasMultipleIndicators(query: string, intent: QueryIntent): boolean {
    // Implementation for multiple indicator detection
    return true;
  }
}

export const queryRouter = new IntelligentQueryRouter(); 