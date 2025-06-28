
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tenant } from "@/types";
import TenantDetailHeader from "./TenantDetailHeader";
import TenantBasicInfoCard from "./TenantBasicInfoCard";
import TenantContactInfoCard from "./TenantContactInfoCard";
import TenantBrandingCard from "./TenantBrandingCard";
import TenantAssetsCard from "./TenantAssetsCard";
import TenantStatisticsCard from "./TenantStatisticsCard";

const TenantDetailPage = () => {
  const { tenantId } = useParams<{ tenantId: string }>();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTenant = async () => {
    if (!tenantId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', tenantId)
        .single();

      if (error) {
        throw error;
      }

      const typedTenant: Tenant = {
        ...data,
        status: data.status as 'active' | 'inactive'
      };

      setTenant(typedTenant);
    } catch (error) {
      console.error('Error fetching tenant:', error);
      toast({
        title: "Error",
        description: "Failed to load tenant details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenant();
  }, [tenantId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <p className="text-gray-400">Loading tenant details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <p className="text-gray-400">Tenant not found</p>
            <Link to="/super-admin/dashboard">
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <TenantDetailHeader tenant={tenant} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <TenantBasicInfoCard tenant={tenant} />
          <TenantContactInfoCard tenant={tenant} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <TenantBrandingCard tenant={tenant} />
          <TenantAssetsCard tenant={tenant} />
        </div>

        <TenantStatisticsCard />
      </div>
    </div>
  );
};

export default TenantDetailPage;
