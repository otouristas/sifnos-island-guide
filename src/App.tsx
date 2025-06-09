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
import { AuthProvider } from "./lib/auth"; // Import AuthProvider

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
import ProfilePage from "./pages/ProfilePage";
import FavoritesPage from "./pages/FavoritesPage";
import SettingsPage from "./pages/SettingsPage";

// Dashboard Pages
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import MyHotels from "./pages/dashboard/MyHotels";
import DashboardMessages from "./pages/dashboard/DashboardMessages";
import DashboardSettings from "./pages/dashboard/DashboardSettings";

// Components
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider> {/* Wrap the app with AuthProvider */}
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
          <Routes>
            {/* Dashboard Routes - Protected */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardOverview />} />
              <Route path="hotels" element={<MyHotels />} />
              <Route path="messages" element={<DashboardMessages />} />
              <Route path="settings" element={<DashboardSettings />} />
            </Route>
            
            {/* Public Routes */}
            <Route path="/" element={
              <>
                <Navigation />
                <main>
                  <HomePage />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/index" element={
              <>
                <Navigation />
                <main>
                  <Index />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/hotels" element={
              <>
                <Navigation />
                <main>
                  <HotelsPage />
                </main>
                <Footer />
              </>
            } />
            
            {/* Hotel detail route */}
            <Route path="/hotels/:slug" element={
              <>
                <Navigation />
                <main>
                  <HotelDetailPage />
                </main>
                <Footer />
              </>
            } />
            
            {/* Location routes */}
            <Route path="/locations" element={
              <>
                <Navigation />
                <main>
                  <LocationsPage />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/locations/:slug" element={
              <>
                <Navigation />
                <main>
                  <LocationPage />
                </main>
                <Footer />
              </>
            } />
            
            {/* Hotel types routes */}
            <Route path="/hotel-types" element={
              <>
                <Navigation />
                <main>
                  <HotelTypesPage />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/hotel-types/:slug" element={
              <>
                <Navigation />
                <main>
                  <HotelTypePage />
                </main>
                <Footer />
              </>
            } />
            
            {/* Blog routes */}
            <Route path="/blog" element={
              <>
                <Navigation />
                <main>
                  <BlogPage />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/blog/:slug" element={
              <>
                <Navigation />
                <main>
                  <BlogPostPage />
                </main>
                <Footer />
              </>
            } />
            
            {/* Ferry tickets route */}
            <Route path="/ferry-tickets" element={
              <>
                <Navigation />
                <main>
                  <FerryTicketsPage />
                </main>
                <Footer />
              </>
            } />
            
            {/* Touristas AI route */}
            <Route path="/touristas-ai" element={
              <>
                <Navigation />
                <main>
                  <TouristasAIPage />
                </main>
                <Footer />
              </>
            } />
            
            {/* Other routes */}
            <Route path="/beaches" element={
              <>
                <Navigation />
                <main>
                  <BeachesPage />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/travel-guide" element={
              <>
                <Navigation />
                <main>
                  <TravelGuidePage />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/about" element={
              <>
                <Navigation />
                <main>
                  <AboutPage />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/about-us" element={
              <>
                <Navigation />
                <main>
                  <AboutUsPage />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/contact" element={
              <>
                <Navigation />
                <main>
                  <ContactPage />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/faq" element={
              <>
                <Navigation />
                <main>
                  <FAQPage />
                </main>
                <Footer />
              </>
            } />
            
            {/* Pricing and registration */}
            <Route path="/pricing" element={
              <>
                <Navigation />
                <main>
                  <PricingPage />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/thank-you" element={
              <>
                <Navigation />
                <main>
                  <ThankYouPage />
                </main>
                <Footer />
              </>
            } />
            
            {/* Legal pages */}
            <Route path="/privacy-policy" element={
              <>
                <Navigation />
                <main>
                  <PrivacyPolicyPage />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/terms-of-service" element={
              <>
                <Navigation />
                <main>
                  <TermsOfServicePage />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/cookie-policy" element={
              <>
                <Navigation />
                <main>
                  <CookiePolicyPage />
                </main>
                <Footer />
              </>
            } />
            
            {/* User account pages */}
            <Route path="/profile" element={
              <>
                <Navigation />
                <main>
                  <ProfilePage />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/favorites" element={
              <>
                <Navigation />
                <main>
                  <FavoritesPage />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/settings" element={
              <>
                <Navigation />
                <main>
                  <SettingsPage />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="*" element={
              <>
                <Navigation />
                <main>
                  <NotFound />
                </main>
                <Footer />
              </>
            } />
          </Routes>
          <CookieConsent />
          <TouristasAIMiniBubble />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;