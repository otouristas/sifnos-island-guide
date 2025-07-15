import { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FerryHero, 
  FerryTicketsTable, 
  FerryCompanyLogos,
  FerryPriceExamples,
  FerryTravelTips,
  FerryAppDownload
} from '@/components/ferry';

const FerryTicketsPage = () => {
  const [activeTab, setActiveTab] = useState('to-sifnos');
  
  return (
    <>
      <SEO 
        title="Sifnos Ferry Tickets 2025 - Hotels & Villas | Complete Travel Guide"
        description="Book Sifnos ferry tickets + find your perfect accommodation. Compare 25+ hotels & villas in Sifnos. Ferry schedules, island transport, car rental & complete travel planning. Your Sifnos adventure starts here!"
        keywords={[
          'sifnos ferry tickets 2025', 'sifnos hotels near port', 'sifnos villas booking',
          'where to stay in sifnos', 'sifnos accommodation guide', 'kamares hotels sifnos',
          'ferry to sifnos hotels', 'sifnos villa rentals', 'luxury hotels sifnos',
          'cyclades ferry and hotels', 'book sifnos ferry and stay', 'sifnos travel package',
          'rent a car sifnos', 'sifnos transportation guide', 'apollo sifnos hotels',
          'platis gialos villas', 'boutique hotels sifnos', 'sifnos beachfront accommodation'
        ]}
        pageType="general"
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
            className="text-2xl md:text-3xl font-montserrat font-bold text-center mb-10 pb-3 border-b-2 border-[#1E2E48]/30 inline-block mx-auto"
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
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6 pb-3 border-b-2 border-[#1E2E48]/30 inline-block">
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
                className="py-4 px-6 text-sm md:text-base font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-[#1E2E48] data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-50"
              >
                Ferries TO Sifnos
              </TabsTrigger>
              <TabsTrigger 
                value="from-sifnos" 
                className="py-4 px-6 text-sm md:text-base font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-[#1E2E48] data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-50"
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
      
      {/* App Download Section */}
      <FerryAppDownload />
      
      {/* Price Examples Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6 pb-3 border-b-2 border-[#1E2E48]/30 inline-block">
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
      <section className="py-12 md:py-16 bg-[#1E2E48] text-white">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl md:text-4xl font-montserrat font-bold mb-12 pb-3 text-center border-b-2 border-[#E3D7C3]/30 inline-block mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Why Book Ferries via <span className="text-[#E3D7C3]">HotelsSifnos.com</span>
          </motion.h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white/10 p-7 rounded-xl backdrop-blur-sm hover:bg-white/15 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5 }}
            >
              <h3 className="text-xl font-semibold mb-3 text-[#E3D7C3]">No Hidden Fees</h3>
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
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6 pb-3 border-b-2 border-[#1E2E48]/30 inline-block">
              Travel Tips for Sifnos Ferries
            </h2>
            <p className="text-gray-600 text-lg">
              Make your ferry journey smoother with these practical tips from locals and seasoned travelers.
            </p>
          </motion.div>
          
          <FerryTravelTips />
        </div>
      </section>

      {/* Sifnos Hotels & Accommodation Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-4xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6 pb-3 border-b-2 border-[#1E2E48]/30 inline-block">
              Where to Stay in Sifnos - Hotels & Villas
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Complete your Sifnos travel plans! After booking your ferry, choose from our curated selection of 25+ hotels, villas, and boutique accommodations across the island.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <motion.div 
              className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5 }}
            >
              <h3 className="text-xl font-semibold mb-3 text-sifnos-deep-blue">🏨 Kamares Port Hotels</h3>
              <p className="text-gray-700 mb-4">Stay near the ferry port for ultimate convenience. Perfect for arrivals and departures with easy access to restaurants and shops.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">From €45/night</span>
                <a href="/locations/kamares" className="text-blue-600 hover:text-blue-800 font-medium">View Hotels →</a>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5 }}
            >
              <h3 className="text-xl font-semibold mb-3 text-sifnos-deep-blue">🏛️ Apollonia Capital Hotels</h3>
              <p className="text-gray-700 mb-4">Traditional Cycladic charm in the island's capital. Boutique hotels with authentic architecture and local character.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">From €65/night</span>
                <a href="/locations/apollonia" className="text-green-600 hover:text-green-800 font-medium">Explore →</a>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-100 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <h3 className="text-xl font-semibold mb-3 text-sifnos-deep-blue">🏖️ Beachfront Villas</h3>
              <p className="text-gray-700 mb-4">Luxury villas and resorts at Platis Gialos and other prime beach locations. Perfect for families and groups.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">From €120/night</span>
                <a href="/hotel-types/villa" className="text-orange-600 hover:text-orange-800 font-medium">View Villas →</a>
              </div>
            </motion.div>
          </div>

          {/* Quick booking CTA */}
          <motion.div 
            className="bg-gradient-to-r from-sifnos-deep-blue to-blue-700 text-white p-8 rounded-2xl text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold mb-4">🎯 Complete Your Sifnos Trip</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Ferry booked? Great! Now secure your perfect accommodation with our best price guarantee. 
              Browse 25+ verified hotels and villas with instant confirmation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="/hotels" 
                className="bg-white text-sifnos-deep-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Browse All Hotels
              </a>
              <a 
                href="/where-to-stay-sifnos" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-sifnos-deep-blue transition-colors"
              >
                Where to Stay Guide
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Rent a Car in Sifnos Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-4xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6 pb-3 border-b-2 border-[#1E2E48]/30 inline-block">
              🚗 Rent a Car in Sifnos
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Explore Sifnos at your own pace! Rent a car for ultimate freedom to discover hidden beaches, traditional villages, and scenic mountain roads across the island.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-sifnos-deep-blue mb-6">Why Rent a Car in Sifnos?</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">✓</span>
                    <div>
                      <strong>Discover Hidden Beaches:</strong> Access secluded spots like Vroulidia and Faros that are off the beaten path
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">✓</span>
                    <div>
                      <strong>Explore Traditional Villages:</strong> Visit Kastro, Artemonas, and mountain settlements with ease
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">✓</span>
                    <div>
                      <strong>Flexible Schedule:</strong> No waiting for buses - explore on your own timeline
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">✓</span>
                    <div>
                      <strong>Grocery Shopping:</strong> Easily transport supplies for your villa or long beach days
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">✓</span>
                    <div>
                      <strong>Scenic Drives:</strong> Enjoy breathtaking views along coastal and mountain roads
                    </div>
                  </li>
                </ul>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-6">🏆 Recommended Partner</h3>
                <div className="text-center mb-6">
                  <h4 className="text-3xl font-bold text-blue-100 mb-2">Cyclades Rent a Car</h4>
                  <p className="text-blue-200 mb-4">Trusted local car rental with 15+ years of experience in the Cyclades</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-100">€25+</div>
                    <div className="text-blue-200">Per day</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-100">Free</div>
                    <div className="text-blue-200">Port pickup</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-100">Full</div>
                    <div className="text-blue-200">Insurance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-100">24/7</div>
                    <div className="text-blue-200">Support</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <a 
                    href="https://cycladesrentacar.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-white text-blue-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                  >
                    Book Your Car Now →
                  </a>
                  <p className="text-blue-200 text-sm mt-3">
                    Special rates for HotelsSifnos visitors
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FerryTicketsPage;
