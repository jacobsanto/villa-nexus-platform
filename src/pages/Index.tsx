
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SuperAdminDashboard from "@/components/SuperAdminDashboard";
import TenantLogin from "@/components/TenantLogin";
import LoadingScreen from "@/components/LoadingScreen";

const Index = () => {
  const [userRole, setUserRole] = useState<'super-admin' | 'tenant' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate checking authentication and role
    // In a real app, this would check Supabase auth and user role
    const checkAuth = async () => {
      // For demo purposes, we'll show the tenant login by default
      // Super admin access would be at a special route like /super-admin
      const path = window.location.pathname;
      
      if (path === '/super-admin') {
        setUserRole('super-admin');
      } else {
        setUserRole('tenant');
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (userRole === 'super-admin') {
    return <SuperAdminDashboard />;
  }

  return <TenantLogin />;
};

export default Index;
