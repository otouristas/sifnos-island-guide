
import { Link } from 'react-router-dom';

export default function SEOSection() {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-montserrat font-bold text-sifnos-deep-blue mb-6">
            Find Your Perfect Stay in Sifnos
          </h2>
          
          <div className="prose prose-lg">
            <p>
              Sifnos, with its dazzling white villages, golden beaches, and rich culinary tradition, is one of the most enchanting islands in the Cyclades. Finding the perfect accommodation is essential for experiencing all that this Greek paradise has to offer, and HotelsSifnos is dedicated to helping you make that perfect choice.
            </p>
            
            <p>
              We invite you to browse our carefully selected hotels, compare features and prices, and book with confidence knowing that our team has personally verified the quality and accuracy of the information we provide. Your perfect <Link to="/about" className="text-sifnos-turquoise hover:text-sifnos-deep-blue font-bold">Sifnos getaway</Link> begins here!
            </p>
          </div>
          
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link 
              to="/hotels" 
              className="px-6 py-3 bg-sifnos-turquoise hover:bg-sifnos-deep-blue text-white rounded-md transition-colors"
            >
              Browse All Hotels
            </Link>
            <Link 
              to="/touristas-ai" 
              className="px-6 py-3 border border-sifnos-turquoise text-sifnos-turquoise hover:bg-sifnos-turquoise hover:text-white rounded-md transition-colors flex items-center gap-2"
            >
              <img 
                src="/uploads/touristas-ai-logo.svg" 
                alt="Touristas AI" 
                className="w-4 h-4"
              />
              Get AI Recommendations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
