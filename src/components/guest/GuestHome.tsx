import React from "react";
import { useNavigate } from "react-router-dom";
import { useGuestContext } from "@/contexts/GuestContext";
import { Calendar, MapPin, Bell, Wifi, Clock, BookOpen, Settings } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { format } from "date-fns";

export const GuestHome: React.FC = () => {
  const { hotel, booking } = useGuestContext();
  const { t } = useI18n();
  const navigate = useNavigate();

  if (!hotel || !booking) return null;

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Welcome Section */}
      <section className="bg-card rounded-xl shadow p-6">
        <h1 className="text-xl font-semibold mb-2 text-foreground">
          Welcome to {hotel.name}
        </h1>
        {hotel.guestWelcomeMessage && (
          <p className="text-sm text-muted-foreground mb-4">
            {hotel.guestWelcomeMessage}
          </p>
        )}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Calendar className="h-4 w-4" />
          <span>
            {format(new Date(booking.checkIn), 'MMM d')} – {format(new Date(booking.checkOut), 'MMM d, yyyy')}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("guide")}
            className="px-4 py-2 rounded-lg text-xs border border-border hover:bg-muted transition-colors"
          >
            Hotel Guide
          </button>
          <button
            onClick={() => navigate("requests")}
            className="px-4 py-2 rounded-lg text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Need Help?
          </button>
        </div>
      </section>

      {/* WiFi Info Card */}
      {hotel.guestWifiName && (
        <section className="bg-card rounded-xl shadow p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Wifi className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground">WiFi Information</h3>
              <p className="text-xs text-muted-foreground">Stay connected during your stay</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Network:</span>
              <span className="font-medium text-foreground">{hotel.guestWifiName}</span>
            </div>
            {hotel.guestWifiPassword && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Password:</span>
                <span className="font-mono text-foreground">{hotel.guestWifiPassword}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Check-in/out Times */}
      <section className="bg-card rounded-xl shadow p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">Important Times</h3>
            <p className="text-xs text-muted-foreground">Check-in and check-out</p>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Check-in:</span>
            <span className="font-medium text-foreground">{hotel.checkInTime || '14:00'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Check-out:</span>
            <span className="font-medium text-foreground">{hotel.checkOutTime || '11:00'}</span>
          </div>
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate("guide")}
          className="bg-card rounded-xl shadow p-4 text-left hover:shadow-md transition-shadow"
        >
          <BookOpen className="h-6 w-6 text-primary mb-2" />
          <div className="font-medium text-sm text-foreground">Hotel Guide</div>
          <div className="text-xs text-muted-foreground">House rules & info</div>
        </button>

        <button
          onClick={() => navigate("area")}
          className="bg-card rounded-xl shadow p-4 text-left hover:shadow-md transition-shadow"
        >
          <MapPin className="h-6 w-6 text-primary mb-2" />
          <div className="font-medium text-sm text-foreground">Explore Sifnos</div>
          <div className="text-xs text-muted-foreground">Beaches & restaurants</div>
        </button>

        <button
          onClick={() => navigate("requests")}
          className="bg-card rounded-xl shadow p-4 text-left hover:shadow-md transition-shadow"
        >
          <Bell className="h-6 w-6 text-primary mb-2" />
          <div className="font-medium text-sm text-foreground">Requests</div>
          <div className="text-xs text-muted-foreground">Ask for assistance</div>
        </button>

        <button
          onClick={() => navigate("settings")}
          className="bg-card rounded-xl shadow p-4 text-left hover:shadow-md transition-shadow"
        >
          <Settings className="h-6 w-6 text-primary mb-2" />
          <div className="font-medium text-sm text-foreground">{t('guest.more')}</div>
          <div className="text-xs text-muted-foreground">{t('guest.settingsAndContact')}</div>
        </button>
      </section>
    </div>
  );
};