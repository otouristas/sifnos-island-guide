import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Search, MapPin, Star, BookOpen, BadgeDollarSign, Hotel, Filter } from 'lucide-react';
import HotelCard from '@/components/HotelCard';
import LocationCard from '@/components/LocationCard';
import HotelTypeCard from '@/components/HotelTypeCard';
import TouristasAIBanner from '@/components/TouristasAIBanner';
import SEO from '@/components/SEO';
import { sifnosLocations } from '../data/locations';
import { hotelTypes } from '../data/hotelTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export default function HomePage() {
  const navigate = useNavigate();
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Search filters
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>('');
  
  const amenitiesList = ["Pool", "Wifi", "Breakfast", "Beach Access", "Air Conditioning", "Restaurant"];
  const priceRanges = [
    { label: "Any Price", value: "" },
    { label: "Budget (< €100)", value: "0-100" },
    { label: "Mid-range (€100-€200)", value: "100-200" },
    { label: "Luxury (> €200)", value: "200+" }
  ];
  
  useEffect(() => {
    const fetchFeaturedHotels = async () => {
      try {
        const { data, error } = await supabase
          .from('hotels')
          .select(`
            *,
            hotel_amenities(amenity),
            hotel_photos(id, photo_url, is_main_photo)
          `)
          .order('rating', { ascending: false })
          .limit(3);
        
        if (error) throw error;
        setFeaturedHotels(data || []);
      } catch (error) {
        console.error('Error fetching featured hotels:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedHotels();
  }, []);
  
  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prevAmenities =>
      prevAmenities.includes(amenity) 
        ? prevAmenities.filter(a => a !== amenity)
        : [...prevAmenities, amenity]
    );
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    
    if (searchQuery) params.append('search', searchQuery);
    if (selectedLocation) params.append('location', selectedLocation);
    if (selectedType) params.append('type', selectedType);
    if (selectedAmenities.length > 0) params.append('amenities', selectedAmenities.join(','));
    if (priceRange) params.append('price', priceRange);
    
    navigate(`/hotels?${params.toString()}`);
  };
  
  // Showcase locations and hotel types
  const featuredLocations = sifnosLocations.slice(0, 3);
  const featuredHotelTypes = hotelTypes.slice(0, 3);
  
  return (
    <>
      <SEO 
        title="Find Your Perfect Stay in Sifnos - Best Hotels & Accommodation"
        description="Discover handpicked hotels and luxury accommodations in Sifnos Island, Greece. Compare prices, read reviews, and book your perfect beach vacation in the Cyclades."
        keywords={[
          'sifnos hotels', 'greek islands hotels', 'sifnos accommodation', 
          'luxury hotels sifnos', 'beach hotels sifnos', 'boutique hotels cyclades'
        ]}
        schemaType="Organization"
        canonical="https://hotelssifnos.com"
        imageUrl="/uploads/sifnos-hero.jpg"
      />
      
      {/* Hero Section */}
      <div className="relative h-[70vh] flex items-center justify-center bg-sifnos-deep-blue overflow-hidden">
        <img 
          src="/uploads/beaches/plats-gialos.webp" 
          alt="Beautiful Platis Gialos beach in Sifnos" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="font-montserrat text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Find Your Perfect Stay in Sifnos Island
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8">
            Discover the best hotels, villas, and accommodations in the beautiful Cycladic island of Sifnos
          </p>
          
          {/* Minimal Search Form */}
          <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-5 rounded-lg shadow-lg">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select 
                  value={selectedLocation} 
                  onValueChange={setSelectedLocation}
                >
                  <SelectTrigger className="w-full bg-white/90 border-0">
                    <SelectValue placeholder="Where in Sifnos?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-locations">Any location</SelectItem>
                    {sifnosLocations.map((location) => (
                      <SelectItem key={location.id} value={location.slug}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="relative col-span-1 md:col-span-2">
                  <Input
                    type="text"
                    placeholder="Search hotels, amenities, or keywords..."
                    className="pl-10 bg-white/90 border-0 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap justify-center md:justify-between items-center">
                <div className="flex gap-2 flex-wrap">
                  {selectedAmenities.length > 0 && selectedAmenities.map(amenity => (
                    <span key={amenity} className="bg-white/20 text-white text-xs px-3 py-1 rounded-full flex items-center">
                      {amenity}
                      <button 
                        type="button" 
                        onClick={() => toggleAmenity(amenity)} 
                        className="ml-1 text-white hover:text-white/70"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                
                <Button 
                  type="submit" 
                  className="bg-white hover:bg-white/90 text-sifnos-deep-blue"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search Hotels
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Featured Hotels Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-montserrat font-bold text-sifnos-deep-blue">
                Featured Hotels
              </h2>
              <p className="text-gray-600">
                Handpicked accommodations for your perfect Sifnos experience
              </p>
            </div>
            <Link to="/hotels" className="text-sifnos-turquoise font-medium hover:text-sifnos-deep-blue transition-colors flex items-center">
              <span>View all hotels</span>
              <span className="ml-1">→</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {featuredHotels.length > 0 ? (
              featuredHotels.map(hotel => (
                <HotelCard key={hotel.id} hotel={hotel} showLogo={true} />
              ))
            ) : (
              <div className="text-center py-12 col-span-3">
                <h3 className="font-medium text-xl text-gray-700">Loading featured hotels...</h3>
                <p className="text-gray-500 mt-2">Please wait or try refreshing the page</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Touristas AI Banner CTA Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <TouristasAIBanner />
        </div>
      </div>
      
      {/* Locations Section */}
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
      
      {/* Hotel Types Section */}
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
                key={type.id}
                title={type.title}
                description={type.shortDescription}
                imageUrl={type.imageUrl}
                slug={type.slug}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* List Your Hotel Section */}
      <div className="py-20 bg-gradient-to-r from-sifnos-deep-blue to-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block p-2 bg-white/15 rounded-lg backdrop-blur-sm">
                <Hotel className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-4xl font-montserrat font-bold">List Your Hotel on HotelsSifnos</h2>
              <p className="text-lg opacity-95 leading-relaxed">
                Showcase your property to thousands of travelers looking for the perfect Sifnos experience. 
                Choose from our flexible listing options to get the visibility your business deserves.
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                <Card className="bg-white/20 border-0 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold mb-2">Basic</div>
                    <p className="text-white font-bold">Free</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/30 border-0 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-white text-sifnos-deep-blue px-2 py-1 text-xs font-semibold">
                    POPULAR
                  </div>
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold mb-2">Premium</div>
                    <p className="text-white font-bold">€249/yr</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/20 border-0 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold mb-2">Pro</div>
                    <p className="text-white font-bold">€499/yr</p>
                  </CardContent>
                </Card>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-white text-sifnos-deep-blue hover:bg-gray-100">
                  <Link to="/pricing">View Plans</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white border-2 bg-sifnos-turquoise/20 text-white hover:bg-sifnos-turquoise/40 hover:text-white hover:border-white">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="absolute -top-12 -left-12 w-64 h-64 bg-blue-400/20 rounded-full filter blur-3xl"></div>
              <div className="absolute -bottom-16 -right-12 w-80 h-80 bg-white/20 rounded-full filter blur-3xl"></div>
              <div className="relative z-10 bg-gradient-to-br from-white/15 to-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/20 shadow-xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="w-full h-32 rounded-lg bg-white/10 border border-white/20"></div>
                    <div className="w-3/4 h-3 rounded bg-white/30"></div>
                    <div className="w-1/2 h-3 rounded bg-white/25"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="w-full h-32 rounded-lg bg-white/10 border border-white/20"></div>
                    <div className="w-3/4 h-3 rounded bg-white/30"></div>
                    <div className="w-1/2 h-3 rounded bg-white/25"></div>
                  </div>
                  <div className="col-span-2 flex justify-between items-center pt-2">
                    <div className="space-y-1">
                      <div className="w-20 h-6 rounded bg-white/40"></div>
                      <div className="w-16 h-3 rounded bg-white/25"></div>
                    </div>
                    <div className="w-20 h-8 rounded-lg bg-white/60"></div>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-400/50"></div>
                    <div className="w-full h-3 rounded bg-white/30"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-400/50"></div>
                    <div className="w-full h-3 rounded bg-white/30"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-400/50"></div>
                    <div className="w-2/3 h-3 rounded bg-white/30"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Why Choose Us Section */}
      <div className="py-16 bg-sifnos-deep-blue text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-montserrat font-bold mb-4">
              Why Book with HotelsSifnos
            </h2>
            <p className="text-xl max-w-2xl mx-auto opacity-80">
              Your trusted guide to finding the perfect stay in Sifnos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="w-16 h-16 bg-sifnos-turquoise rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Local Expertise</h3>
              <p className="opacity-80">
                Curated selections by locals who know Sifnos inside out
              </p>
            </div>
            
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="w-16 h-16 bg-sifnos-turquoise rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Verified Reviews</h3>
              <p className="opacity-80">
                Honest feedback from real travelers who've stayed at our hotels
              </p>
            </div>
            
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="w-16 h-16 bg-sifnos-turquoise rounded-full flex items-center justify-center mx-auto mb-4">
                <BadgeDollarSign size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Best Price Guarantee</h3>
              <p className="opacity-80">
                We compare prices across multiple booking platforms for you
              </p>
            </div>
            
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="w-16 h-16 bg-sifnos-turquoise rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Complete Guide</h3>
              <p className="opacity-80">
                Everything you need to know about Sifnos in one place
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* SEO Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-montserrat font-bold text-sifnos-deep-blue mb-6">
              Welcome to HotelsSifnos - Your Ultimate Guide to Accommodation in Sifnos
            </h2>
            
            <div className="prose prose-lg">
              <p>
                Sifnos, with its dazzling white villages, golden beaches, and rich culinary tradition, is one of the most enchanting islands in the Cyclades. Finding the perfect accommodation is essential for experiencing all that this Greek paradise has to offer, and HotelsSifnos is dedicated to helping you make that perfect choice.
              </p>
              
              <p>
                Whether you're looking for a <Link to="/hotel-types/luxury-hotels">luxury hotel</Link> with breathtaking sea views, a <Link to="/hotel-types/boutique-hotels">charming boutique property</Link> in a traditional village, or a <Link to="/hotel-types/family-friendly-hotels">family-friendly resort</Link> with facilities for children, our comprehensive listings cover the entire range of accommodations available on the island.
              </p>
              
              <p>
                Each location in Sifnos offers something unique: <Link to="/locations/apollonia">Apollonia</Link>, the island's capital, puts you at the center of nightlife and shopping; <Link to="/locations/kamares">Kamares</Link>, the main port, provides convenience and a beautiful beach; <Link to="/locations/platis-gialos">Platis Gialos</Link> offers one of the island's most stunning beaches with numerous waterfront dining options; historic <Link to="/locations/kastro">Kastro</Link> immerses you in medieval architecture with dramatic sea views; while <Link to="/locations/vathi">Vathi</Link> and <Link to="/locations/faros">Faros</Link> provide peaceful retreats in picturesque settings.
              </p>
              
              <p>
                Beyond just helping you find a place to stay, HotelsSifnos is your complete island guide. Explore our <Link to="/beaches">beaches section</Link> to discover the island's most beautiful shores, from organized beaches with amenities to hidden coves for quiet relaxation. Our <Link to="/travel-guide">travel guide</Link> provides insider tips on local transportation, dining, attractions, and seasonal events to make your Sifnos experience truly memorable.
              </p>
              
              <p>
                We invite you to browse our carefully selected hotels, compare features and prices, and book with confidence knowing that our team has personally verified the quality and accuracy of the information we provide. Your perfect Sifnos getaway begins here!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
