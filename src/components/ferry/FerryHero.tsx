
import { Search, Ship } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const FerryHero = () => {
  return (
    <div className="relative bg-[#1E2E48] text-white overflow-hidden">
      {/* Background pattern and overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#1E2E48]/90 to-[#1E2E48]/80"></div>
      
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
              <span className="block text-[#E3D7C3]">2025 Complete Guide</span>
            </h1>
            
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
              Book ferry tickets to and from Sifnos with no hidden fees. Compare schedules, prices, and availability across all ferry companies.
            </p>
          </div>
          
          {/* Ferry Search Box */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-[#1E2E48] text-xl font-semibold mb-6">Find Your Ferry</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <Select defaultValue="piraeus">
                  <SelectTrigger>
                    <SelectValue placeholder="Select departure port" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="piraeus">Piraeus (Athens)</SelectItem>
                    <SelectItem value="lavrio">Lavrio (Athens)</SelectItem>
                    <SelectItem value="milos">Milos (Adamantas)</SelectItem>
                    <SelectItem value="serifos">Serifos</SelectItem>
                    <SelectItem value="paros">Paros</SelectItem>
                    <SelectItem value="santorini">Santorini</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <Select defaultValue="sifnos">
                  <SelectTrigger>
                    <SelectValue placeholder="Select arrival port" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sifnos">Sifnos</SelectItem>
                    <SelectItem value="piraeus">Piraeus (Athens)</SelectItem>
                    <SelectItem value="milos">Milos (Adamantas)</SelectItem>
                    <SelectItem value="serifos">Serifos</SelectItem>
                    <SelectItem value="paros">Paros</SelectItem>
                    <SelectItem value="santorini">Santorini</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <Input type="date" className="w-full" />
              </div>
            </div>
            
            <div className="mt-6 flex items-center gap-4">
              <Button size="lg" className="bg-[#1E2E48] hover:bg-[#1E2E48]/80 text-white w-full md:w-auto">
                <Search className="mr-2 h-4 w-4" />
                Search Ferries
              </Button>
              <span className="text-xs text-gray-500">Powered by FerriesScanner.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FerryHero;
