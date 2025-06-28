
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Integration } from "@/types";

interface IntegrationCardProps {
  integration: Integration;
  onConnect: (integration: Integration) => void;
}

const IntegrationCard = ({ integration, onConnect }: IntegrationCardProps) => {
  return (
    <Card>
      <CardHeader>
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
        <CardDescription>
          Connect {integration.name} to sync your properties automatically.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => onConnect(integration)}>
          <Plus className="w-4 h-4 mr-1" />
          Connect
        </Button>
      </CardContent>
    </Card>
  );
};

export default IntegrationCard;
