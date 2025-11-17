import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import SEO from '@/components/SEO';
import HotelCard from '@/components/HotelCard';
import { Button } from '@/components/ui/button';
import { Loader2, Heart, Grid3x3, Table2, Share2, X, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function FavoritesPage() {
  const { user, getFavorites, removeFavorite } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'comparison'>('grid');
  const navigate = useNavigate();
  
  // Fetch favorites on mount
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        return;
      }
      
      setIsLoading(true);
      try {
        const favoriteIds = await getFavorites();
        
        if (favoriteIds.length > 0) {
          // Fetch hotel details for favorites
          const { data, error } = await supabase
            .from('hotels')
            .select(`
              *,
              hotel_amenities(amenity),
              hotel_photos(id, photo_url, is_main_photo)
            `)
            .in('id', favoriteIds);
            
          if (!error && data) {
            setFavorites(data);
          }
        } else {
          setFavorites([]);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFavorites();
  }, [user, getFavorites]);
  
  // If not authenticated, redirect to home
  if (!user) {
    navigate('/');
    return null;
  }
  
  return (
    <>
      <SEO 
        title="Your Favorite Hotels - Hotels Sifnos"
        description="View and manage your favorite hotels on Sifnos Island. Easily access your saved accommodations for your next trip."
        noIndex={true}
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-sifnos-deep-blue mb-2">Your Favorite Hotels</h1>
              <p className="text-gray-600">
                Hotels you've saved for future reference. Click on any hotel to view more details.
              </p>
            </div>
            {favorites.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="h-8"
                  >
                    <Grid3x3 size={16} className="mr-1" />
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === 'comparison' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('comparison')}
                    className="h-8"
                    disabled={favorites.length === 0}
                  >
                    <Table2 size={16} className="mr-1" />
                    Compare
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const url = `${window.location.origin}/favorites?shared=true`;
                    navigator.clipboard.writeText(url);
                    alert('Favorites link copied to clipboard!');
                  }}
                >
                  <Share2 size={16} className="mr-1" />
                  Share
                </Button>
              </div>
            )}
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-sifnos-turquoise" />
            </div>
          ) : favorites.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map(hotel => (
                  <HotelCard key={hotel.id} hotel={hotel} showLogo={true} />
                ))}
              </div>
            ) : (
              <ComparisonView favorites={favorites} onRemove={async (hotelId) => {
                await removeFavorite(hotelId);
                setFavorites(favorites.filter(h => h.id !== hotelId));
              }} />
            )
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No favorites yet</h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                You haven't saved any hotels to your favorites yet. Browse our hotels and click the heart icon to add them to your favorites.
              </p>
              <Button asChild>
                <a href="/hotels">Browse Hotels</a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Comparison View Component
function ComparisonView({ favorites, onRemove }: { favorites: any[]; onRemove: (id: string) => Promise<void> }) {
  const navigate = useNavigate();
  
  const getMainPhoto = (hotel: any) => {
    const mainPhoto = hotel.hotel_photos?.find((p: any) => p.is_main_photo);
    return mainPhoto?.photo_url || hotel.hotel_photos?.[0]?.photo_url || '/placeholder-hotel.jpg';
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="p-4 text-left font-semibold text-sifnos-deep-blue">Hotel</th>
            <th className="p-4 text-left font-semibold text-sifnos-deep-blue">Price/Night</th>
            <th className="p-4 text-left font-semibold text-sifnos-deep-blue">Location</th>
            <th className="p-4 text-left font-semibold text-sifnos-deep-blue">Rating</th>
            <th className="p-4 text-left font-semibold text-sifnos-deep-blue">Type</th>
            <th className="p-4 text-left font-semibold text-sifnos-deep-blue">Actions</th>
          </tr>
        </thead>
        <tbody>
          {favorites.map((hotel) => (
            <tr key={hotel.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={getMainPhoto(hotel)}
                    alt={hotel.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-sifnos-deep-blue">{hotel.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-1">{hotel.short_description}</p>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <span className="font-semibold text-sifnos-deep-blue">
                  {hotel.price ? `€${hotel.price}` : 'N/A'}
                </span>
              </td>
              <td className="p-4 text-gray-700">{hotel.location || 'N/A'}</td>
              <td className="p-4">
                {hotel.rating ? (
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{hotel.rating}</span>
                    <span className="text-yellow-500">★</span>
                  </div>
                ) : (
                  'N/A'
                )}
              </td>
              <td className="p-4">
                <span className="px-2 py-1 bg-sifnos-beige/20 text-sifnos-deep-blue rounded text-sm">
                  {hotel.hotel_types?.[0] || 'N/A'}
                </span>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/hotels/${hotel.id}`)}
                  >
                    <Eye size={14} className="mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemove(hotel.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X size={14} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}