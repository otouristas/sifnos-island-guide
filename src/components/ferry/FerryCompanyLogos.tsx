
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
    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
      {companies.map((company) => (
        <div 
          key={company.name} 
          className="group relative flex items-center justify-center h-16 md:h-20"
        >
          <img 
            src={company.logoPath} 
            alt={`${company.name} logo`} 
            className="h-full object-contain max-w-[150px] transition-opacity hover:opacity-80"
          />
          <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
            {company.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default FerryCompanyLogos;
