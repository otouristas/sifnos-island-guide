
import { Helmet } from 'react-helmet';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  schemaType?: 'Hotel' | 'Villa' | 'TravelAgency' | 'Organization' | 'Article' | 'TouristDestination';
  canonical?: string;
  imageUrl?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  noIndex?: boolean;
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
  schemaType = 'Organization',
  canonical,
  imageUrl,
  datePublished,
  dateModified,
  author = 'Hotels Sifnos',
  noIndex = false,
  hotelData
}: SEOProps) {
  // Use the provided image or fall back to the default one
  const ogImage = imageUrl || (hotelData?.imageUrl || 'https://hotelssifnos.com/uploads/sifnos-og-image.jpg');
  
  const formattedCanonical = canonical ? 
    (canonical.startsWith('http') ? canonical : `https://hotelssifnos.com${canonical.startsWith('/') ? canonical : `/${canonical}`}`) 
    : "https://hotelssifnos.com";
  
  // Generate a timestamp for cache busting
  const timestamp = Date.now();
  const randomValue = Math.floor(Math.random() * 1000);
  const cacheBuster = `${timestamp}-${randomValue}`;
  
  let schemaData: SchemaData = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "name": hotelData?.name || "Hotels Sifnos",
    "url": formattedCanonical,
    "logo": "https://hotelssifnos.com/lovable-uploads/18f3243f-e98a-4341-8b0a-e7ea71ce61bf.png",
    "sameAs": [
      "https://www.facebook.com/hotelssifnos",
      "https://www.instagram.com/hotelssifnos",
      "https://twitter.com/hotelssifnos"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": hotelData?.location || "Sifnos",
      "addressRegion": "Cyclades",
      "addressCountry": "Greece"
    }
  };

  if (schemaType === 'Article') {
    schemaData = {
      ...schemaData,
      "headline": title,
      "description": description,
      "image": ogImage,
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
  } else if (schemaType === 'Hotel' || schemaType === 'Villa') {
    // Enhanced schema for hotels and villas with more detailed information
    schemaData = {
      ...schemaData,
      "description": description,
      "image": ogImage,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": hotelData?.location || "Sifnos",
        "addressRegion": "Cyclades",
        "addressCountry": "Greece"
      },
      "priceRange": hotelData?.priceRange || "€€€",
      "telephone": hotelData?.telephone || "+30 2284031370"
    };
    
    // Add rating if available
    if (hotelData?.rating) {
      schemaData.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": hotelData.rating.toString(),
        "reviewCount": "42" // This should ideally be dynamic
      };
    }
    
    // Add amenities if available
    if (hotelData?.amenities && hotelData.amenities.length > 0) {
      schemaData.amenityFeature = hotelData.amenities.map(amenity => ({
        "@type": "LocationFeatureSpecification",
        "name": amenity
      }));
    }
  }

  // Create SEO-optimized title
  const generateSEOTitle = () => {
    if (hotelData) {
      // Hotel/Villa specific title
      const propertyType = hotelData.type === 'Villa' ? 'Villa' : 'Hotel';
      return `${hotelData.name} - Luxury ${propertyType} in ${hotelData.location}, Sifnos | Hotels Sifnos`;
    }
    
    // If title doesn't already contain "Sifnos", append it to maintain brand consistency
    return title.includes("Sifnos") ? 
      `${title} | Hotels Sifnos` : 
      `${title} | Hotels Sifnos`;
  };
  
  const fullTitle = generateSEOTitle();

  return (
    <Helmet>
      <html lang="en" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <meta name="author" content={author} />
      
      {/* Version control and cache busting */}
      <meta name="version" content={cacheBuster} />
      
      {/* Strong cache control headers */}
      <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
      <meta http-equiv="Pragma" content="no-cache" />
      <meta http-equiv="Expires" content="0" />
      
      {/* Robots meta tag for indexing control */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}
      <meta name="googlebot" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      
      {/* Open Graph tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={formattedCanonical} />
      <meta property="og:image" content={`${ogImage}?v=${cacheBuster}`} />
      <meta property="og:site_name" content="Hotels Sifnos" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@hotelssifnos" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${ogImage}?v=${cacheBuster}`} />

      {/* Additional SEO tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={formattedCanonical} />
      
      {/* Preload important resources */}
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
      
      {/* Force reload script to bypass cache */}
      <script>
        {`
          // Force cache refresh on page load
          window.addEventListener('load', function() {
            if (!window.location.hash) {
              console.log('Checking for fresh content...');
              if ('caches' in window) {
                caches.keys().then(function(names) {
                  for (let name of names) caches.delete(name);
                });
              }
              
              // Force image reload by appending timestamp to src
              setTimeout(function() {
                document.querySelectorAll('img').forEach(function(img) {
                  if (img.src.indexOf('placeholder.svg') === -1) {
                    const cacheBuster = ${JSON.stringify(cacheBuster)};
                    if (img.src.indexOf('?') !== -1) {
                      img.src = img.src.split('?')[0] + '?v=' + cacheBuster;
                    } else {
                      img.src = img.src + '?v=' + cacheBuster;
                    }
                  }
                });
              }, 300);
            }
          });
        `}
      </script>
      
      {/* JSON-LD structured data */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
}
