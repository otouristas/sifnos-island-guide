
import { Ship, Clock, Info, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

type FerryRoute = {
  route: string;
  departureTime?: string;
  arrivalTime?: string;
  duration: string;
  availability: string;
  frequency: string;
  companies: string[];
  priceFrom: string;
  recommended?: boolean;
  refundable?: "Non Refundable" | "Partially Refundable" | "Fully Refundable";
};

const toSifnosRoutes: FerryRoute[] = [
  {
    route: "Piraeus → Sifnos",
    duration: "2h 30m",
    availability: "Jan – Dec",
    frequency: "5–7 days/week",
    companies: ["Aegean Sea Lines", "Fast Ferries", "SeaJets", "Zante Ferries"],
    priceFrom: "€40.50",
    recommended: true
  },
  {
    route: "Lavrio → Sifnos",
    duration: "2h 55m",
    availability: "May – Sep",
    frequency: "3–7 days/week",
    companies: ["Magic Sea Ferries"],
    priceFrom: "€44.00"
  },
  {
    route: "Adamantas → Sifnos",
    duration: "40m",
    availability: "Jan – Dec",
    frequency: "5–7 days/week",
    companies: ["Aegean Sea Lines", "Blue Star Ferries", "Fast Ferries", "SeaJets", "Zante Ferries"],
    priceFrom: "€6.50"
  },
  {
    route: "Serifos → Sifnos",
    duration: "20m",
    availability: "Jan – Dec",
    frequency: "6–7 days/week",
    companies: ["Aegean Sea Lines", "Blue Star Ferries", "Fast Ferries", "SeaJets", "Magic Sea Ferries", "Zante Ferries"],
    priceFrom: "€6.00"
  },
  {
    route: "Paros → Sifnos",
    duration: "55m",
    availability: "Jan – Dec",
    frequency: "2–7 days/week",
    companies: ["Blue Star Ferries", "SeaJets"],
    priceFrom: "€4.50"
  },
  {
    route: "Folegandros → Sifnos",
    duration: "1h 30m",
    availability: "Jan – Dec",
    frequency: "4–7 days/week",
    companies: ["Fast Ferries", "SeaJets", "Zante Ferries"],
    priceFrom: "€8.00"
  },
  {
    route: "Santorini → Sifnos",
    duration: "33m",
    availability: "Jan – Dec",
    frequency: "4–7 days/week",
    companies: ["Fast Ferries", "SeaJets", "Zante Ferries"],
    priceFrom: "€12.50"
  },
  {
    route: "Mykonos → Sifnos",
    duration: "23m",
    availability: "Mar – Nov",
    frequency: "2–7 days/week",
    companies: ["SeaJets"],
    priceFrom: "€108.70"
  },
  {
    route: "Kimolos → Sifnos",
    duration: "40m",
    availability: "Jan – Dec",
    frequency: "3–7 days/week",
    companies: ["Aegean Sea Lines", "Blue Star Ferries", "Fast Ferries", "Zante Ferries"],
    priceFrom: "€6.00"
  },
  {
    route: "Naxos → Sifnos",
    duration: "1h 40m",
    availability: "Mar – Oct",
    frequency: "5–7 days/week",
    companies: ["SeaJets"],
    priceFrom: "€94.70"
  },
  {
    route: "Syros → Sifnos",
    duration: "3h",
    availability: "Jan – Dec",
    frequency: "2–3 days/week",
    companies: ["Blue Star Ferries"],
    priceFrom: "€8.50"
  },
  {
    route: "Kythnos → Sifnos",
    duration: "1h 25m",
    availability: "May – Nov",
    frequency: "1–7 days/week",
    companies: ["Magic Sea Ferries", "SeaJets", "Aegean Sea Lines", "Zante Ferries"],
    priceFrom: "€8.00"
  },
  {
    route: "Ios → Sifnos",
    duration: "2h 55m",
    availability: "Jan – Dec",
    frequency: "3–7 days/week",
    companies: ["Fast Ferries", "SeaJets", "Zante Ferries"],
    priceFrom: "€11.50"
  },
  {
    route: "Katapola → Sifnos",
    duration: "4h 40m",
    availability: "May – Oct",
    frequency: "Every day",
    companies: ["SeaJets"],
    priceFrom: "€96.70"
  },
  {
    route: "Koufonisia → Sifnos",
    duration: "4h 5m",
    availability: "May – Oct",
    frequency: "Every day",
    companies: ["SeaJets"],
    priceFrom: "€107.70"
  },
  {
    route: "Sikinos → Sifnos",
    duration: "2h 15m",
    availability: "Jan – Dec",
    frequency: "3–6 days/week",
    companies: ["Fast Ferries", "Zante Ferries"],
    priceFrom: "€9.50"
  },
  {
    route: "Kea → Sifnos",
    duration: "2h 40m",
    availability: "Jul – Sep",
    frequency: "3–4 days/week",
    companies: ["Magic Sea Ferries"],
    priceFrom: "€60.00"
  }
];

const fromSifnosRoutes: FerryRoute[] = [
  {
    route: "Sifnos → Piraeus",
    duration: "2h 30m",
    availability: "Jan – Dec",
    frequency: "4–7 days/week",
    companies: ["Aegean Sea Lines", "Fast Ferries", "SeaJets", "Zante Ferries"],
    priceFrom: "€40.50",
    recommended: true
  },
  {
    route: "Sifnos → Adamantas",
    duration: "40m",
    availability: "Jan – Dec",
    frequency: "4–7 days/week",
    companies: ["Aegean Sea Lines", "Blue Star Ferries", "Fast Ferries", "SeaJets", "Zante Ferries"],
    priceFrom: "€6.50"
  },
  {
    route: "Sifnos → Serifos",
    duration: "20m",
    availability: "Jan – Dec",
    frequency: "4–7 days/week",
    companies: ["Aegean Sea Lines", "Blue Star Ferries", "Fast Ferries", "SeaJets", "Magic Sea Ferries", "Zante Ferries"],
    priceFrom: "€6.00"
  },
  {
    route: "Sifnos → Paros",
    duration: "55m",
    availability: "Jan – Dec",
    frequency: "3–7 days/week",
    companies: ["Blue Star Ferries", "SeaJets"],
    priceFrom: "€4.50"
  },
  {
    route: "Sifnos → Mykonos",
    duration: "24m",
    availability: "Mar – Nov",
    frequency: "2–7 days/week",
    companies: ["SeaJets"],
    priceFrom: "€108.70"
  },
  {
    route: "Sifnos → Lavrio",
    duration: "2h 45m",
    availability: "May – Sep",
    frequency: "3–7 days/week",
    companies: ["Magic Sea Ferries"],
    priceFrom: "€54.00"
  },
  {
    route: "Sifnos → Naxos",
    duration: "2h 55m",
    availability: "Jan – Dec",
    frequency: "1–7 days/week",
    companies: ["Blue Star Ferries", "SeaJets"],
    priceFrom: "€12.50"
  },
  {
    route: "Sifnos → Kimolos",
    duration: "35m",
    availability: "Jan – Dec",
    frequency: "4–7 days/week",
    companies: ["Aegean Sea Lines", "Blue Star Ferries", "Fast Ferries", "Zante Ferries"],
    priceFrom: "€6.00"
  },
  {
    route: "Sifnos → Folegandros",
    duration: "1h 30m",
    availability: "Jan – Dec",
    frequency: "4–7 days/week",
    companies: ["Blue Star Ferries", "Fast Ferries", "SeaJets", "Zante Ferries"],
    priceFrom: "€5.50"
  },
  {
    route: "Sifnos → Santorini",
    duration: "33m",
    availability: "Jan – Dec",
    frequency: "4–7 days/week",
    companies: ["Fast Ferries", "SeaJets", "Zante Ferries"],
    priceFrom: "€12.50"
  },
  {
    route: "Sifnos → Syros",
    duration: "3h 15m",
    availability: "Jan – Dec",
    frequency: "2–4 days/week",
    companies: ["Blue Star Ferries"],
    priceFrom: "€8.50"
  },
  {
    route: "Sifnos → Ios",
    duration: "2h 50m",
    availability: "Jan – Dec",
    frequency: "3–7 days/week",
    companies: ["Blue Star Ferries", "Fast Ferries", "SeaJets", "Zante Ferries"],
    priceFrom: "€10.00"
  },
  {
    route: "Sifnos → Katapola",
    duration: "4h 20m",
    availability: "May – Oct",
    frequency: "Every day",
    companies: ["SeaJets"],
    priceFrom: "€96.70"
  },
  {
    route: "Sifnos → Kythnos",
    duration: "1h 20m",
    availability: "May – Dec",
    frequency: "1–7 days/week",
    companies: ["Magic Sea Ferries", "SeaJets", "Zante Ferries"],
    priceFrom: "€8.00"
  },
  {
    route: "Sifnos → Koufonisia",
    duration: "3h 40m",
    availability: "May – Oct",
    frequency: "Every day",
    companies: ["SeaJets"],
    priceFrom: "€107.70"
  },
  {
    route: "Sifnos → Sikinos",
    duration: "2h 10m",
    availability: "Jan – Dec",
    frequency: "3–7 days/week",
    companies: ["Fast Ferries", "Blue Star Ferries", "Zante Ferries"],
    priceFrom: "€8.00"
  },
  {
    route: "Sifnos → Tinos",
    duration: "4h 25m",
    availability: "Jun – Dec",
    frequency: "Once/week",
    companies: ["Blue Star Ferries"],
    priceFrom: "€12.50"
  },
  {
    route: "Sifnos → Kea",
    duration: "2h 25m",
    availability: "Jul – Sep",
    frequency: "4–5 days/week",
    companies: ["Magic Sea Ferries"],
    priceFrom: "€60.00"
  },
  {
    route: "Sifnos → Andros",
    duration: "6h 34m",
    availability: "Jun – Dec",
    frequency: "Once/week",
    companies: ["Blue Star Ferries"],
    priceFrom: "€12.00"
  }
];

interface FerryTicketsTableProps {
  direction: 'to' | 'from';
}

const FerryTicketsTable = ({ direction }: FerryTicketsTableProps) => {
  const routes = direction === 'to' ? toSifnosRoutes : fromSifnosRoutes;

  // Helper function to get the correct company logo
  const getCompanyLogo = (companyName: string) => {
    const normalizedName = companyName.toLowerCase();
    
    if (normalizedName.includes('seajet')) return "/uploads/ferries/seajets.png";
    if (normalizedName.includes('blue star')) return "/uploads/ferries/blue-star-ferries.png";
    if (normalizedName.includes('fast')) return "/uploads/ferries/fast-ferries.png";
    if (normalizedName.includes('magic')) return "/uploads/ferries/magic-ferries.png";
    if (normalizedName.includes('zante')) return "/uploads/ferries/zante.png";
    if (normalizedName.includes('aegean')) return "/uploads/ferries/aegean-sea-lines.png";
    
    // Default case if no match is found
    return "/uploads/ferries/seajets.png"; // Use a default logo or placeholder
  };

  // Helper function to get the company display name
  const getCompanyDisplayName = (companyName: string) => {
    // Extract first part for short name and use full for full name
    const parts = companyName.split(' ');
    const shortName = parts[0];
    return { short: shortName, full: companyName };
  };

  // The ferry booking URL
  const ferryBookingUrl = "https://www.ferryscanner.com/en/ferry/?ref=ztdimtue&utm_source=georgekasiotis&utm_campaign=Ferryscanner+affiliate+program+EN";

  return (
    <div className="space-y-4">
      {routes.map((route, index) => (
        <motion.div 
          key={`${route.route}-${index}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={cn(
            "rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300",
            route.recommended ? "border-[#1E2E48] bg-[#E3D7C3]/10" : "bg-white"
          )}
        >
          {route.recommended && (
            <div className="bg-[#1E2E48] text-white text-xs font-semibold px-3 py-1">
              Recommended
            </div>
          )}
          
          <div className="p-4 md:p-5">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
              {/* Ferry Company */}
              <div className="md:col-span-1 flex items-center space-x-3">
                <div className="h-14 w-14 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src={getCompanyLogo(route.companies[0])} 
                    alt={`${route.companies[0]} logo`} 
                    className="h-10 w-10 object-contain" 
                  />
                </div>
                <div>
                  {(() => {
                    const { short, full } = getCompanyDisplayName(route.companies[0]);
                    return (
                      <>
                        <p className="font-semibold text-gray-800">{short}</p>
                        <p className="text-xs text-gray-600">{full}</p>
                      </>
                    );
                  })()}
                </div>
              </div>
              
              {/* Route Details */}
              <div className="md:col-span-2 flex items-center justify-between">
                <div className="text-center flex-1">
                  <p className="text-base font-semibold text-gray-800 mb-1">{route.route}</p>
                  
                  <div className="flex items-center justify-center">
                    <span className="text-xs text-gray-600 flex items-center">
                      <Clock className="inline-block h-3 w-3 mr-1" />
                      {route.duration}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Availability Badge */}
              <div className="md:col-span-1 flex justify-center">
                <div className="flex space-x-2">
                  {route.companies[0].toLowerCase().includes('seajet') && (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
                      Fastest
                    </span>
                  )}
                  <span className="inline-flex items-center rounded-full bg-[#E3D7C3] px-2.5 py-1 text-xs font-medium text-[#1E2E48]">
                    <Calendar className="h-3 w-3 mr-1" />
                    {route.availability}
                  </span>
                </div>
              </div>
              
              {/* Frequency */}
              <div className="md:col-span-1 flex items-center justify-center">
                <span className="text-sm text-gray-700 font-medium">
                  {route.frequency}
                </span>
              </div>
              
              {/* Price */}
              <div className="md:col-span-1 text-right">
                <div className="font-bold text-lg text-gray-800">
                  <span className="text-sm font-medium text-gray-600">from </span>
                  {route.priceFrom}
                </div>
                <div className="text-xs text-gray-600">{route.refundable || "Standard Fare"}</div>
                <a 
                  href={ferryBookingUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block mt-2 bg-[#1E2E48] hover:bg-[#1E2E48]/80 text-white text-sm font-medium py-1.5 px-4 rounded-md transition-colors"
                >
                  Book Now
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FerryTicketsTable;
