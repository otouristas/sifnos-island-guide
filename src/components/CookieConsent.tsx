
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAcceptedCookies = localStorage.getItem('cookiesAccepted');
    if (!hasAcceptedCookies) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm">
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-lg">Cookie Notice</h3>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">
          We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
        </p>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={acceptCookies}
            className="bg-sifnos-turquoise hover:bg-sifnos-deep-blue text-white px-4 py-2 rounded text-sm font-medium transition-colors"
          >
            Accept
          </button>
          <a
            href="/privacy-policy"
            className="text-sifnos-turquoise hover:text-sifnos-deep-blue text-sm underline flex items-center"
          >
            Read our Cookie Policy
          </a>
        </div>
      </div>
    </div>
  );
}
