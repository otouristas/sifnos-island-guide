import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, Star, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { generateHotelUrl } from '@/lib/url-utils';
import { determineHotelLogoUrl } from '@/utils/image-utils';
import { getHotelImageUrl } from '@/utils/hotel-utils';

export default function TrendingNowSection() {
  const [trendingHotels, setTrendingHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingHotels = async () => {
      try {
        const { data, error } = await supabase
          .from('hotels')
          .select(`
            *,
            hotel_photos(id, photo_url, is_main_photo),
            hotel_amenities(amenity)
          `)
          .order('rating', { ascending: false })
          .limit(4);

        if (error) throw error;
        setTrendingHotels(data || []);
      } catch (error) {
        console.error('Error fetching trending hotels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingHotels();
  }, []);

  if (loading || trendingHotels.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full mb-4">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-semibold text-orange-600">Trending Now</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-sifnos-deep-blue mb-2">
              Popular Hotels This Season
            </h2>
            <p className="text-lg text-gray-600">
              These are the most searched and booked hotels in Sifnos right now
            </p>
          </div>
          <Link 
            to="/hotels"
            className="hidden md:block text-sifnos-deep-blue hover:text-sifnos-turquoise font-semibold"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingHotels.map((hotel) => {
            const hotelSlug = generateHotelUrl(hotel.name);
            const imageUrl = getHotelImageUrl(hotel);
            const logoUrl = determineHotelLogoUrl(hotel);

            return (
              <Link key={hotel.id} to={`/hotels/${hotelSlug}`}>
                <Card className="h-full border-2 border-gray-100 hover:border-sifnos-turquoise/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group overflow-hidden">
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img 
                      src={imageUrl} 
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-orange-500 text-white">
                        <TrendingUp size={12} className="mr-1" />
                        Trending
                      </Badge>
                    </div>
                    {logoUrl && (
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg">
                        <img 
                          src={logoUrl} 
                          alt={`${hotel.name} logo`}
                          className="h-8 w-auto object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-heading font-bold text-sifnos-deep-blue mb-2 group-hover:text-sifnos-turquoise transition-colors line-clamp-1">
                      {hotel.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <MapPin size={14} />
                      <span>{hotel.location}</span>
                    </div>
                    {hotel.rating && (
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-semibold">{hotel.rating}</span>
                        <span className="text-xs text-gray-500">/5</span>
                      </div>
                    )}
                    {hotel.price && (
                      <div className="text-lg font-bold text-sifnos-deep-blue">
                        From €{hotel.price}/night
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link 
            to="/hotels"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-sifnos-deep-blue text-sifnos-deep-blue rounded-xl hover:bg-sifnos-deep-blue hover:text-white transition-all duration-300 font-semibold text-lg"
          >
            Browse All Hotels
            <span className="text-xl">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

