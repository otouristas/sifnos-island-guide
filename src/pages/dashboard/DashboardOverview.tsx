import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Hotel, Users, MessageSquare, Eye, TrendingUp, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardOverview() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalHotels: 0,
    totalViews: 0,
    totalMessages: 0,
    pendingReviews: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Fetch hotels owned by the user
        const { data: hotels, error: hotelsError } = await supabase
          .from('hotel_owners')
          .select(`
            hotel_id,
            hotels:hotel_id(
              id,
              name,
              location,
              rating
            )
          `)
          .eq('user_id', user.id);
          
        if (hotelsError) throw hotelsError;
        
        // Set total hotels count
        const validHotels = hotels.filter(h => h.hotels !== null);
        setStats(prev => ({ ...prev, totalHotels: validHotels.length }));
        
        // For now, set placeholder data for other stats
        // In a real implementation, you would fetch this data from your database
        setStats(prev => ({
          ...prev,
          totalViews: Math.floor(Math.random() * 1000) + 100,
          totalMessages: Math.floor(Math.random() * 20),
          pendingReviews: Math.floor(Math.random() * 5)
        }));
        
        // Set placeholder recent activity
        // In a real implementation, you would fetch this from your database
        setRecentActivity([
          { 
            type: 'view', 
            message: 'Someone viewed your hotel listing', 
            time: '2 hours ago',
            hotel: validHotels[0]?.hotels?.name || 'Your hotel'
          },
          { 
            type: 'message', 
            message: 'New booking inquiry received', 
            time: '1 day ago',
            hotel: validHotels[0]?.hotels?.name || 'Your hotel'
          },
          { 
            type: 'review', 
            message: 'New review pending approval', 
            time: '2 days ago',
            hotel: validHotels[0]?.hotels?.name || 'Your hotel'
          }
        ]);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);
  
  // Get current date for welcome message
  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-sifnos-deep-blue mb-2">
          {getGreeting()}, {user?.email?.split('@')[0] || 'Hotel Owner'}
        </h1>
        <p className="text-gray-600">
          Welcome to your dashboard. Here's what's happening with your properties on {getCurrentDate()}.
        </p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Your Hotels</p>
              <p className="text-3xl font-bold">{stats.totalHotels}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Hotel className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Views</p>
              <p className="text-3xl font-bold">{stats.totalViews}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">New Messages</p>
              <p className="text-3xl font-bold">{stats.totalMessages}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <MessageSquare className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Reviews</p>
              <p className="text-3xl font-bold">{stats.pendingReviews}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-full">
              <Users className="h-6 w-6 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="activity">
        <TabsList className="mb-4">
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                The latest activity related to your properties
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sifnos-turquoise"></div>
                </div>
              ) : recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className={`p-2 rounded-full flex-shrink-0 ${
                        activity.type === 'view' ? 'bg-green-100' :
                        activity.type === 'message' ? 'bg-purple-100' :
                        'bg-amber-100'
                      }`}>
                        {activity.type === 'view' ? (
                          <Eye className="h-5 w-5 text-green-600" />
                        ) : activity.type === 'message' ? (
                          <MessageSquare className="h-5 w-5 text-purple-600" />
                        ) : (
                          <Users className="h-5 w-5 text-amber-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.hotel} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No recent activity to display
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>
                View how your properties are performing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Placeholder for performance charts */}
                <div className="bg-gray-100 p-8 rounded-lg flex flex-col items-center justify-center">
                  <TrendingUp className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 text-center">
                    Performance analytics will be available soon.
                  </p>
                </div>
                
                {/* Placeholder for upcoming bookings */}
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-sifnos-turquoise" />
                    Upcoming Bookings
                  </h3>
                  <div className="bg-gray-100 p-6 rounded-lg text-center">
                    <p className="text-gray-500">
                      No upcoming bookings to display
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
              <Link to="/dashboard/hotels">
                <Hotel className="h-6 w-6 mb-2" />
                <span>Manage Hotels</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
              <Link to="/dashboard/messages">
                <MessageSquare className="h-6 w-6 mb-2" />
                <span>View Messages</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
              <Link to="/dashboard/settings">
                <Settings className="h-6 w-6 mb-2" />
                <span>Account Settings</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}