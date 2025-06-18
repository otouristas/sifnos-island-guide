/**
 * 🌟 DEMONSTRATION: World's Most Intelligent Travel AI Router
 * 
 * This demonstrates how queries are intelligently routed to different specialized systems:
 * - OpenRouter: General travel intelligence
 * - Agoda API: Real-time availability and pricing
 * - Local Hotels DB: Sponsored and location-based properties
 * - Local Content DB: Beaches, restaurants, activities
 */

export interface QueryExample {
  query: string;
  expectedIntent: string;
  expectedSources: string[];
  expectedStrategy: string;
  description: string;
}

export const INTELLIGENCE_EXAMPLES: QueryExample[] = [
  
  // 🤖 OPENROUTER - General Travel Intelligence
  {
    query: "What's the weather like in Sifnos in July?",
    expectedIntent: "general_travel_info",
    expectedSources: ["openrouter"],
    expectedStrategy: "single",
    description: "General travel questions go to OpenRouter for comprehensive knowledge"
  },
  {
    query: "Tell me about Greek island culture and traditions",
    expectedIntent: "general_travel_info", 
    expectedSources: ["openrouter"],
    expectedStrategy: "single",
    description: "Cultural and educational content uses OpenRouter's vast knowledge"
  },
  {
    query: "What should I pack for a Greek island vacation?",
    expectedIntent: "general_travel_info",
    expectedSources: ["openrouter"],
    expectedStrategy: "single", 
    description: "Travel advice and tips leverage OpenRouter's expertise"
  },

  // 🏨 AGODA API - Real-time Availability & Pricing
  {
    query: "Hotels available for next weekend",
    expectedIntent: "real_time_availability",
    expectedSources: ["agoda", "local_hotels"],
    expectedStrategy: "parallel",
    description: "Date-specific queries trigger real-time Agoda search + local options"
  },
  {
    query: "Show me hotels with pools available next week",
    expectedIntent: "real_time_availability",
    expectedSources: ["agoda", "local_hotels"],
    expectedStrategy: "parallel",
    description: "Amenity + date requests combine Agoda real-time with local database"
  },
  {
    query: "I need accommodation for December 25-28",
    expectedIntent: "real_time_availability", 
    expectedSources: ["agoda", "local_hotels"],
    expectedStrategy: "parallel",
    description: "Specific dates always trigger real-time availability checking"
  },
  {
    query: "Available hotels under €100 per night",
    expectedIntent: "real_time_availability",
    expectedSources: ["agoda", "local_hotels"],
    expectedStrategy: "parallel",
    description: "Budget + availability requests need real-time pricing data"
  },

  // 🏛️ LOCAL HOTELS DATABASE - Sponsored & Location-based
  {
    query: "Hotels in Kamares", 
    expectedIntent: "local_sponsored_hotels",
    expectedSources: ["local_hotels", "openrouter"],
    expectedStrategy: "sequential",
    description: "Location-specific requests prioritize local sponsored properties"
  },
  {
    query: "Show me Villa Olivia Clara details",
    expectedIntent: "local_sponsored_hotels",
    expectedSources: ["local_hotels", "openrouter"], 
    expectedStrategy: "sequential",
    description: "Specific hotel names query local database with contextual enhancement"
  },
  {
    query: "Best family hotels in Platis Gialos",
    expectedIntent: "local_sponsored_hotels",
    expectedSources: ["local_hotels", "openrouter"],
    expectedStrategy: "sequential",
    description: "Location + preference queries favor local properties with expert context"
  },
  {
    query: "Luxury accommodations in Apollonia",
    expectedIntent: "local_sponsored_hotels", 
    expectedSources: ["local_hotels", "openrouter"],
    expectedStrategy: "sequential",
    description: "Premium + location queries showcase local high-end properties"
  },

  // 🏖️ LOCAL CONTENT DATABASE - Beaches, Restaurants, Activities
  {
    query: "Best beaches in Sifnos",
    expectedIntent: "location_guide",
    expectedSources: ["local_content", "openrouter"],
    expectedStrategy: "parallel",
    description: "Beach queries use local database with travel context overlay"
  },
  {
    query: "Where to eat in Kastro",
    expectedIntent: "location_guide",
    expectedSources: ["local_content", "openrouter"],
    expectedStrategy: "parallel", 
    description: "Restaurant requests combine local database with culinary expertise"
  },
  {
    query: "Things to do in Vathi",
    expectedIntent: "location_guide",
    expectedSources: ["local_content", "openrouter"],
    expectedStrategy: "parallel",
    description: "Activity requests merge local content with travel planning intelligence"
  },
  {
    query: "Sifnos pottery workshops and studios",
    expectedIntent: "location_guide",
    expectedSources: ["local_content", "openrouter"],
    expectedStrategy: "parallel",
    description: "Cultural activities use local database enhanced with historical context"
  },

  // 🌟 HYBRID - Multi-source Intelligence  
  {
    query: "Plan my 3-day Sifnos vacation with hotels and activities",
    expectedIntent: "hybrid_recommendation",
    expectedSources: ["agoda", "local_hotels", "local_content", "openrouter"],
    expectedStrategy: "parallel",
    description: "Complex planning uses ALL sources for comprehensive recommendations"
  },
  {
    query: "Best hotels near beautiful beaches with good restaurants",
    expectedIntent: "hybrid_recommendation", 
    expectedSources: ["agoda", "local_hotels", "local_content", "openrouter"],
    expectedStrategy: "parallel",
    description: "Multi-criteria requests require comprehensive multi-source intelligence"
  },
  {
    query: "Romantic weekend getaway with spa and sunset views",
    expectedIntent: "hybrid_recommendation",
    expectedSources: ["agoda", "local_hotels", "local_content", "openrouter"],
    expectedStrategy: "parallel", 
    description: "Experience-based requests combine real-time data with local expertise"
  }
];

