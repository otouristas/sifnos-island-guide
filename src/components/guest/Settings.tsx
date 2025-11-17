import { useGuestContext } from "@/contexts/GuestContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, Calendar, Clock, Phone, Mail, MapPin, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

export default function Settings() {
  const { hotel, booking, loading } = useGuestContext();
  const [requesting, setRequesting] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hotel || !booking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Unable to load settings</p>
      </div>
    );
  }

  const handleDownloadInvoice = () => {
    // Create a simple text-based invoice
    const invoiceContent = `
BOOKING INVOICE
${hotel.name}
${hotel.address || ''}

Booking Details:
Guest: ${booking.guestName}
Email: ${booking.guestEmail || 'N/A'}
Room: ${booking.roomName || 'Standard Room'}
Check-in: ${format(new Date(booking.checkIn), 'PPP')}
Check-out: ${format(new Date(booking.checkOut), 'PPP')}
Status: ${booking.bookingStatus}

Thank you for choosing ${hotel.name}!
    `.trim();

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${booking.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Invoice downloaded");
  };

  const handleRequestEarlyCheckIn = async () => {
    setRequesting(true);
    try {
      // Get room_id from booking
      const { data: bookingData, error: bookingError } = await supabase
        .from('room_bookings')
        .select('room_id, hotel_rooms!inner(hotel_id)')
        .eq('id', booking.id)
        .single();

      if (bookingError) throw bookingError;

      const { error } = await supabase
        .from('guest_requests')
        .insert({
          booking_id: booking.id,
          hotel_id: bookingData.hotel_rooms.hotel_id,
          category: 'reception',
          description: `Early check-in request for ${format(new Date(booking.checkIn), 'PPP')}. Guest: ${booking.guestName}`,
        });

      if (error) throw error;

      toast.success("Early check-in request submitted! Hotel staff will contact you shortly.");
    } catch (error) {
      console.error('Error submitting early check-in request:', error);
      toast.error("Failed to submit request. Please try again or contact reception directly.");
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your booking and access important information</p>
      </div>

      {/* Booking Details */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
          <CardDescription>Your current reservation information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Check-in</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(booking.checkIn), 'EEEE, MMMM d, yyyy')} at {hotel.checkInTime}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Check-out</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(booking.checkOut), 'EEEE, MMMM d, yyyy')} at {hotel.checkOutTime}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Room Type</p>
                <p className="text-sm text-muted-foreground">{booking.roomName || 'Standard Room'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Booking Status</p>
                <p className="text-sm text-muted-foreground capitalize">{booking.bookingStatus}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex gap-3">
            <Button 
              onClick={handleDownloadInvoice} 
              variant="outline" 
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Invoice
            </Button>
            <Button 
              onClick={handleRequestEarlyCheckIn}
              disabled={requesting}
              className="flex-1"
            >
              <Clock className="h-4 w-4 mr-2" />
              {requesting ? 'Requesting...' : 'Request Early Check-in'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Emergency Contacts
          </CardTitle>
          <CardDescription>Important contact information for your stay</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-foreground">Hotel Reception</p>
                <a 
                  href={`tel:${hotel.phone}`}
                  className="text-sm text-primary hover:underline"
                >
                  {hotel.phone || 'Not available'}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-foreground">Email</p>
                <a 
                  href={`mailto:${hotel.email}`}
                  className="text-sm text-primary hover:underline"
                >
                  {hotel.email || 'Not available'}
                </a>
              </div>
            </div>

            <Separator />

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm font-medium text-foreground mb-2">Emergency Services (Greece)</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>• Police: <a href="tel:100" className="text-primary hover:underline font-medium">100</a></p>
                <p>• Ambulance: <a href="tel:166" className="text-primary hover:underline font-medium">166</a></p>
                <p>• Fire Department: <a href="tel:199" className="text-primary hover:underline font-medium">199</a></p>
                <p>• Tourist Police: <a href="tel:171" className="text-primary hover:underline font-medium">171</a></p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hotel Information */}
      <Card>
        <CardHeader>
          <CardTitle>Hotel Information</CardTitle>
          <CardDescription>Location and contact details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {hotel.address && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Address</p>
                  <p className="text-sm text-muted-foreground">{hotel.address}</p>
                </div>
              </div>
            )}

            {hotel.guestWifiName && (
              <>
                <Separator />
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-foreground mb-2">WiFi Information</p>
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">
                      Network: <span className="font-medium text-foreground">{hotel.guestWifiName}</span>
                    </p>
                    {hotel.guestWifiPassword && (
                      <p className="text-muted-foreground">
                        Password: <span className="font-medium text-foreground">{hotel.guestWifiPassword}</span>
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
