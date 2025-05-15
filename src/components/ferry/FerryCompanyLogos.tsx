
import { motion } from 'framer-motion';

const companies = [
  {
    name: "Aegean Sea Lines",
    logoPath: "/uploads/ferries/aegean-sea-lines.png",
    website: "https://www.aegeanseaferries.gr/"
  },
  {
    name: "Blue Star Ferries",
    logoPath: "/uploads/ferries/blue-star-ferries.png",
    website: "https://www.bluestarferries.com/"
  },
  {
    name: "Zante Ferries",
    logoPath: "/uploads/ferries/zante.png",
    website: "https://www.zanteferries.gr/"
  },
  {
    name: "SeaJets",
    logoPath: "/uploads/ferries/seajets.png",
    website: "https://www.seajets.gr/"
  },
  {
    name: "Magic Sea Ferries",
    logoPath: "/uploads/ferries/magic-ferries.png",
    website: "https://www.magicseaferries.gr/"
  },
  {
    name: "Fast Ferries",
    logoPath: "/uploads/ferries/fast-ferries.png",
    website: "https://www.fastferries.com.gr/"
  },
];

const FerryCompanyLogos = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {companies.map((company, index) => (
          <motion.a 
            key={company.name}
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 flex items-center justify-center h-28"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="flex flex-col items-center gap-2">
              <img 
                src={company.logoPath} 
                alt={`${company.name} logo`} 
                className="h-12 object-contain max-w-[120px]"
              />
              <span className="text-xs text-gray-600 font-medium text-center">
                {company.name}
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
};

export default FerryCompanyLogos;
