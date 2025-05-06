
import { Link } from 'react-router-dom';
import LocationCard from '@/components/LocationCard';
import { sifnosLocations } from '../../data/locations';

export default function LocationsSection() {
  // Showcase locations
  const featuredLocations = sifnosLocations.slice(0, 3);

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-montserrat font-bold text-sifnos-deep-blue">
              Explore Sifnos Locations
            </h2>
            <p className="text-gray-600">
              Discover the perfect area for your stay on the island
            </p>
          </div>
          <Link to="/locations" className="text-sifnos-turquoise font-medium hover:text-sifnos-deep-blue transition-colors flex items-center">
            <span>See all locations</span>
            <span className="ml-1">→</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {featuredLocations.map(location => (
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
      </div>
    </div>
  );
}
