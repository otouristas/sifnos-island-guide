import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO';
import UnifiedHotelCard from '@/components/UnifiedHotelCard';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Grid, List, Map, Bot, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FilterSidebar from '@/components/hotel/FilterSidebar';
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

export default function HotelsPage() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [filteredHotels, setFilteredHotels] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState('recommended');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const navigate = useNavigate();
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

  // Pagination
  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = filteredHotels.slice(indexOfFirstHotel, indexOfLastHotel);
  const totalPages = Math.ceil(filteredHotels.length / hotelsPerPage);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading hotels...</p>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Sifnos Hotels 2025 - Compare 25+ Premium Properties | Best Price Guarantee"
        description="Browse 25+ handpicked Sifnos hotels & villas. Compare luxury resorts, family properties & romantic getaways with real-time availability, best prices & instant confirmation."
        keywords={[
          'sifnos hotels 2025', 'compare sifnos hotels', 'best sifnos accommodation',
          'luxury hotels sifnos', 'beach hotels sifnos', 'family hotels sifnos'
        ]}
        pageType="hotels"
        schemaType="CollectionPage"
        canonical="https://hotelssifnos.com/hotels"
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
                Sifnos Hotels & Accommodation
              </h1>
              <p className="font-body text-lg text-muted-foreground mb-6">
                Discover {hotels.length}+ handpicked hotels, luxury villas, and boutique accommodations across Sifnos. Best price guarantee and instant booking.
              </p>
              
              {/* Quick Links */}
              <div className="flex flex-wrap gap-2">
                <Link to="/hotel-types/luxury-hotels">
                  <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                    ✨ Luxury Hotels
                  </Badge>
                </Link>
                <Link to="/hotel-types/villas">
                  <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                    🏡 Private Villas
                  </Badge>
                </Link>
                <Link to="/hotel-types/beach-hotels">
                  <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                    🏖️ Beachfront
                  </Badge>
                </Link>
                <Link to="/hotel-types/family-friendly-hotels">
                  <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                    👨‍👩‍👧‍👦 Family Friendly
                  </Badge>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar - Desktop */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24">
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
                        {activeFiltersCount} {activeFiltersCount === 1 ? 'filter' : 'filters'}
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
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recommended">Recommended</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="rating">Rating: High to Low</SelectItem>
                        <SelectItem value="name">Name: A-Z</SelectItem>
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
                  <div className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                      : 'space-y-6'
                  }>
                    {currentHotels.map((hotel) => (
                      <UnifiedHotelCard 
                        key={hotel.id} 
                        hotel={hotel}
                      />
                    ))}
                  </div>

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

        {/* Floating Touristas AI Button */}
        <Button
          onClick={() => navigate('/touristas-ai')}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-110 z-50"
          size="icon"
          variant="premium"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </div>
    </>
  );
}
