
import { useState, useEffect } from "react";
import { Building2, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import StatsCard from "./StatsCard";
import TenantManagementSection from "./TenantManagementSection";
import AddTenantModal from "./AddTenantModal";

interface EnhancedTenant {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  created_at: string;
  brand_color_primary: string;
  brand_color_secondary: string;
  brand_color_background: string;
  brand_color_text: string;
  brand_font_family: string;
  phone_number?: string;
  logo_url?: string;
  contact_email?: string;
  address?: string;
  website?: string;
  vat_number?: string;
  user_count: number;
}

const SuperAdminDashboard = () => {
  const [tenants, setTenants] = useState<EnhancedTenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_tenants_with_user_count');

      if (error) {
        throw error;
      }

      const typedTenants: EnhancedTenant[] = data.map(tenant => ({
        ...tenant,
        status: tenant.status as 'active' | 'inactive',
        user_count: Number(tenant.user_count)
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

  const totalUsers = tenants.reduce((sum, tenant) => sum + tenant.user_count, 0);

  const statsData = [
    {
      title: "Total Tenants",
      value: tenants.length,
      description: "Active property management companies",
      icon: Building2
    },
    {
      title: "Total Users",
      value: totalUsers,
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
          onTenantDeleted={fetchTenants}
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
