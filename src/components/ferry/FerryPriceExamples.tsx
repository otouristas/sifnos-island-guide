
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
    <div className="max-w-3xl mx-auto">
      <div className="rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold">Route</TableHead>
              <TableHead className="font-semibold">1 Adult</TableHead>
              <TableHead className="font-semibold">2 Adults</TableHead>
              <TableHead className="font-semibold">2 Adults + 1 Car</TableHead>
              <TableHead className="font-semibold">2 Adults + 2 Children + 1 Car</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {priceExamples.map((example) => (
              <TableRow key={example.route}>
                <TableCell className="font-medium">{example.route}</TableCell>
                <TableCell>{example.oneAdult}</TableCell>
                <TableCell>{example.twoAdults}</TableCell>
                <TableCell>{example.twoAdultsCar}</TableCell>
                <TableCell>{example.familyCar}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <p className="text-sm text-gray-500 italic mt-4 text-center">
        *Prices may vary by season, seat class, and ferry operator.
      </p>
    </div>
  );
};

export default FerryPriceExamples;
