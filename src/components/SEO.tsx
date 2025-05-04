
import { Helmet } from 'react-helmet';

interface SEOProps {
  title: string;
  description: string;
  keywords: string[];
  schemaType?: 'Hotel' | 'TravelAgency' | 'Organization' | 'Article' | 'TouristDestination';
  canonical?: string;
  imageUrl?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  noindex?: boolean;
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
  keywords, 
  schemaType = 'Organization',
  canonical,
  imageUrl = 'https://hotelssifnos.com/opengraph-image-p98pqg.png',
  datePublished,
  dateModified,
  author = 'Hotels Sifnos',
  noindex = false
}: SEOProps) {
  const formattedCanonical = canonical ? 
    (canonical.startsWith('http') ? canonical : `https://hotelssifnos.com${canonical.startsWith('/') ? canonical : `/${canonical}`}`) 
    : "https://hotelssifnos.com";
  
  let schemaData: SchemaData = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "name": "Hotels Sifnos",
    "url": formattedCanonical,
    "logo": "https://hotelssifnos.com/lovable-uploads/18f3243f-e98a-4341-8b0a-e7ea71ce61bf.png",
    "sameAs": [
      "https://www.facebook.com/hotelssifnos",
      "https://www.instagram.com/hotelssifnos",
      "https://twitter.com/hotelssifnos"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Sifnos",
      "addressRegion": "Cyclades",
      "addressCountry": "Greece"
    }
  };

  if (schemaType === 'Article') {
    schemaData = {
      ...schemaData,
      "headline": title,
      "description": description,
      "image": imageUrl,
      "datePublished": datePublished || new Date().toISOString(),
      "dateModified": dateModified || new Date().toISOString(),
      "author": {
        "@type": "Person",
        "name": author
      }
    };
  } else if (schemaType === 'TouristDestination') {
    schemaData = {
      ...schemaData,
      "description": description,
      "touristType": ["Beach tourism", "Cultural tourism", "Culinary tourism"],
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "36.9777",
        "longitude": "24.7458"
      }
    };
  } else if (schemaType === 'Hotel') {
    schemaData = {
      ...schemaData,
      "description": description,
      "image": imageUrl,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Sifnos",
        "addressRegion": "Cyclades",
        "addressCountry": "Greece"
      },
      "priceRange": "€€€",
      "telephone": "+30 2284031370"
    };
  }

  // If title doesn't already contain "Sifnos", append it to maintain brand consistency
  const fullTitle = title.includes("Sifnos") ? 
    `${title} | Hotels Sifnos` : 
    `${title} | Hotels Sifnos`;

  return (
    <Helmet>
      <html lang="en" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      
      {/* Open Graph tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={formattedCanonical} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content="Hotels Sifnos" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@hotelssifnos" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Additional SEO tags */}
      <meta 
        name="robots" 
        content={noindex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"} 
      />
      <meta name="googlebot" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={formattedCanonical} />
      
      {/* Preload important resources */}
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
      
      {/* JSON-LD structured data */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
}
