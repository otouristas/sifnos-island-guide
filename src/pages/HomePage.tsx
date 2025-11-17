
import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import SponsoredHotelCard from '@/components/SponsoredHotelCard';
import SchemaGenerator from '@/components/SchemaGenerator';
import {
  Building2,
  Sparkles,
  Home,
  Waves,
  Ship,
  MapPin,
  BookOpenCheck,
  Bot,
} from 'lucide-react';

// Import our component sections
import HeroSection from '@/components/home/HeroSection';
import FeaturedTouristasAI from '@/components/home/FeaturedTouristasAI';
import FeaturedHotelsSection from '@/components/home/FeaturedHotelsSection';
import LocationsSection from '@/components/home/LocationsSection';
import HotelTypesSection from '@/components/home/HotelTypesSection';
import WhyChooseUsSection from '@/components/home/WhyChooseUsSection';
import LocalInsightsSection from '@/components/home/LocalInsightsSection';
import TrendingNowSection from '@/components/home/TrendingNowSection';
import SeasonalRecommendationsSection from '@/components/home/SeasonalRecommendationsSection';
import StickyBookingWidget from '@/components/booking/StickyBookingWidget';
import TrustBadges from '@/components/shared/TrustBadges';
import ExitIntentPopup from '@/components/shared/ExitIntentPopup';
import TouristasAIBanner from '@/components/shared/TouristasAIBanner';

const quickLinks = [
  { to: '/hotels', label: 'All Hotels', icon: Building2 },
  { to: '/hotel-types/luxury-hotels', label: 'Luxury Hotels', icon: Sparkles },
  { to: '/hotel-types/villas', label: 'Private Villas', icon: Home },
  { to: '/hotel-types/beach-hotels', label: 'Beach Hotels', icon: Waves },
  { to: '/ferry-tickets', label: 'Ferry Tickets', icon: Ship },
  { to: '/where-to-stay-sifnos', label: 'Where to Stay', icon: MapPin },
];

const planningLinks = [
  {
    to: '/ferry-tickets',
    title: 'Ferry Tickets',
    description: 'Book your ferry to Sifnos with best prices',
    icon: Ship,
  },
  {
    to: '/best-beaches-sifnos-guide',
    title: 'Beach Guide',
    description: 'Discover the best beaches & coastal hotels',
    icon: Waves,
  },
  {
    to: '/travel-guide',
    title: 'Travel Guide',
    description: 'Complete guide to attractions & activities',
    icon: BookOpenCheck,
  },
  {
    to: '/touristas-ai',
    title: 'AI Assistant',
    description: 'Get personalized recommendations',
    icon: Bot,
  },
];

