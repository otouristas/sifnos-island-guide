
import { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FerryHero, 
  FerryTicketsTable, 
  FerryCompanyLogos,
  FerryPriceExamples,
  FerryTravelTips
} from '@/components/ferry';

const FerryTicketsPage = () => {
  const [activeTab, setActiveTab] = useState('to-sifnos');
  
  return (
    <>
      <SEO 
        title="Ferry Tickets to Sifnos - 2025 Complete Guide & Online Booking"
        description="Book ferry tickets to and from Sifnos. View 2025 schedules, compare prices across ferry companies, and get the best rates for your Greek island hopping adventure."
        keywords={[
          'sifnos ferry tickets', 'ferry to sifnos', 'sifnos ferry schedules',
          'piraeus to sifnos ferry', 'athens to sifnos boat', 'island hopping sifnos',
          'cyclades ferry routes', 'greek islands ferries'
        ]}
        schemaType="Service"
        canonical="https://hotelssifnos.com/ferry-tickets"
        imageUrl="/uploads/ferries/ferry-hero.jpg"
      />

      {/* Hero Section */}
      <FerryHero />
      
      {/* Company Logos Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-montserrat font-semibold text-center mb-6">Trusted Ferry Companies</h2>
          <FerryCompanyLogos />
        </div>
      </section>
      
      {/* Ferry Schedules Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center mx-auto">2025 Ferry Schedules</h2>
          <p className="text-center mb-8 max-w-3xl mx-auto">
            Plan your journey to or from Sifnos with our comprehensive ferry schedule. 
            We've gathered all the routes, times, and companies to help you find the perfect connection.
          </p>
          
          <Tabs 
            defaultValue="to-sifnos" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full max-w-4xl mx-auto"
          >
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="to-sifnos" className="py-3">
                Ferries TO Sifnos
              </TabsTrigger>
              <TabsTrigger value="from-sifnos" className="py-3">
                Ferries FROM Sifnos
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="to-sifnos" className="mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <FerryTicketsTable direction="to" />
              </motion.div>
            </TabsContent>
            
            <TabsContent value="from-sifnos" className="mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <FerryTicketsTable direction="from" />
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Price Examples Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center mx-auto">Sample Ticket Prices</h2>
          <p className="text-center mb-8 max-w-3xl mx-auto">
            Here are some examples of ticket prices for common routes. 
            Actual prices may vary based on seasonality, class type, and availability.
          </p>
          
          <FerryPriceExamples />
        </div>
      </section>
      
      {/* Why Book With Us */}
      <section className="py-12 bg-[#1E2E48] text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-8 text-center">
            Why Book Ferries via <span className="text-[#E3D7C3]">HotelsSifnos.com</span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-3 text-[#E3D7C3]">No Hidden Fees</h3>
              <p>The price you see is the price you pay. We believe in transparent pricing with no surprises.</p>
            </div>
            
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-3 text-[#E3D7C3]">Instant Booking</h3>
              <p>Secure your ferry tickets instantly with our fast checkout process and receive immediate confirmation.</p>
            </div>
            
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-3 text-[#E3D7C3]">Vehicle Options</h3>
              <p>Bringing a car, motorcycle or bicycle? We make it easy to book passage for your vehicle too.</p>
            </div>
            
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-3 text-[#E3D7C3]">Live Schedules</h3>
              <p>Our ferry schedules are constantly updated with the latest information for the 2025 season.</p>
            </div>
            
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-3 text-[#E3D7C3]">Local Expertise</h3>
              <p>Our team knows the Greek islands inside and out and can help you plan the perfect island-hopping adventure.</p>
            </div>
            
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-3 text-[#E3D7C3]">Touristas AI</h3>
              <p>Powered by intelligent travel planning technology to suggest the best routes and connections.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Travel Tips */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center mx-auto">Travel Tips for Sifnos Ferries</h2>
          <p className="text-center mb-8 max-w-3xl mx-auto">
            Make your ferry journey smoother with these practical tips from locals and seasoned travelers.
          </p>
          
          <FerryTravelTips />
        </div>
      </section>
    </>
  );
};

export default FerryTicketsPage;
