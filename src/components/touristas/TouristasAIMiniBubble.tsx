
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, X, ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export default function TouristasAIMiniBubble() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Bubble that appears when mini chat is closed */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="bg-gradient-to-br from-sifnos-deep-blue to-[#3a5585] h-14 w-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            onClick={() => setIsOpen(true)}
          >
            <img 
              src="/uploads/touristas-ai-logo.svg" 
              alt="Touristas AI" 
              className="h-8 w-8"
            />
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Mini chat popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl w-[320px] overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-br from-sifnos-deep-blue to-[#3a5585] p-3 text-white">
              <div className="flex items-center gap-2">
                <img 
                  src="/uploads/touristas-ai-logo.svg" 
                  alt="Touristas AI" 
                  className="h-6 w-6"
                />
                <span className="font-semibold">Touristas AI</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Chat content */}
            <div className="p-4">
              <div className="flex gap-3 mb-4">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-gray-100 rounded-2xl p-3 max-w-[85%]">
                  <p className="text-sm text-gray-800">
                    Γεια σου! 👋 I'm your Sifnos travel assistant. Want to find the perfect place to stay in Sifnos?
                  </p>
                </div>
              </div>
              
              {/* CTA Button */}
              <Button 
                asChild
                className="w-full bg-sifnos-deep-blue hover:bg-sifnos-deep-blue/90 mt-2"
              >
                <Link to="/touristas-ai" className="flex items-center justify-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>Try Touristas AI</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
