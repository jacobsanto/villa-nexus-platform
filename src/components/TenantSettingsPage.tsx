
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tenant } from "@/types";
import ProfileSettingsTab from "./ProfileSettingsTab";
import BrandingSettingsTab from "./BrandingSettingsTab";

const TenantSettingsPage = () => {
  const { tenantId } = useParams<{ tenantId: string }>();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
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
        description: "Failed to load tenant settings",
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
            <p className="text-gray-400">Loading tenant settings...</p>
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
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to={`/super-admin/tenants/${tenant.id}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Details
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-white">
              Settings for {tenant.name}
            </h1>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm border-white/20">
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-gray-300"
            >
              <User className="w-4 h-4 mr-2" />
              Profile & Business Info
            </TabsTrigger>
            <TabsTrigger 
              value="branding"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-gray-300"
            >
              <Settings className="w-4 h-4 mr-2" />
              Branding & Appearance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileSettingsTab tenant={tenant} onUpdate={fetchTenant} />
          </TabsContent>

          <TabsContent value="branding">
            <BrandingSettingsTab tenant={tenant} onUpdate={fetchTenant} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TenantSettingsPage;
