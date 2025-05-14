
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
import { ArrowRight, Ship, Calendar, Clock, Map, Info, Ticket } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFerrySchedules } from "@/utils/ferry-utils";

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
  destination: z.string().min(1, "Destination port is required"),
  date: z.string().optional()
});

// Predefined popular routes to and from Sifnos
const popularRoutes = {
  toSifnos: [
    { from: "Piraeus", fromAbbr: "PIR", to: "Sifnos", toAbbr: "SIF", duration: "2.5-5.5 hrs", operators: ["Blue Star Ferries", "SeaJets", "Aegean Speed Lines", "Zante Ferries"] },
    { from: "Milos", fromAbbr: "MLO", to: "Sifnos", toAbbr: "SIF", duration: "1-1.5 hrs", operators: ["Aegean Speed Lines", "SeaJets"] },
    { from: "Serifos", fromAbbr: "SER", to: "Sifnos", toAbbr: "SIF", duration: "30-60 min", operators: ["Aegean Speed Lines", "SeaJets", "Zante Ferries"] },
    { from: "Kimolos", fromAbbr: "KMS", to: "Sifnos", toAbbr: "SIF", duration: "2-2.5 hrs", operators: ["Aegean Speed Lines", "Zante Ferries"] },
    { from: "Naxos", fromAbbr: "JNX", to: "Sifnos", toAbbr: "SIF", duration: "1.5-2 hrs", operators: ["SeaJets", "Hellenic Seaways"] }
  ],
  fromSifnos: [
    { from: "Sifnos", fromAbbr: "SIF", to: "Piraeus", toAbbr: "PIR", duration: "2.5-5.5 hrs", operators: ["Blue Star Ferries", "SeaJets", "Aegean Speed Lines", "Zante Ferries"] },
    { from: "Sifnos", fromAbbr: "SIF", to: "Milos", toAbbr: "MLO", duration: "1-1.5 hrs", operators: ["Aegean Speed Lines", "SeaJets"] },
    { from: "Sifnos", fromAbbr: "SIF", to: "Serifos", toAbbr: "SER", duration: "30-60 min", operators: ["Aegean Speed Lines", "SeaJets", "Zante Ferries"] },
    { from: "Sifnos", fromAbbr: "SIF", to: "Folegandros", toAbbr: "FOL", duration: "3-4 hrs", operators: ["SeaJets", "Hellenic Seaways"] },
    { from: "Sifnos", fromAbbr: "SIF", to: "Mykonos", toAbbr: "JMK", duration: "2-3 hrs", operators: ["SeaJets", "Hellenic Seaways"] }
  ]
};

// Weekly schedule data
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
      destination: "SIF",
      date: undefined
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Create the Ferryscanner URL with the selected ports
    const ferryUrl = `https://www.ferryscanner.com/en/search?${values.origin}_${values.destination}`;
    
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
        schemaType="Organization"
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
              src="https://www.ferryscanner.com/_next/static/media/logo.f9964f3a.svg" 
              alt="Ferryscanner" 
              className="h-8" 
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
                Search Ferry Tickets <Ticket className="ml-2 h-4 w-4" />
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
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">All About Sifnos</h2>
            <div className="prose max-w-none">
              <p className="mb-4">
                Sifnos is a fairy-tale island that exudes the magical essence of the Cyclades, from its stunning landscapes to its picturesque villages and traditional cuisine. 
                Sifnos lies between Serifos and Milos in the south-western Cyclades and is a medium-sized island with a population of about 2,500 permanent residents and a stunning 70-kilometer coastline.
              </p>
              <p className="mb-4">
                Here, you will find quintessential whitewashed villages, over 300 iconic churches, charming hand-crafted pottery workshops, exceptional local gastronomy, and over 200 kilometers of scenic walking trails.
              </p>
              <p className="mb-4">
                The island once enjoyed great prosperity as far back as the 3rd millennium BCE due to its gold and silver mines. 
                The rich clay veins, the abundance of sunshine, and the mild climate have today made Sifnos the pottery capital of the Aegean. 
                A network of walking trails will lead you to the sites of an ancient acropolis, temple, and fort, as well as allowing you to take in the wonderful seascapes that spread out before you.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Ship className="h-5 w-5 mr-2 text-sifnos-deep-blue" />
              Routes and Ferries to Sifnos
            </h2>
            <div className="prose max-w-none">
              <p className="mb-4">
                You can book your ferry tickets to Sifnos with Ferryscanner and sail from the port of Piraeus in Athens in 5 hours and 30 minutes with Zante Ferries throughout the year. 
                There are also ferry connections with other islands in the Cyclades and you can book your ferry tickets to Sifnos in high season with lines like Seajets and Hellenic Seaways and sail from:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Amorgos (4.25 hrs)</li>
                <li>Andros (6.35 hrs.)</li>
                <li>Folegandros (3.55 hrs)</li>
                <li>Ios (5.20 hrs)</li>
                <li>Kimolos (2.30 hrs)</li>
                <li>Koufonisia (4.10 hrs)</li>
                <li>Kythnos (2.15 hrs)</li>
                <li>Milos (1.20 hrs)</li>
                <li>Mykonos (2.25 hrs)</li>
                <li>Naxos (1.35 hrs)</li>
              </ul>
              <p className="mb-4">
                If you are arriving at Athens International airport and book your ferry tickets for Sifnos from Piraeus, you can travel to the port by taking the X96 express bus, which departs every 30-40 minutes. 
                Taxis are available on arrival at the airport to take you to Piraeus and you can also catch a train to the port if you are already in the city center.
              </p>
              <p className="mb-4">
                Sifnos doesn't have an airport but you can fly to Milos, which is the nearest airport, and book your ferry tickets from there for Sifnos with Ferryscanner and enjoy a one-hour trip.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Map className="h-5 w-5 mr-2 text-sifnos-deep-blue" />
              Port of Sifnos
            </h2>
            <div className="prose max-w-none">
              <p className="mb-4">
                Kamares is the port of Sifnos and lies about 5 km away from the capital village of Apollonia. It serves all of the shipping lines bringing visitors to the island and is a pretty coastal settlement that gets very busy in high season. 
                Use Ferryscanner to compare prices, routes, ferry companies and book ferry tickets to Sifnos.
              </p>
              <p className="mb-4">
                You will find plenty of hotels, restaurants, shops, bakeries, and pottery workshops on the waterfront, as well as some of the island's oldest churches and a lovely sandy beach lined by lush reed banks and small lagoons. 
                Several hiking routes begin at Kamares that will take you to landmarks such as the Black Cave, and hidden inland villages.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Travel Tips</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Book in advance:</strong> During peak season (July-August), ferries can fill up quickly. We recommend booking at least a few weeks in advance.</li>
              <li><strong>Weather considerations:</strong> Ferry schedules may be affected by weather conditions, especially during winter months.</li>
              <li><strong>Port arrival:</strong> It's advised to arrive at the port at least 45 minutes before departure.</li>
              <li><strong>Luggage allowance:</strong> There are no strict limitations, but be reasonable with the amount of luggage you bring.</li>
              <li><strong>Vehicle transport:</strong> If you're bringing a car or motorcycle, make sure to book well in advance as vehicle spots are limited.</li>
              <li><strong>Getting to the port:</strong> From Athens Airport, take the X96 bus to Piraeus port (runs every 30-40 minutes).</li>
              <li><strong>Alternative routes:</strong> Consider flying to Milos and taking a short 1-hour ferry to Sifnos.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FerryTicketsPage;
