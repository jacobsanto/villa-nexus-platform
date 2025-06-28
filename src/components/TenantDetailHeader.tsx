
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tenant } from "@/types";

interface TenantDetailHeaderProps {
  tenant: Tenant;
}

const TenantDetailHeader = ({ tenant }: TenantDetailHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-4">
        <Link to="/super-admin/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-white">
          Viewing Tenant: {tenant.name}
        </h1>
      </div>
      <Link to={`/super-admin/tenants/${tenant.id}/settings`}>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          Tenant Settings
        </Button>
      </Link>
    </div>
  );
};

export default TenantDetailHeader;
