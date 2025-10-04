import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import HotelCard from '@/components/HotelCard';
import { supabase } from '@/integrations/supabase/client';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Star, Filter, Grid, List } from 'lucide-react';

export default function HotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchParams] = useSearchParams();
  const [filteredHotels, setFilteredHotels] = useState([]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const { data, error } = await supabase
          .from('hotels')
          .select(`
            *,
            hotel_amenities(amenity),
            hotel_photos(id, photo_url, is_main_photo)
          `)
          .order('rating', { ascending: false });
          
        if (error) throw error;
        setHotels(data || []);
        setFilteredHotels(data || []);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  return (
    <>
      <SEO 
        title="Sifnos Hotels 2025 - Compare 25+ Premium Properties | Best Price Guarantee"
        description="Browse 25+ handpicked Sifnos hotels & villas. Compare luxury resorts, family properties & romantic getaways with real-time availability, best prices & instant confirmation. Find your ideal accommodation today."
        keywords={[
          'sifnos hotels 2025', 'compare sifnos hotels', 'best sifnos accommodation',
          'luxury hotels sifnos', 'beach hotels sifnos', 'family hotels sifnos',
          'boutique hotels sifnos', 'sifnos villas', 'book sifnos hotels',
          'sifnos hotel deals', 'verified hotels sifnos', 'instant booking sifnos'
        ]}
        pageType="hotels"
        schemaType="CollectionPage"
        canonical="https://hotelssifnos.com/hotels"
        imageUrl="/uploads/hotels/sifnos-luxury-hotels.jpg"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-sifnos-deep-blue mb-6">
            Best Sifnos Hotels & Villas 2025
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover our handpicked collection of {hotels.length}+ premium hotels, luxury villas, and boutique accommodations. 
            Best price guarantee, instant booking, and expert local recommendations.
          </p>
          
          {/* Quick Category Links */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link to="/hotel-types/luxury-hotels" className="px-4 py-2 bg-sifnos-turquoise text-white rounded-full hover:bg-sifnos-deep-blue transition-colors text-sm font-medium">
              ✨ Luxury Hotels
            </Link>
            <Link to="/hotel-types/villas" className="px-4 py-2 bg-sifnos-turquoise text-white rounded-full hover:bg-sifnos-deep-blue transition-colors text-sm font-medium">
              🏡 Private Villas
            </Link>
            <Link to="/hotel-types/beach-hotels" className="px-4 py-2 bg-sifnos-turquoise text-white rounded-full hover:bg-sifnos-deep-blue transition-colors text-sm font-medium">
              🏖️ Beachfront
            </Link>
            <Link to="/hotel-types/family-friendly-hotels" className="px-4 py-2 bg-sifnos-turquoise text-white rounded-full hover:bg-sifnos-deep-blue transition-colors text-sm font-medium">
              👨‍👩‍👧‍👦 Family Friendly
            </Link>
            <Link to="/hotel-types/boutique-hotels" className="px-4 py-2 bg-sifnos-turquoise text-white rounded-full hover:bg-sifnos-deep-blue transition-colors text-sm font-medium">
              🎨 Boutique
            </Link>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-sifnos-deep-blue">{hotels.length}+</div>
              <div className="text-sm text-gray-600">Verified Hotels</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-sifnos-deep-blue">12</div>
              <div className="text-sm text-gray-600">Island Locations</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-sifnos-deep-blue">24/7</div>
              <div className="text-sm text-gray-600">Expert Support</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-sifnos-deep-blue">100%</div>
              <div className="text-sm text-gray-600">Best Price Guarantee</div>
            </div>
          </div>
        </div>

        {/* Browse by Location Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-sifnos-deep-blue mb-6">Browse Hotels by Location</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link to="/locations/apollonia" className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all group">
              <div className="text-2xl mb-2">🏛️</div>
              <div className="text-sm font-medium text-sifnos-deep-blue group-hover:text-sifnos-turquoise">Apollonia</div>
              <div className="text-xs text-gray-500">Capital & Nightlife</div>
            </Link>
            <Link to="/locations/kamares" className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all group">
              <div className="text-2xl mb-2">⛵</div>
              <div className="text-sm font-medium text-sifnos-deep-blue group-hover:text-sifnos-turquoise">Kamares</div>
              <div className="text-xs text-gray-500">Port & Beach</div>
            </Link>
            <Link to="/locations/platis-gialos" className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all group">
              <div className="text-2xl mb-2">🏖️</div>
              <div className="text-sm font-medium text-sifnos-deep-blue group-hover:text-sifnos-turquoise">Platis Gialos</div>
              <div className="text-xs text-gray-500">Best Beach</div>
            </Link>
            <Link to="/locations/kastro" className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all group">
              <div className="text-2xl mb-2">🏰</div>
              <div className="text-sm font-medium text-sifnos-deep-blue group-hover:text-sifnos-turquoise">Kastro</div>
              <div className="text-xs text-gray-500">Historic Village</div>
            </Link>
            <Link to="/locations/vathi" className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all group">
              <div className="text-2xl mb-2">🏊</div>
              <div className="text-sm font-medium text-sifnos-deep-blue group-hover:text-sifnos-turquoise">Vathi</div>
              <div className="text-xs text-gray-500">Peaceful Bay</div>
            </Link>
            <Link to="/locations" className="text-center p-4 bg-sifnos-turquoise text-white rounded-lg hover:bg-sifnos-deep-blue transition-all">
              <div className="text-2xl mb-2">🗺️</div>
              <div className="text-sm font-medium">View All</div>
              <div className="text-xs opacity-90">12+ Locations</div>
            </Link>
          </div>
        </div>

        {/* View Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Showing {filteredHotels.length} {filteredHotels.length === 1 ? 'hotel' : 'hotels'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">View:</span>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-sifnos-turquoise text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-sifnos-turquoise text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Hotels Grid/List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sifnos-turquoise"></div>
          </div>
        ) : (
          <>
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-6"
            }>
              {filteredHotels.map(hotel => (
                <HotelCard 
                  key={hotel.id} 
                  hotel={hotel} 
                  showLogo={true}
                  viewMode={viewMode}
                />
              ))}
            </div>

            {filteredHotels.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No hotels match your criteria</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or browse all locations</p>
                <Link to="/locations" className="inline-block px-6 py-3 bg-sifnos-turquoise text-white rounded-lg hover:bg-sifnos-deep-blue transition-colors">
                  Browse by Location
                </Link>
              </div>
            )}
          </>
        )}

        {/* Travel Tips Section */}
        <div className="mt-16 bg-gray-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-sifnos-deep-blue mb-6 text-center">
            🎯 Expert Tips for Booking Sifnos Hotels
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-3">🏖️ Best Areas for Different Travelers</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <Link to="/locations/platis-gialos" className="text-sifnos-turquoise hover:underline">Platis Gialos</Link> - Families & beach lovers</li>
                <li>• <Link to="/locations/apollonia" className="text-sifnos-turquoise hover:underline">Apollonia</Link> - Nightlife & dining</li>
                <li>• <Link to="/locations/kastro" className="text-sifnos-turquoise hover:underline">Kastro</Link> - Romance & history</li>
                <li>• <Link to="/locations/vathi" className="text-sifnos-turquoise hover:underline">Vathi</Link> - Peace & nature</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">⏰ Best Time to Visit & Book</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• June-August: Peak season, book 3+ months ahead</li>
                <li>• May & September: Perfect weather, fewer crowds</li>
                <li>• April & October: Great deals, mild weather</li>
                <li>• Best booking time: January-March for summer</li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link to="/travel-guide" className="inline-flex items-center px-6 py-3 bg-sifnos-turquoise text-white rounded-lg hover:bg-sifnos-deep-blue transition-colors font-medium">
              Complete Sifnos Travel Guide →
            </Link>
          </div>
        </div>

        {/* Related Links Section */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-sifnos-deep-blue mb-6">Complete Your Sifnos Experience</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/ferry-tickets" className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all group">
              <div className="text-3xl mb-4">⛴️</div>
              <h3 className="font-semibold text-sifnos-deep-blue group-hover:text-sifnos-turquoise mb-2">Ferry Tickets</h3>
              <p className="text-sm text-gray-600">Book your transport to Sifnos with hotel packages</p>
            </Link>
            <Link to="/best-beaches-sifnos-guide" className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all group">
              <div className="text-3xl mb-4">🏖️</div>
              <h3 className="font-semibold text-sifnos-deep-blue group-hover:text-sifnos-turquoise mb-2">Beach Guide</h3>
              <p className="text-sm text-gray-600">Discover the best beaches near your hotel</p>
            </Link>
            <Link to="/where-to-stay-sifnos" className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all group">
              <div className="text-3xl mb-4">📍</div>
              <h3 className="font-semibold text-sifnos-deep-blue group-hover:text-sifnos-turquoise mb-2">Where to Stay</h3>
              <p className="text-sm text-gray-600">Complete guide to choosing your perfect area</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
