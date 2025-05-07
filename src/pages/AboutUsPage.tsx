
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { MessageCircle, Mail, Heart, Check, Users, Building, Award, MapPin, Clock, Brain, Sparkles, Zap } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';

export default function AboutUsPage() {
  return (
    <>
      <SEO 
        title="About Hotels Sifnos | AI-Powered Accommodation Platform for Sifnos Island" 
        description="Discover the team behind Hotels Sifnos, the first AI-powered accommodation platform dedicated to Sifnos Island. Learn how our Touristas AI technology delivers personalized recommendations for your perfect Greek island stay."
        keywords={['AI-powered accommodation', 'Sifnos hotels', 'Touristas AI', 'Sifnos villas', 'personalized booking', 'Greek islands accommodation']}
        schemaType="Organization"
        canonical="https://hotelssifnos.com/about-us"
      />
      
      {/* Hero Section - More compact */}
      <div className="bg-sifnos-deep-blue py-12">
        <div className="page-container">
          <div className="text-center text-white max-w-3xl mx-auto">
            <h1 className="font-montserrat text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
              Hotels Sifnos – The AI-Powered Guide to Your Perfect Stay
            </h1>
            <p className="text-lg">
              The first and only AI-powered accommodation discovery platform dedicated exclusively to the captivating island of Sifnos, Greece.
            </p>
          </div>
        </div>
      </div>
      
      {/* About Section - More compact with card */}
      <div className="py-10">
        <div className="page-container">
          <div className="max-w-4xl mx-auto">
            <Card className="border-sifnos-beige shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl md:text-3xl font-montserrat text-sifnos-deep-blue">
                  About Hotels Sifnos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium text-xl mb-3">
                  <strong>Hotels Sifnos</strong> is the first and only <strong>AI-powered accommodation discovery platform</strong> dedicated exclusively to the captivating island of <strong>Sifnos, Greece</strong>.
                </p>
                <p className="mb-4">
                  Whether you're looking for a luxury villa, a cozy seaside studio, or a traditional Cycladic pension, we connect you with the best available stays on the island—<strong>in one place</strong>.
                </p>
                
                <Alert className="bg-sifnos-turquoise/10 border-l-4 border-sifnos-turquoise my-4">
                  <AlertDescription className="text-lg font-medium text-sifnos-deep-blue">
                    <strong>Cut your booking time. Maximize relevance. Powered by Touristas AI.</strong>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* What Makes Us Different - More visual with icons */}
      <div className="py-10 bg-gray-50">
        <div className="page-container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-montserrat font-semibold mb-4 border-b-2 border-sifnos-beige pb-2 inline-block">
              What Makes Us Different
            </h2>
            
            <p className="mb-4">
              Unlike generic booking sites, Hotels Sifnos is laser-focused on <strong>one destination</strong>: Sifnos. Our curated platform leverages the <strong>Touristas AI Engine</strong> to instantly match travelers with personalized accommodation results.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
              {[
                { icon: Users, text: "Traveler type & group size" },
                { icon: MapPin, text: "Preferred location or beach" },
                { icon: Check, text: "Amenity requirements" },
                { icon: Clock, text: "Seasonal availability" },
                { icon: Building, text: "Authenticity & local charm" }
              ].map((item, index) => (
                <div key={index} className="bg-white p-3 rounded-lg shadow-sm flex items-center">
                  <div className="bg-sifnos-turquoise/10 p-2 rounded-full mr-3">
                    <item.icon size={18} className="text-sifnos-deep-blue" />
                  </div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Touristas AI Section - More visual with card layout */}
      <div className="py-10">
        <div className="page-container">
          <div className="max-w-4xl mx-auto">
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-sifnos-deep-blue text-white rounded-t-lg pb-3">
                <div className="flex items-center">
                  <Brain size={24} className="mr-2 text-sifnos-beige" />
                  <CardTitle>Touristas AI: Personalized Search, Smarter Choices</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="mb-3">
                  At the heart of our platform is <strong>Touristas</strong>, our proprietary AI engine developed specifically for tourism and local accommodation discovery.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <div className="flex items-start">
                    <Zap size={18} className="mt-1 mr-2 text-sifnos-turquoise flex-shrink-0" />
                    <span>Instantly understands user intent</span>
                  </div>
                  <div className="flex items-start">
                    <Sparkles size={18} className="mt-1 mr-2 text-sifnos-turquoise flex-shrink-0" />
                    <span>Filters and ranks properties with smart algorithms</span>
                  </div>
                  <div className="flex items-start">
                    <Brain size={18} className="mt-1 mr-2 text-sifnos-turquoise flex-shrink-0" />
                    <span>Adapts to seasonality and user preferences</span>
                  </div>
                  <div className="flex items-start">
                    <Clock size={18} className="mt-1 mr-2 text-sifnos-turquoise flex-shrink-0" />
                    <span>Reduces booking time from hours to minutes</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <p className="text-center text-lg font-medium text-sifnos-deep-blue italic">
                  With Touristas AI, you don't browse. You find.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Mission & Values - More compact with cards */}
      <div className="py-10 bg-gray-50">
        <div className="page-container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-montserrat font-semibold mb-4 border-b-2 border-sifnos-beige pb-2 inline-block">
              Our Mission & Values
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card className="border-t-4 border-t-sifnos-turquoise">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 mx-auto mb-2 bg-sifnos-turquoise/20 rounded-full flex items-center justify-center">
                    <Heart size={20} className="text-sifnos-deep-blue" />
                  </div>
                  <CardTitle className="text-lg text-center">Authenticity</CardTitle>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <p className="text-sm text-gray-700">
                    We feature properties that reflect the soul of Sifnos—Cycladic architecture, warm hospitality, and true local experiences.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-t-4 border-t-sifnos-turquoise">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 mx-auto mb-2 bg-sifnos-turquoise/20 rounded-full flex items-center justify-center">
                    <Check size={20} className="text-sifnos-deep-blue" />
                  </div>
                  <CardTitle className="text-lg text-center">Quality & Trust</CardTitle>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <p className="text-sm text-gray-700">
                    Every listing is handpicked, reviewed, and updated regularly. We showcase only the places we'd stay in ourselves.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-t-4 border-t-sifnos-turquoise">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 mx-auto mb-2 bg-sifnos-turquoise/20 rounded-full flex items-center justify-center">
                    <Users size={20} className="text-sifnos-deep-blue" />
                  </div>
                  <CardTitle className="text-lg text-center">Local Impact</CardTitle>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <p className="text-sm text-gray-700">
                    We prioritize family-owned businesses and help support Sifnos's economy through sustainable, community-first tourism.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Our Story - More compact */}
      <div className="py-10">
        <div className="page-container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-montserrat font-semibold mb-4 border-b-2 border-sifnos-beige pb-2 inline-block">
              Our Story
            </h2>
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <p className="mb-3">
                <Badge variant="outline" className="mr-2 mb-1">Founded 2025</Badge>
                <strong>Hotels Sifnos</strong> was created by a team of professionals passionate about the Cyclades to solve a simple yet widespread problem: finding the right accommodation in a sea of generic booking platforms.
              </p>
              <p>
                Led by <strong>George Kasiotis</strong>, a globally recognized <strong>SEO Manager & Data Analyst</strong>, the platform combines cutting-edge AI technology with hands-on knowledge of Sifnos to deliver a booking experience that's faster, smarter, and genuinely local.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Meet the Founder - More visual with improved card */}
      <div className="py-10 bg-gray-50">
        <div className="page-container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-montserrat font-semibold mb-4 border-b-2 border-sifnos-beige pb-2 inline-block">
              Meet the Founder
            </h2>
            
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 bg-sifnos-deep-blue p-5 flex items-center justify-center">
                    <Avatar className="w-32 h-32 border-4 border-white">
                      <AvatarImage src="/uploads/seo-kasiotis-manager.jpg" alt="George Kasiotis" />
                      <AvatarFallback>GK</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="md:w-2/3 p-5">
                    <h3 className="text-2xl font-montserrat font-semibold mb-1">George Kasiotis</h3>
                    <p className="text-sifnos-turquoise font-medium mb-3 flex items-center">
                      <Award size={16} className="mr-2" /> Founder | SEO Manager & Data Analyst
                    </p>
                    <p className="text-gray-700">
                      The architect behind Touristas AI and the vision for Hotels Sifnos. With a career built on delivering SEO and data performance for global brands like JD Sports, Bvlgari, Mindvalley, Cosmos Sport, and multiple travel-tech ventures, George brings enterprise-level strategy to the heart of Sifnian hospitality.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Contact Section - More compact and visual */}
      <div className="py-10">
        <div className="page-container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-montserrat font-semibold mb-4 border-b-2 border-sifnos-beige pb-2 inline-block">
              Get in Touch
            </h2>
            <div className="text-center max-w-xl mx-auto">
              <p className="mb-4">
                Need help planning your stay in Sifnos? Looking for the perfect villa or hidden gem?
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-3 my-5">
                <Button variant="outline" className="flex items-center gap-2" asChild>
                  <a href="mailto:hello@hotelssifnos.com">
                    <Mail size={16} />
                    hello@hotelssifnos.com
                  </a>
                </Button>
                
                <Button variant="outline" className="flex items-center gap-2" asChild>
                  <a href="https://hotelssifnos.com">
                    <MapPin size={16} />
                    hotelssifnos.com
                  </a>
                </Button>
              </div>
              
              <div className="mt-6">
                <Button 
                  asChild
                  className="bg-sifnos-turquoise hover:bg-sifnos-deep-blue text-white px-8 py-6 rounded-lg transition-colors font-medium"
                >
                  <Link to="/contact">
                    <MessageCircle size={18} className="mr-2" />
                    Contact Us
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Closing Quote - More compact */}
      <div className="py-10 bg-sifnos-deep-blue text-white">
        <div className="page-container text-center">
          <blockquote className="max-w-2xl mx-auto text-xl italic">
            <span className="font-medium">Hotels Sifnos</span> – One island. Every stay. AI-personalized.
          </blockquote>
        </div>
      </div>
    </>
  );
}
