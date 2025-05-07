import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getHotelBySlug } from '@/lib/url-utils';
import SEO from '@/components/SEO';
import { determineHotelImageUrl, determineHotelLogoUrl } from '@/utils/image-utils';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useQuery } from '@tanstack/react-query';
import BookingReviews from '@/components/BookingReviews';
import HotelFAQs from '@/components/hotel/HotelFAQs';

const HotelDetailPage = () => {
  const { slug } = useParams();
  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [faqs, setFaqs] = useState<Array<{question: string, answer: string}>>([]);
  
  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        if (slug) {
          setLoading(true);
          console.log(`Fetching hotel data for slug: ${slug}`);
          
          const hotelData = await getHotelBySlug(slug);
          
          if (hotelData) {
            console.log('Hotel data found:', hotelData);
            setHotel(hotelData);
            
            // Extract amenities for schema data
            const extractedAmenities = hotelData.hotel_amenities?.map((item: any) => item.amenity) || [];
            setAmenities(extractedAmenities);
            
            // Generate FAQs based on hotel data
            generateHotelFAQs(hotelData);
          } else {
            console.error('No hotel data found for slug:', slug);
          }
        }
      } catch (error) {
        console.error('Error fetching hotel data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHotelData();
  }, [slug]);
  
  // Generate FAQs based on hotel data for structured data
  const generateHotelFAQs = (hotelData: any) => {
    if (!hotelData) return;
    
    const generatedFAQs = [
      {
        question: `Where is ${hotelData.name} located?`,
        answer: `${hotelData.name} is located in ${hotelData.location}, Sifnos, in the beautiful Cyclades islands of Greece.`
      },
      {
        question: `What amenities does ${hotelData.name} offer?`,
        answer: hotelData.hotel_amenities && hotelData.hotel_amenities.length > 0 
          ? `${hotelData.name} offers ${hotelData.hotel_amenities.slice(0, 5).map((a: any) => a.amenity).join(', ')}${hotelData.hotel_amenities.length > 5 ? ' and more' : '.'}`
          : `Please contact ${hotelData.name} directly for information about their amenities.`
      },
      {
        question: `How can I book a room at ${hotelData.name}?`,
        answer: hotelData.booking_url 
          ? `You can book directly through their booking platform or through our website. Visit their official booking page for the best rates.`
          : `Contact ${hotelData.name} directly by phone or email to make your reservation.`
      }
    ];
    
    setFaqs(generatedFAQs);
  };

  // Determine the main image URL for SEO
  const mainImageUrl = hotel ? determineHotelImageUrl(hotel, 
    hotel.hotel_photos?.find((photo: any) => photo.is_main_photo)?.photo_url || '') : '';
  
  // Determine if the property is a villa or hotel
  const isVilla = hotel?.hotel_types?.includes('villas');
  const propertyType = isVilla ? 'Villa' : 'Hotel';
  
  // Price range based on room prices if available
  const calculatePriceRange = () => {
    if (!hotel?.hotel_rooms || hotel.hotel_rooms.length === 0) return '€€€';
    
    const prices = hotel.hotel_rooms.map((room: any) => room.price).filter(Boolean);
    if (prices.length === 0) return '€€€';
    
    const minPrice = Math.min(...prices);
    if (minPrice < 100) return '€';
    if (minPrice < 200) return '€€';
    if (minPrice < 300) return '€€€';
    return '€€€€';
  };
  
  // Prepare hotel data for SEO
  const seoHotelData = hotel ? {
    name: hotel.name,
    location: hotel.location,
    type: propertyType,
    priceRange: calculatePriceRange(),
    rating: hotel.rating || 4.5,
    amenities: amenities,
    imageUrl: mainImageUrl,
    telephone: hotel.phone,
    coordinates: hotel.coordinates || { latitude: "36.9777", longitude: "24.7458" },
    checkInTime: "14:00",
    checkOutTime: "11:00",
    roomCount: hotel.hotel_rooms?.length || 5,
    reviewCount: 32 // This should be dynamically determined if possible
  } : undefined;

  return (
    <div className="bg-gray-50 min-h-screen pt-16 pb-10">
      {/* SEO Component with enhanced schema data */}
      {hotel && (
        <SEO 
          title={`${hotel.name} - ${propertyType} in ${hotel.location}, Sifnos`}
          description={hotel.short_description || `Experience ${hotel.name}, a ${propertyType.toLowerCase()} in ${hotel.location}, Sifnos. Perfect for your Greek island getaway.`}
          keywords={[
            `${hotel.name}`, 'sifnos hotel', `hotel in ${hotel.location}`, 'greek islands accommodation',
            ...amenities.slice(0, 3)
          ]}
          schemaType={propertyType}
          canonical={`https://hotelssifnos.com/hotels/${slug}`}
          imageUrl={mainImageUrl}
          hotelData={seoHotelData}
          faqData={{ questions: faqs }}
        />
      )}
      
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 mb-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Hotels', href: '/hotels' },
            { label: hotel?.name || 'Hotel Details', href: '#' },
          ]}
        />
      </div>

      {loading ? (
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-300 rounded-lg mb-4"></div>
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6 mb-4"></div>
          </div>
        </div>
      ) : hotel ? (
        <div className="container mx-auto px-4">
          {/* Hotel Detail Content */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            {/* Hotel Images */}
            <div className="relative h-96">
              <img
                src={mainImageUrl || '/placeholder.svg'}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
              
              {/* Hotel Logo Overlay */}
              {hotel.logo_url && (
                <div className="absolute top-4 right-4 bg-white/80 p-2 rounded-lg">
                  <img 
                    src={determineHotelLogoUrl(hotel)} 
                    alt={`${hotel.name} logo`} 
                    className="h-12"
                  />
                </div>
              )}
            </div>
            
            {/* Hotel Info */}
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{hotel.name}</h1>
              <p className="text-gray-600 mb-4">{hotel.location}, Sifnos</p>
              
              {/* Hotel Description */}
              <div className="prose max-w-none mb-6">
                <p>{hotel.description || hotel.short_description || 'No description available.'}</p>
              </div>
              
              {/* Amenities Section */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {hotel.hotel_amenities?.map((amenity: any, index: number) => (
                    <div key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-sifnos-turquoise rounded-full mr-2"></span>
                      <span>{amenity.amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Rooms Section */}
              {hotel.hotel_rooms && hotel.hotel_rooms.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Rooms</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hotel.hotel_rooms.map((room: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h3 className="font-medium mb-2">{room.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{room.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">
                            {room.capacity} {room.capacity === 1 ? 'person' : 'people'} · {room.size_sqm || 'N/A'} m²
                          </span>
                          {room.price && (
                            <span className="font-semibold">
                              From €{room.price}/night
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Contact & Booking Section */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Contact & Booking</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hotel.phone && (
                    <div>
                      <h3 className="font-medium mb-1">Phone</h3>
                      <p>{hotel.phone}</p>
                    </div>
                  )}
                  {hotel.email && (
                    <div>
                      <h3 className="font-medium mb-1">Email</h3>
                      <p>{hotel.email}</p>
                    </div>
                  )}
                  {hotel.website && (
                    <div>
                      <h3 className="font-medium mb-1">Website</h3>
                      <a 
                        href={hotel.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sifnos-turquoise hover:underline"
                      >
                        Visit Hotel Website
                      </a>
                    </div>
                  )}
                  {hotel.booking_url && (
                    <div>
                      <h3 className="font-medium mb-1">Book Now</h3>
                      <a 
                        href={hotel.booking_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block bg-sifnos-turquoise hover:bg-sifnos-turquoise/90 text-white px-4 py-2 rounded-md"
                      >
                        Check Availability
                      </a>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Location Section */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Location</h2>
                <p className="mb-2">{hotel.location}, Sifnos, Cyclades, Greece</p>
                {/* Map placeholder - could be replaced with an actual map component */}
                <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Map view not available</span>
                </div>
              </div>
              
              {/* Reviews Section */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Guest Reviews</h2>
                <BookingReviews hotelId={hotel.id} hotelName={hotel.name} />
              </div>
              
              {/* FAQs Section */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Frequently Asked Questions</h2>
                <HotelFAQs hotelName={hotel.name} faqs={faqs} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Hotel Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the hotel you're looking for.</p>
          <a href="/hotels" className="inline-block bg-sifnos-turquoise hover:bg-sifnos-turquoise/90 text-white px-6 py-3 rounded-md">
            Browse All Hotels
          </a>
        </div>
      )}
    </div>
  );
};

export default HotelDetailPage;
