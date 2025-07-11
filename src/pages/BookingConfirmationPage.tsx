import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Calendar, Users, Phone, Mail, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const BookingConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const sessionId = searchParams.get('sessionId');

  useEffect(() => {
    if (sessionId) {
      fetchBookingDetails();
    } else {
      navigate('/');
    }
  }, [sessionId]);

  const fetchBookingDetails = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('booking-engine', {
        body: null
      });
      
      if (error) throw error;
      
      const response = await fetch(`https://wdzlruiekcznbcicjgrz.supabase.co/functions/v1/booking-engine?sessionId=${sessionId}`);
      const result = await response.json();
      
      setBookingData(result.session);
    } catch (error) {
      console.error('Error fetching booking details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  if (!bookingData) {
    return <div className="container mx-auto py-8">Booking not found</div>;
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-green-700">
            Booking Confirmed!
          </CardTitle>
          <p className="text-muted-foreground">
            Your reservation has been successfully confirmed
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">What happens next?</h3>
            <ul className="text-sm space-y-1">
              <li>• You'll receive a confirmation email shortly</li>
              <li>• The hotel will contact you within 24 hours</li>
              <li>• Payment instructions will be provided by the hotel</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Booking Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Check-in: {new Date(bookingData.check_in_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Check-out: {new Date(bookingData.check_out_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Guests: {bookingData.guests}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{bookingData.user_email}</span>
              </div>
            </div>
          </div>

          <Button onClick={() => navigate('/')} className="w-full">
            Return to Homepage
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingConfirmationPage;