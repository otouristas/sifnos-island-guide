import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Users, ArrowRight } from 'lucide-react';
import SEO from '@/components/SEO';
import { supabase } from '@/integrations/supabase/client';
import { sifnosLocations } from '@/data/locations';
import { Card, CardContent } from '@/components/ui/card';
import HotelCard from '@/components/HotelCard';

export default function WhereToStaySifnosPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopHotels = async () => {
      try {
        const { data, error } = await supabase
          .from('hotels')
          .select(`
            *,
            hotel_amenities(amenity),
            hotel_photos(id, photo_url, is_main_photo)
          `)
          .order('rating', { ascending: false })
          .limit(9);
          
        if (error) throw error;
        setHotels(data || []);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopHotels();
  }, []);

  const topLocations = sifnosLocations.slice(0, 6);

  return (
    <>
      <SEO 
        title="Where to Stay in Sifnos 2025 - Best Areas & Hotel Guide | Hotels Sifnos"
        description="Complete guide to the best areas to stay in Sifnos. From beachfront Platis Gialos to historic Kastro, find your perfect location with our expert recommendations and exclusive hotel deals."
        keywords={[
          'where to stay in sifnos', 'best areas sifnos', 'sifnos accommodation guide',
          'best location sifnos hotels', 'sifnos travel guide', 'where to stay sifnos greece'
        ]}
        pageType="location"
        canonical="https://hotelssifnos.com/where-to-stay-sifnos"
        imageUrl="/uploads/sifnos-hero.jpg"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-sifnos-deep-blue mb-6">
            Where to Stay in Sifnos: Complete Guide 2025
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the best areas to stay in Sifnos with our comprehensive guide. 
            From bustling port towns to secluded beach villages, find your perfect base for exploring this enchanting Cycladic island.
          </p>
        </div>

        {/* Best Areas Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-sifnos-deep-blue mb-8 text-center">
            🏖️ Best Areas to Stay in Sifnos
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topLocations.map((location, index) => (
              <Card key={location.slug} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img 
                    src={location.imageUrl} 
                    alt={location.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-sm font-medium">
                    #{index + 1} Choice
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-sifnos-deep-blue mb-2">{location.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{location.shortDescription}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin size={16} className="mr-1" />
                      <span>{location.hotelsCount || '5+'} hotels</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users size={16} className="mr-1" />
                      <span>Family friendly</span>
                    </div>
                  </div>
                  
                  <Link 
                    to={`/locations/${location.slug}`}
                    className="inline-flex items-center text-sifnos-turquoise hover:text-sifnos-deep-blue font-medium"
                  >
                    View Hotels <ArrowRight size={16} className="ml-1" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Hotel Finder */}
        <section className="mb-16 bg-gray-50 p-8 rounded-xl">
          <h2 className="text-3xl font-bold text-sifnos-deep-blue mb-8 text-center">
            💎 Top Rated Hotels by Area
          </h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sifnos-turquoise"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.slice(0, 6).map(hotel => (
                <HotelCard key={hotel.id} hotel={hotel} showLogo={true} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-8">
            <Link 
              to="/hotels"
              className="inline-block px-8 py-3 bg-sifnos-turquoise text-white rounded-lg hover:bg-sifnos-deep-blue transition-colors font-medium"
            >
              View All Hotels
            </Link>
          </div>
        </section>

        {/* Travel Tips Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-sifnos-deep-blue mb-8">
            🎯 Expert Tips: Choosing Your Perfect Area
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="border-l-4 border-sifnos-turquoise pl-6">
                <h3 className="text-xl font-semibold mb-2">For First-Time Visitors</h3>
                <p className="text-gray-600">
                  Stay in <strong>Apollonia</strong> for easy access to restaurants and nightlife, 
                  or <strong>Kamares</strong> for convenience and beachfront location.
                </p>
              </div>
              
              <div className="border-l-4 border-sifnos-turquoise pl-6">
                <h3 className="text-xl font-semibold mb-2">For Beach Lovers</h3>
                <p className="text-gray-600">
                  <strong>Platis Gialos</strong> offers the best beach with shallow waters, 
                  perfect for families and water sports enthusiasts.
                </p>
              </div>
              
              <div className="border-l-4 border-sifnos-turquoise pl-6">
                <h3 className="text-xl font-semibold mb-2">For Romance & Luxury</h3>
                <p className="text-gray-600">
                  <strong>Vathi</strong> and <strong>Kastro</strong> provide intimate settings 
                  with stunning views and peaceful surroundings.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="border-l-4 border-orange-400 pl-6">
                <h3 className="text-xl font-semibold mb-2">Best Time to Book</h3>
                <p className="text-gray-600">
                  Book 2-3 months ahead for summer (June-August). 
                  Spring and fall offer better rates and fewer crowds.
                </p>
              </div>
              
              <div className="border-l-4 border-orange-400 pl-6">
                <h3 className="text-xl font-semibold mb-2">Transportation Tips</h3>
                <p className="text-gray-600">
                  Rent a car or scooter for maximum flexibility. 
                  Bus service connects major areas but can be limited.
                </p>
              </div>
              
              <div className="border-l-4 border-orange-400 pl-6">
                <h3 className="text-xl font-semibold mb-2">Budget Considerations</h3>
                <p className="text-gray-600">
                  Expect premium prices in Platis Gialos. 
                  Better value found in Apollonia and smaller villages.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-sifnos-deep-blue text-white p-8 rounded-xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Book Your Perfect Sifnos Stay?</h2>
          <p className="text-xl mb-6">
            Get exclusive deals and instant confirmation on the best hotels in every area
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/hotels"
              className="px-8 py-3 bg-white text-sifnos-deep-blue rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Browse All Hotels
            </Link>
            <Link 
              to="/touristas-ai"
              className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-sifnos-deep-blue transition-colors font-medium"
            >
              Get AI Recommendations
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}