
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
import { Routes, Route } from 'react-router-dom';

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
      <Routes>
        <Route path="/" element={<DashboardOverview userId={user.id} />} />
        <Route path="/hotels" element={<HotelManagement userId={user.id} />} />
        <Route path="/rooms" element={<RoomManagement userId={user.id} />} />
        <Route path="/calendar" element={<CalendarManagement userId={user.id} />} />
        <Route path="/bookings" element={<BookingManagement userId={user.id} />} />
      </Routes>
    </DashboardLayout>
  );
}
