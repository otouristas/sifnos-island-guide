
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HotelManagementProps {
  userId: string;
}

interface Hotel {
  id: string;
  name: string;
  location: string;
  description: string;
  short_description: string | null;
  price: number;
  rating: number;
  hotel_types: string[] | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
}

export const HotelManagement = ({ userId }: HotelManagementProps) => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    short_description: '',
    price: '',
    rating: '5',
    hotel_types: '',
    address: '',
    phone: '',
    email: '',
    website: ''
  });

  useEffect(() => {
    fetchHotels();
  }, [userId]);

  const fetchHotels = async () => {
    try {
      const { data: hotelOwners } = await supabase
        .from('hotel_owners')
        .select('hotel_id, hotels(*)')
        .eq('user_id', userId);

      const hotelData = hotelOwners?.map(ho => ho.hotels).filter(Boolean) || [];
      setHotels(hotelData as Hotel[]);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      toast({
        title: "Error",
        description: "Failed to fetch hotels",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      description: '',
      short_description: '',
      price: '',
      rating: '5',
      hotel_types: '',
      address: '',
      phone: '',
      email: '',
      website: ''
    });
    setEditingHotel(null);
  };

  const openEditDialog = (hotel: Hotel) => {
    setEditingHotel(hotel);
    setFormData({
      name: hotel.name,
      location: hotel.location,
      description: hotel.description,
      short_description: hotel.short_description || '',
      price: hotel.price.toString(),
      rating: hotel.rating.toString(),
      hotel_types: hotel.hotel_types?.join(', ') || '',
      address: hotel.address || '',
      phone: hotel.phone || '',
      email: hotel.email || '',
      website: hotel.website || ''
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const hotelData = {
        name: formData.name,
        location: formData.location,
        description: formData.description,
        short_description: formData.short_description || null,
        price: parseFloat(formData.price),
        rating: parseInt(formData.rating),
        hotel_types: formData.hotel_types ? formData.hotel_types.split(',').map(t => t.trim()) : [],
        address: formData.address || null,
        phone: formData.phone || null,
        email: formData.email || null,
        website: formData.website || null
      };

      if (editingHotel) {
        // Update existing hotel
        const { error } = await supabase
          .from('hotels')
          .update(hotelData)
          .eq('id', editingHotel.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Hotel updated successfully"
        });
      } else {
        // Create new hotel
        const { data: newHotel, error } = await supabase
          .from('hotels')
          .insert(hotelData)
          .select()
          .single();

        if (error) throw error;

        // Link hotel to current user
        const { error: ownerError } = await supabase
          .from('hotel_owners')
          .insert({
            user_id: userId,
            hotel_id: newHotel.id,
            role: 'owner'
          });

        if (ownerError) throw ownerError;

        toast({
          title: "Success",
          description: "Hotel created successfully"
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchHotels();
    } catch (error: any) {
      console.error('Error saving hotel:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (hotelId: string) => {
    if (!confirm('Are you sure you want to delete this hotel?')) return;

    try {
      const { error } = await supabase
        .from('hotels')
        .delete()
        .eq('id', hotelId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Hotel deleted successfully"
      });
      
      fetchHotels();
    } catch (error: any) {
      console.error('Error deleting hotel:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div>Loading hotels...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Hotel Management</h2>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Hotel
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingHotel ? 'Edit Hotel' : 'Add New Hotel'}
              </DialogTitle>
              <DialogDescription>
                {editingHotel ? 'Update hotel information' : 'Create a new hotel listing'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Hotel Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="short_description">Short Description</Label>
                <Input
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Base Price (€) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="rating">Rating *</Label>
                  <Select value={formData.rating} onValueChange={(value) => setFormData(prev => ({ ...prev, rating: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Star</SelectItem>
                      <SelectItem value="2">2 Stars</SelectItem>
                      <SelectItem value="3">3 Stars</SelectItem>
                      <SelectItem value="4">4 Stars</SelectItem>
                      <SelectItem value="5">5 Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="hotel_types">Hotel Types (comma separated)</Label>
                <Input
                  id="hotel_types"
                  value={formData.hotel_types}
                  onChange={(e) => setFormData(prev => ({ ...prev, hotel_types: e.target.value }))}
                  placeholder="e.g., Boutique Hotel, Villa, Apartment"
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingHotel ? 'Update Hotel' : 'Create Hotel'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {hotels.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-600 mb-2">No hotels found</p>
            <p className="text-gray-500 text-center mb-4">
              Get started by adding your first hotel to the system
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <Card key={hotel.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{hotel.name}</CardTitle>
                    <CardDescription>{hotel.location}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(hotel)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(hotel.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    {hotel.short_description || hotel.description.substring(0, 100) + '...'}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">€{hotel.price}/night</span>
                    <div className="flex items-center">
                      {'★'.repeat(hotel.rating)}
                    </div>
                  </div>
                  
                  {hotel.hotel_types && (
                    <div className="flex flex-wrap gap-1">
                      {hotel.hotel_types.map((type, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
