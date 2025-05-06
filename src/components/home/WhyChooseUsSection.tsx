
import { MapPin, Star, BookOpen, BadgeDollarSign } from 'lucide-react';

export default function WhyChooseUsSection() {
  return (
    <div className="py-16 bg-sifnos-deep-blue text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-montserrat font-bold mb-4">
            Why Book with HotelsSifnos
          </h2>
          <p className="text-xl max-w-2xl mx-auto opacity-80">
            Your trusted guide to finding the perfect stay in Sifnos
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <div className="w-16 h-16 bg-sifnos-turquoise rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Local Expertise</h3>
            <p className="opacity-80">
              Curated selections by locals who know Sifnos inside out
            </p>
          </div>
          
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <div className="w-16 h-16 bg-sifnos-turquoise rounded-full flex items-center justify-center mx-auto mb-4">
              <Star size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Verified Reviews</h3>
            <p className="opacity-80">
              Honest feedback from real travelers who've stayed at our hotels
            </p>
          </div>
          
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <div className="w-16 h-16 bg-sifnos-turquoise rounded-full flex items-center justify-center mx-auto mb-4">
              <BadgeDollarSign size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Best Price Guarantee</h3>
            <p className="opacity-80">
              We compare prices across multiple booking platforms for you
            </p>
          </div>
          
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <div className="w-16 h-16 bg-sifnos-turquoise rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Complete Guide</h3>
            <p className="opacity-80">
              Everything you need to know about Sifnos in one place
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
