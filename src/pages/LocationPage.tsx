import React from 'react';
import { useParams } from 'react-router-dom';
import SEO from '@/components/SEO';
import NotFound from './NotFound';
import Breadcrumbs from '@/components/Breadcrumbs';

// Dummy location data (replace with your actual data source)
const locations = [
  {
    slug: "apollonia",
    name: "Apollonia",
    description: "Apollonia, the capital of Sifnos, is known for its vibrant nightlife, traditional architecture, and central location.",
    imageUrl: "/uploads/locations/apollonia.jpg",
    attractions: ["Agios Sostis Church", "Folklore Museum", "Steno Beach"],
    coordinates: { latitude: "37.0011", longitude: "24.7314" }
  },
  {
    slug: "kamares",
    name: "Kamares",
    description: "Kamares is the main port of Sifnos, offering a beautiful beach, waterfront restaurants, and easy access to other parts of the island.",
    imageUrl: "/uploads/locations/kamares.jpg",
    attractions: ["Kamares Beach", "Church of Agia Varvara", "Ferry Terminal"],
    coordinates: { latitude: "36.9833", longitude: "24.6700" }
  },
  {
    slug: "platis-gialos",
    name: "Platis Gialos",
    description: "Platis Gialos boasts one of the longest and most beautiful beaches in Sifnos, lined with tavernas and offering various water sports.",
    imageUrl: "/uploads/locations/platis-gialos.jpg",
    attractions: ["Platis Gialos Beach", "Windsurfing", "Beachfront Dining"],
    coordinates: { latitude: "36.9486", longitude: "24.7231" }
  },
  {
    slug: "kastro",
    name: "Kastro",
    description: "Kastro, the old capital of Sifnos, is a historic village built on a cliff, offering stunning sea views and medieval architecture.",
    imageUrl: "/uploads/locations/kastro.jpg",
    attractions: ["Church of the Seven Martyrs", "Kastro Village", "Archaeological Museum"],
    coordinates: { latitude: "37.0083", longitude: "24.7486" }
  },
  {
    slug: "vathi",
    name: "Vathi",
    description: "Vathi is a peaceful coastal village known for its sheltered bay, sandy beach, and traditional pottery workshops.",
    imageUrl: "/uploads/locations/vathi.jpg",
    attractions: ["Vathi Beach", "Pottery Workshops", "Monastery of Taxiarchis"],
    coordinates: { latitude: "36.9333", longitude: "24.6917" }
  },
  {
    slug: "faros",
    name: "Faros",
    description: "Faros is a charming fishing village with three sandy beaches, a picturesque harbor, and a relaxed atmosphere.",
    imageUrl: "/uploads/locations/faros.jpg",
    attractions: ["Faros Beach", "Glyfo Beach", "Fasolou Beach"],
    coordinates: { latitude: "36.9667", longitude: "24.7667" }
  }
];

export default function LocationPage() {
  const { slug } = useParams<{ slug: string }>();
  const location = locations.find(loc => loc.slug === slug);
  
  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', link: '/' },
    { label: 'Locations', link: '/locations' },
    { label: location ? location.name : 'Location', active: true },
  ];
  
  // Prepare location data for schema
  const locationSchema = location ? {
    name: location.name,
    description: location.description,
    attractions: location.attractions || ["Beautiful beaches", "Local restaurants", "Historic sites"],
    coordinates: location.coordinates || { latitude: "36.9777", longitude: "24.7458" },
    images: [location.imageUrl]
  } : undefined;
  
  if (!location) {
    return <NotFound />;
  }
  
  return (
    <>
      <SEO 
        title={`${location.name}, Sifnos - Area Guide & Top Hotels`}
        description={`Discover ${location.name} in Sifnos: local highlights, nearby attractions, beaches, and find the best accommodations in ${location.name} for your perfect Sifnos vacation.`}
        keywords={[`${location.name} Sifnos`, `hotels in ${location.name}`, `${location.name} accommodation`, `${location.name} area guide`, 'sifnos villages']}
        schemaType="TouristDestination" 
        canonical={`/locations/${slug}`}
        imageUrl={location.imageUrl}
        locationData={locationSchema}
      />
      
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />
          
          <div className="flex flex-col md:flex-row items-start">
            {/* Location Image */}
            <div className="md:w-1/2 mb-6 md:mb-0">
              <img 
                src={location.imageUrl} 
                alt={location.name} 
                className="w-full rounded-lg shadow-md" 
              />
            </div>
            
            {/* Location Details */}
            <div className="md:w-1/2 md:pl-8">
              <h1 className="text-3xl font-semibold text-gray-800 mb-4">{location.name}</h1>
              <p className="text-gray-600 leading-relaxed mb-6">{location.description}</p>
              
              {/* Attractions */}
              {location.attractions && location.attractions.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">Top Attractions</h2>
                  <ul className="list-disc list-inside text-gray-600">
                    {location.attractions.map((attraction, index) => (
                      <li key={index}>{attraction}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          {/* Hotels in {Location} Section (Replace with actual hotel listings) */}
          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Hotels in {location.name}</h2>
            <p className="text-gray-600">Explore our selection of hotels in {location.name} for a memorable stay.</p>
            {/* Replace this with your actual hotel listing component */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-gray-800">Sample Hotel 1</h3>
                <p className="text-gray-600">Description of Sample Hotel 1.</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-gray-800">Sample Hotel 2</h3>
                <p className="text-gray-600">Description of Sample Hotel 2.</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-gray-800">Sample Hotel 3</h3>
                <p className="text-gray-600">Description of Sample Hotel 3.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
