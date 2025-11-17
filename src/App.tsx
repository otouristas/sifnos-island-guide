import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import SEO from "./components/SEO";
import SitemapGenerator from "./components/SitemapGenerator";
import CookieConsent from "./components/CookieConsent";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./lib/auth";
import { TouristasProvider } from "./contexts/TouristasContext";
import { I18nProvider } from "./contexts/I18nContext";
import { TouristasChat } from "./components/TouristasChat";
import { TouristasToggle } from "./components/TouristasToggle";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LanguageRouterWrapper } from "./components/LanguageRouterWrapper";
import { LanguageAwareRoutes } from "./components/LanguageAwareRoutes";

// Components (not lazy loaded - needed immediately)
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

const App = () => (
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
          <LanguageRouterWrapper>
            <ErrorBoundary>
              <ScrollToTop />
              <Navigation />
              {/* Spacer for fixed header */}
              <div className="h-14 md:h-[72px]" />
              <main>
                <LanguageAwareRoutes />
              </main>
              <Footer />
              <CookieConsent />
              <TouristasToggle />
              <TouristasChat />
            </ErrorBoundary>
          </LanguageRouterWrapper>
        </BrowserRouter>
        </TouristasProvider>
        </I18nProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
