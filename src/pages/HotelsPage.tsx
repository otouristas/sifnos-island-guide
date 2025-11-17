import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import SEO from '@/components/SEO';
import SchemaGenerator from '@/components/SchemaGenerator';
import UnifiedHotelCard from '@/components/UnifiedHotelCard';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Grid, List, Map, SlidersHorizontal, Gem, Home, Waves, Users, GitCompare, X, Star } from 'lucide-react';
import { generateHotelUrl } from '@/lib/url-utils';
import TouristasLogo from '@/components/TouristasLogo';
import { Button } from '@/components/ui/button';
import FilterSidebar from '@/components/hotel/FilterSidebar';
import CompareHotels from '@/components/hotel/CompareHotels';
import LoadingSkeleton from '@/components/shared/LoadingSkeleton';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

const heroBadges = [
  { to: '/hotel-types/luxury-hotels', label: 'Luxury Hotels', icon: Gem },
  { to: '/hotel-types/villas', label: 'Private Villas', icon: Home },
  { to: '/hotel-types/beach-hotels', label: 'Beachfront', icon: Waves },
  { to: '/hotel-types/family-friendly-hotels', label: 'Family Friendly', icon: Users },
];

const mapQueryLocationToFilterLocation = (value: string): string => {
  switch (value.toLowerCase()) {
    case 'kamares':
      return 'Kamares';
    case 'platis-gialos':
      return 'Platis Gialos';
    case 'apollonia':
      return 'Apollonia';
    case 'vathi':
      return 'Vathi';
    case 'faros':
      return 'Faros';
    default:
      return '';
  }
};

