
import { Link } from 'react-router-dom';

export default function HotelTypesIntroSection() {
  return (
    <div className="max-w-4xl mx-auto mt-6 mb-10 text-center">
      <div className="prose prose-lg mx-auto">
        <p className="text-gray-700">
          Whether you're looking for a <Link to="/hotel-types/luxury-hotels" className="text-sifnos-turquoise hover:text-sifnos-deep-blue font-bold">luxury hotel</Link> with breathtaking sea views, a <Link to="/hotel-types/boutique-hotels" className="text-sifnos-turquoise hover:text-sifnos-deep-blue font-bold">charming boutique property</Link> in a traditional village, or a <Link to="/hotel-types/family-friendly-hotels" className="text-sifnos-turquoise hover:text-sifnos-deep-blue font-bold">family-friendly resort</Link> with facilities for children, our comprehensive <Link to="/hotels" className="text-sifnos-turquoise hover:text-sifnos-deep-blue font-bold">hotel listings</Link> cover the entire range of accommodations available on the island.
        </p>
      </div>
    </div>
  );
}
