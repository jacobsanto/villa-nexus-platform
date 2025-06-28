
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "./LoadingScreen";
import TenantDashboard from "./TenantDashboard";
import SuperAdminDashboard from "./SuperAdminDashboard";

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { loading, session, profile } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // If children are provided, render them (for nested routes)
  if (children) {
    return <>{children}</>;
  }

  // Default behavior: render the appropriate dashboard based on role
  if (profile?.role === 'super_admin') {
    return <SuperAdminDashboard />;
  }

  return <TenantDashboard />;
};

export default ProtectedRoute;
