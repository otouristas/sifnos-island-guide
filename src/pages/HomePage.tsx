
import { useState, useMemo } from 'react';
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
import { useI18n } from '@/contexts/I18nContext';

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

export default function HomePage() {
  const { t } = useI18n();
  
  const quickLinks = useMemo(() => ([
    { to: '/hotels', label: t('quickLinks.allHotels'), icon: Building2 },
    { to: '/hotel-types/luxury-hotels', label: t('quickLinks.luxuryHotels'), icon: Sparkles },
    { to: '/hotel-types/villas', label: t('quickLinks.villas'), icon: Home },
    { to: '/hotel-types/beach-hotels', label: t('quickLinks.beachHotels'), icon: Waves },
    { to: '/ferry-tickets', label: t('quickLinks.ferryTickets'), icon: Ship },
    { to: '/where-to-stay-sifnos', label: t('quickLinks.whereToStay'), icon: MapPin },
  ]), [t]);

  const planningLinks = useMemo(() => ([
    {
      to: '/ferry-tickets',
      title: t('planning.ferryTicketsTitle'),
      description: t('planning.ferryTicketsDesc'),
      icon: Ship,
    },
    {
      to: '/best-beaches-sifnos-guide',
      title: t('planning.beachGuideTitle'),
      description: t('planning.beachGuideDesc'),
      icon: Waves,
    },
    {
      to: '/travel-guide',
      title: t('planning.travelGuideTitle'),
      description: t('planning.travelGuideDesc'),
      icon: BookOpenCheck,
    },
    {
      to: '/touristas-ai',
      title: t('planning.aiAssistantTitle'),
      description: t('planning.aiAssistantDesc'),
      icon: Bot,
    },
  ]), [t]);
  
  return (
    <>
      <SEO 
        title={t('meta.homepageTitle')}
        description={t('meta.homepageDescription')}
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
              name: t('common.home'),
              item: "https://hotelssifnos.com/"
            }
          ]
        }}
      />
      
      {/* 1. Hero Section */}
      <HeroSection />
      
      {/* 2. Featured Touristas AI */}
      <FeaturedTouristasAI />

      {/* 3. Quick Actions Bar */}
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

      {/* 4. Featured Hotels Carousel */}
      <FeaturedHotelsSection />
      
      {/* 4.5. Trending Now Section */}
      <TrendingNowSection />
      
      {/* 5. Discover Sifnos - Consolidated Locations */}
      <LocationsSection />
      
      {/* 5.5. Local Insights Section */}
      <LocalInsightsSection />
      
      {/* 5.6. Seasonal Recommendations */}
      <SeasonalRecommendationsSection />
      
      {/* 6. Hotel Categories - Consolidated */}
      <HotelTypesSection />
      
      {/* 7. Why Book With Us + Social Proof */}
      <WhyChooseUsSection />
      
      {/* 8. Travel Planning Hub + FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-sifnos-deep-blue mb-4">
              {t('planning.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('planning.subtitle')}
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
              {t('faq.title')}
            </h2>
            <div className="space-y-4">
              <details className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-sifnos-deep-blue text-lg">
                  <h3>{t('faq.q1')}</h3>
                  <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  {t('faq.a1')}
                </p>
              </details>
              <details className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-sifnos-deep-blue text-lg">
                  <h3>{t('faq.q2')}</h3>
                  <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  {t('faq.a2')}
                </p>
              </details>
              <details className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-sifnos-deep-blue text-lg">
                  <h3>{t('faq.q3')}</h3>
                  <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  {t('faq.a3')}
                </p>
              </details>
              <details className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-sifnos-deep-blue text-lg">
                  <h3>{t('faq.q4')}</h3>
                  <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  {t('faq.a4')}
                </p>
              </details>
              <details className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-sifnos-deep-blue text-lg">
                  <h3>{t('faq.q5')}</h3>
                  <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  {t('faq.a5')}
                </p>
              </details>
            </div>
            <div className="text-center mt-10">
              <Link to="/faq" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-sifnos-deep-blue text-sifnos-deep-blue rounded-xl hover:bg-sifnos-deep-blue hover:text-white transition-all duration-300 font-semibold text-lg hover:-translate-y-1 shadow-lg hover:shadow-xl">
                {t('faq.viewAllFaqs')}
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
              question: t('faq.q1'),
              answer: t('faq.a1')
            },
            {
              question: t('faq.q2'),
              answer: t('faq.a2')
            },
            {
              question: t('faq.q3'),
              answer: t('faq.a3')
            },
            {
              question: t('faq.q4'),
              answer: t('faq.a4')
            },
            {
              question: t('faq.q5'),
              answer: t('faq.a5')
            }
          ]
        }}
      />
    </>
  );
}
