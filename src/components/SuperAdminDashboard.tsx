
import { useState, useEffect } from "react";
import { Building2, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tenant } from "@/types";
import StatsCard from "./StatsCard";
import TenantManagementSection from "./TenantManagementSection";
import AddTenantModal from "./AddTenantModal";

const SuperAdminDashboard = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const typedTenants: Tenant[] = data.map(tenant => ({
        ...tenant,
        status: tenant.status as 'active' | 'inactive'
      }));

      setTenants(typedTenants);
    } catch (error) {
      console.error('Error fetching tenants:', error);
      toast({
        title: "Error",
        description: "Failed to load tenants",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const statsData = [
    {
      title: "Total Tenants",
      value: tenants.length,
      description: "Active property management companies",
      icon: Building2
    },
    {
      title: "Total Users",
      value: "-",
      description: "Across all tenants",
      icon: Users
    },
    {
      title: "Total Properties",
      value: "-",
      description: "Managed properties",
      icon: Building2
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              description={stat.description}
              icon={stat.icon}
            />
          ))}
        </div>

        <TenantManagementSection
          tenants={tenants}
          loading={loading}
          onAddTenant={() => setIsModalOpen(true)}
        />
      </div>

      <AddTenantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTenantAdded={fetchTenants}
      />
    </div>
  );
};

export default SuperAdminDashboard;
