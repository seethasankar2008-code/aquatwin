import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabaseClient';
import { Language } from '../types/farm';

export interface FarmerProfileData {
  id?: string;
  user_id: string;
  full_name: string;
  mobile_number: string;
  preferred_language: Language;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  farmerProfile: FarmerProfileData | null;
  isLoading: boolean;
  isConfigured: boolean;
  isGuestMode: boolean;
  sendOtp: (phone: string) => Promise<{ success: boolean; message: string }>;
  verifyOtp: (phone: string, token: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateFarmerProfile: (updates: Partial<FarmerProfileData>) => Promise<{ success: boolean; message: string }>;
  enterGuestMode: () => void;
  exitGuestMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfileData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGuestMode, setIsGuestMode] = useState<boolean>(false);

  const configured = isSupabaseConfigured();

  // Load profile from Supabase
  const loadProfile = async (userId: string, mobile: string) => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('farmer_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (data && !error) {
        setFarmerProfile(data);
      } else {
        // Create initial profile record if not present
        const newProfile: FarmerProfileData = {
          user_id: userId,
          full_name: 'Farmer',
          mobile_number: mobile || '',
          preferred_language: 'en',
        };
        const { data: inserted } = await supabase
          .from('farmer_profiles')
          .insert(newProfile)
          .select()
          .single();

        if (inserted) setFarmerProfile(inserted);
      }
    } catch (e) {
      console.warn('Could not load farmer profile from database:', e);
    }
  };

  // Initialize auth session
  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id, session.user.phone || '');
      }
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id, session.user.phone || '');
      } else {
        setFarmerProfile(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [configured]);

  // Send OTP to mobile phone
  const sendOtp = async (phone: string): Promise<{ success: boolean; message: string }> => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return {
        success: false,
        message: 'Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
      };
    }

    const cleanPhone = phone.trim();
    if (!cleanPhone) {
      return { success: false, message: 'Please enter a valid mobile number.' };
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: cleanPhone,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      return {
        success: true,
        message: 'OTP sent successfully! Please check your SMS or use development test code.',
      };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to send OTP.' };
    }
  };

  // Verify OTP
  const verifyOtp = async (phone: string, token: string): Promise<{ success: boolean; message: string }> => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { success: false, message: 'Supabase is not configured.' };
    }

    const cleanPhone = phone.trim();
    const cleanToken = token.trim();

    if (!cleanPhone || !cleanToken) {
      return { success: false, message: 'Mobile number and 6-digit OTP code are required.' };
    }

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: cleanPhone,
        token: cleanToken,
        type: 'sms',
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        await loadProfile(data.user.id, cleanPhone);
        setIsGuestMode(false);
        return { success: true, message: 'Authenticated successfully!' };
      }

      return { success: false, message: 'Could not verify OTP.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'OTP verification failed.' };
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setFarmerProfile(null);
    setIsGuestMode(false);
  };

  // Update profile
  const updateFarmerProfile = async (
    updates: Partial<FarmerProfileData>
  ): Promise<{ success: boolean; message: string }> => {
    if (!user) return { success: false, message: 'No authenticated farmer.' };

    const supabase = getSupabaseClient();
    if (!supabase) {
      setFarmerProfile((prev) => (prev ? { ...prev, ...updates } : null));
      return { success: true, message: 'Profile updated locally.' };
    }

    try {
      const { data, error } = await supabase
        .from('farmer_profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        return { success: false, message: error.message };
      }

      if (data) {
        setFarmerProfile(data);
      }
      return { success: true, message: 'Profile updated successfully.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to update profile.' };
    }
  };

  const enterGuestMode = () => {
    setIsGuestMode(true);
  };

  const exitGuestMode = () => {
    setIsGuestMode(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        farmerProfile,
        isLoading,
        isConfigured: configured,
        isGuestMode,
        sendOtp,
        verifyOtp,
        logout,
        updateFarmerProfile,
        enterGuestMode,
        exitGuestMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
