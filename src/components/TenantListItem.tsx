
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Settings, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DeleteTenantModal from "./DeleteTenantModal";

interface EnhancedTenant {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  created_at: string;
  brand_color_primary: string;
  user_count: number;
}

interface TenantListItemProps {
  tenant: EnhancedTenant;
  onTenantDeleted: () => void;
}

const TenantListItem = ({ tenant, onTenantDeleted }: TenantListItemProps) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleViewTenant = () => {
    navigate(`/super-admin/tenants/${tenant.id}`);
  };

  const handleTenantSettings = () => {
    navigate(`/super-admin/tenants/${tenant.id}/settings`);
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
        <div className="flex items-center space-x-4">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
            style={{ backgroundColor: tenant.brand_color_primary }}
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
            <p className="text-sm font-medium text-gray-900">{tenant.user_count}</p>
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
            <Button variant="outline" size="sm" onClick={handleViewTenant}>
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            <Button variant="outline" size="sm" onClick={handleTenantSettings}>
              <Settings className="w-4 h-4 mr-1" />
              Settings
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowDeleteModal(true)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <DeleteTenantModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        tenantId={tenant.id}
        tenantName={tenant.name}
        onTenantDeleted={onTenantDeleted}
      />
    </>
  );
};

export default TenantListItem;
