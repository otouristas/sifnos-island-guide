import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Hotel {
  id: string;
  slug: string;
  name: string;
  logoPath?: string;
  primaryColor?: string;
  secondaryColor?: string;
  guestWelcomeMessage?: string;
  guestWifiName?: string;
  guestWifiPassword?: string;
  checkInTime?: string;
  checkOutTime?: string;
  phone?: string;
  email?: string;
  address?: string;
}

interface Booking {
  id: string;
  guestName: string;
  guestEmail?: string;
  checkIn: string;
  checkOut: string;
  roomName?: string;
  bookingStatus: string;
}

interface GuestContextValue {
  hotel: Hotel | null;
  booking: Booking | null;
  loading: boolean;
  error?: string;
}

const GuestContext = createContext<GuestContextValue>({
  hotel: null,
  booking: null,
  loading: true,
});

export const useGuestContext = () => useContext(GuestContext);

export const GuestProvider = ({ children }: { children: ReactNode }) => {
  const { hotelSlug, guestToken } = useParams();
  const [value, setValue] = useState<GuestContextValue>({
    hotel: null,
    booking: null,
    loading: true,
  });

  useEffect(() => {
    if (!hotelSlug || !guestToken) {
      setValue({
        hotel: null,
        booking: null,
        loading: false,
        error: 'Invalid guest link'
      });
      return;
    }

    // Handle demo guest experience
    if (guestToken === 'demo-guest-token' && hotelSlug === 'demo-hotel') {
      setValue({
        hotel: {
          id: 'demo-id',
          slug: 'demo-hotel',
          name: 'Demo Cycladic Suites',
          primaryColor: '#1E2E48',
          secondaryColor: '#E3D7C3',
          guestWelcomeMessage: 'Welcome to Demo Cycladic Suites! This is a demonstration of our digital guest portal. Explore all features to see how we enhance your stay with technology.',
          guestWifiName: 'DemoSuites_Guest_WiFi',
          guestWifiPassword: 'Welcome2024!',
          checkInTime: '15:00',
          checkOutTime: '11:00',
          phone: '+30 22840 33333',
          email: 'demo@cycladicsuites.com',
          address: 'Main Street, Apollonia, Sifnos 84003, Greece'
        },
        booking: {
          id: 'demo-booking-id',
          guestName: 'Demo Guest',
          guestEmail: 'demo@example.com',
          checkIn: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
          checkOut: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0], // 4 days later
          roomName: 'Deluxe Sea View Suite',
          bookingStatus: 'confirmed'
        },
        loading: false
      });
      return;
    }

    const loadGuestData = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('validate-guest-token', {
          body: { guestToken }
        });

        if (error) throw error;

        // Verify hotel slug matches
        if (data.hotel.slug !== hotelSlug) {
          throw new Error("Invalid guest link - hotel mismatch");
        }

        setValue({
          hotel: data.hotel,
          booking: data.booking,
          loading: false
        });
      } catch (err: any) {
        console.error('Error loading guest data:', err);
        setValue({
          hotel: null,
          booking: null,
          loading: false,
          error: err.message || "Invalid or expired guest link"
        });
      }
    };

    loadGuestData();
  }, [hotelSlug, guestToken]);

  return <GuestContext.Provider value={value}>{children}</GuestContext.Provider>;
};