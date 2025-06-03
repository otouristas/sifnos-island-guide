
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Calendar, ChevronsUpDown, ArrowUpDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO, isAfter, isBefore, isToday } from 'date-fns';

interface BookingManagementProps {
  userId: string;
}

interface Booking {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
  check_in: string;
  check_out: string;
  total_price: number;
  booking_status: string;
  special_requests: string | null;
  created_at: string;
  room_id: string;
  room_name?: string;
  hotel_name?: string;
}

interface Room {
  id: string;
  name: string;
  hotel_id: string;
  hotel_name?: string;
}

export const BookingManagement = ({ userId }: BookingManagementProps) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('check_in');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();
  
  // For manual booking creation
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
    fetchData();
  }, [userId]);

  useEffect(() => {
    applyFilters();
  }, [bookings, filterStatus, searchTerm, sortBy, sortOrder]);

  const fetchData = async () => {
    try {
      // Get user's hotels
      const { data: hotelOwners } = await supabase
        .from('hotel_owners')
        .select('hotel_id')
        .eq('user_id', userId);

      const hotelIds = hotelOwners?.map(ho => ho.hotel_id) || [];

      if (hotelIds.length > 0) {
        // Get rooms for user's hotels
        const { data: roomsData } = await supabase
          .from('hotel_rooms')
          .select(`
            id,
            name,
            hotel_id,
            hotels(name)
          `)
          .in('hotel_id', hotelIds);

        const roomsWithHotelName = roomsData?.map(room => ({
          ...room,
          hotel_name: room.hotels?.name
        })) || [];

        setRooms(roomsWithHotelName as Room[]);

        const roomIds = roomsData?.map(room => room.id) || [];

        if (roomIds.length > 0) {
          // Get bookings for user's rooms
          const { data: bookingsData } = await supabase
            .from('room_bookings')
            .select('*')
            .in('room_id', roomIds)
            .order('check_in', { ascending: true });

          const bookingsWithDetails = bookingsData?.map(booking => {
            const room = roomsWithHotelName.find(r => r.id === booking.room_id);
            return {
              ...booking,
              room_name: room?.name,
              hotel_name: room?.hotel_name
            };
          }) || [];

          setBookings(bookingsWithDetails as Booking[]);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...bookings];
    
    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(booking => booking.booking_status === filterStatus);
    }

    // Apply search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(booking => 
        booking.guest_name.toLowerCase().includes(search) ||
        booking.guest_email.toLowerCase().includes(search) ||
        booking.hotel_name?.toLowerCase().includes(search) ||
        booking.room_name?.toLowerCase().includes(search)
      );
    }

    // Apply sorting
    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        let valA, valB;
        
        // Handle different field types
        switch(sortBy) {
          case 'check_in':
          case 'check_out':
          case 'created_at':
            valA = new Date(a[sortBy]).getTime();
            valB = new Date(b[sortBy]).getTime();
            break;
          case 'total_price':
            valA = parseFloat(a[sortBy]);
            valB = parseFloat(b[sortBy]);
            break;
          default:
            valA = a[sortBy]?.toString().toLowerCase() || '';
            valB = b[sortBy]?.toString().toLowerCase() || '';
        }
        
        if (sortOrder === 'asc') {
          return valA > valB ? 1 : -1;
        } else {
          return valA < valB ? 1 : -1;
        }
      });
    }

    setFilteredBookings(filtered);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getBookingStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{status}</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">{status}</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">{status}</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const calculateBookingDuration = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getBookingStatus = (checkIn: string, checkOut: string, status: string) => {
    if (status.toLowerCase() === 'cancelled') return 'cancelled';
    
    const today = new Date();
    const inDate = parseISO(checkIn);
    const outDate = parseISO(checkOut);
    
    if (isAfter(today, outDate)) return 'completed';
    if (isAfter(today, inDate) && isBefore(today, outDate)) return 'active';
    if (isToday(inDate)) return 'check-in today';
    if (isToday(outDate)) return 'check-out today';
    
    return status;
  };

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDialogOpen(true);
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('room_bookings')
        .update({ booking_status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      // Update local state
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, booking_status: newStatus } 
            : booking
        )
      );

      toast({
        title: "Success",
        description: `Booking status updated to ${newStatus}`
      });
    } catch (error: any) {
      console.error('Error updating booking status:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleCreateBooking = async () => {
    try {
      if (!formData.room_id || !formData.guest_name || !formData.guest_email || !formData.check_in || !formData.check_out) {
        toast({
          title: "Error",
          description: "Please fill all required fields",
          variant: "destructive"
        });
        return;
      }

      // Calculate total price based on room price and stay duration
      const selectedRoom = rooms.find(room => room.id === formData.room_id);
      const roomPrice = selectedRoom ? parseFloat((await supabase.from('hotel_rooms').select('price').eq('id', formData.room_id).single()).data?.price) : 0;
      const nights = calculateBookingDuration(formData.check_in, formData.check_out);
      
      const totalPrice = formData.total_price ? parseFloat(formData.total_price) : roomPrice * nights;

      const bookingData = {
        room_id: formData.room_id,
        guest_name: formData.guest_name,
        guest_email: formData.guest_email,
        guest_phone: formData.guest_phone || null,
        check_in: formData.check_in,
        check_out: formData.check_out,
        total_price: totalPrice,
        booking_status: formData.booking_status,
        special_requests: formData.special_requests || null
      };

      const { error, data } = await supabase
        .from('room_bookings')
        .insert(bookingData)
        .select();

      if (error) throw error;

      // Add to local state with room and hotel names
      if (data && data.length > 0) {
        const room = rooms.find(r => r.id === data[0].room_id);
        const newBooking = {
          ...data[0],
          room_name: room?.name,
          hotel_name: room?.hotel_name
        };

        setBookings(prev => [...prev, newBooking as Booking]);
      }

      toast({
        title: "Success",
        description: "Booking created successfully"
      });

      // Reset form and close dialog
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
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error('Error creating booking:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div>Loading bookings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Booking Management</h2>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button disabled={rooms.length === 0}>
              <Calendar className="w-4 h-4 mr-2" />
              New Booking
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Booking</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="room_id">Select Room *</Label>
                <Select value={formData.room_id} onValueChange={(value) => setFormData(prev => ({ ...prev, room_id: value }))} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a room" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.hotel_name} - {room.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="guest_name">Guest Name *</Label>
                  <Input
                    id="guest_name"
                    value={formData.guest_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, guest_name: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="guest_email">Guest Email *</Label>
                  <Input
                    id="guest_email"
                    type="email"
                    value={formData.guest_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, guest_email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="guest_phone">Guest Phone</Label>
                  <Input
                    id="guest_phone"
                    value={formData.guest_phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, guest_phone: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="booking_status">Booking Status</Label>
                  <Select 
                    value={formData.booking_status} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, booking_status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="check_in">Check-in Date *</Label>
                  <Input
                    id="check_in"
                    type="date"
                    value={formData.check_in}
                    onChange={(e) => setFormData(prev => ({ ...prev, check_in: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="check_out">Check-out Date *</Label>
                  <Input
                    id="check_out"
                    type="date"
                    value={formData.check_out}
                    onChange={(e) => setFormData(prev => ({ ...prev, check_out: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="total_price">Total Price (€)</Label>
                <Input
                  id="total_price"
                  type="number"
                  step="0.01"
                  value={formData.total_price}
                  onChange={(e) => setFormData(prev => ({ ...prev, total_price: e.target.value }))}
                  placeholder="Leave empty to calculate automatically"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {!formData.total_price && formData.check_in && formData.check_out && formData.room_id && 
                    `Will be calculated based on room price and stay duration (${
                      calculateBookingDuration(formData.check_in, formData.check_out)
                    } nights)`}
                </p>
              </div>

              <div>
                <Label htmlFor="special_requests">Special Requests</Label>
                <Input
                  id="special_requests"
                  value={formData.special_requests}
                  onChange={(e) => setFormData(prev => ({ ...prev, special_requests: e.target.value }))}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateBooking}>
                  Create Booking
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
          <CardDescription>
            Manage all reservations across your properties
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="w-full md:w-48">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg text-gray-600">No bookings found</p>
              <p className="text-gray-500">Bookings will appear here once they are created</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg text-gray-600">No bookings match your filters</p>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('guest_name')}>
                      Guest
                      <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('hotel_name')}>
                      Hotel / Room
                      <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('check_in')}>
                      Dates
                      <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('total_price')}>
                      Price
                      <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('booking_status')}>
                      Status
                      <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div className="font-medium">{booking.guest_name}</div>
                        <div className="text-sm text-muted-foreground">{booking.guest_email}</div>
                      </TableCell>
                      <TableCell>
                        <div>{booking.hotel_name}</div>
                        <div className="text-sm text-muted-foreground">{booking.room_name}</div>
                      </TableCell>
                      <TableCell>
                        <div>{format(new Date(booking.check_in), 'MMM dd, yyyy')}</div>
                        <div className="text-xs text-muted-foreground">
                          to {format(new Date(booking.check_out), 'MMM dd, yyyy')}
                          <span className="ml-1">
                            ({calculateBookingDuration(booking.check_in, booking.check_out)} nights)
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>€{booking.total_price}</TableCell>
                      <TableCell>
                        {getBookingStatusBadge(booking.booking_status)}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => handleViewBooking(booking)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedBooking && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold mb-1">Guest Information</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-500 text-sm">Name:</span>
                      <p>{selectedBooking.guest_name}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Email:</span>
                      <p>{selectedBooking.guest_email}</p>
                    </div>
                    {selectedBooking.guest_phone && (
                      <div>
                        <span className="text-gray-500 text-sm">Phone:</span>
                        <p>{selectedBooking.guest_phone}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold mb-1">Reservation Details</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-500 text-sm">Hotel:</span>
                      <p>{selectedBooking.hotel_name}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Room:</span>
                      <p>{selectedBooking.room_name}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Status:</span>
                      <p>{getBookingStatusBadge(selectedBooking.booking_status)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold mb-2">Stay Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-gray-500 text-sm">Check-in:</span>
                    <p>{format(new Date(selectedBooking.check_in), 'MMMM dd, yyyy')}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Check-out:</span>
                    <p>{format(new Date(selectedBooking.check_out), 'MMMM dd, yyyy')}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Duration:</span>
                    <p>{calculateBookingDuration(selectedBooking.check_in, selectedBooking.check_out)} nights</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-500 text-sm">Total Price:</span>
                    <p className="text-xl font-bold">€{selectedBooking.total_price}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Update Status</h4>
                    <Select
                      value={selectedBooking.booking_status}
                      onValueChange={(value) => handleUpdateStatus(selectedBooking.id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              {selectedBooking.special_requests && (
                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold mb-1">Special Requests</h4>
                  <p className="text-gray-700">{selectedBooking.special_requests}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
