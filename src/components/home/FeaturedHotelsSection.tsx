import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase, logSupabaseResponse } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import UnifiedHotelCard from '@/components/UnifiedHotelCard';
import { Sparkles, Waves, Home, Users, Building2, Wallet } from 'lucide-react';

const filterOptions = [
  { id: 'all', label: 'All Hotels', icon: Home },
  { id: 'luxury', label: 'Luxury', icon: Sparkles },
  { id: 'beach', label: 'Beach', icon: Waves },
  { id: 'villas', label: 'Villas', icon: Building2 },
  { id: 'family', label: 'Family', icon: Users },
  { id: 'budget', label: 'Budget', icon: Wallet },
];

export default function FeaturedHotelsSection() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('hotels')
          .select(`
            *,
            hotel_amenities(amenity),
            hotel_photos(id, photo_url, is_main_photo)
          `)
          .order('rating', { ascending: false })
          .limit(12);
        
        if (error) throw error;
        
        logSupabaseResponse('fetch featured hotels', data, error);
        
        // Process hotels and enhance sponsored ones
        const sponsoredNames = ['ALK HOTEL™', 'Morpheas Pension & Apartments', 'Meropi Rooms and Apartments'];
        const processedHotels = data?.map(hotel => {
          const isSponsored = sponsoredNames.includes(hotel.name);
          const enhanced = { 
            ...hotel,
            isSponsored,
            source: 'local'
          };
          
          // Add custom photos for sponsored hotels
          if (hotel.name === 'ALK HOTEL™') {
            enhanced.logo_path = 'alk-hotel-sifnos/logo.png';
            enhanced.hotel_photos = [
              { id: 'alk-1', photo_url: 'alk-hotel-sifnos/alk-hotel-feature.jpeg', is_main_photo: true },
              { id: 'alk-2', photo_url: 'alk-hotel-sifnos/1.jpg_1.jpeg', is_main_photo: false },
              { id: 'alk-3', photo_url: 'alk-hotel-sifnos/3.jpg.jpeg', is_main_photo: false },
            ];
          } else if (hotel.name === 'Morpheas Pension & Apartments') {
            enhanced.logo_path = 'morpheas-pension/logo.png';
            enhanced.hotel_photos = [
              { id: 'morpheas-1', photo_url: 'morpheas-pension/sifnos-accommodation.jpg.jpeg', is_main_photo: true },
              { id: 'morpheas-2', photo_url: 'morpheas-pension/sifnos-morpheas-pension3.jpg.jpeg', is_main_photo: false },
            ];
          } else if (hotel.name === 'Meropi Rooms and Apartments') {
            enhanced.logo_path = 'meropi-logo.svg';
            enhanced.hotel_photos = [
              { id: 'meropi-1', photo_url: 'meropirooms-hero.webp', is_main_photo: true },
              { id: 'meropi-2', photo_url: 'meropirooms-one.webp', is_main_photo: false },
            ];
          }
          
          return enhanced;
        }) || [];
        
        setHotels(processedHotels);
      } catch (error) {
        console.error('Error fetching hotels:', error);
        toast({
          title: "Error loading hotels",
          description: "Please try refreshing the page",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [toast]);

  const filteredHotels = hotels.filter(hotel => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'luxury') return hotel.hotel_types?.includes('Luxury Hotels');
    if (activeFilter === 'beach') return hotel.hotel_types?.includes('Beach Hotels');
    if (activeFilter === 'villas') return hotel.hotel_types?.includes('Villas');
    if (activeFilter === 'family') return hotel.hotel_types?.includes('Family Friendly');
    if (activeFilter === 'budget') return hotel.price < 100;
    return true;
  });

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading featured hotels...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-heading font-bold text-foreground mb-3">
            Discover Our Handpicked Collection
          </h2>
          <div className="h-1 w-24 bg-accent mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Carefully selected hotels, villas, and apartments for your perfect Sifnos escape
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {filterOptions.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.id;
            return (
              <Button
                key={filter.id}
                variant={isActive ? "default" : "outline"}
                size="lg"
                onClick={() => setActiveFilter(filter.id)}
                className={`gap-2 transition-all duration-300 ${
                  isActive 
                    ? 'shadow-elegant' 
                    : 'hover:shadow-md hover:scale-105'
                }`}
              >
                <Icon className="h-4 w-4" />
                {filter.label}
              </Button>
            );
          })}
        </div>

        {/* Hotels Carousel */}
        {filteredHotels.length > 0 ? (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {filteredHotels.map((hotel) => (
                <CarouselItem key={hotel.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="h-full animate-fade-in">
                    <UnifiedHotelCard 
                      hotel={hotel}
                      className="h-full shadow-lg hover:shadow-elegant-lg transition-all duration-500"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4 shadow-lg" />
            <CarouselNext className="hidden md:flex -right-4 shadow-lg" />
          </Carousel>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No hotels found for this category. Try another filter.
            </p>
          </div>
        )}

        {/* View All CTA */}
        <div className="text-center mt-12">
          <Link to="/hotels">
            <Button 
              size="lg" 
              variant="premium"
              className="gap-2 shadow-elegant hover:shadow-elegant-lg transition-all duration-300"
            >
              View All Hotels
              <span className="text-lg">→</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
