import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import { Search, Filter, ChevronLeft, X, Zap, MessageCircle } from 'lucide-react';
import { supabase, logSupabaseResponse } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import HotelCard from '@/components/HotelCard';
import SponsoredHotelCard from '@/components/SponsoredHotelCard';
import { hotelTypes } from '@/data/hotelTypes';
import { getHotelTypeIcon } from '@/components/icons/HotelTypeIcons';
import FilterSidebar from '@/components/hotel/FilterSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function HotelsPage() {
  // Filter state
  const [filters, setFilters] = useState({
    amenities: {
      wifi: false,
      breakfast: false,
      pool: false,
      parking: false,
      airConditioning: false,
      restaurant: false,
      seaView: false,
    },
    starRating: 0,
    hotelType: '',
    priceRange: null as [number, number] | null,
    location: '',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [sponsoredHotels, setSponsoredHotels] = useState([]);
  const [displayedSponsoredHotel, setDisplayedSponsoredHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    async function fetchHotels() {
      try {
        console.log("Fetching hotels from Supabase...");
        
        let query = supabase
          .from('hotels')
          .select(`
            *,
            hotel_amenities(amenity),
            hotel_photos(id, photo_url, is_main_photo)
          `);
          
        // Execute the query
        const { data, error } = await query;

        // Log the response for debugging
        const success = logSupabaseResponse('hotels fetch', data, error);
        
        if (!success) {
          throw error || new Error('Failed to fetch hotels');
        }

        console.log(`Hotels found: ${data?.length || 0}`);
        
        // Define our sponsored hotels
        const sponsoredHotelNames = ['ALK HOTEL™', 'Morpheas Pension & Apartments', 'Meropi Rooms and Apartments'];
        
        // Identify and process sponsored hotels
        const sponsoredHotelsList = [];
        const allHotels = [...(data || [])];
        
        data?.forEach(hotel => {
          if (sponsoredHotelNames.includes(hotel.name)) {
            // Add to sponsored hotels list with appropriate customization
            const sponsoredHotel = { ...hotel };
            
            if (hotel.name === 'ALK HOTEL™') {
              sponsoredHotel.logo_path = 'alk-hotel-sifnos/logo.png';
              sponsoredHotel.hotel_photos = [
                { id: 'alk-1', photo_url: 'alk-hotel-sifnos/alk-hotel-feature.jpeg', is_main_photo: true },
                { id: 'alk-2', photo_url: 'alk-hotel-sifnos/1.jpg_1.jpeg', is_main_photo: false },
                { id: 'alk-3', photo_url: 'alk-hotel-sifnos/3.jpg.jpeg', is_main_photo: false },
              ];
            } else if (hotel.name === 'Morpheas Pension & Apartments') {
              sponsoredHotel.logo_path = 'morpheas-pension/logo.png';
              sponsoredHotel.hotel_photos = [
                { id: 'morpheas-1', photo_url: 'morpheas-pension/sifnos-accommodation.jpg.jpeg', is_main_photo: true },
                { id: 'morpheas-2', photo_url: 'morpheas-pension/sifnos-morpheas-pension3.jpg.jpeg', is_main_photo: false },
                { id: 'morpheas-3', photo_url: 'morpheas-pension/sifnos-morpheas-pension4.jpg.jpeg', is_main_photo: false },
              ];
            } else if (hotel.name === 'Meropi Rooms and Apartments') {
              sponsoredHotel.logo_path = 'meropi-logo.svg';
              sponsoredHotel.hotel_photos = [
                { id: 'meropi-1', photo_url: 'meropirooms-hero.webp', is_main_photo: true },
                { id: 'meropi-2', photo_url: 'meropirooms-one.webp', is_main_photo: false },
                { id: 'meropi-3', photo_url: 'meropirooms-two.webp', is_main_photo: false },
              ];
            }
            
            sponsoredHotelsList.push(sponsoredHotel);
            console.log(`Added ${hotel.name} as a sponsored hotel`);
          }
        });
        
        setSponsoredHotels(sponsoredHotelsList);
        setHotels(allHotels || []);
        setFilteredHotels(allHotels || []);
        
        // Create default sponsored hotels if any are missing
        if (sponsoredHotelsList.length === 0) {
          const defaultSponsoredHotels = [
            {
              id: 'alk-hotel-id',
              name: 'ALK HOTEL™',
              location: 'Agia Marina - Kamares, Sifnos',
              rating: 5,
              hotel_types: ['luxury-hotels', 'beach-hotels'],
              logo_path: 'alk-hotel-sifnos/logo.png',
              hotel_amenities: [
                { amenity: 'Free WiFi' },
                { amenity: 'Breakfast Included' },
                { amenity: 'Sea View' },
                { amenity: 'Pool Access' },
              ],
              hotel_photos: [
                { id: 'alk-1', photo_url: 'alk-hotel-sifnos/alk-hotel-feature.jpeg', is_main_photo: true },
              ]
            },
            {
              id: 'morpheas-id',
              name: 'Morpheas Pension & Apartments',
              location: 'Apollonia, Sifnos',
              rating: 4,
              hotel_types: ['family-friendly', 'traditional-hotels'],
              logo_path: 'morpheas-pension/logo.png',
              hotel_amenities: [
                { amenity: 'Free WiFi' },
                { amenity: 'Family Rooms' },
                { amenity: 'City Center' }
              ],
              hotel_photos: [
                { id: 'morpheas-1', photo_url: 'morpheas-pension/sifnos-accommodation.jpg.jpeg', is_main_photo: true },
              ]
            },
            {
              id: 'meropi-id',
              name: 'Meropi Rooms and Apartments',
              location: 'Platis Gialos, Sifnos',
              rating: 4,
              hotel_types: ['beach-hotels', 'apartment-hotels'],
              logo_path: 'meropi-logo.svg',
              hotel_amenities: [
                { amenity: 'Free WiFi' },
                { amenity: 'Beach Access' },
                { amenity: 'Kitchenette' }
              ],
              hotel_photos: [
                { id: 'meropi-1', photo_url: 'meropirooms-hero.webp', is_main_photo: true },
              ]
            }
          ];
          setSponsoredHotels(defaultSponsoredHotels);
          console.log('Created default sponsored hotels');
        }
        
      } catch (error) {
        console.error('Error fetching hotels:', error);
        toast({
          title: "Error",
          description: "Failed to load hotels. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }

    fetchHotels();
  }, [toast]); 
  
  // Select a random sponsored hotel to display when the component loads
  useEffect(() => {
    if (sponsoredHotels.length > 0) {
      const randomIndex = Math.floor(Math.random() * sponsoredHotels.length);
      setDisplayedSponsoredHotel(sponsoredHotels[randomIndex]);
      console.log(`Randomly selected ${sponsoredHotels[randomIndex]?.name} to display as sponsored`);
    }
  }, [sponsoredHotels]);
  
  // Apply filters whenever hotels or filters change
  useEffect(() => {
    if (hotels.length === 0) return;
    
    let results = [...hotels];
    
    // Filter by hotel type
    if (filters.hotelType) {
      results = results.filter(hotel => 
        hotel.hotel_types && hotel.hotel_types.includes(filters.hotelType)
      );
    }
    
    // Filter by star rating
    if (filters.starRating > 0) {
      results = results.filter(hotel => hotel.rating === filters.starRating);
    }
    
    // Filter by location - now handling "all" value specifically
    if (filters.location && filters.location !== "all") {
      results = results.filter(hotel => 
        hotel.location && hotel.location.includes(filters.location)
      );
    }
    
    // Filter by amenities
    const activeAmenities = Object.entries(filters.amenities)
      .filter(([_, isActive]) => isActive)
      .map(([key]) => key);
    
    if (activeAmenities.length > 0) {
      results = results.filter(hotel => {
        const hotelAmenities = hotel.hotel_amenities?.map(a => a.amenity.toLowerCase()) || [];
        
        return activeAmenities.every(amenity => {
          switch(amenity) {
            case 'wifi':
              return hotelAmenities.some(a => a.includes('wifi') || a.includes('internet'));
            case 'breakfast':
              return hotelAmenities.some(a => a.includes('breakfast'));
            case 'pool':
              return hotelAmenities.some(a => a.includes('pool') || a.includes('swimming'));
            case 'parking':
              return hotelAmenities.some(a => a.includes('parking'));
            case 'airConditioning':
              return hotelAmenities.some(a => a.includes('air') || a.includes('conditioning') || a.includes('ac'));
            case 'restaurant':
              return hotelAmenities.some(a => a.includes('restaurant') || a.includes('dining'));
            case 'seaView':
              return hotelAmenities.some(a => a.includes('view') && a.includes('sea'));
            default:
              return false;
          }
        });
      });
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(hotel => 
        hotel.name.toLowerCase().includes(query) ||
        hotel.location.toLowerCase().includes(query) ||
        (hotel.description && hotel.description.toLowerCase().includes(query)) ||
        hotel.hotel_amenities?.some(a => a.amenity.toLowerCase().includes(query))
      );
    }
    
    setFilteredHotels(results);
  }, [hotels, filters, searchQuery]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    console.log("Searching with query:", searchQuery);
    if (isMobile) {
      setIsSearchExpanded(false);
    }
    // The filtering is already handled by the useEffect that watches searchQuery
  };

  const filterCount = 
    (filters.starRating ? 1 : 0) +
    (filters.hotelType ? 1 : 0) +
    (filters.location ? 1 : 0) +
    Object.values(filters.amenities).filter(Boolean).length;

  return (
    <>
      <SEO 
        title="Compare & Book Hotels in Sifnos - Best Rates & Exclusive Deals" 
        description="Browse our comprehensive collection of Sifnos hotels, from budget-friendly options to 5-star luxury resorts. Filter by amenities, location, and price to find your ideal stay with our price match guarantee and exclusive direct booking discounts."
        keywords={['sifnos hotels', 'book hotels sifnos', 'sifnos accommodation', 'luxury hotels sifnos', 'beach hotels sifnos', 'boutique hotels sifnos', 'hotel comparison sifnos']}
        schemaType="Hotel"
        canonical="https://hotelssifnos.com/hotels"
      />
      
      {/* Hero Section */}
      <div className="bg-sifnos-deep-blue">
        <div className="page-container">
          <div className="text-center text-white py-6">
            <h1 className="font-montserrat text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Hotels in Sifnos Island
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">
              Find the perfect accommodation for your stay in the beautiful island of Sifnos. Explore our curated selection of luxury, boutique, and family-friendly hotels.
            </p>
          </div>
        </div>
      </div>
      
      {/* SEO Introduction */}
      <div className="bg-white">
        <div className="page-container">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <p>
              Welcome to our comprehensive guide to accommodation in Sifnos. Whether you're seeking a 
              luxurious beachfront resort, a charming boutique hotel in a traditional village, or a family-friendly 
              guesthouse with authentic Cycladic character, Sifnos offers a diverse range of options to suit every 
              preference and budget.
            </p>
            <p>
              Known for its exceptional hospitality, Sifnos combines the authenticity of Greek island living with 
              modern amenities to ensure your stay is comfortable and memorable. Many accommodations feature traditional 
              Cycladic architecture with white-washed walls, blue accents, and stunning views of the Aegean Sea.
            </p>
            <p>
              Explore our carefully selected hotels below and find your perfect base for exploring all that Sifnos has to offer.
            </p>
          </div>
        </div>
      </div>
      
      {/* Compact Search Bar for Mobile */}
      {isMobile && (
        <div className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
          <div className="page-container py-3">
            {isSearchExpanded ? (
              <form 
                className="flex items-center"
                onSubmit={handleSearch}
              >
                <Input
                  type="text"
                  placeholder="Search hotels, locations, amenities..."
                  className="rounded-r-none border-r-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <Button 
                  type="submit"
                  size="icon"
                  className="rounded-l-none border border-l-0 border-input h-10"
                  variant="ghost"
                  onClick={() => setIsSearchExpanded(false)}
                >
                  <X size={20} />
                </Button>
              </form>
            ) : (
              <div className="flex justify-between items-center gap-2">
                <div 
                  className="flex-1 flex items-center gap-2 border rounded-md px-3 py-2 text-gray-500 bg-background cursor-pointer"
                  onClick={() => setIsSearchExpanded(true)}
                >
                  <Search size={18} />
                  <span className="truncate">Search for hotels, locations...</span>
                </div>

                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0">
                      <Filter size={18} />
                      {filterCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 text-xs flex items-center justify-center text-white bg-sifnos-turquoise rounded-full">
                          {filterCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-screen p-0 max-h-screen">
                    <SheetHeader className="sticky top-0 z-10 bg-white p-4 border-b border-gray-200 flex flex-row items-center justify-between">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setIsSheetOpen(false)}
                        className="absolute left-2"
                      >
                        <ChevronLeft size={18} />
                      </Button>
                      <SheetTitle className="mx-auto">Filters</SheetTitle>
                      <Button 
                        variant="ghost" 
                        onClick={() => {
                          setFilters({
                            amenities: {
                              wifi: false,
                              breakfast: false,
                              pool: false,
                              parking: false,
                              airConditioning: false,
                              restaurant: false,
                              seaView: false,
                            },
                            starRating: 0,
                            hotelType: '',
                            priceRange: null,
                            location: '',
                          });
                        }} 
                        className="text-sm text-gray-500 absolute right-2"
                        size="sm"
                      >
                        Clear all
                      </Button>
                    </SheetHeader>
                    <div className="overflow-y-auto h-full p-4 pb-20">
                      <FilterSidebar 
                        filters={filters} 
                        onFiltersChange={setFilters}
                        isMobile={true}
                        className="shadow-none p-0 bg-transparent"
                      />
                    </div>
                    <div className="sticky bottom-0 p-4 bg-white border-t border-gray-200 flex justify-center">
                      <Button 
                        className="w-full bg-sifnos-turquoise hover:bg-sifnos-deep-blue"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        Show {filteredHotels.length} hotels
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Desktop Search Bar */}
      {!isMobile && (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-md">
          <div className="page-container py-3">
            <form 
              className="flex flex-col md:flex-row gap-4 items-center"
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
            >
              <div className="w-full md:flex-1 relative">
                <Input
                  type="text"
                  placeholder="Search for hotels, locations, or amenities"
                  className="pl-10 py-4 h-auto"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <Button 
                  type="submit" 
                  className="flex-1 md:w-auto bg-sifnos-turquoise hover:bg-sifnos-deep-blue text-white py-2 h-auto px-4"
                  size="sm"
                >
                  <Search size={18} className="mr-1" />
                  Search
                </Button>
                <Button 
                  asChild
                  className="flex-1 md:w-auto bg-sifnos-deep-blue hover:bg-sifnos-turquoise text-white py-2 h-auto"
                  size="sm"
                >
                  <Link to="/touristas-ai" className="flex items-center">
                    <Zap size={18} className="mr-1" />
                    Touristas AI
                  </Link>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Content Section */}
      <div className="bg-gray-50">
        <div className="page-container py-8">
          <div className="flex flex-wrap -mx-4">
            {/* Filters Sidebar - Only visible on desktop */}
            {!isMobile && (
              <div className="w-full lg:w-1/4 px-4 mb-8 lg:mb-0">
                <div className="sticky top-[73px]">
                  <FilterSidebar 
                    filters={filters} 
                    onFiltersChange={setFilters}
                  />
                </div>
              </div>
            )}
            
            {/* Hotels Listing */}
            <div className="w-full lg:w-3/4 px-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-montserrat font-semibold text-xl">
                  {loading ? "Loading hotels..." : `${filteredHotels.length} hotels found`}
                </h2>
                <div className="flex items-center">
                  <span className="mr-2 text-sm">Sort by:</span>
                  <select className="border rounded-md p-2 text-sm">
                    <option>Recommended</option>
                    <option>Rating (high to low)</option>
                    <option>A-Z</option>
                  </select>
                </div>
              </div>
              
              {/* Loading State */}
              {loading && (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sifnos-turquoise"></div>
                </div>
              )}
              
              {/* Sponsored Hotel */}
              {!loading && displayedSponsoredHotel && (
                <SponsoredHotelCard hotel={displayedSponsoredHotel} />
              )}
              
              {/* Hotels Grid */}
              {!loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredHotels.length > 0 ? (
                    filteredHotels.map(hotel => (
                      <HotelCard key={hotel.id} hotel={hotel} showLogo={true} />
                    ))
                  ) : !displayedSponsoredHotel && (
                    <div className="text-center py-12 col-span-3">
                      <h3 className="font-medium text-xl text-gray-700">No hotels found matching your criteria</h3>
                      <p className="text-gray-500 mt-2">Try adjusting your filters or search terms</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Pagination */}
              {!loading && filteredHotels.length > 0 && (
                <div className="flex justify-center mt-8">
                  <div className="flex space-x-1">
                    <button className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
                      &laquo; Previous
                    </button>
                    <button className="px-4 py-2 border rounded-lg bg-sifnos-turquoise text-white">
                      1
                    </button>
                    <button className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
                      2
                    </button>
                    <button className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
                      3
                    </button>
                    <button className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
                      Next &raquo;
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Location Information */}
      <div className="bg-white">
        <div className="page-container py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-montserrat font-bold text-sifnos-deep-blue mb-4">Where to Stay in Sifnos</h2>
            <div className="prose prose-lg">
              <p>
                Sifnos offers a variety of locations to stay, each with its own unique charm and advantages:
              </p>
              
              <h3>Apollonia</h3>
              <p>
                The capital of the island, Apollonia is a picturesque village with winding alleys, white-washed houses, and 
                a vibrant atmosphere. Staying here puts you at the heart of the island's social scene with easy access to 
                boutiques, restaurants, and bars.
              </p>
              
              <h3>Kamares</h3>
              <p>
                The main port of Sifnos offers a beautiful sandy beach and numerous waterfront cafes and tavernas. 
                Accommodation here is convenient for those arriving by ferry and wanting immediate access to the sea.
              </p>
              
              <h3>Platis Gialos</h3>
              <p>
                One of the island's most popular beaches with golden sand and shallow waters ideal for families. 
                The beachfront is lined with hotels and restaurants, making it perfect for those wanting a beach-focused holiday.
              </p>
              
              <h3>Kastro</h3>
              <p>
                The ancient capital of Sifnos offers a unique historical atmosphere with medieval architecture and 
                stunning sea views. Accommodation here is more limited but provides an authentic experience in a truly magical setting.
              </p>
              
              <h3>Vathi</h3>
              <p>
                A tranquil fishing village with a beautiful sheltered bay and sandy beach. This is the place for 
                those seeking peace, relaxation, and natural beauty away from the busier areas of the island.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
