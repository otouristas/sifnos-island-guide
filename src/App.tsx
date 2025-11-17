console.log('[APP.TSX] 🚀 Starting App.tsx module evaluation');
import { Suspense, lazy, ReactNode } from "react";
console.log('[APP.TSX] ✅ React hooks imported');
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import SEO from "./components/SEO";
import SitemapGenerator from "./components/SitemapGenerator";
import CookieConsent from "./components/CookieConsent";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./lib/auth";
import { TouristasProvider } from "./contexts/TouristasContext";
console.log('[APP.TSX] 📦 About to import I18nProvider...');
import { I18nProvider } from "./contexts/I18nContext";
console.log('[APP.TSX] ✅ I18nProvider imported successfully');
import TouristasChat from "./components/TouristasChat";
import { TouristasToggle } from "./components/TouristasToggle";
import { ErrorBoundary } from "./components/ErrorBoundary";
import LoadingSkeleton from "./components/shared/LoadingSkeleton";

// Components (not lazy loaded - needed immediately)
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

// Layouts
const DashboardLayout = lazy(() => import("./layouts/DashboardLayout"));

// Protected Route Component
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load pages for code splitting
const HomePage = lazy(() => import("./pages/HomePage"));
const HotelsPage = lazy(() => import("./pages/HotelsPage"));
const HotelDetailPage = lazy(() => import("./pages/HotelDetailPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const TravelGuidePage = lazy(() => import("./pages/TravelGuidePage"));
const BeachesPage = lazy(() => import("./pages/BeachesPage"));
const AboutUsPage = lazy(() => import("./pages/AboutUsPage"));
const LocationsPage = lazy(() => import("./pages/LocationsPage"));
const LocationPage = lazy(() => import("./pages/LocationPage"));
const HotelTypesPage = lazy(() => import("./pages/HotelTypesPage"));
const HotelTypePage = lazy(() => import("./pages/HotelTypePage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsOfServicePage = lazy(() => import("./pages/TermsOfServicePage"));
const CookiePolicyPage = lazy(() => import("./pages/CookiePolicyPage"));
const Index = lazy(() => import("./pages/Index"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const ThankYouPage = lazy(() => import("./pages/ThankYouPage"));
const TouristasAIPage = lazy(() => import("./pages/TouristasAIPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const FerryTicketsPage = lazy(() => import("./pages/FerryTicketsPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const FavoritesPage = lazy(() => import("./pages/FavoritesPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const DashboardOverview = lazy(() => import("./pages/dashboard/DashboardOverview"));
const DashboardMessages = lazy(() => import("./pages/dashboard/DashboardMessages"));
const DashboardSettings = lazy(() => import("./pages/dashboard/DashboardSettings"));
const MyHotels = lazy(() => import("./pages/dashboard/MyHotels"));
const FeaturedHotelsManagement = lazy(() => import("./pages/dashboard/FeaturedHotelsManagement"));
const ResetPasswordPage = lazy(() => import("./pages/auth/ResetPasswordPage"));
const AgodaTestPage = lazy(() => import('./pages/AgodaTestPage'));
const AgodaDirectTestPage = lazy(() => import('./pages/AgodaDirectTestPage'));
const HotelMatchingTestPage = lazy(() => import('./pages/HotelMatchingTestPage'));
const WhereToStaySifnosPage = lazy(() => import('./pages/WhereToStaySifnosPage'));
const BestBeachesSifnosPage = lazy(() => import('./pages/BestBeachesSifnosPage'));
const LuxuryHotelsSifnosPage = lazy(() => import('./pages/LuxuryHotelsSifnosPage'));
const TravelPackagesPage = lazy(() => import('./pages/TravelPackagesPage'));

// Guest portal components
const GuestShell = lazy(() => import("./components/guest/layout/GuestShell").then(m => ({ default: m.GuestShell })));
const GuestHome = lazy(() => import("./components/guest/GuestHome").then(m => ({ default: m.GuestHome })));
const GuestGuide = lazy(() => import("./components/guest/GuestGuide").then(m => ({ default: m.GuestGuide })));
const Requests = lazy(() => import("./components/guest/Requests").then(m => ({ default: m.Requests })));
const AreaGuide = lazy(() => import("./components/guest/AreaGuide").then(m => ({ default: m.AreaGuide })));
const GuestSettings = lazy(() => import("./components/guest/Settings"));

console.log('[APP.TSX] 🎯 Creating QueryClient and components');
const queryClient = new QueryClient();
console.log('[APP.TSX] ✅ QueryClient created');

// Layout wrapper to conditionally show navigation/footer
const LayoutWrapper = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const isGuestPortal = location.pathname.startsWith('/h/');
  
  return (
    <>
      {!isGuestPortal && <Navigation />}
      {!isGuestPortal && <div className="h-14 md:h-[72px]" />}
      {children}
      {!isGuestPortal && <Footer />}
      {!isGuestPortal && <CookieConsent />}
      {!isGuestPortal && <TouristasToggle />}
      {!isGuestPortal && <TouristasChat />}
    </>
  );
};

const App = () => {
  console.log('[APP.TSX] 🎨 App component rendering');
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <I18nProvider>
        <TouristasProvider>
        <SEO 
          title="Find Your Perfect Stay in Sifnos - Best Hotels & Accommodation"
          description="Discover Sifnos' premier hotel booking platform with exclusive deals, verified reviews, and local expertise. Compare accommodations across all island locations and find your perfect Greek island getaway with our best price guarantee."
          keywords={[
            'sifnos hotels', 'greek islands hotels', 'sifnos accommodation', 
            'luxury hotels sifnos', 'beach hotels sifnos', 'boutique hotels cyclades',
            'where to stay in sifnos', 'best hotels sifnos greece'
          ]}
          schemaType="WebPage"
          canonical="https://hotelssifnos.com"
          imageUrl="/uploads/sifnos-og-image.jpg"
        />
        <SitemapGenerator />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ErrorBoundary>
            <ScrollToTop />
            <LayoutWrapper>
              <main>
                <Suspense fallback={
                  <div className="container mx-auto py-12 px-4">
                    <LoadingSkeleton type="text" count={3} />
                  </div>
                }>
                  <Routes>
                  {/* Guest Portal Routes */}
                  <Route path="/h/:hotelSlug/g/:guestToken" element={<GuestShell />}>
                    <Route index element={<GuestHome />} />
                    <Route path="guide" element={<GuestGuide />} />
                    <Route path="area" element={<AreaGuide />} />
                    <Route path="requests" element={<Requests />} />
                    <Route path="settings" element={<GuestSettings />} />
                  </Route>

                  {/* Main Site Routes */}
                  <Route path="/" element={<HomePage />} />
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
                  {/* Travel packages route */}
                  <Route path="/packages" element={<TravelPackagesPage />} />
                  {/* SEO-optimized content pages */}
                  <Route path="/where-to-stay-sifnos" element={<WhereToStaySifnosPage />} />
                  <Route path="/best-beaches-sifnos-guide" element={<BestBeachesSifnosPage />} />
                  <Route path="/luxury-hotels-sifnos" element={<LuxuryHotelsSifnosPage />} />
                  {/* Touristas AI route */}
                  <Route path="/touristas-ai" element={<TouristasAIPage />} />
                  {/* User account routes */}
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  {/* Auth routes */}
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/agoda-test" element={<AgodaTestPage />} />
                  <Route path="/agoda-direct-test" element={<AgodaDirectTestPage />} />
                  <Route path="/hotel-matching-test" element={<HotelMatchingTestPage />} />
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
                  {/* Dashboard routes - Protected and wrapped with DashboardLayout */}
                  <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                    <Route index element={<DashboardOverview />} />
                    <Route path="messages" element={<DashboardMessages />} />
                    <Route path="settings" element={<DashboardSettings />} />
                    <Route path="my-hotels" element={<MyHotels />} />
                    <Route path="featured-hotels" element={<FeaturedHotelsManagement />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            </LayoutWrapper>
          </ErrorBoundary>
        </BrowserRouter>
        </TouristasProvider>
        </I18nProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
