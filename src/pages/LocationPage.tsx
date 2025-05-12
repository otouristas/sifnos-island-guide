
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getLocationBySlug, Location, sifnosLocations } from '../data/locations';
import { supabase } from '@/integrations/supabase/client';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import HotelCard from '../components/HotelCard';
import { MapPin } from 'lucide-react';

export default function LocationPage() {
  const { slug } = useParams<{ slug: string }>();
  const [location, setLocation] = useState<Location | null>(null);
  const [relatedLocations, setRelatedLocations] = useState<Location[]>([]);
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
    
    // Find related locations (excluding current one)
    const related = sifnosLocations
      .filter(loc => loc.slug !== slug)
      .sort(() => 0.5 - Math.random()) // Randomly sort
      .slice(0, 3); // Get 3 related locations
    
    setRelatedLocations(related);
    
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
  
  // Create a dynamic SEO description based on location
  const seoDescription = `Explore hotels in ${location.name}, Sifnos - ${location.shortDescription.toLowerCase()}. Find exclusive accommodations with sea views, local charm, and authentic Cycladic experiences. Compare prices and book with our best-rate guarantee.`;
  
  const pageTitle = `Hotels in ${location.name}, Sifnos - Best Places to Stay`;
  
  return (
    <>
      <SEO 
        title={pageTitle}
        description={seoDescription}
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
          <div className="prose prose-lg space-y-6">
            <p className="lead text-xl text-gray-700 font-medium mb-6">{location.shortDescription}</p>
            <p className="text-gray-600">{location.description}</p>
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
        
        {/* Related Locations Section */}
        <section className="my-12 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-sifnos-deep-blue mb-4">
            Explore Other Locations in Sifnos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {relatedLocations.map((loc) => (
              <Link 
                key={loc.slug} 
                to={`/locations/${loc.slug}`}
                className="group block overflow-hidden rounded-lg shadow-sm bg-white hover:shadow-md transition-all"
              >
                <div className="relative h-32">
                  <img 
                    src={loc.imageUrl} 
                    alt={loc.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                    <h3 className="text-white font-semibold">{loc.name}</h3>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm text-gray-600 line-clamp-1">{loc.shortDescription}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link 
              to="/locations" 
              className="text-sifnos-turquoise font-medium hover:text-sifnos-deep-blue transition-colors"
            >
              View All Locations →
            </Link>
          </div>
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
