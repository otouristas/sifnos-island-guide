import { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { Search, MapPin, Hotel, Anchor, Calendar } from 'lucide-react';
import { supabase, logSupabaseResponse } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { generateHotelUrl } from '@/lib/url-utils';

export default function HomePage() {
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchFeaturedHotels() {
      try {
        console.log("Fetching featured hotels...");
        
        const { data, error } = await supabase
          .from('hotels')
          .select(`
            *,
            hotel_photos(photo_url, is_main_photo)
          `)
          .order('rating', { ascending: false })
          .limit(3);

        // Log the response for debugging
        const success = logSupabaseResponse('featured hotels fetch', data, error);
        
        if (!success) {
          throw error;
        }
        
        setFeaturedHotels(data || []);
      } catch (error) {
        console.error('Error fetching hotels:', error);
        toast({
          title: "Error",
          description: "Failed to load featured hotels. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedHotels();
  }, [toast]);

  // Helper function to get main photo URL
  const getMainPhotoUrl = (hotel) => {
    if (hotel?.hotel_photos && hotel.hotel_photos.length > 0) {
      const mainPhoto = hotel.hotel_photos.find(photo => photo.is_main_photo);
      if (mainPhoto) return `/uploads/hotels/${mainPhoto.photo_url}`;
      if (hotel.hotel_photos[0]?.photo_url) return `/uploads/hotels/${hotel.hotel_photos[0].photo_url}`;
    }
    return '/placeholder.svg';
  };

  const popularBeaches = [
    {
      name: 'Platis Gialos',
      description: 'Long sandy beach with clear waters and excellent facilities for families',
      imagePath: '/uploads/beaches/platis-gialos.jpg'
    },
    {
      name: 'Vathi',
      description: 'Sheltered bay with calm waters, perfect for swimming and relaxation',
      imagePath: '/uploads/beaches/vathi.jpg'
    },
    {
      name: 'Chrysopigi',
      description: 'Iconic beach with monastery views and crystal clear waters',
      imagePath: '/uploads/beaches/chrysopigi.jpg'
    }
  ];
  
  return (
    <>
      <SEO 
        title="Hotels Sifnos - Find the Best Accommodations in Sifnos Island, Greece" 
        description="Discover handpicked accommodations in Sifnos Island, Greece. Best prices guaranteed for luxury hotels, boutique stays, and traditional Cycladic houses with sea views. Your perfect Greek island vacation starts here."
        keywords={['sifnos hotels', 'hotels in sifnos', 'best hotels sifnos', 'sifnos accommodation', 'sifnos island', 'greek islands hotels', 'cyclades accommodations', 'luxury sifnos resorts', 'boutique hotels sifnos']}
        canonical="https://hotelssifnos.com"
      />
      
      {/* Hero Section */}
      <div className="relative h-[70vh] hero-image bg-sifnos-deep-blue flex items-center justify-center">
        <div className="text-center text-white z-10 px-4">
          <h1 className="font-montserrat text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-up">
            Discover Sifnos Island
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Find the perfect accommodation for your dream Greek island vacation
          </p>
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 max-w-4xl mx-auto animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                <label className="block text-gray-700 text-sm font-bold mb-2">Where</label>
                <div className="flex items-center bg-gray-100 rounded-lg px-4 py-3">
                  <MapPin size={18} className="text-sifnos-turquoise mr-2" />
                  <input
                    type="text"
                    placeholder="Anywhere in Sifnos"
                    className="bg-transparent w-full focus:outline-none text-gray-700"
                  />
                </div>
              </div>
              <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                <label className="block text-gray-700 text-sm font-bold mb-2">Check-in / Check-out</label>
                <div className="flex items-center bg-gray-100 rounded-lg px-4 py-3">
                  <Calendar size={18} className="text-sifnos-turquoise mr-2" />
                  <input
                    type="text"
                    placeholder="Add dates"
                    className="bg-transparent w-full focus:outline-none text-gray-700"
                  />
                </div>
              </div>
              <div className="w-full md:w-1/3 px-2 flex items-end">
                <button className="w-full bg-sifnos-deep-blue hover:bg-sifnos-turquoise text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300">
                  <Search size={18} className="inline mr-2" />
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Introduction Section */}
      <section className="py-12 bg-white">
        <div className="page-container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-montserrat font-bold text-sifnos-deep-blue mb-6">Welcome to Hotels Sifnos</h2>
            <div className="prose prose-lg mx-auto text-gray-700">
              <p className="mb-4">
                Nestled in the heart of the Cyclades archipelago, Sifnos is a gem of the Aegean Sea, renowned for its 
                traditional Cycladic architecture, exceptional cuisine, and pristine beaches. Our curated selection of 
                accommodations offers the perfect base to explore this enchanting island.
              </p>
              <p>
                Whether you're seeking a luxury beachfront resort, a charming boutique hotel in one of Sifnos' picturesque villages, 
                or a traditional Cycladic house with spectacular sea views, Hotels Sifnos helps you find the perfect place to stay. 
                Experience the authentic Greek hospitality and the relaxed island lifestyle that makes Sifnos a favorite destination 
                for discerning travelers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="page-container">
          <h2 className="section-title mx-auto text-center">Explore Sifnos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <Link to="/hotels" className="cycladic-card p-6 text-center hover:bg-gray-50 transition-colors group">
              <div className="w-16 h-16 bg-sifnos-teal/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-sifnos-turquoise/30 transition-colors">
                <Hotel size={30} className="text-sifnos-deep-blue" />
              </div>
              <h3 className="font-montserrat font-semibold text-xl mb-2">Hotels</h3>
              <p className="text-gray-600">Luxury and boutique hotels with stunning views of the Aegean Sea</p>
            </Link>
            
            <Link to="/beaches" className="cycladic-card p-6 text-center hover:bg-gray-50 transition-colors group">
              <div className="w-16 h-16 bg-sifnos-teal/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-sifnos-turquoise/30 transition-colors">
                <Anchor size={30} className="text-sifnos-deep-blue" />
              </div>
              <h3 className="font-montserrat font-semibold text-xl mb-2">Beaches</h3>
              <p className="text-gray-600">Discover the most beautiful beaches and hidden coves of Sifnos</p>
            </Link>
            
            <Link to="/travel-guide" className="cycladic-card p-6 text-center hover:bg-gray-50 transition-colors group">
              <div className="w-16 h-16 bg-sifnos-teal/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-sifnos-turquoise/30 transition-colors">
                <MapPin size={30} className="text-sifnos-deep-blue" />
              </div>
              <h3 className="font-montserrat font-semibold text-xl mb-2">Travel Guide</h3>
              <p className="text-gray-600">Essential travel information and insider tips for your Sifnos vacation</p>
            </Link>
            
            <Link to="/about-us" className="cycladic-card p-6 text-center hover:bg-gray-50 transition-colors group">
              <div className="w-16 h-16 bg-sifnos-teal/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-sifnos-turquoise/30 transition-colors">
                <Hotel size={30} className="text-sifnos-deep-blue" />
              </div>
              <h3 className="font-montserrat font-semibold text-xl mb-2">About Us</h3>
              <p className="text-gray-600">Learn about our mission to provide the best accommodation options in Sifnos</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Hotels Section */}
      <section className="py-16">
        <div className="page-container">
          <h2 className="section-title">Featured Hotels</h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sifnos-turquoise"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {featuredHotels.length > 0 ? (
                featuredHotels.map(hotel => (
                  <div key={hotel.id} className="cycladic-card overflow-hidden">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={getMainPhotoUrl(hotel)} 
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.log(`Error loading image for hotel ${hotel.id}`);
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-montserrat font-semibold text-lg">{hotel.name}</h3>
                        <div className="bg-sifnos-deep-blue text-white px-2 py-1 rounded text-sm">
                          {hotel.rating}/5
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600 mb-4">
                        <MapPin size={16} className="mr-1" />
                        <span>{hotel.location}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Link to={`/hotels/${generateHotelUrl(hotel.name, hotel.id)}`} className="bg-sifnos-turquoise hover:bg-sifnos-deep-blue text-white px-4 py-2 rounded-lg transition-colors duration-300 text-sm font-medium">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-500">No featured hotels available at the moment.</p>
                </div>
              )}
            </div>
          )}
          
          <div className="text-center mt-10">
            <Link to="/hotels" className="inline-block px-6 py-3 border-2 border-sifnos-turquoise text-sifnos-turquoise font-montserrat font-medium rounded-lg hover:bg-sifnos-turquoise hover:text-white transition-colors duration-300">
              View All Hotels
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Beaches */}
      <section className="py-16 bg-gray-50">
        <div className="page-container">
          <h2 className="section-title">Popular Beaches</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {popularBeaches.map((beach, index) => (
              <div key={index} className="cycladic-card overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={beach.imagePath}
                    alt={beach.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-montserrat font-semibold text-xl mb-2">{beach.name}</h3>
                  <p className="text-gray-600 mb-4">{beach.description}</p>
                  <Link to="/beaches" className="text-sifnos-turquoise hover:text-sifnos-deep-blue font-medium transition-colors duration-300">
                    Learn more
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="page-container">
          <h2 className="section-title text-center mx-auto">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div className="text-center">
              <div className="w-16 h-16 bg-sifnos-teal/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={26} className="text-sifnos-deep-blue" />
              </div>
              <h3 className="font-montserrat font-semibold text-xl mb-3">Best Selection</h3>
              <p className="text-gray-600">
                We carefully curate the best accommodations in Sifnos to ensure quality stays for every budget and preference.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-sifnos-teal/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Hotel size={26} className="text-sifnos-deep-blue" />
              </div>
              <h3 className="font-montserrat font-semibold text-xl mb-3">Local Expertise</h3>
              <p className="text-gray-600">
                Our team has intimate knowledge of Sifnos to help you find the perfect location for your island stay.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-sifnos-teal/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin size={26} className="text-sifnos-deep-blue" />
              </div>
              <h3 className="font-montserrat font-semibold text-xl mb-3">Island Guide</h3>
              <p className="text-gray-600">
                Comprehensive travel guides to help you discover hidden gems and make the most of your Sifnos experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sifnos Highlights */}
      <section className="py-16 bg-gray-50">
        <div className="page-container">
          <h2 className="section-title text-center mx-auto">Discover Sifnos Island</h2>
          <div className="max-w-4xl mx-auto mt-8">
            <div className="prose prose-lg mx-auto text-gray-700">
              <p>
                Known as the "Island of Flavors" due to its rich culinary traditions, Sifnos offers an authentic Greek island experience. 
                The island combines beautiful landscapes, traditional Cycladic architecture with whitewashed houses and blue-domed churches, 
                exquisite beaches, and a relaxed atmosphere that captivates visitors.
              </p>
              <p>
                From the capital Apollonia with its winding alleys and charming boutiques to the picturesque fishing village of Kastro 
                perched on a cliff overlooking the Aegean Sea, Sifnos presents countless opportunities for exploration and discovery.
              </p>
              <p>
                The island's ceramic tradition dates back thousands of years, and you can still find local artisans creating traditional 
                pottery. Sifnos is also a paradise for hikers, with well-marked trails connecting villages and offering spectacular views.
              </p>
            </div>
            <div className="text-center mt-8">
              <Link to="/travel-guide" className="inline-block px-6 py-3 bg-sifnos-turquoise text-white font-montserrat font-medium rounded-lg hover:bg-sifnos-deep-blue transition-colors duration-300">
                Explore Our Travel Guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-sifnos-deep-blue text-white">
        <div className="page-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-montserrat font-bold text-3xl mb-4">Subscribe to Our Newsletter</h2>
            <p className="mb-6 text-gray-300">
              Stay updated with special offers, travel tips, and new properties in Sifnos. Be the first to know about seasonal promotions.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-lg focus:outline-none text-gray-800"
              />
              <button
                type="submit"
                className="bg-sifnos-turquoise hover:bg-sifnos-teal text-white font-medium px-6 py-3 rounded-lg transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
