import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Calendar, Users, Phone, Mail, GlobeIcon, Facebook, Instagram, Twitter, CheckCircle, PlusCircle, MinusCircle, ExternalLink, Map } from 'lucide-react';
import { supabase, logSupabaseResponse, getHotelRoomImagePath } from '@/integrations/supabase/client';
import SEO from '../components/SEO';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { getHotelBySlug, generateHotelUrl } from '@/lib/url-utils';
import BookingReviews from '@/components/BookingReviews';
import HotelAmenities from '@/components/HotelAmenities';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function HotelDetailPage() {
  const { slug } = useParams();
  const [hotel, setHotel] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState(-1);
  const { toast } = useToast();
  
  // Define the hotel photos for Meropi
  const meropiPhotos = [
    { id: '1', photo_url: 'meropirooms-hero.webp', is_main_photo: true, description: 'Meropi Rooms Exterior' },
    { id: '2', photo_url: 'meropirooms-one.webp', is_main_photo: false, description: 'Room Interior' },
    { id: '3', photo_url: 'meropirooms-two.webp', is_main_photo: false, description: 'Room View' },
    { id: '4', photo_url: 'meropirooms-three.webp', is_main_photo: false, description: 'Room Balcony' },
    { id: '5', photo_url: 'meropirooms-four.webp', is_main_photo: false, description: 'Room Detail' },
    { id: '6', photo_url: 'meropirooms-bath.webp', is_main_photo: false, description: 'Bathroom' }
  ];

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        if (!slug) return;
        
        // Get hotel by slug instead of by ID
        const hotelData = await getHotelBySlug(slug);
        
        if (!hotelData) {
          toast({
            title: "Hotel not found",
            description: "We couldn't find the hotel you're looking for.",
            variant: "destructive"
          });
          return;
        }
        
        // Special handling for Meropi Rooms - add photos
        if (hotelData.id === '0c9632b6-db5c-4179-8122-0003896e465e') {
          hotelData.hotel_photos = meropiPhotos;
          hotelData.logo_path = 'meropi-logo.svg';
        }
        
        setHotel(hotelData);
        
        // Set active image to main photo or first photo
        if (hotelData?.hotel_photos?.length > 0) {
          const mainPhoto = hotelData.hotel_photos.find(photo => photo.is_main_photo);
          const photoUrl = mainPhoto ? mainPhoto.photo_url : hotelData.hotel_photos[0].photo_url;
          setActiveImage(`/uploads/hotels/${photoUrl}`);
        }
      } catch (error) {
        console.error('Error fetching hotel details:', error);
        toast({
          title: "Error",
          description: "Failed to load hotel details. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [slug, toast]);

  // Function to render star rating
  const renderStarRating = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
        size={16}
      />
    ));
  };

  // Toggle FAQ
  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? -1 : index);
  };

  // Get booking platform logo
  const getBookingPlatformLogo = (platform) => {
    switch(platform?.toLowerCase()) {
      case 'booking.com':
        return '/uploads/Booking.com.svg';
      case 'airbnb':
        return '/uploads/misc/airbnb-logo.png';
      case 'expedia':
        return '/uploads/misc/expedia-logo.png';
      default:
        return null;
    }
  };

  // Hotel FAQs
  const faqs = [
    {
      question: "What are the check-in and check-out times?",
      answer: "Standard check-in time is 2:00 PM and check-out time is 11:00 AM. Early check-in or late check-out may be available upon request, subject to availability."
    },
    {
      question: "Is breakfast included in the room rate?",
      answer: "Yes, most of our rates include a complimentary breakfast buffet featuring local products and traditional Greek breakfast items."
    },
    {
      question: "Does the hotel have parking facilities?",
      answer: "Yes, we offer free parking for our guests. However, spaces may be limited during peak season."
    },
    {
      question: "Is there Wi-Fi available at the hotel?",
      answer: "Yes, we provide complimentary high-speed Wi-Fi throughout the hotel property."
    },
    {
      question: "How far is the hotel from the beach?",
      answer: "Our hotel is located approximately 5 minutes walking distance from the nearest beach."
    },
    {
      question: "Are there restaurants nearby?",
      answer: "Yes, there are several excellent restaurants, tavernas, and cafes within walking distance from the hotel."
    },
    {
      question: "Do you have facilities for guests with disabilities?",
      answer: "We have several rooms designed for accessibility and common areas are wheelchair accessible. Please contact us directly for specific requirements."
    },
    {
      question: "How can I get to the hotel from the port?",
      answer: "We offer transfer services from the port upon request. Alternatively, taxis are available at the port, or you can rent a car or scooter."
    }
  ];

  // If loading show spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sifnos-turquoise"></div>
      </div>
    );
  }

  // If hotel not found
  if (!hotel) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-semibold mb-4">Hotel Not Found</h2>
        <p className="mb-6">The hotel you are looking for does not exist or has been removed.</p>
        <Link to="/hotels" className="bg-sifnos-turquoise text-white px-6 py-3 rounded-lg hover:bg-sifnos-deep-blue transition-colors">
          Back to Hotels
        </Link>
      </div>
    );
  }

  // Update the canonical URL and metadata to use the slug
  const hotelSlug = generateHotelUrl(hotel.name);
  const isMeropiRooms = hotel.id === '0c9632b6-db5c-4179-8122-0003896e465e';
  
  // Fixed Google Maps URL for Meropi Rooms
  const meropiMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3780.3010959320573!2d24.67395307627629!3d36.98818015707993!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x149892d141f2e833%3A0x82d07f304d07c20a!2sMeropi%20Rooms%20%26%20Apartments!5e1!3m2!1sen!2sgr!4v1746223266808!5m2!1sen!2sgr";

  return (
    <>
      <SEO 
        title={`${hotel.name} - Hotel in ${hotel.location}, Sifnos Island`}
        description={hotel.short_description || `Discover ${hotel.name} located in ${hotel.location}, Sifnos. Enjoy luxurious accommodations with modern amenities and stunning views of the Aegean Sea.`}
        keywords={[
          'sifnos hotels', 
          hotel.name.toLowerCase(), 
          `${hotel.location.toLowerCase()} accommodation`, 
          'sifnos island hotel', 
          'aegean sea view',
          'greek cyclades hotel'
        ]}
        schemaType="Hotel"
        canonical={`https://hotelssifnos.com/hotels/${hotelSlug}`}
        imageUrl={activeImage ? `https://hotelssifnos.com${activeImage}` : undefined}
      />
      
      {/* Breadcrumb navigation */}
      <div className="bg-white pt-4 pb-2 shadow-sm">
        <div className="page-container">
          <nav className="text-sm breadcrumbs">
            <ul className="flex space-x-2">
              <li><Link to="/" className="text-sifnos-deep-blue hover:text-sifnos-turquoise">Home</Link></li>
              <li className="text-gray-400">/</li>
              <li><Link to="/hotels" className="text-sifnos-deep-blue hover:text-sifnos-turquoise">Hotels</Link></li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-600 truncate max-w-[200px]">{hotel.name}</li>
            </ul>
          </nav>
        </div>
      </div>
      
      {/* Hotel Title Section with Logo - UPDATED FOR BETTER RESPONSIVENESS */}
      <div className="bg-white">
        <div className="page-container py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              {/* Hotel Logo - Updated with better responsive sizing */}
              {hotel.logo_path && (
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden border border-gray-200 bg-white flex items-center justify-center flex-shrink-0">
                  <img 
                    src={`/uploads/hotels/${hotel.logo_path}`} 
                    alt={`${hotel.name} logo`} 
                    className="w-full h-full object-contain p-1"
                    onError={(e) => {
                      console.log(`Error loading logo for hotel ${hotel.id}`);
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </div>
              )}
              
              {/* Hotel name and location - centered on mobile, left-aligned on larger screens */}
              <div className="text-center sm:text-left">
                <h1 className="font-montserrat text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{hotel.name}</h1>
                <div className="flex items-center justify-center sm:justify-start mb-1">
                  <MapPin size={16} className="text-sifnos-turquoise mr-1" />
                  <span className="text-gray-600">{hotel.location}, Sifnos Island</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start">
                  {renderStarRating(hotel.rating)}
                </div>
              </div>
            </div>
            
            {/* Booking Button */}
            <div className="w-full sm:w-auto mt-4 sm:mt-0">
              {hotel.booking_url && hotel.booking_platform ? (
                <Card className="p-2 max-w-xs mx-auto sm:mx-0">
                  <CardContent className="p-2 flex flex-col items-center">
                    {getBookingPlatformLogo(hotel.booking_platform) && (
                      <div className="mb-2 h-8">
                        <img 
                          src={getBookingPlatformLogo(hotel.booking_platform)} 
                          alt={hotel.booking_platform} 
                          className="h-full object-contain"
                        />
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground mb-2">Sponsored</div>
                    <a 
                      href={hotel.booking_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full"
                    >
                      <Button variant="default" className="w-full bg-sifnos-turquoise hover:bg-sifnos-deep-blue">
                        Book Now
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ) : (
                <Button variant="default" className="w-full sm:w-auto bg-sifnos-turquoise hover:bg-sifnos-deep-blue">
                  Request Availability
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Photo Gallery */}
      <div className="bg-gray-50 py-8">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Main large image */}
            <div className="md:col-span-2 rounded-lg overflow-hidden aspect-video">
              <img 
                src={activeImage || '/placeholder.svg'} 
                alt={hotel.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnails */}
            <div className="grid grid-cols-3 md:grid-cols-2 gap-2 h-full">
              {hotel.hotel_photos?.slice(0, 4).map((photo, index) => (
                <div 
                  key={photo.id} 
                  className={`rounded-lg overflow-hidden aspect-square cursor-pointer border-2 ${activeImage === `/uploads/hotels/${photo.photo_url}` ? 'border-sifnos-turquoise' : 'border-transparent'}`}
                  onClick={() => setActiveImage(`/uploads/hotels/${photo.photo_url}`)}
                >
                  <img 
                    src={`/uploads/hotels/${photo.photo_url}`} 
                    alt={photo.description || `${hotel.name} - Photo ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {hotel.hotel_photos?.length > 4 && (
                <div 
                  className="rounded-lg overflow-hidden aspect-square relative cursor-pointer bg-gray-800"
                  onClick={() => setActiveImage(`/uploads/hotels/${hotel.hotel_photos[4].photo_url}`)}
                >
                  <img 
                    src={`/uploads/hotels/${hotel.hotel_photos[4].photo_url}`}
                    alt={`${hotel.name} - More Photos`}
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-white font-medium">
                    +{hotel.hotel_photos.length - 4} more
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Hotel Details */}
      <div className="py-10">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Description & Amenities */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Description */}
              <div className="cycladic-card p-6 md:p-8">
                <h2 className="text-2xl font-montserrat font-semibold mb-5">About {hotel.name}</h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed mb-6">
                  {hotel.description}
                </p>
              </div>
              
              {/* Amenities - Updated to show only icons */}
              <div className="cycladic-card p-6 md:p-8">
                <h2 className="text-2xl font-montserrat font-semibold mb-5">Hotel Amenities</h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {/* Hotel amenities */}
                  {hotel.hotel_amenities?.map((item) => (
                    <div key={item.amenity} className="flex items-center">
                      <HotelAmenities amenities={[item.amenity]} />
                    </div>
                  ))}
                  
                  {/* Show unique room amenities that aren't already in hotel_amenities */}
                  {hotel.hotel_rooms?.flatMap(room => room.amenities || [])
                    .filter((amenity, index, self) => 
                      // Filter unique amenities
                      self.indexOf(amenity) === index && 
                      // Filter out amenities that are already in hotel_amenities
                      !hotel.hotel_amenities?.some(item => 
                        item.amenity.toLowerCase() === amenity.toLowerCase()
                      )
                    )
                    .map((roomAmenity) => (
                      <div key={`room-${roomAmenity}`} className="flex items-center">
                        <HotelAmenities amenities={[roomAmenity]} />
                      </div>
                    ))
                  }
                </div>
              </div>
              
              {/* Rooms - Updated with larger images and enhanced amenities display */}
              <div className="cycladic-card p-6 md:p-8">
                <h2 className="text-2xl font-montserrat font-semibold mb-6">Available Rooms</h2>
                <div className="space-y-10">
                  {hotel.hotel_rooms?.map((room) => (
                    <div key={room.id} className="border-b pb-8 last:border-b-0 last:pb-0">
                      <div className="flex flex-col gap-6">
                        {/* Larger Room Image */}
                        <div className="w-full">
                          <img 
                            src={getHotelRoomImagePath(room.photo_url, hotel.name)}
                            alt={room.name} 
                            className="w-full h-60 md:h-72 object-cover rounded-lg shadow-md"
                          />
                        </div>
                        
                        <div className="w-full">
                          <h3 className="text-xl font-semibold">{room.name}</h3>
                          
                          <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Users size={16} className="mr-1 flex-shrink-0" />
                              Up to {room.capacity} guests
                            </div>
                            {room.size_sqm && (
                              <div className="flex items-center">
                                <span className="mr-1">☐</span>
                                {room.size_sqm} m²
                              </div>
                            )}
                          </div>
                          
                          <p className="mt-3 text-gray-700">{room.description}</p>
                          
                          {/* Room Amenities - Enhanced with icons */}
                          {room.amenities && room.amenities.length > 0 && (
                            <div className="mt-4">
                              <p className="text-sm font-medium mb-2">Room Features:</p>
                              <HotelAmenities amenities={room.amenities} />
                            </div>
                          )}
                          
                          <div className="mt-6">
                            {hotel.booking_url ? (
                              <a 
                                href={hotel.booking_url} 
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button className="bg-sifnos-turquoise hover:bg-sifnos-deep-blue text-white">
                                  Check Availability
                                </Button>
                              </a>
                            ) : (
                              <Button className="bg-sifnos-turquoise hover:bg-sifnos-deep-blue text-white">
                                Check Availability
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* FAQs */}
              <div className="cycladic-card p-6 md:p-8">
                <h2 className="text-2xl font-montserrat font-semibold mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div 
                      key={index} 
                      className="border-b pb-4 last:border-b-0 last:pb-0"
                    >
                      <button 
                        className="flex justify-between items-center w-full text-left font-medium text-gray-800 py-2"
                        onClick={() => toggleFaq(index)}
                      >
                        <span>{faq.question}</span>
                        {openFaqIndex === index ? (
                          <MinusCircle size={18} className="text-sifnos-turquoise flex-shrink-0" />
                        ) : (
                          <PlusCircle size={18} className="text-sifnos-turquoise flex-shrink-0" />
                        )}
                      </button>
                      
                      {openFaqIndex === index && (
                        <div className="mt-2 text-gray-600 pl-2">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Reviews - Only Booking.com Reviews */}
              <div className="cycladic-card p-6 md:p-8">
                <h2 className="text-2xl font-montserrat font-semibold mb-6">Reviews</h2>
                {isMeropiRooms && <BookingReviews hotelId={hotel.id} />}
                
                {!isMeropiRooms && (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No reviews available for this hotel.</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Right Column - Booking Card & Contact Info */}
            <div className="space-y-6">
              
              {/* Booking Card */}
              <div className="cycladic-card p-6">
                <h3 className="text-xl font-semibold mb-4">Request Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sifnos-turquoise"
                      />
                      <Calendar size={16} className="absolute left-3 top-3 text-gray-400" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sifnos-turquoise"
                      />
                      <Calendar size={16} className="absolute left-3 top-3 text-gray-400" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                    <div className="relative">
                      <select
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sifnos-turquoise appearance-none"
                      >
                        <option>1 Adult</option>
                        <option>2 Adults</option>
                        <option>2 Adults, 1 Child</option>
                        <option>2 Adults, 2 Children</option>
                      </select>
                      <Users size={16} className="absolute left-3 top-3 text-gray-400" />
                    </div>
                  </div>
                  
                  {hotel.booking_url ? (
                    <a 
                      href={hotel.booking_url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full"
                    >
                      <Button className="w-full bg-sifnos-turquoise hover:bg-sifnos-deep-blue">
                        Check Availability
                      </Button>
                    </a>
                  ) : (
                    <Button className="w-full bg-sifnos-turquoise hover:bg-sifnos-deep-blue">
                      Request Information
                    </Button>
                  )}

                  {/* Sponsored badge if booking is available */}
                  {hotel.booking_url && hotel.booking_platform && (
                    <div className="flex items-center justify-center space-x-2 pt-2">
                      <Separator className="flex-1" />
                      <span className="text-xs text-gray-400">Sponsored by</span>
                      <Separator className="flex-1" />
                      {getBookingPlatformLogo(hotel.booking_platform) && (
                        <img 
                          src={getBookingPlatformLogo(hotel.booking_platform)}
                          alt={hotel.booking_platform}
                          className="h-5 object-contain"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Contact Info */}
              <div className="cycladic-card p-6">
                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                <div className="space-y-3">
                  {hotel.address && (
                    <div className="flex items-start">
                      <MapPin size={18} className="text-sifnos-turquoise mr-2 mt-1 flex-shrink-0" />
                      <span>{hotel.address}</span>
                    </div>
                  )}
                  
                  {hotel.phone && (
                    <div className="flex items-center">
                      <Phone size={18} className="text-sifnos-turquoise mr-2 flex-shrink-0" />
                      <a href={`tel:${hotel.phone}`} className="hover:text-sifnos-turquoise">{hotel.phone}</a>
                    </div>
                  )}
                  
                  {hotel.email && (
                    <div className="flex items-center">
                      <Mail size={18} className="text-sifnos-turquoise mr-2 flex-shrink-0" />
                      <a href={`mailto:${hotel.email}`} className="hover:text-sifnos-turquoise">{hotel.email}</a>
                    </div>
                  )}
                  
                  {hotel.website && (
                    <div className="flex items-center">
                      <GlobeIcon size={18} className="text-sifnos-turquoise mr-2 flex-shrink-0" />
                      <a href={hotel.website} target="_blank" rel="noopener noreferrer" className="hover:text-sifnos-turquoise">Website</a>
                    </div>
                  )}
                </div>
                
                {/* Social Media Links */}
                <div className="mt-4 flex space-x-3">
                  {hotel.social_facebook && (
                    <a 
                      href={hotel.social_facebook} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 rounded-full hover:bg-sifnos-turquoise/20 transition-colors"
                    >
                      <Facebook size={16} />
                    </a>
                  )}
                  
                  {hotel.social_instagram && (
                    <a 
                      href={hotel.social_instagram} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 rounded-full hover:bg-sifnos-turquoise/20 transition-colors"
                    >
                      <Instagram size={16} />
                    </a>
                  )}
                  
                  {hotel.social_twitter && (
                    <a 
                      href={hotel.social_twitter} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 rounded-full hover:bg-sifnos-turquoise/20 transition-colors"
                    >
                      <Twitter size={16} />
                    </a>
                  )}
                </div>
              </div>
              
              {/* Map section */}
              <div className="cycladic-card p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Map size={18} className="mr-2 text-sifnos-turquoise" />
                  Location
                </h3>
                <div className="h-64 bg-gray-100 rounded-md overflow-hidden shadow-md">
                  <iframe
                    src={isMeropiRooms ? meropiMapUrl : hotel.google_map_url}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`${hotel.name} Location Map`}
                    className="w-full h-full"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="text-xs text-gray-500 mt-2 flex items-center">
                  <MapPin size={12} className="mr-1" />
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.name} ${hotel.location} Sifnos Greece`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sifnos-turquoise hover:underline"
                  >
                    View larger map
                  </a>
                </div>
              </div>
              
              {/* Greece Cyclades Banner */}
              <div className="cycladic-card p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <ExternalLink size={18} className="mr-2 text-sifnos-turquoise" />
                  Explore More
                </h3>
                <a 
                  href="https://greececyclades.com" 
                  target="_blank" 
                  rel="dofollow"
                  className="block overflow-hidden rounded-md shadow-md hover:shadow-lg transition-shadow"
                >
                  <img 
                    src="/uploads/banners/greececyclades-banner.png" 
                    alt="Discover more about Greek Cyclades islands" 
                    className="w-full h-auto transform transition-transform hover:scale-105 duration-300"
                  />
                </a>
                <p className="mt-3 text-sm text-gray-600">
                  Discover more beautiful destinations in the Cyclades islands of Greece.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
