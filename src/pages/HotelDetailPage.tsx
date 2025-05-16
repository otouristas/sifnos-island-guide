import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Calendar, Users, Phone, Mail, GlobeIcon, Facebook, Instagram, Twitter, CheckCircle, ExternalLink, Map } from 'lucide-react';
import { supabase, getHotelBySlug } from '@/integrations/supabase/client';
import SEO from '../components/SEO';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import BookingReviews from '@/components/BookingReviews';
import HotelAmenities from '@/components/HotelAmenities';
import HotelFAQs from '@/components/hotel/HotelFAQs';
import { useIsMobile } from '@/hooks/use-mobile';
import { ImageGalleryDialog } from '@/components/hotel/ImageGalleryDialog';
import { HotelCard, SidebarHotelCard } from '@/components/touristas/HotelDisplay';
import { getBookingPlatformLogo, getSimilarHotels } from '@/utils/hotel-utils';

export default function HotelDetailPage() {
  const { slug } = useParams();
  const [hotel, setHotel] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [similarHotels, setSimilarHotels] = useState([]);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        if (!slug) return;

        const hotelData = await getHotelBySlug(slug);

        if (!hotelData) {
          toast({
            title: "Hotel not found",
            description: "We couldn't find the hotel you're looking for.",
            variant: "destructive"
          });
          return;
        }

        setHotel(hotelData);

        if (hotelData?.hotel_photos?.length > 0) {
          const mainPhoto = hotelData.hotel_photos.find(photo => photo.is_main_photo);
          const photoUrl = mainPhoto ? mainPhoto.photo_url : hotelData.hotel_photos[0].photo_url;
          setActiveImage(`/uploads/hotels/${photoUrl}`);
          setActiveImageIndex(mainPhoto ? hotelData.hotel_photos.indexOf(mainPhoto) : 0);
        }

        if (hotelData?.hotel_types?.length > 0) {
          const { data: allHotels, error } = await supabase
            .from('hotels')
            .select('*, hotel_photos(*), hotel_amenities(*)')
            .limit(20);

          if (error) {
            console.error('Error fetching hotels for similar hotels:', error);
          } else if (allHotels?.length > 0) {
            const filteredSimilarHotels = getSimilarHotels(hotelData, allHotels, 3);
            setSimilarHotels(filteredSimilarHotels);
          }
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

  const renderSimilarHotelsInSidebar = () => {
    if (!similarHotels || similarHotels.length === 0) return null;

    return (
      <div className="cycladic-card p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Star size={18} className="mr-2 text-sifnos-turquoise" />
          Similar Hotels
        </h3>
        <div className="space-y-3">
          {similarHotels.slice(0, 3).map((similarHotel) => (
            <SidebarHotelCard 
              key={similarHotel.id} 
              hotel={similarHotel} 
              compact={true}
              showViewButton={true}
            />
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link 
            to={`/hotels?type=${encodeURIComponent(hotel?.hotel_types?.[0] || '')}&location=${encodeURIComponent(hotel?.location || '')}`}
            className="text-xs text-sifnos-deep-blue hover:text-sifnos-turquoise flex items-center justify-center"
          >
            View more similar hotels
            <ExternalLink size={12} className="ml-1" />
          </Link>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sifnos-turquoise"></div>
      </div>
    );
  }

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

  const hotelSlug = hotel.name.replace(/\s+/g, '-').toLowerCase();

  return (
    <>
      <SEO 
        title={`${hotel?.name} - Hotel in ${hotel?.location}, Sifnos Island`}
        description={hotel?.short_description || `Discover ${hotel?.name} located in ${hotel?.location}, Sifnos. Enjoy luxurious accommodations with modern amenities and stunning views of the Aegean Sea.`}
        keywords={[
          'sifnos hotels', 
          hotel?.name.toLowerCase(), 
          `${hotel?.location.toLowerCase()} accommodation`, 
          'sifnos island hotel', 
          'aegean sea view',
          'greek cyclades hotel'
        ]}
        schemaType="Hotel"
        canonical={`https://hotelssifnos.com/hotels/${hotelSlug}`}
        imageUrl={activeImage ? `https://hotelssifnos.com${activeImage}` : '/uploads/sifnos-og-image.jpg'}
      />
      
      <div className="bg-white pt-4 pb-2 shadow-sm">
        <div className="page-container">
          <nav className="text-sm breadcrumbs">
            <ul className="flex space-x-2">
              <li><Link to="/" className="text-sifnos-deep-blue hover:text-sifnos-turquoise">Home</Link></li>
              <li className="text-gray-400">/</li>
              <li><Link to="/hotels" className="text-sifnos-deep-blue hover:text-sifnos-turquoise">Hotels</Link></li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-600 truncate max-w-[200px]">{hotel?.name}</li>
            </ul>
          </nav>
        </div>
      </div>
      
      <div className="bg-white">
        <div className="page-container py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className={`${isMobile ? 'w-full flex flex-col items-center text-center' : 'flex flex-col sm:flex-row items-center sm:items-start'} gap-4`}>
              {hotel?.logo_path && (
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
              
              <div className={isMobile ? "text-center" : "text-center sm:text-left"}>
                <h1 className="font-montserrat text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{hotel?.name}</h1>
                <div className={`flex items-center ${isMobile ? 'justify-center' : 'justify-center sm:justify-start'} mb-1`}>
                  <MapPin size={16} className="text-sifnos-turquoise mr-1" />
                  <span className="text-gray-600">{hotel?.location}, Sifnos Island</span>
                </div>
                <div className={`flex items-center ${isMobile ? 'justify-center' : 'justify-center sm:justify-start'}`}>
                  {hotel && hotel.rating ? Array(5).fill(0).map((_, i) => (
                    <Star 
                      key={i} 
                      className={i < hotel.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
                      size={16}
                    />
                  )) : null}
                </div>
              </div>
            </div>
            
            <div className={`${isMobile ? 'w-full flex justify-center' : 'w-full sm:w-auto'} mt-4 sm:mt-0`}>
              {hotel?.booking_url && hotel?.booking_platform ? (
                <Card className={`p-2 ${isMobile ? 'max-w-xs mx-auto' : 'max-w-xs mx-auto sm:mx-0'}`}>
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
                <Button variant="default" className={`${isMobile ? 'w-full max-w-xs' : 'w-full sm:w-auto'} bg-sifnos-turquoise hover:bg-sifnos-deep-blue`}>
                  Request Availability
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 py-8">
        <div className="page-container">
          <div className="space-y-4">
            <div 
              className="rounded-lg overflow-hidden aspect-video shadow-md relative cursor-pointer"
              onClick={() => setGalleryOpen(true)}
            >
              <img 
                src={activeImage || '/placeholder.svg'} 
                alt={hotel?.name} 
                className="w-full h-full object-cover"
              />
              
              {isMobile && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="bg-black/50 text-white text-sm py-1.5 px-3 rounded-full">
                    Tap to view gallery
                  </div>
                </div>
              )}
            </div>
            
            {/* Similar Hotels Section in Sidebar */}
            {renderSimilarHotelsInSidebar()}
          </div>
        </div>
      </div>
      
      {hotel?.hotel_photos && (
        <ImageGalleryDialog
          images={hotel.hotel_photos}
          activeImageIndex={activeImageIndex}
          isOpen={galleryOpen}
          onClose={() => setGalleryOpen(false)}
          hotelName={hotel.name}
        />
      )}
      
      <div className="py-10">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="cycladic-card p-6 md:p-8">
                <h2 className="text-2xl font-montserrat font-semibold mb-5">About {hotel?.name}</h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed mb-6">
                  {hotel?.description}
                </p>
              </div>
              
              <div className="cycladic-card p-6 md:p-8">
                <h2 className="text-2xl font-montserrat font-semibold mb-5">Hotel Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {hotel?.hotel_amenities?.map((item) => (
                    <div key={item.amenity} className="flex items-center">
                      <HotelAmenities amenities={[item.amenity]} />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="cycladic-card p-6 md:p-8">
                <h2 className="text-2xl font-montserrat font-semibold mb-6">Frequently Asked Questions</h2>
                {hotel && <HotelFAQs hotelName={hotel.name} />}
              </div>
              
              <div className="cycladic-card p-6 md:p-8">
                <h2 className="text-2xl font-montserrat font-semibold mb-6">Reviews</h2>
                <BookingReviews hotelId={hotel.id} />
              </div>
            </div>
            
            <div className="space-y-6">
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
                  
                  <Button className="w-full bg-sifnos-turquoise hover:bg-sifnos-deep-blue">
                    Request Information
                  </Button>
                </div>
              </div>
              
              <div className="cycladic-card p-6">
                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                <div className="space-y-3">
                  {hotel?.address && (
                    <div className="flex items-start">
                      <MapPin size={18} className="text-sifnos-turquoise mr-2 mt-1 flex-shrink-0" />
                      <span>{hotel.address}</span>
                    </div>
                  )}
                  
                  {hotel?.phone && (
                    <div className="flex items-center">
                      <Phone size={18} className="text-sifnos-turquoise mr-2 flex-shrink-0" />
                      <a href={`tel:${hotel.phone}`} className="hover:text-sifnos-turquoise">{hotel.phone}</a>
                    </div>
                  )}
                  
                  {hotel?.email && (
                    <div className="flex items-center">
                      <Mail size={18} className="text-sifnos-turquoise mr-2 flex-shrink-0" />
                      <a href={`mailto:${hotel.email}`} className="hover:text-sifnos-turquoise">{hotel.email}</a>
                    </div>
                  )}
                  
                  {hotel?.website && (
                    <div className="flex items-center">
                      <GlobeIcon size={18} className="text-sifnos-turquoise mr-2 flex-shrink-0" />
                      <a href={hotel.website} target="_blank" rel="noopener noreferrer" className="hover:text-sifnos-turquoise">Website</a>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 flex space-x-3">
                  {hotel?.social_facebook && (
                    <a 
                      href={hotel.social_facebook} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 rounded-full hover:bg-sifnos-turquoise/20 transition-colors"
                    >
                      <Facebook size={16} />
                    </a>
                  )}
                  
                  {hotel?.social_instagram && (
                    <a 
                      href={hotel.social_instagram} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 rounded-full hover:bg-sifnos-turquoise/20 transition-colors"
                    >
                      <Instagram size={16} />
                    </a>
                  )}
                  
                  {hotel?.social_twitter && (
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
              
              <div className="cycladic-card p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Map size={18} className="mr-2 text-sifnos-turquoise" />
                  Location
                </h3>
                <div className="h-64 bg-gray-100 rounded-md overflow-hidden shadow-md">
                  <iframe
                    src={hotel?.google_map_url}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`${hotel?.name} Location Map`}
                    className="w-full h-full"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="text-xs text-gray-500 mt-2 flex items-center">
                  <MapPin size={12} className="mr-1" />
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel?.name} ${hotel?.location} Sifnos Greece`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sifnos-turquoise hover:underline"
                  >
                    View larger map
                  </a>
                </div>
              </div>
              
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
      
      {/* Add the similar hotels section just before the closing tag */}
      {renderSimilarHotels()}
      
      {/* Add similar hotels grid section for mobile users */}
      {similarHotels.length > 0 && isMobile && (
        <div className="bg-gray-50 py-8">
          <div className="page-container">
            <h2 className="text-2xl font-montserrat font-semibold mb-5">Similar Hotels You May Like</h2>
            <p className="text-gray-600 mb-6">Explore other {hotel?.hotel_types?.[0]?.toLowerCase()} in Sifnos</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {similarHotels.map((similarHotel) => (
                <div key={similarHotel.id}>
                  <HotelCard hotel={similarHotel} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
