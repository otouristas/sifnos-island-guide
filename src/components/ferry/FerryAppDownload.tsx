
import React from 'react';
import { motion } from 'framer-motion';
import { Map, Search, User, Ticket, ChevronRight, Download } from 'lucide-react';
import { cn } from "@/lib/utils";

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

  // Features list
  const features = [
    {
      icon: <Map className="h-5 w-5" />,
      title: "Explore and Book with Ease",
      description: "Use our interactive map to find and book ferry trips effortlessly."
    },
    {
      icon: <Search className="h-5 w-5" />,
      title: "Quick Search",
      description: "Prefer a more classic approach? Input your details and find trips in seconds."
    },
    {
      icon: <User className="h-5 w-5" />,
      title: "Personalize Your Experience",
      description: "Sign up to save preferences, passengers, and payment details."
    },
    {
      icon: <Ticket className="h-5 w-5" />,
      title: "Travel Paper-Free",
      description: "Book your ferry and store your ticket right on your phone for a smooth journey."
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-[#E3D7C3]/20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#E3D7C3] via-[#1E2E48] to-[#E3D7C3]"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[#1E2E48]/5 blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-[#E3D7C3]/20 blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold relative inline-block">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1E2E48] to-[#1E2E48]">
              Download The Ferryscanner App
            </span>
            <div className="h-1 w-1/3 bg-[#E3D7C3] mx-auto mt-2 rounded-full"></div>
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Book and manage your ferry trips on the go with our feature-rich mobile application
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left side - App image */}
          <motion.div 
            className="flex justify-center lg:justify-end relative"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative max-w-[400px] z-10">
              <div className="absolute -inset-0.5 bg-gradient-to-tr from-[#1E2E48] to-[#E3D7C3] rounded-xl blur opacity-30"></div>
              <img 
                src="/uploads/ferries/iPhones.webp" 
                alt="FerryScanner App on mobile devices" 
                className="w-full h-auto rounded-xl shadow-xl relative z-10"
              />
              
              {/* QR code */}
              <motion.div 
                className="absolute -top-5 -right-5 bg-white rounded-full p-2 shadow-xl border border-[#E3D7C3]/50 z-20"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              >
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 flex items-center justify-center bg-white rounded-full overflow-hidden">
                    <svg width="80" height="80" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="qr-placeholder">
                      <rect x="50" y="50" width="100" height="100" fill="#1E2E48" />
                      <rect x="65" y="65" width="70" height="70" fill="white" />
                      <rect x="80" y="80" width="40" height="40" fill="#1E2E48" />
                    </svg>
                  </div>
                  <div className="absolute inset-x-0 -bottom-8 flex items-center justify-center">
                    <span className="px-3 py-1 bg-[#1E2E48] text-white text-xs font-medium rounded-full flex items-center gap-1 shadow-lg">
                      <Download className="h-3 w-3" /> Scan QR
                    </span>
                  </div>
                </div>
              </motion.div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -left-4 h-24 w-24 bg-[#E3D7C3]/30 rounded-full blur-xl -z-10"></div>
            </div>
          </motion.div>

          {/* Right side - Text content */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-[#E3D7C3]/50">
              <div>
                <div className="text-sm font-medium text-[#1E2E48]/80 mb-2">
                  MOBILE APP
                </div>
                
                <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6 text-gray-800">
                  Ferry booking 
                  <span className="text-[#1E2E48] block">at your fingertips!</span>
                </h2>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <a 
                  href={appStoreLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-105"
                >
                  <img 
                    src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
                    alt="Download on the App Store" 
                    className="h-[44px]"
                  />
                </a>
                <a 
                  href={googlePlayLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-105"
                >
                  <img 
                    src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
                    alt="Get it on Google Play" 
                    className="h-[44px]"
                  />
                </a>
              </div>

              {/* Features list */}
              <div className="space-y-5">
                {features.map((feature, i) => (
                  <motion.div 
                    key={feature.title}
                    className="flex items-start gap-4 group p-2 rounded-lg hover:bg-[#E3D7C3]/20 transition-all"
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={featureVariants}
                  >
                    <div className={cn(
                      "p-3 rounded-xl shadow-sm flex items-center justify-center transition-all duration-300",
                      "bg-gradient-to-br from-[#1E2E48] to-[#1E2E48]/80 text-white",
                    )}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1 flex items-center gap-1 group-hover:text-[#1E2E48] transition-colors">
                        {feature.title}
                        <ChevronRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FerryAppDownload;
