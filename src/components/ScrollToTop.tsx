
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component that automatically scrolls to the top of the page
 * when navigating between routes
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // Scroll to top with auto behavior for smooth but quick navigation
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    });
    
    // Additional approach to ensure Safari and older browsers work correctly
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0; // For Safari
  }, [pathname]); // Re-run this effect when the route changes

  return null; // This component doesn't render anything
}
