
import { Link } from 'react-router-dom';

export default function LocationsIntroSection() {
  return (
    <div className="max-w-4xl mx-auto mt-6 mb-10 text-center">
      <div className="prose prose-lg mx-auto">
        <p className="text-gray-700">
          Each location in Sifnos offers something unique: <Link to="/locations/apollonia" className="text-sifnos-turquoise hover:text-sifnos-deep-blue font-bold">Apollonia</Link>, the island's capital, puts you at the center of nightlife and shopping; <Link to="/locations/kamares" className="text-sifnos-turquoise hover:text-sifnos-deep-blue font-bold">Kamares</Link>, the main port, provides convenience and a beautiful beach; <Link to="/locations/platis-gialos" className="text-sifnos-turquoise hover:text-sifnos-deep-blue font-bold">Platis Gialos</Link> offers one of the island's most stunning beaches with waterfront dining options.
        </p>
        <p className="text-gray-700 mt-2">
          Historic <Link to="/locations/kastro" className="text-sifnos-turquoise hover:text-sifnos-deep-blue font-bold">Kastro</Link> immerses you in medieval architecture with dramatic sea views; while <Link to="/locations/vathi" className="text-sifnos-turquoise hover:text-sifnos-deep-blue font-bold">Vathi</Link> and <Link to="/locations/faros" className="text-sifnos-turquoise hover:text-sifnos-deep-blue font-bold">Faros</Link> provide peaceful retreats in picturesque settings. <Link to="/locations" className="text-sifnos-turquoise hover:text-sifnos-deep-blue font-medium font-bold">Explore all Sifnos locations →</Link>
        </p>
      </div>
    </div>
  );
}
