
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tenant } from "@/types";
import TenantListItem from "./TenantListItem";

interface TenantManagementSectionProps {
  tenants: Tenant[];
  loading: boolean;
  onAddTenant: () => void;
}

const TenantManagementSection = ({ tenants, loading, onAddTenant }: TenantManagementSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Tenant Management</CardTitle>
            <CardDescription>Manage property management companies using your platform</CardDescription>
          </div>
          <Button 
            onClick={onAddTenant}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Tenant
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading tenants...</p>
          </div>
        ) : tenants.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No tenants found. Add your first tenant to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tenants.map((tenant) => (
              <TenantListItem key={tenant.id} tenant={tenant} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TenantManagementSection;