export default function HotelsPage() {
  const { t } = useI18n();
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [filteredHotels, setFilteredHotels] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState('recommended');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [compareHotels, setCompareHotels] = useState<any[]>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hotelsPerPage = 12;
  
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
        applyFilters(data || []);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  useEffect(() => {
    const locationParam = searchParams.get('location');
    if (!locationParam) return;

    const mappedLocation = mapQueryLocationToFilterLocation(locationParam);
    if (!mappedLocation) return;

    setFilters((prev) => {
      if (prev.location === mappedLocation) return prev;
      return {
        ...prev,
        location: mappedLocation,
      };
    });
  }, [searchParams]);

  useEffect(() => {
    applyFilters(hotels);
  }, [filters, sortBy, hotels]);

  const applyFilters = (hotelsData: any[]) => {
    let result = [...hotelsData];

    // Location filter
    if (filters.location && filters.location !== 'all') {
      result = result.filter(hotel => 
        hotel.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Hotel type filter
    if (filters.hotelType) {
      result = result.filter(hotel => 
        hotel.hotel_types?.includes(filters.hotelType)
      );
    }

    // Star rating filter
    if (filters.starRating > 0) {
      result = result.filter(hotel => hotel.rating >= filters.starRating);
    }

    // Price range filter
    if (filters.priceRange) {
      result = result.filter(hotel => 
        hotel.price >= filters.priceRange![0] && hotel.price <= filters.priceRange![1]
      );
    }

    // Amenities filter
    const selectedAmenities = Object.entries(filters.amenities)
      .filter(([_, value]) => value)
      .map(([key]) => key.toLowerCase());
    
    if (selectedAmenities.length > 0) {
      result = result.filter(hotel => {
        const hotelAmenities = hotel.hotel_amenities?.map((a: any) => 
          a.amenity.toLowerCase()
        ) || [];
        return selectedAmenities.every(amenity => 
          hotelAmenities.some((ha: string) => ha.includes(amenity))
        );
      });
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // recommended
        result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredHotels(result);
    setCurrentPage(1);
  };

  const activeFiltersCount = 
    (filters.starRating ? 1 : 0) +
    (filters.hotelType ? 1 : 0) +
    (filters.location && filters.location !== 'all' ? 1 : 0) +
    (filters.priceRange ? 1 : 0) +
    Object.values(filters.amenities).filter(Boolean).length;

  const clearFilters = () => {
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
  };

  // Compare Hotels Functions
  const addToCompare = (hotel: any) => {
    if (compareHotels.length < 3 && !compareHotels.find(h => h.id === hotel.id)) {
      setCompareHotels(prev => [...prev, hotel]);
    }
  };

  const removeFromCompare = (hotelId: string) => {
    setCompareHotels(prev => prev.filter(h => h.id !== hotelId));
  };

  const clearCompare = () => {
    setCompareHotels([]);
  };

  // Pagination
  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = filteredHotels.slice(indexOfFirstHotel, indexOfLastHotel);
  const totalPages = Math.ceil(filteredHotels.length / hotelsPerPage);

  if (loading) {
    return (
      <>
        <SEO 
          title="Browse All Sifnos Hotels: 50+ Handpicked Accommodations"
          description="Compare Sifnos hotels by location, type, and price. From cliffside suites to beachfront rooms—we know every property personally. Find your perfect stay."
        />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <LoadingSkeleton type="hotel-card" count={6} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Browse All Sifnos Hotels: 50+ Handpicked Accommodations"
        description="Compare Sifnos hotels by location, type, and price. From cliffside suites to beachfront rooms—we know every property personally. Find your perfect stay."
        keywords={[
          'sifnos hotels 2026', 'all hotels in sifnos', 'sifnos accommodation 2026',
          'boutique hotels sifnos', 'beach hotels sifnos', 'family hotels sifnos', 'sifnos villas'
        ]}
        pageType="hotels"
        schemaType="CollectionPage"
        canonical="https://hotelssifnos.com/hotels"
      />
      
      {/* ItemList Schema for Hotels */}
      <SchemaGenerator
        pageType="HotelListing"
        data={{
          hotels: filteredHotels.slice(0, 50).map((hotel, index) => ({
            name: hotel.name,
            url: `https://hotelssifnos.com/hotels/${hotel.name.toLowerCase().replace(/\s+/g, '-')}`,
            position: index + 1
          }))
        }}
      />

      <div className="bg-background min-h-screen">
        {/* Breadcrumbs */}
        <div className="border-b border-border bg-muted/30">
          <div className="container mx-auto px-4 py-3">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Hotels</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 border-b border-border">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl">
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                All Hotels in Sifnos 2026
              </h1>
              <p className="font-body text-lg text-muted-foreground mb-6">
                Discover the complete list of {hotels.length}+ handpicked hotels, villas and suites across Sifnos. Filter by location, type, budget and more for the 2026 season.
              </p>
              
              {/* Quick Links */}
              <div className="flex flex-wrap gap-2">
                {heroBadges.map(({ to, label, icon: Icon }) => (
                  <Link key={label} to={to}>
                    <Badge
                      variant="secondary"
                      className="cursor-pointer bg-sifnos-beige/40 text-sifnos-deep-blue border border-sifnos-beige/60 hover:bg-sifnos-beige/70"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {label}
                      </span>
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar - Desktop */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading font-semibold text-lg">Filters</h2>
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-xs"
                      >
                        Clear all
                      </Button>
                    )}
                  </div>
                  <FilterSidebar
                    filters={filters}
                    onFiltersChange={setFilters}
                  />
                </div>
                
                {/* Internal Links - Hotel Types */}
                <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                  <h3 className="font-heading font-semibold text-lg mb-4">Browse by Type</h3>
                  <div className="space-y-2">
                    <Link to="/hotel-types/luxury-hotels" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                      Luxury Hotels
                    </Link>
                    <Link to="/hotel-types/villas" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                      Villas
                    </Link>
                    <Link to="/hotel-types/boutique-hotels" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                      Boutique Hotels
                    </Link>
                    <Link to="/hotel-types/beach-hotels" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                      Beach Hotels
                    </Link>
                    <Link to="/hotel-types/family-friendly-hotels" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                      Family Hotels
                    </Link>
                    <Link to="/hotel-types/traditional-hotels" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                      Traditional Hotels
                    </Link>
                  </div>
                </div>
                
                {/* Internal Links - Locations */}
                <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                  <h3 className="font-heading font-semibold text-lg mb-4">Filter by Location</h3>
                  <div className="space-y-2">
                    <Link to="/locations/apollonia" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                      Apollonia
                    </Link>
                    <Link to="/locations/kamares" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                      Kamares
                    </Link>
                    <Link to="/locations/platis-gialos" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                      Platis Gialos
                    </Link>
                    <Link to="/locations/artemonas" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                      Artemonas
                    </Link>
                    <Link to="/locations/vathi" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                      Vathi
                    </Link>
                    <Link to="/locations/faros" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                      Faros
                    </Link>
                    <Link to="/locations/kastro" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                      Kastro
                    </Link>
                  </div>
                </div>
                
                {/* Not Sure Where to Stay CTA */}
                <div className="bg-gradient-to-br from-sifnos-deep-blue/5 to-sifnos-beige/10 rounded-lg border border-border p-6">
                  <h3 className="font-heading font-semibold text-lg mb-2">Not sure where to stay?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get personalized recommendations based on your preferences.
                  </p>
                  <Link to="/where-to-stay-sifnos">
                    <Button variant="outline" className="w-full">
                      View Area Guide
                    </Button>
                  </Link>
                </div>
              </div>
            </aside>

            {/* Hotels List */}
            <main className="flex-1">
              {/* Toolbar */}
              <div className="bg-card rounded-lg border border-border p-4 mb-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-body text-sm text-muted-foreground">
                      <strong className="text-foreground">{filteredHotels.length}</strong> hotels found
                    </span>
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary">
                        {activeFiltersCount} {activeFiltersCount === 1 ? t('common.filter') : t('common.filters')}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Mobile Filters */}
                    <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="lg:hidden">
                          <SlidersHorizontal className="h-4 w-4 mr-2" />
                          Filters
                          {activeFiltersCount > 0 && (
                            <Badge variant="secondary" className="ml-2">
                              {activeFiltersCount}
                            </Badge>
                          )}
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-80 overflow-y-auto">
                        <SheetTitle>Filters</SheetTitle>
                        <div className="mt-6">
                          <FilterSidebar
                            filters={filters}
                            onFiltersChange={setFilters}
                            isMobile
                          />
                        </div>
                      </SheetContent>
                    </Sheet>

                    {/* Sort Dropdown */}
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={t('hotels.sortBy')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recommended">{t('hotels.recommended')}</SelectItem>
                        <SelectItem value="price-low">{t('hotels.priceLowToHigh')}</SelectItem>
                        <SelectItem value="price-high">{t('hotels.priceHighToLow')}</SelectItem>
                        <SelectItem value="rating">{t('hotels.ratingHighToLow')}</SelectItem>
                        <SelectItem value="name">{t('hotels.nameAZ')}</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* View Toggle */}
                    <div className="hidden sm:flex items-center gap-1 border border-border rounded-lg p-1">
                      <Button
                        variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                        className="h-8 w-8 p-0"
                      >
                        <Grid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className="h-8 w-8 p-0"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'map' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('map')}
                        className="h-8 w-8 p-0"
                        title="Map view coming soon"
                      >
                        <Map className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hotels Grid/List */}
              {filteredHotels.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-lg text-muted-foreground mb-4">No hotels found matching your criteria.</p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <>
                  {/* Map View */}
                  {viewMode === 'map' && (
                    <div className="h-[600px] rounded-lg overflow-hidden border-2 border-gray-200 mb-6">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3190.5!2d24.7!3d36.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzYuOTUgMjQuNw!5e0!3m2!1sen!2sus!4v1234567890"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Sifnos Hotels Map"
                      />
                      <div className="p-4 bg-white border-t">
                        <p className="text-sm text-gray-600">
                          {filteredHotels.length} hotels shown on map. Click on markers for details.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Grid/List View */}
                  {viewMode !== 'map' && (
                    <div className={
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                        : 'space-y-6'
                    }>
                      {currentHotels.map((hotel) => (
                        <div key={hotel.id} className="relative group">
                          <UnifiedHotelCard 
                            hotel={hotel}
                            onSelect={addToCompare}
                          />
                          {/* Compare Button Overlay */}
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => addToCompare(hotel)}
                              disabled={compareHotels.length >= 3 || compareHotels.find(h => h.id === hotel.id) !== undefined}
                              className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-md"
                            >
                              <GitCompare size={14} className="mr-1" />
                              {compareHotels.find(h => h.id === hotel.id) ? 'Added' : 'Compare'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-12 flex justify-center items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      
                      <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <Button
                                key={page}
                                variant={currentPage === page ? 'default' : 'outline'}
                                onClick={() => setCurrentPage(page)}
                                className="w-10"
                              >
                                {page}
                              </Button>
                            );
                          } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return <span key={page} className="px-2">...</span>;
                          }
                          return null;
                        })}
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>

        {/* Comparison Section */}
        {compareHotels.length > 0 && (
          <div id="comparison-section" className="py-12 bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
            <div className="container mx-auto px-4">
              <div className="mb-8">
                <h2 className="text-3xl font-heading font-bold text-sifnos-deep-blue mb-2">
                  Compare Hotels
                </h2>
                <p className="text-gray-600">
                  Side-by-side comparison of your selected hotels
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-lg shadow-lg">
                  <thead>
                    <tr className="bg-sifnos-deep-blue text-white">
                      <th className="p-4 text-left font-semibold">Hotel</th>
                      <th className="p-4 text-left font-semibold">Location</th>
                      <th className="p-4 text-left font-semibold">Rating</th>
                      <th className="p-4 text-left font-semibold">Price/Night</th>
                      <th className="p-4 text-left font-semibold">Amenities</th>
                      <th className="p-4 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compareHotels.map((hotel, index) => {
                      const hotelSlug = generateHotelUrl(hotel.name);
                      return (
                        <tr key={hotel.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="p-4">
                            <Link to={`/hotels/${hotelSlug}`} className="font-semibold text-sifnos-deep-blue hover:text-sifnos-turquoise">
                              {hotel.name}
                            </Link>
                          </td>
                          <td className="p-4 text-gray-600">{hotel.location}</td>
                          <td className="p-4">
                            {hotel.rating ? (
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                <span className="font-semibold">{hotel.rating}</span>
                              </div>
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </td>
                          <td className="p-4 font-semibold text-sifnos-deep-blue">
                            {hotel.price ? `€${hotel.price}` : t('common.contact')}
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {hotel.hotel_amenities?.slice(0, 3).map((amenity: any, idx: number) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {amenity.amenity || amenity}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Link to={`/hotels/${hotelSlug}`}>
                                <Button size="sm" variant="outline">
                                  View
                                </Button>
                              </Link>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => removeFromCompare(hotel.id)}
                              >
                                <X size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Compare Hotels Bar */}
        {compareHotels.length > 0 && (
          <CompareHotels
            hotels={compareHotels}
            onRemove={removeFromCompare}
            onClear={clearCompare}
          />
        )}

        {/* Floating Touristas AI Button */}
        <Button
          onClick={() => navigate('/touristas-ai')}
          className={`fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-110 z-50 ${compareHotels.length > 0 ? 'bottom-32' : ''}`}
          size="icon"
          variant="premium"
          aria-label="Open Touristas AI"
        >
          <TouristasLogo size="lg" />
        </Button>
      </div>
    </>
  );
}
