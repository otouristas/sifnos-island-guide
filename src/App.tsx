
import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import AboutPage from './pages/AboutPage';
import FAQPage from './pages/FAQPage';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import LocationsPage from './pages/LocationsPage';
import LocationPage from './pages/LocationPage';
import HotelsPage from './pages/HotelsPage';
import HotelDetailPage from './pages/HotelDetailPage';
import HotelTypesPage from './pages/HotelTypesPage';
import HotelTypePage from './pages/HotelTypePage';
import BeachesPage from './pages/BeachesPage';
import TouristasAIPage from './pages/TouristasAIPage';
import PricingPage from './pages/PricingPage';
import TravelGuidePage from './pages/TravelGuidePage';
import AboutUsPage from './pages/AboutUsPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import ThankYouPage from './pages/ThankYouPage';
import NotFound from './pages/NotFound';
import CookieConsent from './components/CookieConsent';
import { Toaster } from '@/components/ui/toaster';
import SitemapGenerator from './components/SitemapGenerator';
import CacheBuster from './components/CacheBuster';

function App() {
  // State to track if the page has fully loaded, forcing a fresh render
  const [loaded, setLoaded] = useState(false);
  
  // Force component to re-render on load with current timestamp
  useEffect(() => {
    // Set a unique timestamp to force re-render
    const timestamp = Date.now();
    console.log(`App initialized at ${new Date(timestamp).toISOString()}`);
    
    // This timeout ensures a complete page load before setting loaded state
    const timeoutId = setTimeout(() => {
      setLoaded(true);
      console.log("App fully loaded");
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  // Additional timestamp to force hydration to be fresh
  const renderTimestamp = Date.now();

  return (
    <BrowserRouter key={`app-${renderTimestamp}`}>
      <div className="flex flex-col min-h-screen">
        {/* Include the CacheBuster component for real-time updates */}
        <CacheBuster />
        
        {/* Generate sitemap on page load */}
        <SitemapGenerator />
        
        {/* Navigation */}
        <Navigation />
        
        {/* Main content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/locations/:locationSlug" element={<LocationPage />} />
            <Route path="/hotels" element={<HotelsPage />} />
            <Route path="/hotels/:hotelSlug" element={<HotelDetailPage />} />
            <Route path="/hotel-types" element={<HotelTypesPage />} />
            <Route path="/hotel-types/:typeSlug" element={<HotelTypePage />} />
            <Route path="/beaches" element={<BeachesPage />} />
            <Route path="/beaches/:beachSlug" element={<LocationPage />} />
            <Route path="/touristas-ai" element={<TouristasAIPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/travel-guide" element={<TravelGuidePage />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/cookie-policy" element={<CookiePolicyPage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <Footer />
        
        {/* Cookie consent banner */}
        <CookieConsent />
        
        {/* Toast notifications */}
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;
