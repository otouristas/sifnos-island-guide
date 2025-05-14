
import { useState, useEffect } from 'react';
import SEO from '@/components/SEO';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowRight, Ship, Calendar, Clock } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Port {
  name: string;
  abbr: string;
  group: string;
  country: string;
  timeZone: string;
}

const ferryPorts: Port[] = [
  { name: "Aegiali, Amorgos", abbr: "AIG", group: "Cyclades", country: "Greece", timeZone: "Europe/Athens" },
  { name: "Katapola, Amorgos", abbr: "AMO", group: "Cyclades", country: "Greece", timeZone: "Europe/Athens" },
  { name: "Amorgos (All Ports)", abbr: "AMR", group: "Cyclades", country: "Greece", timeZone: "Europe/Athens" },
  { name: "Anafi", abbr: "ANA", group: "Cyclades", country: "Greece", timeZone: "Europe/Athens" },
  { name: "Andros", abbr: "AND", group: "Cyclades", country: "Greece", timeZone: "Europe/Athens" },
  { name: "Antiparos", abbr: "ANP", group: "Cyclades", country: "Greece", timeZone: "Europe/Athens" },
  { name: "Donousa", abbr: "DON", group: "Cyclades", country: "Greece", timeZone: "Europe/Athens" },
  { name: "Folegandros", abbr: "FOL", group: "Cyclades", country: "Greece", timeZone: "Europe/Athens" },
  { name: "Ios", abbr: "IOS", group: "Cyclades", country: "Greece", timeZone: "Europe/Athens" },
  { name: "Irakleia", abbr: "IRK", group: "Cyclades", country: "Greece", timeZone: "Europe/Athens" },
  { name: "Mykonos", abbr: "JMK", group: "Cyclades", country: "Greece", timeZone: "Europe/Athens" },
  { name: "Naxos", abbr: "JNX", group: "Cyclades", country: "Greece", timeZone: "Europe/Athens" },
  { name: "Syros", abbr: "JSY", group: "Cyclades", country: "Greece", timeZone: "Europe/Athens" },
  { name: "Santorini (Thera)", abbr: "JTR", group: "Cyclades", country: "Greece", timeZone: "Europe/Athens" },
  { name: "Kea (Tzia)", abbr: "KEA", group: "Cyclades", country: "Greece", timeZone: "Europe/Athens" },
  { name: "Kimolos", abbr: "KMS", group: "Cyclades", country: "Greece", timeZone: "Europe/Athens" },
  { name: "Koufonisi", abbr: "KOU", group: "Cyclades", country: "Greece", timeZone: "Europe/Athens" },
  { name: "Kythnos", abbr: "KYT", group: "Cyclades", country: "Greece", timeZone: "Europe/Athens" },
  { name: "Milos", abbr: "MLO", group: "Cyclades", country: "Greece", timeZone: "Europe/Athens" },
  { name: "Oia, Santorini", abbr: "OIA", group: "Cyclades", country: "Greece", timeZone: "Europe/Athens" },
  { name: "Paros", abbr: "PAS", group: "Cyclades", country: "Greece", timeZone: "Europe/Athens" },
  { name: "Serifos", abbr: "SER", group: "Cyclades", country: "Greece", timeZone: "Europe/Athens" },
  { name: "Sifnos", abbr: "SIF", group: "Cyclades", country: "Greece", timeZone: "Europe/Athens" },
  { name: "Sikinos", abbr: "SIK", group: "Cyclades", country: "Greece", timeZone: "Europe/Athens" },
  { name: "Schinoussa", abbr: "SXI", group: "Cyclades", country: "Greece", timeZone: "Europe/Athens" },
  { name: "Tinos", abbr: "TIN", group: "Cyclades", country: "Greece", timeZone: "Europe/Athens" },
  { name: "Thirasia", abbr: "TRS", group: "Cyclades", country: "Greece", timeZone: "Europe/Athens" },
  { name: "Piraeus", abbr: "PIR", group: "Athens", country: "Greece", timeZone: "Europe/Athens" },
  { name: "Rafina", abbr: "RAF", group: "Athens", country: "Greece", timeZone: "Europe/Athens" },
  { name: "Lavrio", abbr: "LAV", group: "Athens", country: "Greece", timeZone: "Europe/Athens" },
  { name: "Athens(all ports)", abbr: "ATH", group: "Athens", country: "Greece", timeZone: "Europe/Athens" },
];

// Create port groups for better organization in the select dropdown
const portGroups = {
  "Athens": ferryPorts.filter(port => port.group === "Athens"),
  "Cyclades": ferryPorts.filter(port => port.group === "Cyclades")
};

// Form schema
const formSchema = z.object({
  origin: z.string().min(1, "Origin port is required"),
  destination: z.string().min(1, "Destination port is required")
});

