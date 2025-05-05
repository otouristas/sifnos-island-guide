
import { Helmet } from 'react-helmet';
import TouristasAI from '@/components/TouristasAI';
import { Sparkles } from 'lucide-react';

export default function TouristasAIPage() {
  return (
    <>
      <Helmet>
        <title>Touristas AI - Find Your Perfect Stay in Sifnos | HotelsSifnos</title>
        <meta name="description" content="Use our AI-powered recommendation tool to find the perfect hotel in Sifnos based on your preferences." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-sm font-medium bg-[#9b87f5]/10 text-[#7E69AB] rounded-full">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Hotel Finder</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-sifnos-deep-blue mb-4">
            Touristas AI
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Tell us what you're looking for in a Sifnos hotel and our AI will analyze our database 
            to find the perfect matches tailored to your preferences.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <TouristasAI />
        </div>
      </div>
    </>
  );
}
