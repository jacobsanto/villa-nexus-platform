
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Unlink, Settings } from "lucide-react";
import { TenantIntegration, Integration } from "@/types";

interface ActiveIntegrationCardProps {
  tenantIntegration: TenantIntegration;
  integration: Integration;
  onDisconnect: (tenantIntegrationId: string) => void;
}

const ActiveIntegrationCard = ({ 
  tenantIntegration, 
  integration, 
  onDisconnect 
}: ActiveIntegrationCardProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="border-green-200 bg-green-50">
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
          <Badge className="bg-green-100 text-green-800">Active</Badge>
        </div>
        <CardDescription>
          Connected and syncing your properties.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <p className="text-sm text-gray-600">
            Last sync: {formatDate(tenantIntegration.last_sync_at)}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-1" />
            Configure
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDisconnect(tenantIntegration.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Unlink className="w-4 h-4 mr-1" />
            Disconnect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveIntegrationCard;
