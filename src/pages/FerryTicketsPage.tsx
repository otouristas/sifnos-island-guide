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
        schemaType="TravelAgency"
        canonical="https://hotelssifnos.com/ferry-tickets"
        imageUrl="/uploads/ferries/ferry-hero.jpg"
      />

      {/* Hero Section */}
      <FerryHero />
      
      {/* Company Logos Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-2xl md:text-3xl font-montserrat font-bold text-center mb-10 pb-3 border-b-2 border-[#0EA5E9]/30 inline-block mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Trusted Ferry Companies
          </motion.h2>
          <FerryCompanyLogos />
        </div>
      </section>
      
      {/* Ferry Schedules Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6 pb-3 border-b-2 border-[#0EA5E9]/30 inline-block">
              2025 Ferry Schedules
            </h2>
            <p className="text-gray-700 text-lg">
              Plan your journey to or from Sifnos with our comprehensive ferry schedule. 
              We've gathered all the routes, times, and companies to help you find the perfect connection.
            </p>
          </motion.div>
          
          <Tabs 
            defaultValue="to-sifnos" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full max-w-5xl mx-auto"
          >
            <TabsList className="grid grid-cols-2 mb-8 bg-white shadow-md rounded-xl p-2.5 h-auto">
              <TabsTrigger 
                value="to-sifnos" 
                className="py-4 px-6 text-sm md:text-base font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-[#0EA5E9] data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-50"
              >
                Ferries TO Sifnos
              </TabsTrigger>
              <TabsTrigger 
                value="from-sifnos" 
                className="py-4 px-6 text-sm md:text-base font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-[#0EA5E9] data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-50"
              >
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
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6 pb-3 border-b-2 border-[#0EA5E9]/30 inline-block">
              Sample Ticket Prices
            </h2>
            <p className="text-gray-600 text-lg">
              Here are some examples of ticket prices for common routes. 
              Actual prices may vary based on seasonality, class type, and availability.
            </p>
          </motion.div>
          
          <FerryPriceExamples />
        </div>
      </section>
      
      {/* Why Book With Us */}
      <section className="py-12 md:py-16 bg-[#1A1F2C] text-white">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl md:text-4xl font-montserrat font-bold mb-12 pb-3 text-center border-b-2 border-[#0EA5E9]/30 inline-block mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Why Book Ferries via <span className="text-[#0EA5E9]">HotelsSifnos.com</span>
          </motion.h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white/10 p-7 rounded-xl backdrop-blur-sm hover:bg-white/15 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5 }}
            >
              <h3 className="text-xl font-semibold mb-3 text-[#0EA5E9]">No Hidden Fees</h3>
              <p className="text-gray-300">The price you see is the price you pay. We believe in transparent pricing with no surprises.</p>
            </motion.div>
            
            <motion.div 
              className="bg-white/10 p-7 rounded-xl backdrop-blur-sm hover:bg-white/15 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5 }}
            >
              <h3 className="text-xl font-semibold mb-3 text-[#0EA5E9]">Instant Booking</h3>
              <p className="text-gray-300">Secure your ferry tickets instantly with our fast checkout process and receive immediate confirmation.</p>
            </motion.div>
            
            <motion.div 
              className="bg-white/10 p-7 rounded-xl backdrop-blur-sm hover:bg-white/15 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <h3 className="text-xl font-semibold mb-3 text-[#0EA5E9]">Vehicle Options</h3>
              <p className="text-gray-300">Bringing a car, motorcycle or bicycle? We make it easy to book passage for your vehicle too.</p>
            </motion.div>
            
            <motion.div 
              className="bg-white/10 p-7 rounded-xl backdrop-blur-sm hover:bg-white/15 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -5 }}
            >
              <h3 className="text-xl font-semibold mb-3 text-[#0EA5E9]">Live Schedules</h3>
              <p className="text-gray-300">Our ferry schedules are constantly updated with the latest information for the 2025 season.</p>
            </motion.div>
            
            <motion.div 
              className="bg-white/10 p-7 rounded-xl backdrop-blur-sm hover:bg-white/15 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <h3 className="text-xl font-semibold mb-3 text-[#0EA5E9]">Local Expertise</h3>
              <p className="text-gray-300">Our team knows the Greek islands inside and out and can help you plan the perfect island-hopping adventure.</p>
            </motion.div>
            
            <motion.div 
              className="bg-white/10 p-7 rounded-xl backdrop-blur-sm hover:bg-white/15 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ y: -5 }}
            >
              <h3 className="text-xl font-semibold mb-3 text-[#0EA5E9]">Touristas AI</h3>
              <p className="text-gray-300">Powered by intelligent travel planning technology to suggest the best routes and connections.</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Travel Tips */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6 pb-3 border-b-2 border-[#0EA5E9]/30 inline-block">
              Travel Tips for Sifnos Ferries
            </h2>
            <p className="text-gray-600 text-lg">
              Make your ferry journey smoother with these practical tips from locals and seasoned travelers.
            </p>
          </motion.div>
          
          <FerryTravelTips />
        </div>
      </section>
    </>
  );
};

export default FerryTicketsPage;
