
import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { MapPin, Star, Search, Filter, Wifi, Coffee, Tv, Parking } from 'lucide-react';

export default function HotelsPage() {
  // Filter state
  const [filters, setFilters] = useState({
    priceRange: [0, 500],
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

  // Sample hotels data
  const hotels = [
    {
      id: 1,
      name: 'Blue Sea Luxury Hotel',
      location: 'Platis Gialos',
      description: 'Experience luxury by the sea with stunning views of the Aegean.',
      rating: 5,
      price: 220,
      amenities: ['wifi', 'pool', 'breakfast', 'parking', 'seaView'],
      imagePath: '/hotel1.jpg'
    },
    {
      id: 2,
      name: 'Cycladic Elegance',
      location: 'Kamares',
      description: 'Traditional Cycladic architecture with modern comforts near the port.',
      rating: 4,
      price: 180,
      amenities: ['wifi', 'airConditioning', 'restaurant', 'seaView'],
      imagePath: '/hotel2.jpg'
    },
    {
      id: 3,
      name: 'Sifnos Bliss Resort',
      location: 'Apollonia',
      description: 'Peaceful retreat in the heart of Sifnos with exceptional service.',
      rating: 5,
      price: 250,
      amenities: ['wifi', 'pool', 'breakfast', 'parking', 'restaurant'],
      imagePath: '/hotel3.jpg'
    },
    {
      id: 4,
      name: 'Kastro View Boutique',
      location: 'Kastro',
      description: 'Stunning views of the medieval settlement with authentic character.',
      rating: 4,
      price: 190,
      amenities: ['wifi', 'breakfast', 'airConditioning', 'seaView'],
      imagePath: '/hotel4.jpg'
    },
    {
      id: 5,
      name: 'Artemonas Heritage',
      location: 'Artemonas',
      description: 'Historic property in the charming village of Artemonas.',
      rating: 4,
      price: 170,
      amenities: ['wifi', 'parking', 'airConditioning'],
      imagePath: '/hotel5.jpg'
    },
    {
      id: 6,
      name: 'Vathi Bay Resort',
      location: 'Vathi',
      description: 'Beachfront luxury with direct access to Vathi's golden sand beach.',
      rating: 5,
      price: 280,
      amenities: ['wifi', 'pool', 'breakfast', 'parking', 'restaurant', 'seaView'],
      imagePath: '/hotel6.jpg'
    }
  ];

  // Function to render star rating
  const renderStarRating = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
      />
    ));
  };

  // Function to handle filter changes
  const handleAmenityChange = (amenity: string) => {
    setFilters({
      ...filters,
      amenities: {
        ...filters.amenities,
        [amenity]: !filters.amenities[amenity as keyof typeof filters.amenities]
      }
    });
  };

  // Function to handle star rating filter
  const handleStarRatingChange = (rating: number) => {
    setFilters({
      ...filters,
      starRating: rating === filters.starRating ? 0 : rating
    });
  };

  // Amenity icons mapping
  const amenityIcons: Record<string, JSX.Element> = {
    wifi: <Wifi size={16} className="mr-1" />,
    breakfast: <Coffee size={16} className="mr-1" />,
    tv: <Tv size={16} className="mr-1" />,
    parking: <Parking size={16} className="mr-1" />
  };

  return (
    <>
      <SEO 
        title="Hotels in Sifnos - Find Your Perfect Accommodation" 
        description="Browse and book from a wide selection of luxury hotels, boutique stays and villas on Sifnos Island, Greece."
        keywords={['sifnos hotels', 'hotels in sifnos', 'best hotels sifnos', 'sifnos accommodation', 'luxury hotels sifnos']}
        schemaType="Hotel"
      />
      
      {/* Hero Section */}
      <div className="bg-sifnos-deep-blue py-12">
        <div className="page-container">
          <div className="text-center text-white">
            <h1 className="font-montserrat text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Hotels in Sifnos Island
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">
              Find the perfect accommodation for your stay in the beautiful island of Sifnos
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
                
                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Price Range</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">${filters.priceRange[0]}</span>
                    <span className="text-sm text-gray-600">${filters.priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    className="w-full"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters({...filters, priceRange: [0, parseInt(e.target.value)]})}
                  />
                </div>
                
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
                  {hotels.length} hotels found
                </h2>
                <div className="flex items-center">
                  <span className="mr-2 text-sm">Sort by:</span>
                  <select className="border rounded-md p-2 text-sm">
                    <option>Recommended</option>
                    <option>Price (low to high)</option>
                    <option>Price (high to low)</option>
                    <option>Rating (high to low)</option>
                  </select>
                </div>
              </div>
              
              {/* Hotels Grid */}
              <div className="space-y-6">
                {hotels.map(hotel => (
                  <div key={hotel.id} className="cycladic-card overflow-hidden flex flex-col md:flex-row">
                    <div className="md:w-1/3">
                      {/* Placeholder image - in production replace with actual hotel images */}
                      <div className="bg-sifnos-teal/50 h-48 md:h-full flex items-center justify-center">
                        <span className="text-white font-medium">Hotel Image</span>
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
                      
                      <p className="text-gray-600 mb-4">{hotel.description}</p>
                      
                      {/* Amenities */}
                      <div className="flex flex-wrap gap-3 mb-4">
                        {hotel.amenities.includes('wifi') && (
                          <span className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
                            <Wifi size={12} className="mr-1" /> WiFi
                          </span>
                        )}
                        {hotel.amenities.includes('breakfast') && (
                          <span className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
                            <Coffee size={12} className="mr-1" /> Breakfast
                          </span>
                        )}
                        {hotel.amenities.includes('parking') && (
                          <span className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
                            <Parking size={12} className="mr-1" /> Parking
                          </span>
                        )}
                        {/* Add more amenities based on data */}
                      </div>
                      
                      <div className="flex justify-between items-center mt-auto">
                        <div>
                          <span className="text-2xl font-bold text-sifnos-deep-blue">${hotel.price}</span>
                          <span className="text-gray-600 text-sm"> / night</span>
                        </div>
                        <Link 
                          to={`/hotels/${hotel.id}`} 
                          className="bg-sifnos-turquoise hover:bg-sifnos-deep-blue text-white px-6 py-2 rounded-lg transition-colors duration-300 text-sm font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
