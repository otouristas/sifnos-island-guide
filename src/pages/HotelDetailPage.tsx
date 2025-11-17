import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Calendar, Users, Phone, Mail, GlobeIcon, Facebook, Instagram, Twitter, CheckCircle, PlusCircle, MinusCircle, ExternalLink, Map, ChevronLeft, ChevronRight, Waves, BookOpenCheck, Ship, ArrowRight } from 'lucide-react';
import { supabase, logSupabaseResponse, getHotelRoomImagePath } from '@/integrations/supabase/client';
import SEO from '../components/SEO';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { getHotelBySlug, generateHotelUrl } from '@/lib/url-utils';
import BookingReviews from '@/components/BookingReviews';
import HotelAmenities from '@/components/HotelAmenities';
import HotelFAQs from '@/components/hotel/HotelFAQs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from '@/hooks/use-mobile';
import { ImageGalleryDialog } from '@/components/hotel/ImageGalleryDialog';
import VillaOliviaAvailability from '@/components/hotel/VillaOliviaAvailability';
import { HotelCard, SidebarHotelCard } from '@/components/touristas/HotelDisplay';
import { getBookingPlatformLogo, getSimilarHotels, getHotelLogoUrl } from '@/utils/hotel-utils';
import { determineHotelImageUrl } from '@/utils/image-utils';
import HotelHero from '@/components/hotel/HotelHero';
import WhyChooseHotel from '@/components/hotel/WhyChooseHotel';
import NearbyAttractions from '@/components/hotel/NearbyAttractions';
import GettingHere from '@/components/hotel/GettingHere';
import RelatedContent from '@/components/shared/RelatedContent';
import HotelGallerySection from '@/components/hotel/HotelGallerySection';
import CategorizedAmenities from '@/components/hotel/CategorizedAmenities';
import HotelBookingSection from '@/components/hotel/HotelBookingSection';
import HotelBookingSidebar from '@/components/hotel/HotelBookingSidebar';

