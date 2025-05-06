
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import HotelsPage from './pages/HotelsPage';
import HotelDetailPage from './pages/HotelDetailPage';
import LocationsPage from './pages/LocationsPage';
import LocationPage from './pages/LocationPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFound from './pages/NotFound';
import Index from './pages/Index';
import FAQPage from './pages/FAQPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import HotelTypesPage from './pages/HotelTypesPage';
import HotelTypePage from './pages/HotelTypePage';
import PricingPage from './pages/PricingPage';
import ThankYouPage from './pages/ThankYouPage';
import TravelGuidePage from './pages/TravelGuidePage';
import BeachesPage from './pages/BeachesPage';
import TouristasAIPage from './pages/TouristasAIPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/hotels" element={<HotelsPage />} />
      <Route path="/hotels/:slug" element={<HotelDetailPage />} />
      <Route path="/locations" element={<LocationsPage />} />
      <Route path="/locations/:slug" element={<LocationPage />} />
      <Route path="/hotel-types" element={<HotelTypesPage />} />
      <Route path="/hotel-types/:slug" element={<HotelTypePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/terms-of-service" element={<TermsOfServicePage />} />
      <Route path="/cookie-policy" element={<CookiePolicyPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/thank-you" element={<ThankYouPage />} />
      <Route path="/travel-guide" element={<TravelGuidePage />} />
      <Route path="/beaches" element={<BeachesPage />} />
      <Route path="/touristas-ai" element={<TouristasAIPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
