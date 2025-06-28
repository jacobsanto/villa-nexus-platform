
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/contexts/TenantContext';
import LoadingScreen from './LoadingScreen';
import LoginPage from './LoginPage';
import TenantDashboard from './TenantDashboard';
import SuperAdminDashboard from './SuperAdminDashboard';

const AppRouter = () => {
  const { loading: authLoading, session, profile } = useAuth();
  const { loading: tenantLoading } = useTenant();

  console.log('AppRouter state:', { authLoading, tenantLoading, session: !!session, profile });

  // Show loading screen while checking authentication
  if (authLoading || (session && tenantLoading)) {
    return <LoadingScreen />;
  }

  // Show login page if not authenticated
  if (!session || !profile) {
    return <LoginPage />;
  }

  // Route based on user role
  if (profile.role === 'super_admin') {
    return <SuperAdminDashboard />;
  }

  // For tenant users (admin or member)
  if (profile.tenant_id) {
    return <TenantDashboard />;
  }

  // Fallback for users without proper configuration
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Account Setup Required</h1>
        <p className="text-gray-600 mb-4">
          Your account needs to be configured by an administrator.
        </p>
        <p className="text-sm text-gray-500">
          Please contact support for assistance.
        </p>
      </div>
    </div>
  );
};

export default AppRouter;
