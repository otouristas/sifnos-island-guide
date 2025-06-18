import { useState, useEffect, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import { Search, Filter, ChevronLeft, X, MessageCircle, Calendar, Users, Minus, Plus } from 'lucide-react';
import { supabase, logSupabaseResponse } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import HotelCard from '@/components/HotelCard';
import SponsoredHotelCard from '@/components/SponsoredHotelCard';
import { hotelTypes } from '@/data/hotelTypes';
import { getHotelTypeIcon } from '@/components/icons/HotelTypeIcons';
import FilterSidebar from '@/components/hotel/FilterSidebar';
import { searchHotels } from '@/services/hotelSearch';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Dispatch, FormEvent, SetStateAction } from 'react';

// Define interface for SearchBar component props
interface SearchBarProps {
  isSearchExpanded: boolean;
  setIsSearchExpanded: Dispatch<SetStateAction<boolean>>;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  handleSearch: (e?: FormEvent) => void;
}

// Define interface for booking search state
interface BookingSearchState {
  checkInDate: Date | undefined;
  checkOutDate: Date | undefined;
  adults: number;
  children: number;
  isCheckInOpen: boolean;
  isCheckOutOpen: boolean;
  isGuestsOpen: boolean;
}

// Memoize the search bar component to improve performance
const SearchBar = memo(({ 
  isSearchExpanded, 
  setIsSearchExpanded, 
  searchQuery, 
  setSearchQuery, 
  handleSearch 
}: SearchBarProps) => {
  if (isSearchExpanded) {
    return (
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
          type="button"
          size="icon"
          className="rounded-l-none border border-l-0 border-input h-10"
          variant="ghost"
          onClick={() => setIsSearchExpanded(false)}
        >
          <X size={20} />
        </Button>
      </form>
    );
  } 
  
  return (
    <div 
      className="flex-1 flex items-center gap-2 border rounded-md px-3 py-2 text-gray-500 bg-background cursor-pointer"
      onClick={() => setIsSearchExpanded(true)}
    >
      <Search size={18} />
      <span className="truncate">Search for hotels, locations...</span>
    </div>
  );
});

// Define interface for filter state
interface FilterState {
  amenities: {
    wifi: boolean;
    breakfast: boolean;
    pool: boolean;
    parking: boolean;
    airConditioning: boolean;
    restaurant: boolean;
    seaView: boolean;
  };
  starRating: number;
  hotelType: string;
  priceRange: [number, number] | null;
  location: string;
}

// Define interface for FilterButtons component props
interface FilterButtonsProps {
  isMobile: boolean;
  filterCount: number;
  isSheetOpen: boolean;
  setIsSheetOpen: Dispatch<SetStateAction<boolean>>;
  setFilters: Dispatch<SetStateAction<FilterState>>;
}

// Memoize the filter buttons to prevent re-renders
const FilterButtons = memo(({ 
  isMobile, 
  filterCount, 
  isSheetOpen, 
  setIsSheetOpen, 
  setFilters 
}: FilterButtonsProps) => (
  <div className="flex gap-2">
    <Button 
      asChild
      variant="default" 
      size="sm" 
      className="bg-sifnos-deep-blue hover:bg-sifnos-turquoise"
    >
      <Link to="/touristas-ai" className="flex items-center">
        <img 
          src="/uploads/touristas-ai-logo.svg" 
          alt="Touristas AI" 
          className="w-4 h-4 mr-1"
        />
        <span className="sr-only md:not-sr-only">AI</span>
      </Link>
    </Button>

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
        {/* Filter content rendered in the parent component */}
      </SheetContent>
    </Sheet>
  </div>
));

