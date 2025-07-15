import { Helmet } from 'react-helmet';

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
  pageType?: 'homepage' | 'hotels' | 'location' | 'hotel-detail' | 'about' | 'contact' | 'blog' | 'faq' | 'pricing' | 'general';
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
  
  // Enhanced canonical URL generation
  const getCanonicalUrl = () => {
    if (canonical) {
      let url = canonical.startsWith('http') 
        ? canonical 
        : `https://hotelssifnos.com${canonical.startsWith('/') ? canonical : `/${canonical}`}`;
      
      // Remove any trailing /index.html or /index
      url = url.replace(/\/index\.html?$/, '');
      // Ensure trailing slash consistency (remove for all except root)
      if (url !== 'https://hotelssifnos.com') {
        url = url.replace(/\/$/, '');
      }
      
      return url;
    }
    return "https://hotelssifnos.com";
  };
  
  const formattedCanonical = getCanonicalUrl();
  
  // Super-optimized title generation for SEO & CRO
  const generateSuperOptimizedTitle = (): string => {
    switch (pageType) {
      case 'homepage':
        return `Best Sifnos Hotels ${currentYear} - Luxury Beach Resorts & Boutique Stays | Book Direct & Save`;
        
      case 'hotels':
        return `Sifnos Hotels ${currentYear} - Compare ${locationData?.hotelsCount || '25+'} Properties | Best Prices Guaranteed`;
        
      case 'location':
        if (locationData) {
          const locationTypeMap = {
            'port': 'Port Hotels & Waterfront Stays',
            'beach': 'Beachfront Hotels & Resorts', 
            'village': 'Traditional Village Hotels',
            'capital': 'Capital City Hotels & Boutique Stays'
          };
          return `${locationData.name} Hotels ${currentYear} - ${locationTypeMap[locationData.type]} | ${locationData.hotelsCount || '10+'} Properties`;
        }
        return title;
        
      case 'hotel-detail':
        if (hotelData) {
          const propertyType = hotelData.type === 'Villa' ? 'Luxury Villa' : 'Boutique Hotel';
          return `${hotelData.name} - ${propertyType} in ${hotelData.location}, Sifnos | Book Direct ${currentYear}`;
        }
        return title;
        
      case 'about':
        return `About Hotels Sifnos - Your Trusted Sifnos Accommodation Experts Since 2020`;
        
      case 'contact':
        return `Contact Hotels Sifnos - 24/7 Support | Book Your Perfect Sifnos Stay Today`;
        
      case 'faq':
        return `Sifnos Hotels FAQ - Everything You Need to Know | Booking, Travel & Island Guide`;
        
      case 'pricing':
        return `List Your Sifnos Hotel ${currentYear} - Premium Marketing & Direct Bookings | Hotels Sifnos`;
        
      default:
        return title.includes("Sifnos") ? 
          `${title} | Hotels Sifnos` : 
          `${title} - Sifnos ${currentYear} | Hotels Sifnos`;
    }
  };

  // Super-optimized descriptions for conversion
  const generateSuperOptimizedDescription = (): string => {
    switch (pageType) {
      case 'homepage':
        return `Discover Sifnos' finest hotels & accommodations. Book luxury beachfront resorts, traditional villas & boutique stays with best price guarantee. Exclusive deals, verified reviews & instant confirmation. Your perfect Cycladic island escape starts here.`;
        
      case 'hotels':
        return `Browse ${locationData?.hotelsCount || '25+'} carefully selected Sifnos hotels. Compare luxury resorts, family-friendly properties & romantic getaways. Real-time availability, best prices & instant booking. Find your ideal Sifnos accommodation today.`;
        
      case 'location':
        if (locationData) {
          const locationDescMap = {
            'port': `Port area hotels with easy ferry access, waterfront dining & convenient transportation.`,
            'beach': `Beachfront properties with private beach access, water sports & stunning sea views.`,
            'village': `Authentic village accommodations with traditional architecture & local culture.`,
            'capital': `Central location hotels with shopping, dining & historic attractions nearby.`
          };
          return `Book hotels in ${locationData.name}, Sifnos. ${locationDescMap[locationData.type]} Choose from ${locationData.hotelsCount || '10+'} verified properties with instant confirmation & best price guarantee.`;
        }
        return description;
        
      case 'hotel-detail':
        if (hotelData) {
          const amenitiesText = hotelData.amenities?.slice(0, 3).join(', ') || 'premium amenities';
          return `Experience ${hotelData.name} in ${hotelData.location}, Sifnos. ${hotelData.rating ? `Rated ${hotelData.rating}/5 stars.` : ''} Featuring ${amenitiesText}. Book direct for best rates, free cancellation & exclusive perks.`;
        }
        return description;
        
      case 'about':
        return `Hotels Sifnos - Your trusted local experts for Sifnos accommodations since 2020. We personally vet every property, offer 24/7 support & guarantee the best experience. Discover why thousands choose us for their Sifnos getaway.`;
        
      case 'contact':
        return `Contact Hotels Sifnos for personalized assistance with your Sifnos accommodation. Our local experts provide 24/7 support, custom recommendations & exclusive booking benefits. Get in touch for your perfect island escape.`;
        
      case 'faq':
        return `Get answers to all your Sifnos travel questions. Comprehensive guide covering hotel bookings, island transportation, best areas to stay, seasonal tips & travel requirements. Plan your perfect Sifnos vacation with expert advice.`;
        
      case 'pricing':
        return `List your Sifnos hotel with the island's leading accommodation platform. Reach thousands of travelers, increase direct bookings & maximize revenue. Premium marketing tools, dedicated support & competitive commission rates.`;
        
      default:
        return description.length > 150 ? description : 
          `${description} Discover the best of Sifnos with Hotels Sifnos - your trusted accommodation experts.`;
    }
  };
  
  const optimizedTitle = generateSuperOptimizedTitle();
  const optimizedDescription = generateSuperOptimizedDescription();
  
  // Generate cache buster
  const timestamp = Date.now();
  const randomValue = Math.floor(Math.random() * 1000);
  const cacheBuster = `${timestamp}-${randomValue}`;
  
  // Override noIndex for important pages
  const isImportantPage = ['homepage', 'hotels', 'location', 'hotel-detail'].includes(pageType);
  if (isImportantPage) {
    noIndex = false;
  }

  // Enhanced keywords based on page type
  const generateOptimizedKeywords = (): string[] => {
    const baseKeywords = keywords.length > 0 ? keywords : ['sifnos hotels', 'greece accommodation', 'cyclades islands'];
    
    const pageSpecificKeywords = {
      'homepage': ['best sifnos hotels', 'luxury sifnos resorts', 'book sifnos hotels', `sifnos accommodation ${currentYear}`],
      'hotels': ['compare sifnos hotels', 'sifnos hotel deals', 'best rates sifnos', 'instant booking sifnos'],
      'location': locationData ? [`${locationData.name.toLowerCase()} hotels`, `hotels in ${locationData.name.toLowerCase()}`, `${locationData.name.toLowerCase()} accommodation`] : [],
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
      "url": "https://hotelssifnos.com",
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
      
      {/* Canonical URL */}
      <link rel="canonical" href={formattedCanonical} />
      
      {/* Alternate Language Links */}
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
      <meta property="og:locale" content="en_US" />
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
            "url": "https://hotelssifnos.com",
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
