
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { MapPin, Star, Search, Filter, Wifi, Coffee, Tv, CircleParking } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

export default function HotelsPage() {
  // Filter state
  const [filters, setFilters] = useState({
    amenities: {
      wifi: false,
      breakfast: false,
      pool: false,
      parking: false,
      airConditioning: false,
      restaurant: false,
      seaView: false,
    },
    starRating: 0,
  });

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchHotels() {
      try {
        const { data, error } = await supabase
          .from('hotels')
          .select(`
            *,
            hotel_amenities(amenity),
            hotel_photos(id, photo_url, is_main_photo)
          `);

        if (error) {
          throw error;
        }

        console.log("Fetched hotels data:", data);
        setHotels(data || []);
      } catch (error) {
        console.error('Error fetching hotels:', error);
        toast({
          title: "Error",
          description: "Failed to load hotels. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }

    fetchHotels();
  }, [toast]);

  // Function to render star rating
  const renderStarRating = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
      />
    ));
  };

  // Function to handle filter changes
  const handleAmenityChange = (amenity) => {
    setFilters({
      ...filters,
      amenities: {
        ...filters.amenities,
        [amenity]: !filters.amenities[amenity]
      }
    });
  };

  // Function to handle star rating filter
  const handleStarRatingChange = (rating) => {
    setFilters({
      ...filters,
      starRating: rating === filters.starRating ? 0 : rating
    });
  };

  // Amenity icons mapping
  const amenityIcons = {
    wifi: <Wifi size={16} className="mr-1" />,
    breakfast: <Coffee size={16} className="mr-1" />,
    tv: <Tv size={16} className="mr-1" />,
    parking: <CircleParking size={16} className="mr-1" />
  };

  // Process amenities for display
  const getHotelAmenities = (hotel) => {
    if (hotel?.hotel_amenities && hotel.hotel_amenities.length > 0) {
      return hotel.hotel_amenities.map(item => item.amenity);
    }
    return [];
  };

  // Get main photo URL or fallback
  const getMainPhotoUrl = (hotel) => {
    if (hotel?.hotel_photos && hotel.hotel_photos.length > 0) {
      const mainPhoto = hotel.hotel_photos.find(photo => photo.is_main_photo);
      if (mainPhoto) return `/uploads/hotels/${mainPhoto.photo_url}`;
      if (hotel.hotel_photos[0]?.photo_url) return `/uploads/hotels/${hotel.hotel_photos[0].photo_url}`;
    }
    return '/placeholder.svg';
  };

  return (
    <>
      <SEO 
        title="Hotels in Sifnos - Find Your Perfect Accommodation" 
        description="Browse our curated selection of luxury hotels, boutique guesthouses, and traditional Cycladic accommodations on Sifnos Island. Find the perfect place for your Greek island holiday with the best rates guaranteed."
        keywords={['sifnos hotels', 'hotels in sifnos', 'best hotels sifnos', 'sifnos accommodation', 'luxury hotels sifnos', 'boutique hotels sifnos', 'greece hotels', 'cyclades accommodation']}
        schemaType="Hotel"
        canonical="https://hotelssifnos.com/hotels"
      />
      
      {/* Hero Section */}
      <div className="bg-sifnos-deep-blue py-12">
        <div className="page-container">
          <div className="text-center text-white">
            <h1 className="font-montserrat text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Hotels in Sifnos Island
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">
              Find the perfect accommodation for your stay in the beautiful island of Sifnos. Explore our curated selection of luxury, boutique, and family-friendly hotels.
            </p>
          </div>
        </div>
      </div>
      
      {/* SEO Introduction */}
      <div className="bg-white py-10">
        <div className="page-container">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <p>
              Welcome to our comprehensive guide to accommodation in Sifnos. Whether you're seeking a 
              luxurious beachfront resort, a charming boutique hotel in a traditional village, or a family-friendly 
              guesthouse with authentic Cycladic character, Sifnos offers a diverse range of options to suit every 
              preference and budget.
            </p>
            <p>
              Known for its exceptional hospitality, Sifnos combines the authenticity of Greek island living with 
              modern amenities to ensure your stay is comfortable and memorable. Many accommodations feature traditional 
              Cycladic architecture with white-washed walls, blue accents, and stunning views of the Aegean Sea.
            </p>
            <p>
              Explore our carefully selected hotels below and find your perfect base for exploring all that Sifnos has to offer.
            </p>
          </div>
        </div>
      </div>
      
      {/* Search and Filter Section */}
      <div className="bg-white shadow-md">
        <div className="page-container py-6">
          <div className="flex flex-wrap items-center -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for hotels, locations, or amenities"
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-sifnos-turquoise"
                />
                <Search size={20} className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>
            <div className="w-full md:w-1/2 px-2 flex justify-end">
              <button 
                className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg mr-2 transition-colors duration-200"
              >
                <Filter size={18} className="mr-2" />
                Filter
              </button>
              <button className="bg-sifnos-turquoise hover:bg-sifnos-deep-blue text-white px-6 py-3 rounded-lg transition-colors duration-300">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="bg-gray-50 py-12">
        <div className="page-container">
          <div className="flex flex-wrap -mx-4">
            {/* Filters Sidebar */}
            <div className="w-full lg:w-1/4 px-4 mb-8 lg:mb-0">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="font-montserrat font-semibold text-xl mb-6 pb-3 border-b">Filters</h2>
                
                {/* Star Rating */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Star Rating</h3>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map(rating => (
                      <div 
                        key={rating} 
                        className="flex items-center cursor-pointer"
                        onClick={() => handleStarRatingChange(rating)}
                      >
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={filters.starRating === rating}
                          readOnly
                        />
                        <div className="flex">
                          {renderStarRating(rating)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Amenities */}
                <div>
                  <h3 className="font-semibold mb-3">Amenities</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="wifi"
                        checked={filters.amenities.wifi}
                        onChange={() => handleAmenityChange('wifi')}
                        className="mr-2"
                      />
                      <label htmlFor="wifi">Free WiFi</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="breakfast"
                        checked={filters.amenities.breakfast}
                        onChange={() => handleAmenityChange('breakfast')}
                        className="mr-2"
                      />
                      <label htmlFor="breakfast">Breakfast Included</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="pool"
                        checked={filters.amenities.pool}
                        onChange={() => handleAmenityChange('pool')}
                        className="mr-2"
                      />
                      <label htmlFor="pool">Swimming Pool</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="parking"
                        checked={filters.amenities.parking}
                        onChange={() => handleAmenityChange('parking')}
                        className="mr-2"
                      />
                      <label htmlFor="parking">Free Parking</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="airConditioning"
                        checked={filters.amenities.airConditioning}
                        onChange={() => handleAmenityChange('airConditioning')}
                        className="mr-2"
                      />
                      <label htmlFor="airConditioning">Air Conditioning</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="restaurant"
                        checked={filters.amenities.restaurant}
                        onChange={() => handleAmenityChange('restaurant')}
                        className="mr-2"
                      />
                      <label htmlFor="restaurant">Restaurant</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="seaView"
                        checked={filters.amenities.seaView}
                        onChange={() => handleAmenityChange('seaView')}
                        className="mr-2"
                      />
                      <label htmlFor="seaView">Sea View</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Hotels Listing */}
            <div className="w-full lg:w-3/4 px-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-montserrat font-semibold text-xl">
                  {loading ? "Loading hotels..." : `${hotels.length} hotels found`}
                </h2>
                <div className="flex items-center">
                  <span className="mr-2 text-sm">Sort by:</span>
                  <select className="border rounded-md p-2 text-sm">
                    <option>Recommended</option>
                    <option>Rating (high to low)</option>
                    <option>A-Z</option>
                  </select>
                </div>
              </div>
              
              {/* Loading State */}
              {loading && (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sifnos-turquoise"></div>
                </div>
              )}
              
              {/* Hotels Grid */}
              {!loading && (
                <div className="space-y-6">
                  {hotels.length > 0 ? (
                    hotels.map(hotel => (
                      <div key={hotel.id} className="cycladic-card overflow-hidden flex flex-col md:flex-row">
                        <div className="md:w-1/3">
                          <div className="bg-sifnos-teal/20 h-48 md:h-full">
                            <img 
                              src={getMainPhotoUrl(hotel)} 
                              alt={`${hotel.name} - Hotel in ${hotel.location}, Sifnos`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="md:w-2/3 p-6">
                          <div className="flex flex-wrap justify-between">
                            <div>
                              <h3 className="font-montserrat font-semibold text-xl">{hotel.name}</h3>
                              <div className="flex items-center mt-1 mb-3">
                                <MapPin size={16} className="text-sifnos-turquoise mr-1" />
                                <span className="text-gray-600 text-sm">{hotel.location}</span>
                              </div>
                            </div>
                            <div className="flex items-center">
                              {renderStarRating(hotel.rating)}
                            </div>
                          </div>
                          
                          <p className="text-gray-600 mb-4">{hotel.short_description || hotel.description.substring(0, 150) + '...'}</p>
                          
                          {/* Amenities */}
                          <div className="flex flex-wrap gap-3 mb-4">
                            {getHotelAmenities(hotel).map((amenity, index) => (
                              <span key={index} className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
                                {amenityIcons[amenity.toLowerCase()] || null} {amenity}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex justify-end items-center mt-auto">
                            <Link 
                              to={`/hotels/${hotel.id}`} 
                              className="bg-sifnos-turquoise hover:bg-sifnos-deep-blue text-white px-6 py-2 rounded-lg transition-colors duration-300 text-sm font-medium"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <h3 className="font-medium text-xl text-gray-700">No hotels found matching your criteria</h3>
                      <p className="text-gray-500 mt-2">Try adjusting your filters or search terms</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Pagination */}
              {!loading && hotels.length > 0 && (
                <div className="flex justify-center mt-8">
                  <div className="flex space-x-1">
                    <button className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
                      &laquo; Previous
                    </button>
                    <button className="px-4 py-2 border rounded-lg bg-sifnos-turquoise text-white">
                      1
                    </button>
                    <button className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
                      2
                    </button>
                    <button className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
                      3
                    </button>
                    <button className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
                      Next &raquo;
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Location Information */}
      <div className="bg-white py-12">
        <div className="page-container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-montserrat font-bold text-sifnos-deep-blue mb-4">Where to Stay in Sifnos</h2>
            <div className="prose prose-lg">
              <p>
                Sifnos offers a variety of locations to stay, each with its own unique charm and advantages:
              </p>
              
              <h3>Apollonia</h3>
              <p>
                The capital of the island, Apollonia is a picturesque village with winding alleys, white-washed houses, and 
                a vibrant atmosphere. Staying here puts you at the heart of the island's social scene with easy access to 
                boutiques, restaurants, and bars.
              </p>
              
              <h3>Kamares</h3>
              <p>
                The main port of Sifnos offers a beautiful sandy beach and numerous waterfront cafes and tavernas. 
                Accommodation here is convenient for those arriving by ferry and wanting immediate access to the sea.
              </p>
              
              <h3>Platis Gialos</h3>
              <p>
                One of the island's most popular beaches with golden sand and shallow waters ideal for families. 
                The beachfront is lined with hotels and restaurants, making it perfect for those wanting a beach-focused holiday.
              </p>
              
              <h3>Kastro</h3>
              <p>
                The ancient capital of Sifnos offers a unique historical atmosphere with medieval architecture and 
                stunning sea views. Accommodation here is more limited but provides an authentic experience in a truly magical setting.
              </p>
              
              <h3>Vathi</h3>
              <p>
                A tranquil fishing village with a beautiful sheltered bay and sandy beach. This is the place for 
                those seeking peace, relaxation, and natural beauty away from the busier areas of the island.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
