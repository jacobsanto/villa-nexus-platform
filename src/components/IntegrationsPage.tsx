
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Integration, TenantIntegration } from "@/types";

const IntegrationsPage = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [tenantIntegrations, setTenantIntegrations] = useState<TenantIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();
  const { toast } = useToast();

  const fetchData = async () => {
    if (!profile?.tenant_id) {
      setLoading(false);
      return;
    }

    try {
      // Fetch all available integrations
      const { data: integrationsData, error: integrationsError } = await supabase
        .from('integrations')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (integrationsError) throw integrationsError;

      // Fetch tenant's active integrations
      const { data: tenantIntegrationsData, error: tenantIntegrationsError } = await supabase
        .from('tenant_integrations')
        .select('*')
        .eq('tenant_id', profile.tenant_id);

      if (tenantIntegrationsError) throw tenantIntegrationsError;

      setIntegrations(integrationsData || []);
      setTenantIntegrations(tenantIntegrationsData || []);
    } catch (error) {
      console.error('Error fetching integrations:', error);
      toast({
        title: "Error",
        description: "Failed to load integrations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [profile?.tenant_id]);

  const isIntegrationConnected = (integrationId: string) => {
    return tenantIntegrations.some(
      ti => ti.integration_id === integrationId && ti.is_active
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">PMS Integrations</h1>
        <p className="text-gray-600 mt-2">
          Connect your property management systems to sync data automatically.
        </p>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading integrations...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => {
            const isConnected = isIntegrationConnected(integration.id);
            
            return (
              <Card key={integration.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      {integration.logo_url && (
                        <img 
                          src={integration.logo_url} 
                          alt={`${integration.name} logo`}
                          className="w-8 h-8 mr-2 rounded"
                        />
                      )}
                      {integration.name}
                    </CardTitle>
                    <Badge variant={isConnected ? "default" : "secondary"}>
                      {isConnected ? "Connected" : "Available"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    {isConnected 
                      ? `${integration.name} is connected and syncing your properties.`
                      : `Connect ${integration.name} to sync your properties automatically.`
                    }
                  </p>
                  <div className="flex space-x-2">
                    {isConnected ? (
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-1" />
                        Configure
                      </Button>
                    ) : (
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-1" />
                        Connect
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default IntegrationsPage;
