
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import HotelCard from '@/components/HotelCard';

export default function FeaturedHotelsSection() {
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
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
  );
}
