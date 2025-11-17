import { useGuestContext } from "@/contexts/GuestContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, Calendar, Clock, Phone, Mail, MapPin, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { useI18n } from "@/contexts/I18nContext";

export default function Settings() {
  const { hotel, booking, loading } = useGuestContext();
  const { t } = useI18n();
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
        <p className="text-muted-foreground">{t('guest.unableToLoadSettings')}</p>
      </div>
    );
  }

  const handleDownloadInvoice = () => {
    // Create a simple text-based invoice
    const invoiceContent = `
${t('common.bookingInvoice')}
${hotel.name}
${hotel.address || ''}

${t('common.bookingDetails')}:
${t('common.guest')}: ${booking.guestName}
${t('common.email')}: ${booking.guestEmail || 'N/A'}
${t('common.room')}: ${booking.roomName || t('common.standardRoom')}
${t('guest.checkIn')}: ${format(new Date(booking.checkIn), 'PPP')}
${t('guest.checkOut')}: ${format(new Date(booking.checkOut), 'PPP')}
${t('common.status')}: ${booking.bookingStatus}

${t('common.thankYouForChoosing')} ${hotel.name}!
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
    
    toast.success(t('common.invoiceDownloaded'));
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

      toast.success(t('common.earlyCheckInRequestSubmitted'));
    } catch (error) {
      console.error('Error submitting early check-in request:', error);
      toast.error(t('common.failedToSubmitRequest'));
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{t('guest.settings')}</h1>
        <p className="text-muted-foreground">{t('guest.settingsDescription')}</p>
      </div>

      {/* Booking Details */}
      <Card>
        <CardHeader>
          <CardTitle>{t('guest.bookingDetails')}</CardTitle>
          <CardDescription>{t('guest.bookingDetailsDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-foreground">{t('guest.checkIn')}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(booking.checkIn), 'EEEE, MMMM d, yyyy')} at {hotel.checkInTime}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-foreground">{t('guest.checkOut')}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(booking.checkOut), 'EEEE, MMMM d, yyyy')} at {hotel.checkOutTime}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-foreground">{t('guest.roomType')}</p>
                <p className="text-sm text-muted-foreground">{booking.roomName || t('common.standardRoom')}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-foreground">{t('guest.bookingStatus')}</p>
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
              {t('guest.downloadInvoice')}
            </Button>
            <Button 
              onClick={handleRequestEarlyCheckIn}
              disabled={requesting}
              className="flex-1"
            >
              <Clock className="h-4 w-4 mr-2" />
              {requesting ? t('guest.requesting') : t('guest.requestEarlyCheckIn')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            {t('guest.emergencyContacts')}
          </CardTitle>
          <CardDescription>{t('guest.emergencyContactsDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-foreground">{t('guest.hotelReception')}</p>
                <a 
                  href={`tel:${hotel.phone}`}
                  className="text-sm text-primary hover:underline"
                >
                  {hotel.phone || t('common.notAvailable')}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-foreground">{t('common.email')}</p>
                <a 
                  href={`mailto:${hotel.email}`}
                  className="text-sm text-primary hover:underline"
                >
                  {hotel.email || t('common.notAvailable')}
                </a>
              </div>
            </div>

            <Separator />

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm font-medium text-foreground mb-2">{t('guest.emergencyServices')}</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>• {t('guest.police')}: <a href="tel:100" className="text-primary hover:underline font-medium">100</a></p>
                <p>• {t('guest.ambulance')}: <a href="tel:166" className="text-primary hover:underline font-medium">166</a></p>
                <p>• {t('guest.fireDepartment')}: <a href="tel:199" className="text-primary hover:underline font-medium">199</a></p>
                <p>• {t('guest.touristPolice')}: <a href="tel:171" className="text-primary hover:underline font-medium">171</a></p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hotel Information */}
      <Card>
        <CardHeader>
          <CardTitle>{t('guest.hotelInformation')}</CardTitle>
          <CardDescription>{t('guest.hotelInformationDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {hotel.address && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">{t('guest.address')}</p>
                  <p className="text-sm text-muted-foreground">{hotel.address}</p>
                </div>
              </div>
            )}

            {hotel.guestWifiName && (
              <>
                <Separator />
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-foreground mb-2">{t('guest.wifiInfo')}</p>
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">
                      {t('guest.wifiName')}: <span className="font-medium text-foreground">{hotel.guestWifiName}</span>
                    </p>
                    {hotel.guestWifiPassword && (
                      <p className="text-muted-foreground">
                        {t('guest.wifiPassword')}: <span className="font-medium text-foreground">{hotel.guestWifiPassword}</span>
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
