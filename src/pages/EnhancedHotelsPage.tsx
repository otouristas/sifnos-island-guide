import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import { Search, Calendar, Users, MapPin, Star, ExternalLink, Wifi, Coffee, Car, Utensils, Waves, Snowflake } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { searchHotels, Hotel } from '@/services/hotelSearch';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { determineHotelImageUrl } from '@/utils/image-utils';
import { generateHotelUrl } from '@/lib/url-utils';

interface SearchParams {
  location: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfAdults: number;
  numberOfChildren: number;
}

interface EnhancedHotelCardProps {
  hotel: Hotel;
}

const EnhancedHotelCard = ({ hotel }: EnhancedHotelCardProps) => {
  const isAgodaHotel = hotel.source === 'agoda';
  
  const hotelUrl = isAgodaHotel 
    ? hotel.landing_url || '#'
    : `/hotels/${generateHotelUrl(hotel.name)}`;
    
  const imageUrl = isAgodaHotel 
    ? hotel.image_url || '/placeholder.svg'
    : determineHotelImageUrl(hotel);

  const formatPrice = (price: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating) 
                ? "fill-yellow-400 text-yellow-400" 
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const getAmenityIcon = (amenity: string) => {
    const lower = amenity.toLowerCase();
    if (lower.includes('wifi')) return <Wifi className="w-4 h-4" />;
    if (lower.includes('breakfast')) return <Coffee className="w-4 h-4" />;
    if (lower.includes('parking')) return <Car className="w-4 h-4" />;
    if (lower.includes('restaurant')) return <Utensils className="w-4 h-4" />;
    if (lower.includes('sea') || lower.includes('view')) return <Waves className="w-4 h-4" />;
    if (lower.includes('air') || lower.includes('conditioning')) return <Snowflake className="w-4 h-4" />;
    return null;
  };

  const handleBooking = () => {
    if (isAgodaHotel && hotel.landing_url) {
      window.open(hotel.landing_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="relative md:w-80 h-48 md:h-auto">
          <img
            src={imageUrl}
            alt={hotel.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          
          {/* Source Badge */}
          <div className="absolute top-3 left-3">
            {isAgodaHotel ? (
              <Badge variant="secondary" className="bg-blue-600 text-white hover:bg-blue-700">
                <ExternalLink className="w-3 h-3 mr-1" />
                Live Booking
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-green-600 text-white hover:bg-green-700">
                <MapPin className="w-3 h-3 mr-1" />
                Local Partner
              </Badge>
            )}
          </div>

          {/* Match Score Badge */}
          {hotel.matchInfo && (
            <div className="absolute top-3 right-3">
              <Badge variant="outline" className="bg-white/90 backdrop-blur-sm">
                {Math.round(hotel.matchInfo.confidence * 100)}% Match
              </Badge>
            </div>
          )}

          {/* Discount Badge */}
          {isAgodaHotel && hotel.agoda_data?.discountPercentage > 0 && (
            <div className="absolute bottom-3 right-3">
              <Badge variant="destructive" className="bg-red-500 text-white">
                {hotel.agoda_data.discountPercentage}% OFF
              </Badge>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
                {hotel.name}
              </CardTitle>
              
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{hotel.location}</span>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-2 mb-3">
                {hotel.star_rating && renderStarRating(hotel.star_rating)}
                <span className="text-sm text-gray-600">
                  {hotel.star_rating || 'N/A'} star hotel
                </span>
                
                {hotel.review_score && (
                  <>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center gap-1">
                      <div className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium">
                        {hotel.review_score.toFixed(1)}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({hotel.review_count || 0} reviews)
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Price Section */}
            <div className="text-right ml-6">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {formatPrice(
                  hotel.price_per_night || hotel.daily_rate || 0, 
                  isAgodaHotel ? hotel.agoda_data?.currency || 'USD' : 'EUR'
                )}
              </div>
              <div className="text-sm text-gray-500">per night</div>
              
              {isAgodaHotel && hotel.agoda_data?.totalRate && (
                <div className="text-xs text-gray-400 mt-1">
                  Total: {formatPrice(hotel.agoda_data.totalRate, hotel.agoda_data.currency)}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {hotel.description && (
            <p className="text-gray-600 line-clamp-3 mb-4">
              {hotel.description}
            </p>
          )}

          {/* Amenities */}
          <div className="flex flex-wrap gap-2 mb-4">
            {hotel.amenities && hotel.amenities.slice(0, 6).map((amenity, index) => (
              <Badge key={index} variant="outline" className="text-xs flex items-center gap-1">
                {getAmenityIcon(amenity)}
                {amenity}
              </Badge>
            ))}
            
            {/* Agoda specific amenities */}
            {isAgodaHotel && hotel.agoda_data && (
              <>
                {hotel.agoda_data.freeWifi && (
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                    <Wifi className="w-3 h-3 mr-1" />
                    Free WiFi
                  </Badge>
                )}
                {hotel.agoda_data.includeBreakfast && (
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                    <Coffee className="w-3 h-3 mr-1" />
                    Breakfast Included
                  </Badge>
                )}
              </>
            )}
            
            {hotel.amenities && hotel.amenities.length > 6 && (
              <Badge variant="outline" className="text-xs">
                +{hotel.amenities.length - 6} more
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {isAgodaHotel ? (
              <Button 
                onClick={handleBooking}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Book Now on Agoda
              </Button>
            ) : (
              <Button asChild variant="outline" className="flex-1">
                <Link to={hotelUrl}>
                  View Details & Book
                </Link>
              </Button>
            )}
            
            <Button variant="secondary" size="sm">
              Compare
            </Button>
          </div>

          {/* Debug Info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-gray-400 mt-3 p-2 bg-gray-50 rounded">
              <div>ID: {hotel.id} | Source: {hotel.source}</div>
              {hotel.agoda_hotel_id && <div>Agoda ID: {hotel.agoda_hotel_id}</div>}
              {hotel.matchInfo && (
                <div>Match: {hotel.matchInfo.matchedWith} (Score: {hotel.matchInfo.similarity?.toFixed(3)})</div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default function EnhancedHotelsPage() {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    location: 'Sifnos',
    checkInDate: '',
    checkOutDate: '',
    numberOfAdults: 2,
    numberOfChildren: 0,
  });
  
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const { toast } = useToast();

  // Set default dates (today + 1 week)
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 8);
    
    setSearchParams(prev => ({
      ...prev,
      checkInDate: tomorrow.toISOString().split('T')[0],
      checkOutDate: nextWeek.toISOString().split('T')[0],
    }));
  }, []);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    setSearchPerformed(true);
    
    try {
      console.log('🔍 Enhanced search with params:', searchParams);
      
      const results = await searchHotels({
        location: searchParams.location,
        checkInDate: searchParams.checkInDate,
        checkOutDate: searchParams.checkOutDate,
        numberOfAdults: searchParams.numberOfAdults,
        numberOfChildren: searchParams.numberOfChildren,
      });
      
      console.log(`✅ Found ${results.length} hotels`);
      setHotels(results);
      
      toast({
        title: "Search Complete",
        description: `Found ${results.length} hotels for your dates`,
      });
      
    } catch (error) {
      console.error('❌ Search error:', error);
      toast({
        title: "Search Failed",
        description: "Could not search hotels. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [searchParams, toast]);

  const updateSearchParam = (key: keyof SearchParams, value: string | number) => {
    setSearchParams(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const guestOptions = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Enhanced Hotel Search - Sifnos Hotels"
        description="Search and book hotels in Sifnos with advanced filters and real-time availability"
      />
      
      <div className="container mx-auto px-4 py-6">
        <Breadcrumbs 
          items={[
            { label: 'Home', href: '/' },
            { label: 'Hotels', href: '/hotels' },
            { label: 'Enhanced Search' }
          ]} 
        />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Perfect Hotel in Sifnos
          </h1>
          <p className="text-gray-600">
            Search both local partner hotels and live booking options with real-time availability
          </p>
        </div>

        {/* Advanced Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Advanced Hotel Search
            </CardTitle>
            <CardDescription>
              Find hotels with specific dates and guest requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Select 
                  value={searchParams.location} 
                  onValueChange={(value) => updateSearchParam('location', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sifnos">Entire Sifnos</SelectItem>
                    <SelectItem value="Kamares">Kamares</SelectItem>
                    <SelectItem value="Apollonia">Apollonia</SelectItem>
                    <SelectItem value="Artemonas">Artemonas</SelectItem>
                    <SelectItem value="Platis Gialos">Platis Gialos</SelectItem>
                    <SelectItem value="Kastro">Kastro</SelectItem>
                    <SelectItem value="Faros">Faros</SelectItem>
                    <SelectItem value="Vathi">Vathi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Check-in Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Check-in</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="date"
                    value={searchParams.checkInDate}
                    onChange={(e) => updateSearchParam('checkInDate', e.target.value)}
                    className="pl-10"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {/* Check-out Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Check-out</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="date"
                    value={searchParams.checkOutDate}
                    onChange={(e) => updateSearchParam('checkOutDate', e.target.value)}
                    className="pl-10"
                    min={searchParams.checkInDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {/* Adults */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Adults</label>
                <Select 
                  value={searchParams.numberOfAdults.toString()} 
                  onValueChange={(value) => updateSearchParam('numberOfAdults', parseInt(value))}
                >
                  <SelectTrigger>
                    <Users className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {guestOptions.map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'Adult' : 'Adults'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Children */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Children</label>
                <Select 
                  value={searchParams.numberOfChildren.toString()} 
                  onValueChange={(value) => updateSearchParam('numberOfChildren', parseInt(value))}
                >
                  <SelectTrigger>
                    <Users className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, ...guestOptions.slice(0, 4)].map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'Child' : 'Children'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-600">
                {searchParams.checkInDate && searchParams.checkOutDate && (
                  <span>
                    {Math.ceil((new Date(searchParams.checkOutDate).getTime() - new Date(searchParams.checkInDate).getTime()) / (1000 * 60 * 60 * 24))} nights
                  </span>
                )}
              </div>
              
              <Button 
                onClick={handleSearch}
                disabled={loading || !searchParams.checkInDate || !searchParams.checkOutDate}
                className="bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                {loading ? (
                  <>
                    <Search className="w-4 h-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search Hotels
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {searchPerformed && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {loading ? 'Searching...' : `Found ${hotels.length} Hotels`}
              </h2>
              
              {hotels.length > 0 && (
                <div className="flex gap-2 text-sm text-gray-600">
                  <Badge variant="outline">
                    {hotels.filter(h => h.source === 'local').length} Local Partners
                  </Badge>
                  <Badge variant="outline">
                    {hotels.filter(h => h.source === 'agoda').length} Live Bookings
                  </Badge>
                </div>
              )}
            </div>

            {loading ? (
              <div className="grid gap-6">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="h-64 animate-pulse bg-gray-200" />
                ))}
              </div>
            ) : hotels.length > 0 ? (
              <div className="space-y-6">
                {hotels.map((hotel) => (
                  <EnhancedHotelCard key={`${hotel.source}-${hotel.id}`} hotel={hotel} />
                ))}
              </div>
            ) : searchPerformed ? (
              <Card className="p-8 text-center">
                <div className="text-gray-500 mb-4">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No hotels found</h3>
                  <p>Try adjusting your search criteria or dates</p>
                </div>
                <Button variant="outline" onClick={handleSearch}>
                  Search Again
                </Button>
              </Card>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
} 