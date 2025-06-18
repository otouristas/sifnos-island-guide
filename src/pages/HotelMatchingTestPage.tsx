import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { searchHotels } from '@/services/hotelSearch';
import { supabase } from '@/integrations/supabase/client';
import { Search, Check, X, TrendingUp, Star, MapPin, ExternalLink } from 'lucide-react';
import SEO from '@/components/SEO';

interface LocalHotel {
  id: number;
  name: string;
  location: string;
  price?: number; // Use 'price' to match database column
  rating: number;
  image_url: string;
  description?: string;
}

interface AgodaHotel {
  hotelId: number;
  hotelName: string;
  starRating: number;
  reviewScore: number;
  reviewCount: number;
  currency: string;
  dailyRate: number;
  imageURL: string;
  landingURL: string;
  includeBreakfast: boolean;
  freeWifi: boolean;
}

interface MatchedPair {
  local: LocalHotel;
  agoda: AgodaHotel;
  similarity: number;
}

export default function HotelMatchingTestPage() {
  const [localHotels, setLocalHotels] = useState<LocalHotel[]>([]);
  const [agodaHotels, setAgodaHotels] = useState<AgodaHotel[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<MatchedPair[]>([]);
  const [unmatchedLocal, setUnmatchedLocal] = useState<LocalHotel[]>([]);
  const [unmatchedAgoda, setUnmatchedAgoda] = useState<AgodaHotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchDates, setSearchDates] = useState({
    checkIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  const { toast } = useToast();

  // Hotel matching utility functions
  const normalizeHotelName = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[™®©]/g, '') // Remove trademark symbols
      .replace(/hotel|resort|suites|apartments|rooms|villa|pension/gi, '')
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
  };

  const calculateNameSimilarity = (name1: string, name2: string): number => {
    const norm1 = normalizeHotelName(name1);
    const norm2 = normalizeHotelName(name2);
    
    // Exact match after normalization
    if (norm1 === norm2) return 1.0;
    
    // Check if one contains the other
    if (norm1.includes(norm2) || norm2.includes(norm1)) return 0.8;
    
    // Simple Levenshtein distance for fuzzy matching
    const distance = levenshteinDistance(norm1, norm2);
    const maxLength = Math.max(norm1.length, norm2.length);
    return maxLength > 0 ? 1 - (distance / maxLength) : 0;
  };

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[str2.length][str1.length];
  };

  const matchHotels = (locals: LocalHotel[], agodas: AgodaHotel[]) => {
    const matched: MatchedPair[] = [];
    const unusedLocal = [...locals];
    const unusedAgoda = [...agodas];

    agodas.forEach((agodaHotel, agodaIndex) => {
      let bestMatch: { hotel: LocalHotel; index: number; similarity: number } | null = null;
      
      unusedLocal.forEach((localHotel, localIndex) => {
        const similarity = calculateNameSimilarity(localHotel.name, agodaHotel.hotelName);
        console.log(`🔍 Comparing "${localHotel.name}" vs "${agodaHotel.hotelName}" = ${similarity.toFixed(3)}`);
        
        if (similarity > 0.6 && (!bestMatch || similarity > bestMatch.similarity)) {
          bestMatch = { hotel: localHotel, index: localIndex, similarity };
        }
      });
      
      if (bestMatch) {
        console.log(`✅ MATCH: "${bestMatch.hotel.name}" <-> "${agodaHotel.hotelName}" (${bestMatch.similarity.toFixed(3)})`);
        matched.push({
          local: bestMatch.hotel,
          agoda: agodaHotel,
          similarity: bestMatch.similarity
        });
        
        // Remove from unused arrays
        unusedLocal.splice(bestMatch.index, 1);
        const agodaIdx = unusedAgoda.findIndex(h => h.hotelId === agodaHotel.hotelId);
        if (agodaIdx !== -1) unusedAgoda.splice(agodaIdx, 1);
      }
    });

    return { matched, unusedLocal, unusedAgoda };
  };

  const fetchLocalHotels = async () => {
    try {
      console.log('🔍 Fetching local hotels from Supabase...');
      const { data, error } = await supabase
        .from('hotels')
        .select('id, name, location, price, rating, image_url, description')
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (error) throw error;
      console.log(`📊 Found ${data?.length || 0} local hotels`);
      return data || [];
    } catch (error) {
      console.error('Error fetching local hotels:', error);
      return [];
    }
  };

  const fetchAgodaHotels = async () => {
    try {
      console.log('🔍 Searching Agoda with dates:', searchDates);
      
      const agodaResults = await searchHotels({
        checkInDate: searchDates.checkIn,
        checkOutDate: searchDates.checkOut,
        numberOfAdults: 2,
        numberOfChildren: 0
      });

      // Filter only Agoda results and extract the agoda_data
      const agodaOnly = agodaResults
        .filter(hotel => hotel.source === 'agoda' && hotel.agoda_data)
        .map(hotel => hotel.agoda_data);

      console.log('📊 Found Agoda hotels:', agodaOnly.length);
      console.log('📊 Agoda hotel names:', agodaOnly.map(h => h.hotelName));
      return agodaOnly;
    } catch (error) {
      console.error('Error fetching Agoda hotels:', error);
      return [];
    }
  };

  const runMatchingTest = async () => {
    setLoading(true);
    try {
      toast({
        title: "Starting Hotel Matching Test",
        description: "Fetching local and Agoda hotels...",
      });

      // Fetch both datasets in parallel
      const [locals, agodas] = await Promise.all([
        fetchLocalHotels(),
        fetchAgodaHotels()
      ]);

      console.log('📊 Fetched:', { locals: locals.length, agodas: agodas.length });

      if (locals.length === 0) {
        toast({
          title: "No Local Hotels Found",
          description: "Check your Supabase connection and data.",
          variant: "destructive"
        });
        return;
      }

      if (agodas.length === 0) {
        toast({
          title: "No Agoda Hotels Found",
          description: "Check your search dates and Agoda integration.",
          variant: "destructive"
        });
        return;
      }

      // Perform matching
      console.log('🔄 Starting hotel matching process...');
      const results = matchHotels(locals, agodas);
      
      setLocalHotels(locals);
      setAgodaHotels(agodas);
      setMatchedPairs(results.matched);
      setUnmatchedLocal(results.unusedLocal);
      setUnmatchedAgoda(results.unusedAgoda);

      toast({
        title: "Matching Complete! 🎉",
        description: `Found ${results.matched.length} matches out of ${locals.length} local and ${agodas.length} Agoda hotels.`,
      });

    } catch (error) {
      console.error('Error in matching test:', error);
      toast({
        title: "Matching Failed",
        description: "An error occurred during the matching process.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-run the test when component loads
    runMatchingTest();
  }, []);

  const MatchedHotelCard = ({ pair }: { pair: MatchedPair }) => (
    <Card className="mb-4 border-green-200 bg-green-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Check className="text-green-600" size={20} />
            Hotel Match Found
          </CardTitle>
          <Badge className="bg-green-500 text-white">
            {Math.round(pair.similarity * 100)}% Match
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Local Hotel */}
          <div className="space-y-2">
            <h3 className="font-semibold text-blue-700">Local Database</h3>
            <div className="bg-white p-3 rounded border">
              <h4 className="font-medium">{pair.local.name}</h4>
              <p className="text-sm text-gray-600 flex items-center">
                <MapPin size={12} className="mr-1" />
                {pair.local.location}
              </p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center text-yellow-500">
                  <Star size={14} fill="currentColor" />
                  <span className="ml-1 text-sm">{pair.local.rating}</span>
                </div>
                {pair.local.price && (
                  <span className="text-sm font-medium">€{pair.local.price}/night</span>
                )}
              </div>
            </div>
          </div>

          {/* Agoda Hotel */}
          <div className="space-y-2">
            <h3 className="font-semibold text-orange-700">Agoda Live Data</h3>
            <div className="bg-white p-3 rounded border">
              <h4 className="font-medium">{pair.agoda.hotelName}</h4>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-yellow-500">
                    <Star size={14} fill="currentColor" />
                    <span className="ml-1 text-sm">{pair.agoda.reviewScore}</span>
                  </div>
                  <span className="text-xs text-gray-500">({pair.agoda.reviewCount} reviews)</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{pair.agoda.currency}{pair.agoda.dailyRate}/night</div>
                  {pair.agoda.includeBreakfast && (
                    <Badge variant="outline" className="text-xs">Breakfast</Badge>
                  )}
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="mt-2 w-full" 
                asChild
              >
                <a href={pair.agoda.landingURL} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={12} className="mr-1" />
                  View on Agoda
                </a>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const UnmatchedHotelCard = ({ hotel, type }: { hotel: LocalHotel | AgodaHotel, type: 'local' | 'agoda' }) => (
    <Card className="mb-4 border-gray-200">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">
            {'name' in hotel ? hotel.name : hotel.hotelName}
          </h4>
          <Badge variant="outline" className={type === 'local' ? 'text-blue-600' : 'text-orange-600'}>
            {type === 'local' ? 'Local Only' : 'Agoda Only'}
          </Badge>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-yellow-500">
            <Star size={12} fill="currentColor" />
            <span className="ml-1">
              {'rating' in hotel ? hotel.rating : hotel.reviewScore}
            </span>
          </div>
          <span>
            {type === 'local' && 'price' in hotel && hotel.price 
              ? `€${hotel.price}/night`
              : type === 'agoda' && 'dailyRate' in hotel
              ? `${hotel.currency}${hotel.dailyRate}/night`
              : 'Price not available'
            }
          </span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Hotel Matching Test - Sifnos Hotels"
        description="Testing hotel matching between local database and Agoda live data"
        keywords={['hotel matching', 'Agoda integration', 'Sifnos hotels', 'test page']}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              🔍 Hotel Matching Test
            </h1>
            <p className="text-gray-600 mb-6">
              This page demonstrates matching between local Supabase hotels and live Agoda data.
              Perfect match example: "ALK HOTEL™" (local) ↔ "ALK Hotelᵀᴹ" (Agoda)
            </p>
            
            {/* Search Controls */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Search Parameters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium mb-2">Check-in Date</label>
                    <Input
                      type="date"
                      value={searchDates.checkIn}
                      onChange={(e) => setSearchDates(prev => ({ ...prev, checkIn: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Check-out Date</label>
                    <Input
                      type="date"
                      value={searchDates.checkOut}
                      onChange={(e) => setSearchDates(prev => ({ ...prev, checkOut: e.target.value }))}
                    />
                  </div>
                  <Button 
                    onClick={runMatchingTest} 
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    {loading ? (
                      <TrendingUp className="animate-spin" size={16} />
                    ) : (
                      <Search size={16} />
                    )}
                    {loading ? 'Matching...' : 'Run Matching Test'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            {(localHotels.length > 0 || agodaHotels.length > 0) && (
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold text-blue-600">{localHotels.length}</div>
                    <div className="text-sm text-gray-600">Local Hotels</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold text-orange-600">{agodaHotels.length}</div>
                    <div className="text-sm text-gray-600">Agoda Hotels</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold text-green-600">{matchedPairs.length}</div>
                    <div className="text-sm text-gray-600">Matched Pairs</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {localHotels.length > 0 ? Math.round((matchedPairs.length / localHotels.length) * 100) : 0}%
                    </div>
                    <div className="text-sm text-gray-600">Match Rate</div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="space-y-8">
            {/* Matched Hotels */}
            {matchedPairs.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Check className="text-green-600" />
                  Matched Hotels ({matchedPairs.length})
                </h2>
                <div className="space-y-4">
                  {matchedPairs.map((pair, index) => (
                    <MatchedHotelCard key={index} pair={pair} />
                  ))}
                </div>
              </section>
            )}

            {/* Unmatched Hotels */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Unmatched Local */}
              {unmatchedLocal.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <X className="text-blue-600" />
                    Unmatched Local Hotels ({unmatchedLocal.length})
                  </h2>
                  <div className="space-y-4">
                    {unmatchedLocal.map((hotel) => (
                      <UnmatchedHotelCard key={hotel.id} hotel={hotel} type="local" />
                    ))}
                  </div>
                </section>
              )}

              {/* Unmatched Agoda */}
              {unmatchedAgoda.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <X className="text-orange-600" />
                    Unmatched Agoda Hotels ({unmatchedAgoda.length})
                  </h2>
                  <div className="space-y-4">
                    {unmatchedAgoda.map((hotel) => (
                      <UnmatchedHotelCard key={hotel.hotelId} hotel={hotel} type="agoda" />
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <TrendingUp className="animate-spin mx-auto mb-4" size={48} />
              <p className="text-gray-600">Fetching and matching hotels...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && localHotels.length === 0 && agodaHotels.length === 0 && (
            <div className="text-center py-12">
              <Search size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Click "Run Matching Test" to start the hotel matching process.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
