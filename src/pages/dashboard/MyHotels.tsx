import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Hotel, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Image, 
  Bed, 
  Star, 
  MapPin, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router-dom';

// Define hotel type
interface HotelType {
  id: string;
  name: string;
  location: string;
  description: string;
  rating: number;
  price: number;
  hotel_types?: string[];
  hotel_photos?: {
    id: string;
    photo_url: string;
    is_main_photo?: boolean;
  }[];
  hotel_amenities?: {
    amenity: string;
  }[];
  hotel_rooms?: {
    id: string;
    name: string;
    price: number;
    capacity: number;
  }[];
}

export default function MyHotels() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hotels, setHotels] = useState<HotelType[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    const fetchHotels = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Fetch hotels owned by the user
        const { data: hotelOwners, error: ownersError } = await supabase
          .from('hotel_owners')
          .select(`
            hotel_id,
            role
          `)
          .eq('user_id', user.id);
          
        if (ownersError) throw ownersError;
        
        if (hotelOwners && hotelOwners.length > 0) {
          const hotelIds = hotelOwners.map(owner => owner.hotel_id);
          
          // Fetch detailed hotel information
          const { data: hotelData, error: hotelsError } = await supabase
            .from('hotels')
            .select(`
              *,
              hotel_amenities(amenity),
              hotel_photos(id, photo_url, is_main_photo),
              hotel_rooms(id, name, price, capacity)
            `)
            .in('id', hotelIds);
            
          if (hotelsError) throw hotelsError;
          
          setHotels(hotelData || []);
        } else {
          setHotels([]);
        }
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHotels();
  }, [user]);
  
  // Filter hotels based on active tab
  const filteredHotels = () => {
    if (activeTab === 'all') return hotels;
    
    // In a real implementation, you would filter based on status
    // For now, we'll just return all hotels
    return hotels;
  };
  
  // Get hotel image URL
  const getHotelImageUrl = (hotel: HotelType): string => {
    const mainPhoto = hotel.hotel_photos?.find(photo => photo.is_main_photo);
    if (mainPhoto) {
      return `/uploads/hotels/${mainPhoto.photo_url}`;
    }
    return '/placeholder.svg';
  };
  
  // Render star rating
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={14} 
            className={i < Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-sifnos-deep-blue">My Hotels</h1>
          <p className="text-gray-600">Manage your hotel listings and properties</p>
        </div>
        
        <Button className="bg-sifnos-turquoise hover:bg-sifnos-deep-blue">
          <Plus size={16} className="mr-2" />
          Add New Hotel
        </Button>
      </div>
      
      {/* Tabs for filtering */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Hotels</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Hotels List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sifnos-turquoise"></div>
          </div>
        ) : filteredHotels().length > 0 ? (
          filteredHotels().map(hotel => (
            <Card key={hotel.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Hotel Image */}
                <div className="md:w-1/4 h-48 md:h-auto relative">
                  <img 
                    src={getHotelImageUrl(hotel)} 
                    alt={hotel.name} 
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-green-500">Active</Badge>
                </div>
                
                {/* Hotel Details */}
                <div className="md:w-2/4 p-6">
                  <div className="flex flex-col h-full">
                    <div>
                      <h2 className="text-xl font-semibold mb-1">{hotel.name}</h2>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin size={14} className="mr-1" />
                        <span className="text-sm">{hotel.location}</span>
                      </div>
                      {renderStarRating(hotel.rating)}
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="flex-grow">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <Image size={14} className="mr-2 text-gray-500" />
                          <span>{hotel.hotel_photos?.length || 0} Photos</span>
                        </div>
                        <div className="flex items-center">
                          <Bed size={14} className="mr-2 text-gray-500" />
                          <span>{hotel.hotel_rooms?.length || 0} Rooms</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-2 text-gray-500" />
                          <span>Last updated: 2 days ago</span>
                        </div>
                        <div className="flex items-center">
                          <Eye size={14} className="mr-2 text-gray-500" />
                          <span>125 Views</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="md:w-1/4 p-6 bg-gray-50 flex flex-col justify-between">
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Eye size={16} className="mr-2" />
                      View Listing
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Edit size={16} className="mr-2" />
                      Edit Details
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50">
                      <Trash2 size={16} className="mr-2" />
                      Delete
                    </Button>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600 mb-2">Subscription Plan:</div>
                    <Badge className="bg-sifnos-turquoise">Premium</Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Hotel className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Hotels Found</h3>
              <p className="text-gray-500 mb-6">
                You don't have any hotels registered yet. Add your first hotel to get started.
              </p>
              <Button>
                <Plus size={16} className="mr-2" />
                Add Your First Hotel
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Helpful Information */}
      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700">
          Need help managing your hotel listing? <Link to="/dashboard/help" className="font-medium underline">View our guide</Link> or <Link to="/dashboard/support" className="font-medium underline">contact support</Link>.
        </AlertDescription>
      </Alert>
    </div>
  );
}
