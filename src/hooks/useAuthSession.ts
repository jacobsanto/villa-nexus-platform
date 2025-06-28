
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export function useAuthSession() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    console.log('🔄 Auth session initializing...');

    const initializeAuth = async () => {
      try {
        console.log('🎯 Getting current session...');
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (currentSession?.user) {
          console.log('✅ Current session found:', currentSession.user.id);
          setSession(currentSession);
          setUser(currentSession.user);
        } else {
          console.log('❌ No current session found');
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        console.error('💥 Error initializing auth:', error);
        if (mounted) {
          setSession(null);
          setUser(null);
        }
      } finally {
        if (mounted) {
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
        } else {
          console.log('❌ Session cleared');
          setSession(null);
          setUser(null);
        }
      }
    );

    // Initialize auth on mount
    initializeAuth();

    return () => {
      console.log('🧹 Auth session cleanup');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, session, loading };
}
