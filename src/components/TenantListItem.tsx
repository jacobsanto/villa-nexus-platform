
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Settings } from "lucide-react";
import { Tenant } from "@/types";

interface TenantListItemProps {
  tenant: Tenant;
}

const TenantListItem = ({ tenant }: TenantListItemProps) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
      <div className="flex items-center space-x-4">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
          style={{ backgroundColor: tenant.primary_color }}
        >
          {tenant.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{tenant.name}</h3>
          <p className="text-sm text-gray-500">
            Created {new Date(tenant.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-900">-</p>
          <p className="text-xs text-gray-500">Users</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-900">-</p>
          <p className="text-xs text-gray-500">Properties</p>
        </div>
        <Badge 
          variant={tenant.status === 'active' ? 'default' : 'secondary'}
          className={tenant.status === 'active' ? 'bg-green-100 text-green-800' : ''}
        >
          {tenant.status}
        </Badge>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-1" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TenantListItem;
