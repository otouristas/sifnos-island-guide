
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Star, 
  Users, 
  ArrowRight, 
  Award, 
  Shield, 
  Clock,
  Compass,
  Waves,
  Gem,
  BarChart3,
  Target,
  Sparkles,
  Heart,
  CalendarDays,
  Car,
  Wallet,
  Flower2,
  Sun,
  Leaf,
  Snowflake
} from 'lucide-react';
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
        title="Where to Stay in Sifnos 2026 - Complete Area Guide | Best Hotels & Locations"
        description="Complete guide to the best areas to stay in Sifnos for 2026. From beachfront Platis Gialos to historic Kastro, find your perfect location with expert recommendations, verified hotels & exclusive deals."
        keywords={[
          'where to stay in sifnos', 'best areas sifnos', 'sifnos accommodation guide 2026',
          'best location sifnos hotels', 'sifnos travel guide', 'sifnos neighborhoods',
          'apollonia vs kamares sifnos', 'platis gialos hotels', 'kastro sifnos accommodation',
          'sifnos village guide', 'best sifnos locations', 'where to stay cyclades'
        ]}
        pageType="location"
        canonical="https://hotelssifnos.com/where-to-stay-sifnos"
        imageUrl="/uploads/sifnos-hero.jpg"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-sifnos-deep-blue mb-6">
            Where to Stay in Sifnos: Complete Guide 2026
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Discover the perfect area for your Sifnos getaway with our comprehensive location guide. 
            From bustling port towns to secluded beach villages, find your ideal base with verified hotels, 
            expert insights, and exclusive booking deals.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 mb-8">
            <div className="flex items-center">
              <Shield className="text-green-500 mr-2" size={16} />
              <span>25+ Verified Hotels</span>
            </div>
            <div className="flex items-center">
              <Award className="text-yellow-500 mr-2" size={16} />
              <span>Local Expert Curated</span>
            </div>
            <div className="flex items-center">
              <Clock className="text-blue-500 mr-2" size={16} />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="bg-sifnos-deep-blue rounded-2xl p-6 mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Compass className="h-5 w-5 text-sifnos-beige" />
            <h2 className="text-xl font-bold text-white">Jump to Your Preferred Area</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {topLocations.map((location) => (
              <a 
                key={location.slug}
                href={`#${location.slug}`}
                className="text-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-white text-sm"
              >
                <div className="font-medium">{location.name}</div>
                <div className="text-xs opacity-75">{location.hotelsCount || '5+'} hotels</div>
              </a>
            ))}
          </div>
        </div>

        {/* Best Areas Section */}
        <section className="mb-16">
          <div className="flex items-center justify-center gap-3 text-sifnos-deep-blue mb-8">
            <Waves className="h-6 w-6" />
            <h2 className="text-3xl font-bold">Best Areas to Stay in Sifnos Island</h2>
          </div>
          
          <div className="space-y-12">
            {topLocations.map((location, index) => (
              <div key={location.slug} id={location.slug} className="scroll-mt-8">
                <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    <div className="relative h-64 lg:h-auto">
                      <img 
                        src={location.imageUrl} 
                        alt={`${location.name}, Sifnos`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-sifnos-turquoise text-white px-3 py-1 rounded-full text-sm font-medium">
                        #{index + 1} Recommended
                      </div>
                      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                        {location.hotelsCount || '5+'} Hotels Available
                      </div>
                    </div>
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-bold text-sifnos-deep-blue mb-4">{location.name}</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">{location.description || location.shortDescription}</p>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-sm">
                          <MapPin size={16} className="mr-2 text-sifnos-turquoise" />
                          <span className="font-medium mr-2">Best for:</span>
                          <span className="text-gray-600">
                            {location.name === 'Apollonia' && 'Nightlife, dining, central location'}
                            {location.name === 'Kamares' && 'Ferry convenience, waterfront dining'}
                            {location.name === 'Platis Gialos' && 'Families, beach lovers, water sports'}
                            {location.name === 'Kastro' && 'Romance, history, stunning views'}
                            {location.name === 'Vathi' && 'Peace, nature, secluded beaches'}
                            {location.name === 'Faros' && 'Traditional fishing village charm'}
                            {!['Apollonia', 'Kamares', 'Platis Gialos', 'Kastro', 'Vathi', 'Faros'].includes(location.name) && 'Authentic island experience'}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Users size={16} className="mr-2 text-sifnos-turquoise" />
                          <span className="font-medium mr-2">Ideal travelers:</span>
                          <span className="text-gray-600">
                            {location.name === 'Apollonia' && 'First-time visitors, couples, solo travelers'}
                            {location.name === 'Kamares' && 'Convenience seekers, short stays'}
                            {location.name === 'Platis Gialos' && 'Families with children, beach enthusiasts'}
                            {location.name === 'Kastro' && 'Romantic couples, history buffs'}
                            {location.name === 'Vathi' && 'Nature lovers, peaceful retreats'}
                            {location.name === 'Faros' && 'Authentic experience seekers'}
                            {!['Apollonia', 'Kamares', 'Platis Gialos', 'Kastro', 'Vathi', 'Faros'].includes(location.name) && 'Adventure travelers, culture enthusiasts'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link 
                          to={`/locations/${location.slug}`}
                          className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-sifnos-turquoise text-white rounded-lg hover:bg-sifnos-deep-blue transition-colors font-medium"
                        >
                          View Hotels in {location.name} <ArrowRight size={16} className="ml-2" />
                        </Link>
                        <button className="px-4 py-2 border-2 border-sifnos-turquoise text-sifnos-turquoise rounded-lg hover:bg-sifnos-turquoise hover:text-white transition-colors font-medium">
                          Compare Prices
                        </button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Hotel Finder */}
        <section className="mb-16 bg-gray-50 p-8 rounded-2xl">
          <div className="flex items-center justify-center gap-3 text-sifnos-deep-blue mb-8">
            <Gem className="h-6 w-6" />
            <h2 className="text-3xl font-bold">Top Rated Hotels by Area</h2>
          </div>
          
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
              View All Hotels & Compare Prices
            </Link>
          </div>
        </section>

        {/* Detailed Comparison Table */}
        <section className="mb-16">
          <div className="flex items-center justify-center gap-3 text-sifnos-deep-blue mb-8">
            <BarChart3 className="h-6 w-6" />
            <h2 className="text-3xl font-bold">Sifnos Areas Comparison Guide</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm overflow-hidden">
              <thead className="bg-sifnos-deep-blue text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Location</th>
                  <th className="px-6 py-4 text-center">Beach Access</th>
                  <th className="px-6 py-4 text-center">Nightlife</th>
                  <th className="px-6 py-4 text-center">Family Friendly</th>
                  <th className="px-6 py-4 text-center">Transport Links</th>
                  <th className="px-6 py-4 text-center">Price Range</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-sifnos-deep-blue">Apollonia</div>
                    <div className="text-sm text-gray-600">Island Capital</div>
                  </td>
                  <td className="px-6 py-4 text-center">3/5</td>
                  <td className="px-6 py-4 text-center">5/5</td>
                  <td className="px-6 py-4 text-center">4/5</td>
                  <td className="px-6 py-4 text-center">5/5</td>
                  <td className="px-6 py-4 text-center text-sm">€80-180</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-sifnos-deep-blue">Kamares</div>
                    <div className="text-sm text-gray-600">Main Port</div>
                  </td>
                  <td className="px-6 py-4 text-center">4/5</td>
                  <td className="px-6 py-4 text-center">3/5</td>
                  <td className="px-6 py-4 text-center">4/5</td>
                  <td className="px-6 py-4 text-center">5/5</td>
                  <td className="px-6 py-4 text-center text-sm">€70-150</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-sifnos-deep-blue">Platis Gialos</div>
                    <div className="text-sm text-gray-600">Best Beach</div>
                  </td>
                  <td className="px-6 py-4 text-center">5/5</td>
                  <td className="px-6 py-4 text-center">2/5</td>
                  <td className="px-6 py-4 text-center">5/5</td>
                  <td className="px-6 py-4 text-center">3/5</td>
                  <td className="px-6 py-4 text-center text-sm">€90-200</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-sifnos-deep-blue">Kastro</div>
                    <div className="text-sm text-gray-600">Historic Village</div>
                  </td>
                  <td className="px-6 py-4 text-center">2/5</td>
                  <td className="px-6 py-4 text-center">1/5</td>
                  <td className="px-6 py-4 text-center">2/5</td>
                  <td className="px-6 py-4 text-center">2/5</td>
                  <td className="px-6 py-4 text-center text-sm">€100-250</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Travel Tips Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 text-sifnos-deep-blue mb-8">
            <Target className="h-6 w-6" />
            <h2 className="text-3xl font-bold">Expert Tips: Choosing Your Perfect Area</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="border-l-4 border-sifnos-turquoise pl-6">
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <Waves className="h-5 w-5 text-sifnos-deep-blue" />
                  For Beach Lovers
                </h3>
                <p className="text-gray-600 mb-3">
                  <Link to="/locations/platis-gialos" className="text-sifnos-turquoise font-medium hover:underline">Platis Gialos</Link> offers the island's most popular beach with golden sand, 
                  shallow waters perfect for families, and excellent beachfront hotels. The area has tavernas, 
                  water sports, and a relaxed atmosphere.
                </p>
                <Link to="/hotel-types/beach-hotels" className="text-sm text-sifnos-turquoise hover:underline">
                  View Beachfront Hotels →
                </Link>
              </div>
              
              <div className="border-l-4 border-sifnos-turquoise pl-6">
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-sifnos-deep-blue" />
                  For Nightlife & Dining
                </h3>
                <p className="text-gray-600 mb-3">
                  <Link to="/locations/apollonia" className="text-sifnos-turquoise font-medium hover:underline">Apollonia</Link>, the island's capital, is the epicenter of Sifnos nightlife. 
                  The charming pedestrian streets come alive after sunset with bars, cafes, and restaurants 
                  serving both traditional and modern cuisine.
                </p>
                <Link to="/hotel-types/boutique-hotels" className="text-sm text-sifnos-turquoise hover:underline">
                  View Boutique Hotels →
                </Link>
              </div>
              
              <div className="border-l-4 border-sifnos-turquoise pl-6">
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-sifnos-deep-blue" />
                  For Romance & Luxury
                </h3>
                <p className="text-gray-600 mb-3">
                  <Link to="/locations/kastro" className="text-sifnos-turquoise font-medium hover:underline">Kastro</Link> and <Link to="/locations/vathi" className="text-sifnos-turquoise font-medium hover:underline">Vathi</Link> provide intimate settings 
                  with spectacular sunset views, medieval architecture, and peaceful surroundings. 
                  Perfect for couples seeking romance and tranquility.
                </p>
                <Link to="/hotel-types/luxury-hotels" className="text-sm text-sifnos-turquoise hover:underline">
                  View Luxury Hotels →
                </Link>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="border-l-4 border-orange-400 pl-6">
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-sifnos-deep-blue" />
                  Booking Strategy
                </h3>
                <p className="text-gray-600 mb-3">
                  Book 2-3 months ahead for summer (June-August) to secure the best hotels and rates. 
                  Spring (April-May) and fall (September-October) offer excellent weather with significantly 
                  lower prices and fewer crowds.
                </p>
                <Link to="/hotels" className="text-sm text-orange-600 hover:underline">
                  Check Current Availability →
                </Link>
              </div>
              
              <div className="border-l-4 border-orange-400 pl-6">
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <Car className="h-5 w-5 text-sifnos-deep-blue" />
                  Transportation Guide
                </h3>
                <p className="text-gray-600 mb-3">
                  Rent a car or scooter for maximum flexibility exploring the island. Regular bus service 
                  connects major areas, but having your own transport opens up hidden beaches and 
                  traditional villages off the beaten path.
                </p>
                <a href="https://cycladesrentacar.com" target="_blank" rel="noopener noreferrer" className="text-sm text-orange-600 hover:underline">
                  Rent a Car in Sifnos →
                </a>
              </div>
              
              <div className="border-l-4 border-orange-400 pl-6">
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-sifnos-deep-blue" />
                  Budget Considerations
                </h3>
                <p className="text-gray-600 mb-3">
                  Expect premium prices in popular beach areas like Platis Gialos. Better value can be 
                  found in <Link to="/locations/apollonia" className="text-sifnos-turquoise font-medium hover:underline">Apollonia</Link> and smaller villages, 
                  with easy access to beaches via bus or rental vehicle.
                </p>
                <Link to="/pricing" className="text-sm text-orange-600 hover:underline">
                  Compare Hotel Prices →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Seasonal Guide */}
        <section className="mb-16 bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center justify-center gap-3 text-sifnos-deep-blue mb-8">
            <CalendarDays className="h-6 w-6" />
            <h2 className="text-3xl font-bold">Best Time to Stay in Each Area</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="mb-3 flex items-center justify-center">
                <Flower2 className="h-8 w-8 text-sifnos-deep-blue" />
              </div>
              <h3 className="font-semibold text-sifnos-deep-blue mb-2">Spring (Apr-May)</h3>
              <p className="text-sm text-gray-600 mb-3">Perfect weather, wildflowers, fewer crowds</p>
              <div className="text-xs text-gray-500">
                Best areas: All locations, especially hiking areas
              </div>
            </div>
            
            <div className="text-center p-6 bg-yellow-50 rounded-xl">
              <div className="mb-3 flex items-center justify-center">
                <Sun className="h-8 w-8 text-sifnos-deep-blue" />
              </div>
              <h3 className="font-semibold text-sifnos-deep-blue mb-2">Summer (Jun-Aug)</h3>
              <p className="text-sm text-gray-600 mb-3">Peak season, hot weather, full services</p>
              <div className="text-xs text-gray-500">
                Best areas: Beach locations, Apollonia nightlife
              </div>
            </div>
            
            <div className="text-center p-6 bg-orange-50 rounded-xl">
              <div className="mb-3 flex items-center justify-center">
                <Leaf className="h-8 w-8 text-sifnos-deep-blue" />
              </div>
              <h3 className="font-semibold text-sifnos-deep-blue mb-2">Fall (Sep-Oct)</h3>
              <p className="text-sm text-gray-600 mb-3">Warm sea, great weather, lower prices</p>
              <div className="text-xs text-gray-500">
                Best areas: Beach areas, romantic locations
              </div>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="mb-3 flex items-center justify-center">
                <Snowflake className="h-8 w-8 text-sifnos-deep-blue" />
              </div>
              <h3 className="font-semibold text-sifnos-deep-blue mb-2">Winter (Nov-Mar)</h3>
              <p className="text-sm text-gray-600 mb-3">Quiet period, authentic local life</p>
              <div className="text-xs text-gray-500">
                Best areas: Apollonia, traditional villages
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-sifnos-deep-blue text-white p-8 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Book Your Perfect Sifnos Stay?</h2>
          <p className="text-xl mb-6">
            Get exclusive deals, instant confirmation, and expert local support for your dream island getaway
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/hotels"
              className="px-8 py-3 bg-white text-sifnos-deep-blue rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Browse All Hotels & Prices
            </Link>
            <Link 
              to="/touristas-ai"
              className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-sifnos-deep-blue transition-colors font-medium"
            >
              Get Personalized Recommendations
            </Link>
          </div>
          <div className="mt-6 text-sm opacity-75">
            ✅ Best Price Guarantee • ✅ 24/7 Expert Support • ✅ Instant Booking Confirmation
          </div>
        </section>
      </div>
    </>
  );
}
