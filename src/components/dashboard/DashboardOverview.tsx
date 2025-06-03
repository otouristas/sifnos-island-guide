
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, BedDouble, Calendar, Users } from 'lucide-react';
import { DashboardHeader } from './DashboardHeader';

interface DashboardOverviewProps {
  userId: string;
}

interface Stats {
  totalHotels: number;
  totalRooms: number;
  totalBookings: number;
  upcomingCheckIns: number;
}

export const DashboardOverview = ({ userId }: DashboardOverviewProps) => {
  const [stats, setStats] = useState<Stats>({
    totalHotels: 0,
    totalRooms: 0,
    totalBookings: 0,
    upcomingCheckIns: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get user's hotels
        const { data: hotelOwners } = await supabase
          .from('hotel_owners')
          .select('hotel_id')
          .eq('user_id', userId);

        const hotelIds = hotelOwners?.map(ho => ho.hotel_id) || [];

        if (hotelIds.length === 0) {
          setLoading(false);
          return;
        }

        // Get total hotels
        const totalHotels = hotelIds.length;

        // Get total rooms
        const { count: totalRooms } = await supabase
          .from('hotel_rooms')
          .select('*', { count: 'exact', head: true })
          .in('hotel_id', hotelIds);

        // Get total bookings
        const { count: totalBookings } = await supabase
          .from('room_bookings')
          .select('room_id, hotel_rooms!inner(hotel_id)', { count: 'exact', head: true })
          .in('hotel_rooms.hotel_id', hotelIds);

        // Get upcoming check-ins (next 7 days)
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        const { count: upcomingCheckIns } = await supabase
          .from('room_bookings')
          .select('room_id, hotel_rooms!inner(hotel_id)', { count: 'exact', head: true })
          .in('hotel_rooms.hotel_id', hotelIds)
          .gte('check_in', today.toISOString().split('T')[0])
          .lte('check_in', nextWeek.toISOString().split('T')[0]);

        setStats({
          totalHotels,
          totalRooms: totalRooms || 0,
          totalBookings: totalBookings || 0,
          upcomingCheckIns: upcomingCheckIns || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  if (loading) {
    return <div>Loading overview...</div>;
  }

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Dashboard Overview" 
        subtitle="Welcome to your hotel management dashboard"
        user={{} as any}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hotels</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHotels}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <BedDouble className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRooms}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Check-ins</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingCheckIns}</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome to your Hotel Dashboard</CardTitle>
          <CardDescription>
            Manage your hotels, rooms, availability, and bookings all in one place.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600">
            {stats.totalHotels === 0 ? (
              <p>Get started by adding your first hotel in the Hotels section.</p>
            ) : (
              <p>You have {stats.totalHotels} hotel(s) with {stats.totalRooms} room(s) total.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
