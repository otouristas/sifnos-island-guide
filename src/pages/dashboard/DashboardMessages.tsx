import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Search, 
  Star, 
  Clock, 
  CheckCircle, 
  XCircle,
  User,
  Mail,
  Calendar,
  Hotel
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Define message type
interface MessageType {
  id: string;
  sender_name: string;
  sender_email: string;
  subject: string;
  message: string;
  hotel_id: string;
  hotel_name: string;
  created_at: string;
  is_read: boolean;
}

export default function DashboardMessages() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<MessageType | null>(null);
  
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // In a real implementation, you would fetch messages from your database
        // For now, we'll use placeholder data
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Placeholder messages
        const placeholderMessages: MessageType[] = [
          {
            id: '1',
            sender_name: 'John Smith',
            sender_email: 'john.smith@example.com',
            subject: 'Booking Inquiry for July',
            message: 'Hello, I am interested in booking a room at your hotel for the first week of July. Do you have availability for 2 adults and 1 child? We would prefer a room with a sea view if possible. Also, could you please let me know if breakfast is included in the room rate? Thank you!',
            hotel_id: '1',
            hotel_name: 'Your Hotel',
            created_at: '2026-05-10T14:30:00Z',
            is_read: true
          },
          {
            id: '2',
            sender_name: 'Maria Johnson',
            sender_email: 'maria.j@example.com',
            subject: 'Special Requirements for Stay',
            message: 'Hi there, I have booked a room for next week and wanted to inquire about some special requirements. I have a gluten allergy and was wondering if your breakfast options include gluten-free items. Additionally, I would appreciate a quiet room away from the elevator if possible. Looking forward to my stay!',
            hotel_id: '1',
            hotel_name: 'Your Hotel',
            created_at: '2026-05-09T09:15:00Z',
            is_read: false
          },
          {
            id: '3',
            sender_name: 'Alex Thompson',
            sender_email: 'alex.t@example.com',
            subject: 'Transportation from Airport',
            message: 'Hello, I will be arriving at the airport on June 15th at 2:30 PM. Do you offer airport transfer services? If so, what is the cost and how can I book this in advance? Thank you for your assistance.',
            hotel_id: '1',
            hotel_name: 'Your Hotel',
            created_at: '2026-05-08T16:45:00Z',
            is_read: false
          }
        ];
        
        setMessages(placeholderMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, [user]);
  
  // Filter messages based on active tab and search query
  const filteredMessages = () => {
    let filtered = [...messages];
    
    // Filter by tab
    if (activeTab === 'unread') {
      filtered = filtered.filter(message => !message.is_read);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(message => 
        message.sender_name.toLowerCase().includes(query) ||
        message.subject.toLowerCase().includes(query) ||
        message.message.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };
  
  // Mark message as read
  const markAsRead = (messageId: string) => {
    setMessages(prev => 
      prev.map(message => 
        message.id === messageId 
          ? { ...message, is_read: true } 
          : message
      )
    );
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Handle message selection
  const handleSelectMessage = (message: MessageType) => {
    setSelectedMessage(message);
    if (!message.is_read) {
      markAsRead(message.id);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-sifnos-deep-blue">Messages</h1>
          <p className="text-gray-600">Manage inquiries and communications from guests</p>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search messages..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {messages.filter(m => !m.is_read).length > 0 && (
                <Badge className="ml-2 bg-red-500">{messages.filter(m => !m.is_read).length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Messages List and Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <Card className="lg:col-span-1 overflow-hidden">
          <CardHeader className="p-4">
            <CardTitle className="text-lg">Inbox</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sifnos-turquoise"></div>
              </div>
            ) : filteredMessages().length > 0 ? (
              <div className="divide-y">
                {filteredMessages().map((message) => (
                  <div 
                    key={message.id} 
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedMessage?.id === message.id 
                        ? 'bg-sifnos-turquoise/10' 
                        : 'hover:bg-gray-50'
                    } ${!message.is_read ? 'bg-blue-50 hover:bg-blue-50/80' : ''}`}
                    onClick={() => handleSelectMessage(message)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-sifnos-deep-blue text-white">
                          {message.sender_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`font-medium truncate ${!message.is_read ? 'text-sifnos-deep-blue' : 'text-gray-700'}`}>
                            {message.sender_name}
                          </p>
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                            {formatDate(message.created_at)}
                          </span>
                        </div>
                        <p className={`text-sm truncate ${!message.is_read ? 'font-medium' : 'text-gray-600'}`}>
                          {message.subject}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {message.message.substring(0, 60)}...
                        </p>
                      </div>
                      {!message.is_read && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700">No messages found</h3>
                <p className="text-gray-500 mt-1">
                  {searchQuery 
                    ? 'Try adjusting your search terms' 
                    : 'Your inbox is empty'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Message Detail View */}
        <Card className="lg:col-span-2">
          {selectedMessage ? (
            <>
              <CardHeader className="border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedMessage.subject}</CardTitle>
                    <CardDescription>
                      From: {selectedMessage.sender_name} ({selectedMessage.sender_email})
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <CheckCircle size={16} className="mr-1" />
                      Mark as Read
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      <XCircle size={16} className="mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Message Info */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <User size={14} className="mr-1" />
                      <span>From: {selectedMessage.sender_name}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail size={14} className="mr-1" />
                      <span>{selectedMessage.sender_email}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      <span>Received: {formatDate(selectedMessage.created_at)}</span>
                    </div>
                    <div className="flex items-center">
                      <Hotel size={14} className="mr-1" />
                      <span>Hotel: {selectedMessage.hotel_name}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Message Content */}
                  <div className="whitespace-pre-line">
                    {selectedMessage.message}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-gray-50 flex justify-between">
                <Button variant="outline" size="sm">
                  <Star size={16} className="mr-1" />
                  Mark as Important
                </Button>
                <Button className="bg-sifnos-turquoise hover:bg-sifnos-deep-blue">
                  Reply
                </Button>
              </CardFooter>
            </>
          ) : (
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700">No message selected</h3>
              <p className="text-gray-500 mt-1">
                Select a message from the inbox to view its contents
              </p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
