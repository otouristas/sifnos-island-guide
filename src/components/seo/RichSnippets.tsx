import { Helmet } from 'react-helmet';

interface RichSnippetsProps {
  pageType: 'hotel-listing' | 'hotel-detail' | 'location-guide';
  data?: {
    hotels?: Array<{
      name: string;
      rating: number;
      reviewCount: number;
      priceRange: string;
      location: string;
      amenities: string[];
    }>;
    location?: {
      name: string;
      description: string;
      attractions: string[];
      coordinates: { lat: number; lng: number };
    };
    hotel?: {
      name: string;
      rating: number;
      reviewCount: number;
      address: string;
      telephone: string;
      priceRange: string;
      amenities: string[];
      photos: string[];
    };
  };
}

export function RichSnippets({ pageType, data }: RichSnippetsProps) {
  const generateSchema = () => {
    const baseSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Sifnos Hotels",
      "description": "Comprehensive list of the best hotels and accommodations in Sifnos, Greece",
      "numberOfItems": data?.hotels?.length || 0,
      "itemListElement": []
    };

    if (pageType === 'hotel-listing' && data?.hotels) {
      baseSchema.itemListElement = data.hotels.map((hotel, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Hotel",
          "name": hotel.name,
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": hotel.rating,
            "reviewCount": hotel.reviewCount,
            "bestRating": 5,
            "worstRating": 1
          },
          "priceRange": hotel.priceRange,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": hotel.location,
            "addressRegion": "Cyclades",
            "addressCountry": "GR"
          },
          "amenityFeature": hotel.amenities.map(amenity => ({
            "@type": "LocationFeatureSpecification",
            "name": amenity
          }))
        }
      }));
    }

    if (pageType === 'location-guide' && data?.location) {
      return {
        "@context": "https://schema.org",
        "@type": "TouristDestination",
        "name": data.location.name,
        "description": data.location.description,
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": data.location.coordinates.lat,
          "longitude": data.location.coordinates.lng
        },
        "touristType": ["Beach Tourism", "Cultural Tourism", "Culinary Tourism"],
        "hasMap": `https://www.google.com/maps/@${data.location.coordinates.lat},${data.location.coordinates.lng},15z`,
        "containsPlace": data.location.attractions.map(attraction => ({
          "@type": "TouristAttraction",
          "name": attraction
        }))
      };
    }

    if (pageType === 'hotel-detail' && data?.hotel) {
      return {
        "@context": "https://schema.org",
        "@type": "Hotel",
        "name": data.hotel.name,
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": data.hotel.rating,
          "reviewCount": data.hotel.reviewCount,
          "bestRating": 5,
          "worstRating": 1
        },
        "address": {
          "@type": "PostalAddress",
          "streetAddress": data.hotel.address,
          "addressRegion": "Cyclades",
          "addressCountry": "GR"
        },
        "telephone": data.hotel.telephone,
        "priceRange": data.hotel.priceRange,
        "amenityFeature": data.hotel.amenities.map(amenity => ({
          "@type": "LocationFeatureSpecification",
          "name": amenity
        })),
        "photo": data.hotel.photos.map(photo => ({
          "@type": "ImageObject",
          "url": photo
        }))
      };
    }

    return baseSchema;
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(generateSchema(), null, 0)}
      </script>
    </Helmet>
  );
}