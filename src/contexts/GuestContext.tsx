import React, { createContext, useContext, useEffect, useState } from "react";
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

export const GuestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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