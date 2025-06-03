

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SEO from "./components/SEO";
import SitemapGenerator from "./components/SitemapGenerator";
import CookieConsent from "./components/CookieConsent";
import { TouristasAIMiniBubble } from "./components/touristas";
import ScrollToTop from "./components/ScrollToTop";

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
import FerryTicketsPage from "./pages/FerryTicketsPage";

// Components
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
      <BrowserRouter>
        <ScrollToTop />
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/index" element={<Index />} />
            <Route path="/hotels" element={<HotelsPage />} />
            {/* Hotel detail route */}
            <Route path="/hotels/:slug" element={<HotelDetailPage />} />
            {/* Location routes */}
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/locations/:slug" element={<LocationPage />} />
            {/* Hotel types routes */}
            <Route path="/hotel-types" element={<HotelTypesPage />} />
            <Route path="/hotel-types/:slug" element={<HotelTypePage />} />
            {/* Blog routes */}
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            {/* Ferry tickets route */}
            <Route path="/ferry-tickets" element={<FerryTicketsPage />} />
            {/* Touristas AI route */}
            <Route path="/touristas-ai" element={<TouristasAIPage />} />
            {/* Other routes */}
            <Route path="/beaches" element={<BeachesPage />} />
            <Route path="/travel-guide" element={<TravelGuidePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />
            {/* Pricing and registration */}
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            {/* Legal pages */}
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/cookie-policy" element={<CookiePolicyPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <CookieConsent />
        <TouristasAIMiniBubble />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
