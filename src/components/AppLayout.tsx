
import { Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTenant } from "@/contexts/TenantContext";
import LoadingScreen from "./LoadingScreen";
import TenantSidebar from "./TenantSidebar";
import SuperAdminHeader from "./SuperAdminHeader";

const AppLayout = () => {
  const { profile, loading: authLoading, signOut } = useAuth();
  const { loading: tenantLoading } = useTenant();

  // Show loading while auth or tenant data is loading
  if (authLoading || (profile?.role !== 'super_admin' && tenantLoading)) {
    return <LoadingScreen />;
  }

  // Super Admin Layout
  if (profile?.role === 'super_admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <SuperAdminHeader onSignOut={signOut} />
        <main>
          <Outlet />
        </main>
      </div>
    );
  }

  // Tenant Layout with Sidebar
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      <TenantSidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
