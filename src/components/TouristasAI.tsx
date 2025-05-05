
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Hotel, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

  const togglePreference = (preference: AIPreference) => {
    if (preferences.includes(preference)) {
      setPreferences(preferences.filter(p => p !== preference));
    } else {
      setPreferences([...preferences, preference]);
    }
  };

  const searchHotels = async () => {
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
      
      if (error) throw error;
      
      // If we're looking specifically for beach hotels, prioritize them
      let filteredResults = data || [];
      if (preferences.includes('beach')) {
        filteredResults = filteredResults.filter((hotel) => 
          hotel.description.toLowerCase().includes('beach') || 
          hotel.location === 'Platis Gialos' ||
          hotel.location === 'Vathi' ||
          hotel.location === 'Kamares'
        );
      }

      // Limit results to max 3
      setResults(filteredResults.slice(0, 3));
    } catch (error) {
      console.error('Error searching hotels:', error);
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

  return (
    <div className="bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] text-white rounded-lg p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-white p-2 rounded-lg">
          <Hotel className="h-6 w-6 text-[#7E69AB]" />
        </div>
        <h2 className="text-2xl font-bold">Touristas AI</h2>
        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">powered by GreeceCyclades.com</span>
      </div>

      {results.length === 0 ? (
        <>
          <p className="mb-6 text-lg">
            Tell us what you're looking for and let our AI recommend the perfect stays in Sifnos.
          </p>
          
          <Tabs defaultValue="preferences" className="mb-6">
            <TabsList className="bg-white/20 w-full">
              <TabsTrigger value="preferences" className="flex-1">Preferences</TabsTrigger>
              <TabsTrigger value="duration" className="flex-1">Duration</TabsTrigger>
              <TabsTrigger value="proximity" className="flex-1">Location</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preferences" className="mt-4">
              <h3 className="text-lg font-medium mb-2">What type of stay are you looking for?</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button 
                  variant={preferences.includes('beach') ? "default" : "outline"} 
                  className={preferences.includes('beach') 
                    ? "bg-white text-[#7E69AB] border-2 border-white hover:bg-white/90" 
                    : "bg-transparent text-white border-2 border-white hover:bg-white/10"
                  }
                  onClick={() => togglePreference('beach')}
                >
                  Beach
                </Button>
                <Button 
                  variant={preferences.includes('family') ? "default" : "outline"} 
                  className={preferences.includes('family') 
                    ? "bg-white text-[#7E69AB] border-2 border-white hover:bg-white/90" 
                    : "bg-transparent text-white border-2 border-white hover:bg-white/10"
                  }
                  onClick={() => togglePreference('family')}
                >
                  Family
                </Button>
                <Button 
                  variant={preferences.includes('luxury') ? "default" : "outline"} 
                  className={preferences.includes('luxury') 
                    ? "bg-white text-[#7E69AB] border-2 border-white hover:bg-white/90" 
                    : "bg-transparent text-white border-2 border-white hover:bg-white/10"
                  }
                  onClick={() => togglePreference('luxury')}
                >
                  Luxury
                </Button>
                <Button 
                  variant={preferences.includes('budget') ? "default" : "outline"} 
                  className={preferences.includes('budget') 
                    ? "bg-white text-[#7E69AB] border-2 border-white hover:bg-white/90" 
                    : "bg-transparent text-white border-2 border-white hover:bg-white/10"
                  }
                  onClick={() => togglePreference('budget')}
                >
                  Budget
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="duration" className="mt-4">
              <h3 className="text-lg font-medium mb-2">How long will you stay?</h3>
              <div className="grid grid-cols-3 gap-3">
                <Button 
                  variant={stayDuration === '1-3' ? "default" : "outline"} 
                  className={stayDuration === '1-3' 
                    ? "bg-white text-[#7E69AB] border-2 border-white hover:bg-white/90" 
                    : "bg-transparent text-white border-2 border-white hover:bg-white/10"
                  }
                  onClick={() => setStayDuration('1-3')}
                >
                  1-3 days
                </Button>
                <Button 
                  variant={stayDuration === '4-7' ? "default" : "outline"} 
                  className={stayDuration === '4-7' 
                    ? "bg-white text-[#7E69AB] border-2 border-white hover:bg-white/90" 
                    : "bg-transparent text-white border-2 border-white hover:bg-white/10"
                  }
                  onClick={() => setStayDuration('4-7')}
                >
                  4-7 days
                </Button>
                <Button 
                  variant={stayDuration === '8+' ? "default" : "outline"} 
                  className={stayDuration === '8+' 
                    ? "bg-white text-[#7E69AB] border-2 border-white hover:bg-white/90" 
                    : "bg-transparent text-white border-2 border-white hover:bg-white/10"
                  }
                  onClick={() => setStayDuration('8+')}
                >
                  8+ days
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="proximity" className="mt-4">
              <h3 className="text-lg font-medium mb-2">Where do you want to stay?</h3>
              <div className="grid grid-cols-3 gap-3">
                <Button 
                  variant={proximity === 'beachfront' ? "default" : "outline"} 
                  className={proximity === 'beachfront' 
                    ? "bg-white text-[#7E69AB] border-2 border-white hover:bg-white/90" 
                    : "bg-transparent text-white border-2 border-white hover:bg-white/10"
                  }
                  onClick={() => setProximity('beachfront')}
                >
                  Beachfront
                </Button>
                <Button 
                  variant={proximity === 'village' ? "default" : "outline"} 
                  className={proximity === 'village' 
                    ? "bg-white text-[#7E69AB] border-2 border-white hover:bg-white/90" 
                    : "bg-transparent text-white border-2 border-white hover:bg-white/10"
                  }
                  onClick={() => setProximity('village')}
                >
                  Village
                </Button>
                <Button 
                  variant={proximity === 'remote' ? "default" : "outline"} 
                  className={proximity === 'remote' 
                    ? "bg-white text-[#7E69AB] border-2 border-white hover:bg-white/90" 
                    : "bg-transparent text-white border-2 border-white hover:bg-white/10"
                  }
                  onClick={() => setProximity('remote')}
                >
                  Remote
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <Button 
            onClick={searchHotels} 
            className="w-full bg-white text-[#7E69AB] hover:bg-white/90"
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : (
              <>
                <Search className="mr-2 h-4 w-4" /> 
                Find Perfect Stays
              </>
            )}
          </Button>
        </>
      ) : (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">{getResultHeading()}</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {preferences.map(pref => (
                <Badge key={pref} className="bg-white/20">{pref}</Badge>
              ))}
              <Badge className="bg-white/20">
                {stayDuration === '1-3' ? 'short stay' : stayDuration === '4-7' ? 'week stay' : 'extended stay'}
              </Badge>
              <Badge className="bg-white/20">{proximity}</Badge>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="grid grid-cols-1 gap-4">
              {results.map(hotel => (
                <div key={hotel.id} className="bg-white rounded-lg overflow-hidden">
                  <HotelCard hotel={hotel} showLogo={false} />
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex justify-between">
              <Button variant="outline" onClick={() => setResults([])}>
                New Search
              </Button>
              <Button asChild>
                <Link to="/hotels">
                  View All Hotels
                </Link>
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
