import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { GuestProvider, useGuestContext } from "@/contexts/GuestContext";
import { GuestHeader } from "./GuestHeader";
import { GuestBottomNav } from "./GuestBottomNav";

const GuestShellContent: React.FC = () => {
  const { hotel, booking, loading, error } = useGuestContext();

  // Apply hotel branding to CSS variables
  useEffect(() => {
    if (hotel) {
      document.documentElement.style.setProperty('--guest-primary', hotel.primaryColor || '#1E2E48');
      document.documentElement.style.setProperty('--guest-secondary', hotel.secondaryColor || '#E3D7C3');
    }
  }, [hotel]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your stay...</p>
        </div>
      </div>
    );
  }

  if (error || !hotel || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-semibold mb-2 text-foreground">Invalid or Expired Link</h1>
          <p className="text-muted-foreground mb-4">
            {error || "This guest link is no longer valid. Please contact your hotel for a new link."}
          </p>
          <a 
            href="/" 
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Return to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <GuestHeader hotel={hotel} booking={booking} />
      <main className="flex-1 px-4 py-4 pb-20">
        <Outlet />
      </main>
      <GuestBottomNav />
    </div>
  );
};

export const GuestShell: React.FC = () => {
  return (
    <GuestProvider>
      <GuestShellContent />
    </GuestProvider>
  );
};