export default function HotelsPage() {
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
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

  // Booking search state
  const [bookingSearch, setBookingSearch] = useState<BookingSearchState>({
    checkInDate: undefined,
    checkOutDate: undefined,
    adults: 2,
    children: 0,
    isCheckInOpen: false,
    isCheckOutOpen: false,
    isGuestsOpen: false,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [hotels, setHotels] = useState([]);
  const [agodaHotels, setAgodaHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [sponsoredHotels, setSponsoredHotels] = useState([]);
  const [displayedSponsoredHotel, setDisplayedSponsoredHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [agodaLoading, setAgodaLoading] = useState(false);
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

  // Function to search Agoda hotels with booking parameters
  const searchAgodaHotels = useCallback(async (checkInDate?: string, checkOutDate?: string, adults?: number, children?: number) => {
    try {
      setAgodaLoading(true);
      console.log('Searching Agoda hotels with booking parameters...');
      
      const searchParams = {
        checkInDate: checkInDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to 1 week from now
        checkOutDate: checkOutDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to 2 weeks from now
        numberOfAdults: adults || 2,
        numberOfChildren: children || 0
      };
      
      const agodaResults = await searchHotels(searchParams);
      console.log(`Found ${agodaResults.length} Agoda hotels`);
      setAgodaHotels(agodaResults);
      
      toast({
        title: "Agoda Search Complete",
        description: `Found ${agodaResults.length} additional hotels from Agoda`,
      });
      
    } catch (error) {
      console.error('Error searching Agoda hotels:', error);
      toast({
        title: "Agoda Search Failed",
        description: "Could not load additional hotels from Agoda at the moment.",
        variant: "destructive"
      });
    } finally {
      setAgodaLoading(false);
    }
  }, [toast]);

  // Select a random sponsored hotel to display when the component loads
  useEffect(() => {
    if (sponsoredHotels.length > 0) {
      const randomIndex = Math.floor(Math.random() * sponsoredHotels.length);
      setDisplayedSponsoredHotel(sponsoredHotels[randomIndex]);
      console.log(`Randomly selected ${sponsoredHotels[randomIndex]?.name} to display as sponsored`);
    }
  }, [sponsoredHotels]);
  
  // Apply filters whenever hotels or filters change - memoize with useCallback for better performance
  useEffect(() => {
    if (hotels.length === 0 && agodaHotels.length === 0) return;
    
    // Combine local and Agoda hotels
    let results = [...hotels, ...agodaHotels];
    
    // Filter by hotel type
    if (filters.hotelType) {
      results = results.filter(hotel => 
        (hotel.hotel_types && hotel.hotel_types.includes(filters.hotelType)) ||
        (hotel.source === 'agoda' && filters.hotelType === 'luxury-hotels' && (hotel.star_rating >= 4 || hotel.rating >= 8))
      );
    }
    
    // Filter by star rating
    if (filters.starRating > 0) {
      results = results.filter(hotel => 
        hotel.rating === filters.starRating || 
        (hotel.star_rating && hotel.star_rating === filters.starRating)
      );
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
              return hotelAmenities.some(a => a.includes('wifi') || a.includes('internet')) ||
                     (hotel.source === 'agoda' && hotel.agoda_data?.freeWifi);
            case 'breakfast':
              return hotelAmenities.some(a => a.includes('breakfast')) ||
                     (hotel.source === 'agoda' && hotel.agoda_data?.includeBreakfast);
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
        hotel.hotel_amenities?.some(a => a.amenity.toLowerCase().includes(query)) ||
        (hotel.amenities && hotel.amenities.some(a => a.toLowerCase().includes(query)))
      );
    }
    
    setFilteredHotels(results);
  }, [hotels, agodaHotels, filters, searchQuery]);

  // Memoize the handleSearch function to avoid recreating on every render
  const handleSearch = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    console.log("Searching with query:", searchQuery);
    if (isMobile) {
      setIsSearchExpanded(false);
    }
    // The filtering is already handled by the useEffect that watches searchQuery
  }, [searchQuery, isMobile]);

  // Handle booking search
  const handleBookingSearch = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!bookingSearch.checkInDate || !bookingSearch.checkOutDate) {
      toast({
        title: "Missing dates",
        description: "Please select both check-in and check-out dates.",
        variant: "destructive"
      });
      return;
    }

    if (bookingSearch.checkInDate >= bookingSearch.checkOutDate) {
      toast({
        title: "Invalid dates",
        description: "Check-out date must be after check-in date.",
        variant: "destructive"
      });
      return;
    }

    const checkInStr = format(bookingSearch.checkInDate, 'yyyy-MM-dd');
    const checkOutStr = format(bookingSearch.checkOutDate, 'yyyy-MM-dd');
    
    console.log("Booking search:", {
      checkIn: checkInStr,
      checkOut: checkOutStr,
      adults: bookingSearch.adults,
      children: bookingSearch.children
    });

    // Search Agoda with the specific booking parameters
    searchAgodaHotels(checkInStr, checkOutStr, bookingSearch.adults, bookingSearch.children);
  }, [bookingSearch, searchAgodaHotels, toast]);

  const filterCount = 
    (filters.starRating ? 1 : 0) +
    (filters.hotelType ? 1 : 0) +
    (filters.location ? 1 : 0) +
    Object.values(filters.amenities).filter(Boolean).length;

  return (
    <>
      <SEO 
        title="Sifnos Hotels 2025 - Compare 25+ Properties | Best Prices Guaranteed"
        description="Browse 25+ carefully selected Sifnos hotels. Compare luxury resorts, family-friendly properties & romantic getaways. Real-time availability, best prices & instant booking. Find your ideal Sifnos accommodation today."
        keywords={[
          'compare sifnos hotels', 'sifnos hotel deals', 'best rates sifnos', 'instant booking sifnos',
          'sifnos hotels 2025', 'luxury sifnos accommodation', 'beach hotels sifnos', 
          'boutique hotels sifnos', 'family hotels sifnos', 'hotel comparison sifnos',
          'book hotels sifnos', 'sifnos resort booking', 'cyclades hotels'
        ]}
        pageType="hotels"
        schemaType="CollectionPage"
        canonical="https://hotelssifnos.com/hotels"
        imageUrl="/uploads/hotels/sifnos-luxury-hotels.jpg"
        locationData={{
          name: "Sifnos",
          hotelsCount: 25,
          type: "capital"
        }}
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

      {/* Booking Search Form */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="page-container py-6">
          <form onSubmit={handleBookingSearch} className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              {/* Check-in Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Check-in Date</label>
                <Popover open={bookingSearch.isCheckInOpen} onOpenChange={(open) => 
                  setBookingSearch(prev => ({ ...prev, isCheckInOpen: open }))
                }>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12",
                        !bookingSearch.checkInDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {bookingSearch.checkInDate ? format(bookingSearch.checkInDate, "MMM dd, yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={bookingSearch.checkInDate}
                      onSelect={(date) => {
                        setBookingSearch(prev => ({ ...prev, checkInDate: date, isCheckInOpen: false }));
                        if (date && bookingSearch.checkOutDate && date >= bookingSearch.checkOutDate) {
                          setBookingSearch(prev => ({ ...prev, checkOutDate: undefined }));
                        }
                      }}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Check-out Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Check-out Date</label>
                <Popover open={bookingSearch.isCheckOutOpen} onOpenChange={(open) => 
                  setBookingSearch(prev => ({ ...prev, isCheckOutOpen: open }))
                }>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12",
                        !bookingSearch.checkOutDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {bookingSearch.checkOutDate ? format(bookingSearch.checkOutDate, "MMM dd, yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={bookingSearch.checkOutDate}
                      onSelect={(date) => 
                        setBookingSearch(prev => ({ ...prev, checkOutDate: date, isCheckOutOpen: false }))
                      }
                      disabled={(date) => {
                        const today = new Date(new Date().setHours(0, 0, 0, 0));
                        const checkIn = bookingSearch.checkInDate;
                        return date < today || (checkIn && date <= checkIn);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Guests */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Guests</label>
                <Popover open={bookingSearch.isGuestsOpen} onOpenChange={(open) => 
                  setBookingSearch(prev => ({ ...prev, isGuestsOpen: open }))
                }>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start h-12">
                      <Users className="mr-2 h-4 w-4" />
                      {bookingSearch.adults + bookingSearch.children} guests
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="start">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Adults</div>
                          <div className="text-sm text-gray-500">Ages 13+</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setBookingSearch(prev => ({ 
                              ...prev, 
                              adults: Math.max(1, prev.adults - 1) 
                            }))}
                            disabled={bookingSearch.adults <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{bookingSearch.adults}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setBookingSearch(prev => ({ 
                              ...prev, 
                              adults: Math.min(8, prev.adults + 1) 
                            }))}
                            disabled={bookingSearch.adults >= 8}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Children</div>
                          <div className="text-sm text-gray-500">Ages 0-12</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setBookingSearch(prev => ({ 
                              ...prev, 
                              children: Math.max(0, prev.children - 1) 
                            }))}
                            disabled={bookingSearch.children <= 0}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{bookingSearch.children}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setBookingSearch(prev => ({ 
                              ...prev, 
                              children: Math.min(6, prev.children + 1) 
                            }))}
                            disabled={bookingSearch.children >= 6}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Search Button */}
              <Button 
                type="submit" 
                className="h-12 bg-sifnos-turquoise hover:bg-sifnos-deep-blue text-white font-semibold"
                disabled={agodaLoading || !bookingSearch.checkInDate || !bookingSearch.checkOutDate}
              >
                {agodaLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search Hotels
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Compact Search Bar for Mobile - Optimized with memo component */}
      {isMobile && (
        <div className="sticky top-16 z-50 bg-white shadow-md border-b border-gray-200">
          <div className="page-container py-3">
            <div className="flex justify-between items-center gap-2">
              <SearchBar 
                isSearchExpanded={isSearchExpanded}
                setIsSearchExpanded={setIsSearchExpanded}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleSearch}
              />

              {!isSearchExpanded && (
                <FilterButtons
                  isMobile={isMobile}
                  filterCount={filterCount}
                  isSheetOpen={isSheetOpen}
                  setIsSheetOpen={setIsSheetOpen}
                  setFilters={setFilters}
                />
              )}
            </div>
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
                <div className="sticky top-[112px]">
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
                  {agodaHotels.length > 0 && (
                    <span className="text-sm text-gray-600 font-normal">
                      ({hotels.length} local + {agodaHotels.length} Agoda)
                    </span>
                  )}
                </h2>
                <div className="flex items-center gap-4">
                  {!agodaLoading && agodaHotels.length === 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        Use booking search above for Agoda results
                      </span>
                      <Button
                        onClick={() => {
                          if (!bookingSearch.checkInDate || !bookingSearch.checkOutDate) {
                            toast({
                              title: "Select dates",
                              description: "Please select check-in and check-out dates to search Agoda.",
                              variant: "destructive"
                            });
                            return;
                          }
                          const checkInStr = format(bookingSearch.checkInDate, 'yyyy-MM-dd');
                          const checkOutStr = format(bookingSearch.checkOutDate, 'yyyy-MM-dd');
                          searchAgodaHotels(checkInStr, checkOutStr, bookingSearch.adults, bookingSearch.children);
                        }}
                        variant="outline"
                        size="sm"
                        className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                      >
                        Search Agoda
                      </Button>
                    </div>
                  )}
                  {agodaLoading && (
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                      Searching Agoda...
                    </div>
                  )}
                  <div className="flex items-center">
                    <span className="mr-2 text-sm">Sort by:</span>
                    <select className="border rounded-md p-2 text-sm">
                      <option>Recommended</option>
                      <option>Rating (high to low)</option>
                      <option>A-Z</option>
                    </select>
                  </div>
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
                    filteredHotels.map(hotel => {
                      // Use a unique key that handles both local and Agoda hotels
                      const hotelKey = hotel.source === 'agoda' ? `agoda-${hotel.id}` : `local-${hotel.id}`;
                      
                      // For Agoda hotels, we might want to use a different component or modify display
                      if (hotel.source === 'agoda') {
                        return (
                          <div key={hotelKey} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100">
                            <div className="relative">
                              <img
                                src={hotel.image_url || '/placeholder.svg'}
                                alt={hotel.name}
                                className="w-full h-48 object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = '/placeholder.svg';
                                }}
                              />
                              
                              {/* Agoda Badge */}
                              <div className="absolute top-2 left-2">
                                <div className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-semibold shadow-lg">
                                  🏨 Agoda
                                </div>
                              </div>
                              
                              {/* Discount Badge */}
                              {hotel.agoda_data?.discountPercentage > 0 && (
                                <div className="absolute top-2 right-2">
                                  <div className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-lg">
                                    -{hotel.agoda_data.discountPercentage}%
                                  </div>
                                </div>
                              )}
                              
                              {/* Star Rating */}
                              <div className="absolute bottom-2 left-2">
                                <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center">
                                  <span className="text-yellow-400 mr-1">★</span>
                                  <span>{hotel.star_rating}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-4">
                              {/* Hotel Name */}
                              <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">
                                {hotel.name}
                              </h3>
                              
                              {/* Location */}
                              <p className="text-sm text-gray-600 mb-2 flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                Sifnos, Greece
                              </p>
                              
                              {/* Review Score & Stars */}
                              <div className="flex items-center mb-3">
                                <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium mr-2">
                                  {hotel.review_score?.toFixed(1)}/10
                                </div>
                                <div className="flex items-center text-xs text-gray-500">
                                  <div className="flex mr-1">
                                    {[...Array(5)].map((_, i) => (
                                      <span key={i} className={`${i < Math.floor((hotel.review_score || 0) / 2) ? 'text-yellow-400' : 'text-gray-300'}`}>
                                        ★
                                      </span>
                                    ))}
                                  </div>
                                  ({hotel.review_count})
                                </div>
                              </div>
                              
                              {/* Amenities */}
                              <div className="flex flex-wrap gap-1 mb-3">
                                {hotel.agoda_data?.freeWifi && (
                                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                    📶 WiFi
                                  </span>
                                )}
                                {hotel.agoda_data?.includeBreakfast && (
                                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                                    🍳 Breakfast
                                  </span>
                                )}
                              </div>
                              
                              {/* Price & Book Button */}
                              <div className="flex items-center justify-between pt-2 border-t">
                                <div className="flex flex-col">
                                  {hotel.agoda_data?.crossedOutRate > hotel.price_per_night && (
                                    <span className="text-xs text-gray-400 line-through">
                                      €{hotel.agoda_data.crossedOutRate}
                                    </span>
                                  )}
                                  <div className="flex items-baseline">
                                    <span className="text-xl font-bold text-green-600">
                                      €{hotel.price_per_night}
                                    </span>
                                    <span className="text-xs text-gray-500 ml-1">/night</span>
                                  </div>
                                </div>
                                
                                <button 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (hotel.agoda_data?.landingURL) {
                                      window.open(hotel.agoda_data.landingURL, '_blank');
                                    }
                                  }}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                  Book Now
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      
                      // For local hotels, use the existing HotelCard component
                      return (
                        <HotelCard key={hotelKey} hotel={hotel} showLogo={true} />
                      );
                    })
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

      {/* SEO Introduction - moved to bottom above location guide */}
      <div className="bg-white">
        <div className="page-container">
          <div className="max-w-4xl mx-auto prose prose-lg py-8">
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
      
      {/* Render the mobile filter sheet content only when open to save performance */}
      {isMobile && isSheetOpen && (
        <div className="overflow-y-auto h-full p-4 pb-20">
          <FilterSidebar 
            filters={filters} 
            onFiltersChange={setFilters}
            isMobile={true}
            className="shadow-none p-0 bg-transparent"
          />
        </div>
      )}
    </>
  );
}