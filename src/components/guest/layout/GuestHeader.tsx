import React from "react";
import { format } from "date-fns";

interface Hotel {
  name: string;
  logoPath?: string;
}

interface Booking {
  guestName: string;
  checkIn: string;
  checkOut: string;
}

interface GuestHeaderProps {
  hotel: Hotel;
  booking: Booking;
}

export const GuestHeader: React.FC<GuestHeaderProps> = ({ hotel, booking }) => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 border-b bg-card shadow-sm">
      <div className="flex items-center gap-3">
        {hotel.logoPath && (
          <img
            src={hotel.logoPath}
            alt={hotel.name}
            className="h-10 w-10 rounded-full object-cover"
          />
        )}
        <div>
          <div className="font-semibold text-sm text-foreground">{hotel.name}</div>
          <div className="text-xs text-muted-foreground">
            Welcome, {booking.guestName.split(' ')[0]}
          </div>
        </div>
      </div>
      <div className="text-xs text-right text-muted-foreground">
        <div>{format(new Date(booking.checkIn), 'MMM d')}</div>
        <div className="text-[10px]">–</div>
        <div>{format(new Date(booking.checkOut), 'MMM d')}</div>
      </div>
    </header>
  );
};