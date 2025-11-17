import { useState, useEffect, useMemo } from 'react';
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
import { useI18n } from '@/contexts/I18nContext';

export default function FeaturedHotelsSection() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const { toast } = useToast();
  const { t } = useI18n();
  
  const filterOptions = useMemo(() => ([
    { id: 'all', label: t('featuredHotels.filterAll'), icon: Home },
    { id: 'luxury', label: t('featuredHotels.filterLuxury'), icon: Sparkles },
    { id: 'beach', label: t('featuredHotels.filterBeach'), icon: Waves },
    { id: 'villas', label: t('featuredHotels.filterVillas'), icon: Building2 },
    { id: 'family', label: t('featuredHotels.filterFamily'), icon: Users },
    { id: 'budget', label: t('featuredHotels.filterBudget'), icon: Wallet },
  ]), [t]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        
        // Query top-rated hotels (featured field doesn't exist in schema)
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
        
        // Process hotels
        const processedHotels = data?.map(hotel => ({
          ...hotel,
          isSponsored: false,
          source: 'local'
        })) || [];
        
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
            <p className="mt-4 text-muted-foreground">{t('featuredHotels.loadingText')}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-4 py-1.5 text-sm font-medium border-sifnos-beige/30">
            <Sparkles className="h-3.5 w-3.5 mr-1.5 text-sifnos-beige" />
            {t('featuredHotels.badge')}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-sifnos-deep-blue mb-4">
            {t('featuredHotels.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('featuredHotels.subtitle')}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filterOptions.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.id;
            return (
              <Button
                key={filter.id}
                variant="outline"
                size="lg"
                onClick={() => setActiveFilter(filter.id)}
                className={`gap-2 transition-all duration-300 font-medium ${
                  isActive 
                    ? 'bg-sifnos-beige text-sifnos-deep-blue border-sifnos-beige hover:bg-sifnos-beige/90 shadow-lg' 
                    : 'border-gray-300 text-gray-700 hover:border-sifnos-beige hover:text-sifnos-deep-blue hover:scale-105'
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
              className="gap-2 bg-sifnos-deep-blue text-white hover:bg-sifnos-deep-blue/90 px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              {t('featuredHotels.viewAll', { count: filteredHotels.length.toString() })}
              <span className="text-xl">→</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