// Predefined popular routes to and from Sifnos
const popularRoutes = {
  toSifnos: [
    { from: "Piraeus", fromAbbr: "PIR", to: "Sifnos", toAbbr: "SIF", duration: "2.5-5 hrs", operators: ["Blue Star Ferries", "SeaJets", "Aegean Speed Lines"] },
    { from: "Milos", fromAbbr: "MLO", to: "Sifnos", toAbbr: "SIF", duration: "1-2 hrs", operators: ["Aegean Speed Lines", "SeaJets"] },
    { from: "Serifos", fromAbbr: "SER", to: "Sifnos", toAbbr: "SIF", duration: "30-60 min", operators: ["Aegean Speed Lines", "SeaJets"] },
    { from: "Kimolos", fromAbbr: "KMS", to: "Sifnos", toAbbr: "SIF", duration: "1-1.5 hrs", operators: ["Aegean Speed Lines"] },
    { from: "Paros", fromAbbr: "PAS", to: "Sifnos", toAbbr: "SIF", duration: "1.5-2.5 hrs", operators: ["Blue Star Ferries", "SeaJets"] }
  ],
  fromSifnos: [
    { from: "Sifnos", fromAbbr: "SIF", to: "Piraeus", toAbbr: "PIR", duration: "2.5-5 hrs", operators: ["Blue Star Ferries", "SeaJets", "Aegean Speed Lines"] },
    { from: "Sifnos", fromAbbr: "SIF", to: "Milos", toAbbr: "MLO", duration: "1-2 hrs", operators: ["Aegean Speed Lines", "SeaJets"] },
    { from: "Sifnos", fromAbbr: "SIF", to: "Serifos", toAbbr: "SER", duration: "30-60 min", operators: ["Aegean Speed Lines", "SeaJets"] },
    { from: "Sifnos", fromAbbr: "SIF", to: "Folegandros", toAbbr: "FOL", duration: "1.5-2 hrs", operators: ["SeaJets"] },
    { from: "Sifnos", fromAbbr: "SIF", to: "Santorini", toAbbr: "JTR", duration: "2-3.5 hrs", operators: ["SeaJets"] }
  ]
};

// Weekly schedule data (simplified example)
const weeklySchedules = {
  "PIR-SIF": [
    { day: "Monday", departures: ["07:30", "17:00"] },
    { day: "Tuesday", departures: ["07:30"] },
    { day: "Wednesday", departures: ["17:00"] },
    { day: "Thursday", departures: ["07:30"] },
    { day: "Friday", departures: ["07:30", "17:00"] },
    { day: "Saturday", departures: ["07:30"] },
    { day: "Sunday", departures: ["15:30"] }
  ],
  "SIF-PIR": [
    { day: "Monday", departures: ["09:15", "19:30"] },
    { day: "Tuesday", departures: ["09:15"] },
    { day: "Wednesday", departures: ["19:30"] },
    { day: "Thursday", departures: ["09:15"] },
    { day: "Friday", departures: ["09:15", "19:30"] },
    { day: "Saturday", departures: ["14:00"] },
    { day: "Sunday", departures: ["18:30"] }
  ]
};

