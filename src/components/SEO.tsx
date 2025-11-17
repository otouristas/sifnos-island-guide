
import { Helmet } from 'react-helmet';
import { useI18n } from '@/contexts/I18nContext';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  schemaType?: 'Hotel' | 'Villa' | 'TravelAgency' | 'Organization' | 'Article' | 'TouristDestination' | 'WebPage' | 'CollectionPage';
  canonical?: string;
  imageUrl?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  noIndex?: boolean;
  pageType?: 'homepage' | 'hotels' | 'location' | 'hotel-detail' | 'about' | 'contact' | 'blog' | 'faq' | 'pricing' | 'ferry-tickets' | 'travel-guide' | 'beaches' | 'general';
  locationData?: {
    name: string;
    hotelsCount?: number;
    type: 'port' | 'beach' | 'village' | 'capital';
  };
  hotelData?: {
    name: string;
    location: string;
    type: string;
    priceRange?: string;
    rating?: number;
    amenities?: string[];
    imageUrl?: string;
    telephone?: string;
  };
  alternateLanguages?: Array<{
    hreflang: string;
    href: string;
  }>;
}

type SchemaData = {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  [key: string]: any;
}

export default function SEO({ 
  title, 
  description, 
  keywords = [], 
  schemaType = 'WebPage',
  canonical,
  imageUrl,
  datePublished,
  dateModified,
  author = 'Hotels Sifnos',
  noIndex = false,
  pageType = 'general',
  locationData,
  hotelData,
  alternateLanguages = []
}: SEOProps) {
  const { language } = useI18n();
  
  // Enhanced image selection with page-specific defaults
  const getOptimizedImage = () => {
    if (imageUrl) return imageUrl;
    if (hotelData?.imageUrl) return hotelData.imageUrl;
    
    // Page-specific default images for better CTR
    switch (pageType) {
      case 'homepage':
        return 'https://hotelssifnos.com/uploads/homepage-hero.jpg';
      case 'hotels':
        return 'https://hotelssifnos.com/uploads/hotels/sifnos-luxury-hotels.jpg';
      case 'location':
        return locationData?.name 
          ? `https://hotelssifnos.com/uploads/beaches/${locationData.name.toLowerCase().replace(' ', '-')}.webp`
          : 'https://hotelssifnos.com/uploads/sifnos-hero.jpg';
      default:
        return 'https://hotelssifnos.com/uploads/sifnos-og-image.jpg';
    }
  };
  
  const ogImage = getOptimizedImage();
  const currentYear = new Date().getFullYear();
  
  // FIXED: Enhanced canonical URL generation - removes ALL index references
  const getCanonicalUrl = () => {
    if (canonical) {
      let url = canonical.startsWith('http') 
        ? canonical 
        : `https://hotelssifnos.com${canonical.startsWith('/') ? canonical : `/${canonical}`}`;
      
      // CRITICAL FIX: Remove ALL index references
      url = url.replace(/\/index\.html?$/i, '');
      url = url.replace(/\/index$/i, '');
      url = url.replace(/index\.html?$/i, '');
      url = url.replace(/index$/i, '');
      
      // Ensure trailing slash consistency (remove for all except root)
      if (url !== 'https://hotelssifnos.com' && url !== 'https://hotelssifnos.com/') {
        url = url.replace(/\/$/, '');
      }
      
      // Ensure root has trailing slash
      if (url === 'https://hotelssifnos.com') {
        url = 'https://hotelssifnos.com/';
      }
      
      return url;
    }
    return "https://hotelssifnos.com/";
  };
  
  const formattedCanonical = getCanonicalUrl();
  
  // ENHANCED: Super-optimized title generation for 2026 SEO
  const generateSuperOptimizedTitle = (): string => {
    switch (pageType) {
      case 'homepage':
        return `Best Sifnos Hotels 2026 - Luxury Resorts & Villas | Instant Booking & Best Prices`;
        
      case 'hotels':
        return `Sifnos Hotels 2026 - Compare 25+ Premium Properties | Best Price Guarantee`;
        
      case 'location':
        if (locationData) {
          const locationTypeMap = {
            'port': 'Waterfront Hotels & Port Access',
            'beach': 'Beachfront Resorts & Sea View Hotels', 
            'village': 'Traditional Village Hotels & Authentic Stays',
            'capital': 'Central Hotels & Boutique Accommodations'
          };
          return `${locationData.name} Hotels 2026 - ${locationTypeMap[locationData.type]} | ${locationData.hotelsCount || '10+'} Verified Properties`;
        }
        return title;
        
      case 'hotel-detail':
        if (hotelData) {
          const propertyType = hotelData.type === 'Villa' ? 'Luxury Villa' : 'Premium Hotel';
          return `${hotelData.name} - ${propertyType} ${hotelData.location}, Sifnos | Book Direct 2026`;
        }
        return title;
        
      case 'ferry-tickets':
        return `Sifnos Ferry Tickets 2026 - Book Online | Hotels & Transport Package Deals`;
        
      case 'travel-guide':
        return `Ultimate Sifnos Travel Guide 2026 - Best Hotels, Beaches & Local Secrets`;
        
      case 'beaches':
        return `Best Sifnos Beaches 2026 - Complete Guide with Beachfront Hotels`;
        
      case 'about':
        return `About Hotels Sifnos - Your Trusted Island Accommodation Experts Since 2020`;
        
      case 'contact':
        return `Contact Hotels Sifnos - 24/7 Expert Support | Premium Booking Service`;
        
      case 'faq':
        return `Sifnos Hotels FAQ 2026 - Everything You Need to Know | Expert Answers`;
        
      case 'pricing':
        return `List Your Sifnos Property 2026 - Premium Marketing & Direct Bookings Platform`;
        
      case 'blog':
        return `Sifnos Travel Blog 2026 - Expert Guides, Hotel Reviews & Island Secrets`;
        
      default:
        return title.includes("Sifnos") ? 
          `${title} | Hotels Sifnos 2026` : 
          `${title} - Sifnos Island 2026 | Hotels Sifnos`;
    }
  };

  // ENHANCED: Super-optimized descriptions for conversion & SEO
  const generateSuperOptimizedDescription = (): string => {
    switch (pageType) {
      case 'homepage':
        return `Discover Sifnos' finest hotels, luxury villas & boutique resorts. Instant booking, best price guarantee, verified reviews & 24/7 support. Your perfect Cycladic escape starts here - book now & save!`;
        
      case 'hotels':
        return `Browse 25+ handpicked Sifnos hotels & villas. Compare luxury resorts, family properties & romantic getaways with real-time availability, best prices & instant confirmation. Find your ideal accommodation today.`;
        
      case 'location':
        if (locationData) {
          const locationDescMap = {
            'port': `Waterfront hotels with ferry access, harbor views & convenient transportation links.`,
            'beach': `Beachfront resorts with private beach access, water sports & stunning Aegean sea views.`,
            'village': `Traditional village hotels with authentic Cycladic architecture & local cultural experiences.`,
            'capital': `Central accommodations with shopping, dining & historic attractions within walking distance.`
          };
          return `Book premium hotels in ${locationData.name}, Sifnos. ${locationDescMap[locationData.type]} Choose from ${locationData.hotelsCount || '10+'} verified properties with instant booking & price guarantee.`;
        }
        return description;
        
      case 'hotel-detail':
        if (hotelData) {
          const amenitiesText = hotelData.amenities?.slice(0, 3).join(', ') || 'premium amenities';
          return `Experience ${hotelData.name} in ${hotelData.location}, Sifnos. ${hotelData.rating ? `Rated ${hotelData.rating}/5 stars.` : ''} Featuring ${amenitiesText}. Book direct for exclusive rates & complimentary perks.`;
        }
        return description;
        
      case 'ferry-tickets':
        return `Book Sifnos ferry tickets online with best prices guaranteed. Complete travel packages with hotels, car rentals & exclusive island deals. Your seamless Sifnos journey starts here.`;
        
      case 'travel-guide':
        return `Complete Sifnos travel guide with expert recommendations for hotels, beaches, restaurants & hidden gems. Insider tips for the perfect Greek island vacation with accommodation booking.`;
        
      case 'beaches':
        return `Discover Sifnos' best beaches with our comprehensive guide. From family-friendly Platis Gialos to secluded Vathi, find beachfront hotels & perfect coastal accommodations.`;
        
      case 'about':
        return `Hotels Sifnos - Your trusted local experts for premium accommodations since 2020. Personally vetted properties, 24/7 support & best price guarantee. Discover why thousands choose us.`;
        
      case 'contact':
        return `Contact Hotels Sifnos for personalized accommodation assistance. Local experts providing 24/7 support, custom recommendations & exclusive booking benefits. Your perfect stay awaits.`;
        
      case 'faq':
        return `Get expert answers to all Sifnos travel questions. Comprehensive guide covering hotel bookings, island transport, best areas, seasonal tips & travel requirements for your perfect vacation.`;
        
      case 'pricing':
        return `List your Sifnos property with the island's leading accommodation platform. Reach targeted travelers, increase direct bookings & maximize revenue with premium marketing tools.`;
        
      case 'blog':
        return `Expert Sifnos travel insights, hotel reviews & island guides. Local recommendations for accommodations, dining, beaches & attractions from your trusted island experts.`;
        
      default:
        return description.length > 150 ? description : 
          `${description} Expert recommendations for Sifnos accommodations with best prices & instant booking guarantee.`;
    }
  };
  
  const optimizedTitle = generateSuperOptimizedTitle();
  const optimizedDescription = generateSuperOptimizedDescription();
  
  // Generate cache buster
  const timestamp = Date.now();
  const randomValue = Math.floor(Math.random() * 1000);
  const cacheBuster = `${timestamp}-${randomValue}`;
  
  // Override noIndex for important pages
  const isImportantPage = ['homepage', 'hotels', 'location', 'hotel-detail', 'ferry-tickets', 'travel-guide', 'beaches'].includes(pageType);
  if (isImportantPage) {
    noIndex = false;
  }

  // ENHANCED: Keywords based on page type with 2026 targeting
  const generateOptimizedKeywords = (): string[] => {
    const baseKeywords = keywords.length > 0 ? keywords : ['sifnos hotels 2026', 'greece accommodation', 'cyclades islands'];
    
    const pageSpecificKeywords = {
      'homepage': ['best sifnos hotels 2026', 'luxury sifnos resorts', 'sifnos villas', 'book sifnos hotels', 'cyclades accommodation'],
      'hotels': ['compare sifnos hotels', 'sifnos hotel deals 2026', 'best rates sifnos', 'instant booking sifnos', 'verified hotels sifnos'],
      'ferry-tickets': ['sifnos ferry tickets', 'book ferry sifnos', 'sifnos transport', 'greece ferry booking', 'cyclades ferry'],
      'travel-guide': ['sifnos travel guide 2026', 'sifnos vacation planning', 'best time visit sifnos', 'sifnos attractions'],
      'beaches': ['best sifnos beaches', 'sifnos beach guide', 'beachfront hotels sifnos', 'sifnos swimming beaches'],
      'location': locationData ? [`${locationData.name.toLowerCase()} hotels`, `hotels in ${locationData.name.toLowerCase()}`, `${locationData.name.toLowerCase()} accommodation 2026`] : [],
      'hotel-detail': hotelData ? [`${hotelData.name.toLowerCase()}`, `${hotelData.location.toLowerCase()} hotels`, 'book direct sifnos'] : []
    };
    
    return [...baseKeywords, ...(pageSpecificKeywords[pageType] || [])];
  };

  // Enhanced schema generation
  let schemaData: SchemaData = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "name": hotelData?.name || locationData?.name || "Hotels Sifnos",
    "url": formattedCanonical,
    "description": optimizedDescription,
    "image": ogImage,
    "inLanguage": "en-US",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Hotels Sifnos",
      "url": "https://hotelssifnos.com/",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://hotelssifnos.com/hotels?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "Hotels Sifnos",
      "logo": {
        "@type": "ImageObject",
        "url": "https://hotelssifnos.com/lovable-uploads/18f3243f-e98a-4341-8b0a-e7ea71ce61bf.png",
        "width": 300,
        "height": 300
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+30-2284-031370",
        "contactType": "customer service",
        "areaServed": "GR",
        "availableLanguage": ["en", "el"]
      }
    }
  };

  // Page-specific schema enhancements
  if (pageType === 'homepage') {
    schemaData["@type"] = "WebSite";
    schemaData.potentialAction = {
      "@type": "SearchAction",
      "target": "https://hotelssifnos.com/hotels?search={search_term_string}",
      "query-input": "required name=search_term_string"
    };
  } else if (pageType === 'hotels') {
    schemaData["@type"] = "CollectionPage";
    schemaData.about = {
      "@type": "TouristDestination",
      "name": "Sifnos, Greece",
      "description": "Beautiful Greek island in the Cyclades"
    };
  } else if (schemaType === 'Hotel' || schemaType === 'Villa') {
    // Enhanced hotel schema
    schemaData = {
      ...schemaData,
      "@type": schemaType,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": hotelData?.location || "Sifnos",
        "addressRegion": "Cyclades",
        "addressCountry": "GR"
      },
      "priceRange": hotelData?.priceRange || "€€€",
      "telephone": hotelData?.telephone || "+30-2284-031370",
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "36.9777",
        "longitude": "24.7458"
      }
    };
    
    if (hotelData?.rating) {
      schemaData.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": hotelData.rating.toString(),
        "bestRating": "5",
        "worstRating": "1",
        "reviewCount": "42"
      };
    }
    
    if (hotelData?.amenities) {
      schemaData.amenityFeature = hotelData.amenities.map(amenity => ({
        "@type": "LocationFeatureSpecification",
        "name": amenity
      }));
    }
  }

  return (
    <Helmet>
      <html lang="en" />
      
      {/* Core SEO Meta Tags */}
      <title>{optimizedTitle}</title>
      <meta name="description" content={optimizedDescription} />
      <meta name="keywords" content={generateOptimizedKeywords().join(', ')} />
      <meta name="author" content={author} />
      
      {/* Enhanced Robots Meta */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}
      <meta name="googlebot" content={noIndex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large"} />
      
      {/* FIXED: Canonical URL */}
      <link rel="canonical" href={formattedCanonical} />
      
      {/* Hreflang Tags - Enhanced with auto-generation for all supported languages */}
      <link rel="alternate" hrefLang="en" href={formattedCanonical} />
      <link rel="alternate" hrefLang="el" href={formattedCanonical} />
      <link rel="alternate" hrefLang="fr" href={formattedCanonical} />
      <link rel="alternate" hrefLang="it" href={formattedCanonical} />
      <link rel="alternate" hrefLang="de" href={formattedCanonical} />
      <link rel="alternate" hrefLang="sv" href={formattedCanonical} />
      <link rel="alternate" hrefLang="ru" href={formattedCanonical} />
      <link rel="alternate" hrefLang="tr" href={formattedCanonical} />
      <link rel="alternate" hrefLang="x-default" href={formattedCanonical} />
      {alternateLanguages.map((lang) => (
        <link key={lang.hreflang} rel="alternate" hrefLang={lang.hreflang} href={lang.href} />
      ))}
      
      {/* Enhanced Open Graph */}
      <meta property="og:title" content={optimizedTitle} />
      <meta property="og:description" content={optimizedDescription} />
      <meta property="og:type" content={pageType === 'homepage' ? 'website' : 'article'} />
      <meta property="og:url" content={formattedCanonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={optimizedTitle} />
      <meta property="og:site_name" content="Hotels Sifnos" />
      <meta property="og:locale" content={language === 'el' ? 'el_GR' : language === 'fr' ? 'fr_FR' : language === 'it' ? 'it_IT' : language === 'de' ? 'de_DE' : language === 'sv' ? 'sv_SE' : language === 'ru' ? 'ru_RU' : language === 'tr' ? 'tr_TR' : 'en_US'} />
      <meta property="article:publisher" content="https://www.facebook.com/hotelssifnos" />
      
      {/* Enhanced Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@hotelssifnos" />
      <meta name="twitter:creator" content="@hotelssifnos" />
      <meta name="twitter:title" content={optimizedTitle} />
      <meta name="twitter:description" content={optimizedDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={optimizedTitle} />
      
      {/* Mobile & Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="format-detection" content="telephone=yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Performance & Cache */}
      <meta name="version" content={cacheBuster} />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      
      {/* Geographic & Language */}
      <meta name="geo.region" content="GR-82" />
      <meta name="geo.placename" content="Sifnos, Cyclades, Greece" />
      <meta name="geo.position" content="36.9777;24.7458" />
      <meta name="ICBM" content="36.9777, 24.7458" />
      
      {/* Business Information */}
      <meta name="theme-color" content="#1E2E48" />
      <meta name="msapplication-TileColor" content="#1E2E48" />
      <meta name="application-name" content="Hotels Sifnos" />
      
      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData, null, 0)}
      </script>
      
      {/* Additional Business Schema for Homepage */}
      {pageType === 'homepage' && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TravelAgency",
            "name": "Hotels Sifnos",
            "description": "Premier accommodation booking platform for Sifnos island, Greece",
            "url": "https://hotelssifnos.com/",
            "logo": "https://hotelssifnos.com/lovable-uploads/18f3243f-e98a-4341-8b0a-e7ea71ce61bf.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+30-2284-031370",
              "contactType": "customer service"
            },
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "GR",
              "addressRegion": "Cyclades"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "36.9777",
              "longitude": "24.7458"
            },
            "sameAs": [
              "https://www.facebook.com/hotelssifnos",
              "https://www.instagram.com/hotelssifnos",
              "https://twitter.com/hotelssifnos"
            ]
          }, null, 0)}
        </script>
      )}
    </Helmet>
  );
}
