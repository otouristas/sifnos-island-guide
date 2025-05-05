import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import HotelsPage from './pages/HotelsPage';
import HotelDetailsPage from './pages/HotelDetailsPage';
import CookieConsent from './components/CookieConsent';
import { Toaster } from "@/components/ui/toaster"
import NotFound from './pages/NotFound';
import ContactPage from './pages/ContactPage';
import RegistrationPage from './pages/RegistrationPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import TouristasAIPage from './pages/TouristasAIPage';

function App() {
  const [showCookieConsent, setShowCookieConsent] = useState(false);

  useEffect(() => {
    const hasConsent = localStorage.getItem('cookieConsent');
    setShowCookieConsent(!hasConsent);
  }, []);
  
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/hotels" element={<HotelsPage />} />
            <Route path="/hotels/:hotelSlug" element={<HotelDetailsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/touristas-ai" element={<TouristasAIPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <CookieConsent />
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;
