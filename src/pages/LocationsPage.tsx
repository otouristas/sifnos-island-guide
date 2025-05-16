
import { useEffect } from 'react';
import { sifnosLocations } from '../data/locations';
import LocationCard from '../components/LocationCard';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import SchemaGenerator from '@/components/SchemaGenerator';

export default function LocationsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <>
      <SEO 
        title="Sifnos Locations Guide - Where to Stay on the Island | Hotels Sifnos 2025" 
        description="Insider's guide to Sifnos' distinct areas - from lively Apollonia and beachside Kamares to tranquil Vathi and historic Kastro. Compare neighborhoods by amenities, atmosphere, and accessibility to find your perfect base for exploring this Cycladic gem."
        keywords={['sifnos locations', 'where to stay sifnos', 'best areas sifnos', 'sifnos villages', 'sifnos accommodation locations', 'apollonia sifnos', 'kamares sifnos', 'platis gialos sifnos']}
        schemaType="TouristDestination"
        canonical="https://hotelssifnos.com/locations"
      />
      
      {/* Enhanced Schema.org JSON-LD */}
      <SchemaGenerator 
        pageType="Location"
        data={{
          name: "Sifnos Island",
          description: "Guide to all locations and areas in Sifnos island for your perfect vacation stay",
          breadcrumbs: [
            { name: "Home", item: "https://hotelssifnos.com/" },
            { name: "Locations", item: "https://hotelssifnos.com/locations" }
          ]
        }}
      />
      
      <div className="container mx-auto px-4">
        <Breadcrumbs currentPage="Locations" />
        
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto my-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-sifnos-deep-blue mb-4">
            Locations in Sifnos Island
          </h1>
          <p className="text-lg text-gray-600">
            Discover the perfect area to stay in beautiful Sifnos. Each location offers its own unique charm and attractions.
          </p>
        </div>
        
        {/* Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-12">
          {sifnosLocations.map(location => (
            <LocationCard 
              key={location.id}
              name={location.name}
              description={location.shortDescription}
              imageUrl={location.imageUrl}
              hotelsCount={location.hotelsCount}
              slug={location.slug}
            />
          ))}
        </div>
        
        {/* SEO Content */}
        <div className="max-w-4xl mx-auto my-12">
          <div className="prose prose-lg">
            <h2>Finding Your Perfect Stay in Sifnos</h2>
            <p>
              Choosing the right location for your stay in Sifnos can significantly enhance your experience on this beautiful Cycladic island. Each area offers distinct advantages depending on your preferences and travel style.
            </p>
            <p>
              Apollonia, the capital, provides a central location with easy access to restaurants, bars, and boutique shops. It's ideal for those who enjoy nightlife and want to be in the heart of the action. Kamares, as the main port, offers convenience for arrivals and departures along with a lovely beach and waterfront dining options.
            </p>
            <p>
              For beach lovers, Platis Gialos presents one of the island's most beautiful shores with numerous beachfront accommodations. Families particularly appreciate its shallow waters and range of facilities. Those seeking a more authentic and historical experience might prefer Kastro, the medieval former capital, where traditional architecture and spectacular sea views create an unforgettable setting.
            </p>
            <p>
              Vathi provides a quieter, more secluded experience in a picturesque bay setting, while Faros combines beautiful beaches with a relaxed fishing village atmosphere. The elegant village of Artemonas offers neoclassical architecture and refined ambiance, just a short walk from Apollonia.
            </p>
            <p>
              For travelers seeking authentic experiences, smaller settlements like Agios Loukas, Exambela, Katavati, Kato Petali, Pano Petali, and Troullaki offer glimpses into traditional island life. Herronisos in the north provides a remote fishing village experience, while Chrysopigi is famous for its iconic monastery and beautiful beaches.
            </p>
            <p>
              Whichever location you choose, Sifnos' excellent bus system and relatively small size make it easy to explore the entire island regardless of where you stay.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
