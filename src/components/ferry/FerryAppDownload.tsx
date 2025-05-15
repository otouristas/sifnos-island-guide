
import React from 'react';
import { motion } from 'framer-motion';
import { Map, Search, User, Ticket, ChevronRight } from 'lucide-react';

const FerryAppDownload = () => {
  // App store links
  const appStoreLink = "https://apps.apple.com/us/app/ferryscanner-book-your-ferry/id6736605125";
  const googlePlayLink = "https://play.google.com/store/apps/details?id=com.ferryscanner.mobile&hl=en";

  // Animation settings for features
  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.5,
      }
    })
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - App image */}
          <motion.div 
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative max-w-[400px]">
              <img 
                src="/uploads/ferries/iPhones.webp" 
                alt="FerryScanner App on mobile devices" 
                className="w-full h-auto rounded-xl shadow-xl"
              />
              <div className="absolute -top-5 -right-5 bg-white rounded-full p-3 shadow-lg">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-full">
                    <svg width="60" height="60" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="qr-placeholder">
                      <rect x="50" y="50" width="100" height="100" fill="#333" />
                      <rect x="65" y="65" width="70" height="70" fill="white" />
                      <rect x="80" y="80" width="40" height="40" fill="#333" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-600">
                    Scan QR
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right side - Text content */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div>
              <motion.div 
                className="text-sm font-semibold text-[#0EA5E9] mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                Ferryscanner brand mark on a white background
              </motion.div>
              
              <motion.h2 
                className="text-3xl md:text-4xl font-montserrat font-bold mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                Download The New<br />
                <span className="text-[#0EA5E9]">Ferryscanner App!</span>
              </motion.h2>
            </div>

            <div className="flex flex-wrap gap-4">
              <a href={appStoreLink} target="_blank" rel="noopener noreferrer">
                <img 
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
                  alt="Download on the App Store" 
                  className="h-[40px]"
                />
              </a>
              <a href={googlePlayLink} target="_blank" rel="noopener noreferrer">
                <img 
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
                  alt="Get it on Google Play" 
                  className="h-[40px]"
                />
              </a>
            </div>

            {/* Features list */}
            <div className="mt-8 space-y-5">
              {[
                { icon: <Map className="h-5 w-5 text-[#0EA5E9]" />, title: "Explore and Book with Ease", description: "Use our interactive map to find and book ferry trips effortlessly." },
                { icon: <Search className="h-5 w-5 text-[#0EA5E9]" />, title: "Quick Search", description: "Prefer a more classic approach? Input your details and find trips in seconds." },
                { icon: <User className="h-5 w-5 text-[#0EA5E9]" />, title: "Personalize Your Experience", description: "Sign up to save preferences, passengers, and payment details." },
                { icon: <Ticket className="h-5 w-5 text-[#0EA5E9]" />, title: "Travel Paper-Free", description: "Book your ferry and store your ticket right on your phone for a smooth journey." }
              ].map((feature, i) => (
                <motion.div 
                  key={feature.title}
                  className="flex items-start gap-4 group"
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={featureVariants}
                >
                  <div className="p-2 bg-sky-50 rounded-lg">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 flex items-center gap-1 group-hover:text-[#0EA5E9] transition-colors">
                      {feature.title}
                      <ChevronRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FerryAppDownload;
