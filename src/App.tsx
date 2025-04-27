import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SEO from "./components/SEO";
import SitemapGenerator from "./components/SitemapGenerator";
import CookieConsent from "./components/CookieConsent";

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

// Components
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SEO 
        title="Find Your Perfect Stay in Sifnos - Best Hotels & Accommodation"
        description="Discover handpicked hotels and luxury accommodations in Sifnos Island, Greece. Compare prices, read reviews, and book your perfect beach vacation in the Cyclades."
        keywords={[
          'sifnos hotels', 'greek islands hotels', 'sifnos accommodation', 
          'luxury hotels sifnos', 'beach hotels sifnos', 'boutique hotels cyclades',
          'where to stay in sifnos', 'best hotels sifnos greece'
        ]}
        schemaType="Organization"
        canonical="https://hotelssifnos.com"
        imageUrl="https://hotelssifnos.com/opengraph-image-p98pqg.png"
      />
      <SitemapGenerator />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/hotels" element={<HotelsPage />} />
            <Route path="/hotels/:id" element={<HotelDetailPage />} />
            <Route path="/beaches" element={<BeachesPage />} />
            <Route path="/travel-guide" element={<TravelGuidePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <CookieConsent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
