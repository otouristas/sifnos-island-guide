
import { useEffect } from 'react';
import { hotelTypes } from '../data/hotelTypes';
import HotelTypeCard from '../components/HotelTypeCard';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';

export default function HotelTypesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <>
      <SEO 
        title="Hotel Types in Sifnos - Find Your Perfect Accommodation" 
        description="Discover all types of hotels available in Sifnos - from luxury resorts and boutique hotels to traditional accommodations, beach hotels, and family-friendly options for your perfect Greek island stay."
        keywords={['sifnos hotel types', 'luxury hotels sifnos', 'boutique hotels sifnos', 'beach hotels sifnos', 'family friendly hotels sifnos', 'traditional hotels sifnos', 'types of accommodation sifnos']}
        schemaType="Hotel"
        canonical="https://hotelssifnos.com/hotel-types"
      />
      
      <div className="container mx-auto px-4">
        <Breadcrumbs 
          items={[{ label: 'Hotels', href: '/hotels' }]}
          currentPage="Hotel Types" 
        />
        
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto my-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-sifnos-deep-blue mb-4">
            Hotel Types in Sifnos
          </h1>
          <p className="text-lg text-gray-600">
            Find your perfect accommodation type in Sifnos, from luxury resorts to boutique hotels and family-friendly options.
          </p>
        </div>
        
        {/* Hotel Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-12">
          {hotelTypes.map(type => (
            <HotelTypeCard 
              key={type.id}
              title={type.title}
              description={type.shortDescription}
              imageUrl={type.imageUrl}
              slug={type.slug}
            />
          ))}
        </div>
        
        {/* SEO Content */}
        <div className="max-w-4xl mx-auto my-12">
          <div className="prose prose-lg">
            <h2>Choosing Your Ideal Accommodation in Sifnos</h2>
            <p>
              Sifnos offers an impressive variety of accommodation types to suit every traveler's preferences, needs, and budget. Whether you're seeking a luxurious retreat, an authentic cultural experience, or a family-friendly environment, you'll find the perfect option on this charming Cycladic island.
            </p>
            <p>
              Luxury hotels and resorts in Sifnos provide premium amenities like private pools, fine dining, spa services, and exceptional views in stunning settings. For travelers who appreciate unique character and personalized service, the island's boutique hotels offer intimate environments with distinctive design elements and attention to detail.
            </p>
            <p>
              Beach lovers can choose from numerous beachfront accommodations situated directly on or very near Sifnos' beautiful shores, allowing for easy access to swimming, water sports, and seaside relaxation. Families traveling with children will appreciate the island's family-friendly hotels, which offer suitable facilities like children's pools, play areas, and specially designed family rooms.
            </p>
            <p>
              For an authentic Greek island experience, Sifnos' traditional hotels showcase Cycladic architecture, local hospitality, and cultural immersion. Whatever accommodation type you prefer, Sifnos provides options that enhance your experience of this beautiful destination while meeting your specific travel needs.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
