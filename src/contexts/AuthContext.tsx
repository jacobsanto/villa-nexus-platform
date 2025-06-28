
import React, { createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from '@/types/auth';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useProfileData } from '@/hooks/useProfileData';
import { useAuthNavigation } from '@/hooks/useAuthNavigation';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, session, loading: sessionLoading } = useAuthSession();
  const { profile, loading: profileLoading } = useProfileData(user);
  
  // Derive role directly from profile
  const role = profile?.role || null;
  
  // Handle navigation after successful authentication
  useAuthNavigation(profile, user?.id || null, sessionLoading, profileLoading);
  
  // Overall loading state - true if either session or profile is loading
  const loading = sessionLoading || (user && profileLoading);

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
