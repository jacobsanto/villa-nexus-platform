
import { Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "./LoadingScreen";

const AppLayout = () => {
  const { loading, profile } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  // For super admins, we don't need a special layout - they'll access SuperAdminDashboard directly
  // For regular users, we also don't need a special layout - they'll access TenantDashboard directly
  // The layout logic is handled within each individual dashboard component
  return <Outlet />;
};

export default AppLayout;
