import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy, ReactElement } from 'react';

// Critical pages (loaded immediately for better UX)
import HomePage from '../pages/HomePage';
import HotelsPage from '../pages/HotelsPage';
import HotelDetailPage from '../pages/HotelDetailPage';

// Lazy loaded pages
const ContactPage = lazy(() => import('../pages/ContactPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const FAQPage = lazy(() => import('../pages/FAQPage'));
const NotFound = lazy(() => import('../pages/NotFound'));
const TravelGuidePage = lazy(() => import('../pages/TravelGuidePage'));
const BeachesPage = lazy(() => import('../pages/BeachesPage'));
const AboutUsPage = lazy(() => import('../pages/AboutUsPage'));
const LocationsPage = lazy(() => import('../pages/LocationsPage'));
const LocationPage = lazy(() => import('../pages/LocationPage'));
const HotelTypesPage = lazy(() => import('../pages/HotelTypesPage'));
const HotelTypePage = lazy(() => import('../pages/HotelTypePage'));
const PrivacyPolicyPage = lazy(() => import('../pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('../pages/TermsOfServicePage'));
const CookiePolicyPage = lazy(() => import('../pages/CookiePolicyPage'));
const PricingPage = lazy(() => import('../pages/PricingPage'));
const ThankYouPage = lazy(() => import('../pages/ThankYouPage'));
const TouristasAIPage = lazy(() => import('../pages/TouristasAIPage'));
const BlogPage = lazy(() => import('../pages/BlogPage'));
const BlogPostPage = lazy(() => import('../pages/BlogPostPage'));
const FerryTicketsPage = lazy(() => import('../pages/FerryTicketsPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const FavoritesPage = lazy(() => import('../pages/FavoritesPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));

// Dashboard Pages
const DashboardOverview = lazy(() => import('../pages/dashboard/DashboardOverview'));
const DashboardMessages = lazy(() => import('../pages/dashboard/DashboardMessages'));
const DashboardSettings = lazy(() => import('../pages/dashboard/DashboardSettings'));
const MyHotels = lazy(() => import('../pages/dashboard/MyHotels'));
const FeaturedHotelsManagement = lazy(() => import('../pages/dashboard/FeaturedHotelsManagement'));

// Auth Pages
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));

// Test Pages
const AgodaTestPage = lazy(() => import('../pages/AgodaTestPage'));
const AgodaDirectTestPage = lazy(() => import('../pages/AgodaDirectTestPage'));
const HotelMatchingTestPage = lazy(() => import('../pages/HotelMatchingTestPage'));

// SEO Pages
const WhereToStaySifnosPage = lazy(() => import('../pages/WhereToStaySifnosPage'));
const BestBeachesSifnosPage = lazy(() => import('../pages/BestBeachesSifnosPage'));
const LuxuryHotelsSifnosPage = lazy(() => import('../pages/LuxuryHotelsSifnosPage'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sifnos-deep-blue"></div>
  </div>
);

/**
 * Define all routes once
 */
const routeDefinitions = [
  { path: '/', element: <HomePage /> },
  { path: '/hotels', element: <HotelsPage /> },
  { path: '/hotels/:slug', element: <HotelDetailPage /> },
  { path: '/locations', element: <LocationsPage /> },
  { path: '/locations/:slug', element: <LocationPage /> },
  { path: '/hotel-types', element: <HotelTypesPage /> },
  { path: '/hotel-types/:slug', element: <HotelTypePage /> },
  { path: '/blog', element: <BlogPage /> },
  { path: '/blog/:slug', element: <BlogPostPage /> },
  { path: '/ferry-tickets', element: <FerryTicketsPage /> },
  { path: '/where-to-stay-sifnos', element: <WhereToStaySifnosPage /> },
  { path: '/best-beaches-sifnos-guide', element: <BestBeachesSifnosPage /> },
  { path: '/luxury-hotels-sifnos', element: <LuxuryHotelsSifnosPage /> },
  { path: '/touristas-ai', element: <TouristasAIPage /> },
  { path: '/profile', element: <ProfilePage /> },
  { path: '/favorites', element: <FavoritesPage /> },
  { path: '/settings', element: <SettingsPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
  { path: '/beaches', element: <BeachesPage /> },
  { path: '/travel-guide', element: <TravelGuidePage /> },
  { path: '/about', element: <AboutPage /> },
  { path: '/about-us', element: <AboutUsPage /> },
  { path: '/contact', element: <ContactPage /> },
  { path: '/faq', element: <FAQPage /> },
  { path: '/pricing', element: <PricingPage /> },
  { path: '/thank-you', element: <ThankYouPage /> },
  { path: '/privacy-policy', element: <PrivacyPolicyPage /> },
  { path: '/terms-of-service', element: <TermsOfServicePage /> },
  { path: '/cookie-policy', element: <CookiePolicyPage /> },
  { path: '/dashboard', element: <DashboardOverview /> },
  { path: '/dashboard/messages', element: <DashboardMessages /> },
  { path: '/dashboard/settings', element: <DashboardSettings /> },
  { path: '/dashboard/my-hotels', element: <MyHotels /> },
  { path: '/dashboard/featured-hotels', element: <FeaturedHotelsManagement /> },
  // Test pages
  { path: '/agoda-test', element: <AgodaTestPage /> },
  { path: '/agoda-direct-test', element: <AgodaDirectTestPage /> },
  { path: '/hotel-matching-test', element: <HotelMatchingTestPage /> },
];

// Language prefixes
const languagePrefixes = ['', '/gr', '/fr', '/it', '/de', '/sv', '/ru', '/tr'];

/**
 * Component that renders all routes with and without language prefixes
 */
export function LanguageAwareRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Generate routes for each language */}
        {languagePrefixes.map((prefix) =>
          routeDefinitions.map((route) => (
            <Route
              key={`${prefix}${route.path}`}
              path={`${prefix}${route.path}`}
              element={route.element}
            />
          ))
        )}
        
        {/* 404 - catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

