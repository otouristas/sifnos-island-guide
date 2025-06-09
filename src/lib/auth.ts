import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

// Define types for our auth context
export type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => 
    Promise<{ error: AuthError | null; data: { user: User | null } | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  toggleFavorite: (hotelId: string) => Promise<boolean>;
  getFavorites: () => Promise<string[]>;
  checkIsFavorite: (hotelId: string) => Promise<boolean>;
};

// Define user profile type
export type UserProfile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

// Create the auth context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user) {
        // Fetch user profile
        await fetchUserProfile(session.user.id);
      }
      
      // Set up auth state change listener
      const { data: { subscription } } = await supabase.auth.onAuthStateChange(
        async (_event, session) => {
          setSession(session);
          setUser(session?.user || null);
          
          if (session?.user) {
            await fetchUserProfile(session.user.id);
          } else {
            setProfile(null);
          }
        }
      );
      
      setIsLoading(false);
      
      // Clean up subscription on unmount
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initializeAuth();
  }, []);
  
  // Fetch user profile from database
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }
      
      setProfile(data as UserProfile);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };
  
  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }
      
      toast({
        title: "Signed in successfully",
        description: "Welcome back!",
      });
      
      return { error: null };
    } catch (error) {
      console.error('Error in signIn:', error);
      return { error: error as AuthError };
    }
  };
  
  // Sign up with email and password
  const signUp = async (
    email: string, 
    password: string, 
    metadata?: { first_name?: string; last_name?: string }
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive"
        });
        return { error, data: null };
      }
      
      toast({
        title: "Account created successfully",
        description: "Welcome to Hotels Sifnos!",
      });
      
      return { error: null, data };
    } catch (error) {
      console.error('Error in signUp:', error);
      return { error: error as AuthError, data: null };
    }
  };
  
  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
      });
    } catch (error) {
      console.error('Error in signOut:', error);
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };
  
  // Reset password
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        toast({
          title: "Password reset failed",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }
      
      toast({
        title: "Password reset email sent",
        description: "Please check your email for further instructions",
      });
      
      return { error: null };
    } catch (error) {
      console.error('Error in resetPassword:', error);
      return { error: error as AuthError };
    }
  };
  
  // Update user profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id);
        
      if (error) {
        toast({
          title: "Profile update failed",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }
      
      // Refresh profile data
      await fetchUserProfile(user.id);
      
      toast({
        title: "Profile updated successfully",
      });
      
      return { error: null };
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return { error: error as Error };
    }
  };
  
  // Toggle hotel favorite status
  const toggleFavorite = async (hotelId: string): Promise<boolean> => {
    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save favorites",
          variant: "destructive"
        });
        return false;
      }
      
      // Check if hotel is already favorited
      const { data: existingFavorite, error: checkError } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', user.id)
        .eq('hotel_id', hotelId)
        .maybeSingle();
        
      if (checkError) {
        console.error('Error checking favorite status:', checkError);
        return false;
      }
      
      if (existingFavorite) {
        // Remove from favorites
        const { error: deleteError } = await supabase
          .from('user_favorites')
          .delete()
          .eq('id', existingFavorite.id);
          
        if (deleteError) {
          console.error('Error removing favorite:', deleteError);
          return false;
        }
        
        toast({
          title: "Removed from favorites",
        });
        
        return false; // Return false to indicate it's not a favorite anymore
      } else {
        // Add to favorites
        const { error: insertError } = await supabase
          .from('user_favorites')
          .insert({ user_id: user.id, hotel_id: hotelId });
          
        if (insertError) {
          console.error('Error adding favorite:', insertError);
          return false;
        }
        
        toast({
          title: "Added to favorites",
        });
        
        return true; // Return true to indicate it's now a favorite
      }
    } catch (error) {
      console.error('Error in toggleFavorite:', error);
      return false;
    }
  };
  
  // Get user's favorite hotels
  const getFavorites = async (): Promise<string[]> => {
    try {
      if (!user) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('user_favorites')
        .select('hotel_id')
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Error fetching favorites:', error);
        return [];
      }
      
      return data.map(item => item.hotel_id);
    } catch (error) {
      console.error('Error in getFavorites:', error);
      return [];
    }
  };
  
  // Check if a hotel is favorited by the user
  const checkIsFavorite = async (hotelId: string): Promise<boolean> => {
    try {
      if (!user) {
        return false;
      }
      
      const { data, error } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('hotel_id', hotelId)
        .maybeSingle();
        
      if (error) {
        console.error('Error checking favorite status:', error);
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error('Error in checkIsFavorite:', error);
      return false;
    }
  };

  // Provide auth context to children
  return (
    <AuthContext.Provider value={{
      session,
      user,
      profile,
      isLoading,
      signIn,
      signUp,
      signOut,
      resetPassword,
      updateProfile,
      toggleFavorite,
      getFavorites,
      checkIsFavorite
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}