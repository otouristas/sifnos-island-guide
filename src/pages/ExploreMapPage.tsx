import React from 'react';
import SEO from '@/components/SEO';
import InteractiveMap from '@/components/map/InteractiveMap';
import SchemaGenerator from '@/components/SchemaGenerator';

export default function ExploreMapPage() {
  return (
    <>
      <SEO 
        title="Explore Sifnos Island - Interactive Map & Guide"
        description="Discover Sifnos Island with our interactive map. Explore beaches, towns, attractions, and key locations to help plan your perfect Greek island vacation."
        keywords={[
          'sifnos map', 'sifnos island map', 'sifnos beaches map', 
          'sifnos attractions', 'sifnos interactive map', 'sifnos travel guide',
          'explore sifnos', 'sifnos locations'
        ]}
        schemaType="TouristDestination"
        canonical="https://hotelssifnos.com/explore-map"
        imageUrl="/uploads/sifnos-map.jpg"
      />
      
      {/* Enhanced Schema.org JSON-LD for Map Page */}
      <SchemaGenerator 
        pageType="TravelGuide"
        data={{
          breadcrumbs: [
            {
              name: "Home",
              item: "https://hotelssifnos.com/"
            },
            {
              name: "Explore Map",
              item: "https://hotelssifnos.com/explore-map"
            }
          ]
        }}
      />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6 text-center">Explore Sifnos Island</h1>
        
        <div className="max-w-4xl mx-auto mb-8">
          <p className="text-lg text-center mb-8">
            Discover the beautiful island of Sifnos with our interactive map. Click on points of interest to learn more about each location.
          </p>
          
          {/* Interactive Map Component */}
          <InteractiveMap />
          
          <div className="mt-8 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">About Sifnos Island</h2>
            <p className="mb-4">
              Sifnos is a picturesque island in the western Cyclades with a rich history, stunning landscapes, and renowned culinary traditions. The island features charming villages, beautiful beaches, and significant cultural sites.
            </p>
            <p className="mb-4">
              The main settlements include Apollonia (the capital), Kamares (the main port), Kastro (a medieval village), and several coastal villages. Each location offers its own unique character and attractions.
            </p>
            <p>
              Use our interactive map to explore key points of interest and plan your perfect Sifnos vacation. Click on any marker to learn more about that location and find detailed information.
            </p>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto mt-12 grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Getting Around Sifnos</h2>
            <p className="mb-3">
              Sifnos has a reliable bus network connecting major villages and beaches. Taxis are available, and renting a car or scooter is recommended for exploring remote areas.
            </p>
            <p>
              The island is also perfect for hiking enthusiasts, with well-marked trails connecting various settlements and offering spectacular views.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Best Time to Visit</h2>
            <p className="mb-3">
              The ideal time to visit Sifnos is from May to October. July and August are the busiest months, while May, June, September, and October offer pleasant weather with fewer crowds.
            </p>
            <p>
              Spring brings wildflowers and mild temperatures, perfect for hiking and exploring the island's natural beauty.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
