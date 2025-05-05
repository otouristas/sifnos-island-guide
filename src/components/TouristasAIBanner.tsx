
import { Link } from 'react-router-dom';
import { Bot, Search, Sparkles, MapPin, Clock, PanelTop } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TouristasAIBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-sifnos-deep-blue to-sifnos-deep-blue/80 rounded-xl shadow-xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
      
      <div className="relative z-10 px-6 py-12 md:py-16 md:px-12 flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-medium bg-white/20 text-white rounded-full backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI-Powered Hotel Recommendations</span>
          </div>
          
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Find Your Perfect Stay in Sifnos with AI
          </h3>
          
          <p className="text-white/90 text-lg mb-8 max-w-xl">
            Tell us your preferences and our AI will recommend the best accommodations tailored to your dream vacation in Sifnos.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-6 justify-center md:justify-start">
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
              <MapPin className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">Beach & Village Locations</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
              <Clock className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">Perfect Duration</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
              <PanelTop className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">Personalized Matches</span>
            </div>
          </div>
          
          <Button
            asChild
            size="lg"
            className="bg-white text-sifnos-deep-blue hover:bg-white/90 shadow-md"
          >
            <Link to="/touristas-ai">
              <Search className="mr-2 h-5 w-5" />
              Find My Perfect Hotel
            </Link>
          </Button>
        </div>
        
        <div className="w-full md:w-auto flex-shrink-0 flex justify-center">
          <div className="relative h-48 w-48 md:h-64 md:w-64 flex items-center justify-center">
            <div className="absolute inset-0 bg-sifnos-turquoise/20 rounded-full animate-pulse"></div>
            <div className="absolute inset-4 bg-sifnos-turquoise/30 rounded-full animate-pulse delay-75"></div>
            <div className="relative bg-white/30 rounded-full p-6 backdrop-blur-sm">
              <Bot className="h-24 w-24 md:h-32 md:w-32 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
