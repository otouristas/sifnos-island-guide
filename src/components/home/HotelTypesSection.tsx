
import { Link } from 'react-router-dom';
import HotelTypeCard from '@/components/HotelTypeCard';
import { hotelTypes } from '../../data/hotelTypes';

export default function HotelTypesSection() {
  // Showcase hotel types
  const featuredHotelTypes = hotelTypes.slice(0, 3);

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-montserrat font-bold text-sifnos-deep-blue">
              Find Your Perfect Hotel Type
            </h2>
            <p className="text-gray-600">
              From luxury resorts to traditional accommodations
            </p>
          </div>
          <Link to="/hotel-types" className="text-sifnos-turquoise font-medium hover:text-sifnos-deep-blue transition-colors flex items-center">
            <span>View all hotel types</span>
            <span className="ml-1">→</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {featuredHotelTypes.map(type => (
            <HotelTypeCard
              key={type.slug}
              title={type.title}
              description={type.shortDescription}
              slug={type.slug}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
