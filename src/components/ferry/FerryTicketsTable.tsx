
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type FerryRoute = {
  route: string;
  duration: string;
  availability: string;
  frequency: string;
  companies: string[];
  priceFrom: string;
};

const toSifnosRoutes: FerryRoute[] = [
  {
    route: "Piraeus → Sifnos",
    duration: "2h 30m",
    availability: "Jan – Dec",
    frequency: "5–7 days/week",
    companies: ["Aegean Sea Lines", "Fast Ferries", "Seajets", "Zante Ferries"],
    priceFrom: "€40.50"
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
  const caption = direction === 'to' 
    ? "2025 Ferry Schedule - Routes to Sifnos" 
    : "2025 Ferry Schedule - Routes from Sifnos";

  return (
    <div className="rounded-lg border shadow-sm overflow-hidden">
      <Table>
        <TableCaption>{caption}</TableCaption>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="font-semibold">Route</TableHead>
            <TableHead className="font-semibold">Duration</TableHead>
            <TableHead className="font-semibold">Availability</TableHead>
            <TableHead className="font-semibold">Frequency</TableHead>
            <TableHead className="font-semibold">Ferry Companies</TableHead>
            <TableHead className="font-semibold text-right">Price From</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {routes.map((route) => (
            <TableRow key={route.route}>
              <TableCell className="font-medium">{route.route}</TableCell>
              <TableCell>{route.duration}</TableCell>
              <TableCell>{route.availability}</TableCell>
              <TableCell>{route.frequency}</TableCell>
              <TableCell>{route.companies.join(', ')}</TableCell>
              <TableCell className="text-right">{route.priceFrom}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FerryTicketsTable;
