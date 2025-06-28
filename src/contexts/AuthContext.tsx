
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  role: 'admin' | 'member' | 'super_admin' | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Derive role directly from profile
  const role = profile?.role || null;

  const fetchProfile = async (userId: string) => {
    console.log('🔍 Fetching profile for user:', userId);
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle instead of single to handle no results gracefully
      
      if (error) {
        console.error('❌ Error fetching profile:', error);
        return null;
      }
      
      if (!profileData) {
        console.warn('⚠️ No profile found for user:', userId);
        return null;
      }

      console.log('✅ Profile fetched successfully:', profileData);
      
      const typedProfile: UserProfile = {
        ...profileData,
        role: profileData.role as 'admin' | 'member' | 'super_admin'
      };
      return typedProfile;
    } catch (error) {
      console.error('💥 Exception while fetching profile:', error);
      return null;
    }
  };

  // Handle navigation after successful authentication
  const handleAuthNavigation = (userProfile: UserProfile | null, userId: string) => {
    console.log('🧭 Handling navigation for user:', userId, 'profile:', userProfile);
    
    const currentPath = window.location.pathname;
    console.log('📍 Current path:', currentPath);
    
    // If user is on login pages, redirect them based on their role
    if (currentPath === '/login' || currentPath === '/admin') {
      if (userProfile?.role === 'super_admin') {
        console.log('🚀 Navigating super admin to dashboard');
        navigate('/super-admin/dashboard', { replace: true });
      } else if (userProfile?.role === 'admin' || userProfile?.role === 'member') {
        console.log('🚀 Navigating regular user to dashboard');
        navigate('/dashboard', { replace: true });
      } else {
        // Fallback: If no profile but we have a session, navigate based on current path
        console.log('⚠️ No profile role, using fallback navigation');
        if (currentPath === '/admin') {
          navigate('/super-admin/dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    }
  };

  useEffect(() => {
    let mounted = true;
    console.log('🔄 AuthContext initializing...');

    const initializeAuth = async () => {
      try {
        console.log('🎯 Getting current session...');
        // Get current session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (currentSession?.user) {
          console.log('✅ Current session found:', currentSession.user.id);
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Fetch profile and only set loading to false after both session and profile are ready
          const profileData = await fetchProfile(currentSession.user.id);
          if (mounted) {
            setProfile(profileData);
            handleAuthNavigation(profileData, currentSession.user.id);
            setLoading(false); // Only set loading to false after profile is fetched
          }
        } else {
          console.log('❌ No current session found');
          setSession(null);
          setUser(null);
          setProfile(null);
          if (mounted) {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('💥 Error initializing auth:', error);
        if (mounted) {
          setSession(null);
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.id);
        
        if (!mounted) return;

        if (session?.user) {
          console.log('✅ New session established:', session.user.id);
          setSession(session);
          setUser(session.user);
          setLoading(true); // Set loading to true while fetching profile
          
          // Fetch profile for authenticated user
          const profileData = await fetchProfile(session.user.id);
          if (mounted) {
            setProfile(profileData);
            handleAuthNavigation(profileData, session.user.id);
            setLoading(false); // Only set loading to false after profile is fetched
          }
        } else {
          console.log('❌ Session cleared');
          setSession(null);
          setUser(null);
          setProfile(null);
          if (mounted) {
            setLoading(false);
          }
        }
      }
    );

    // Initialize auth on mount
    initializeAuth();

    return () => {
      console.log('🧹 AuthContext cleanup');
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signOut = async () => {
    console.log('👋 Signing out...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('❌ Error signing out:', error);
    }
  };

  const value = {
    user,
    session,
    profile,
    role,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
