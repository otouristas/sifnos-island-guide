
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase, logSupabaseResponse } from '@/integrations/supabase/client';
import HotelCard from '@/components/HotelCard';
import SponsoredHotelCard from '@/components/SponsoredHotelCard';
import { useToast } from '@/hooks/use-toast';

export default function FeaturedHotelsSection() {
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [sponsoredHotels, setSponsoredHotels] = useState([]);
  const [displayedSponsoredHotel, setDisplayedSponsoredHotel] = useState(null);
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
        
        // Process the data and separate sponsored hotels
        const sponsoredHotelsList = [];
        let otherHotels = [];
        
        // Define our sponsored hotels
        const sponsoredHotelNames = ['ALK HOTEL™', 'Morpheas Pension & Apartments', 'Meropi Rooms and Apartments'];
        
        data?.forEach(hotel => {
          if (sponsoredHotelNames.includes(hotel.name)) {
            // Add to sponsored hotels list with appropriate customization
            const sponsoredHotel = { ...hotel };
            
            if (hotel.name === 'ALK HOTEL™') {
              sponsoredHotel.logo_url = 'alk-hotel-sifnos/logo.png';
              sponsoredHotel.hotel_photos = [
                { id: 'alk-1', photo_url: 'alk-hotel-sifnos/alk-hotel-feature.jpeg', is_main_photo: true },
                { id: 'alk-2', photo_url: 'alk-hotel-sifnos/1.jpg_1.jpeg', is_main_photo: false },
                { id: 'alk-3', photo_url: 'alk-hotel-sifnos/3.jpg.jpeg', is_main_photo: false },
                { id: 'alk-4', photo_url: 'alk-hotel-sifnos/148.jpg.jpeg', is_main_photo: false },
                { id: 'alk-5', photo_url: 'alk-hotel-sifnos/211.jpg.jpeg', is_main_photo: false },
                { id: 'alk-6', photo_url: 'alk-hotel-sifnos/image.php_1.jpeg', is_main_photo: false },
                { id: 'alk-7', photo_url: 'alk-hotel-sifnos/image.php_6.jpeg', is_main_photo: false },
              ];
            } else if (hotel.name === 'Morpheas Pension & Apartments') {
              sponsoredHotel.logo_url = 'morpheas-pension/logo.png';
              sponsoredHotel.hotel_photos = [
                { id: 'morpheas-1', photo_url: 'morpheas-pension/sifnos-accommodation.jpg.jpeg', is_main_photo: true },
                { id: 'morpheas-2', photo_url: 'morpheas-pension/sifnos-morpheas-pension3.jpg.jpeg', is_main_photo: false },
                { id: 'morpheas-3', photo_url: 'morpheas-pension/sifnos-morpheas-pension4.jpg.jpeg', is_main_photo: false },
              ];
            } else if (hotel.name === 'Meropi Rooms and Apartments') {
              sponsoredHotel.logo_url = 'meropi-logo.svg';
              sponsoredHotel.hotel_photos = [
                { id: 'meropi-1', photo_url: 'meropirooms-hero.webp', is_main_photo: true },
                { id: 'meropi-2', photo_url: 'meropirooms-one.webp', is_main_photo: false },
                { id: 'meropi-3', photo_url: 'meropirooms-two.webp', is_main_photo: false },
              ];
            }
            
            sponsoredHotelsList.push(sponsoredHotel);
            console.log(`Added ${hotel.name} as a sponsored hotel`);
          } else {
            otherHotels.push(hotel);
          }
        });
        
        setSponsoredHotels(sponsoredHotelsList);
        setFeaturedHotels(otherHotels || []);
        
        // Create default sponsored hotels if any are missing
        if (sponsoredHotelsList.length === 0) {
          const defaultSponsoredHotels = [
            {
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
            },
            {
              id: 'morpheas-id',
              name: 'Morpheas Pension & Apartments',
              location: 'Apollonia, Sifnos',
              rating: 4,
              hotel_types: ['family-friendly', 'traditional-hotels'],
              logo_url: 'morpheas-pension/logo.png',
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
              logo_url: 'meropi-logo.svg',
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
        console.error('Error in featured hotels fetch:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedHotels();
  }, [toast]);
  
  // Select a random sponsored hotel to display when the component loads
  useEffect(() => {
    if (sponsoredHotels.length > 0) {
      const randomIndex = Math.floor(Math.random() * sponsoredHotels.length);
      setDisplayedSponsoredHotel(sponsoredHotels[randomIndex]);
      console.log(`Randomly selected ${sponsoredHotels[randomIndex]?.name} to display as sponsored`);
    }
  }, [sponsoredHotels]);

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
        
        {/* Always show one sponsored hotel first if available */}
        {!loading && displayedSponsoredHotel && (
          <SponsoredHotelCard hotel={displayedSponsoredHotel} />
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
