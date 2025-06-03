
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import HotelsPage from './pages/HotelsPage'
import HotelDetailPage from './pages/HotelDetailPage'
import HotelTypePage from './pages/HotelTypePage'
import HotelTypesPage from './pages/HotelTypesPage'
import LocationPage from './pages/LocationPage'
import LocationsPage from './pages/LocationsPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import FerryTicketsPage from './pages/FerryTicketsPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import TravelGuidePage from './pages/TravelGuidePage'
import BeachesPage from './pages/BeachesPage'
import AboutUsPage from './pages/AboutUsPage'
import PricingPage from './pages/PricingPage'
import TouristasAIPage from './pages/TouristasAIPage'
import NotFound from './pages/NotFound'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import CookiePolicyPage from './pages/CookiePolicyPage'
import ThankYouPage from './pages/ThankYouPage'
import ScrollToTop from './components/ScrollToTop'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import CookieConsent from './components/CookieConsent'
import { Toaster } from './components/ui/toaster'
import 'react-day-picker/dist/style.css'
import './App.css'

// Dashboard Pages
import HotelDashboardPage from './pages/HotelDashboardPage'
import DashboardAuthPage from './pages/DashboardAuthPage'

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Routes>
          {/* Dashboard Routes without Navigation/Footer */}
          <Route path="/dashboard" element={<HotelDashboardPage />} />
          <Route path="/dashboard/auth" element={<DashboardAuthPage />} />
          
          {/* Public Routes with Navigation/Footer */}
          <Route path="/" element={
            <>
              <Navigation />
              <div className="flex-grow">
                <HomePage />
              </div>
              <Footer />
            </>
          } />
          <Route path="/hotels" element={
            <>
              <Navigation />
              <div className="flex-grow">
                <HotelsPage />
              </div>
              <Footer />
            </>
          } />
          <Route path="/hotels/:hotelId" element={
            <>
              <Navigation />
              <div className="flex-grow">
                <HotelDetailPage />
              </div>
              <Footer />
            </>
          } />
          <Route path="/hotel-types" element={
            <>
              <Navigation />
              <div className="flex-grow">
                <HotelTypesPage />
              </div>
              <Footer />
            </>
          } />
          <Route path="/hotel-type/:hotelType" element={
            <>
              <Navigation />
              <div className="flex-grow">
                <HotelTypePage />
              </div>
              <Footer />
            </>
          } />
          <Route path="/locations" element={
            <>
              <Navigation />
              <div className="flex-grow">
                <LocationsPage />
              </div>
              <Footer />
            </>
          } />
          <Route path="/location/:locationName" element={
            <>
              <Navigation />
              <div className="flex-grow">
                <LocationPage />
              </div>
              <Footer />
            </>
          } />
          <Route path="/ferry-tickets" element={
            <>
              <Navigation />
              <div className="flex-grow">
                <FerryTicketsPage />
              </div>
              <Footer />
            </>
          } />
          <Route path="/touristas-ai" element={
            <>
              <Navigation />
              <div className="flex-grow">
                <TouristasAIPage />
              </div>
              <Footer />
            </>
          } />
          <Route path="/about" element={
            <>
              <Navigation />
              <div className="flex-grow">
                <AboutPage />
              </div>
              <Footer />
            </>
          } />
          <Route path="/contact" element={
            <>
              <Navigation />
              <div className="flex-grow">
                <ContactPage />
              </div>
              <Footer />
            </>
          } />
          <Route path="/blog" element={
            <>
              <Navigation />
              <div className="flex-grow">
                <BlogPage />
              </div>
              <Footer />
            </>
          } />
          <Route path="/blog/:postId" element={
            <>
              <Navigation />
              <div className="flex-grow">
                <BlogPostPage />
              </div>
              <Footer />
            </>
          } />
          <Route path="/travel-guide" element={
            <>
              <Navigation />
              <div className="flex-grow">
                <TravelGuidePage />
              </div>
              <Footer />
            </>
          } />
          <Route path="/beaches" element={
            <>
              <Navigation />
              <div className="flex-grow">
                <BeachesPage />
              </div>
              <Footer />
            </>
          } />
          <Route path="/about-us" element={
            <>
              <Navigation />
              <div className="flex-grow">
                <AboutUsPage />
              </div>
              <Footer />
            </>
          } />
          <Route path="/pricing" element={
            <>
              <Navigation />
              <div className="flex-grow">
                <PricingPage />
              </div>
              <Footer />
            </>
          } />
          <Route path="/privacy-policy" element={
            <>
              <Navigation />
              <div className="flex-grow">
                <PrivacyPolicyPage />
              </div>
              <Footer />
            </>
          } />
          <Route path="/terms-of-service" element={
            <>
              <Navigation />
              <div className="flex-grow">
                <TermsOfServicePage />
              </div>
              <Footer />
            </>
          } />
          <Route path="/cookie-policy" element={
            <>
              <Navigation />
              <div className="flex-grow">
                <CookiePolicyPage />
              </div>
              <Footer />
            </>
          } />
          <Route path="/thank-you" element={
            <>
              <Navigation />
              <div className="flex-grow">
                <ThankYouPage />
              </div>
              <Footer />
            </>
          } />
          <Route path="*" element={
            <>
              <Navigation />
              <div className="flex-grow">
                <NotFound />
              </div>
              <Footer />
            </>
          } />
        </Routes>
      </div>
      <Toaster />
      <CookieConsent />
    </Router>
  )
}

export default App
