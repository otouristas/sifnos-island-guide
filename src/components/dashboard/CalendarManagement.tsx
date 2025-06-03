
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, addDays, startOfMonth, endOfMonth } from 'date-fns';

interface CalendarManagementProps {
  userId: string;
}

interface Room {
  id: string;
  name: string;
  hotel_id: string;
  hotel_name?: string;
  price: number;
}

interface RoomAvailability {
  id: string;
  room_id: string;
  date: string;
  is_available: boolean;
  price: number | null;
  min_stay: number | null;
}

export const CalendarManagement = ({ userId }: CalendarManagementProps) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [availability, setAvailability] = useState<RoomAvailability[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Form data for bulk operations
  const [bulkData, setBulkData] = useState({
    startDate: '',
    endDate: '',
    isAvailable: true,
    price: '',
    minStay: '1'
  });

  useEffect(() => {
    fetchRooms();
  }, [userId]);

  useEffect(() => {
    if (selectedRoom && selectedDate) {
      fetchAvailability();
    }
  }, [selectedRoom, selectedDate]);

  const fetchRooms = async () => {
    try {
      const { data: hotelOwners } = await supabase
        .from('hotel_owners')
        .select('hotel_id')
        .eq('user_id', userId);

      const hotelIds = hotelOwners?.map(ho => ho.hotel_id) || [];

      if (hotelIds.length > 0) {
        const { data: roomsData } = await supabase
          .from('hotel_rooms')
          .select(`
            id,
            name,
            hotel_id,
            price,
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
      console.error('Error fetching rooms:', error);
      toast({
        title: "Error",
        description: "Failed to fetch rooms",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailability = async () => {
    if (!selectedRoom || !selectedDate) return;

    try {
      const monthStart = startOfMonth(selectedDate);
      const monthEnd = endOfMonth(selectedDate);

      const { data } = await supabase
        .from('room_availability')
        .select('*')
        .eq('room_id', selectedRoom)
        .gte('date', format(monthStart, 'yyyy-MM-dd'))
        .lte('date', format(monthEnd, 'yyyy-MM-dd'));

      setAvailability(data || []);
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const getAvailabilityForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return availability.find(a => a.date === dateStr);
  };

  const handleDateToggle = async (date: Date) => {
    if (!selectedRoom) return;

    const dateStr = format(date, 'yyyy-MM-dd');
    const existing = getAvailabilityForDate(date);
    const selectedRoomData = rooms.find(r => r.id === selectedRoom);

    try {
      if (existing) {
        // Update existing availability
        const { error } = await supabase
          .from('room_availability')
          .update({ 
            is_available: !existing.is_available,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Create new availability record
        const { error } = await supabase
          .from('room_availability')
          .insert({
            room_id: selectedRoom,
            date: dateStr,
            is_available: true,
            price: selectedRoomData?.price || null,
            min_stay: 1
          });

        if (error) throw error;
      }

      await fetchAvailability();
      toast({
        title: "Success",
        description: "Availability updated"
      });
    } catch (error: any) {
      console.error('Error updating availability:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleBulkUpdate = async () => {
    if (!selectedRoom || !bulkData.startDate || !bulkData.endDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const startDate = new Date(bulkData.startDate);
      const endDate = new Date(bulkData.endDate);
      const selectedRoomData = rooms.find(r => r.id === selectedRoom);

      const dates = [];
      let currentDate = startDate;
      
      while (currentDate <= endDate) {
        dates.push(format(currentDate, 'yyyy-MM-dd'));
        currentDate = addDays(currentDate, 1);
      }

      // Create or update availability for each date
      for (const date of dates) {
        const existing = availability.find(a => a.date === date);
        
        const availabilityData = {
          room_id: selectedRoom,
          date: date,
          is_available: bulkData.isAvailable,
          price: bulkData.price ? parseFloat(bulkData.price) : selectedRoomData?.price || null,
          min_stay: parseInt(bulkData.minStay),
          updated_at: new Date().toISOString()
        };

        if (existing) {
          await supabase
            .from('room_availability')
            .update(availabilityData)
            .eq('id', existing.id);
        } else {
          await supabase
            .from('room_availability')
            .insert(availabilityData);
        }
      }

      await fetchAvailability();
      setIsDialogOpen(false);
      setBulkData({
        startDate: '',
        endDate: '',
        isAvailable: true,
        price: '',
        minStay: '1'
      });

      toast({
        title: "Success",
        description: `Updated availability for ${dates.length} days`
      });
    } catch (error: any) {
      console.error('Error with bulk update:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div>Loading calendar...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Room Calendar & Availability</h2>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={!selectedRoom}>
              <Plus className="w-4 h-4 mr-2" />
              Bulk Update
            </Button>
          </DialogTrigger>
          
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bulk Update Availability</DialogTitle>
              <DialogDescription>
                Update availability and pricing for multiple dates at once
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={bulkData.startDate}
                    onChange={(e) => setBulkData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={bulkData.endDate}
                    onChange={(e) => setBulkData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is-available"
                  checked={bulkData.isAvailable}
                  onCheckedChange={(checked) => setBulkData(prev => ({ ...prev, isAvailable: checked }))}
                />
                <Label htmlFor="is-available">Available</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price per Night (€)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={bulkData.price}
                    onChange={(e) => setBulkData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="Leave empty for room default"
                  />
                </div>
                
                <div>
                  <Label htmlFor="min-stay">Minimum Stay (nights)</Label>
                  <Input
                    id="min-stay"
                    type="number"
                    min="1"
                    value={bulkData.minStay}
                    onChange={(e) => setBulkData(prev => ({ ...prev, minStay: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleBulkUpdate}>
                  Update Availability
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Room Selection
          </CardTitle>
          <CardDescription>
            Select a room to manage its availability and pricing
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="w-full max-w-md">
            <Label htmlFor="room-select">Choose Room</Label>
            <Select value={selectedRoom} onValueChange={setSelectedRoom}>
              <SelectTrigger>
                <SelectValue placeholder="Select a room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.hotel_name} - {room.name} (€{room.price}/night)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedRoom && (
        <Card>
          <CardHeader>
            <CardTitle>Availability Calendar</CardTitle>
            <CardDescription>
              Click on dates to toggle availability. Green means available, gray means unavailable.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border mx-auto"
              modifiersClassNames={{
                selected: "bg-blue-100",
              }}
              modifiers={{
                available: (date) => {
                  const avail = getAvailabilityForDate(date);
                  return avail ? avail.is_available : false;
                },
                unavailable: (date) => {
                  const avail = getAvailabilityForDate(date);
                  return avail ? !avail.is_available : false;
                }
              }}
              modifiersStyles={{
                available: { backgroundColor: "#d1fae5", color: "black" },
                unavailable: { backgroundColor: "#f3f4f6", color: "#9ca3af" }
              }}
              onDayClick={handleDateToggle}
              styles={{
                day: { height: 40, width: 40 }
              }}
            />

            <div className="flex justify-center gap-4 mt-6">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-[#d1fae5] rounded"></div>
                <span className="text-sm">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-[#f3f4f6] rounded"></div>
                <span className="text-sm">Not available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-blue-100 rounded"></div>
                <span className="text-sm">Selected date</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
