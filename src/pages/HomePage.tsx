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
        title="Best Sifnos Hotels 2025 - Luxury Beach Resorts & Boutique Stays"
        description="Discover Sifnos' finest hotels & accommodations. Book luxury beachfront resorts, traditional villas & boutique stays with best price guarantee. Exclusive deals, verified reviews & instant confirmation. Your perfect Cycladic island escape starts here."
        keywords={[
          'best sifnos hotels 2025', 'luxury sifnos resorts', 'sifnos accommodation', 
          'boutique hotels cyclades', 'beachfront hotels sifnos', 'sifnos villas',
          'book sifnos hotels', 'cyclades island hotels', 'greece luxury accommodation',
          'sifnos beach resorts', 'traditional greek hotels', 'instant booking sifnos'
        ]}
        pageType="homepage"
        schemaType="WebSite"
        canonical="https://hotelssifnos.com"
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
      
      {/* List Your Hotel Section */}
      <ListYourHotelSection />
      
      {/* Why Choose Us Section */}
      <WhyChooseUsSection />
      
      {/* SEO Section */}
      <SEOSection />
    </>
  );
}
