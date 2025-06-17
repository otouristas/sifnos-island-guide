
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Sparkles, MessageSquare, Hotel, MapPin, Calendar } from 'lucide-react';
import SEO from '@/components/SEO';
import EnhancedTouristasChat from '@/components/touristas/enhanced/EnhancedTouristasChat';
import TouristasChat from '@/components/touristas/TouristasChat';

export default function TouristasAIPage() {
  const [useEnhanced, setUseEnhanced] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <SEO 
        title="TouristasAI - Intelligent Sifnos Travel Assistant"
        description="Get personalized hotel recommendations, travel tips, and insider knowledge for your perfect Sifnos vacation with our AI-powered assistant."
        keywords="Sifnos AI assistant, travel recommendations, hotel booking, Greece travel, Cyclades islands"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Bot className="h-12 w-12 text-sifnos-deep-blue" />
              <Sparkles className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-sifnos-deep-blue to-purple-600 bg-clip-text text-transparent">
              TouristasAI Enhanced
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Your intelligent Sifnos travel companion. Get personalized recommendations, 
            discover hidden gems, and plan the perfect Greek island getaway with AI-powered assistance.
          </p>
          
          {/* Version Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Button
              variant={useEnhanced ? "default" : "outline"}
              onClick={() => setUseEnhanced(true)}
              className="flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Enhanced AI
            </Button>
            <Button
              variant={!useEnhanced ? "default" : "outline"}
              onClick={() => setUseEnhanced(false)}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Classic Chat
            </Button>
          </div>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-purple-200">
            <CardHeader className="text-center pb-3">
              <Hotel className="h-8 w-8 text-sifnos-deep-blue mx-auto mb-2" />
              <CardTitle className="text-lg">Smart Hotel Matching</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>
                AI-powered recommendations based on your preferences, budget, and travel style
              </CardDescription>
              <div className="flex gap-2 justify-center mt-3">
                <Badge variant="outline">Local Hotels</Badge>
                <Badge variant="outline">Agoda Partners</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-blue-200">
            <CardHeader className="text-center pb-3">
              <MapPin className="h-8 w-8 text-sifnos-turquoise mx-auto mb-2" />
              <CardTitle className="text-lg">Local Insights</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>
                Insider knowledge about beaches, restaurants, and hidden gems across Sifnos
              </CardDescription>
              <div className="flex gap-2 justify-center mt-3">
                <Badge variant="outline">8 Locations</Badge>
                <Badge variant="outline">Expert Tips</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-pink-200">
            <CardHeader className="text-center pb-3">
              <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Travel Packages</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>
                Custom itineraries and hotel bundles with exclusive savings and perks
              </CardDescription>
              <div className="flex gap-2 justify-center mt-3">
                <Badge variant="outline">Bundle Deals</Badge>
                <Badge variant="outline">Save 15%</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Chat Interface */}
        <div className="max-w-6xl mx-auto">
          {useEnhanced ? <EnhancedTouristasChat /> : <TouristasChat />}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose TouristasAI Enhanced?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bot className="h-8 w-8 text-sifnos-deep-blue" />
              </div>
              <h3 className="font-semibold mb-2">AI-Powered</h3>
              <p className="text-sm text-gray-600">Advanced natural language understanding for better conversations</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Hotel className="h-8 w-8 text-sifnos-turquoise" />
              </div>
              <h3 className="font-semibold mb-2">Real-Time Data</h3>
              <p className="text-sm text-gray-600">Live hotel availability and pricing from multiple sources</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Smart Suggestions</h3>
              <p className="text-sm text-gray-600">Contextual follow-up questions and recommendations</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Local Expert</h3>
              <p className="text-sm text-gray-600">Insider knowledge from Sifnos travel specialists</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
