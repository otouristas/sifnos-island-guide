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
        title="Find Your Perfect Stay in Sifnos - Best Hotels & Accommodation 2025"
        description="Discover Sifnos' finest hotels with our curated selection of luxury resorts, boutique stays, and beachfront villas. Compare facilities, view photos, read verified reviews, and book directly with exclusive online rates. Your perfect Cycladic island getaway starts here."
        keywords={[
          'sifnos hotels', 'greek islands hotels', 'sifnos accommodation', 
          'luxury hotels sifnos', 'beach hotels sifnos', 'boutique hotels cyclades',
          'where to stay in sifnos 2025', 'best sifnos hotels', 'sifnos villas'
        ]}
        schemaType="Organization"
        canonical="https://hotelssifnos.com"
        imageUrl="/uploads/sifnos-hero.jpg"
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
      
      {/* Hero Section with Search */}
      <HeroSection />

      {/* Featured Hotels Section - Enhanced to show ALK HOTEL and others */}
      <FeaturedHotelsSection />
      
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
      
      {/* Locations Section */}
      <LocationsSection />
      
      {/* Island Guide Section */}
      <IslandGuideSection />
      
      {/* Explore Map Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Explore Sifnos Island</h2>
            <p className="text-lg mb-8">
              Discover the beautiful island of Sifnos with our interactive map. Find the perfect location for your stay, explore beaches, attractions, and more.
            </p>
            <Link to="/explore-map" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-8 transition-colors duration-200">
              View Interactive Map
            </Link>
          </div>
        </div>
      </div>
      
      {/* List Your Hotel Section */}
      <ListYourHotelSection />
      
      {/* Why Choose Us Section */}
      <WhyChooseUsSection />
      
      {/* SEO Section */}
      <SEOSection />
    </>
  );
}
