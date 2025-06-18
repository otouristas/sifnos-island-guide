import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Sparkles, Hotel, MapPin, Calendar, ArrowRight, Star, Users, Zap } from 'lucide-react';
import SEO from '@/components/SEO';
import EnhancedTouristasChat from '@/components/touristas/enhanced/EnhancedTouristasChat';

export default function TouristasAIPage() {
  // Ensure page loads from top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <SEO 
        title="Touristas AI - Intelligent Sifnos Travel Assistant"
        description="Get personalized hotel recommendations, travel tips, and insider knowledge for your perfect Sifnos vacation with our AI-powered assistant."
        keywords={["Sifnos AI assistant", "travel recommendations", "hotel booking", "Greece travel", "Cyclades islands"]}
      />

      {/* SaaS Hero Section */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1E2E48 0%, #2a3c5a 50%, #1E2E48 100%)' }}>
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" style={{ backgroundColor: 'rgba(227, 215, 195, 0.1)' }}></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" style={{ backgroundColor: 'rgba(255, 215, 0, 0.08)' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" style={{ backgroundColor: 'rgba(227, 215, 195, 0.15)' }}></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo and Branding */}
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-xl scale-110" style={{ backgroundColor: 'rgba(227, 215, 195, 0.2)' }}></div>
                <div className="relative backdrop-blur-sm rounded-full p-6 border" style={{ backgroundColor: 'rgba(227, 215, 195, 0.1)', borderColor: 'rgba(227, 215, 195, 0.3)' }}>
                  <img 
                    src="/uploads/touristas-ai-logo.svg" 
                    alt="Touristas AI" 
                    className="h-16 w-16 md:h-20 md:w-20"
                  />
                </div>
              </div>
            </div>

            {/* AI Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-white rounded-full backdrop-blur-sm border" style={{ backgroundColor: 'rgba(227, 215, 195, 0.15)', borderColor: 'rgba(227, 215, 195, 0.3)' }}>
              <Sparkles className="h-4 w-4" style={{ color: '#FFD700' }} />
              <span>Powered by 200+ Automated Trained Agents</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Meet{' '}
              <span 
                className="bg-clip-text text-transparent"
                style={{ 
                  backgroundImage: 'linear-gradient(135deg, #E3D7C3 0%, #FFD700 50%, #E3D7C3 100%)'
                }}
              >
                Touristas AI
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed" style={{ color: 'rgba(227, 215, 195, 0.9)' }}>
              Your intelligent Sifnos travel companion that understands exactly what you're looking for 
              and finds the perfect accommodation in seconds
            </p>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-6 mb-10" style={{ color: 'rgba(227, 215, 195, 0.8)' }}>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-current" style={{ color: '#FFD700' }} />
                <span className="text-sm font-medium">AI-Powered Matching</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span className="text-sm font-medium">1000+ Happy Travelers</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5" style={{ color: '#FFD700' }} />
                <span className="text-sm font-medium">Instant Results</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button 
                size="lg" 
                className="font-semibold px-8 py-6 text-lg rounded-full shadow-xl transition-all duration-300 hover:scale-105"
                style={{ 
                  backgroundColor: '#E3D7C3',
                  color: '#1E2E48',
                  boxShadow: '0 10px 30px rgba(227, 215, 195, 0.3)'
                }}
              >
                Start Planning Your Trip
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="font-semibold px-8 py-6 text-lg rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-105"
                style={{ 
                  borderColor: 'rgba(227, 215, 195, 0.5)',
                  color: '#E3D7C3',
                  backgroundColor: 'rgba(227, 215, 195, 0.1)'
                }}
              >
                See How It Works
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="hover:shadow-lg transition-all duration-300 border-2" style={{ backgroundColor: 'rgba(227, 215, 195, 0.05)', borderColor: 'rgba(30, 46, 72, 0.1)' }}>
            <CardHeader className="text-center pb-3">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'rgba(30, 46, 72, 0.1)' }}>
                <Hotel className="h-8 w-8" style={{ color: '#1E2E48' }} />
              </div>
              <CardTitle className="text-xl" style={{ color: '#1E2E48' }}>Smart Hotel Matching</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-base text-gray-700">
                AI-powered recommendations based on your preferences, budget, and travel style
              </CardDescription>
              <div className="flex gap-2 justify-center mt-4">
                <Badge variant="outline" className="border" style={{ backgroundColor: '#E3D7C3', color: '#1E2E48', borderColor: '#1E2E48' }}>Local Hotels</Badge>
                <Badge variant="outline" className="border" style={{ backgroundColor: 'rgba(30, 46, 72, 0.1)', color: '#1E2E48', borderColor: '#1E2E48' }}>Partner Hotels</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-2" style={{ backgroundColor: 'rgba(227, 215, 195, 0.05)', borderColor: 'rgba(30, 46, 72, 0.1)' }}>
            <CardHeader className="text-center pb-3">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'rgba(30, 46, 72, 0.1)' }}>
                <MapPin className="h-8 w-8" style={{ color: '#1E2E48' }} />
              </div>
              <CardTitle className="text-xl" style={{ color: '#1E2E48' }}>Local Insights</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-base text-gray-700">
                Insider knowledge about beaches, restaurants, and hidden gems across Sifnos
              </CardDescription>
              <div className="flex gap-2 justify-center mt-4">
                <Badge variant="outline" className="border" style={{ backgroundColor: '#E3D7C3', color: '#1E2E48', borderColor: '#1E2E48' }}>8 Locations</Badge>
                <Badge variant="outline" className="border" style={{ backgroundColor: 'rgba(30, 46, 72, 0.1)', color: '#1E2E48', borderColor: '#1E2E48' }}>Expert Tips</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-2" style={{ backgroundColor: 'rgba(227, 215, 195, 0.05)', borderColor: 'rgba(30, 46, 72, 0.1)' }}>
            <CardHeader className="text-center pb-3">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'rgba(30, 46, 72, 0.1)' }}>
                <Calendar className="h-8 w-8" style={{ color: '#1E2E48' }} />
              </div>
              <CardTitle className="text-xl" style={{ color: '#1E2E48' }}>Travel Packages</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-base text-gray-700">
                Custom itineraries and hotel bundles with exclusive savings and perks
              </CardDescription>
              <div className="flex gap-2 justify-center mt-4">
                <Badge variant="outline" className="border" style={{ backgroundColor: '#E3D7C3', color: '#1E2E48', borderColor: '#1E2E48' }}>Bundle Deals</Badge>
                <Badge variant="outline" className="border" style={{ backgroundColor: 'rgba(30, 46, 72, 0.1)', color: '#1E2E48', borderColor: '#1E2E48' }}>Save 15%</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Chat Interface */}
        <div className="max-w-6xl mx-auto">
          <EnhancedTouristasChat />
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-6" style={{ color: '#1E2E48' }}>Why Choose Touristas AI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(30, 46, 72, 0.1)' }}>
                <Bot className="h-10 w-10" style={{ color: '#1E2E48' }} />
              </div>
              <h3 className="font-semibold text-lg mb-3" style={{ color: '#1E2E48' }}>AI-Powered</h3>
              <p className="text-gray-600">Advanced natural language understanding for better conversations</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(30, 46, 72, 0.1)' }}>
                <Hotel className="h-10 w-10" style={{ color: '#1E2E48' }} />
              </div>
              <h3 className="font-semibold text-lg mb-3" style={{ color: '#1E2E48' }}>Real-Time Data</h3>
              <p className="text-gray-600">Live hotel availability and pricing from multiple sources</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(30, 46, 72, 0.1)' }}>
                <Sparkles className="h-10 w-10" style={{ color: '#1E2E48' }} />
              </div>
              <h3 className="font-semibold text-lg mb-3" style={{ color: '#1E2E48' }}>Smart Suggestions</h3>
              <p className="text-gray-600">Contextual follow-up questions and recommendations</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(30, 46, 72, 0.1)' }}>
                <MapPin className="h-10 w-10" style={{ color: '#1E2E48' }} />
              </div>
              <h3 className="font-semibold text-lg mb-3" style={{ color: '#1E2E48' }}>Local Expert</h3>
              <p className="text-gray-600">Insider knowledge from Sifnos travel specialists</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
