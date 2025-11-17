import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getLocationBySlug, Location, sifnosLocations } from '../data/locations';
import { supabase } from '@/integrations/supabase/client';
import SEO from '../components/SEO';
import SchemaGenerator from '../components/SchemaGenerator';
import Breadcrumbs from '../components/Breadcrumbs';
import HotelCard from '../components/HotelCard';
import { getBeachesByLocation } from '../data/locationBeaches';
import { useTouristas } from '@/contexts/TouristasContext';
import { MapPin, Waves, Utensils, Bus, Car, Clock, ArrowRight, CheckCircle } from 'lucide-react';
import TouristasLogo from '@/components/TouristasLogo';
import { Button } from '@/components/ui/button';

export default function LocationPage() {
  const { slug } = useParams<{ slug: string }>();
  const [location, setLocation] = useState<Location | null>(null);
  const [relatedLocations, setRelatedLocations] = useState<Location[]>([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { openChatWithPrompt } = useTouristas();
  
  // Get location-specific data
  const nearbyBeaches = slug ? getBeachesByLocation(slug) : [];
  
  // Location-specific tips data
  const getLocationTips = () => {
    if (!location) return null;
    
    const tips: Record<string, { restaurants: string[]; busFrequency: string; parking: string; insights: string[] }> = {
      'kamares': {
        restaurants: ['To Liotrivi', 'Captain Andreas', 'Kamares Taverna', 'Porto Kamares'],
        busFrequency: 'Every 30-60 minutes to Apollonia, frequent connections',
        parking: 'Free parking available near the port and beach area',
        insights: ['Best for ferry arrivals', 'Waterfront dining options', 'Easy access to rest of island']
      },
      'platis-gialos': {
        restaurants: ['Omega3', 'Platis Gialos Taverna', 'Captain Andreas', 'Beachfront cafes'],
        busFrequency: 'Regular service from Apollonia (15 min journey)',
        parking: 'Parking available along the beach road',
        insights: ['Family-friendly atmosphere', 'Water sports available', 'Blue Flag beach']
      },
      'apollonia': {
        restaurants: ['Cantina', 'To Liotrivi', 'Meltemi', 'Traditional tavernas on Steno'],
        busFrequency: 'Central hub - buses depart every 30-60 minutes to all locations',
        parking: 'Limited parking in center, use public lots on outskirts',
        insights: ['Best nightlife on the island', 'Shopping and art galleries', 'Central location']
      },
      'vathi': {
        restaurants: ['Vathi Taverna', 'Traditional fish tavernas', 'Beachfront dining'],
        busFrequency: 'Less frequent service, check schedules (20 min from Apollonia)',
        parking: 'Parking available near the beach',
        insights: ['Sheltered bay perfect for swimming', 'Traditional fishing village', 'Quieter atmosphere']
      },
      'faros': {
        restaurants: ['Faros Taverna', 'Lighthouse restaurant', 'Beach cafes'],
        busFrequency: 'Limited service, better with car (25 min from Apollonia)',
        parking: 'Parking near lighthouse and beaches',
        insights: ['Two beaches separated by peninsula', 'Great for windsurfing', 'Scenic lighthouse views']
      },
      'kastro': {
        restaurants: ['Kastro Taverna', 'Traditional cafes', 'Local restaurants'],
        busFrequency: 'Regular service from Apollonia (10 min journey)',
        parking: 'Parking outside the village (pedestrian-only center)',
        insights: ['Medieval architecture', 'Historic charm', 'Breathtaking views']
      },
      'artemonas': {
        restaurants: ['Traditional tavernas', 'Local cafes', 'Neoclassical dining'],
        busFrequency: 'Regular service, very close to Apollonia (5 min)',
        parking: 'Parking available on village outskirts',
        insights: ['Neoclassical architecture', 'Quiet and traditional', 'Close to capital']
      }
    };
    
    return tips[slug || ''] || null;
  };
  
  const locationTips = getLocationTips();
  
  // Location-specific mini itinerary
  const getMiniItinerary = () => {
    if (!location) return null;
    
    const itineraries: Record<string, { day1: string[]; day2?: string[] }> = {
      'kamares': {
        day1: [
          'Morning: Arrive at port, check into hotel',
          'Afternoon: Relax on Kamares beach, enjoy waterfront lunch',
          'Evening: Explore port area, dinner at local taverna'
        ],
        day2: [
          'Morning: Take bus to Apollonia for shopping',
          'Afternoon: Visit nearby Chrysopigi monastery',
          'Evening: Return to Kamares for sunset drinks'
        ]
      },
      'platis-gialos': {
        day1: [
          'Morning: Beach time at Platis Gialos, water sports',
          'Afternoon: Visit White Tower (1.5km), pottery studios',
          'Evening: Beachfront dinner, sunset views'
        ],
        day2: [
          'Morning: Explore nearby Vathi bay',
          'Afternoon: Hiking to Fykiada beach (if adventurous)',
          'Evening: Return to Platis Gialos for nightlife'
        ]
      },
      'apollonia': {
        day1: [
          'Morning: Explore Steno street, visit art galleries',
          'Afternoon: Traditional lunch, visit nearby Kastro',
          'Evening: Nightlife on Steno, dinner at Cantina'
        ],
        day2: [
          'Morning: Bus to Platis Gialos or Kamares beach',
          'Afternoon: Return for shopping and cafes',
          'Evening: More nightlife, live music venues'
        ]
      }
    };
    
    return itineraries[slug || ''] || null;
  };
  
  const miniItinerary = getMiniItinerary();
  
  // Get "Best for" tags based on location
  const getBestForTags = () => {
    if (!location) return [];
    
    const tags: Record<string, string[]> = {
      'kamares': ['Families', 'Convenience', 'Beach lovers', 'First-time visitors'],
      'platis-gialos': ['Families', 'Beach lovers', 'Water sports', 'Relaxation'],
      'apollonia': ['Nightlife', 'Shopping', 'Food lovers', 'Culture'],
      'vathi': ['Couples', 'Nature lovers', 'Quiet', 'Traditional'],
      'faros': ['Adventure', 'Photography', 'Windsurfing', 'Secluded'],
      'kastro': ['History', 'Romance', 'Views', 'Culture'],
      'artemonas': ['Traditional', 'Quiet', 'Architecture', 'Culture']
    };
    
    return tags[slug || ''] || ['All travelers'];
  };
  
  const bestForTags = getBestForTags();
  
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
  
  // SEO Plan optimized titles and descriptions
  const generateSeoTitle = () => {
    const titleMap: Record<string, string> = {
      'Platis Gialos': 'Platis Gialos Hotels Sifnos | Best Beach Accommodations',
      'Kamares': 'Hotels in Kamares Sifnos | Port Area Accommodation Guide',
      'Apollonia': 'Hotels in Apollonia Sifnos | Capital Town Accommodations',
      'Artemonas': 'Artemonas Hotels Sifnos | Elegant Village Accommodations',
      'Vathi': 'Vathi Beach Hotels Sifnos | Quiet Bay Accommodations',
      'Faros': 'Faros Beach Hotels Sifnos | Fishing Village Charm',
      'Kastro': 'Kastro Sifnos Hotels | Medieval Village Accommodations'
    };
    
    return titleMap[location.name] || `Hotels in ${location.name}, Sifnos 2026 - Best Places to Stay | Hotels Sifnos`;
  };
  
  // SEO Plan optimized descriptions
  const generateSeoDescription = () => {
    const descMap: Record<string, string> = {
      'Platis Gialos': "Platis Gialos—Sifnos' longest beach. Find hotels steps from golden sand, tavernas, watersports. From budget rooms to luxury suites. See all 15 properties.",
      'Kamares': 'Stay in Kamares, Sifnos\' bustling port town with beach access, waterfront dining, ferry convenience. 12 hotels from budget to boutique. Explore options.',
      'Apollonia': 'Stay in Apollonia, Sifnos\' vibrant capital. Central location for island exploration, nightlife, shopping, dining. 18 hotels from budget to boutique. Browse.',
      'Artemonas': 'Artemonas blends aristocratic mansions with modern boutiques. Stunning village views, gourmet restaurants, 10-min walk to Apollonia. Refined elegance awaits.',
      'Vathi': 'Vathi offers Sifnos\' most tranquil beach stay. Crystal waters, pottery studios, authentic tavernas. Perfect for couples seeking peaceful retreat. View hotels.',
      'Faros': 'Faros combines beach access with authentic fishing village atmosphere. Fresh seafood tavernas, three small beaches, family-friendly waters. See all stays.',
      'Kastro': 'Sleep in Sifnos\' ancient capital. Kastro\'s medieval streets, archaeological museum, sunset views create magical stays. Limited but special accommodation.'
    };
    
    return descMap[location.name] || `Explore hotels in ${location.name}, Sifnos - ${location.shortDescription.toLowerCase()}. Find exclusive accommodations with sea views, local charm, and authentic Cycladic experiences. Compare prices and book with our best-rate guarantee.`;
  };
  
  return (
    <>
      <SEO 
        title={generateSeoTitle()}
        description={generateSeoDescription()}
        keywords={location.keywords}
        pageType="location"
        schemaType="TouristDestination"
        canonical={`https://hotelssifnos.com/locations/${slug}`}
        imageUrl={location.imageUrl}
        locationData={{
          name: location.name,
          hotelsCount: hotels.length || location.hotelsCount,
          type: location.name === 'Kamares' ? 'port' : 
                location.name === 'Apollonia' ? 'capital' :
                location.name.toLowerCase().includes('beach') || location.name.toLowerCase().includes('gialos') ? 'beach' :
                'village'
        }}
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
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Hotels in {location.name}, Sifnos
            </h1>
            {bestForTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-white/90 text-sm font-medium">Best for:</span>
                {bestForTags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white border border-white/30">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-4 mt-4">
              <Button
                onClick={() => navigate(`/hotels?location=${slug}`)}
                className="bg-sifnos-beige text-sifnos-deep-blue hover:bg-sifnos-beige/90 font-semibold"
              >
                View All Hotels in {location.name}
                <ArrowRight size={16} className="ml-2" />
              </Button>
              <Button
                onClick={() => openChatWithPrompt(`Help me decide if ${location.name} is the right location for my trip`)}
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-sifnos-deep-blue"
              >
                <TouristasLogo size="sm" className="mr-2 h-4 w-4" />
                Ask Touristas AI
              </Button>
            </div>
          </div>
        </div>
        
            {/* Introduction */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="prose prose-lg space-y-6">
                <p className="lead text-xl text-gray-700 font-medium mb-6">{location.shortDescription}</p>
                <p className="text-gray-600">
                  {location.description} For more comprehensive island information, check out our <Link to="/travel-guide" className="text-sifnos-deep-blue hover:underline font-medium">complete Sifnos travel guide</Link> and discover the <Link to="/best-beaches-sifnos-guide" className="text-sifnos-deep-blue hover:underline font-medium">best beaches in Sifnos</Link>.
                </p>
              </div>
            </div>
        
        {/* Hotels Section */}
        <section className="my-12">
          <h2 className="text-2xl font-bold text-sifnos-deep-blue mb-6">
            Top Hotels in {location.name}, Sifnos
          </h2>
          
          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4" />
                  <div className="h-6 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          )}
          
          {/* Hotels Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.length > 0 ? (
                hotels.slice(0, 6).map(hotel => (
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
          
          {!loading && hotels.length > 6 && (
            <div className="text-center mt-6">
              <Button
                onClick={() => navigate(`/hotels?location=${slug}`)}
                variant="outline"
                className="border-2 border-sifnos-deep-blue text-sifnos-deep-blue hover:bg-sifnos-deep-blue hover:text-white"
              >
                View All {hotels.length} Hotels in {location.name}
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          )}
        </section>
        
        {/* Best Beaches Nearby Section */}
        {nearbyBeaches.length > 0 && (
          <section className="my-12 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-6">
              <Waves className="h-6 w-6 text-sifnos-deep-blue" />
              <h2 className="text-2xl font-bold text-sifnos-deep-blue">
                Best Beaches Nearby
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nearbyBeaches.map((beach, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sifnos-deep-blue">{beach.name}</h3>
                    {beach.distance === 0 && (
                      <span className="px-2 py-1 bg-sifnos-beige/30 text-sifnos-deep-blue text-xs rounded-full">In {location.name}</span>
                    )}
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    {beach.distance > 0 && (
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span>{beach.distance} km away</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Waves size={14} />
                      <span className="capitalize">{beach.type} beach</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        beach.accessDifficulty === 'easy' ? 'bg-green-100 text-green-700' :
                        beach.accessDifficulty === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {beach.accessDifficulty === 'easy' ? 'Easy access' :
                         beach.accessDifficulty === 'moderate' ? 'Moderate' : 'Difficult'}
                      </span>
                      {beach.organized && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">Organized</span>
                      )}
                    </div>
                  </div>
                  {beach.slug && (
                    <Link
                      to={`/best-beaches-sifnos-guide#${beach.slug}`}
                      className="text-sifnos-deep-blue text-sm font-medium hover:underline mt-2 inline-block"
                    >
                      View {beach.name} Beach Details →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Local Tips Section */}
        {locationTips && (
          <section className="my-12 bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-sifnos-deep-blue mb-6">
              Local Tips for {location.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Utensils className="h-5 w-5 text-sifnos-deep-blue" />
                  <h3 className="font-semibold text-sifnos-deep-blue">Where to Eat</h3>
                </div>
                <ul className="space-y-2">
                  {locationTips.restaurants.map((restaurant, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <CheckCircle size={16} className="text-sifnos-beige mt-0.5 flex-shrink-0" />
                      <span>{restaurant}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Bus className="h-5 w-5 text-sifnos-deep-blue" />
                  <h3 className="font-semibold text-sifnos-deep-blue">Getting Around</h3>
                </div>
                <p className="text-gray-700 mb-3">{locationTips.busFrequency}</p>
                
                <div className="flex items-center gap-2 mb-3 mt-4">
                  <Car className="h-5 w-5 text-sifnos-deep-blue" />
                  <h3 className="font-semibold text-sifnos-deep-blue">Parking</h3>
                </div>
                <p className="text-gray-700">{locationTips.parking}</p>
              </div>
            </div>
            
            {locationTips.insights.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-sifnos-deep-blue mb-3">Local Insights</h3>
                <div className="flex flex-wrap gap-2">
                  {locationTips.insights.map((insight, index) => (
                    <span key={index} className="px-3 py-1 bg-sifnos-beige/20 text-sifnos-deep-blue rounded-full text-sm">
                      {insight}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
        
        {/* Mini Itinerary Section */}
        {miniItinerary && (
          <section className="my-12 bg-gradient-to-br from-sifnos-beige/10 to-sifnos-deep-blue/5 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="h-6 w-6 text-sifnos-deep-blue" />
              <h2 className="text-2xl font-bold text-sifnos-deep-blue">
                1-2 Days in {location.name}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-5 shadow-sm">
                <h3 className="font-semibold text-sifnos-deep-blue mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-sifnos-beige text-sifnos-deep-blue flex items-center justify-center font-bold">1</span>
                  Day 1
                </h3>
                <ul className="space-y-2">
                  {miniItinerary.day1.map((activity, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="text-sifnos-beige mt-1">•</span>
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {miniItinerary.day2 && (
                <div className="bg-white rounded-lg p-5 shadow-sm">
                  <h3 className="font-semibold text-sifnos-deep-blue mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-sifnos-beige text-sifnos-deep-blue flex items-center justify-center font-bold">2</span>
                    Day 2
                  </h3>
                  <ul className="space-y-2">
                    {miniItinerary.day2.map((activity, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className="text-sifnos-beige mt-1">•</span>
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}
        
        {/* Touristas AI CTA Section */}
        <section className="my-12 bg-gradient-to-r from-sifnos-deep-blue to-[#0b1626] rounded-xl p-8 text-white text-center">
          <TouristasLogo size="xl" className="mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">Is {location.name} Right for You?</h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Not sure if {location.name} matches your travel style? Ask Touristas AI for personalized recommendations based on your preferences, budget, and travel needs.
          </p>
          <Button
            onClick={() => openChatWithPrompt(`Help me decide if ${location.name} is the right location for my trip`)}
            size="lg"
            className="bg-sifnos-beige text-sifnos-deep-blue hover:bg-sifnos-beige/90 font-semibold"
          >
            <TouristasLogo size="sm" className="mr-2" />
            Ask Touristas AI About {location.name}
          </Button>
        </section>
        
        {/* Related Locations Section - Enhanced Visuals */}
        <section className="my-16 bg-gradient-to-br from-gray-50 to-white p-8 md:p-12 rounded-2xl shadow-lg border border-gray-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-sifnos-deep-blue mb-3">
              Explore Other Locations in Sifnos
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover more beautiful areas of Sifnos, each with its unique character and charm
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {relatedLocations.map((loc) => (
              <Link 
                key={loc.slug} 
                to={`/locations/${loc.slug}`}
                className="group block overflow-hidden rounded-xl shadow-md bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={loc.imageUrl} 
                    alt={loc.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-xl mb-1 drop-shadow-lg">{loc.name}</h3>
                    <div className="flex items-center gap-2 text-white/90 text-sm">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-white/20 backdrop-blur-sm">
                        {relatedLocations.filter(l => l.slug !== loc.slug).length + 1} locations
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{loc.shortDescription}</p>
                  <div className="mt-4 flex items-center text-sifnos-turquoise font-medium text-sm group-hover:text-sifnos-deep-blue transition-colors">
                    <span>Explore {loc.name}</span>
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link 
              to="/locations" 
              className="inline-flex items-center px-6 py-3 bg-sifnos-deep-blue text-white font-semibold rounded-lg hover:bg-sifnos-deep-blue/90 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              View All Locations
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>
        
        {/* Local Experiences Section */}
        <section className="my-16 bg-gradient-to-br from-white to-gray-50 p-8 md:p-12 rounded-2xl shadow-lg border border-gray-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-sifnos-deep-blue mb-3">
              Local Experiences in {location.name}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover authentic activities, dining, and cultural experiences unique to {location.name}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Restaurants & Dining */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500/10 to-red-500/10 flex items-center justify-center">
                  <Utensils className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-heading font-bold text-lg text-sifnos-deep-blue">Dining</h3>
              </div>
              {locationTips?.restaurants && locationTips.restaurants.length > 0 ? (
                <ul className="space-y-2 mb-4">
                  {locationTips.restaurants.slice(0, 3).map((restaurant, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                      <CheckCircle size={14} className="text-sifnos-turquoise mt-0.5 flex-shrink-0" />
                      <span>{restaurant}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 text-sm mb-4">
                  Discover traditional tavernas and modern restaurants serving authentic Sifnian cuisine.
                </p>
              )}
              <Link 
                to="/travel-guide#dining"
                className="text-sm text-sifnos-deep-blue hover:text-sifnos-turquoise hover:underline font-medium"
              >
                View Dining Guide →
              </Link>
            </div>

            {/* Activities */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center">
                  <Waves className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-heading font-bold text-lg text-sifnos-deep-blue">Activities</h3>
              </div>
              {nearbyBeaches && nearbyBeaches.length > 0 ? (
                <div className="mb-4">
                  <p className="text-gray-700 text-sm mb-2 font-medium">Nearby Beaches:</p>
                  <ul className="space-y-1">
                    {nearbyBeaches.slice(0, 2).map((beach, index) => (
                      <li key={index} className="text-gray-600 text-sm">
                        • {beach.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-600 text-sm mb-4">
                  Enjoy beach activities, water sports, and exploring the local area.
                </p>
              )}
              <Link 
                to="/best-beaches-sifnos-guide"
                className="text-sm text-sifnos-deep-blue hover:text-sifnos-turquoise hover:underline font-medium"
              >
                View Beaches Guide →
              </Link>
            </div>

            {/* Shopping & Culture */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-heading font-bold text-lg text-sifnos-deep-blue">Culture</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Explore local shops, pottery workshops, historic churches, and traditional architecture.
              </p>
              <Link 
                to="/travel-guide#culture"
                className="text-sm text-sifnos-deep-blue hover:text-sifnos-turquoise hover:underline font-medium"
              >
                View Culture Guide →
              </Link>
            </div>
          </div>
        </section>

        {/* Transportation Guide Section */}
        <section className="my-16 bg-white border-2 border-gray-100 rounded-2xl p-8 md:p-12 shadow-lg">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-12 bg-gradient-to-b from-sifnos-turquoise to-sifnos-deep-blue rounded-full"></div>
            <h2 className="text-3xl font-montserrat font-bold text-sifnos-deep-blue">
              Getting to {location.name}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* From Port */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Bus className="h-6 w-6 text-blue-600" />
                <h3 className="font-semibold text-lg text-sifnos-deep-blue">From Kamares Port</h3>
              </div>
              {location.name === 'Kamares' ? (
                <p className="text-gray-700 mb-4">
                  {location.name} is the main port of Sifnos. Hotels are within walking distance from the ferry terminal.
                </p>
              ) : (
                <p className="text-gray-700 mb-4">
                  Take a taxi or rent a car from Kamares port. The journey to {location.name} takes approximately {location.name === 'Apollonia' ? '10-15' : location.name === 'Platis Gialos' ? '15-20' : '20-30'} minutes.
                </p>
              )}
              <Link 
                to="/ferry-tickets"
                className="text-sm text-sifnos-deep-blue hover:text-sifnos-turquoise hover:underline font-medium"
              >
                Book Ferry Tickets →
              </Link>
            </div>

            {/* Parking & Transportation */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Car className="h-6 w-6 text-green-600" />
                <h3 className="font-semibold text-lg text-sifnos-deep-blue">Parking & Transport</h3>
              </div>
              {locationTips?.parking ? (
                <p className="text-gray-700 mb-4">{locationTips.parking}</p>
              ) : (
                <p className="text-gray-700 mb-4">
                  {location.name === 'Kastro' ? 'Limited parking available. Cars are not allowed in the village center.' : 
                   location.name === 'Apollonia' ? 'Parking available in designated areas. Some streets are pedestrian-only.' :
                   'Free parking available for hotel guests. Spaces may be limited during peak season.'}
                </p>
              )}
              {locationTips?.busFrequency && (
                <p className="text-gray-700 text-sm mb-4">
                  <strong>Bus Service:</strong> {locationTips.busFrequency}
                </p>
              )}
              <Link 
                to="/travel-guide#transportation"
                className="text-sm text-sifnos-deep-blue hover:text-sifnos-turquoise hover:underline font-medium"
              >
                Transportation Guide →
              </Link>
            </div>
          </div>
        </section>

        {/* Best Time to Visit Section */}
        <section className="my-16 bg-gradient-to-br from-sifnos-beige/10 to-sifnos-deep-blue/5 rounded-2xl p-8 md:p-12 border border-sifnos-beige/20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-montserrat font-bold text-sifnos-deep-blue mb-3">
              Best Time to Visit {location.name}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Plan your visit based on weather, crowds, and seasonal activities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-semibold text-lg text-sifnos-deep-blue mb-3">Peak Season</h3>
              <p className="text-gray-700 text-sm mb-2"><strong>July - August</strong></p>
              <p className="text-gray-600 text-sm">
                Warmest weather, all amenities open, vibrant atmosphere. Book early as hotels fill up quickly.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-sifnos-turquoise">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-sifnos-turquoise text-white text-xs font-semibold rounded">RECOMMENDED</span>
              </div>
              <h3 className="font-semibold text-lg text-sifnos-deep-blue mb-3">Shoulder Season</h3>
              <p className="text-gray-700 text-sm mb-2"><strong>May - June, September - October</strong></p>
              <p className="text-gray-600 text-sm">
                Perfect weather, fewer crowds, better prices. Ideal for exploring and enjoying the island's natural beauty.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-semibold text-lg text-sifnos-deep-blue mb-3">Off-Season</h3>
              <p className="text-gray-700 text-sm mb-2"><strong>November - April</strong></p>
              <p className="text-gray-600 text-sm">
                Peaceful atmosphere, lower prices, perfect for cultural exploration and hiking. Limited hotel/restaurant operations.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link 
              to="/travel-guide#best-time-to-visit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-sifnos-deep-blue text-white font-semibold rounded-lg hover:bg-sifnos-deep-blue/90 transition-all duration-300"
            >
              Learn More About Sifnos Seasons
              <ArrowRight size={18} />
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
        
        {/* FAQ Section for Location */}
        <section className="my-12 bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-sifnos-deep-blue mb-6">
            Frequently Asked Questions About {location.name}
          </h2>
          <div className="space-y-4">
            {(() => {
              const locationFaqs: Record<string, Array<{question: string, answer: string}>> = {
                'platis-gialos': [
                  {
                    question: `Which ${location.name} area has the best beaches?`,
                    answer: `${location.name} itself is home to Sifnos' longest and most popular beach, with golden sand, shallow waters, and organized facilities. The beach stretches for over a kilometer, making it perfect for families and beach lovers.`
                  },
                  {
                    question: `Where should families stay in ${location.name}?`,
                    answer: `Families should stay in ${location.name} for its safe, shallow beach, family-friendly hotels with pools, and easy access to restaurants and amenities. The organized beach with sunbeds and umbrellas makes it ideal for children.`
                  },
                  {
                    question: `What's the most romantic area in ${location.name}?`,
                    answer: `${location.name} offers romantic beachfront hotels with sunset views. For more seclusion, consider hotels slightly away from the main beach area, offering private terraces and quieter atmospheres perfect for couples.`
                  }
                ],
                'kamares': [
                  {
                    question: `Which ${location.name} area has the best beaches?`,
                    answer: `${location.name} has its own long sandy beach right by the port, perfect for swimming and sunbathing. The beach is organized with facilities, and the port location provides easy ferry access.`
                  },
                  {
                    question: `Where should families stay in ${location.name}?`,
                    answer: `Families should stay in ${location.name} for its convenience, beach access, and family-friendly hotels. The port location makes arrivals and departures easy, and the beach is safe for children.`
                  },
                  {
                    question: `What's the most romantic area in ${location.name}?`,
                    answer: `${location.name} offers romantic waterfront hotels with sea views. Consider hotels slightly away from the port for quieter, more intimate settings while still enjoying beach access.`
                  }
                ],
                'apollonia': [
                  {
                    question: `Which ${location.name} area has the best beaches?`,
                    answer: `${location.name} itself doesn't have a beach, but it's centrally located with easy access to nearby beaches like Platis Gialos (15 min) and Kamares (10 min). The capital offers the best nightlife, dining, and shopping.`
                  },
                  {
                    question: `Where should families stay in ${location.name}?`,
                    answer: `Families can stay in ${location.name} for its central location and easy access to all parts of the island. While there's no beach in town, families can easily reach nearby beaches by bus or car.`
                  },
                  {
                    question: `What's the most romantic area in ${location.name}?`,
                    answer: `${location.name} offers romantic boutique hotels in the charming capital, with vibrant nightlife, excellent restaurants, and traditional Cycladic architecture. Perfect for couples who want culture and dining.`
                  }
                ],
                'artemonas': [
                  {
                    question: `Which ${location.name} area has the best beaches?`,
                    answer: `${location.name} doesn't have a beach, but it's just a 10-minute walk from Apollonia and offers easy access to nearby beaches. The village itself is known for its elegant neoclassical architecture and refined atmosphere.`
                  },
                  {
                    question: `Where should families stay in ${location.name}?`,
                    answer: `Families can stay in ${location.name} for its quiet, elegant atmosphere and proximity to Apollonia. While there's no beach in the village, families can easily access nearby beaches and enjoy the refined village setting.`
                  },
                  {
                    question: `What's the most romantic area in ${location.name}?`,
                    answer: `${location.name} is one of the most romantic areas in Sifnos, with elegant neoclassical mansions, refined boutique hotels, gourmet restaurants, and a sophisticated atmosphere perfect for couples seeking luxury and culture.`
                  }
                ],
                'vathi': [
                  {
                    question: `Which ${location.name} area has the best beaches?`,
                    answer: `${location.name} has its own beautiful, sheltered bay with a long sandy beach. The crystal-clear, calm waters make it perfect for swimming, and the traditional pottery village atmosphere adds to its charm.`
                  },
                  {
                    question: `Where should families stay in ${location.name}?`,
                    answer: `Families should stay in ${location.name} for its tranquil beach, safe swimming conditions, and family-friendly hotels. The sheltered bay and traditional tavernas make it ideal for a peaceful family vacation.`
                  },
                  {
                    question: `What's the most romantic area in ${location.name}?`,
                    answer: `${location.name} is perfect for couples seeking a romantic, peaceful retreat. The sheltered bay, traditional architecture, pottery studios, and authentic tavernas create an intimate, romantic atmosphere away from crowds.`
                  }
                ],
                'faros': [
                  {
                    question: `Which ${location.name} area has the best beaches?`,
                    answer: `${location.name} has three small beaches: Faros beach, Glyfo beach, and Fassolou beach. All offer beautiful sandy shores, clear waters, and a charming fishing village atmosphere.`
                  },
                  {
                    question: `Where should families stay in ${location.name}?`,
                    answer: `Families should stay in ${location.name} for its multiple beaches, family-friendly waters, and authentic fishing village charm. The area offers a quieter alternative to busier beach destinations.`
                  },
                  {
                    question: `What's the most romantic area in ${location.name}?`,
                    answer: `${location.name} offers romantic beachfront hotels in a charming fishing village setting. The lighthouse views, fresh seafood tavernas, and peaceful atmosphere make it ideal for couples seeking authenticity and romance.`
                  }
                ],
                'kastro': [
                  {
                    question: `Which ${location.name} area has the best beaches?`,
                    answer: `${location.name} has Seralia beach below the village, a small pebble beach accessible via steps. While not the main beach destination, Kastro offers breathtaking views and historic charm unmatched elsewhere.`
                  },
                  {
                    question: `Where should families stay in ${location.name}?`,
                    answer: `Families can stay in ${location.name} for its historic charm and cultural experiences. While beach access requires steps, families will appreciate the medieval architecture, museum, and unique village atmosphere.`
                  },
                  {
                    question: `What's the most romantic area in ${location.name}?`,
                    answer: `${location.name} is one of the most romantic areas in Sifnos, with medieval architecture, cliffside views, sunset vistas, and a magical atmosphere. Perfect for couples seeking history, culture, and breathtaking scenery.`
                  }
                ]
              };
              
              return locationFaqs[slug || ''] || [];
            })().map((faq, index) => (
              <details key={index} className="group bg-gray-50 p-5 rounded-lg border border-gray-200 hover:border-sifnos-deep-blue/30 transition-colors">
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-sifnos-deep-blue text-lg list-none">
                  <h3>{faq.question}</h3>
                  <span className="text-2xl text-sifnos-deep-blue group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed pl-2">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
        
        {/* FAQ Schema for Location */}
        {(() => {
          const locationFaqs: Record<string, Array<{question: string, answer: string}>> = {
            'platis-gialos': [
              {
                question: `Which ${location.name} area has the best beaches?`,
                answer: `${location.name} itself is home to Sifnos' longest and most popular beach, with golden sand, shallow waters, and organized facilities. The beach stretches for over a kilometer, making it perfect for families and beach lovers.`
              },
              {
                question: `Where should families stay in ${location.name}?`,
                answer: `Families should stay in ${location.name} for its safe, shallow beach, family-friendly hotels with pools, and easy access to restaurants and amenities. The organized beach with sunbeds and umbrellas makes it ideal for children.`
              },
              {
                question: `What's the most romantic area in ${location.name}?`,
                answer: `${location.name} offers romantic beachfront hotels with sunset views. For more seclusion, consider hotels slightly away from the main beach area, offering private terraces and quieter atmospheres perfect for couples.`
              }
            ],
            'kamares': [
              {
                question: `Which ${location.name} area has the best beaches?`,
                answer: `${location.name} has its own long sandy beach right by the port, perfect for swimming and sunbathing. The beach is organized with facilities, and the port location provides easy ferry access.`
              },
              {
                question: `Where should families stay in ${location.name}?`,
                answer: `Families should stay in ${location.name} for its convenience, beach access, and family-friendly hotels. The port location makes arrivals and departures easy, and the beach is safe for children.`
              },
              {
                question: `What's the most romantic area in ${location.name}?`,
                answer: `${location.name} offers romantic waterfront hotels with sea views. Consider hotels slightly away from the port for quieter, more intimate settings while still enjoying beach access.`
              }
            ],
            'apollonia': [
              {
                question: `Which ${location.name} area has the best beaches?`,
                answer: `${location.name} itself doesn't have a beach, but it's centrally located with easy access to nearby beaches like Platis Gialos (15 min) and Kamares (10 min). The capital offers the best nightlife, dining, and shopping.`
              },
              {
                question: `Where should families stay in ${location.name}?`,
                answer: `Families can stay in ${location.name} for its central location and easy access to all parts of the island. While there's no beach in town, families can easily reach nearby beaches by bus or car.`
              },
              {
                question: `What's the most romantic area in ${location.name}?`,
                answer: `${location.name} offers romantic boutique hotels in the charming capital, with vibrant nightlife, excellent restaurants, and traditional Cycladic architecture. Perfect for couples who want culture and dining.`
              }
            ],
            'artemonas': [
              {
                question: `Which ${location.name} area has the best beaches?`,
                answer: `${location.name} doesn't have a beach, but it's just a 10-minute walk from Apollonia and offers easy access to nearby beaches. The village itself is known for its elegant neoclassical architecture and refined atmosphere.`
              },
              {
                question: `Where should families stay in ${location.name}?`,
                answer: `Families can stay in ${location.name} for its quiet, elegant atmosphere and proximity to Apollonia. While there's no beach in the village, families can easily access nearby beaches and enjoy the refined village setting.`
              },
              {
                question: `What's the most romantic area in ${location.name}?`,
                answer: `${location.name} is one of the most romantic areas in Sifnos, with elegant neoclassical mansions, refined boutique hotels, gourmet restaurants, and a sophisticated atmosphere perfect for couples seeking luxury and culture.`
              }
            ],
            'vathi': [
              {
                question: `Which ${location.name} area has the best beaches?`,
                answer: `${location.name} has its own beautiful, sheltered bay with a long sandy beach. The crystal-clear, calm waters make it perfect for swimming, and the traditional pottery village atmosphere adds to its charm.`
              },
              {
                question: `Where should families stay in ${location.name}?`,
                answer: `Families should stay in ${location.name} for its tranquil beach, safe swimming conditions, and family-friendly hotels. The sheltered bay and traditional tavernas make it ideal for a peaceful family vacation.`
              },
              {
                question: `What's the most romantic area in ${location.name}?`,
                answer: `${location.name} is perfect for couples seeking a romantic, peaceful retreat. The sheltered bay, traditional architecture, pottery studios, and authentic tavernas create an intimate, romantic atmosphere away from crowds.`
              }
            ],
            'faros': [
              {
                question: `Which ${location.name} area has the best beaches?`,
                answer: `${location.name} has three small beaches: Faros beach, Glyfo beach, and Fassolou beach. All offer beautiful sandy shores, clear waters, and a charming fishing village atmosphere.`
              },
              {
                question: `Where should families stay in ${location.name}?`,
                answer: `Families should stay in ${location.name} for its multiple beaches, family-friendly waters, and authentic fishing village charm. The area offers a quieter alternative to busier beach destinations.`
              },
              {
                question: `What's the most romantic area in ${location.name}?`,
                answer: `${location.name} offers romantic beachfront hotels in a charming fishing village setting. The lighthouse views, fresh seafood tavernas, and peaceful atmosphere make it ideal for couples seeking authenticity and romance.`
              }
            ],
            'kastro': [
              {
                question: `Which ${location.name} area has the best beaches?`,
                answer: `${location.name} has Seralia beach below the village, a small pebble beach accessible via steps. While not the main beach destination, Kastro offers breathtaking views and historic charm unmatched elsewhere.`
              },
              {
                question: `Where should families stay in ${location.name}?`,
                answer: `Families can stay in ${location.name} for its historic charm and cultural experiences. While beach access requires steps, families will appreciate the medieval architecture, museum, and unique village atmosphere.`
              },
              {
                question: `What's the most romantic area in ${location.name}?`,
                answer: `${location.name} is one of the most romantic areas in Sifnos, with medieval architecture, cliffside views, sunset vistas, and a magical atmosphere. Perfect for couples seeking history, culture, and breathtaking scenery.`
              }
            ]
          };
          
          const faqs = locationFaqs[slug || ''] || [];
          return faqs.length > 0 ? (
            <SchemaGenerator
              pageType="FAQ"
              data={{ faq: faqs }}
            />
          ) : null;
        })()}
      </div>
    </>
  );
}
