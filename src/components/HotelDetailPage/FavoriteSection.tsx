import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import AuthModal from '@/components/auth/AuthModal';

interface FavoriteSectionProps {
  hotelId: string;
  hotelName: string;
}

export default function FavoriteSection({ hotelId, hotelName }: FavoriteSectionProps) {
  const { user, toggleFavorite, checkIsFavorite } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Check if hotel is favorited on mount and when user changes
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user) {
        setIsLoading(true);
        const status = await checkIsFavorite(hotelId);
        setIsFavorite(status);
        setIsLoading(false);
      } else {
        setIsFavorite(false);
      }
    };
    
    checkFavoriteStatus();
  }, [hotelId, user, checkIsFavorite]);
  
  // Handle favorite toggle
  const handleToggleFavorite = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    
    setIsLoading(true);
    const newStatus = await toggleFavorite(hotelId);
    setIsFavorite(newStatus);
    setIsLoading(false);
  };
  
  return (
    <div className="mb-6">
      <Button
        variant={isFavorite ? "default" : "outline"}
        className={`w-full ${isFavorite ? 'bg-red-500 hover:bg-red-600 border-red-500' : 'border-gray-300'}`}
        onClick={handleToggleFavorite}
        disabled={isLoading}
      >
        <Heart className={`mr-2 h-5 w-5 ${isFavorite ? 'fill-white' : ''}`} />
        {isFavorite ? `Saved to Favorites` : `Save to Favorites`}
      </Button>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        defaultView="sign-in"
      />
    </div>
  );
}