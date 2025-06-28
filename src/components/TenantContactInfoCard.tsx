
import { Mail, Phone, Globe, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tenant } from "@/types";

interface TenantContactInfoCardProps {
  tenant: Tenant;
}

const TenantContactInfoCard = ({ tenant }: TenantContactInfoCardProps) => {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Mail className="w-5 h-5 mr-2" />
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-gray-300 text-sm">Email</p>
          <p className="text-white">{tenant.contact_email || 'Not provided'}</p>
        </div>
        <div>
          <p className="text-gray-300 text-sm">Phone</p>
          <p className="text-white flex items-center">
            <Phone className="w-4 h-4 mr-2" />
            {tenant.phone_number || 'Not provided'}
          </p>
        </div>
        <div>
          <p className="text-gray-300 text-sm">Website</p>
          <p className="text-white flex items-center">
            <Globe className="w-4 h-4 mr-2" />
            {tenant.website || 'Not provided'}
          </p>
        </div>
        <div>
          <p className="text-gray-300 text-sm">Address</p>
          <p className="text-white flex items-start">
            <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            {tenant.address || 'Not provided'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TenantContactInfoCard;
