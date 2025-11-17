
import { useEffect, useState } from 'react';
import { Star, Flag, Reply, ThumbsUp, ThumbsDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
      console.log('Fetching hotel data for ID:', hotelId);
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .eq('id', hotelId)
        .single();
        
      if (error) throw error;
      
      console.log('Fetched hotel data:', data);
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
      console.log('Invoking edge function to fetch Booking reviews for hotel ID:', hotelId);
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
      
      console.log('Fetched reviews:', data);
      console.log('Reviews length:', data?.length || 0);
      
      if (data && data.length > 0) {
        setReviews(data);
      } else {
        console.log('No reviews found in the database. Refreshing from Booking.com.');
        // If no reviews are found, try to fetch them from Booking.com
        await fetchBookingReviews();
      }
      
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

  // Subscribe to realtime changes in the reviews table and fetch initial data
  useEffect(() => {
    console.log('BookingReviews component mounted for hotel ID:', hotelId);
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
  
  console.log('Rendering BookingReviews with:', {
    hotelId,
    reviewsCount: reviews.length,
    bookingUrl
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-montserrat font-bold text-sifnos-deep-blue flex items-center">
          <img 
            src="/uploads/Booking.com.svg" 
            alt="Booking.com" 
            className="h-6 mr-2" 
          />
          Reviews
          <span className="ml-2 text-lg text-gray-600 font-normal">({reviews.length})</span>
        </h3>
        
        <Button
          onClick={fetchBookingReviews}
          disabled={refreshing}
          variant="outline"
          className="border-sifnos-turquoise text-sifnos-deep-blue hover:bg-sifnos-turquoise/10"
        >
          {refreshing ? (
            <>
              <div className="animate-spin h-4 w-4 border-t-2 border-sifnos-turquoise rounded-full mr-2"></div>
              Refreshing...
            </>
          ) : (
            <>Refresh Reviews</>
          )}
        </Button>
      </div>
      
      {reviews.length === 0 ? (
        <Card className="p-8">
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">No Booking.com reviews available yet.</p>
            <Button
              onClick={fetchBookingReviews}
              className="bg-sifnos-turquoise hover:bg-sifnos-deep-blue text-white"
            >
              Fetch Reviews from Booking.com
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 md:space-y-6">
          {reviews.map((review) => (
            <Card key={review.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                  {/* Avatar - smaller on mobile */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-sifnos-turquoise to-sifnos-deep-blue overflow-hidden flex-shrink-0 flex items-center justify-center text-white font-semibold text-base sm:text-lg">
                    {review.reviewer_name.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="flex-1 w-full min-w-0">
                    {/* Header - stack on mobile */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2 mb-2 sm:mb-3">
                      <div className="min-w-0">
                        <h4 className="font-semibold text-base sm:text-lg text-sifnos-deep-blue truncate">
                          {review.reviewer_name}
                        </h4>
                        {review.country && (
                          <div className="flex items-center text-xs sm:text-sm text-gray-600 mt-1">
                            <Flag size={12} className="mr-1 flex-shrink-0" />
                            <span className="truncate">{review.country}</span>
                          </div>
                        )}
                      </div>
                      <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                        {formatDate(review.date)}
                      </span>
                    </div>
                    
                    {/* Rating - smaller on mobile */}
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <div className="flex gap-0.5">
                        {renderStarRating(review.rating)}
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-gray-700">
                        {Number(review.rating).toFixed(1)}
                      </span>
                    </div>
                    
                    {/* Comment - better line-height on mobile */}
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4 break-words">
                      {review.comment}
                    </p>
                    
                    {/* Actions - wrap on mobile */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 pt-2 sm:pt-3 border-t border-gray-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs sm:text-sm text-gray-600 hover:text-sifnos-turquoise h-8"
                      >
                        <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Helpful
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs sm:text-sm text-gray-600 hover:text-sifnos-turquoise h-8"
                      >
                        <ThumbsDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Not Helpful
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs sm:text-sm text-gray-600 hover:text-sifnos-turquoise h-8"
                      >
                        <Reply className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Reply
                      </Button>
                      <div className="ml-auto text-xs text-gray-500 flex items-center flex-shrink-0">
                        <img 
                          src="/uploads/Booking.com.svg" 
                          alt="Booking.com" 
                          className="h-3 mr-1" 
                        />
                        <span className="hidden sm:inline">via Booking.com</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <div className="mt-6 text-center">
        <a 
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sifnos-turquoise hover:text-sifnos-deep-blue inline-flex items-center font-medium"
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
