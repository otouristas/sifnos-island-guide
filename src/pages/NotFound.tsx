
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import SEO from "../components/SEO";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [redirectingToMeropi, setRedirectingToMeropi] = useState(false);

  useEffect(() => {
    // Check if the URL path might be related to Meropi Rooms
    const path = location.pathname.toLowerCase();
    
    if (path.includes('/hotel/') && path.includes('meropi')) {
      // This looks like it might be a misspelled or old URL format for Meropi
      setRedirectingToMeropi(true);
      
      // Show a toast notification
      toast({
        title: "Redirecting...",
        description: "We're taking you to Meropi Rooms and Apartments.",
        duration: 3000,
      });
      
      // Redirect after a short delay
      const timer = setTimeout(() => {
        navigate('/hotels/meropi-rooms-and-apartments');
      }, 1500);
      
      return () => clearTimeout(timer);
    } else if (path.includes('meropi')) {
      // Any URL with 'meropi' that's not found should probably go to the Meropi page
      setRedirectingToMeropi(true);
      
      // Show a toast notification
      toast({
        title: "Redirecting...",
        description: "We're taking you to Meropi Rooms and Apartments.",
        duration: 3000,
      });
      
      // Redirect after a short delay
      const timer = setTimeout(() => {
        navigate('/hotels/meropi-rooms-and-apartments');
      }, 1500);
      
      return () => clearTimeout(timer);
    } else if (path.endsWith('.jpg') || path.endsWith('.png') || path.endsWith('.webp')) {
      // Handle missing image resources
      console.warn(`Missing image resource: ${path}`);
      // We don't need to do anything else since the browser will show fallback images
      return;
    }
    
    // Log the 404 error for analytics
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Show a toast notification for non-image 404s
    toast({
      title: "Page not found",
      description: `The page "${location.pathname}" doesn't exist.`,
      variant: "destructive",
    });
  }, [location.pathname, toast, navigate]);

  return (
    <>
      <SEO 
        title="404 - Page Not Found" 
        description="The page you're looking for doesn't exist on HotelsSifnos.com. Please check the URL or navigate to our homepage."
        keywords={['404', 'page not found', 'error page', 'sifnos hotels']}
        canonical="https://hotelssifnos.com/404"
        noIndex={true}
      />
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h1 className="font-montserrat text-6xl font-bold mb-4 text-sifnos-deep-blue">404</h1>
          <p className="text-2xl font-montserrat text-gray-700 mb-6">Page not found</p>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {redirectingToMeropi 
              ? "We're redirecting you to Meropi Rooms and Apartments..." 
              : "We couldn't find the page you're looking for. It might have been moved or doesn't exist."}
          </p>
          <Link to="/" className="bg-sifnos-turquoise hover:bg-sifnos-deep-blue text-white px-6 py-3 rounded-lg transition-colors duration-300 font-medium">
            Return to Home
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
