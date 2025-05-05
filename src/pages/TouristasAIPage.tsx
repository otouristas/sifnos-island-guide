
import React from 'react';
import SEO from '@/components/SEO';
import TouristasAI from '@/components/TouristasAI';

export default function TouristasAIPage() {
  return (
    <>
      <SEO 
        title="Touristas AI - Smart Hotel Recommendations for Sifnos" 
        description="Let our AI-powered assistant help you find the perfect accommodation in Sifnos based on your preferences and needs."
        keywords={['sifnos ai hotel finder', 'touristas ai', 'hotel recommendations sifnos', 'greece accommodation ai', 'find hotel in sifnos']}
        canonical="https://hotelssifnos.com/touristas-ai"
      />
      
      {/* Hero Section */}
      <div className="bg-sifnos-deep-blue">
        <div className="page-container">
          <div className="text-center text-white py-6">
            <h1 className="font-montserrat text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Touristas AI
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">
              Your AI-powered travel assistant for finding the perfect accommodation in Sifnos Island
            </p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="bg-gray-50 py-8">
        <div className="page-container">
          <div className="max-w-4xl mx-auto prose prose-lg mb-8">
            <p>
              Tell Touristas AI what you're looking for in natural language, and it will recommend the best hotels in Sifnos
              based on your preferences. Try asking about specific locations, amenities, or hotel types!
            </p>
            <p>
              <strong>Example queries:</strong>
            </p>
            <ul>
              <li>"I need a family hotel near the beach with a pool for 5 days"</li>
              <li>"Recommend a luxury hotel in Apollonia with sea view"</li>
              <li>"What's the best boutique hotel with breakfast included?"</li>
            </ul>
          </div>
          
          <TouristasAI />
          
          <div className="max-w-4xl mx-auto mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">About Touristas AI</h2>
            <p className="text-gray-600">
              Touristas AI is powered by Greececyclades.com and uses advanced artificial intelligence to analyze your requirements
              and match them with our curated database of Sifnos accommodations. The AI considers factors such as location, amenities, 
              hotel type, and proximity to attractions to provide personalized recommendations tailored to your needs.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
