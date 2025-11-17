import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Star, 
  Award, 
  Calendar, 
  ArrowUp, 
  ArrowDown,
  Save,
  Loader2
} from 'lucide-react';
// Format date helper
const formatDate = (dateString: string | null): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
  } catch {
    return '';
  }
};

interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  is_featured: boolean;
  featured_priority: number;
  featured_start_date: string | null;
  featured_end_date: string | null;
  featured_tier: 'bronze' | 'silver' | 'gold' | 'platinum' | null;
  featured_notes: string | null;
}

const TIER_COLORS = {
  platinum: 'bg-purple-100 text-purple-800 border-purple-300',
  gold: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  silver: 'bg-gray-100 text-gray-800 border-gray-300',
  bronze: 'bg-orange-100 text-orange-800 border-orange-300',
};

export default function FeaturedHotelsManagement() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hotels')
        .select('id, name, location, rating, is_featured, featured_priority, featured_start_date, featured_end_date, featured_tier, featured_notes')
        .order('is_featured', { ascending: false })
        .order('featured_priority', { ascending: false })
        .order('rating', { ascending: false });

      if (error) throw error;
      setHotels((data || []) as Hotel[]);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      toast({
        title: "Error loading hotels",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateHotel = async (hotelId: string, updates: Partial<Hotel>) => {
    try {
      setSaving(hotelId);
      const { error } = await supabase
        .from('hotels')
        .update(updates)
        .eq('id', hotelId);

      if (error) throw error;

      // Update local state
      setHotels(prev => prev.map(h => 
        h.id === hotelId ? { ...h, ...updates } : h
      ));

      toast({
        title: "Hotel updated",
        description: "Featured status has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating hotel:', error);
      toast({
        title: "Error updating hotel",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  };

  const toggleFeatured = (hotel: Hotel) => {
    const newIsFeatured = !hotel.is_featured;
    updateHotel(hotel.id, {
      is_featured: newIsFeatured,
      featured_priority: newIsFeatured ? (hotel.featured_priority || 0) : 0,
    });
  };

  const updatePriority = (hotel: Hotel, direction: 'up' | 'down') => {
    const currentPriority = hotel.featured_priority || 0;
    const newPriority = direction === 'up' ? currentPriority + 1 : Math.max(0, currentPriority - 1);
    updateHotel(hotel.id, { featured_priority: newPriority });
  };

  const updateTier = (hotel: Hotel, tier: string) => {
    updateHotel(hotel.id, { 
      featured_tier: tier === 'none' ? null : tier as Hotel['featured_tier']
    });
  };

  const updateDate = (hotel: Hotel, field: 'featured_start_date' | 'featured_end_date', value: string) => {
    updateHotel(hotel.id, { [field]: value || null });
  };

  const updateNotes = (hotel: Hotel, notes: string) => {
    updateHotel(hotel.id, { featured_notes: notes });
  };

  const featuredHotels = hotels.filter(h => h.is_featured);
  const regularHotels = hotels.filter(h => !h.is_featured);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-sifnos-turquoise" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-sifnos-deep-blue">Featured Hotels Management</h1>
        <p className="text-gray-600 mt-1">Manage which hotels appear as featured on the homepage and in AI recommendations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Hotels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hotels.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Featured Hotels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sifnos-turquoise">{featuredHotels.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Platinum Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {featuredHotels.filter(h => h.featured_tier === 'platinum').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Gold Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {featuredHotels.filter(h => h.featured_tier === 'gold').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Hotels Table */}
      <Card>
        <CardHeader>
          <CardTitle>Featured Hotels</CardTitle>
          <CardDescription>
            These hotels appear on the homepage and are prioritized in AI recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hotel</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {featuredHotels.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                    No featured hotels. Enable featured status for hotels below.
                  </TableCell>
                </TableRow>
              ) : (
                featuredHotels.map((hotel) => (
                  <TableRow key={hotel.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{hotel.name}</div>
                        <div className="text-sm text-gray-500">{hotel.location}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs">{hotel.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updatePriority(hotel, 'down')}
                          disabled={saving === hotel.id}
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                        <span className="font-medium w-8 text-center">{hotel.featured_priority || 0}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updatePriority(hotel, 'up')}
                          disabled={saving === hotel.id}
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={hotel.featured_tier || 'none'}
                        onValueChange={(value) => updateTier(hotel, value)}
                        disabled={saving === hotel.id}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="bronze">Bronze</SelectItem>
                          <SelectItem value="silver">Silver</SelectItem>
                          <SelectItem value="gold">Gold</SelectItem>
                          <SelectItem value="platinum">Platinum</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="date"
                        value={formatDate(hotel.featured_start_date)}
                        onChange={(e) => updateDate(hotel, 'featured_start_date', e.target.value)}
                        className="w-40"
                        disabled={saving === hotel.id}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="date"
                        value={formatDate(hotel.featured_end_date)}
                        onChange={(e) => updateDate(hotel, 'featured_end_date', e.target.value)}
                        className="w-40"
                        disabled={saving === hotel.id}
                      />
                    </TableCell>
                    <TableCell>
                      {hotel.featured_tier && (
                        <Badge className={TIER_COLORS[hotel.featured_tier]}>
                          <Award className="h-3 w-3 mr-1" />
                          {hotel.featured_tier.charAt(0).toUpperCase() + hotel.featured_tier.slice(1)}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleFeatured(hotel)}
                        disabled={saving === hotel.id}
                      >
                        {saving === hotel.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Remove'
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Regular Hotels Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Hotels</CardTitle>
          <CardDescription>
            Enable featured status for hotels to appear on the homepage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hotel</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regularHotels.map((hotel) => (
                <TableRow key={hotel.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{hotel.name}</div>
                      <div className="text-sm text-gray-500">{hotel.location}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span>{hotel.rating.toFixed(1)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={hotel.is_featured}
                      onCheckedChange={() => toggleFeatured(hotel)}
                      disabled={saving === hotel.id}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    {saving === hotel.id && (
                      <Loader2 className="h-4 w-4 animate-spin inline-block" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

