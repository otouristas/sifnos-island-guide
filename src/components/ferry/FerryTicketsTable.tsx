
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
    departureTime: "07:00",
    arrivalTime: "10:40",
    duration: "3h 40m",
    availability: "Jan – Dec",
    frequency: "5–7 days/week",
    companies: ["SeaJets"],
    priceFrom: "€62.70",
    recommended: true,
    refundable: "Non Refundable"
  },
  {
    route: "Piraeus → Sifnos",
    departureTime: "07:25",
    arrivalTime: "12:45",
    duration: "5h 20m",
    availability: "Jan – Dec",
    frequency: "5–7 days/week",
    companies: ["Blue Star Ferries"],
    priceFrom: "€52.50",
    refundable: "Non Refundable"
  },
  {
    route: "Piraeus → Sifnos",
    departureTime: "09:15",
    arrivalTime: "13:35",
    duration: "4h 20m",
    availability: "Jan – Dec",
    frequency: "5–7 days/week",
    companies: ["SeaJets"],
    priceFrom: "€64.70",
    refundable: "Non Refundable"
  },
  {
    route: "Piraeus → Sifnos",
    departureTime: "18:30",
    arrivalTime: "00:20",
    duration: "5h 50m",
    availability: "Jan – Dec",
    frequency: "5–7 days/week",
    companies: ["Blue Star Ferries"],
    priceFrom: "€52.50",
    refundable: "Partially Refundable"
  },
  {
    route: "Lavrio → Sifnos",
    departureTime: "07:30",
    arrivalTime: "10:25",
    duration: "2h 55m",
    availability: "May – Sep",
    frequency: "3–7 days/week",
    companies: ["Magic Sea Ferries"],
    priceFrom: "€44.00",
    refundable: "Non Refundable"
  },
  {
    route: "Adamantas → Sifnos",
    duration: "40m",
    availability: "Jan – Dec",
    frequency: "5–7 days/week",
    companies: ["Blue Star", "Fast Ferries", "Seajets", "Zante Ferries"],
    priceFrom: "€6.50"
  },
  {
    route: "Serifos → Sifnos",
    duration: "20m",
    availability: "Jan – Dec",
    frequency: "6–7 days/week",
    companies: ["Aegean Sea Lines", "Seajets", "Magic Sea Ferries"],
    priceFrom: "€6.00"
  },
  {
    route: "Paros → Sifnos",
    duration: "55m",
    availability: "Jan – Dec",
    frequency: "2–7 days/week",
    companies: ["Blue Star Ferries", "Seajets"],
    priceFrom: "€4.50"
  },
  {
    route: "Folegandros → Sifnos",
    duration: "1h 30m",
    availability: "Jan – Dec",
    frequency: "4–7 days/week",
    companies: ["Fast Ferries", "Seajets", "Zante Ferries"],
    priceFrom: "€8.00"
  },
  {
    route: "Santorini → Sifnos",
    duration: "33m",
    availability: "Jan – Dec",
    frequency: "4–7 days/week",
    companies: ["Fast Ferries", "Seajets", "Zante Ferries"],
    priceFrom: "€12.50"
  },
  {
    route: "Mykonos → Sifnos",
    duration: "23m",
    availability: "Mar – Nov",
    frequency: "2–7 days/week",
    companies: ["Seajets"],
    priceFrom: "€108.70"
  },
  {
    route: "Kimolos → Sifnos",
    duration: "40m",
    availability: "Jan – Dec",
    frequency: "3–7 days/week",
    companies: ["Aegean Sea Lines", "Fast Ferries", "Zante Ferries"],
    priceFrom: "€6.00"
  },
  {
    route: "Naxos → Sifnos",
    duration: "1h 40m",
    availability: "Mar – Oct",
    frequency: "5–7 days/week",
    companies: ["Seajets"],
    priceFrom: "€94.70"
  }
];

