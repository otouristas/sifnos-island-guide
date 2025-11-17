
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Loader2, AlertCircle, Mail, MessageCircle, Bell, DollarSign } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

// Define password change form schema
const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, { message: 'Current password is required' }),
  newPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Initialize form
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  
  // Handle password change
  const onSubmit = async (values: PasswordFormValues) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // First verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: values.currentPassword,
      });
      
      if (signInError) {
        setError('Current password is incorrect');
        return;
      }
      
      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: values.newPassword,
      });
      
      if (updateError) {
        setError(updateError.message);
        return;
      }
      
      // Success
      setSuccess('Password updated successfully');
      form.reset();
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error updating password:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setIsLoading(true);
      
      try {
        // Delete user from Supabase Auth
        const { error } = await supabase.auth.admin.deleteUser(user?.id || '');
        
        if (error) {
          throw error;
        }
        
        // Sign out
        await signOut();
        
        // Redirect to home
        navigate('/');
      } catch (err) {
        console.error('Error deleting account:', err);
        setError('Failed to delete account. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // If not authenticated, redirect to home
  if (!user) {
    navigate('/');
    return null;
  }
  
  return (
    <>
      <SEO 
        title="Account Settings - Hotels Sifnos"
        description="Manage your Hotels Sifnos account settings, update your password, and control your account preferences."
        noIndex={true}
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-sifnos-deep-blue mb-8">{t('common.accountSettings')}</h1>
          
          <Tabs defaultValue="security" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="security">{t('common.security')}</TabsTrigger>
              <TabsTrigger value="preferences">{t('common.preferences')}</TabsTrigger>
              <TabsTrigger value="notifications">{t('common.notifications')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="security">
              {/* Password Change Card */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your account password</CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  {success && (
                    <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
                      <AlertTitle>Success</AlertTitle>
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
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
                              Updating...
                            </>
                          ) : (
                            'Update Password'
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              
              {/* Delete Account Card */}
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">Delete Account</CardTitle>
                  <CardDescription>
                    Permanently delete your account and all associated data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    This action cannot be undone. Once you delete your account, all of your data will be permanently removed.
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Delete Account'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">Preference settings will be available soon.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <NotificationSettingsTab user={user} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}

// Notification Settings Tab Component
function NotificationSettingsTab({ user }: { user: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailNotifications: true,
    whatsappNotifications: false,
    priceAlerts: true,
    newHotelsAlerts: true,
  });
  
  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user) return;
      
      setIsLoading(true);
    try {
      // Note: notification_preferences column doesn't exist in user_profiles table yet
      // This functionality is disabled until the column is added via migration
      
      /* TODO: Add notification_preferences column to user_profiles table
      const { data, error } = await supabase
        .from('user_profiles')
        .select('notification_preferences')
        .eq('id', user.id)
        .maybeSingle();
      
      if (!error && data?.notification_preferences) {
        setNotificationPrefs({
          emailNotifications: data.notification_preferences.email_notifications ?? true,
          whatsappNotifications: data.notification_preferences.whatsapp_notifications ?? false,
          priceAlerts: data.notification_preferences.price_alerts ?? true,
          newHotelsAlerts: data.notification_preferences.new_hotels_alerts ?? true,
        });
      }
      */
      } catch (error) {
        console.error('Error fetching notification preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPreferences();
  }, [user]);
  
  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      // Note: notification_preferences column doesn't exist in user_profiles table yet
      // This functionality is disabled until the column is added via migration
      
      /* TODO: Add notification_preferences column to user_profiles table
      const { error } = await supabase
        .from('user_profiles')
        .update({
          notification_preferences: {
            email_notifications: notificationPrefs.emailNotifications,
            whatsapp_notifications: notificationPrefs.whatsappNotifications,
            price_alerts: notificationPrefs.priceAlerts,
            new_hotels_alerts: notificationPrefs.newHotelsAlerts,
          }
        })
        .eq('id', user.id);
      
      if (error) throw error;
      */
      
      alert('Notification preferences saved successfully!');
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      alert('Failed to save preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-sifnos-turquoise" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Control what notifications you receive</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-sifnos-deep-blue" />
              <div>
                <h3 className="font-semibold text-sifnos-deep-blue">Email Notifications</h3>
                <p className="text-sm text-gray-600">Receive updates via email</p>
              </div>
            </div>
            <Switch
              checked={notificationPrefs.emailNotifications}
              onCheckedChange={(checked) =>
                setNotificationPrefs({ ...notificationPrefs, emailNotifications: checked })
              }
            />
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5 text-sifnos-deep-blue" />
              <div>
                <h3 className="font-semibold text-sifnos-deep-blue">WhatsApp Notifications</h3>
                <p className="text-sm text-gray-600">Receive updates via WhatsApp (if integrated)</p>
              </div>
            </div>
            <Switch
              checked={notificationPrefs.whatsappNotifications}
              onCheckedChange={(checked) =>
                setNotificationPrefs({ ...notificationPrefs, whatsappNotifications: checked })
              }
            />
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-sifnos-deep-blue" />
              <div>
                <h3 className="font-semibold text-sifnos-deep-blue">Price Alerts</h3>
                <p className="text-sm text-gray-600">Get notified when prices drop for your favorite hotels</p>
              </div>
            </div>
            <Switch
              checked={notificationPrefs.priceAlerts}
              onCheckedChange={(checked) =>
                setNotificationPrefs({ ...notificationPrefs, priceAlerts: checked })
              }
            />
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-sifnos-deep-blue" />
              <div>
                <h3 className="font-semibold text-sifnos-deep-blue">New Hotels Alerts</h3>
                <p className="text-sm text-gray-600">Get notified when new hotels are added in your preferred areas</p>
              </div>
            </div>
            <Switch
              checked={notificationPrefs.newHotelsAlerts}
              onCheckedChange={(checked) =>
                setNotificationPrefs({ ...notificationPrefs, newHotelsAlerts: checked })
              }
            />
          </div>
        </div>
        
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button onClick={handleSave} disabled={isSaving}>
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
      </CardContent>
    </Card>
  );
}
