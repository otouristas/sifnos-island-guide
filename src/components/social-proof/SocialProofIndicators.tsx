import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Eye, Clock, Users, MapPin, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SocialProofIndicatorsProps {
  hotelId: string;
  className?: string;
}

const SocialProofIndicators: React.FC<SocialProofIndicatorsProps> = ({
  hotelId,
  className = ''
}) => {
  const [viewingCount, setViewingCount] = useState(0);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [roomsLeft, setRoomsLeft] = useState<number | null>(null);
  const [popularityScore, setPopularityScore] = useState(0);

  useEffect(() => {
    // Simulate real-time viewing count
    const baseViewing = Math.floor(Math.random() * 8) + 2; // 2-10 people
    setViewingCount(baseViewing);
    
    // Vary the count every 30 seconds
    const interval = setInterval(() => {
      const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
      setViewingCount(prev => Math.max(1, Math.min(15, prev + variation)));
    }, 30000);

    fetchSocialProofData();
    trackUserViewing();

    return () => clearInterval(interval);
  }, [hotelId]);

  const fetchSocialProofData = async () => {
    try {
      // Get recent social proof events
      const { data: events } = await supabase
        .from('social_proof_events')
        .select('*')
        .eq('hotel_id', hotelId)
        .eq('event_type', 'booking')
        .order('created_at', { ascending: false })
        .limit(5);

      if (events) {
        setRecentBookings(events);
      }

      // Get available rooms count
      const { data: rooms } = await supabase
        .from('hotel_rooms')
        .select('id')
        .eq('hotel_id', hotelId);

      if (rooms) {
        // Simulate scarcity - random number of rooms left
        const totalRooms = rooms.length;
        const simulatedLeft = Math.floor(Math.random() * Math.min(5, totalRooms)) + 1;
        setRoomsLeft(simulatedLeft);
      }

      // Calculate popularity score based on recent activity
      const recentActivity = events?.length || 0;
      setPopularityScore(Math.min(100, recentActivity * 20 + Math.floor(Math.random() * 30)));

    } catch (error) {
      console.error('Error fetching social proof data:', error);
    }
  };

  const trackUserViewing = async () => {
    try {
      // Generate anonymous user ID if not exists
      let anonymousId = sessionStorage.getItem('anonymous_user_id');
      if (!anonymousId) {
        anonymousId = crypto.randomUUID();
        sessionStorage.setItem('anonymous_user_id', anonymousId);
      }

      await supabase
        .from('social_proof_events')
        .insert({
          event_type: 'viewing',
          hotel_id: hotelId,
          anonymous_user_id: anonymousId,
          user_location: 'Unknown', // Could be enhanced with geolocation
          user_country: 'Unknown'
        });
    } catch (error) {
      console.error('Error tracking user viewing:', error);
    }
  };

  const timeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Less than an hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${Math.floor(diffHours / 24)} days ago`;
  };

  const getRandomLocation = () => {
    const locations = ['Athens', 'Thessaloniki', 'Paris', 'London', 'Berlin', 'Rome', 'Amsterdam', 'Barcelona'];
    return locations[Math.floor(Math.random() * locations.length)];
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Currently Viewing */}
      <Card className="p-3 border-l-4 border-l-blue-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">
              {viewingCount} people viewing this hotel
            </span>
          </div>
          <Badge variant="secondary" className="animate-pulse">
            Live
          </Badge>
        </div>
      </Card>

      {/* Rooms Left */}
      {roomsLeft && roomsLeft <= 5 && (
        <Card className="p-3 border-l-4 border-l-orange-500">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-700">
              Only {roomsLeft} rooms left at this price!
            </span>
          </div>
        </Card>
      )}

      {/* Recent Bookings */}
      {recentBookings.length > 0 && (
        <Card className="p-3 border-l-4 border-l-green-500">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Recent bookings</span>
            </div>
            {recentBookings.slice(0, 2).map((booking, index) => (
              <div key={booking.id} className="text-xs text-muted-foreground flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                <span>
                  Someone from {booking.user_location || getRandomLocation()} 
                  booked this hotel {timeAgo(booking.created_at)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Popularity Indicator */}
      {popularityScore > 60 && (
        <Card className="p-3 border-l-4 border-l-purple-500">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">
              High demand property
            </span>
            <Badge variant="default" className="bg-purple-600">
              {popularityScore}% popular
            </Badge>
          </div>
        </Card>
      )}

      {/* Trust Indicators */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="text-green-600 border-green-600">
          ✓ Instant Confirmation
        </Badge>
        <Badge variant="outline" className="text-blue-600 border-blue-600">
          ✓ Free Cancellation
        </Badge>
        <Badge variant="outline" className="text-purple-600 border-purple-600">
          ✓ Best Price Guarantee
        </Badge>
      </div>
    </div>
  );
};

export default SocialProofIndicators;