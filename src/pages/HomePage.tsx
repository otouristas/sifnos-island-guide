
import { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { Search, MapPin, Hotel, Home, Utensils, Anchor, Sun, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

export default function HomePage() {
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchFeaturedHotels() {
      try {
        const { data, error } = await (supabase as any)
          .from('hotels')
          .select(`
            *,
            hotel_photos(photo_url, is_main_photo)
          `)
          .order('rating', { ascending: false })
          .limit(3);

        if (error) throw error;
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
      return mainPhoto ? mainPhoto.photo_url : (hotel.hotel_photos[0]?.photo_url || '/placeholder.svg');
    }
    return '/placeholder.svg';
  };

  const popularBeaches = [
    {
      name: 'Platis Gialos',
      description: 'Long sandy beach with clear waters',
      imagePath: '/beach1.jpg'
    },
    {
      name: 'Vathi',
      description: 'Sheltered bay with calm waters',
      imagePath: '/beach2.jpg'
    },
    {
      name: 'Chrysopigi',
      description: 'Iconic beach with monastery views',
      imagePath: '/beach3.jpg'
    }
  ];
  
  return (
    <>
      <SEO 
        title="Hotels Sifnos - Find the Best Hotels in Sifnos Island, Greece" 
        description="Discover the best hotels and accommodations in Sifnos Island, Greece. Book luxury hotels, boutique stays, and villas with sea views for your perfect Greek island vacation."
        keywords={['sifnos hotels', 'hotels in sifnos', 'best hotels sifnos', 'sifnos accommodation', 'sifnos island', 'greek islands hotels', 'cyclades accommodations']}
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
            
            <Link to="/villas" className="cycladic-card p-6 text-center hover:bg-gray-50 transition-colors group">
              <div className="w-16 h-16 bg-sifnos-teal/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-sifnos-turquoise/30 transition-colors">
                <Home size={30} className="text-sifnos-deep-blue" />
              </div>
              <h3 className="font-montserrat font-semibold text-xl mb-2">Villas</h3>
              <p className="text-gray-600">Private villas and homes for a relaxing family or group stay</p>
            </Link>
            
            <Link to="/restaurants" className="cycladic-card p-6 text-center hover:bg-gray-50 transition-colors group">
              <div className="w-16 h-16 bg-sifnos-teal/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-sifnos-turquoise/30 transition-colors">
                <Utensils size={30} className="text-sifnos-deep-blue" />
              </div>
              <h3 className="font-montserrat font-semibold text-xl mb-2">Restaurants</h3>
              <p className="text-gray-600">Top-rated dining experiences featuring authentic Greek cuisine</p>
            </Link>
            
            <Link to="/beaches" className="cycladic-card p-6 text-center hover:bg-gray-50 transition-colors group">
              <div className="w-16 h-16 bg-sifnos-teal/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-sifnos-turquoise/30 transition-colors">
                <Anchor size={30} className="text-sifnos-deep-blue" />
              </div>
              <h3 className="font-montserrat font-semibold text-xl mb-2">Beaches</h3>
              <p className="text-gray-600">Discover the most beautiful beaches and hidden coves of Sifnos</p>
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
              {featuredHotels.map(hotel => (
                <div key={hotel.id} className="cycladic-card overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={getMainPhotoUrl(hotel)} 
                      alt={hotel.name}
                      className="w-full h-full object-cover"
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
                      <div>
                        <span className="text-2xl font-bold text-sifnos-deep-blue">${hotel.price}</span>
                        <span className="text-gray-600 text-sm"> / night</span>
                      </div>
                      <Link to={`/hotels/${hotel.id}`} className="bg-sifnos-turquoise hover:bg-sifnos-deep-blue text-white px-4 py-2 rounded-lg transition-colors duration-300 text-sm font-medium">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
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
