
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface BookingManagementProps {
  userId: string;
}

interface Booking {
  id: string;
  room_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  check_in: string;
  check_out: string;
  total_price: number;
  booking_status: string;
  special_requests?: string;
  created_at: string;
  hotel_rooms: {
    room_number: string;
    room_type: string;
    hotels: {
      name: string;
    };
  };
}

interface Room {
  id: string;
  room_number: string;
  room_type: string;
  hotel_id: string;
  hotels: {
    name: string;
  };
}

export const BookingManagement = ({ userId }: BookingManagementProps) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    room_id: '',
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    check_in: '',
    check_out: '',
    total_price: '',
    booking_status: 'confirmed',
    special_requests: ''
  });

  useEffect(() => {
    fetchBookings();
    fetchRooms();
  }, [userId]);

  const fetchBookings = async () => {
    try {
      const { data: hotelOwners } = await supabase
        .from('hotel_owners')
        .select('hotel_id')
        .eq('user_id', userId);

      const hotelIds = hotelOwners?.map(ho => ho.hotel_id) || [];

      if (hotelIds.length === 0) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('room_bookings')
        .select(`
          *,
          hotel_rooms!inner(
            room_number,
            room_type,
            hotel_id,
            hotels!inner(name)
          )
        `)
        .in('hotel_rooms.hotel_id', hotelIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const { data: hotelOwners } = await supabase
        .from('hotel_owners')
        .select('hotel_id')
        .eq('user_id', userId);

      const hotelIds = hotelOwners?.map(ho => ho.hotel_id) || [];

      if (hotelIds.length === 0) return;

      const { data, error } = await supabase
        .from('hotel_rooms')
        .select(`
          id,
          room_number,
          room_type,
          hotel_id,
          hotels!inner(name)
        `)
        .in('hotel_id', hotelIds);

      if (error) throw error;
      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const bookingData = {
        room_id: formData.room_id,
        guest_name: formData.guest_name,
        guest_email: formData.guest_email,
        guest_phone: formData.guest_phone || null,
        check_in: formData.check_in,
        check_out: formData.check_out,
        total_price: parseFloat(formData.total_price),
        booking_status: formData.booking_status,
        special_requests: formData.special_requests || null
      };

      if (isEditing && selectedBooking) {
        const { error } = await supabase
          .from('room_bookings')
          .update(bookingData)
          .eq('id', selectedBooking.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('room_bookings')
          .insert([bookingData]);

        if (error) throw error;
      }

      resetForm();
      setIsDialogOpen(false);
      fetchBookings();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking);
    setFormData({
      room_id: booking.room_id,
      guest_name: booking.guest_name,
      guest_email: booking.guest_email,
      guest_phone: booking.guest_phone || '',
      check_in: booking.check_in,
      check_out: booking.check_out,
      total_price: booking.total_price.toString(),
      booking_status: booking.booking_status,
      special_requests: booking.special_requests || ''
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (bookingId: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
      const { error } = await supabase
        .from('room_bookings')
        .delete()
        .eq('id', bookingId);

      if (error) throw error;
      fetchBookings();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      room_id: '',
      guest_name: '',
      guest_email: '',
      guest_phone: '',
      check_in: '',
      check_out: '',
      total_price: '',
      booking_status: 'confirmed',
      special_requests: ''
    });
    setSelectedBooking(null);
    setIsEditing(false);
    setError(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div>Loading bookings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Booking Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Booking
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? 'Edit Booking' : 'Add New Booking'}
              </DialogTitle>
              <DialogDescription>
                {isEditing ? 'Update booking information' : 'Create a new booking for your hotel room'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="room_id">Room</Label>
                  <Select value={formData.room_id} onValueChange={(value) => setFormData({...formData, room_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a room" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.hotels.name} - Room {room.room_number} ({room.room_type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="booking_status">Status</Label>
                  <Select value={formData.booking_status} onValueChange={(value) => setFormData({...formData, booking_status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="guest_name">Guest Name</Label>
                  <Input
                    id="guest_name"
                    value={formData.guest_name}
                    onChange={(e) => setFormData({...formData, guest_name: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="guest_email">Guest Email</Label>
                  <Input
                    id="guest_email"
                    type="email"
                    value={formData.guest_email}
                    onChange={(e) => setFormData({...formData, guest_email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="guest_phone">Guest Phone (Optional)</Label>
                  <Input
                    id="guest_phone"
                    value={formData.guest_phone}
                    onChange={(e) => setFormData({...formData, guest_phone: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="total_price">Total Price (€)</Label>
                  <Input
                    id="total_price"
                    type="number"
                    step="0.01"
                    value={formData.total_price}
                    onChange={(e) => setFormData({...formData, total_price: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="check_in">Check-in Date</Label>
                  <Input
                    id="check_in"
                    type="date"
                    value={formData.check_in}
                    onChange={(e) => setFormData({...formData, check_in: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="check_out">Check-out Date</Label>
                  <Input
                    id="check_out"
                    type="date"
                    value={formData.check_out}
                    onChange={(e) => setFormData({...formData, check_out: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="special_requests">Special Requests (Optional)</Label>
                <Textarea
                  id="special_requests"
                  value={formData.special_requests}
                  onChange={(e) => setFormData({...formData, special_requests: e.target.value})}
                  placeholder="Any special requests or notes..."
                />
              </div>

              {error && (
                <Alert>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditing ? 'Update Booking' : 'Create Booking'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        {bookings.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No bookings found. Create your first booking to get started.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          bookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {booking.guest_name}
                      <Badge className={getStatusColor(booking.booking_status)}>
                        {booking.booking_status}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {booking.hotel_rooms.hotels.name} - Room {booking.hotel_rooms.room_number}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(booking)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(booking.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Check-in</p>
                    <p className="text-gray-600">{format(new Date(booking.check_in), 'MMM dd, yyyy')}</p>
                  </div>
                  <div>
                    <p className="font-medium">Check-out</p>
                    <p className="text-gray-600">{format(new Date(booking.check_out), 'MMM dd, yyyy')}</p>
                  </div>
                  <div>
                    <p className="font-medium">Total Price</p>
                    <p className="text-gray-600">€{booking.total_price}</p>
                  </div>
                  <div>
                    <p className="font-medium">Contact</p>
                    <p className="text-gray-600">{booking.guest_email}</p>
                    {booking.guest_phone && (
                      <p className="text-gray-600">{booking.guest_phone}</p>
                    )}
                  </div>
                </div>
                {booking.special_requests && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <p className="font-medium text-sm">Special Requests:</p>
                    <p className="text-sm text-gray-600">{booking.special_requests}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
