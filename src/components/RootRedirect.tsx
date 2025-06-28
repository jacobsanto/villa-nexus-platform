
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "./LoadingScreen";

const RootRedirect = () => {
  const { loading, session, profile } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Redirect super admins to their dashboard
  if (profile?.role === 'super_admin') {
    return <Navigate to="/super-admin" replace />;
  }

  // Redirect regular users to tenant dashboard
  return <Navigate to="/dashboard" replace />;
};

export default RootRedirect;
