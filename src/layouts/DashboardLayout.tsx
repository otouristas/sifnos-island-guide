import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { 
  LayoutDashboard, 
  Hotel, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function DashboardLayout() {
  const { user, profile, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    } else if (profile?.first_name) {
      return profile.first_name[0].toUpperCase();
    } else if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };
  
  // Get display name
  const getDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    } else if (profile?.first_name) {
      return profile.first_name;
    } else if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };
  
  // Navigation items
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: <LayoutDashboard size={20} /> 
    },
    { 
      name: 'My Hotels', 
      path: '/dashboard/hotels', 
      icon: <Hotel size={20} /> 
    },
    { 
      name: 'Messages', 
      path: '/dashboard/messages', 
      icon: <MessageSquare size={20} /> 
    },
    { 
      name: 'Settings', 
      path: '/dashboard/settings', 
      icon: <Settings size={20} /> 
    },
  ];
  
  // Handle sign out
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm p-4 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
        
        <div className="font-semibold text-sifnos-deep-blue">Hotel Owner Dashboard</div>
        
        <Avatar className="h-8 w-8">
          <AvatarImage src={profile?.avatar_url || ''} alt={getDisplayName()} />
          <AvatarFallback className="bg-sifnos-turquoise text-white">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
      </div>
      
      {/* Sidebar - Mobile (Overlay) */}
      <div className={cn(
        "fixed inset-0 z-40 transform md:hidden bg-gray-900/50 transition-opacity duration-300",
        sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <div className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-4 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="font-bold text-xl text-sifnos-deep-blue">HotelsSifnos</div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSidebarOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </Button>
            </div>
            
            <div className="flex items-center space-x-3 mb-6 p-3 bg-gray-50 rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarImage src={profile?.avatar_url || ''} alt={getDisplayName()} />
                <AvatarFallback className="bg-sifnos-turquoise text-white">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{getDisplayName()}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
            </div>
            
            <nav className="space-y-1 flex-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname === item.path
                      ? "bg-sifnos-turquoise text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                  {location.pathname === item.path && (
                    <ChevronRight size={16} className="ml-auto" />
                  )}
                </Link>
              ))}
            </nav>
            
            <Separator className="my-4" />
            
            <Button 
              variant="ghost" 
              className="justify-start text-red-500 hover:text-red-700 hover:bg-red-50 px-3"
              onClick={handleSignOut}
            >
              <LogOut size={20} className="mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
      
      {/* Desktop Layout */}
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar - Desktop (Fixed) */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 bg-white shadow-md">
            <div className="flex flex-col flex-1 h-0 overflow-y-auto">
              <div className="flex items-center justify-center h-16 flex-shrink-0 px-4 bg-sifnos-deep-blue text-white">
                <div className="font-bold text-xl">HotelsSifnos</div>
              </div>
              
              <div className="flex-1 flex flex-col">
                <div className="flex items-center space-x-3 p-4 border-b">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile?.avatar_url || ''} alt={getDisplayName()} />
                    <AvatarFallback className="bg-sifnos-turquoise text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{getDisplayName()}</div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                  </div>
                </div>
                
                <nav className="px-3 pt-4 flex-1">
                  <div className="space-y-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                          location.pathname === item.path
                            ? "bg-sifnos-turquoise text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        )}
                      >
                        {item.icon}
                        <span className="ml-3">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </nav>
                
                <div className="p-4 border-t">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={handleSignOut}
                  >
                    <LogOut size={20} className="mr-3" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Desktop Header */}
          <div className="hidden md:flex md:items-center md:justify-between bg-white shadow-sm p-4">
            <h1 className="text-xl font-semibold text-sifnos-deep-blue">Hotel Owner Dashboard</h1>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/')}
                className="flex items-center"
              >
                <span>View Website</span>
              </Button>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{getDisplayName()}</span>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url || ''} alt={getDisplayName()} />
                  <AvatarFallback className="bg-sifnos-turquoise text-white">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
          
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}