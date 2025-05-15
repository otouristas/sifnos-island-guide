
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

// Port data type
type Port = {
  name: string;
  abbr: string;
};

// Define ports data
const ports: Port[] = [
  { name: "Aegiali, Amorgos", abbr: "AIG" },
  { name: "Katapola, Amorgos", abbr: "AMO" },
  { name: "Amorgos (All Ports)", abbr: "AMR" },
  { name: "Anafi", abbr: "ANA" },
  { name: "Andros", abbr: "AND" },
  { name: "Antiparos", abbr: "ANP" },
  { name: "Donousa", abbr: "DON" },
  { name: "Folegandros", abbr: "FOL" },
  { name: "Ios", abbr: "IOS" },
  { name: "Irakleia", abbr: "IRK" },
  { name: "Mykonos", abbr: "JMK" },
  { name: "Naxos", abbr: "JNX" },
  { name: "Syros", abbr: "JSY" },
  { name: "Santorini (Thera)", abbr: "JTR" },
  { name: "Kea (Tzia)", abbr: "KEA" },
  { name: "Kimolos", abbr: "KMS" },
  { name: "Koufonisi", abbr: "KOU" },
  { name: "Kythnos", abbr: "KYT" },
  { name: "Milos", abbr: "MLO" },
  { name: "Oia, Santorini", abbr: "OIA" },
  { name: "Paros", abbr: "PAS" },
  { name: "Serifos", abbr: "SER" },
  { name: "Sifnos", abbr: "SIF" },
  { name: "Sikinos", abbr: "SIK" },
  { name: "Schinoussa", abbr: "SXI" },
  { name: "Tinos", abbr: "TIN" },
  { name: "Thirasia", abbr: "TRS" },
  { name: "Piraeus", abbr: "PIR" },
  { name: "Rafina", abbr: "RAF" },
  { name: "Lavrio", abbr: "LAV" },
  { name: "Athens (all ports)", abbr: "ATH" }
];

const FerryHero = () => {
  const [fromPort, setFromPort] = useState("PIR");
  const [toPort, setToPort] = useState("PAS");
  const [departureDate, setDepartureDate] = useState("2025-05-22");
  
  // Create the ferry search URL
  const buildFerrySearchUrl = () => {
    return `https://www.ferryscanner.com/en/ferry/results?ref=ztdimtue&utm_source=georgekasiotis&utm_campaign=Ferryscanner+affiliate+program+EN#search/dep/${fromPort}/arr/${toPort}/date/${departureDate}`;
  };

  return (
    <div className="relative bg-[#1A2B46] text-white overflow-hidden">
      {/* Background pattern and overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#1A2B46]/90 to-[#1A2B46]/80"></div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            {/* Ferry Scanner Logo */}
            <div className="flex justify-center mb-5">
              <img 
                src="https://www.ferryscanner.com/_next/static/media/logo.f9964f3a.svg" 
                alt="Powered by Ferry Scanner" 
                className="h-8 md:h-10"
              />
            </div>
            
            <h1 className="text-3xl md:text-5xl font-montserrat font-bold mb-6">
              Ferry Tickets to Sifnos
              <span className="block text-[#FFEBC8]">2025 Complete Guide</span>
            </h1>
            
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-white/90">
              Book ferry tickets to and from Sifnos with no hidden fees. Compare schedules, prices, and availability across all ferry companies.
            </p>
          </div>
          
          {/* Ferry Search Box */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-[#1A2B46] text-xl font-semibold mb-6">Find Your Ferry</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <Select 
                  defaultValue={fromPort}
                  onValueChange={(value) => setFromPort(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select departure port" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto">
                    {ports.map((port) => (
                      <SelectItem key={port.abbr} value={port.abbr}>
                        {port.name} ({port.abbr})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <Select 
                  defaultValue={toPort}
                  onValueChange={(value) => setToPort(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select arrival port" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto">
                    {ports.map((port) => (
                      <SelectItem key={port.abbr} value={port.abbr}>
                        {port.name} ({port.abbr})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <Input 
                  type="date" 
                  className="w-full"
                  defaultValue={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="mt-6 flex items-center gap-4">
              <a 
                href={buildFerrySearchUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button size="lg" className="bg-[#0EA5E9] hover:bg-[#0995d3] text-white w-full md:w-auto transition-colors">
                  <Search className="mr-2 h-4 w-4" />
                  Search Ferries
                </Button>
              </a>
              <span className="text-xs text-gray-600 font-medium">Powered by FerriesScanner.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FerryHero;
