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
          
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link 
              to="/hotels" 
              className="px-6 py-3 bg-sifnos-turquoise hover:bg-sifnos-deep-blue text-white rounded-md transition-colors text-center"
            >
              Browse All Hotels
            </Link>
            <Link 
              to="/where-to-stay-sifnos" 
              className="px-6 py-3 border border-sifnos-turquoise text-sifnos-turquoise hover:bg-sifnos-turquoise hover:text-white rounded-md transition-colors text-center"
            >
              Where to Stay Guide
            </Link>
            <Link 
              to="/best-beaches-sifnos-guide" 
              className="px-6 py-3 border border-orange-400 text-orange-600 hover:bg-orange-400 hover:text-white rounded-md transition-colors text-center"
            >
              Best Beaches Guide
            </Link>
            <Link 
              to="/touristas-ai" 
              className="px-6 py-3 border border-sifnos-turquoise text-sifnos-turquoise hover:bg-sifnos-turquoise hover:text-white rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <img 
                src="/uploads/touristas-ai-logo.svg" 
                alt="Touristas AI" 
                className="w-4 h-4"
              />
              AI Recommendations
            </Link>
          </div>

          {/* SEO-Rich Content Sections */}
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-sifnos-deep-blue mb-4">
                Why Choose Sifnos for Your Greek Island Holiday?
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Authentic Cycladic architecture in Apollonia and Kastro</li>
                <li>• World-renowned culinary scene with traditional tavernas</li>
                <li>• Pristine beaches from Kamares to Platis Gialos</li>
                <li>• Rich pottery tradition and artisan workshops</li>
                <li>• Peaceful atmosphere away from crowded tourist destinations</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-sifnos-deep-blue mb-4">
                Popular Sifnos Accommodation Areas
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <Link to="/locations/kamares" className="text-sifnos-turquoise hover:underline">Kamares</Link> - Main port with beachfront hotels</li>
                <li>• <Link to="/locations/apollonia" className="text-sifnos-turquoise hover:underline">Apollonia</Link> - Capital town with traditional charm</li>
                <li>• <Link to="/locations/platis-gialos" className="text-sifnos-turquoise hover:underline">Platis Gialos</Link> - Popular beach resort area</li>
                <li>• <Link to="/locations/kastro" className="text-sifnos-turquoise hover:underline">Kastro</Link> - Historic medieval village</li>
                <li>• <Link to="/locations/artemonas" className="text-sifnos-turquoise hover:underline">Artemonas</Link> - Elegant traditional settlement</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}