/**
 * Demonstration of how the intelligent routing system processes different query types
 */
export class IntelligentRoutingDemo {
  
  public static demonstrateRouting(): void {
    console.log('🧠 WORLD\'S MOST INTELLIGENT TRAVEL AI ROUTING SYSTEM\n');
    
    INTELLIGENCE_EXAMPLES.forEach((example, index) => {
      console.log(`\n${index + 1}. 📝 QUERY: "${example.query}"`);
      console.log(`   🎯 INTENT: ${example.expectedIntent}`);
      console.log(`   📊 SOURCES: ${example.expectedSources.join(' + ')}`);
      console.log(`   ⚡ STRATEGY: ${example.expectedStrategy}`);
      console.log(`   💡 LOGIC: ${example.description}`);
      
      // Show expected data flow
      this.showDataFlow(example);
    });
    
    console.log('\n🚀 RESULT: Touristas AI becomes the most intelligent travel agent by:');
    console.log('   ✅ Using OpenRouter for general travel intelligence');
    console.log('   ✅ Using Agoda API for real-time availability & pricing');
    console.log('   ✅ Using Local Hotels DB for sponsored properties');
    console.log('   ✅ Using Local Content DB for insider information');
    console.log('   ✅ Combining all sources intelligently based on query intent');
  }
  
  private static showDataFlow(example: QueryExample): void {
    const sourceDescriptions = {
      'openrouter': '🤖 OpenRouter → General travel expertise & cultural knowledge',
      'agoda': '🏨 Agoda API → Real-time hotel availability & live pricing',
      'local_hotels': '🏛️ Local DB → Sponsored properties & location-based hotels', 
      'local_content': '🏖️ Local DB → Beaches, restaurants, activities & insider tips'
    };
    
    console.log('   📈 DATA FLOW:');
    example.expectedSources.forEach(source => {
      console.log(`      ${sourceDescriptions[source]}`);
    });
  }
  
  /**
   * Test the routing logic for specific scenarios
   */
  public static testScenarios(): {[key: string]: any} {
    return {
      weekend_availability: {
        query: "Hotels available for next weekend", 
        expectedFlow: [
          "1. Parse 'next weekend' → Calculate Friday-Sunday dates",
          "2. Query Agoda API → Get real-time availability & pricing",
          "3. Query Local Hotels → Get sponsored options for same dates", 
          "4. Merge results → Combine real-time + local with intelligent ranking",
          "5. AI Response → Passionate local expert using REAL data"
        ]
      },
      
      location_guide: {
        query: "Best beaches in Sifnos",
        expectedFlow: [
          "1. Identify location intent → Beach discovery request",
          "2. Query Local Content DB → Get all Sifnos beaches with details",
          "3. Query OpenRouter → Get travel context & seasonal advice",
          "4. Merge results → Overlay expert knowledge on local data",
          "5. AI Response → Insider tips with comprehensive beach information"
        ]
      },
      
      hybrid_planning: {
        query: "Plan my 3-day Sifnos vacation",
        expectedFlow: [
          "1. Identify complex planning → Multi-source requirement",
          "2. Query ALL sources in parallel:",
          "   - Agoda: Real-time hotel availability",
          "   - Local Hotels: Sponsored properties", 
          "   - Local Content: Activities, beaches, restaurants",
          "   - OpenRouter: Travel planning expertise",
          "3. Intelligent merge → Create comprehensive 3-day itinerary",
          "4. AI Response → Complete vacation plan with real availability"
        ]
      }
    };
  }
}

// Auto-run demonstration when imported
if (typeof window !== 'undefined') {
  console.log('🌟 Loading Intelligent Travel AI Routing System...');
  // IntelligentRoutingDemo.demonstrateRouting();
} 