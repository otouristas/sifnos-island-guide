
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Hotel, Search, Loader2, Bot, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import HotelCard from './HotelCard';

type AIPreference = 'beach' | 'family' | 'luxury' | 'budget';
type AIStayDuration = '1-3' | '4-7' | '8+';
type AIProximity = 'beachfront' | 'village' | 'remote';

export default function TouristasAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [preferences, setPreferences] = useState<AIPreference[]>([]);
  const [stayDuration, setStayDuration] = useState<AIStayDuration>('4-7');
  const [proximity, setProximity] = useState<AIProximity>('beachfront');
  const { toast } = useToast();

  const togglePreference = (preference: AIPreference) => {
    if (preferences.includes(preference)) {
      setPreferences(preferences.filter(p => p !== preference));
    } else {
      setPreferences([...preferences, preference]);
    }
  };

  const searchHotels = async () => {
    if (preferences.length === 0) {
      toast({
        title: "Select preferences",
        description: "Please select at least one preference to help us find the perfect hotel for you.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      let query = supabase
        .from('hotels')
        .select(`
          *,
          hotel_amenities(amenity),
          hotel_photos(id, photo_url, is_main_photo)
        `)
        .order('rating', { ascending: false });

      // Filter by proximity (location)
      if (proximity === 'beachfront') {
        // Get hotels that mention beach in description or are in known beach locations
        query = query.or('description.ilike.%beach%,location.eq.Platis Gialos,location.eq.Vathi,location.eq.Kamares');
      } else if (proximity === 'village') {
        // Get hotels in village locations
        query = query.or('location.eq.Apollonia,location.eq.Kastro,location.eq.Artemonas');
      }

      // Apply preferences filters
      if (preferences.includes('luxury')) {
        query = query.gte('rating', 4);
      }
      
      if (preferences.includes('budget')) {
        query = query.lte('price', 150);
      }

      // For family preference, we'll look for "family" in hotel_types array
      if (preferences.includes('family')) {
        query = query.contains('hotel_types', ['family-friendly']);
      }

      const { data, error } = await query;
      
      if (error) {
        toast({
          title: "Error searching hotels",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      // If we're looking specifically for beach hotels, prioritize them
      let filteredResults = data || [];
      if (preferences.includes('beach')) {
        filteredResults = filteredResults.filter((hotel) => 
          hotel.description?.toLowerCase().includes('beach') || 
          hotel.location === 'Platis Gialos' ||
          hotel.location === 'Vathi' ||
          hotel.location === 'Kamares'
        );
      }

      if (filteredResults.length === 0) {
        toast({
          title: "No results found",
          description: "We couldn't find any hotels matching your criteria. Try adjusting your preferences.",
          variant: "default"
        });
      } else {
        toast({
          title: "Results found!",
          description: `Found ${filteredResults.length} hotels matching your criteria.`,
          variant: "default"
        });
      }

      // Limit results to max 3
      setResults(filteredResults.slice(0, 3));
    } catch (error) {
      console.error('Error searching hotels:', error);
      toast({
        title: "Something went wrong",
        description: "An error occurred while searching for hotels. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getResultHeading = () => {
    let heading = `Perfect stays for your ${stayDuration} day trip`;
    
    if (preferences.length > 0) {
      const preferencesText = preferences.join(' and ');
      heading += ` with ${preferencesText} experience`;
    }
    
    if (proximity) {
      heading += proximity === 'beachfront' 
        ? ' right on the beach' 
        : proximity === 'village' 
          ? ' in traditional villages' 
          : ' in secluded locations';
    }
    
    return heading;
  };

  const resetSearch = () => {
    setResults([]);
    setPreferences([]);
    setStayDuration('4-7');
    setProximity('beachfront');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-1">
        <Bot className="h-5 w-5 text-sifnos-deep-blue" />
        <h2 className="text-xl font-semibold text-sifnos-deep-blue">AI Hotel Recommendation</h2>
      </div>
      <p className="text-gray-600">Tell me your preferences and I'll find your perfect stay in Sifnos</p>

      {results.length === 0 ? (
        <div className="space-y-6">
          <Tabs defaultValue="preferences" className="mb-6">
            <TabsList className="bg-gray-100 w-full">
              <TabsTrigger value="preferences" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-sifnos-deep-blue">
                <Sparkles className="mr-1.5 h-4 w-4" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="duration" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-sifnos-deep-blue">
                Duration
              </TabsTrigger>
              <TabsTrigger value="proximity" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-sifnos-deep-blue">
                Location
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="preferences" className="mt-4 animate-fade-in">
              <h3 className="text-lg font-medium mb-4">What type of stay are you looking for?</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  variant={preferences.includes('beach') ? "default" : "outline"} 
                  className={preferences.includes('beach') 
                    ? "bg-sifnos-deep-blue text-white border-2 border-sifnos-deep-blue hover:bg-sifnos-deep-blue/90 font-medium" 
                    : "border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 font-medium"
                  }
                  onClick={() => togglePreference('beach')}
                >
                  Beach
                </Button>
                <Button 
                  variant={preferences.includes('family') ? "default" : "outline"} 
                  className={preferences.includes('family') 
                    ? "bg-sifnos-deep-blue text-white border-2 border-sifnos-deep-blue hover:bg-sifnos-deep-blue/90 font-medium" 
                    : "border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 font-medium"
                  }
                  onClick={() => togglePreference('family')}
                >
                  Family
                </Button>
                <Button 
                  variant={preferences.includes('luxury') ? "default" : "outline"} 
                  className={preferences.includes('luxury') 
                    ? "bg-sifnos-deep-blue text-white border-2 border-sifnos-deep-blue hover:bg-sifnos-deep-blue/90 font-medium" 
                    : "border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 font-medium"
                  }
                  onClick={() => togglePreference('luxury')}
                >
                  Luxury
                </Button>
                <Button 
                  variant={preferences.includes('budget') ? "default" : "outline"} 
                  className={preferences.includes('budget') 
                    ? "bg-sifnos-deep-blue text-white border-2 border-sifnos-deep-blue hover:bg-sifnos-deep-blue/90 font-medium" 
                    : "border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 font-medium"
                  }
                  onClick={() => togglePreference('budget')}
                >
                  Budget
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="duration" className="mt-4 animate-fade-in">
              <h3 className="text-lg font-medium mb-4">How long will you stay?</h3>
              <RadioGroup 
                value={stayDuration} 
                onValueChange={(value) => setStayDuration(value as AIStayDuration)}
                className="grid grid-cols-3 gap-4"
              >
                <Label active={stayDuration === '1-3'}>
                  <RadioGroupItem value="1-3" className="sr-only" />
                  1-3 days
                </Label>
                <Label active={stayDuration === '4-7'}>
                  <RadioGroupItem value="4-7" className="sr-only" />
                  4-7 days
                </Label>
                <Label active={stayDuration === '8+'}>
                  <RadioGroupItem value="8+" className="sr-only" />
                  8+ days
                </Label>
              </RadioGroup>
            </TabsContent>
            
            <TabsContent value="proximity" className="mt-4 animate-fade-in">
              <h3 className="text-lg font-medium mb-4">Where do you want to stay?</h3>
              <RadioGroup 
                value={proximity} 
                onValueChange={(value) => setProximity(value as AIProximity)}
                className="grid grid-cols-3 gap-4"
              >
                <Label active={proximity === 'beachfront'}>
                  <RadioGroupItem value="beachfront" className="sr-only" />
                  Beachfront
                </Label>
                <Label active={proximity === 'village'}>
                  <RadioGroupItem value="village" className="sr-only" />
                  Village
                </Label>
                <Label active={proximity === 'remote'}>
                  <RadioGroupItem value="remote" className="sr-only" />
                  Remote
                </Label>
              </RadioGroup>
            </TabsContent>
          </Tabs>

          <Button 
            onClick={searchHotels} 
            className="w-full bg-sifnos-deep-blue hover:bg-sifnos-deep-blue/90 text-white font-semibold py-6 gap-2 text-base"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
                Finding Perfect Stays...
              </>
            ) : (
              <>
                <Search className="mr-2 h-5 w-5" /> 
                Find Perfect Stays
              </>
            )}
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-sifnos-deep-blue mb-2">{getResultHeading()}</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {preferences.map(pref => (
                <Badge key={pref} className="bg-sifnos-deep-blue/10 text-sifnos-deep-blue hover:bg-sifnos-deep-blue/20">{pref}</Badge>
              ))}
              <Badge className="bg-sifnos-deep-blue/10 text-sifnos-deep-blue hover:bg-sifnos-deep-blue/20">
                {stayDuration === '1-3' ? 'short stay' : stayDuration === '4-7' ? 'week stay' : 'extended stay'}
              </Badge>
              <Badge className="bg-sifnos-deep-blue/10 text-sifnos-deep-blue hover:bg-sifnos-deep-blue/20">{proximity}</Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {results.length > 0 ? (
              results.map(hotel => (
                <div key={hotel.id} className="bg-white rounded-lg overflow-hidden shadow-md">
                  <HotelCard hotel={hotel} showLogo={false} />
                </div>
              ))
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <p className="text-lg font-medium text-gray-700">No hotels found matching your criteria</p>
                <p className="text-sm mt-2 text-gray-500">Try adjusting your preferences</p>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
            <Button 
              variant="outline" 
              onClick={resetSearch} 
              className="border-gray-300 text-gray-700"
            >
              New Search
            </Button>
            <Button asChild className="bg-sifnos-deep-blue hover:bg-sifnos-deep-blue/90">
              <Link to="/hotels">
                View All Hotels
              </Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

// Custom Label component for radio buttons
function Label({ children, active, className }: { children: React.ReactNode; active: boolean; className?: string }) {
  return (
    <label 
      className={`${
        active 
          ? "bg-sifnos-deep-blue text-white border-2 border-sifnos-deep-blue hover:bg-sifnos-deep-blue/90" 
          : "bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
      } flex items-center justify-center p-2 rounded-md cursor-pointer transition-all font-medium ${className || ""}`}
    >
      {children}
    </label>
  );
}
