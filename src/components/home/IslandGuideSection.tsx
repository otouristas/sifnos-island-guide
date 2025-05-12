
import { Link } from 'react-router-dom';

export default function IslandGuideSection() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-montserrat font-bold text-sifnos-deep-blue mb-6">
            Your Complete Sifnos Island Guide
          </h2>
          
          <div className="prose prose-lg mx-auto">
            <p>
              Beyond just helping you find a place to stay, HotelsSifnos is your complete island guide. Explore our <Link to="/beaches" className="text-sifnos-turquoise hover:text-sifnos-deep-blue font-bold">beaches section</Link> to discover the island's most beautiful shores, from organized beaches with amenities to hidden coves for quiet relaxation. 
            </p>
            <p>
              Our <Link to="/travel-guide" className="text-sifnos-turquoise hover:text-sifnos-deep-blue font-bold">travel guide</Link> provides insider tips on local transportation, dining, attractions, and seasonal events to make your Sifnos experience truly memorable.
            </p>
            <p>
              For travelers seeking personalized recommendations, our <Link to="/touristas-ai" className="text-sifnos-turquoise hover:text-sifnos-deep-blue font-bold">Touristas AI assistant</Link> can help you plan your perfect Sifnos itinerary based on your preferences and travel style. Discover the best <Link to="/hotel-types/beach-hotels" className="text-sifnos-turquoise hover:text-sifnos-deep-blue font-bold">beachfront hotels</Link>, <Link to="/hotel-types/traditional-hotels" className="text-sifnos-turquoise hover:text-sifnos-deep-blue font-bold">traditional accommodations</Link>, and unique places to stay that match your needs.
            </p>
          </div>
          
          <div className="mt-8">
            <Link 
              to="/travel-guide" 
              className="px-6 py-3 bg-sifnos-turquoise hover:bg-sifnos-deep-blue text-white rounded-md transition-colors"
            >
              Explore Travel Guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
