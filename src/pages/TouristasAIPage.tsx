import { Helmet } from 'react-helmet';
import { useState } from 'react';
import { Bot, Search, Filter, Sparkles, MapPin, Hotel } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TouristasAI from '@/components/TouristasAI';
import SEO from '@/components/SEO';

export default function TouristasAIPage() {
  const [activeTab, setActiveTab] = useState<string>('assistant');
  
  return (
    <>
      <SEO
        title="AI Hotel Finder - Find Your Perfect Stay in Sifnos"
        description="Use our AI-powered recommendation tool to find the perfect hotel in Sifnos based on your preferences. Get personalized hotel suggestions for beach, luxury, family, or budget stays."
        keywords={['sifnos ai hotel finder', 'ai hotel recommendations sifnos', 'best hotels sifnos', 'personalized hotel search', 'sifnos accommodation finder']}
        schemaType="TravelAgency"
        canonical="/touristas-ai"
      />
      
      <div className="bg-gradient-to-b from-sifnos-deep-blue to-sifnos-deep-blue/90 text-white">
        <div className="container mx-auto px-4 pt-12 pb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="bg-white/30 backdrop-blur-md p-2 rounded-lg">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div className="inline-flex items-center gap-2">
                  <h1 className="text-3xl md:text-4xl font-montserrat font-bold text-white">Touristas AI</h1>
                  <div className="px-2 py-1 text-xs bg-white/30 rounded-full backdrop-blur-sm">BETA</div>
                </div>
              </div>
              <p className="mt-2 text-white/90 max-w-2xl">
                Your personal AI assistant to discover the perfect accommodations in Sifnos based on your unique preferences and travel style.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="outline" 
                className="border border-white bg-white/20 text-white font-medium hover:bg-white hover:text-sifnos-deep-blue backdrop-blur-sm transition-all"
                onClick={() => setActiveTab('assistant')}
              >
                <Bot className="mr-2 h-4 w-4" />
                AI Assistant
              </Button>
              <Button
                variant="outline"
                className="border border-white bg-white/20 text-white font-medium hover:bg-white hover:text-sifnos-deep-blue backdrop-blur-sm transition-all"
                onClick={() => setActiveTab('search')}  
              >
                <Search className="mr-2 h-4 w-4" />
                Hotel Search
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto border-none shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-sifnos-deep-blue to-sifnos-deep-blue/90 py-4 px-6 border-b border-white/10">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 bg-white/20 backdrop-blur-sm border border-white/20">
                <TabsTrigger 
                  value="assistant" 
                  className="data-[state=active]:bg-white data-[state=active]:text-sifnos-deep-blue data-[state=inactive]:text-white font-medium"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI Recommendations
                </TabsTrigger>
                <TabsTrigger 
                  value="search" 
                  className="data-[state=active]:bg-white data-[state=active]:text-sifnos-deep-blue data-[state=inactive]:text-white font-medium"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filter Search
                </TabsTrigger>
              </TabsList>
            
              <CardContent className="p-0">
                <TabsContent value="assistant" className="m-0">
                  <div className="p-6">
                    <TouristasAI />
                  </div>
                </TabsContent>
                
                <TabsContent value="search" className="m-0">
                  <div className="p-6">
                    <HotelFilterSearch />
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </div>
        </Card>
      </div>
    </>
  );
}

// Component for the Filter Search tab
function HotelFilterSearch() {
  const [location, setLocation] = useState<string>('');
  const [price, setPrice] = useState<[number, number]>([0, 500]);
  const [hotelType, setHotelType] = useState<string>('');
  const [amenities, setAmenities] = useState<string[]>([]);
  
  const popularAmenities = ["Pool", "Wifi", "Breakfast", "Beach Access", "Air Conditioning", "Restaurant"];
  
  const handleSearch = () => {
    // This will be implemented to redirect to the hotels page with the selected filters
    const searchParams = new URLSearchParams();
    
    if (location) searchParams.append('location', location);
    if (price[0] > 0 || price[1] < 500) searchParams.append('price', `${price[0]}-${price[1]}`);
    if (hotelType) searchParams.append('type', hotelType);
    if (amenities.length > 0) searchParams.append('amenities', amenities.join(','));
    
    window.location.href = `/hotels?${searchParams.toString()}`;
  };

  const toggleAmenity = (amenity: string) => {
    setAmenities(
      amenities.includes(amenity)
        ? amenities.filter(a => a !== amenity)
        : [...amenities, amenity]
    );
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3 text-white">Search Hotels</h3>
        <p className="text-white mb-6">Use the filters below to find your perfect stay in Sifnos</p>
        
        <div className="grid gap-6">
          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-2 text-white">Location</label>
            <select
              id="location"
              className="w-full rounded-md border border-gray-400 p-2 text-gray-800"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">All Locations</option>
              <option value="Apollonia">Apollonia</option>
              <option value="Platis Gialos">Platis Gialos</option>
              <option value="Kamares">Kamares</option>
              <option value="Vathi">Vathi</option>
              <option value="Kastro">Kastro</option>
              <option value="Faros">Faros</option>
              <option value="Artemonas">Artemonas</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-2 text-white">Price Range (€)</label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                min="0"
                max={price[1]}
                value={price[0]}
                onChange={(e) => setPrice([parseInt(e.target.value), price[1]])}
                className="w-24 rounded-md border border-gray-400 p-2 text-gray-800"
              />
              <span className="text-white">to</span>
              <input
                type="number"
                min={price[0]}
                value={price[1]}
                onChange={(e) => setPrice([price[0], parseInt(e.target.value)])}
                className="w-24 rounded-md border border-gray-400 p-2 text-gray-800"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="type" className="block text-sm font-medium mb-2 text-white">Hotel Type</label>
            <select
              id="type"
              className="w-full rounded-md border border-gray-400 p-2 text-gray-800"
              value={hotelType}
              onChange={(e) => setHotelType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="luxury-hotels">Luxury Hotels</option>
              <option value="boutique-hotels">Boutique Hotels</option>
              <option value="family-friendly-hotels">Family-Friendly Hotels</option>
              <option value="budget-hotels">Budget Hotels</option>
              <option value="beachfront-hotels">Beachfront Hotels</option>
              <option value="villas">Villas</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-white">Amenities</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {popularAmenities.map((amenity) => (
                <Button
                  key={amenity}
                  type="button"
                  variant={amenities.includes(amenity) ? "default" : "outline"}
                  className={amenities.includes(amenity) 
                    ? "bg-sifnos-deep-blue text-white font-medium" 
                    : "border-gray-400 text-white font-medium hover:bg-gray-50 hover:text-gray-800"
                  }
                  onClick={() => toggleAmenity(amenity)}
                >
                  {amenity}
                </Button>
              ))}
            </div>
          </div>
          
          <Button
            onClick={handleSearch}
            className="bg-sifnos-deep-blue hover:bg-sifnos-deep-blue/90 text-white py-6 text-base font-medium w-full"
          >
            <Search className="mr-2 h-5 w-5" />
            Search Hotels
          </Button>
        </div>
      </div>
    </div>
  );
}
