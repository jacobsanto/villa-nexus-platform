
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '@/types';

export function useAuthNavigation(profile: UserProfile | null, userId: string | null, sessionLoading: boolean, profileLoading: boolean) {
  const navigate = useNavigate();

  useEffect(() => {
    // Don't navigate while data is still loading
    if (sessionLoading || profileLoading || !userId) return;

    const currentPath = window.location.pathname;
    console.log('🧭 Handling navigation for user:', userId, 'profile:', profile);
    console.log('📍 Current path:', currentPath);
    
    // If user is on login pages, redirect them based on their role
    if (currentPath === '/login' || currentPath === '/admin') {
      if (profile?.role === 'super_admin') {
        console.log('🚀 Navigating super admin to dashboard');
        navigate('/super-admin/dashboard', { replace: true });
      } else if (profile?.role === 'admin' || profile?.role === 'member') {
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
  }, [profile, userId, sessionLoading, profileLoading, navigate]);
}
