
import { useEffect, useState } from 'react';
import { Star, Flag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  date: string;
  source: string;
  country?: string;
}

interface BookingReviewsProps {
  hotelId: string;
}

const BookingReviews = ({ hotelId }: BookingReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hotelData, setHotelData] = useState<any>(null);
  const { toast } = useToast();

  // Function to render star rating
  const renderStarRating = (rating: number) => {
    // Rating is already on a 0-5 scale now
    const starsOutOf5 = rating;
    
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={i < Math.round(starsOutOf5) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
        size={16}
      />
    ));
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Fetch hotel data to get booking URL
  const fetchHotelData = async () => {
    try {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .eq('id', hotelId)
        .single();
        
      if (error) throw error;
      
      setHotelData(data);
    } catch (error) {
      console.error('Error fetching hotel data:', error);
    }
  };

  // Fetch Booking.com reviews
  const fetchBookingReviews = async () => {
    try {
      setRefreshing(true);
      
      // Trigger the edge function to update reviews
      const { data, error } = await supabase.functions.invoke('fetch-booking-reviews', {
        body: { hotelId: hotelId }
      });
      
      if (error) {
        console.error('Edge function error:', error);
        throw new Error(`Edge function error: ${error.message || 'Unknown error'}`);
      }
      
      console.log('Edge function response:', data);
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch reviews');
      }
      
      toast({
        title: "Reviews updated",
        description: data.message || "Latest reviews from Booking.com have been fetched",
      });
      
      // Fetch the updated reviews
      await fetchReviews();
      
    } catch (error) {
      console.error('Error refreshing reviews:', error);
      toast({
        title: "Error refreshing reviews",
        description: "Failed to fetch the latest reviews from Booking.com",
        variant: "destructive"
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Fetch reviews from our database
  const fetchReviews = async () => {
    try {
      console.log('Fetching reviews for hotel ID:', hotelId);
      const { data, error } = await supabase
        .from('hotel_reviews')
        .select('*')
        .eq('hotel_id', hotelId)
        .eq('source', 'booking.com')
        .order('date', { ascending: false });
        
      if (error) throw error;
      
      console.log('Fetched reviews for hotel ID:', hotelId);
      console.log('Fetched reviews:', data);
      setReviews(data || []);
      
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error",
        description: "Failed to load reviews. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to realtime changes in the reviews table
  useEffect(() => {
    fetchReviews();
    fetchHotelData();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'hotel_reviews',
          filter: `hotel_id=eq.${hotelId} AND source=eq.booking.com`,
        },
        (payload) => {
          console.log('Realtime update received:', payload);
          fetchReviews();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [hotelId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sifnos-turquoise"></div>
      </div>
    );
  }

  // Get the booking.com URL from hotel data or use a default
  const getBookingUrl = () => {
    if (hotelData?.booking_url) return hotelData.booking_url;
    
    // Special case for ALK HOTEL
    if (hotelData?.name === "ALK HOTEL™") {
      return "https://www.booking.com/hotel/gr/alk.el.html";
    }
    
    return "https://www.booking.com";
  };

  const bookingUrl = getBookingUrl();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold flex items-center">
          <img 
            src="/uploads/Booking.com.svg" 
            alt="Booking.com" 
            className="h-6 mr-2" 
          />
          Reviews
          <span className="ml-2 text-sm text-gray-600">({reviews.length})</span>
        </h3>
        
        <button
          onClick={fetchBookingReviews}
          disabled={refreshing}
          className="text-sifnos-turquoise hover:text-sifnos-deep-blue flex items-center"
        >
          {refreshing ? (
            <>
              <div className="animate-spin h-4 w-4 border-t-2 border-sifnos-turquoise rounded-full mr-2"></div>
              Refreshing...
            </>
          ) : (
            <>Refresh Reviews</>
          )}
        </button>
      </div>
      
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No Booking.com reviews available yet.</p>
          <button
            onClick={fetchBookingReviews}
            className="mt-4 text-sifnos-turquoise hover:text-sifnos-deep-blue"
          >
            Fetch Reviews from Booking.com
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-b-0 last:pb-0">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-sifnos-turquoise/20 overflow-hidden mr-4 flex-shrink-0 flex items-center justify-center text-sifnos-turquoise font-medium">
                  {review.reviewer_name.charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-wrap justify-between">
                    <div>
                      <h4 className="font-semibold">{review.reviewer_name}</h4>
                      {review.country && (
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Flag size={14} className="mr-1" />
                          {review.country}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(review.date)}
                    </span>
                  </div>
                  
                  <div className="flex my-2">
                    {renderStarRating(review.rating)}
                    <span className="ml-2 text-sm font-medium">{Number(review.rating).toFixed(1)}</span>
                  </div>
                  
                  <p className="text-gray-700">{review.comment}</p>
                  
                  <div className="mt-2 text-xs text-gray-500 flex items-center">
                    <img 
                      src="/uploads/Booking.com.svg" 
                      alt="Booking.com" 
                      className="h-3 mr-1" 
                    />
                    via Booking.com
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 text-center">
        <a 
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sifnos-turquoise hover:text-sifnos-deep-blue inline-flex items-center"
        >
          See all reviews on Booking.com
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default BookingReviews;