const FerryTicketsPage = () => {
  const [origin, setOrigin] = useState<string>("PIR"); // Default: Piraeus
  const [destination, setDestination] = useState<string>("SIF"); // Default: Sifnos
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      origin: "PIR",
      destination: "SIF"
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Create the Ferryscanner URL with the selected ports
    const ferryUrl = `https://ferryscanner.com/en/search?${values.origin}_${values.destination}`;
    
    // Open in new tab
    window.open(ferryUrl, "_blank");
    
    toast({
      title: "Opening Ferry Search",
      description: `Searching for ferries from ${getPortName(values.origin)} to ${getPortName(values.destination)}`,
    });
  };
  
  // Helper function to get port name from abbreviation
  const getPortName = (abbr: string): string => {
    const port = ferryPorts.find(p => p.abbr === abbr);
    return port ? port.name : abbr;
  };

  const handleQuickSearch = (fromAbbr: string, toAbbr: string) => {
    form.setValue('origin', fromAbbr);
    form.setValue('destination', toAbbr);
    setOrigin(fromAbbr);
    setDestination(toAbbr);
    onSubmit({ origin: fromAbbr, destination: toAbbr });
  };

  return (
    <div className="page-container">
      <SEO 
        title="Ferry Tickets to Sifnos - Book Greek Island Ferry Tickets Online"
        description="Book ferry tickets to and from Sifnos and other Greek islands. Compare routes, prices, and timetables for all ferry operators. Easy online booking with instant confirmation."
        keywords={['sifnos ferry tickets', 'greek island ferries', 'book ferry greece', 'cyclades ferries', 'piraeus to sifnos']}
        schemaType="Service"
        canonical="https://hotelssifnos.com/ferry-tickets"
      />
      
      <section className="mb-16">
        <h1 className="section-title text-4xl md:text-5xl mb-6">Ferry Tickets to Sifnos</h1>
        <p className="text-lg mb-8">
          Book your ferry tickets to and from Sifnos and explore the beautiful Cyclades islands. 
          Compare schedules, prices, and ferry operators all in one place.
        </p>
        
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-3">
            <p className="text-sm text-gray-600">Powered by</p>
            <img 
              src="/uploads/Booking.com.svg" 
              alt="Ferryscanner" 
              className="h-6" 
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Search Ferry Routes</h2>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="origin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From</FormLabel>
                      <FormControl>
                        <Select 
                          value={field.value} 
                          onValueChange={(value) => {
                            field.onChange(value);
                            setOrigin(value);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select departure port" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Athens Ports</SelectLabel>
                              {portGroups.Athens.map(port => (
                                <SelectItem key={port.abbr} value={port.abbr}>
                                  {port.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                            <SelectGroup>
                              <SelectLabel>Cyclades Islands</SelectLabel>
                              {portGroups.Cyclades.map(port => (
                                <SelectItem key={port.abbr} value={port.abbr}>
                                  {port.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To</FormLabel>
                      <FormControl>
                        <Select 
                          value={field.value} 
                          onValueChange={(value) => {
                            field.onChange(value);
                            setDestination(value);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select arrival port" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Athens Ports</SelectLabel>
                              {portGroups.Athens.map(port => (
                                <SelectItem key={port.abbr} value={port.abbr}>
                                  {port.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                            <SelectGroup>
                              <SelectLabel>Cyclades Islands</SelectLabel>
                              {portGroups.Cyclades.map(port => (
                                <SelectItem key={port.abbr} value={port.abbr}>
                                  {port.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <Button type="submit" className="w-full md:w-auto" size="lg">
                Search Ferry Tickets <ArrowRight className="ml-2" />
              </Button>
            </form>
          </Form>
        </div>

        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="to-sifnos" className="mb-10">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="to-sifnos">To Sifnos</TabsTrigger>
              <TabsTrigger value="from-sifnos">From Sifnos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="to-sifnos" className="space-y-4">
              <h3 className="text-2xl font-semibold mb-4">Popular Routes to Sifnos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularRoutes.toSifnos.map((route, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-sifnos-deep-blue to-blue-700 text-white p-4">
                      <CardTitle className="text-lg flex justify-between items-center">
                        <span>{route.from}</span>
                        <ArrowRight className="h-4 w-4" />
                        <span>{route.to}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          <span>Duration: {route.duration}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Ship className="h-4 w-4 mr-2 text-gray-500" />
                          <span>Operators: {route.operators.join(", ")}</span>
                        </div>
                        <Button 
                          onClick={() => handleQuickSearch(route.fromAbbr, route.toAbbr)}
                          className="w-full mt-2"
                          variant="outline"
                        >
                          Search This Route
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="from-sifnos" className="space-y-4">
              <h3 className="text-2xl font-semibold mb-4">Popular Routes from Sifnos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularRoutes.fromSifnos.map((route, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-700 to-sifnos-deep-blue text-white p-4">
                      <CardTitle className="text-lg flex justify-between items-center">
                        <span>{route.from}</span>
                        <ArrowRight className="h-4 w-4" />
                        <span>{route.to}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          <span>Duration: {route.duration}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Ship className="h-4 w-4 mr-2 text-gray-500" />
                          <span>Operators: {route.operators.join(", ")}</span>
                        </div>
                        <Button 
                          onClick={() => handleQuickSearch(route.fromAbbr, route.toAbbr)}
                          className="w-full mt-2"
                          variant="outline"
                        >
                          Search This Route
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-2xl font-semibold mb-4">Weekly Schedule: Piraeus - Sifnos</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departures</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {weeklySchedules["PIR-SIF"].map((schedule, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{schedule.day}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {schedule.departures.join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-2xl font-semibold mb-4">Weekly Schedule: Sifnos - Piraeus</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departures</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {weeklySchedules["SIF-PIR"].map((schedule, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{schedule.day}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {schedule.departures.join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Ferry Travel to Sifnos</h2>
            <p className="mb-4">
              Sifnos is accessible by ferry from Athens (Piraeus port) and nearby islands in the Cyclades. Ferry services are more frequent during the summer season (May to September).
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>From Athens (Piraeus):</strong> The journey takes approximately 2.5 to 5 hours depending on the type of ferry (high-speed or conventional).</li>
              <li><strong>From other Cyclades islands:</strong> Frequent connections to/from Milos, Serifos, Kimolos, Paros, and other nearby islands.</li>
              <li><strong>Ferry operators:</strong> Several companies operate on these routes, including Blue Star Ferries, Aegean Speed Lines, SeaJets, and Zante Ferries.</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Travel Tips</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Book in advance:</strong> During peak season (July-August), ferries can fill up quickly. We recommend booking at least a few weeks in advance.</li>
              <li><strong>Weather considerations:</strong> Ferry schedules may be affected by weather conditions, especially during winter months.</li>
              <li><strong>Port arrival:</strong> It's advised to arrive at the port at least 45 minutes before departure.</li>
              <li><strong>Luggage allowance:</strong> There are no strict limitations, but be reasonable with the amount of luggage you bring.</li>
              <li><strong>Vehicle transport:</strong> If you're bringing a car or motorcycle, make sure to book well in advance as vehicle spots are limited.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FerryTicketsPage;