export default function HotelDetailPage() {
  const { slug } = useParams();
  const [hotel, setHotel] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState(-1);
  const [similarHotels, setSimilarHotels] = useState([]);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Define the hotel photos for Meropi
  const meropiPhotos = [
    { id: '1', photo_url: 'meropirooms-hero.webp', is_main_photo: true, description: 'Meropi Rooms Exterior' },
    { id: '2', photo_url: 'meropirooms-one.webp', is_main_photo: false, description: 'Room Interior' },
    { id: '3', photo_url: 'meropirooms-two.webp', is_main_photo: false, description: 'Room View' },
    { id: '4', photo_url: 'meropirooms-three.webp', is_main_photo: false, description: 'Room Balcony' },
    { id: '5', photo_url: 'meropirooms-four.webp', is_main_photo: false, description: 'Room Detail' },
    { id: '6', photo_url: 'meropirooms-bath.webp', is_main_photo: false, description: 'Bathroom' }
  ];
  
  // Define the hotel photos for Filadaki Villas
  const filadakiPhotos = [
    { id: '1', photo_url: 'filadaki-studios/home-page_9151.jpg.jpeg', is_main_photo: true, description: 'Filadaki Villas Exterior' },
    { id: '2', photo_url: 'filadaki-studios/home-page_1441.jpg.jpeg', is_main_photo: false, description: 'Filadaki Villa View' },
    { id: '3', photo_url: 'filadaki-studios/home-page_3125.jpg.jpeg', is_main_photo: false, description: 'Villa Interior' },
    { id: '4', photo_url: 'filadaki-studios/1092_R6414.jpg.jpeg', is_main_photo: false, description: 'Pool Area' },
    { id: '5', photo_url: 'filadaki-studios/home-page_5248.jpg.jpeg', is_main_photo: false, description: 'Villa Exterior' },
    { id: '6', photo_url: 'filadaki-studios/1091_R3305.jpg.jpeg', is_main_photo: false, description: 'Villa Detail' },
    { id: '7', photo_url: 'filadaki-studios/1100_R6185.jpg.jpeg', is_main_photo: false, description: 'Bedroom' },
    { id: '8', photo_url: 'filadaki-studios/1102_R5879.jpg.jpeg', is_main_photo: false, description: 'Bathroom' },
    { id: '9', photo_url: 'filadaki-studios/1103_R4335.jpg.jpeg', is_main_photo: false, description: 'Kitchen' }
  ];
  
  // Define the hotel photos for Morpheas Pension
  const morpheasPhotos = [
    { id: '1', photo_url: 'morpheas-pension/sifnos-accommodation.jpg.jpeg', is_main_photo: true, description: 'Morpheas Pension Exterior' },
    { id: '2', photo_url: 'morpheas-pension/sifnos-morpheas-pension3.jpg.jpeg', is_main_photo: false, description: 'Garden View' },
    { id: '3', photo_url: 'morpheas-pension/sifnos-morpheas-pension4.jpg.jpeg', is_main_photo: false, description: 'Room Interior' },
    { id: '4', photo_url: 'morpheas-pension/sifnos-morpheas-pension5.jpg.jpeg', is_main_photo: false, description: 'Reception Area' },
    { id: '5', photo_url: 'morpheas-pension/sifnos-pension-morfeas.jpg.jpeg', is_main_photo: false, description: 'Building Exterior' },
    { id: '6', photo_url: 'morpheas-pension/sifnos-sunset.jpg.jpeg', is_main_photo: false, description: 'Sunset View' }
  ];
  
  // Define the hotel photos for Villa Olivia Clara
  const villaOliviaPhotos = [
    { id: '1', photo_url: 'villa-olivia-clara/feature-image.jpeg', is_main_photo: true, description: 'Villa Olivia Clara Exterior' },
    { id: '2', photo_url: 'villa-olivia-clara/Villa-Olivia-Clara_001_pool-side-cabana-min-scaled.jpg.jpeg', is_main_photo: false, description: 'Pool Side Cabana' },
    { id: '3', photo_url: 'villa-olivia-clara/villa-olivia-clara_002_view-from-the-pool-cabana.jpg.jpeg', is_main_photo: false, description: 'View from Pool' },
    { id: '4', photo_url: 'villa-olivia-clara/villa-olivia-clara_005_pool-dining-area-at-night.jpg.jpeg', is_main_photo: false, description: 'Pool Dining Area at Night' },
    { id: '5', photo_url: 'villa-olivia-clara/villa-olivia-clara_042_aerial-view-of-villa.jpg.jpeg', is_main_photo: false, description: 'Aerial View of Villa' },
    { id: '6', photo_url: 'villa-olivia-clara/villa-olivia-clara-master-bedroo.webp', is_main_photo: false, description: 'Master Bedroom' }
  ];
  
  // Define room type images for Filadaki Villas - UPDATED with WebP images
  const filadakiRoomImages = {
    "Gregos": "filadaki-studios/gregos_6406.webp",
    "Maistros": "filadaki-studios/maistros_3967.webp",
    "Levantes": "filadaki-studios/levantes_3351.webp", 
    "Ostria": "filadaki-studios/ostria_4857.webp"
  };
  
  // Define room type images for Morpheas Pension
  const morpheasRoomImages = {
    "Studio": "morpheas-pension/studio.webp",
    "Double Room": "morpheas-pension/double-roomwebp.webp",
    "Triple Room": "morpheas-pension/triple.webp",
    "Apartment (4 People)": "morpheas-pension/apartment-4person.webp",
    "Apartment (5 People)": "morpheas-pension/apartment-5person.webp"
  };
  
  // Villa Olivia Clara reviews
  const villaOliviaReviews = [
    {
      id: "vo-1",
      reviewer_name: "Alexis",
      rating: 5,
      comment: "Wonderful stay at the Villa Olivia Clara! The house has a perfect location near Platis Gialos, walking distance, and an amazing view on the bay. The house is clean, big and has a lot of accommodation. Elena made our stay just perfect when we asked for baby equipment and got everything ready for us. Elena is such a great host! It is the 2nd time in 3 years the we book the villa and we should do it again soon for sure.\n\nNo hesitation: the best villa in Sifnos.",
      country: "France",
      date: new Date("2023-09-15"),
      source: "Airbnb"
    },
    {
      id: "vo-2",
      reviewer_name: "Li-Chuen",
      rating: 5,
      comment: "We are family of 5, with three young adult/adolescent children. We have literally had the most magical holiday at Elena's villa. The photos don't even do justice to this incredibly stunning home. The view is breath-taking and it's just 5 min walk to downtown Platis Gialos, where you will find a great beach and many restaurants. Elena's villa is a home, with nothing wanting at all. I actually cannot believe we have had the privilege to stay at this exceptional place.\n\nPlease do not hesitate to book!",
      country: "Canada",
      date: new Date("2023-07-22"),
      source: "Airbnb"
    },
    {
      id: "vo-3",
      reviewer_name: "Savvas",
      rating: 5,
      comment: "We were over the moon with our experience at Villa Olivia Clara in Sifnos Greece. The photos don't even do it justice. When we arrived, we were so surprised to see that it looked even better than the images. There's a high rate sense of style throughout, beautiful design, every corner is a moment. And on top of it all, an incredible view as well! It truly elevated our Sifnos experience.\n\nHighly recommended.",
      country: "Greece",
      date: new Date("2023-08-05"),
      source: "Booking.com"
    }
  ];

  // Define the hotel photos for ALK HOTEL
  const alkHotelPhotos = [
    { id: 'alk-1', photo_url: 'alk-hotel-sifnos/alk-hotel-feature.jpeg', is_main_photo: true, description: 'ALK HOTEL Exterior' },
    { id: 'alk-2', photo_url: 'alk-hotel-sifnos/1.jpg_1.jpeg', is_main_photo: false, description: 'Hotel View' },
    { id: 'alk-3', photo_url: 'alk-hotel-sifnos/3.jpg.jpeg', is_main_photo: false, description: 'Reception Area' },
    { id: 'alk-4', photo_url: 'alk-hotel-sifnos/148.jpg.jpeg', is_main_photo: false, description: 'Room Interior' },
    { id: 'alk-5', photo_url: 'alk-hotel-sifnos/211.jpg.jpeg', is_main_photo: false, description: 'Hotel Grounds' },
    { id: 'alk-6', photo_url: 'alk-hotel-sifnos/image.php_1.jpeg', is_main_photo: false, description: 'Outdoor Area' },
    { id: 'alk-7', photo_url: 'alk-hotel-sifnos/image.php_6.jpeg', is_main_photo: false, description: 'Hotel Detail' }
  ];
  
  // Define room type images for ALK HOTEL
  const alkHotelRoomImages = {
    "Comfort Double Room": "alk-hotel-sifnos/148.jpg.jpeg",
    "Comfort Triple Room": "alk-hotel-sifnos/triple-room.jpeg",
    "Superior Room with Sea View": "alk-hotel-sifnos/superior-sea-view.jpeg",
    "Superior Plus": "alk-hotel-sifnos/superior-plus.jpeg"
  };

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
        
        // Special handling for Filadaki Villas - add photos
        if (hotelData.name === 'Filadaki Villas' || slug === 'filadaki-villas') {
          hotelData.hotel_photos = filadakiPhotos;
          hotelData.logo_path = 'filadaki-studios/filadaki-logo.png';
          
          // Add image paths to room types if they exist
          if (hotelData.hotel_rooms && hotelData.hotel_rooms.length > 0) {
            hotelData.hotel_rooms = hotelData.hotel_rooms.map(room => {
              // Match room by name without "Studio" or "Apartment" suffix
              const roomNameBase = room.name.split(' ')[0];
              if (filadakiRoomImages[roomNameBase]) {
                room.photo_url = filadakiRoomImages[roomNameBase];
              }
              return room;
            });
          }
        }
        
        // Special handling for Morpheas Pension - add photos and room images
        if (hotelData.name === 'Morpheas Pension & Apartments') {
          hotelData.hotel_photos = morpheasPhotos;
          hotelData.logo_path = 'morpheas-pension/logo.png';
          
          // Add image paths to room types if they exist
          if (hotelData.hotel_rooms && hotelData.hotel_rooms.length > 0) {
            hotelData.hotel_rooms = hotelData.hotel_rooms.map(room => {
              if (morpheasRoomImages[room.name]) {
                room.photo_url = morpheasRoomImages[room.name];
              }
              return room;
            });
          }
        }
        
        // Special handling for Villa Olivia Clara - add photos, logo, and room data
        if (hotelData.name === 'Villa Olivia Clara') {
          hotelData.hotel_photos = villaOliviaPhotos;
          hotelData.logo_path = 'villa-olivia-clara/logo-villa-olivia.png';
          
          // Add bedroom information if hotel_rooms doesn't exist or is empty
          if (!hotelData.hotel_rooms || hotelData.hotel_rooms.length === 0) {
            hotelData.hotel_rooms = [{
              id: 'vo-bedroom-1',
              name: 'Bedrooms',
              description: 'Wake up to views of Platis Gialos, the most popular beach in Sifnos',
              photo_url: 'villa-olivia-clara/villa-olivia-clara-master-bedroo.webp',
              capacity: 6,
              amenities: [
                'Air conditioning',
                'King bed',
                'Single bed',
                'Baby crib',
                'Extra pillows and blankets',
                'Weekly linen changes'
              ],
              price: 0, // Adding a default price (can be updated later if needed)
              size_sqm: 120 // Adding an approximate size in square meters
            }];
          }
          
          // Replace Google Maps URL with the provided iframe URL
          hotelData.google_map_url = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3189.346087785213!2d24.720471076274226!3d36.929896260377085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1498f3af72130097%3A0x80714f4ef96841f0!2sVilla%20Olivia%20Clara!5e0!3m2!1sen!2sgr!4v1746535854585!5m2!1sen!2sgr";
        }
        
        // Special handling for ALK HOTEL - add photos and room images
        if (hotelData.name === 'ALK HOTEL™') {
          hotelData.hotel_photos = alkHotelPhotos;
          hotelData.logo_path = 'alk-hotel-sifnos/logo.png';
          
          // Add image paths to room types if they exist
          if (hotelData.hotel_rooms && hotelData.hotel_rooms.length > 0) {
            hotelData.hotel_rooms = hotelData.hotel_rooms.map(room => {
              if (alkHotelRoomImages[room.name]) {
                room.photo_url = alkHotelRoomImages[room.name];
              }
              return room;
            });
          }
          
          // Replace Google Maps URL with the provided iframe URL
          hotelData.google_map_url = "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d50987.850653825975!2d24.682137!3d36.992123!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x149892d0063e93f3%3A0x6ec732a582e2692!2zQUxLIEhPVEVM4oSi!5e0!3m2!1sel!2sus!4v1746620293627!5m2!1sel!2sus";
        }
        
        setHotel(hotelData);
        
        // Set active image to main photo or first photo
        if (hotelData?.hotel_photos?.length > 0) {
          const mainPhoto = hotelData.hotel_photos.find(photo => photo.is_main_photo);
          const photoUrl = mainPhoto ? mainPhoto.photo_url : hotelData.hotel_photos[0].photo_url;
          setActiveImage(`/uploads/hotels/${photoUrl}`);
          setActiveImageIndex(mainPhoto ? hotelData.hotel_photos.indexOf(mainPhoto) : 0);
        }
        
        // Fetch similar hotels based on hotel type
        if (hotelData?.hotel_types?.length > 0) {
          const { data: allHotels, error } = await supabase
            .from('hotels')
            .select('*, hotel_photos(*), hotel_amenities(*)')
            .limit(20);
          
          if (error) {
            console.error('Error fetching hotels for similar hotels:', error);
          } else if (allHotels?.length > 0) {
            // Use the utility function to get similar hotels
            const filteredSimilarHotels = getSimilarHotels(hotelData, allHotels, 3);
            console.log('Similar hotels found:', filteredSimilarHotels.length);
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

  // Function to change the active image
  const handleImageChange = (photoUrl: string, index: number) => {
    setActiveImage(`/uploads/hotels/${photoUrl}`);
    setActiveImageIndex(index);
  };

  // Function to open the full-screen gallery
  const openGallery = (index: number) => {
    setActiveImageIndex(index);
    setGalleryOpen(true);
  };

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
  
  // Check if current hotel is Meropi Rooms, Filadaki Villas, Morpheas Pension, Villa Olivia Clara, or ALK HOTEL
  const isMeropiRooms = hotel.id === '0c9632b6-db5c-4179-8122-0003896e465e';
  const isFiladakiVillas = hotel.name === 'Filadaki Villas' || slug === 'filadaki-villas';
  const isMorpheasPension = hotel.name === 'Morpheas Pension & Apartments';
  const isVillaOliviaClara = hotel.name === 'Villa Olivia Clara';
  const isAlkHotel = hotel.name === 'ALK HOTEL™';
  
  // Fixed Google Maps URLs
  const meropiMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3780.3010959320573!2d24.67395307627629!3d36.98818015707993!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x149892d141f2e833%3A0x82d07f304d07c20a!2sMeropi%20Rooms%20%26%20Apartments!5e1!3m2!1sen!2sgr!4v1746223266808!5m2!1sen!2sgr";
  const filadakiMapUrl = "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12746.806122751592!2d24.66837674455056!3d36.99305700312019!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x149892d3d403b033%3A0x82243ddb15a8b694!2sFiladaki%20Villas!5e0!3m2!1sen!2sgr!4v1746532630259!5m2!1sen!2sgr";
  const morpheasMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3186.83715183455!2d24.67734841229081!3d36.98982017207772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x149892d208a2cf15%3A0xf0ca16e2b551aede!2sMorfeas%20Pension!5e0!3m2!1sen!2sgr!4v1746533638366!5m2!1sen!2sgr";
  const villaOliviaMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3189.346087785213!2d24.720471076274226!3d36.929896260377085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1498f3af72130097%3A0x80714f4ef96841f0!2sVilla%20Olivia%20Clara!5e0!3m2!1sen!2sgr!4v1746535854585!5m2!1sen!2sgr";
  const alkHotelMapUrl = "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d50987.850653825975!2d24.682137!3d36.992123!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x149892d0063e93f3%3A0x6ec732a582e2692!2zQUxLIEhPVEVM4oSi!5e0!3m2!1sel!2sus!4v1746620293627!5m2!1sel!2sus";

  // Render custom reviews for Villa Olivia Clara
  const renderCustomReviews = () => {
    if (!isVillaOliviaClara) return null;
    
    return (
      <div className="space-y-6">
        {villaOliviaReviews.map((review) => (
          <div key={review.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="bg-sifnos-turquoise/20 text-sifnos-deep-blue w-10 h-10 rounded-full flex items-center justify-center font-semibold">
                  {review.reviewer_name.charAt(0)}
                </div>
                <div className="ml-3">
                  <p className="font-medium">{review.reviewer_name}</p>
                  <p className="text-xs text-gray-500">{review.country}</p>
                </div>
              </div>
              <div>
                <div className="flex mb-1">
                  {renderStarRating(review.rating)}
                </div>
                <p className="text-xs text-gray-500 text-right">
                  {new Date(review.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short' 
                  })}
                </p>
              </div>
            </div>
            <p className="text-gray-600 whitespace-pre-line text-sm mt-2">{review.comment}</p>
            {review.source && (
              <div className="flex items-center mt-2 justify-end">
                <span className="text-xs text-gray-400 mr-1">via</span>
                <span className="text-xs font-medium">{review.source}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Special feature list for Villa Olivia Clara bedroom
  const renderBedroomFeatures = () => {
    if (!isVillaOliviaClara) return null;
    
    return (
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Bed Configuration</h4>
          <ul className="space-y-2">
            <li className="flex items-center">
              <CheckCircle size={16} className="text-sifnos-turquoise mr-2" />
              2 king beds (200 x 200)
            </li>
            <li className="flex items-center">
              <CheckCircle size={16} className="text-sifnos-turquoise mr-2" />
              4 single beds (100 x 200)
            </li>
            <li className="flex items-center">
              <CheckCircle size={16} className="text-sifnos-turquoise mr-2" />
              1 baby crib (70 x 130)
            </li>
          </ul>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Comfort Features</h4>
          <ul className="space-y-2">
            <li className="flex items-center">
              <CheckCircle size={16} className="text-sifnos-turquoise mr-2" />
              Air conditioning in all living areas
            </li>
            <li className="flex items-center">
              <CheckCircle size={16} className="text-sifnos-turquoise mr-2" />
              Extra pillows and blankets
            </li>
            <li className="flex items-center">
              <CheckCircle size={16} className="text-sifnos-turquoise mr-2" />
              Linen changes weekly
            </li>
          </ul>
        </div>
      </div>
    );
  };

  // Add the Similar Hotels section with Carousel
  const renderSimilarHotels = () => {
    if (!similarHotels || similarHotels.length === 0) return null;
    
    return (
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-sifnos-deep-blue mb-3">
              Relevant Hotels
            </h2>
            <p className="text-gray-600 text-lg">
              A curated list of the most popular hotels based on different destinations.
            </p>
          </div>
          
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {similarHotels.map((similarHotel) => (
                <CarouselItem key={similarHotel.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="group h-full">
                    <Link 
                      to={`/hotels/${generateHotelUrl(similarHotel.name)}`}
                      className="block h-full"
                    >
                      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col border border-gray-100">
                        {/* Image Section */}
                        <div className="relative w-full h-48 overflow-hidden bg-gray-100">
                          <img 
                            src={determineHotelImageUrl(similarHotel, similarHotel.hotel_photos?.[0]?.photo_url)}
                            alt={similarHotel.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                            style={{ imageRendering: 'auto' }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                          {/* Discount Badge */}
                          {similarHotel.original_price && similarHotel.price && similarHotel.original_price > similarHotel.price && (
                            <div className="absolute top-3 left-3">
                              <span className="bg-gradient-to-r from-sifnos-turquoise to-sifnos-deep-blue text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                Hot Sale!
                              </span>
                            </div>
                          )}
                          {/* Location Badge */}
                          <div className="absolute bottom-3 left-3">
                            <span className="bg-white/95 backdrop-blur-sm text-xs font-semibold px-3 py-1.5 rounded-full text-sifnos-deep-blue shadow-md">
                              {similarHotel.location}
                            </span>
                          </div>
                          {/* Hotel Logo Overlay */}
                          {(() => {
                            const logoUrl = getHotelLogoUrl(similarHotel);
                            return logoUrl ? (
                              <div className="absolute top-3 right-3 w-12 h-12 rounded-lg bg-white/95 backdrop-blur-sm p-1.5 shadow-md flex items-center justify-center">
                                <img 
                                  src={logoUrl} 
                                  alt={`${similarHotel.name} logo`}
                                  className="w-full h-full object-contain"
                                  loading="lazy"
                                  style={{ imageRendering: 'crisp-edges' }}
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              </div>
                            ) : null;
                          })()}
                        </div>
                        
                        {/* Content Section */}
                        <div className="p-4 flex-1 flex flex-col">
                          {/* Rating */}
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {Array(5).fill(0).map((_, i) => (
                                <Star 
                                  key={i}
                                  className={`h-3 w-3 ${i < Math.round(similarHotel.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-600">{similarHotel.rating ? `${similarHotel.rating} Review` : 'New'}</span>
                          </div>
                          
                          <h3 className="font-bold text-lg text-sifnos-deep-blue mb-2 line-clamp-2 group-hover:text-sifnos-turquoise transition-colors">
                            {similarHotel.name}
                          </h3>
                          
                          {/* Hotel Features */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {similarHotel.hotel_amenities?.slice(0, 4).map((amenity: any, idx: number) => (
                              <div key={idx} className="flex items-center gap-1 text-xs text-gray-600">
                                <CheckCircle className="h-3 w-3 text-sifnos-turquoise" />
                                <span>{typeof amenity === 'string' ? amenity : amenity.amenity}</span>
                              </div>
                            ))}
                          </div>
                          
                          {/* Cancellation Policy */}
                          <div className="flex items-center gap-2 mb-3 text-xs text-gray-600">
                            <CheckCircle className="h-3 w-3 text-sifnos-turquoise" />
                            <span>Free Cancellation Policy</span>
                          </div>
                          
                          {/* Price & Book Button */}
                          <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                            <div>
                              {similarHotel.original_price && similarHotel.price && similarHotel.original_price > similarHotel.price && (
                                <span className="text-sm text-gray-400 line-through mr-2">
                                  €{similarHotel.original_price}
                                </span>
                              )}
                              <span className="text-lg font-bold text-sifnos-deep-blue">
                                €{similarHotel.price || 'N/A'}
                              </span>
                            </div>
                            <span className="inline-flex items-center justify-center gap-1 px-4 py-2 bg-gradient-to-r from-sifnos-turquoise to-sifnos-deep-blue hover:from-sifnos-deep-blue hover:to-sifnos-turquoise text-white text-sm font-semibold rounded-md transition-all duration-300 shadow-md hover:shadow-lg">
                              Book Now
                              <ArrowRight className="h-3 w-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 bg-white/90 hover:bg-white border border-gray-200 shadow-lg" />
            <CarouselNext className="right-0 bg-white/90 hover:bg-white border border-gray-200 shadow-lg" />
          </Carousel>
        </div>
      </section>
    );
  };

  // SEO Plan optimized title and description generation
  const generateSeoTitle = () => {
    if (!hotel) return "Hotel Details - Sifnos Island | Hotels Sifnos";
    
    // Extract unique feature from amenities or type
    const uniqueFeatures: Record<string, string> = {
      'Villa': 'Private Pool & Sea Views',
      'Luxury Hotel': 'Infinity Pool & Sunset Views',
      'Boutique Hotel': 'Cycladic Design & Authentic Charm',
      'Beach Hotel': 'Beachfront Access & Sea Views',
      'Family Hotel': 'Family-Friendly & Pool Access'
    };
    
    const feature = uniqueFeatures[hotel.type || ''] || 
                   (hotel.hotel_amenities?.some(a => a.amenity.toLowerCase().includes('pool')) ? 'Pool & Sea Views' : 'Cycladic Charm');
    
    // Formula: [Hotel Name] Sifnos - [Unique Feature] | [Location]
    return `${hotel.name} Sifnos - ${feature} | ${hotel.location}`;
  };
  
  const generateSeoDescription = () => {
    if (!hotel) return "Discover carefully curated Sifnos hotels and villas with sea views, Cycladic charm, and premium amenities for the 2026 season.";
    
    // Extract USP from hotel description or type
    const usp = hotel.description?.substring(0, 100) || 
               `${hotel.name} offers exceptional ${hotel.type?.toLowerCase() || 'accommodation'} in ${hotel.location}`;
    
    // Get 3 key amenities
    const amenities = hotel.hotel_amenities?.slice(0, 3).map(a => a.amenity).join(', ') || 'Premium amenities';
    
    // Social proof
    const socialProof = hotel.rating ? `Rated ${hotel.rating}/5 by verified guests.` : 'Highly rated by travelers.';
    
    // Booking incentive
    const bookingIncentive = 'Book direct for best rates and flexible cancellation.';
    
    // Formula: [Hotel Name] offers [USP]. Features [3 amenities]. Located in [area]. [Social proof]. [Booking incentive].
    return `${hotel.name} offers ${usp}. Features ${amenities}. Located in ${hotel.location}, Sifnos. ${socialProof} ${bookingIncentive}`;
  };

  return (
    <>
      <SEO 
        title={generateSeoTitle()}
        description={generateSeoDescription()}
        keywords={hotel ? [
          hotel.name.toLowerCase(),
          `${hotel.location.toLowerCase()} hotels`,
          'book direct sifnos',
          `luxury ${hotel.type?.toLowerCase() || 'hotel'} sifnos`,
          'sifnos accommodation 2026',
          'cyclades luxury stays',
          `${hotel.location.toLowerCase()} accommodation`,
          'sifnos island hotels',
          'authentic cycladic experience'
        ] : ['sifnos hotels', 'luxury accommodation', 'cyclades hotels']}
        pageType="hotel-detail"
        schemaType={hotel?.type === 'Villa' ? 'Villa' : 'Hotel'}
        canonical={`https://hotelssifnos.com/hotels/${hotel ? generateHotelUrl(hotel.name) : ''}`}
        imageUrl={activeImage ? `https://hotelssifnos.com${activeImage}` : '/uploads/sifnos-og-image.jpg'}
        hotelData={hotel ? {
          name: hotel.name,
          location: hotel.location,
          type: hotel.type || 'Hotel',
          priceRange: hotel.price_range || "€€€",
          rating: hotel.rating,
          amenities: hotel.hotel_amenities?.map(a => a.amenity) || [],
          imageUrl: activeImage ? `https://hotelssifnos.com${activeImage}` : undefined,
          telephone: hotel.phone || "+30-2284-031370"
        } : undefined}
      />
      
      {/* Breadcrumb navigation with logo */}
      <div className="bg-white pt-4 pb-2 shadow-sm">
        <div className="page-container">
          <nav className="text-sm breadcrumbs flex items-center gap-2">
            <ul className="flex space-x-2 items-center">
              <li><Link to="/" className="text-sifnos-deep-blue hover:text-sifnos-turquoise">Home</Link></li>
              <li className="text-gray-400">/</li>
              <li><Link to="/hotels" className="text-sifnos-deep-blue hover:text-sifnos-turquoise">Hotels</Link></li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-600 truncate max-w-[200px] flex items-center gap-2">
                {(() => {
                  const logoUrl = getHotelLogoUrl(hotel);
                  return logoUrl ? (
                    <img 
                      src={logoUrl} 
                      alt={`${hotel?.name} logo`} 
                      className="h-6 w-6 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : null;
                })()}
                <span>{hotel?.name}</span>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      
      {/* New Full-Width Hero Section */}
      <HotelHero
        hotel={hotel}
        activeImage={activeImage}
        onShare={() => {
          if (navigator.share) {
            navigator.share({
              title: `${hotel?.name} - Sifnos Hotels`,
              text: `Check out ${hotel?.name} in ${hotel?.location}, Sifnos`,
              url: window.location.href,
            }).catch(() => {});
          } else {
            navigator.clipboard.writeText(window.location.href);
            toast({
              title: "Link copied!",
              description: "Hotel page link copied to clipboard",
            });
          }
        }}
        onSave={() => {
          // TODO: Implement save to favorites
          toast({
            title: "Saved!",
            description: "Hotel saved to your favorites",
          });
        }}
        onPrint={() => {
          window.print();
        }}
        renderStarRating={renderStarRating}
      />
      
      {/* Enhanced Photo Gallery Section */}
      {hotel && <HotelGallerySection hotel={hotel} onImageClick={(index) => setActiveImageIndex(index)} />}
      
      {/* Hotel Details */}
      <div className="py-10">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Why Choose This Hotel Section */}
              <WhyChooseHotel hotel={hotel} />
              
              {/* Enhanced Description */}
              <div className="cycladic-card p-8 md:p-10 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-12 bg-gradient-to-b from-sifnos-turquoise to-sifnos-deep-blue rounded-full"></div>
                  <h2 className="text-3xl font-montserrat font-bold text-sifnos-deep-blue">About {hotel?.name}</h2>
                </div>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed text-base md:text-lg mb-6">
                    {hotel?.description}
                  </p>
                  {/* Internal linking to location and travel guide */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-3">
                      <strong>Planning your stay?</strong> Discover more about {hotel?.location} and the best things to do in Sifnos.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {hotel?.location && (
                        <Link 
                          to={`/locations/${hotel.location.toLowerCase().replace(/\s+/g, '-')}`}
                          className="text-sm text-sifnos-deep-blue hover:text-sifnos-turquoise hover:underline font-medium"
                        >
                          Explore {hotel.location} →
                        </Link>
                      )}
                      <Link 
                        to="/travel-guide"
                        className="text-sm text-sifnos-deep-blue hover:text-sifnos-turquoise hover:underline font-medium"
                      >
                        Complete Sifnos Travel Guide →
                      </Link>
                      <Link 
                        to="/best-beaches-sifnos-guide"
                        className="text-sm text-sifnos-deep-blue hover:text-sifnos-turquoise hover:underline font-medium"
                      >
                        Best Beaches in Sifnos →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Nearby Attractions Section */}
              <NearbyAttractions hotel={hotel} />
              
              {/* Getting Here Section */}
              <GettingHere hotel={hotel} />
              
              {/* Categorized Amenities Section */}
              <div className="cycladic-card p-8 md:p-10 shadow-lg border border-gray-100">
                {hotel && <CategorizedAmenities hotel={hotel} />}
              </div>
              
              {/* Availability Calendar for Villa Olivia Clara */}
              {isVillaOliviaClara && <VillaOliviaAvailability />}
              
              {/* Booking & Availability Section */}
              {hotel && <HotelBookingSection hotel={hotel} />}
              
              {/* Reviews - Booking.com Reviews or Custom Reviews */}
              <div className="cycladic-card p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-12 bg-gradient-to-b from-sifnos-turquoise to-sifnos-deep-blue rounded-full"></div>
                  <h2 className="text-3xl font-montserrat font-bold text-sifnos-deep-blue">Reviews</h2>
                </div>
                {/* Show custom reviews for Villa Olivia Clara */}
                {isVillaOliviaClara && renderCustomReviews()}
                
                {/* Show reviews from BookingReviews component for other hotels */}
                {(isMeropiRooms || isFiladakiVillas || isMorpheasPension || isAlkHotel) && <BookingReviews hotelId={hotel.id} />}
                
                {!isMeropiRooms && !isFiladakiVillas && !isMorpheasPension && !isVillaOliviaClara && !isAlkHotel && (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No reviews available for this hotel.</p>
                  </div>
                )}
              </div>
              
              {/* FAQs */}
              <div className="cycladic-card p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-12 bg-gradient-to-b from-sifnos-turquoise to-sifnos-deep-blue rounded-full"></div>
                  <h2 className="text-3xl font-montserrat font-bold text-sifnos-deep-blue">Frequently Asked Questions</h2>
                </div>
                {hotel && <HotelFAQs hotelName={hotel.name} />}
              </div>
            </div>
            
            {/* Right Column - Booking Sidebar & Contact Info */}
            <div className="space-y-6">
              {hotel && (
                <div className="lg:sticky lg:top-24 lg:z-10 lg:self-start">
                  <HotelBookingSidebar 
                    hotel={hotel}
                    onCheckAvailability={() => {
                      const bookingSection = document.getElementById('booking-section');
                      if (bookingSection) {
                        bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    onEnquiry={() => {
                      // TODO: Implement enquiry modal
                      toast({
                        title: "Enquiry",
                        description: "Enquiry form coming soon",
                      });
                    }}
                  />
                </div>
              )}
              
              {/* Contact Information */}
              <div className="cycladic-card p-6 lg:relative lg:z-0">
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
                
                {/* Social Media Links */}
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
              
              {/* Map section - Updated with hotel-specific map URLs */}
              <div className="cycladic-card p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Map size={18} className="mr-2 text-sifnos-turquoise" />
                  Location
                </h3>
                <div className="h-64 bg-gray-100 rounded-md overflow-hidden shadow-md">
                  <iframe
                    src={
                      isVillaOliviaClara ? villaOliviaMapUrl :
                      isMorpheasPension ? morpheasMapUrl : 
                      isFiladakiVillas ? filadakiMapUrl : 
                      isMeropiRooms ? meropiMapUrl : 
                      isAlkHotel ? alkHotelMapUrl : 
                      hotel?.google_map_url
                    }
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
      
      {/* Add the similar hotels section */}
      {renderSimilarHotels()}
      
      {/* Related Content Section - Internal Linking */}
      {hotel && hotel.location && (
        <RelatedContent
          title="Continue Exploring Sifnos"
          items={[
            {
              title: `Hotels in ${hotel.location}`,
              url: `/locations/${hotel.location.toLowerCase().replace(/\s+/g, '-')}`,
              description: `Discover more accommodations in ${hotel.location}`,
              type: 'location' as const
            },
            {
              title: hotel.hotel_types?.[0] || 'Similar Hotels',
              url: hotel.hotel_types?.[0] ? `/hotel-types/${hotel.hotel_types[0].toLowerCase().replace(/\s+/g, '-')}` : '/hotels',
              description: `Browse all ${hotel.hotel_types?.[0] || 'similar'} hotels in Sifnos`,
              type: 'hotel-type' as const
            },
            {
              title: 'Complete Travel Guide',
              url: '/travel-guide',
              description: 'Everything you need to know about Sifnos',
              type: 'guide' as const
            },
            {
              title: 'Best Beaches Guide',
              url: '/best-beaches-sifnos-guide',
              description: 'Discover the most beautiful beaches in Sifnos',
              type: 'guide' as const
            },
            {
              title: 'Ferry Tickets',
              url: '/ferry-tickets',
              description: 'Book your ferry to Sifnos',
              type: 'ferry' as const
            }
          ].filter(item => item.url)}
          columns={3}
        />
      )}
    </>
  );
}
