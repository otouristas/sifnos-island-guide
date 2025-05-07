
import { Helmet } from 'react-helmet';
import { useState } from 'react';
import { Bot, Search, User, MessageSquare, Heart, Hotel, MapPin, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TouristasChat from '@/components/touristas/TouristasChat';
import SEO from '@/components/SEO';

export default function TouristasAIPage() {
  return (
    <>
      <SEO
        title="AI Travel Assistant - Find Your Perfect Stay in Sifnos"
        description="Chat with our AI travel assistant to get personalized hotel recommendations in Sifnos based on your preferences. Discover the perfect beach, luxury, family, or budget stay."
        keywords={['sifnos ai hotel finder', 'ai travel assistant sifnos', 'personalized hotel recommendations', 'sifnos accommodation finder', 'cyclades ai travel guide']}
        schemaType="TravelAgency"
        canonical="/touristas-ai"
      />
      
      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img 
          src="/uploads/homepage-hero.jpg" 
          alt="Sifnos Island Greece" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sifnos-deep-blue/80 to-sifnos-deep-blue/50"></div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/20">
            <Bot className="h-5 w-5" />
            <span className="font-medium">Touristas AI</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold mb-6">
            Your Personal Sifnos<br />
            <span className="text-white/90">Travel Assistant</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-white/80">
            Chat with our AI to discover your perfect accommodation in Sifnos, tailored to your preferences and travel style.
          </p>
          <a href="#chat-section">
            <Button size="lg" className="bg-white hover:bg-white/90 text-sifnos-deep-blue font-medium">
              <MessageSquare className="mr-2 h-5 w-5" />
              Start Chatting
            </Button>
          </a>
        </div>
        
        {/* Floating cards decoration */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-6xl px-4 hidden md:flex justify-between">
          <Card className="w-64 h-28 p-4 rotate-[-4deg] translate-x-8 translate-y-4 shadow-lg bg-white/80 backdrop-blur-sm border-white/30">
            <div className="flex items-center gap-2 mb-2">
              <Hotel className="h-5 w-5 text-sifnos-deep-blue" />
              <span className="font-medium text-sifnos-deep-blue">Beachfront</span>
            </div>
            <p className="text-sm text-gray-600">Find accommodations with direct access to Sifnos's beautiful beaches</p>
          </Card>
          
          <Card className="w-64 h-28 p-4 rotate-[2deg] translate-y-6 shadow-lg bg-white/80 backdrop-blur-sm border-white/30">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-5 w-5 text-sifnos-deep-blue" />
              <span className="font-medium text-sifnos-deep-blue">Family-friendly</span>
            </div>
            <p className="text-sm text-gray-600">Discover the best options for traveling with children in Sifnos</p>
          </Card>
          
          <Card className="w-64 h-28 p-4 rotate-[4deg] -translate-x-8 translate-y-2 shadow-lg bg-white/80 backdrop-blur-sm border-white/30">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-5 w-5 text-sifnos-deep-blue" />
              <span className="font-medium text-sifnos-deep-blue">Luxury stays</span>
            </div>
            <p className="text-sm text-gray-600">Explore premium accommodations with top-tier amenities</p>
          </Card>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 md:py-24 -mt-12 relative z-20" id="chat-section">
        <div className="max-w-5xl mx-auto">
          <TouristasChat />
          
          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card className="p-6 bg-gradient-to-br from-white to-blue-50 border-blue-100">
              <div className="h-12 w-12 rounded-2xl bg-blue-100 text-sifnos-deep-blue flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Chat Naturally</h3>
              <p className="text-gray-600">
                Talk to our AI in your own words about which Sifnos location you're interested in staying.
              </p>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-white to-purple-50 border-purple-100">
              <div className="h-12 w-12 rounded-2xl bg-purple-100 text-sifnos-deep-blue flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Location-Based Results</h3>
              <p className="text-gray-600">
                Get hotel recommendations in specific Sifnos locations like Platis Gialos, Apollonia, or Kamares.
              </p>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-white to-amber-50 border-amber-100">
              <div className="h-12 w-12 rounded-2xl bg-amber-100 text-sifnos-deep-blue flex items-center justify-center mb-4">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Top-Rated Options</h3>
              <p className="text-gray-600">
                Discover the highest-rated accommodations in each area of Sifnos based on verified guest reviews.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