const fromSifnosRoutes: FerryRoute[] = [
  {
    route: "Sifnos → Piraeus",
    departureTime: "14:00",
    arrivalTime: "17:30",
    duration: "3h 30m",
    availability: "Jan – Dec",
    frequency: "4–7 days/week",
    companies: ["SeaJets"],
    priceFrom: "€62.70",
    recommended: true,
    refundable: "Non Refundable"
  },
  {
    route: "Sifnos → Piraeus",
    departureTime: "15:30",
    arrivalTime: "21:00",
    duration: "5h 30m",
    availability: "Jan – Dec",
    frequency: "4–7 days/week",
    companies: ["Blue Star Ferries"],
    priceFrom: "€52.50",
    refundable: "Non Refundable"
  },
  {
    route: "Sifnos → Piraeus",
    duration: "2h 30m",
    availability: "Jan – Dec",
    frequency: "4–7 days/week",
    companies: ["Aegean Sea Lines", "Fast Ferries", "Seajets", "Zante Ferries"],
    priceFrom: "€40.50"
  },
  {
    route: "Sifnos → Adamantas",
    duration: "40m",
    availability: "Jan – Dec",
    frequency: "4–7 days/week",
    companies: ["Blue Star", "Fast Ferries", "Seajets", "Zante Ferries"],
    priceFrom: "€6.50"
  },
  {
    route: "Sifnos → Serifos",
    duration: "20m",
    availability: "Jan – Dec",
    frequency: "4–7 days/week",
    companies: ["Aegean Sea Lines", "Seajets", "Magic Sea Ferries"],
    priceFrom: "€6.00"
  },
  {
    route: "Sifnos → Paros",
    duration: "55m",
    availability: "Jan – Dec",
    frequency: "3–7 days/week",
    companies: ["Blue Star Ferries", "Seajets"],
    priceFrom: "€4.50"
  },
  {
    route: "Sifnos → Mykonos",
    duration: "24m",
    availability: "Mar – Nov",
    frequency: "2–7 days/week",
    companies: ["Seajets"],
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
    companies: ["Blue Star Ferries", "Seajets"],
    priceFrom: "€12.50"
  },
  {
    route: "Sifnos → Kimolos",
    duration: "35m",
    availability: "Jan – Dec",
    frequency: "4–7 days/week",
    companies: ["Aegean Sea Lines", "Fast Ferries", "Zante Ferries"],
    priceFrom: "€6.00"
  },
  {
    route: "Sifnos → Folegandros",
    duration: "1h 30m",
    availability: "Jan – Dec",
    frequency: "4–7 days/week",
    companies: ["Blue Star Ferries", "Fast Ferries", "Seajets", "Zante Ferries"],
    priceFrom: "€5.50"
  },
  {
    route: "Sifnos → Santorini",
    duration: "33m",
    availability: "Jan – Dec",
    frequency: "4–7 days/week",
    companies: ["Fast Ferries", "Seajets", "Zante Ferries"],
    priceFrom: "€12.50"
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
            route.recommended ? "border-[#0EA5E9] bg-sky-50" : "bg-white"
          )}
        >
          {route.recommended && (
            <div className="bg-[#0EA5E9] text-white text-xs font-semibold px-3 py-1">
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
                  {/* Use helper function to get company display name */}
                  {(() => {
                    const { short, full } = getCompanyDisplayName(route.companies[0]);
                    return (
                      <>
                        <p className="font-semibold text-gray-800">{short}</p>
                        <p className="text-xs text-gray-500">{full}</p>
                      </>
                    );
                  })()}
                </div>
              </div>
              
              {/* Time Details */}
              <div className="md:col-span-2 flex items-center justify-between">
                <div className="text-center">
                  <p className="text-lg font-semibold">{route.departureTime || "--:--"}</p>
                </div>
                
                <div className="flex-1 px-4 flex flex-col items-center">
                  <div className="w-full flex items-center justify-center">
                    <div className="h-[2px] flex-1 bg-gray-300 relative">
                      <div className="absolute w-1 h-1 rounded-full bg-gray-400 left-0 top-1/2 -translate-y-1/2"></div>
                      <div className="absolute w-1 h-1 rounded-full bg-gray-400 right-0 top-1/2 -translate-y-1/2"></div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    <Clock className="inline-block h-3 w-3 mr-1" />
                    {route.duration}
                  </span>
                </div>
                
                <div className="text-center">
                  <p className="text-lg font-semibold">{route.arrivalTime || "--:--"}</p>
                </div>
              </div>
              
              {/* Duration Badge */}
              <div className="md:col-span-1 flex justify-center">
                <div className="flex space-x-2">
                  {route.companies[0].toLowerCase().includes('seajet') && (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
                      Fastest
                    </span>
                  )}
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800">
                    <Calendar className="h-3 w-3 mr-1" />
                    {route.availability}
                  </span>
                </div>
              </div>
              
              {/* Services */}
              <div className="md:col-span-1 flex items-center justify-center space-x-2">
                <span className="h-5 w-5 bg-green-100 rounded-full flex items-center justify-center">
                  <Ship className="h-3 w-3 text-green-600" />
                </span>
                <span className="h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="h-3 w-3 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 6v12m-8-6h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </span>
                <span className="h-5 w-5 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="h-3 w-3 text-purple-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
              
              {/* Price */}
              <div className="md:col-span-1 text-right">
                <div className="font-bold text-lg text-gray-900">{route.priceFrom}</div>
                <div className="text-xs text-gray-500">{route.refundable || "Standard Fare"}</div>
                <button className="mt-2 bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white text-sm font-medium py-1.5 px-4 rounded-md transition-colors">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FerryTicketsTable;
