import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase, logSupabaseResponse } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import HotelImage from '@/components/hotel/HotelImage';
import HotelAmenities from '@/components/HotelAmenities';
import HotelFAQs from '@/components/hotel/HotelFAQs';
import BookingReviews from '@/components/BookingReviews';
import { Button } from '@/components/ui/button';
import { ExternalLink, MapPin, Phone, Mail, Globe, CheckCircle } from 'lucide-react';

export default function HotelDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!slug) return;
    
    const fetchHotelBySlug = async () => {
      try {
        setLoading(true);
        // Convert slug to name format, e.g., "alk-hotel" -> "ALK HOTEL"
        const possibleName = slug.split('-').map(word => 
          word === 'alk' ? 'ALK' : word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        
        const { data, error } = await supabase
          .from('hotels')
          .select(`
            *,
            hotel_amenities(amenity),
            hotel_photos(id, photo_url, is_main_photo),
            hotel_rooms(id, name, description, capacity, photo_url, price, amenities),
            hotel_reviews(id, reviewer_name, country, rating, comment, date, reviewer_photo)
          `)
          .ilike('name', `%${possibleName}%`)
          .limit(1)
          .single();
        
        if (error || !data) {
          console.error('Error fetching hotel:', error);
          navigate('/not-found');
          return;
        }
        
        logSupabaseResponse('fetch hotel by slug', data, error);
        setHotel(data);
      } catch (error) {
        console.error('Error in hotel fetch:', error);
        navigate('/not-found');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHotelBySlug();
  }, [slug, navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sifnos-turquoise"></div>
      </div>
    );
  }
  
  if (!hotel) return null;
  
  // Get main photo
  const mainPhoto = hotel.hotel_photos?.find((p: any) => p.is_main_photo) || hotel.hotel_photos?.[0];
  const mainPhotoUrl = mainPhoto ? `uploads/hotels/${mainPhoto.photo_url}` : 'hotel1.jpg';
  
  // Get features/amenities 
  const amenities = hotel.hotel_amenities?.map((a: any) => a.amenity) || [];
  
  // Generate hotel-specific meta description
  const getHotelMetaDescription = (hotel: any) => {
    // Check hotel name and return specific description
    if (/ALK HOTEL/i.test(hotel.name)) {
      return "Experience luxury at ALK HOTEL™ in Kamares, Sifnos - just 150m from Agia Marina Beach. Featuring sea view rooms, concierge services, and a 24h self-service bar with sunset views. Perfect for guests over 9 years old.";
    } else if (/Filladaki/i.test(hotel.name)) {
      return "Discover Filladaki Villas in Kamares, Sifnos - 550m from the beach with panoramic Aegean views. Choose from spacious villas with full kitchens, private verandas, and enjoy the swimming pool with sea views. Ideal for families.";
    } else if (/Morpheas/i.test(hotel.name)) {
      return "Stay at Morpheas Pension & Apartments, just 80m from Kamares Beach in Sifnos. Choose from studios, rooms and apartments with air conditioning, free Wi-Fi, and private bathrooms. Perfect location near the beach and amenities.";
    } else if (/Villa Olivia Clara/i.test(hotel.name)) {
      return "Experience luxury at Villa Olivia Clara in Platis Gialos, Sifnos - a 7-minute walk from the beach. This 4-bedroom villa accommodates 8 guests with a private pool, fully equipped kitchen, and housekeeping services twice weekly.";
    } else if (/Meropi/i.test(hotel.name)) {
      return "Stay at Meropi Rooms in Kamares, only 100m from the beach and steps from the port. All rooms feature private balconies, air conditioning, free Wi-Fi and private bathrooms. Excellent reviews for cleanliness.";
    }
    // Default description for other hotels
    return `Discover ${hotel.name} in ${hotel.location}, Sifnos. Experience comfort and Greek hospitality with ${amenities.slice(0, 3).join(', ')} and more. Book your stay in this ${hotel.hotel_types?.join(' ')} accommodation today.`;
  };
  
  // Determine the schema type for Villa Olivia Clara or other properties
  const schemaType = /Villa Olivia Clara/i.test(hotel.name) ? 'TouristDestination' : 'Hotel';
  
  return (
    <>
      <SEO 
        title={/Villa Olivia Clara/i.test(hotel.name) ? 
          `Villa Olivia Clara - Luxury Villa in ${hotel.location}, Sifnos` :
          `${hotel.name} - ${hotel.hotel_types?.map((t: string) => t.replace(/-/g, ' ').replace(/hotels/g, 'Hotel')).join(', ')} in ${hotel.location}, Sifnos`}
        description={getHotelMetaDescription(hotel)}
        keywords={[
          'sifnos accommodation', 
          `${hotel.location.toLowerCase()} accommodation`, 
          hotel.name.toLowerCase(),
          ...(hotel.hotel_types?.map((t: string) => t.replace(/-/g, ' ')) || [])
        ]}
        schemaType={schemaType}
        canonical={`https://hotelssifnos.com/hotels/${slug}`}
      />
      
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4">
        <Breadcrumbs 
          items={[
            { label: 'Hotels', href: '/hotels' },
            { label: hotel.location, href: `/locations/${hotel.location.toLowerCase().replace(/\s+/g, '-')}` }
          ]}
          currentPage={hotel.name}
        />
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        {/* Hotel header with name and rating */}
        <div className="flex flex-wrap items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{hotel.name}</h1>
            <div className="flex items-center mt-2">
              <MapPin size={16} className="text-gray-500 mr-1" />
              <p className="text-gray-600">{hotel.location}, Sifnos</p>
            </div>
          </div>
          
          <div className="flex items-center bg-amber-50 px-3 py-2 rounded-lg text-amber-800 mt-2 md:mt-0">
            <span className="font-bold text-lg mr-1">{hotel.rating}.0</span>
            <span className="text-xs">/5</span>
          </div>
        </div>
        
        {/* Hotel main image and gallery */}
        <div className="mb-8">
          <HotelImage hotel={hotel} imageUrl={mainPhotoUrl} />
        </div>
        
        {/* Hotel info and booking */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Hotel info */}
          <div className="lg:col-span-2">
            {/* Description */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">About {hotel.name}</h2>
              <div className="prose max-w-none">
                <p>{hotel.description}</p>
              </div>
            </section>
            
            {/* Hotel features/amenities */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Amenities</h2>
              <HotelAmenities amenities={amenities} />
            </section>
            
            {/* Hotel FAQs */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Frequently Asked Questions</h2>
              <HotelFAQs hotelName={hotel.name} />
            </section>
            
            {/* Reviews section */}
            {hotel.hotel_reviews && hotel.hotel_reviews.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Guest Reviews</h2>
                <div className="space-y-4">
                  {hotel.hotel_reviews.slice(0, 3).map((review: any) => (
                    <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 mr-3">
                            {review.reviewer_photo ? (
                              <img 
                                src={review.reviewer_photo} 
                                alt={review.reviewer_name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              review.reviewer_name.charAt(0)
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium">{review.reviewer_name}</h4>
                            {review.country && (
                              <span className="text-xs text-gray-500">{review.country}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center bg-amber-50 px-2 py-1 rounded text-amber-800">
                          <span className="font-bold text-sm">{review.rating}</span>
                          <span className="text-xs ml-1">/5</span>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(review.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {/* Booking.com reviews if available */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">More Guest Reviews</h2>
              <BookingReviews hotelId={hotel.id} />
            </section>
          </div>
          
          {/* Right column - Contact and booking */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm sticky top-24">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">Contact & Booking</h3>
              
              {/* Contact details */}
              <div className="space-y-4 mb-6">
                {hotel.phone && (
                  <div className="flex items-center">
                    <Phone size={18} className="text-sifnos-turquoise mr-2" />
                    <span>{hotel.phone}</span>
                  </div>
                )}
                
                {hotel.email && (
                  <div className="flex items-center">
                    <Mail size={18} className="text-sifnos-turquoise mr-2" />
                    <a href={`mailto:${hotel.email}`} className="text-sifnos-turquoise hover:underline">
                      {hotel.email}
                    </a>
                  </div>
                )}
                
                {hotel.website && (
                  <div className="flex items-center">
                    <Globe size={18} className="text-sifnos-turquoise mr-2" />
                    <a 
                      href={hotel.website.startsWith('http') ? hotel.website : `https://${hotel.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sifnos-turquoise hover:underline"
                    >
                      Official Website
                    </a>
                  </div>
                )}
              </div>
              
              {/* Booking platforms */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Book Online</h4>
                
                {/* Booking platforms - if available */}
                {hotel.booking_url && (
                  <Button className="w-full bg-[#003580] hover:bg-[#00224f] text-white">
                    <img 
                      src="/uploads/Booking.com.svg" 
                      alt="Booking.com" 
                      className="h-6 mr-2" 
                    />
                    <span>Book on Booking.com</span>
                    <ExternalLink size={14} className="ml-2" />
                  </Button>
                )}
                
                {/* Direct booking - if website is available */}
                {hotel.website && (
                  <Button variant="outline" className="w-full border-sifnos-turquoise text-sifnos-turquoise hover:bg-sifnos-turquoise/10">
                    Book Directly
                    <ExternalLink size={14} className="ml-2" />
                  </Button>
                )}
              </div>
              
              {/* Why book this hotel */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-700 mb-3">Why Choose {hotel.name}</h4>
                <ul className="space-y-2">
                  {amenities.slice(0, 4).map((amenity: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle size={16} className="text-sifnos-turquoise mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-sm">{amenity}</span>
                    </li>
                  ))}
                  <li className="flex items-start">
                    <CheckCircle size={16} className="text-sifnos-turquoise mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm">Great location in {hotel.location}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
