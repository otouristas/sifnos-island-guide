
import React from 'react';

interface SchemaGeneratorProps {
  pageType: 'Homepage' | 'Hotel' | 'HotelListing' | 'Location' | 'Blog' | 'BlogPost' | 'About' | 'Contact' | 'FAQ' | 'TravelGuide';
  data?: {
    name?: string;
    description?: string;
    image?: string;
    datePublished?: string;
    dateModified?: string;
    author?: string;
    breadcrumbs?: Array<{name: string, item: string}>;
    hotel?: {
      name: string;
      location?: string;
      type?: string;
      priceRange?: string;
      rating?: number;
      ratingCount?: number;
      telephone?: string;
      email?: string;
      amenities?: string[];
      checkInTime?: string;
      checkOutTime?: string;
      images?: string[];
    };
    faq?: Array<{question: string, answer: string}>;
  };
}

const SchemaGenerator: React.FC<SchemaGeneratorProps> = ({ pageType, data = {} }) => {
  // Base schema with WebSite information
  const baseSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://hotelssifnos.com/#website",
        "url": "https://hotelssifnos.com/",
        "name": "Hotels Sifnos",
        "description": "Find Your Perfect Stay in Sifnos - Best Hotels & Accommodation",
        "publisher": {
          "@type": "Organization",
          "@id": "https://hotelssifnos.com/#organization",
          "name": "Hotels Sifnos",
          "logo": {
            "@type": "ImageObject",
            "@id": "https://hotelssifnos.com/#logo",
            "url": "https://hotelssifnos.com/lovable-uploads/18f3243f-e98a-4341-8b0a-e7ea71ce61bf.png",
            "width": 240,
            "height": 80,
            "caption": "Hotels Sifnos"
          }
        },
        "inLanguage": "en-US",
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://hotelssifnos.com/hotels?query={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      }
    ]
  };

  // Generate breadcrumb schema
  let breadcrumbSchema = null;
  if (data.breadcrumbs && data.breadcrumbs.length > 0) {
    breadcrumbSchema = {
      "@type": "BreadcrumbList",
      "@id": "https://hotelssifnos.com/#breadcrumb",
      "itemListElement": data.breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.item
      }))
    };
    baseSchema["@graph"].push(breadcrumbSchema);
  }

  // Add page-specific schema
  switch(pageType) {
    case 'Homepage':
      baseSchema["@graph"].push({
        "@type": "Organization",
        "@id": "https://hotelssifnos.com/#organization",
        "name": "Hotels Sifnos",
        "url": "https://hotelssifnos.com/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://hotelssifnos.com/lovable-uploads/18f3243f-e98a-4341-8b0a-e7ea71ce61bf.png",
          "width": 240,
          "height": 80
        },
        "sameAs": [
          "https://www.facebook.com/hotelssifnos",
          "https://www.instagram.com/hotelssifnos",
          "https://twitter.com/hotelssifnos"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+30-22840-31555",
          "contactType": "customer service",
          "areaServed": "GR",
          "availableLanguage": ["English", "Greek"]
        }
      });
      break;

    case 'Hotel':
      if (data.hotel) {
        const hotelSchema = {
          "@type": "Hotel",
          "@id": `https://hotelssifnos.com/hotels/${data.hotel.name.toLowerCase().replace(/\s+/g, '-')}#hotel`,
          "name": data.hotel.name,
          "description": data.description || `${data.hotel.name} on Sifnos Island`,
          "url": `https://hotelssifnos.com/hotels/${data.hotel.name.toLowerCase().replace(/\s+/g, '-')}`,
          "image": data.image || data.hotel.images?.[0] || "https://hotelssifnos.com/uploads/sifnos-og-image.jpg",
          "priceRange": data.hotel.priceRange || "€€€",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": data.hotel.location || "Sifnos",
            "addressRegion": "Cyclades",
            "addressCountry": "Greece"
          },
          "telephone": data.hotel.telephone || "+30 2284031370"
        };
        
        // Add rating if available
        if (data.hotel.rating) {
          hotelSchema["aggregateRating"] = {
            "@type": "AggregateRating",
            "ratingValue": data.hotel.rating.toString(),
            "reviewCount": (data.hotel.ratingCount || 42).toString(),
            "bestRating": "5",
            "worstRating": "1"
          };
        }
        
        // Add amenities if available
        if (data.hotel.amenities && data.hotel.amenities.length > 0) {
          hotelSchema["amenityFeature"] = data.hotel.amenities.map(amenity => ({
            "@type": "LocationFeatureSpecification",
            "name": amenity,
            "value": true
          }));
        }
        
        // Add check-in/check-out times if available
        if (data.hotel.checkInTime) {
          hotelSchema["checkinTime"] = data.hotel.checkInTime;
        }
        if (data.hotel.checkOutTime) {
          hotelSchema["checkoutTime"] = data.hotel.checkOutTime;
        }
        
        // Add images if available
        if (data.hotel.images && data.hotel.images.length > 0) {
          hotelSchema["photo"] = data.hotel.images.map(image => ({
            "@type": "ImageObject",
            "url": image
          }));
        }
        
        baseSchema["@graph"].push(hotelSchema);
      }
      break;

    case 'HotelListing':
      baseSchema["@graph"].push({
        "@type": "ItemList",
        "@id": "https://hotelssifnos.com/hotels/#itemlist",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "ALK Hotel Sifnos",
            "url": "https://hotelssifnos.com/hotels/alk-hotel-sifnos"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Meropi Rooms and Apartments",
            "url": "https://hotelssifnos.com/hotels/meropi-rooms-and-apartments"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Filadaki Villas",
            "url": "https://hotelssifnos.com/hotels/filadaki-villas"
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "Villa Olivia Clara",
            "url": "https://hotelssifnos.com/hotels/villa-olivia-clara"
          },
          {
            "@type": "ListItem",
            "position": 5,
            "name": "Morpheas Pension & Apartments",
            "url": "https://hotelssifnos.com/hotels/morpheas-pension-apartments"
          }
        ]
      });
      break;

    case 'Location':
      baseSchema["@graph"].push({
        "@type": "TouristDestination",
        "@id": `https://hotelssifnos.com/locations/${data.name?.toLowerCase().replace(/\s+/g, '-')}#destination`,
        "name": data.name || "Sifnos",
        "description": data.description || "Discover the beautiful island of Sifnos in the Cyclades, Greece",
        "url": `https://hotelssifnos.com/locations/${data.name?.toLowerCase().replace(/\s+/g, '-')}`,
        "touristType": ["Beach tourism", "Cultural tourism", "Culinary tourism"],
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "36.9777",
          "longitude": "24.7458"
        }
      });
      break;

    case 'Blog':
      baseSchema["@graph"].push({
        "@type": "Blog",
        "@id": "https://hotelssifnos.com/blog/#blog",
        "name": "Sifnos Travel Blog",
        "description": "Expert travel guides, hotel reviews, and local insights for Sifnos Island",
        "url": "https://hotelssifnos.com/blog/"
      });
      break;

    case 'BlogPost':
      baseSchema["@graph"].push({
        "@type": "BlogPosting",
        "@id": `https://hotelssifnos.com/blog/${data.name?.toLowerCase().replace(/\s+/g, '-')}#article`,
        "headline": data.name || "Sifnos Travel Guide",
        "description": data.description || "Discover the beautiful island of Sifnos in the Cyclades, Greece",
        "image": data.image || "https://hotelssifnos.com/uploads/sifnos-og-image.jpg",
        "author": {
          "@type": "Person",
          "name": data.author || "Hotels Sifnos Team"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Hotels Sifnos",
          "logo": {
            "@type": "ImageObject",
            "url": "https://hotelssifnos.com/lovable-uploads/18f3243f-e98a-4341-8b0a-e7ea71ce61bf.png"
          }
        },
        "datePublished": data.datePublished || new Date().toISOString(),
        "dateModified": data.dateModified || new Date().toISOString(),
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://hotelssifnos.com/blog/${data.name?.toLowerCase().replace(/\s+/g, '-')}`
        }
      });
      break;

    case 'FAQ':
      if (data.faq && data.faq.length > 0) {
        baseSchema["@graph"].push({
          "@type": "FAQPage",
          "@id": "https://hotelssifnos.com/faq/#faqpage",
          "mainEntity": data.faq.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.answer
            }
          }))
        });
      }
      break;

    case 'TravelGuide':
      baseSchema["@graph"].push({
        "@type": "TouristAttraction",
        "@id": "https://hotelssifnos.com/travel-guide/#tourist-attraction",
        "name": "Sifnos Island",
        "description": "A comprehensive guide to Sifnos Island in the Cyclades, Greece",
        "url": "https://hotelssifnos.com/travel-guide/",
        "image": "https://hotelssifnos.com/uploads/sifnos-og-image.jpg",
        "isAccessibleForFree": true,
        "address": {
          "@type": "PostalAddress",
          "addressRegion": "Cyclades",
          "addressCountry": "Greece"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "36.9777",
          "longitude": "24.7458"
        }
      });
      break;

    default:
      break;
  }

  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(baseSchema) }}
    />
  );
};

export default SchemaGenerator;
