
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

  // Show loading screen while auth is loading
  if (loading) {
    return <LoadingScreen />;
  }

  // Redirect to login if not authenticated
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // If children are provided, render them (for nested routes)
  if (children) {
    return <>{children}</>;
  }

  // Wait for profile to load before rendering dashboard
  if (!profile) {
    return <LoadingScreen />;
  }

  // Render the appropriate dashboard based on role
  if (profile.role === 'super_admin') {
    return <SuperAdminDashboard />;
  }

  return <TenantDashboard />;
};

export default ProtectedRoute;
