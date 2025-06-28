
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "./LoadingScreen";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: 'admin' | 'member' | 'super_admin';
  or_role?: 'admin' | 'member' | 'super_admin';
}

const ProtectedRoute = ({ children, role, or_role }: ProtectedRouteProps) => {
  const { loading, session, profile } = useAuth();

  // Show loading screen while auth is loading
  if (loading) {
    return <LoadingScreen />;
  }

  // Redirect to appropriate login if not authenticated
  if (!session) {
    // Determine which login page based on current route
    if (window.location.pathname.startsWith('/super-admin')) {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // If session exists but profile is still loading, show loading screen
  if (!profile) {
    return <LoadingScreen />;
  }

  // If no role is specified, just check for authentication
  if (!role) {
    return <>{children}</>;
  }

  // Check if user has the required role
  if (profile.role === role || (or_role && profile.role === or_role)) {
    return <>{children}</>;
  }

  // Redirect based on user's actual role
  if (profile.role === 'super_admin') {
    return <Navigate to="/super-admin/dashboard" replace />;
  } else {
    return <Navigate to="/dashboard" replace />;
  }
};

export default ProtectedRoute;
