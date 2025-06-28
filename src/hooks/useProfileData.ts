
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types';

export function useProfileData(user: User | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    console.log('🔍 Fetching profile for user:', userId);
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
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

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      if (!user) {
        setProfile(null);
        if (mounted) {
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      const profileData = await fetchProfile(user.id);
      
      if (mounted) {
        setProfile(profileData);
        setLoading(false);
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [user?.id]);

  return { profile, loading };
}
