
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase, logSupabaseResponse } from '@/integrations/supabase/client';
import HotelCard from '@/components/HotelCard';
import SponsoredHotelCard from '@/components/SponsoredHotelCard';
import { useToast } from '@/hooks/use-toast';

export default function FeaturedHotelsSection() {
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [sponsoredHotel, setSponsoredHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFeaturedHotels = async () => {
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
          .limit(3);
        
        if (error) {
          console.error('Error fetching featured hotels:', error);
          toast({
            title: "Error loading featured hotels",
            description: "Please try refreshing the page",
            variant: "destructive",
          });
          throw error;
        }
        
        console.log('Featured hotels loaded:', data?.length || 0, 'hotels');
        logSupabaseResponse('fetch featured hotels', data, error);
        
        // Process the data and separate ALK HOTEL as sponsored
        let alkHotel = null;
        let otherHotels = [];
        
        data?.forEach(hotel => {
          if (hotel.name === 'ALK HOTEL™') {
            // Add logo path and photos for ALK HOTEL
            alkHotel = {
              ...hotel,
              logo_url: 'alk-hotel-sifnos/logo.png',
              hotel_photos: [
                { id: 'alk-1', photo_url: 'alk-hotel-sifnos/alk-hotel-feature.jpeg', is_main_photo: true },
                { id: 'alk-2', photo_url: 'alk-hotel-sifnos/1.jpg_1.jpeg', is_main_photo: false },
                { id: 'alk-3', photo_url: 'alk-hotel-sifnos/3.jpg.jpeg', is_main_photo: false },
                { id: 'alk-4', photo_url: 'alk-hotel-sifnos/148.jpg.jpeg', is_main_photo: false },
                { id: 'alk-5', photo_url: 'alk-hotel-sifnos/211.jpg.jpeg', is_main_photo: false },
                { id: 'alk-6', photo_url: 'alk-hotel-sifnos/image.php_1.jpeg', is_main_photo: false },
                { id: 'alk-7', photo_url: 'alk-hotel-sifnos/image.php_6.jpeg', is_main_photo: false },
              ]
            };
            console.log('ALK HOTEL found and set as sponsored');
          } else {
            otherHotels.push(hotel);
          }
        });
        
        setSponsoredHotel(alkHotel);
        setFeaturedHotels(otherHotels || []);
        
        // If we didn't find ALK HOTEL in the data, create it manually
        if (!alkHotel) {
          const defaultAlkHotel = {
            id: 'alk-hotel-id',
            name: 'ALK HOTEL™',
            location: 'Agia Marina - Kamares, Sifnos',
            rating: 5,
            hotel_types: ['luxury-hotels', 'beach-hotels'],
            logo_url: 'alk-hotel-sifnos/logo.png',
            hotel_amenities: [
              { amenity: 'Free WiFi' },
              { amenity: 'Breakfast Included' },
              { amenity: 'Sea View' },
              { amenity: 'Pool Access' },
            ],
            hotel_photos: [
              { id: 'alk-1', photo_url: 'alk-hotel-sifnos/alk-hotel-feature.jpeg', is_main_photo: true },
              { id: 'alk-2', photo_url: 'alk-hotel-sifnos/1.jpg_1.jpeg', is_main_photo: false },
              { id: 'alk-3', photo_url: 'alk-hotel-sifnos/3.jpg.jpeg', is_main_photo: false },
            ]
          };
          setSponsoredHotel(defaultAlkHotel);
          console.log('ALK HOTEL manually created as sponsored');
        }
        
      } catch (error) {
        console.error('Error in featured hotels fetch:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedHotels();
  }, [toast]);

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
        
        {/* Always show sponsored hotel first if available */}
        {!loading && sponsoredHotel && (
          <SponsoredHotelCard hotel={sponsoredHotel} />
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {loading ? (
            // Loading state
            [...Array(3)].map((_, index) => (
              <div key={`skeleton-${index}`} className="bg-white rounded-lg shadow-md overflow-hidden p-4">
                <div className="h-48 bg-gray-200 animate-pulse mb-4 rounded"></div>
                <div className="h-6 bg-gray-200 animate-pulse mb-2 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 animate-pulse mb-4 rounded w-1/2"></div>
                <div className="flex space-x-2">
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-1/4"></div>
                </div>
              </div>
            ))
          ) : featuredHotels.length > 0 ? (
            featuredHotels.map(hotel => (
              <HotelCard key={hotel.id} hotel={hotel} showLogo={true} />
            ))
          ) : (
            <div className="text-center py-12 col-span-3">
              <h3 className="font-medium text-xl text-gray-700">No featured hotels available</h3>
              <p className="text-gray-500 mt-2">Please check back later for hotel recommendations</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
