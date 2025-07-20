
import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import TouristasAIBanner from '@/components/TouristasAIBanner';
import SponsoredHotelCard from '@/components/SponsoredHotelCard';
import SchemaGenerator from '@/components/SchemaGenerator';

// Import our component sections
import HeroSection from '@/components/home/HeroSection';
import FeaturedHotelsSection from '@/components/home/FeaturedHotelsSection';
import LocationsSection from '@/components/home/LocationsSection';
import LocationsIntroSection from '@/components/home/LocationsIntroSection';
import HotelTypesSection from '@/components/home/HotelTypesSection';
import HotelTypesIntroSection from '@/components/home/HotelTypesIntroSection';
import ListYourHotelSection from '@/components/home/ListYourHotelSection';
import WhyChooseUsSection from '@/components/home/WhyChooseUsSection';
import SEOSection from '@/components/home/SEOSection';
import IslandGuideSection from '@/components/home/IslandGuideSection';

export default function HomePage() {
  return (
    <>
      <SEO 
        title="Best Sifnos Hotels 2025 - Luxury Resorts & Villas | Instant Booking & Best Prices"
        description="Discover Sifnos' finest hotels, luxury villas & boutique resorts. Instant booking, best price guarantee, verified reviews & 24/7 support. Your perfect Cycladic escape starts here - book now & save!"
        keywords={[
          'best sifnos hotels 2025', 'luxury sifnos resorts', 'sifnos villas', 
          'boutique hotels cyclades', 'beachfront hotels sifnos', 'sifnos accommodation',
          'book sifnos hotels', 'cyclades island hotels', 'greece luxury accommodation',
          'sifnos beach resorts', 'traditional greek hotels', 'instant booking sifnos',
          'where to stay sifnos', 'sifnos hotel deals', 'premium sifnos stays'
        ]}
        pageType="homepage"
        schemaType="WebPage"
        canonical="https://hotelssifnos.com/"
        imageUrl="/uploads/homepage-hero.jpg"
      />
      
      {/* Enhanced Schema.org JSON-LD for Homepage */}
      <SchemaGenerator 
        pageType="Homepage"
        data={{
          breadcrumbs: [
            {
              name: "Home",
              item: "https://hotelssifnos.com/"
            }
          ]
        }}
      />
      
      {/* Hero Section with Enhanced Search */}
      <HeroSection />

      {/* Quick Links Bar - NEW for better internal linking */}
      <div className="bg-sifnos-deep-blue py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/hotels" className="text-white hover:text-sifnos-turquoise transition-colors px-3 py-1 rounded-full border border-white/20 hover:border-sifnos-turquoise">
              🏨 All Hotels
            </Link>
            <Link to="/hotel-types/luxury-hotels" className="text-white hover:text-sifnos-turquoise transition-colors px-3 py-1 rounded-full border border-white/20 hover:border-sifnos-turquoise">
              ✨ Luxury Hotels
            </Link>
            <Link to="/hotel-types/villas" className="text-white hover:text-sifnos-turquoise transition-colors px-3 py-1 rounded-full border border-white/20 hover:border-sifnos-turquoise">
              🏡 Private Villas
            </Link>
            <Link to="/locations/platis-gialos" className="text-white hover:text-sifnos-turquoise transition-colors px-3 py-1 rounded-full border border-white/20 hover:border-sifnos-turquoise">
              🏖️ Beach Hotels
            </Link>
            <Link to="/ferry-tickets" className="text-white hover:text-sifnos-turquoise transition-colors px-3 py-1 rounded-full border border-white/20 hover:border-sifnos-turquoise">
              ⛴️ Ferry Tickets
            </Link>
            <Link to="/where-to-stay-sifnos" className="text-white hover:text-sifnos-turquoise transition-colors px-3 py-1 rounded-full border border-white/20 hover:border-sifnos-turquoise">
              📍 Where to Stay
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Hotels Section - Enhanced with better CTAs */}
      <FeaturedHotelsSection />
      
      {/* Popular Categories Section - NEW for internal linking */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-montserrat font-bold text-sifnos-deep-blue mb-8 text-center">
            🌟 Popular Hotel Categories in Sifnos 2025
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link to="/hotel-types/luxury-hotels" className="group text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="font-semibold text-sifnos-deep-blue group-hover:text-sifnos-turquoise">Luxury Resorts</h3>
              <p className="text-sm text-gray-600 mt-1">Premium amenities & service</p>
            </Link>
            <Link to="/hotel-types/villas" className="group text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="text-4xl mb-3">🏡</div>
              <h3 className="font-semibold text-sifnos-deep-blue group-hover:text-sifnos-turquoise">Private Villas</h3>
              <p className="text-sm text-gray-600 mt-1">Exclusive luxury & privacy</p>
            </Link>
            <Link to="/hotel-types/beach-hotels" className="group text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="text-4xl mb-3">🏖️</div>
              <h3 className="font-semibold text-sifnos-deep-blue group-hover:text-sifnos-turquoise">Beach Hotels</h3>
              <p className="text-sm text-gray-600 mt-1">Oceanfront locations</p>
            </Link>
            <Link to="/hotel-types/family-friendly-hotels" className="group text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="text-4xl mb-3">👨‍👩‍👧‍👦</div>
              <h3 className="font-semibold text-sifnos-deep-blue group-hover:text-sifnos-turquoise">Family Hotels</h3>
              <p className="text-sm text-gray-600 mt-1">Kid-friendly facilities</p>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Hotel Types Introduction Text */}
      <HotelTypesIntroSection />
      
      {/* Hotel Types Section */}
      <HotelTypesSection />
      
      {/* Touristas AI Banner CTA Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <TouristasAIBanner />
        </div>
      </div>
      
      {/* Locations Introduction Text */}
      <LocationsIntroSection />
      
      {/* Top Destinations Grid - Enhanced with better internal linking */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-montserrat font-bold text-sifnos-deep-blue mb-8 text-center">
            🗺️ Best Areas to Stay in Sifnos Island
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link to="/locations/apollonia" className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
              <div className="h-48 bg-gradient-to-br from-sifnos-turquoise to-sifnos-deep-blue flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">🏛️</div>
                  <h3 className="text-xl font-bold">Apollonia</h3>
                  <p className="text-sm opacity-90">Capital & Nightlife</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-600 text-sm">Central location with restaurants, bars, and authentic Cycladic charm. Perfect for first-time visitors.</p>
              </div>
            </Link>
            <Link to="/locations/kamares" className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
              <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">⛵</div>
                  <h3 className="text-xl font-bold">Kamares</h3>
                  <p className="text-sm opacity-90">Port & Beach</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-600 text-sm">Main port with beachfront hotels, waterfront dining, and convenient ferry connections.</p>
              </div>
            </Link>
            <Link to="/locations/platis-gialos" className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
              <div className="h-48 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">🏖️</div>
                  <h3 className="text-xl font-bold">Platis Gialos</h3>
                  <p className="text-sm opacity-90">Best Beach</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-600 text-sm">Popular beach resort area with shallow waters, perfect for families and beach lovers.</p>
              </div>
            </Link>
          </div>
          <div className="text-center">
            <Link to="/where-to-stay-sifnos" className="inline-flex items-center px-6 py-3 bg-sifnos-turquoise text-white rounded-lg hover:bg-sifnos-deep-blue transition-colors font-medium">
              Complete Where to Stay Guide →
            </Link>
          </div>
        </div>
      </div>
      
      {/* Locations Section */}
      <LocationsSection />
      
      {/* Island Guide Section */}
      <IslandGuideSection />
      
      {/* Travel Planning Links - NEW section for better internal linking */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-montserrat font-bold text-sifnos-deep-blue mb-8 text-center">
            🎯 Plan Your Perfect Sifnos Trip
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/ferry-tickets" className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all group">
              <div className="text-4xl mb-4">⛴️</div>
              <h3 className="font-semibold text-sifnos-deep-blue group-hover:text-sifnos-turquoise mb-2">Ferry Tickets</h3>
              <p className="text-sm text-gray-600">Book your ferry to Sifnos with best prices</p>
            </Link>
            <Link to="/best-beaches-sifnos-guide" className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all group">
              <div className="text-4xl mb-4">🏖️</div>
              <h3 className="font-semibold text-sifnos-deep-blue group-hover:text-sifnos-turquoise mb-2">Beach Guide</h3>
              <p className="text-sm text-gray-600">Discover the best beaches & coastal hotels</p>
            </Link>
            <Link to="/travel-guide" className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all group">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="font-semibold text-sifnos-deep-blue group-hover:text-sifnos-turquoise mb-2">Travel Guide</h3>
              <p className="text-sm text-gray-600">Complete guide to attractions & activities</p>
            </Link>
            <Link to="/touristas-ai" className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all group">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="font-semibold text-sifnos-deep-blue group-hover:text-sifnos-turquoise mb-2">AI Assistant</h3>
              <p className="text-sm text-gray-600">Get personalized recommendations</p>
            </Link>
          </div>
        </div>
      </div>
      
      {/* List Your Hotel Section */}
      <ListYourHotelSection />
      
      {/* Why Choose Us Section */}
      <WhyChooseUsSection />
      
      {/* Enhanced SEO Section with better internal linking */}
      <SEOSection />

      {/* FAQ Section - NEW for SEO */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-montserrat font-bold text-sifnos-deep-blue mb-8 text-center">
              ❓ Frequently Asked Questions About Sifnos Hotels
            </h2>
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-sifnos-deep-blue mb-3">What are the best areas to stay in Sifnos?</h3>
                <p className="text-gray-700">The most popular areas are <Link to="/locations/apollonia" className="text-sifnos-turquoise hover:underline">Apollonia</Link> (capital with nightlife), <Link to="/locations/kamares" className="text-sifnos-turquoise hover:underline">Kamares</Link> (port with beach), and <Link to="/locations/platis-gialos" className="text-sifnos-turquoise hover:underline">Platis Gialos</Link> (best beach). Each offers different experiences and hotel options.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-sifnos-deep-blue mb-3">When is the best time to book Sifnos hotels?</h3>
                <p className="text-gray-700">Book 2-3 months in advance for summer (June-August) for best rates and availability. Spring (April-May) and fall (September-October) offer great weather with lower prices and fewer crowds.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-sifnos-deep-blue mb-3">Do you offer luxury villa rentals in Sifnos?</h3>
                <p className="text-gray-700">Yes! We feature exclusive <Link to="/hotel-types/villas" className="text-sifnos-turquoise hover:underline">luxury villas</Link> with private pools, sea views, and premium amenities. Perfect for families or groups seeking privacy and luxury.</p>
              </div>
            </div>
            <div className="text-center mt-8">
              <Link to="/faq" className="inline-flex items-center px-6 py-3 border-2 border-sifnos-turquoise text-sifnos-turquoise rounded-lg hover:bg-sifnos-turquoise hover:text-white transition-colors font-medium">
                View All FAQs →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
