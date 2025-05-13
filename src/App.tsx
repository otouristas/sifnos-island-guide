import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { LanguageProvider } from "@/i18n/LanguageContext";
import SEO from "./components/SEO";
import SitemapGenerator from "./components/SitemapGenerator";
import CookieConsent from "./components/CookieConsent";
import { TouristasAIMiniBubble } from "./components/touristas";
import { supportedLanguages, defaultLanguage } from './i18n';

// Pages
import HomePage from "./pages/HomePage";
import HotelsPage from "./pages/HotelsPage";
import HotelDetailPage from "./pages/HotelDetailPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import FAQPage from "./pages/FAQPage";
import NotFound from "./pages/NotFound";
import TravelGuidePage from "./pages/TravelGuidePage";
import BeachesPage from "./pages/BeachesPage";
import AboutUsPage from "./pages/AboutUsPage";
import LocationsPage from "./pages/LocationsPage";
import LocationPage from "./pages/LocationPage";
import HotelTypesPage from "./pages/HotelTypesPage";
import HotelTypePage from "./pages/HotelTypePage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import CookiePolicyPage from "./pages/CookiePolicyPage";
import Index from "./pages/Index";
import PricingPage from "./pages/PricingPage";
import ThankYouPage from "./pages/ThankYouPage";
import TouristasAIPage from "./pages/TouristasAIPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";

// Components
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";

// Import i18n
import "./i18n";

const queryClient = new QueryClient();

// Create a route wrapper that adds language prefix
const LanguageRoutes = () => {
  const langsPattern = supportedLanguages.join('|');
  
  return (
    <Routes>
      {/* Redirect root to default language */}
      <Route path="/" element={<Navigate to={`/${defaultLanguage}`} replace />} />
      
      {/* Language prefixed routes */}
      <Route path={`:lang(${langsPattern})`} element={<HomePage />} />
      <Route path={`:lang(${langsPattern})/index`} element={<Index />} />
      <Route path={`:lang(${langsPattern})/hotels`} element={<HotelsPage />} />
      <Route path={`:lang(${langsPattern})/hotels/:slug`} element={<HotelDetailPage />} />
      <Route path={`:lang(${langsPattern})/locations`} element={<LocationsPage />} />
      <Route path={`:lang(${langsPattern})/locations/:slug`} element={<LocationPage />} />
      <Route path={`:lang(${langsPattern})/hotel-types`} element={<HotelTypesPage />} />
      <Route path={`:lang(${langsPattern})/hotel-types/:slug`} element={<HotelTypePage />} />
      <Route path={`:lang(${langsPattern})/blog`} element={<BlogPage />} />
      <Route path={`:lang(${langsPattern})/blog/:slug`} element={<BlogPostPage />} />
      <Route path={`:lang(${langsPattern})/touristas-ai`} element={<TouristasAIPage />} />
      <Route path={`:lang(${langsPattern})/beaches`} element={<BeachesPage />} />
      <Route path={`:lang(${langsPattern})/travel-guide`} element={<TravelGuidePage />} />
      <Route path={`:lang(${langsPattern})/about`} element={<AboutPage />} />
      <Route path={`:lang(${langsPattern})/about-us`} element={<AboutUsPage />} />
      <Route path={`:lang(${langsPattern})/contact`} element={<ContactPage />} />
      <Route path={`:lang(${langsPattern})/faq`} element={<FAQPage />} />
      <Route path={`:lang(${langsPattern})/pricing`} element={<PricingPage />} />
      <Route path={`:lang(${langsPattern})/thank-you`} element={<ThankYouPage />} />
      <Route path={`:lang(${langsPattern})/privacy-policy`} element={<PrivacyPolicyPage />} />
      <Route path={`:lang(${langsPattern})/terms-of-service`} element={<TermsOfServicePage />} />
      <Route path={`:lang(${langsPattern})/cookie-policy`} element={<CookiePolicyPage />} />
      
      {/* Legacy routes - redirect to language prefixed */}
      <Route path="/index" element={<Navigate to={`/${defaultLanguage}/index`} replace />} />
      <Route path="/hotels" element={<Navigate to={`/${defaultLanguage}/hotels`} replace />} />
      <Route path="/hotels/:slug" element={<HotelDetailPage />} />
      <Route path="/locations" element={<Navigate to={`/${defaultLanguage}/locations`} replace />} />
      <Route path="/locations/:slug" element={<LocationPage />} />
      <Route path="/hotel-types" element={<Navigate to={`/${defaultLanguage}/hotel-types`} replace />} />
      <Route path="/hotel-types/:slug" element={<HotelTypePage />} />
      <Route path="/blog" element={<Navigate to={`/${defaultLanguage}/blog`} replace />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="/touristas-ai" element={<Navigate to={`/${defaultLanguage}/touristas-ai`} replace />} />
      <Route path="/beaches" element={<Navigate to={`/${defaultLanguage}/beaches`} replace />} />
      <Route path="/travel-guide" element={<Navigate to={`/${defaultLanguage}/travel-guide`} replace />} />
      <Route path="/about" element={<Navigate to={`/${defaultLanguage}/about`} replace />} />
      <Route path="/about-us" element={<Navigate to={`/${defaultLanguage}/about-us`} replace />} />
      <Route path="/contact" element={<Navigate to={`/${defaultLanguage}/contact`} replace />} />
      <Route path="/faq" element={<Navigate to={`/${defaultLanguage}/faq`} replace />} />
      <Route path="/pricing" element={<Navigate to={`/${defaultLanguage}/pricing`} replace />} />
      <Route path="/thank-you" element={<Navigate to={`/${defaultLanguage}/thank-you`} replace />} />
      <Route path="/privacy-policy" element={<Navigate to={`/${defaultLanguage}/privacy-policy`} replace />} />
      <Route path="/terms-of-service" element={<Navigate to={`/${defaultLanguage}/terms-of-service`} replace />} />
      <Route path="/cookie-policy" element={<Navigate to={`/${defaultLanguage}/cookie-policy`} replace />} />
      
      {/* Catch all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <LanguageProvider>
        <TooltipProvider>
          <SEO 
            title="Find Your Perfect Stay in Sifnos - Best Hotels & Accommodation"
            description="Discover Sifnos' premier hotel booking platform with exclusive deals, verified reviews, and local expertise. Compare accommodations across all island locations and find your perfect Greek island getaway with our best price guarantee."
            keywords={[
              'sifnos hotels', 'greek islands hotels', 'sifnos accommodation', 
              'luxury hotels sifnos', 'beach hotels sifnos', 'boutique hotels cyclades',
              'where to stay in sifnos', 'best hotels sifnos greece'
            ]}
            schemaType="Organization"
            canonical="https://hotelssifnos.com"
            imageUrl="/uploads/sifnos-og-image.jpg"
          />
          <SitemapGenerator />
          <Toaster />
          <Sonner />
          <Suspense fallback={<LoadingSpinner />}>
            <Navigation />
            <main>
              <LanguageRoutes />
            </main>
            <Footer />
            <CookieConsent />
            <TouristasAIMiniBubble />
          </Suspense>
        </TooltipProvider>
      </LanguageProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
