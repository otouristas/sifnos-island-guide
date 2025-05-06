
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
              Whether you're looking for a <Link to="/hotel-types/luxury-hotels">luxury hotel</Link> with breathtaking sea views, a <Link to="/hotel-types/boutique-hotels">charming boutique property</Link> in a traditional village, or a <Link to="/hotel-types/family-friendly-hotels">family-friendly resort</Link> with facilities for children, our comprehensive listings cover the entire range of accommodations available on the island.
            </p>
            
            <p>
              Each location in Sifnos offers something unique: <Link to="/locations/apollonia">Apollonia</Link>, the island's capital, puts you at the center of nightlife and shopping; <Link to="/locations/kamares">Kamares</Link>, the main port, provides convenience and a beautiful beach; <Link to="/locations/platis-gialos">Platis Gialos</Link> offers one of the island's most stunning beaches with numerous waterfront dining options; historic <Link to="/locations/kastro">Kastro</Link> immerses you in medieval architecture with dramatic sea views; while <Link to="/locations/vathi">Vathi</Link> and <Link to="/locations/faros">Faros</Link> provide peaceful retreats in picturesque settings.
            </p>
            
            <p>
              Beyond just helping you find a place to stay, HotelsSifnos is your complete island guide. Explore our <Link to="/beaches">beaches section</Link> to discover the island's most beautiful shores, from organized beaches with amenities to hidden coves for quiet relaxation. Our <Link to="/travel-guide">travel guide</Link> provides insider tips on local transportation, dining, attractions, and seasonal events to make your Sifnos experience truly memorable.
            </p>
            
            <p>
              We invite you to browse our carefully selected hotels, compare features and prices, and book with confidence knowing that our team has personally verified the quality and accuracy of the information we provide. Your perfect Sifnos getaway begins here!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
