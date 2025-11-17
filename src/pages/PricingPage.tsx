import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Check, List, Hotel, Map } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import PricingContactForm from '../components/PricingContactForm';
import SEO from "../components/SEO";

const PricingPage = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  const handleSelectPlan = (plan: string) => {
    setSelectedPlan(plan);
    window.scrollTo({ top: document.getElementById('contact-form')?.offsetTop, behavior: 'smooth' });
  };
  
  return (
    <>
      <SEO 
        title="List Your Sifnos Hotel 2026 - Premium Marketing & Direct Bookings | Hotels Sifnos"
        description="List your Sifnos hotel with the island's leading accommodation platform. Reach thousands of travelers, increase direct bookings & maximize revenue. Premium marketing tools, dedicated support & competitive commission rates."
        keywords={[
          'list sifnos hotel 2026', 'sifnos hotel marketing', 'hotel advertising sifnos', 
          'premium hotel listing', 'sifnos accommodation marketing', 'hotel promotion sifnos',
          'direct booking increase', 'sifnos hotel revenue', 'cyclades hotel marketing'
        ]}
        pageType="pricing"
        schemaType="WebPage"
        canonical="https://hotelssifnos.com/pricing"
        imageUrl="/uploads/sifnos-og-image.jpg"
      />
    
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-sifnos-deep-blue mb-4">List Your Hotel on HotelsSifnos</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan to showcase your property to thousands of travelers planning their Sifnos vacation
          </p>
        </div>
        
        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {/* Basic Plan */}
          <Card className="flex flex-col border-2 relative">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Basic Listing</CardTitle>
              <CardDescription>Essential visibility for your property</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">€0</span>
                <span className="text-gray-500 ml-2">/year</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check size={18} className="text-green-500" />
                  <span>Basic hotel information</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={18} className="text-green-500" />
                  <span>Hotel photos (up to 3)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={18} className="text-green-500" />
                  <span>Contact information</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={18} className="text-green-500" />
                  <span>Location on map</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <Check size={18} className="text-gray-300" />
                  <span>Room information</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <Check size={18} className="text-gray-300" />
                  <span>Related hotels display</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleSelectPlan('Basic')}
              >
                Get Started - Free
              </Button>
            </CardFooter>
          </Card>
          
          {/* Popular Plan */}
          <Card className="flex flex-col border-2 border-sifnos-turquoise relative">
            <div className="absolute top-0 right-0 bg-sifnos-turquoise text-white px-4 py-1 text-sm font-medium rounded-bl-lg">POPULAR</div>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Premium Listing</CardTitle>
              <CardDescription>Enhanced visibility with extra features</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">€249</span>
                <span className="text-gray-500 ml-2">/year</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check size={18} className="text-green-500" />
                  <span>All Basic features</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={18} className="text-green-500" />
                  <span>Unlimited hotel photos</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={18} className="text-green-500" />
                  <span>Room details & photos</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={18} className="text-green-500" />
                  <span>Related hotels display</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={18} className="text-green-500" />
                  <span>Featured in location pages</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <Check size={18} className="text-gray-300" />
                  <span>Sponsored placement</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-sifnos-turquoise hover:bg-sifnos-teal"
                onClick={() => handleSelectPlan('Premium')}
              >
                Select Plan
              </Button>
            </CardFooter>
          </Card>
          
          {/* Pro Plan */}
          <Card className="flex flex-col border-2 relative">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Professional Package</CardTitle>
              <CardDescription>Maximum visibility & marketing impact</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">€499</span>
                <span className="text-gray-500 ml-2">/year</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check size={18} className="text-green-500" />
                  <span>All Premium features</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={18} className="text-green-500" />
                  <span>Sponsored on homepage</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={18} className="text-green-500" />
                  <span>Remove similar hotels</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={18} className="text-green-500" />
                  <span>Google Ads campaign</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={18} className="text-green-500" />
                  <span>Social media promotion</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={18} className="text-green-500" />
                  <span>SEO optimization boost</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => handleSelectPlan('Professional')}
              >
                Select Plan
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* FAQs */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">How long does it take to list my hotel?</h3>
              <p className="text-gray-600">Once you submit your information and select a plan, our team will review your details and create your listing within 2-3 business days.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">What information do you need for my listing?</h3>
              <p className="text-gray-600">We need your hotel name, location, contact details, description, photos, and room information if applicable. Additional details can be provided during the onboarding process.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">How do renewals work?</h3>
              <p className="text-gray-600">All plans are annual subscriptions. We'll contact you before your renewal date with options to continue, upgrade, or downgrade your plan.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Can I upgrade my plan later?</h3>
              <p className="text-gray-600">Yes! You can upgrade your plan at any time. The price difference will be prorated based on the remaining time in your current subscription.</p>
            </div>
          </div>
        </div>
        
        {/* Contact Form */}
        <div id="contact-form" className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Get Started with Your Listing</h2>
          <PricingContactForm selectedPlan={selectedPlan} />
        </div>
      </div>
    </>
  );
};

export default PricingPage;
