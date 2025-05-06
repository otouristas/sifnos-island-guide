
import { Helmet } from 'react-helmet';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  schemaType?: 'Hotel' | 'TravelAgency' | 'Organization' | 'Article' | 'TouristDestination';
  canonical?: string;
  imageUrl?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  noIndex?: boolean;
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
  noIndex = false
}: SEOProps) {
  // Use the provided image or fall back to the default one
  const ogImage = imageUrl || 'https://hotelssifnos.com/uploads/sifnos-og-image.jpg';
  
  const formattedCanonical = canonical ? 
    (canonical.startsWith('http') ? canonical : `https://hotelssifnos.com${canonical.startsWith('/') ? canonical : `/${canonical}`}`) 
    : "https://hotelssifnos.com";
  
  // Generate a super aggressive timestamp for cache busting
  const timestamp = new Date().toISOString().replace(/[^\d]/g, '');
  const randomValue = Math.floor(Math.random() * 100000000);
  const cacheBuster = `${timestamp}.${randomValue}`;
  
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
  } else if (schemaType === 'Hotel') {
    schemaData = {
      ...schemaData,
      "description": description,
      "image": ogImage,
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
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <meta name="author" content={author} />
      
      {/* Super aggressive version control and cache busting */}
      <meta name="version" content={cacheBuster} />
      
      {/* Super aggressive cache control headers */}
      <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate, max-age=0" />
      <meta http-equiv="Pragma" content="no-cache" />
      <meta http-equiv="Expires" content="-1" />
      
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
      
      {/* Extremely aggressive force reload script to bypass cache */}
      <script>
        {`
          // Super aggressive cache refresh on page load
          window.addEventListener('load', function() {
            console.log('Applying super aggressive cache busting...');
            
            // Clear all caches
            if ('caches' in window) {
              caches.keys().then(function(names) {
                for (let name of names) {
                  console.log('Clearing cache:', name);
                  caches.delete(name);
                }
              });
            }
            
            // Force image reload with stronger timestamp
            setTimeout(function() {
              document.querySelectorAll('img').forEach(function(img) {
                if (img.src && !img.src.includes('placeholder.svg')) {
                  const cacheBuster = '${cacheBuster}';
                  if (img.src.indexOf('?') !== -1) {
                    img.src = img.src.split('?')[0] + '?v=' + cacheBuster;
                  } else {
                    img.src = img.src + '?v=' + cacheBuster;
                  }
                  console.log('Cache busting applied to:', img.src);
                }
              });
              
              // Force reload all CSS
              document.querySelectorAll('link[rel="stylesheet"]').forEach(function(link) {
                const href = link.getAttribute('href');
                if (href) {
                  const newHref = href.split('?')[0] + '?v=${cacheBuster}';
                  link.setAttribute('href', newHref);
                  console.log('Cache busting applied to CSS:', newHref);
                }
              });
            }, 100);
          });
          
          // Also apply cache busting on window focus (user returns to tab)
          window.addEventListener('focus', function() {
            console.log('Window focused, refreshing content...');
            // Force reload all images with a new timestamp
            const focusTimestamp = Date.now();
            document.querySelectorAll('img:not([src*="placeholder.svg"])').forEach(function(img) {
              if (img.src) {
                if (img.src.indexOf('?') !== -1) {
                  img.src = img.src.split('?')[0] + '?v=' + focusTimestamp;
                } else {
                  img.src = img.src + '?v=' + focusTimestamp;
                }
              }
            });
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
