import { supabase } from '@/integrations/supabase/client';

interface AbandonedBookingData {
  bookingType: 'hotel' | 'ferry' | 'package';
  hotelId?: string;
  ferryRoute?: string;
  packageId?: string;
  checkInDate?: string;
  checkOutDate?: string;
  guests?: number;
  estimatedPrice?: number;
  bookingData?: any;
}

class AbandonedBookingTracker {
  private sessionId: string;
  private trackingTimeout: NodeJS.Timeout | null = null;

  constructor() {
    // Get or create session ID
    this.sessionId = this.getOrCreateSessionId();
  }

  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('booking_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('booking_session_id', sessionId);
    }
    return sessionId;
  }

  // Track when user starts a booking
  async startTracking(data: AbandonedBookingData) {
    // Clear any existing timeout
    if (this.trackingTimeout) {
      clearTimeout(this.trackingTimeout);
    }

    // Store booking data temporarily
    sessionStorage.setItem('current_booking', JSON.stringify(data));

    // After 2 minutes, mark as abandoned if not completed
    this.trackingTimeout = setTimeout(() => {
      this.markAsAbandoned(data);
    }, 2 * 60 * 1000); // 2 minutes
  }

  // Update tracking with new data (e.g., user adds email)
  async updateTracking(updates: Partial<AbandonedBookingData> & { userEmail?: string; userName?: string }) {
    const currentBooking = sessionStorage.getItem('current_booking');
    if (!currentBooking) return;

    const bookingData = JSON.parse(currentBooking);
    const updatedData = { ...bookingData, ...updates };
    
    sessionStorage.setItem('current_booking', JSON.stringify(updatedData));

    // If we now have email, update or create the abandoned booking record
    if (updates.userEmail) {
      await this.markAsAbandoned(updatedData, updates.userEmail, updates.userName);
    }
  }

  // Mark booking as abandoned in database
  private async markAsAbandoned(data: AbandonedBookingData, userEmail?: string, userName?: string) {
    try {
      const { error } = await supabase
        .from('abandoned_bookings')
        .upsert({
          session_id: this.sessionId,
          user_email: userEmail,
          user_name: userName,
          booking_type: data.bookingType,
          hotel_id: data.hotelId,
          ferry_route: data.ferryRoute,
          package_id: data.packageId,
          check_in_date: data.checkInDate,
          check_out_date: data.checkOutDate,
          guests: data.guests,
          estimated_price: data.estimatedPrice,
          booking_data: data.bookingData,
          recovery_email_sent: false,
          converted: false,
        }, {
          onConflict: 'session_id',
          ignoreDuplicates: false
        });

      if (error) {
        console.error('Error tracking abandoned booking:', error);
      } else {
        console.log('Abandoned booking tracked successfully');
      }
    } catch (error) {
      console.error('Failed to track abandoned booking:', error);
    }
  }

  // Mark booking as completed (stop tracking)
  async completeBooking() {
    // Clear timeout
    if (this.trackingTimeout) {
      clearTimeout(this.trackingTimeout);
      this.trackingTimeout = null;
    }

    // Mark as converted in database
    try {
      await supabase
        .from('abandoned_bookings')
        .update({
          converted: true,
          converted_at: new Date().toISOString()
        })
        .eq('session_id', this.sessionId);

      // Clear session data
      sessionStorage.removeItem('current_booking');
      sessionStorage.removeItem('booking_session_id');
    } catch (error) {
      console.error('Error completing booking:', error);
    }
  }

  // Stop tracking (user navigates away without completing)
  stopTracking() {
    if (this.trackingTimeout) {
      clearTimeout(this.trackingTimeout);
      this.trackingTimeout = null;
    }
  }
}

// Export singleton instance
export const abandonedBookingTracker = new AbandonedBookingTracker();
