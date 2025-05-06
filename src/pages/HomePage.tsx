
import { useState } from 'react';
import SEO from '@/components/SEO';
import TouristasAIBanner from '@/components/TouristasAIBanner';

// Import our newly created component sections
import HeroSection from '@/components/home/HeroSection';
import FeaturedHotelsSection from '@/components/home/FeaturedHotelsSection';
import LocationsSection from '@/components/home/LocationsSection';
import HotelTypesSection from '@/components/home/HotelTypesSection';
import ListYourHotelSection from '@/components/home/ListYourHotelSection';
import WhyChooseUsSection from '@/components/home/WhyChooseUsSection';
import SEOSection from '@/components/home/SEOSection';

export default function HomePage() {
  return (
    <>
      <SEO 
        title="Find Your Perfect Stay in Sifnos - Best Hotels & Accommodation"
        description="Discover Sifnos' finest hotels with our curated selection of luxury resorts, boutique stays, and beachfront villas. Compare facilities, view photos, read verified reviews, and book directly with exclusive online rates. Your perfect Cycladic island getaway starts here."
        keywords={[
          'sifnos hotels', 'greek islands hotels', 'sifnos accommodation', 
          'luxury hotels sifnos', 'beach hotels sifnos', 'boutique hotels cyclades'
        ]}
        schemaType="Organization"
        canonical="https://hotelssifnos.com"
        imageUrl="/uploads/sifnos-hero.jpg"
      />
      
      {/* Hero Section with Search */}
      <HeroSection />

      {/* Featured Hotels Section */}
      <FeaturedHotelsSection />
      
      {/* Touristas AI Banner CTA Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <TouristasAIBanner />
        </div>
      </div>
      
      {/* Locations Section */}
      <LocationsSection />
      
      {/* Hotel Types Section */}
      <HotelTypesSection />
      
      {/* List Your Hotel Section */}
      <ListYourHotelSection />
      
      {/* Why Choose Us Section */}
      <WhyChooseUsSection />
      
      {/* SEO Section */}
      <SEOSection />
    </>
  );
}
