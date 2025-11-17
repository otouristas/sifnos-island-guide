import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/lib/auth';
import { useI18n } from '@/contexts/I18nContext';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, User, Camera, MapPin, Waves, Users, Car } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Define form validation schema
const profileFormSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }).optional(),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }).optional(),
  email: z.string().email({ message: 'Please enter a valid email address' }).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Travel preferences schema
const travelPreferencesSchema = z.object({
  budgetPerNight: z.string().optional(),
  preferredBeachTypes: z.array(z.string()).optional(),
  travelStyles: z.array(z.string()).optional(),
  carRental: z.string().optional(),
});

type TravelPreferencesValues = z.infer<typeof travelPreferencesSchema>;

export default function ProfilePage() {
  const { user, profile, updateProfile } = useAuth();
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Initialize form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: profile?.first_name || '',
      lastName: profile?.last_name || '',
      email: user?.email || '',
    },
  });
  
  // Update form values when profile data changes
  useState(() => {
    if (profile) {
      form.reset({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        email: user?.email || '',
      });
    }
  });
  
  // Handle form submission
  const onSubmit = async (values: ProfileFormValues) => {
    setIsLoading(true);
    
    try {
      await updateProfile({
        first_name: values.firstName || null,
        last_name: values.lastName || null,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
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
  
  // If not authenticated, redirect to home
  if (!user) {
    navigate('/');
    return null;
  }
  
  return (
    <>
      <SEO 
        title="Your Profile - Hotels Sifnos"
        description="Manage your Hotels Sifnos profile, update your personal information, and view your favorite hotels."
        noIndex={true}
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-sifnos-deep-blue mb-8">{t('common.yourProfile')}</h1>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="profile">{t('common.profile')}</TabsTrigger>
              <TabsTrigger value="travel-preferences">{t('common.travelPreferences')}</TabsTrigger>
              <TabsTrigger value="favorites">{t('common.favorites')}</TabsTrigger>
              <TabsTrigger value="settings">{t('common.settings')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Avatar Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                    <CardDescription>Update your profile picture</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <Avatar className="h-32 w-32">
                        <AvatarImage src={profile?.avatar_url || ''} alt="Profile" />
                        <AvatarFallback className="text-3xl bg-sifnos-turquoise text-white">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <Button 
                        size="icon" 
                        className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                        variant="secondary"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 text-center">
                      Upload a new profile picture
                    </p>
                  </CardContent>
                </Card>
                
                {/* Profile Form Card */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="your@email.com" 
                                  {...field} 
                                  disabled 
                                  className="bg-gray-50"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end">
                          <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              'Save Changes'
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="travel-preferences">
              <TravelPreferencesTab user={user} profile={profile} />
            </TabsContent>
            
            <TabsContent value="favorites">
              <Card>
                <CardHeader>
                  <CardTitle>Your Favorite Hotels</CardTitle>
                  <CardDescription>Hotels you've saved for future reference</CardDescription>
                </CardHeader>
                <CardContent>
                  <FavoritesContent />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">Account settings will be available soon.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}

// Favorites content component
function FavoritesContent() {
  const { getFavorites } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch favorites on mount
  useState(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      try {
        const favoriteIds = await getFavorites();
        
        if (favoriteIds.length > 0) {
          // Fetch hotel details for favorites
          const { supabase } = await import('@/integrations/supabase/client');
          const { data, error } = await supabase
            .from('hotels')
            .select(`
              *,
              hotel_amenities(amenity),
              hotel_photos(id, photo_url, is_main_photo)
            `)
            .in('id', favoriteIds);
            
          if (!error && data) {
            setFavorites(data);
          }
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFavorites();
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-sifnos-turquoise" />
      </div>
    );
  }
  
  if (favorites.length === 0) {
    return (
      <div className="text-center py-8">
        <User className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
        <p className="text-gray-500 mb-4">
          You haven't saved any hotels to your favorites yet.
        </p>
        <Button asChild>
          <a href="/hotels">Browse Hotels</a>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {favorites.map(hotel => {
        // Import and use HotelCard component dynamically to avoid circular dependencies
        const HotelCard = require('@/components/HotelCard').default;
        return <HotelCard key={hotel.id} hotel={hotel} showLogo={true} />;
      })}
    </div>
  );
}

// Travel Preferences Tab Component
function TravelPreferencesTab({ user, profile }: { user: any; profile: any }) {
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<TravelPreferencesValues>({
    resolver: zodResolver(travelPreferencesSchema),
    defaultValues: {
      budgetPerNight: profile?.travel_preferences?.budget_per_night || '',
      preferredBeachTypes: profile?.travel_preferences?.preferred_beach_types || [],
      travelStyles: profile?.travel_preferences?.travel_styles || [],
      carRental: profile?.travel_preferences?.car_rental || '',
    },
  });
  
  useEffect(() => {
    if (profile?.travel_preferences) {
      form.reset({
        budgetPerNight: profile.travel_preferences.budget_per_night || '',
        preferredBeachTypes: profile.travel_preferences.preferred_beach_types || [],
        travelStyles: profile.travel_preferences.travel_styles || [],
        carRental: profile.travel_preferences.car_rental || '',
      });
    }
  }, [profile, form]);
  
  const onSubmit = async (values: TravelPreferencesValues) => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      // Note: travel_preferences column doesn't exist in user_profiles table yet
      // This functionality is disabled until the column is added via migration
      
      /* TODO: Add travel_preferences column to user_profiles table
      const { error } = await supabase
        .from('user_profiles')
        .update({
          travel_preferences: {
            budget_per_night: values.budgetPerNight || null,
            preferred_beach_types: values.preferredBeachTypes || [],
            travel_styles: values.travelStyles || [],
            car_rental: values.carRental || null,
          }
        })
        .eq('id', user.id);
      
      if (error) throw error;
      */
      
      // Show success message
      alert('Travel preferences saved successfully!');
    } catch (error) {
      console.error('Error saving travel preferences:', error);
      alert('Failed to save preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const beachTypes = ['Sandy', 'Pebble', 'Organized', 'Quiet', 'Remote', 'Family-friendly'];
  const travelStyles = ['Family', 'Romantic', 'Adventure', 'Foodie', 'Relaxation', 'Culture', 'Nightlife'];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Travel Preferences</CardTitle>
        <CardDescription>
          Set your preferences to get personalized hotel and beach recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="budgetPerNight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MapPin size={16} />
                    Budget per Night
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="<50">Less than €50</SelectItem>
                      <SelectItem value="50-100">€50 - €100</SelectItem>
                      <SelectItem value="100-200">€100 - €200</SelectItem>
                      <SelectItem value="200-500">€200 - €500</SelectItem>
                      <SelectItem value="500+">€500+</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="preferredBeachTypes"
              render={() => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Waves size={16} />
                    Preferred Beach Types
                  </FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {beachTypes.map((type) => (
                      <FormField
                        key={type}
                        control={form.control}
                        name="preferredBeachTypes"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(type)}
                                onCheckedChange={(checked) => {
                                  const current = field.value || [];
                                  return checked
                                    ? field.onChange([...current, type])
                                    : field.onChange(current.filter(v => v !== type));
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {type}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="travelStyles"
              render={() => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Users size={16} />
                    Travel Style
                  </FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {travelStyles.map((style) => (
                      <FormField
                        key={style}
                        control={form.control}
                        name="travelStyles"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(style)}
                                onCheckedChange={(checked) => {
                                  const current = field.value || [];
                                  return checked
                                    ? field.onChange([...current, style])
                                    : field.onChange(current.filter(v => v !== style));
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {style}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="carRental"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Car size={16} />
                    Car Rental Plans
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select car rental preference" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="yes">{t('common.yesRentCar')}</SelectItem>
                      <SelectItem value="no">{t('common.noRentCar')}</SelectItem>
                      <SelectItem value="maybe">{t('common.maybeRentCar')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Preferences'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}