export default function HomePage() {
  return (
    <>
      <SEO 
        title="Sifnos Hotels 2026: Boutique Stays, Villas & Beach Resorts"
        description="Discover authentic Sifnos hotels, from luxury villas with pools to family-friendly beach resorts. Expert local guides + best rates. Book your Cycladic escape."
        keywords={[
          'sifnos hotels 2026', 'sifnos villas 2026', 'best sifnos hotels', 
          'luxury sifnos resorts', 'sifnos accommodation', 'sifnos boutique hotels',
          'beachfront hotels sifnos', 'family hotels sifnos', 'where to stay in sifnos',
          'cyclades island hotels', 'greece island accommodation'
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
      
      {/* 1. Hero Section */}
      <HeroSection />
      
      {/* 2. Trust Badges */}
      <section className="py-12 bg-secondary/20">
        <div className="max-w-[1400px] mx-auto px-6">
          <TrustBadges />
        </div>
      </section>

      {/* 3. Featured Touristas AI */}
      <section className="py-16 bg-background">
        <div className="max-w-[1400px] mx-auto px-6">
          <TouristasAIBanner variant="inline" />
        </div>
      </section>

      {/* 4. Quick Actions Bar */}
      <div className="bg-sifnos-deep-blue py-5">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-3">
            {quickLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={label}
                to={to}
                className="inline-flex items-center gap-2 text-sifnos-beige border border-sifnos-beige/30 hover:bg-sifnos-beige hover:text-sifnos-deep-blue transition-all duration-300 px-5 py-2.5 rounded-full font-medium text-sm"
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Featured Hotels Carousel */}
      <FeaturedHotelsSection />
      
      {/* 6. Trending Now Section */}
      <TrendingNowSection />
      
      {/* 7. Discover Sifnos - Consolidated Locations */}
      <LocationsSection />
      
      {/* 8. Local Insights Section */}
      <LocalInsightsSection />
      
      {/* 9. Seasonal Recommendations */}
      <SeasonalRecommendationsSection />
      
      {/* 10. Hotel Categories - Consolidated */}
      <HotelTypesSection />
      
      {/* 11. Why Book With Us + Social Proof */}
      <WhyChooseUsSection />
      
      {/* 12. Travel Planning Hub + FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-sifnos-deep-blue mb-4">
              Plan Your Perfect Sifnos Trip
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need for an unforgettable island experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {planningLinks.map(({ to, title, description, icon: Icon }) => (
              <Link 
                key={title} 
                to={to} 
                className="group text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-sifnos-beige/30 text-sifnos-deep-blue group-hover:bg-sifnos-beige group-hover:scale-110 transition-all duration-300">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="font-heading font-bold text-sifnos-deep-blue mb-2 text-lg">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
              </Link>
            ))}
          </div>
          
          {/* FAQ Accordion - SEO Optimized for Featured Snippets */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-sifnos-deep-blue mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <details className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-sifnos-deep-blue text-lg">
                  <h3>What is the best area to stay in Sifnos?</h3>
                  <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  The best area to stay in Sifnos depends on your travel style. <Link to="/locations/platis-gialos" className="text-sifnos-deep-blue hover:underline font-medium">Platis Gialos</Link> offers the longest beach with family-friendly hotels. <Link to="/locations/apollonia" className="text-sifnos-deep-blue hover:underline font-medium">Apollonia</Link> provides central access and nightlife. <Link to="/locations/artemonas" className="text-sifnos-deep-blue hover:underline font-medium">Artemonas</Link> attracts couples seeking elegant village atmosphere. <Link to="/locations/kamares" className="text-sifnos-deep-blue hover:underline font-medium">Kamares</Link> suits travelers wanting port convenience.
                </p>
              </details>
              <details className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-sifnos-deep-blue text-lg">
                  <h3>How many days do you need in Sifnos?</h3>
                  <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  Most travelers need 3-4 days in Sifnos to experience the island properly. This allows time to visit the best beaches (Platis Gialos, Kamares, Vathi), explore historic villages (Kastro, Apollonia), enjoy the renowned food scene, and take a pottery workshop.
                </p>
              </details>
              <details className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-sifnos-deep-blue text-lg">
                  <h3>Is Sifnos expensive?</h3>
                  <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  Sifnos offers accommodation for all budgets. Budget hotels start around €40-€80 per night, mid-range options range €80-€150, while luxury hotels and villas cost €200-€500+ per night. Dining costs €25-€80 per day depending on preferences. Overall, Sifnos is more affordable than Mykonos or Santorini.
                </p>
              </details>
              <details className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-sifnos-deep-blue text-lg">
                  <h3>When is the best time to visit Sifnos?</h3>
                  <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  The best time to visit Sifnos is from May to October when the weather is warm and ideal for swimming. July and August are peak months with higher temperatures and crowds. For a more peaceful experience with pleasant weather, consider visiting in June or September when the sea is still warm but the crowds have thinned out.
                </p>
              </details>
              <details className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-sifnos-deep-blue text-lg">
                  <h3>How do I get to Sifnos from Athens?</h3>
                  <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  Sifnos is accessible by ferry from Piraeus port in Athens. The journey takes approximately 2.5 to 5 hours depending on the type of ferry (high-speed or conventional). There is no airport on Sifnos, so sea travel is the only option. <Link to="/ferry-tickets" className="text-sifnos-deep-blue hover:underline font-medium">Book ferry tickets</Link> in advance during peak season.
                </p>
              </details>
            </div>
            <div className="text-center mt-10">
              <Link to="/faq" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-sifnos-deep-blue text-sifnos-deep-blue rounded-xl hover:bg-sifnos-deep-blue hover:text-white transition-all duration-300 font-semibold text-lg hover:-translate-y-1 shadow-lg hover:shadow-xl">
                View All FAQs
                <span className="text-xl">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Schema for Featured Snippets */}
      <SchemaGenerator
        pageType="FAQ"
        data={{
          faq: [
            {
              question: 'What is the best area to stay in Sifnos?',
              answer: 'The best area to stay in Sifnos depends on your travel style. Platis Gialos offers the longest beach with family-friendly hotels. Apollonia provides central access and nightlife. Artemonas attracts couples seeking elegant village atmosphere. Kamares suits travelers wanting port convenience.'
            },
            {
              question: 'How many days do you need in Sifnos?',
              answer: 'Most travelers need 3-4 days in Sifnos to experience the island properly. This allows time to visit the best beaches (Platis Gialos, Kamares, Vathi), explore historic villages (Kastro, Apollonia), enjoy the renowned food scene, and take a pottery workshop.'
            },
            {
              question: 'Is Sifnos expensive?',
              answer: 'Sifnos offers accommodation for all budgets. Budget hotels start around €40-€80 per night, mid-range options range €80-€150, while luxury hotels and villas cost €200-€500+ per night. Dining costs €25-€80 per day depending on preferences. Overall, Sifnos is more affordable than Mykonos or Santorini.'
            },
            {
              question: 'When is the best time to visit Sifnos?',
              answer: 'The best time to visit Sifnos is from May to October when the weather is warm and ideal for swimming. July and August are peak months with higher temperatures and crowds. For a more peaceful experience with pleasant weather, consider visiting in June or September when the sea is still warm but the crowds have thinned out.'
            },
            {
              question: 'How do I get to Sifnos from Athens?',
              answer: 'Sifnos is accessible by ferry from Piraeus port in Athens. The journey takes approximately 2.5 to 5 hours depending on the type of ferry (high-speed or conventional). There is no airport on Sifnos, so sea travel is the only option. Book ferry tickets in advance during peak season.'
            }
          ]
        }}
      />
      
      {/* Sticky Booking Widget */}
      <StickyBookingWidget />
      
      {/* Exit Intent Popup */}
      <ExitIntentPopup />
    </>
  );
}
