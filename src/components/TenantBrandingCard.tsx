
import { Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tenant } from "@/types";

interface TenantBrandingCardProps {
  tenant: Tenant;
}

const TenantBrandingCard = ({ tenant }: TenantBrandingCardProps) => {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Palette className="w-5 h-5 mr-2" />
          Brand Colors
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-300 text-sm">Primary</p>
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded-lg border-2 border-white/20"
                style={{ backgroundColor: tenant.brand_color_primary }}
              />
              <p className="text-white font-mono text-sm">{tenant.brand_color_primary}</p>
            </div>
          </div>
          <div>
            <p className="text-gray-300 text-sm">Secondary</p>
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded-lg border-2 border-white/20"
                style={{ backgroundColor: tenant.brand_color_secondary }}
              />
              <p className="text-white font-mono text-sm">{tenant.brand_color_secondary}</p>
            </div>
          </div>
          <div>
            <p className="text-gray-300 text-sm">Background</p>
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded-lg border-2 border-white/20"
                style={{ backgroundColor: tenant.brand_color_background }}
              />
              <p className="text-white font-mono text-sm">{tenant.brand_color_background}</p>
            </div>
          </div>
          <div>
            <p className="text-gray-300 text-sm">Text</p>
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded-lg border-2 border-white/20"
                style={{ backgroundColor: tenant.brand_color_text }}
              />
              <p className="text-white font-mono text-sm">{tenant.brand_color_text}</p>
            </div>
          </div>
        </div>
        <div>
          <p className="text-gray-300 text-sm">Font Family</p>
          <p className="text-white" style={{ fontFamily: tenant.brand_font_family }}>
            {tenant.brand_font_family}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TenantBrandingCard;
