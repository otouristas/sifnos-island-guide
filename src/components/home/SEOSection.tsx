
import { Link } from 'react-router-dom';

export default function SEOSection() {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-montserrat font-bold text-sifnos-deep-blue mb-6">
            Welcome to HotelsSifnos - Your Ultimate Guide to Accommodation in Sifnos
          </h2>
          
          <div className="prose prose-lg">
            <p>
              Sifnos, with its dazzling white villages, golden beaches, and rich culinary tradition, is one of the most enchanting islands in the Cyclades. Finding the perfect accommodation is essential for experiencing all that this Greek paradise has to offer, and HotelsSifnos is dedicated to helping you make that perfect choice.
            </p>
            
            <p>
              Whether you're looking for a <Link to="/hotel-types/luxury-hotels" className="text-sifnos-turquoise hover:text-sifnos-deep-blue">luxury hotel</Link> with breathtaking sea views, a <Link to="/hotel-types/boutique-hotels" className="text-sifnos-turquoise hover:text-sifnos-deep-blue">charming boutique property</Link> in a traditional village, or a <Link to="/hotel-types/family-friendly-hotels" className="text-sifnos-turquoise hover:text-sifnos-deep-blue">family-friendly resort</Link> with facilities for children, our comprehensive <Link to="/hotels" className="text-sifnos-turquoise hover:text-sifnos-deep-blue">hotel listings</Link> cover the entire range of accommodations available on the island.
            </p>
            
            <p>
              Each location in Sifnos offers something unique: <Link to="/locations/apollonia" className="text-sifnos-turquoise hover:text-sifnos-deep-blue">Apollonia</Link>, the island's capital, puts you at the center of nightlife and shopping; <Link to="/locations/kamares" className="text-sifnos-turquoise hover:text-sifnos-deep-blue">Kamares</Link>, the main port, provides convenience and a beautiful beach; <Link to="/locations/platis-gialos" className="text-sifnos-turquoise hover:text-sifnos-deep-blue">Platis Gialos</Link> offers one of the island's most stunning beaches with numerous waterfront dining options; historic <Link to="/locations/kastro" className="text-sifnos-turquoise hover:text-sifnos-deep-blue">Kastro</Link> immerses you in medieval architecture with dramatic sea views; while <Link to="/locations/vathi" className="text-sifnos-turquoise hover:text-sifnos-deep-blue">Vathi</Link> and <Link to="/locations/faros" className="text-sifnos-turquoise hover:text-sifnos-deep-blue">Faros</Link> provide peaceful retreats in picturesque settings. Explore all <Link to="/locations" className="text-sifnos-turquoise hover:text-sifnos-deep-blue">Sifnos locations</Link> to find your perfect base.
            </p>
            
            <p>
              Beyond just helping you find a place to stay, HotelsSifnos is your complete island guide. Explore our <Link to="/beaches" className="text-sifnos-turquoise hover:text-sifnos-deep-blue">beaches section</Link> to discover the island's most beautiful shores, from organized beaches with amenities to hidden coves for quiet relaxation. Our <Link to="/travel-guide" className="text-sifnos-turquoise hover:text-sifnos-deep-blue">travel guide</Link> provides insider tips on local transportation, dining, attractions, and seasonal events to make your Sifnos experience truly memorable.
            </p>
            
            <p>
              For travelers seeking personalized recommendations, our <Link to="/touristas-ai" className="text-sifnos-turquoise hover:text-sifnos-deep-blue">Touristas AI assistant</Link> can help you plan your perfect Sifnos itinerary based on your preferences and travel style. Discover the best <Link to="/hotel-types/beach-hotels" className="text-sifnos-turquoise hover:text-sifnos-deep-blue">beachfront hotels</Link>, <Link to="/hotel-types/traditional-hotels" className="text-sifnos-turquoise hover:text-sifnos-deep-blue">traditional accommodations</Link>, and unique places to stay that match your needs.
            </p>
            
            <p>
              We invite you to browse our carefully selected hotels, compare features and prices, and book with confidence knowing that our team has personally verified the quality and accuracy of the information we provide. Your perfect <Link to="/about" className="text-sifnos-turquoise hover:text-sifnos-deep-blue">Sifnos getaway</Link> begins here!
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
