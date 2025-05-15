import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Bot, Search, MessageSquare, Hotel, MapPin, Star, Sparkles, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TouristasChat from '@/components/touristas/TouristasChat';
import SEO from '@/components/SEO';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function TouristasAIPage() {
  const [activeSection, setActiveSection] = useState<string>('chat');
  const chatSectionRef = useRef<HTMLDivElement>(null);
  
  // Scroll to top on initial page load
  useEffect(() => {
    // Initial scroll to top
    window.scrollTo({ top: 0, behavior: 'auto' });
    
    // If URL hash includes 'chat', scroll to chat section after a brief delay
    if (window.location.hash === '#chat' && chatSectionRef.current) {
      const timer = setTimeout(() => {
        chatSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Auto-focus chat when clicking the chat buttons
  const scrollToChat = () => {
    if (chatSectionRef.current) {
      chatSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection('chat');
      
      // Update URL hash without causing a page refresh
      window.history.replaceState(null, '', '#chat');
    }
  };

  return (
    <>
      <SEO
        title="Touristas AI - Your Intelligent Sifnos Travel Companion"
        description="Chat with Touristas AI to get personalized hotel recommendations in Sifnos based on your preferences. Find the perfect stay in locations like Platis Gialos, Apollonia, or Kamares."
        keywords={['touristas ai', 'sifnos ai hotel finder', 'ai travel assistant', 'personalized hotel recommendations', 'sifnos accommodation finder']}
        schemaType="TravelAgency"
        canonical="/touristas-ai"
      />
      
      {/* Beta Notice Alert */}
      <div className="bg-amber-50 border-b border-amber-200">
        <Alert variant="default" className="bg-transparent border-none max-w-6xl mx-auto">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 text-sm">
            <span className="font-semibold">Beta:</span> Touristas AI is still in development. We're improving our models every day to provide the best experience and results!
          </AlertDescription>
        </Alert>
      </div>
      
      {/* Hero Section with Solid Color Background */}
      <div className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-sifnos-deep-blue via-[#2a3d5c] to-[#1E2E48]">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="flex items-center justify-center gap-3 mb-6">
            <img 
              src="/uploads/touristas-ai-logo.svg" 
              alt="Touristas AI Logo" 
              className="h-12 w-12"
            />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold">
              Touristas AI
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-white/90 font-light">
            Your intelligent Sifnos travel companion powered by AI
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <Badge className="px-4 py-2 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border-none">
              <MapPin className="h-4 w-4 mr-2" />
              Location-Based Recommendations
            </Badge>
            <Badge className="px-4 py-2 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border-none">
              <Star className="h-4 w-4 mr-2" />
              Top-Rated Hotels
            </Badge>
            <Badge className="px-4 py-2 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border-none">
              <MessageSquare className="h-4 w-4 mr-2" />
              Natural Conversation
            </Badge>
          </div>
          
          <Button 
            size="lg" 
            className="bg-white hover:bg-white/90 text-sifnos-deep-blue font-medium px-6 py-6 rounded-full"
            onClick={scrollToChat}
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Start a Conversation
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* AI Assistant Section - Positioned right after hero */}
      <div id="ai-assistant-section" ref={chatSectionRef} className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge className="mb-4 px-3 py-1.5 bg-gradient-to-r from-sifnos-deep-blue to-sifnos-deep-blue/70 text-white hover:from-sifnos-deep-blue/90 hover:to-sifnos-deep-blue/60">
              <Bot className="h-4 w-4 mr-1.5" />
              Intelligent Assistant
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-sifnos-deep-blue mb-4">Start Your AI Hotel Search</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Chat with Touristas AI to find the perfect accommodation in your desired Sifnos location
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <TouristasChat />
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-3 py-1.5 bg-purple-100 text-purple-800 hover:bg-purple-200">
              <Sparkles className="h-4 w-4 mr-1.5" />
              Powered by AI
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-sifnos-deep-blue mb-4">How Touristas AI Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the perfect accommodation in Sifnos with our intelligent AI assistant that understands your preferences and location needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Step 1 */}
            <div className="text-center relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-3 text-sifnos-deep-blue">Chat About Your Needs</h3>
              <p className="text-gray-600">
                Tell our AI which part of Sifnos you're interested in staying - Platis Gialos, Apollonia, Kamares, or anywhere else.
              </p>
              {/* Connector line (desktop only) */}
              <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-gradient-to-r from-blue-500 to-transparent"></div>
            </div>
            
            {/* Step 2 */}
            <div className="text-center relative">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-3 text-sifnos-deep-blue">Get Smart Recommendations</h3>
              <p className="text-gray-600">
                Our AI analyzes your preferences and suggests accommodations in your chosen location that match your needs.
              </p>
              {/* Connector line (desktop only) */}
              <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-gradient-to-r from-pink-500 to-transparent"></div>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-amber-500 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-3 text-sifnos-deep-blue">Explore & Book</h3>
              <p className="text-gray-600">
                View detailed information about each recommended hotel and make an informed booking decision for your Sifnos stay.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-sifnos-deep-blue mb-4">Smart Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the power of AI-driven travel assistance with these intelligent features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="p-6 bg-gradient-to-br from-white to-blue-50 border-blue-100 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-blue-100 text-sifnos-deep-blue flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-sifnos-deep-blue">Location Intelligence</h3>
              <p className="text-gray-600">
                Tell our AI exactly where in Sifnos you want to stay, and it will focus recommendations on that specific area.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Beach areas like Platis Gialos</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Traditional villages like Apollonia</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Port-side stays in Kamares</span>
                </li>
              </ul>
            </Card>
            
            {/* Feature 2 */}
            <Card className="p-6 bg-gradient-to-br from-white to-purple-50 border-purple-100 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-purple-100 text-sifnos-deep-blue flex items-center justify-center mb-4">
                <Hotel className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-sifnos-deep-blue">Visual Exploration</h3>
              <p className="text-gray-600">
                Browse through beautiful carousels of hotel photos to get a feel for each property before making your decision.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>High-quality property imagery</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Interactive photo galleries</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Property detail exploration</span>
                </li>
              </ul>
            </Card>
            
            {/* Feature 3 */}
            <Card className="p-6 bg-gradient-to-br from-white to-amber-50 border-amber-100 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-amber-100 text-sifnos-deep-blue flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-sifnos-deep-blue">Natural Conversations</h3>
              <p className="text-gray-600">
                Chat naturally with our AI and ask follow-up questions about accommodations, amenities, and locations.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Human-like interactions</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Contextual understanding</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Helpful travel insights</span>
                </li>
              </ul>
            </Card>
            
            {/* Feature 4 - Only visible on larger screens */}
            <Card className="p-6 bg-gradient-to-br from-white to-green-50 border-green-100 hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
              <div className="h-12 w-12 rounded-2xl bg-green-100 text-sifnos-deep-blue flex items-center justify-center mb-4">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-sifnos-deep-blue">Curated Quality</h3>
              <p className="text-gray-600">
                Our AI prioritizes highly-rated accommodations that match your preferences for a truly satisfying stay.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Top-rated properties</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Well-reviewed accommodations</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Quality-focused recommendations</span>
                </li>
              </ul>
            </Card>
            
            {/* Feature 5 */}
            <Card className="p-6 bg-gradient-to-br from-white to-cyan-50 border-cyan-100 hover:shadow-md transition-shadow lg:col-span-2">
              <div className="h-12 w-12 rounded-2xl bg-cyan-100 text-sifnos-deep-blue flex items-center justify-center mb-4">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-sifnos-deep-blue">Intelligent Recommendations</h3>
              <p className="text-gray-600">
                Our advanced AI understands the unique character of each Sifnos location and matches you with accommodations that truly suit your preferences.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>Beach vs. village preferences</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>Family-friendly options</span>
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>Boutique & luxury properties</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>Traditional Cycladic accommodations</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-sifnos-deep-blue mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Common questions about using Touristas AI and finding accommodation in Sifnos
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {/* FAQ Item 1 */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2 text-sifnos-deep-blue">How accurate are the location recommendations?</h3>
              <p className="text-gray-600">
                Touristas AI is specifically trained on Sifnos locations and can accurately recommend hotels in Platis Gialos, Apollonia, Kamares, 
                Vathi, Kastro, and other areas. Just mention the location you're interested in, and the AI will focus on that area.
              </p>
            </Card>
            
            {/* FAQ Item 2 */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2 text-sifnos-deep-blue">Can I see more details about a recommended hotel?</h3>
              <p className="text-gray-600">
                Yes! When Touristas AI recommends hotels, you can click on the "View Details" button to see more information about each property, 
                including amenities, location details, and photo galleries.
              </p>
            </Card>
            
            {/* FAQ Item 3 */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2 text-sifnos-deep-blue">Which parts of Sifnos are best for families?</h3>
              <p className="text-gray-600">
                Platis Gialos and Kamares are excellent choices for families due to their sandy beaches and amenities. 
                Ask Touristas AI about family-friendly accommodations in these areas for personalized recommendations.
              </p>
            </Card>
            
            {/* FAQ Item 4 */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2 text-sifnos-deep-blue">Where can I find luxury accommodations in Sifnos?</h3>
              <p className="text-gray-600">
                For luxury stays, Platis Gialos offers upscale villas and boutique hotels with beautiful sea views. 
                Kastro also has some exclusive properties. Ask Touristas AI about "luxury hotels in [location]" for specific recommendations.
              </p>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-sifnos-deep-blue mb-6">Ready to Find Your Perfect Stay in Sifnos?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Start chatting with Touristas AI now and discover accommodations that perfectly match your preferences
          </p>
          <Button 
            size="lg" 
            className="bg-sifnos-deep-blue hover:bg-sifnos-deep-blue/90 text-white font-medium px-8 py-6 rounded-full"
            onClick={scrollToChat}
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Start Chatting with Touristas AI
          </Button>
        </div>
      </div>
    </>
  );
}
