
import { motion } from 'framer-motion';

const priceExamples = [
  {
    route: "Piraeus → Sifnos",
    oneAdult: "€30",
    twoAdults: "€70",
    twoAdultsCar: "€119.50",
    familyCar: "€189.00"
  },
  {
    route: "Adamantas → Sifnos",
    oneAdult: "€6.50",
    twoAdults: "€13.00",
    twoAdultsCar: "€27.00",
    familyCar: "€80.50"
  },
  {
    route: "Serifos → Sifnos",
    oneAdult: "€6.00",
    twoAdults: "€12.00",
    twoAdultsCar: "€23.00",
    familyCar: "€33.50"
  }
];

const FerryPriceExamples = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div 
        className="rounded-xl border shadow-md overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0EA5E9]/10">
              <tr>
                <th className="py-4 px-6 text-left font-semibold text-gray-800">Route</th>
                <th className="py-4 px-6 text-center font-semibold text-gray-800">1 Adult</th>
                <th className="py-4 px-6 text-center font-semibold text-gray-800">2 Adults</th>
                <th className="py-4 px-6 text-center font-semibold text-gray-800">2 Adults + 1 Car</th>
                <th className="py-4 px-6 text-center font-semibold text-gray-800">2 Adults + 2 Children + 1 Car</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {priceExamples.map((example, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-gray-800">{example.route}</td>
                  <td className="py-4 px-6 text-center text-gray-700">{example.oneAdult}</td>
                  <td className="py-4 px-6 text-center text-gray-700">{example.twoAdults}</td>
                  <td className="py-4 px-6 text-center text-gray-700">{example.twoAdultsCar}</td>
                  <td className="py-4 px-6 text-center text-gray-700">{example.familyCar}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
      
      <p className="text-sm text-gray-500 italic mt-4 text-center">
        *Prices may vary by season, seat class, and ferry operator.
      </p>
    </div>
  );
};

export default FerryPriceExamples;
