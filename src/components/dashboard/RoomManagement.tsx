
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
import { Plus, Edit, Trash2, BedDouble } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RoomManagementProps {
  userId: string;
}

interface Room {
  id: string;
  hotel_id: string;
  name: string;
  description: string;
  capacity: number;
  price: number;
  size_sqm: number | null;
  amenities: string[] | null;
  hotel_name?: string;
}

interface Hotel {
  id: string;
  name: string;
}

export const RoomManagement = ({ userId }: RoomManagementProps) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    hotel_id: '',
    name: '',
    description: '',
    capacity: '',
    price: '',
    size_sqm: '',
    amenities: ''
  });

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    try {
      // Get user's hotels
      const { data: hotelOwners } = await supabase
        .from('hotel_owners')
        .select('hotel_id, hotels(*)')
        .eq('user_id', userId);

      const userHotels = hotelOwners?.map(ho => ho.hotels).filter(Boolean) || [];
      setHotels(userHotels as Hotel[]);

      const hotelIds = userHotels.map(h => h.id);

      if (hotelIds.length > 0) {
        // Get rooms for user's hotels
        const { data: roomsData } = await supabase
          .from('hotel_rooms')
          .select(`
            *,
            hotels(name)
          `)
          .in('hotel_id', hotelIds);

        const roomsWithHotelName = roomsData?.map(room => ({
          ...room,
          hotel_name: room.hotels?.name
        })) || [];

        setRooms(roomsWithHotelName as Room[]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch rooms and hotels",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      hotel_id: '',
      name: '',
      description: '',
      capacity: '',
      price: '',
      size_sqm: '',
      amenities: ''
    });
    setEditingRoom(null);
  };

  const openEditDialog = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      hotel_id: room.hotel_id,
      name: room.name,
      description: room.description,
      capacity: room.capacity.toString(),
      price: room.price.toString(),
      size_sqm: room.size_sqm?.toString() || '',
      amenities: room.amenities?.join(', ') || ''
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const roomData = {
        hotel_id: formData.hotel_id,
        name: formData.name,
        description: formData.description,
        capacity: parseInt(formData.capacity),
        price: parseFloat(formData.price),
        size_sqm: formData.size_sqm ? parseFloat(formData.size_sqm) : null,
        amenities: formData.amenities ? formData.amenities.split(',').map(a => a.trim()) : []
      };

      if (editingRoom) {
        // Update existing room
        const { error } = await supabase
          .from('hotel_rooms')
          .update(roomData)
          .eq('id', editingRoom.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Room updated successfully"
        });
      } else {
        // Create new room
        const { error } = await supabase
          .from('hotel_rooms')
          .insert(roomData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Room created successfully"
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      console.error('Error saving room:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (roomId: string) => {
    if (!confirm('Are you sure you want to delete this room?')) return;

    try {
      const { error } = await supabase
        .from('hotel_rooms')
        .delete()
        .eq('id', roomId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Room deleted successfully"
      });
      
      fetchData();
    } catch (error: any) {
      console.error('Error deleting room:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div>Loading rooms...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Room Management</h2>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} disabled={hotels.length === 0}>
              <Plus className="w-4 h-4 mr-2" />
              Add Room
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingRoom ? 'Edit Room' : 'Add New Room'}
              </DialogTitle>
              <DialogDescription>
                {editingRoom ? 'Update room information' : 'Create a new room listing'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="hotel_id">Hotel *</Label>
                <Select 
                  value={formData.hotel_id} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, hotel_id: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a hotel" />
                  </SelectTrigger>
                  <SelectContent>
                    {hotels.map((hotel) => (
                      <SelectItem key={hotel.id} value={hotel.id}>
                        {hotel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Room Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="capacity">Capacity *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price per Night (€) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="size_sqm">Size (m²)</Label>
                  <Input
                    id="size_sqm"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.size_sqm}
                    onChange={(e) => setFormData(prev => ({ ...prev, size_sqm: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="amenities">Amenities (comma separated)</Label>
                <Input
                  id="amenities"
                  value={formData.amenities}
                  onChange={(e) => setFormData(prev => ({ ...prev, amenities: e.target.value }))}
                  placeholder="e.g., Air conditioning, WiFi, TV, Balcony"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingRoom ? 'Update Room' : 'Create Room'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {hotels.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BedDouble className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-600 mb-2">No hotels found</p>
            <p className="text-gray-500 text-center mb-4">
              You need to add hotels first before creating rooms
            </p>
          </CardContent>
        </Card>
      ) : rooms.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BedDouble className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-600 mb-2">No rooms found</p>
            <p className="text-gray-500 text-center mb-4">
              Get started by adding your first room to any of your hotels
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <Card key={room.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{room.name}</CardTitle>
                    <CardDescription>{room.hotel_name}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(room)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(room.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    {room.description.substring(0, 100) + (room.description.length > 100 ? '...' : '')}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">€{room.price}/night</span>
                    <span className="text-sm text-gray-500">
                      {room.capacity} guest{room.capacity > 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  {room.size_sqm && (
                    <p className="text-sm text-gray-500">{room.size_sqm} m²</p>
                  )}
                  
                  {room.amenities && room.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {room.amenities.slice(0, 3).map((amenity, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {room.amenities.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{room.amenities.length - 3} more
                        </Badge>
                      )}
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
