
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { HotelManagement } from '@/components/dashboard/HotelManagement';
import { RoomManagement } from '@/components/dashboard/RoomManagement';
import { CalendarManagement } from '@/components/dashboard/CalendarManagement';
import { BookingManagement } from '@/components/dashboard/BookingManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function HotelDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/dashboard/auth" replace />;
  }

  return (
    <DashboardLayout user={user}>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Hotel Dashboard</h1>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="hotels">Hotels</TabsTrigger>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <DashboardOverview userId={user.id} />
          </TabsContent>
          
          <TabsContent value="hotels" className="mt-6">
            <HotelManagement userId={user.id} />
          </TabsContent>
          
          <TabsContent value="rooms" className="mt-6">
            <RoomManagement userId={user.id} />
          </TabsContent>
          
          <TabsContent value="calendar" className="mt-6">
            <CalendarManagement userId={user.id} />
          </TabsContent>
          
          <TabsContent value="bookings" className="mt-6">
            <BookingManagement userId={user.id} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
