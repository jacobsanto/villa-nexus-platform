
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tenant } from "@/types";

interface TenantAssetsCardProps {
  tenant: Tenant;
}

const TenantAssetsCard = ({ tenant }: TenantAssetsCardProps) => {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Logo & Assets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-gray-300 text-sm">Logo</p>
          {tenant.logo_url ? (
            <div className="flex items-center space-x-3">
              <img 
                src={tenant.logo_url} 
                alt={`${tenant.name} logo`}
                className="w-12 h-12 object-contain bg-white rounded"
              />
              <p className="text-white text-sm">Logo uploaded</p>
            </div>
          ) : (
            <p className="text-white">No logo uploaded</p>
          )}
        </div>
        <div>
          <p className="text-gray-300 text-sm">VAT Number</p>
          <p className="text-white">{tenant.vat_number || 'Not provided'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TenantAssetsCard;
