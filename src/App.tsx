
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet } from 'react-helmet';

// Pages
import HomePage from "./pages/HomePage";
import HotelsPage from "./pages/HotelsPage";
import FAQPage from "./pages/FAQPage";
import NotFound from "./pages/NotFound";

// Components
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Helmet>
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Hotels Sifnos",
            "url": "https://hotelssifnos.com",
            "logo": "https://hotelssifnos.com/logo.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+302284031234",
              "contactType": "customer service"
            },
            "sameAs": [
              "https://facebook.com/hotelssifnos",
              "https://instagram.com/hotelssifnos"
            ]
          }
        `}</script>
      </Helmet>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/hotels" element={<HotelsPage />} />
            <Route path="/faq" element={<FAQPage />} />
            {/* Add additional routes as they're built */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
