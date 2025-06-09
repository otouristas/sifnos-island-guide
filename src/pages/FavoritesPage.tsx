import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import SEO from '@/components/SEO';
import HotelCard from '@/components/HotelCard';
import { Button } from '@/components/ui/button';
import { Loader2, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function FavoritesPage() {
  const { user, getFavorites } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
          <h1 className="text-3xl font-bold text-sifnos-deep-blue mb-4">Your Favorite Hotels</h1>
          <p className="text-gray-600 mb-8">
            Hotels you've saved for future reference. Click on any hotel to view more details.
          </p>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-sifnos-turquoise" />
            </div>
          ) : favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map(hotel => (
                <HotelCard key={hotel.id} hotel={hotel} showLogo={true} />
              ))}
            </div>
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