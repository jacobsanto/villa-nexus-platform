
import { Building2, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tenant } from "@/types";

interface TenantBasicInfoCardProps {
  tenant: Tenant;
}

const TenantBasicInfoCard = ({ tenant }: TenantBasicInfoCardProps) => {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Building2 className="w-5 h-5 mr-2" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-gray-300 text-sm">Company Name</p>
          <p className="text-white font-semibold">{tenant.name}</p>
        </div>
        <div>
          <p className="text-gray-300 text-sm">Status</p>
          <Badge 
            variant={tenant.status === 'active' ? 'default' : 'secondary'}
            className={tenant.status === 'active' ? 'bg-green-100 text-green-800' : ''}
          >
            {tenant.status}
          </Badge>
        </div>
        <div>
          <p className="text-gray-300 text-sm">Created</p>
          <p className="text-white flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date(tenant.created_at).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TenantBasicInfoCard;
