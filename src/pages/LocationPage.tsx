
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getLocationBySlug, Location } from '../data/locations';
import { supabase } from '@/integrations/supabase/client';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import HotelCard from '../components/HotelCard';
import { MapPin } from 'lucide-react';

export default function LocationPage() {
  const { slug } = useParams<{ slug: string }>();
  const [location, setLocation] = useState<Location | null>(null);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!slug) return;
    
    const locationData = getLocationBySlug(slug);
    if (!locationData) {
      navigate('/not-found');
      return;
    }
    
    setLocation(locationData);
    
    const fetchHotels = async () => {
      try {
        const { data, error } = await supabase
          .from('hotels')
          .select(`
            *,
            hotel_amenities(amenity),
            hotel_photos(id, photo_url, is_main_photo)
          `)
          .eq('location', locationData.name);
          
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
  
  if (!location) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  const pageTitle = `Hotels in ${location.name}, Sifnos - Best Places to Stay`;
  
  return (
    <>
      <SEO 
        title={pageTitle}
        description={location.meta.description}
        keywords={location.keywords}
        schemaType="TouristDestination"
        canonical={`https://hotelssifnos.com/locations/${slug}`}
        imageUrl={location.imageUrl}
      />
      
      <div className="container mx-auto px-4">
        <Breadcrumbs 
          items={[{ label: 'Locations', href: '/locations' }]}
          currentPage={location.name}
        />
        
        {/* Hero Section */}
        <div className="relative h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden mb-8">
          <img 
            src={location.imageUrl} 
            alt={`${location.name}, Sifnos`} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-black to-transparent">
            <div className="flex items-center text-white text-sm mb-2">
              <MapPin size={16} className="mr-1" />
              <span>{location.name}, Sifnos Island</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Hotels in {location.name}, Sifnos
            </h1>
          </div>
        </div>
        
        {/* Introduction */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="prose prose-lg">
            <p className="lead text-xl text-gray-700">{location.shortDescription}</p>
            <p>{location.description}</p>
          </div>
        </div>
        
        {/* Hotels Section */}
        <section className="my-12">
          <h2 className="text-2xl font-bold text-sifnos-deep-blue mb-6">
            Available Hotels in {location.name}, Sifnos
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
                  <h3 className="font-medium text-xl text-gray-700">No hotels found in this location</h3>
                  <p className="text-gray-500 mt-2">Try browsing all hotels in Sifnos</p>
                  <Link to="/hotels" className="mt-4 inline-block px-6 py-2 bg-sifnos-turquoise text-white rounded-md hover:bg-sifnos-deep-blue transition-colors">
                    Browse All Hotels
                  </Link>
                </div>
              )}
            </div>
          )}
        </section>
        
        {/* Nearby Attractions */}
        <section className="my-12 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-sifnos-deep-blue mb-4">
            Attractions near {location.name}, Sifnos
          </h2>
          <p className="text-gray-700 mb-4">
            Explore the beautiful surroundings and popular attractions near {location.name}, Sifnos.
            Find the perfect place to stay and enjoy everything this area has to offer.
          </p>
          <Link 
            to="/travel-guide" 
            className="text-sifnos-turquoise font-medium hover:text-sifnos-deep-blue transition-colors"
          >
            View Travel Guide →
          </Link>
        </section>
      </div>
    </>
  );
}
