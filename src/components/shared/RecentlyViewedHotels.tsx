import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateHotelUrl } from '@/lib/url-utils';

interface RecentlyViewedHotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: number;
  imageUrl: string;
  viewedAt: number;
}

export default function RecentlyViewedHotels() {
  const [recentHotels, setRecentHotels] = useState<RecentlyViewedHotel[]>([]);

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem('recentlyViewedHotels');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Sort by most recent and limit to 3
        const sorted = parsed.sort((a: RecentlyViewedHotel, b: RecentlyViewedHotel) => 
          b.viewedAt - a.viewedAt
        ).slice(0, 3);
        setRecentHotels(sorted);
      } catch (e) {
        console.error('Error parsing recently viewed hotels:', e);
      }
    }
  }, []);

  if (recentHotels.length === 0) {
    return null;
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-primary" />
          Recently Viewed
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentHotels.map((hotel) => (
          <Link
            key={hotel.id}
            to={`/hotels/${generateHotelUrl(hotel.name)}`}
            className="flex gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors group"
          >
            <img
              src={hotel.imageUrl}
              alt={hotel.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                {hotel.name}
              </h4>
              <p className="text-xs text-muted-foreground truncate">{hotel.location}</p>
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-medium">{hotel.rating}</span>
                </div>
                <span className="text-xs font-semibold text-primary">€{hotel.price}</span>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

// Helper function to add hotel to recently viewed
export const addToRecentlyViewed = (hotel: Omit<RecentlyViewedHotel, 'viewedAt'>) => {
  try {
    const stored = localStorage.getItem('recentlyViewedHotels');
    let recentHotels: RecentlyViewedHotel[] = stored ? JSON.parse(stored) : [];
    
    // Remove if already exists
    recentHotels = recentHotels.filter(h => h.id !== hotel.id);
    
    // Add to beginning with current timestamp
    recentHotels.unshift({
      ...hotel,
      viewedAt: Date.now()
    });
    
    // Keep only last 10
    recentHotels = recentHotels.slice(0, 10);
    
    localStorage.setItem('recentlyViewedHotels', JSON.stringify(recentHotels));
  } catch (e) {
    console.error('Error saving to recently viewed:', e);
  }
};
