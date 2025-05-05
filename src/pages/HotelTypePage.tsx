
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getHotelTypeBySlug, HotelType } from '../data/hotelTypes';
import { supabase } from '@/integrations/supabase/client';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import HotelCard from '../components/HotelCard';
import { getHotelTypeIcon } from '../components/icons/HotelTypeIcons';

export default function HotelTypePage() {
  const { slug } = useParams<{ slug: string }>();
  const [hotelType, setHotelType] = useState<HotelType | null>(null);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!slug) return;
    
    const typeData = getHotelTypeBySlug(slug);
    if (!typeData) {
      navigate('/not-found');
      return;
    }
    
    setHotelType(typeData);
    
    const fetchHotels = async () => {
      try {
        // Here we'd ideally filter by hotel type
        // For now, we'll just get all hotels as a placeholder
        const { data, error } = await supabase
          .from('hotels')
          .select(`
            *,
            hotel_amenities(amenity),
            hotel_photos(id, photo_url, is_main_photo)
          `)
          .limit(9);
          
        if (error) throw error;
        setHotels(data || []);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHotels();
  }, [slug, navigate]);
  
  if (!hotelType) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  const pageTitle = `${hotelType.title} in Sifnos - Best Places to Stay`;
  
  return (
    <>
      <SEO 
        title={pageTitle}
        description={hotelType.meta.description}
        keywords={hotelType.keywords}
        schemaType="Hotel"
        canonical={`https://hotelssifnos.com/hotel-types/${slug}`}
        imageUrl={hotelType.imageUrl}
      />
      
      <div className="container mx-auto px-4">
        <Breadcrumbs 
          items={[{ label: 'Hotels', href: '/hotels' }]}
          currentPage={hotelType.title}
        />
        
        {/* Hero Section with SVG Icon */}
        <div className="relative h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-sifnos-deep-blue to-sifnos-turquoise"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 text-white opacity-20">
              {slug && getHotelTypeIcon(slug)}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-black to-transparent">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              {hotelType.title} in Sifnos Island
            </h1>
          </div>
        </div>
        
        {/* Introduction */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="prose prose-lg">
            <p className="lead text-xl text-gray-700">{hotelType.shortDescription}</p>
            <p>{hotelType.description}</p>
          </div>
        </div>
        
        {/* Hotels Section */}
        <section className="my-12">
          <h2 className="text-2xl font-bold text-sifnos-deep-blue mb-6">
            Top {hotelType.title} in Sifnos Island
          </h2>
          
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sifnos-turquoise"></div>
            </div>
          )}
          
          {/* Hotels Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.length > 0 ? (
                hotels.map(hotel => (
                  <HotelCard key={hotel.id} hotel={hotel} showLogo={true} />
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <h3 className="font-medium text-xl text-gray-700">No hotels found in this category</h3>
                </div>
              )}
            </div>
          )}
        </section>
        
        {/* Why Choose Section */}
        <section className="my-12 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-sifnos-deep-blue mb-4">
            Why Choose {hotelType.title} in Sifnos
          </h2>
          <div className="prose max-w-none">
            <p>
              Sifnos offers some of the most exceptional {hotelType.title.toLowerCase()} in the Cyclades, 
              combining the island's natural beauty, culture, and hospitality with outstanding accommodations.
            </p>
            <p>
              When selecting your perfect {hotelType.title.toLowerCase()} in Sifnos, consider factors like 
              location, amenities, and your specific preferences to ensure a memorable stay on this 
              beautiful Greek island.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
