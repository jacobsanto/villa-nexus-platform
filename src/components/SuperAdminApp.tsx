
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SuperAdminHeader from "./SuperAdminHeader";
import SuperAdminDashboard from "./SuperAdminDashboard";
import TenantDetailPage from "./TenantDetailPage";
import TenantSettingsPage from "./TenantSettingsPage";

const SuperAdminApp = () => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <SuperAdminHeader onSignOut={handleSignOut} />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/super-admin/dashboard" replace />} />
          <Route path="/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/tenants/:tenantId" element={<TenantDetailPage />} />
          <Route path="/tenants/:tenantId/settings" element={<TenantSettingsPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default SuperAdminApp;
