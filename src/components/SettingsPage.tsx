import { useTenant } from "@/contexts/TenantContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SettingsPage = () => {
  const { tenant } = useTenant();

  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and set preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
          <CardDescription>
            Customize your company's visual identity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex items-center space-x-3 mt-1">
              <Input
                id="primaryColor"
                type="color"
                value={tenant?.brand_color_primary || '#4f46e5'}
                className="w-16 h-10"
                readOnly
              />
              <Input
                value={tenant?.brand_color_primary || '#4f46e5'}
                className="font-mono"
                readOnly
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="secondaryColor">Secondary Color</Label>
            <div className="flex items-center space-x-3 mt-1">
              <Input
                id="secondaryColor"
                type="color"
                value={tenant?.brand_color_secondary || '#7c3aed'}
                className="w-16 h-10"
                readOnly
              />
              <Input
                value={tenant?.brand_color_secondary || '#7c3aed'}
                className="font-mono"
                readOnly
              />
            </div>
          </div>

          <div>
            <Label htmlFor="backgroundColor">Background Color</Label>
            <div className="flex items-center space-x-3 mt-1">
              <Input
                id="backgroundColor"
                type="color"
                value={tenant?.brand_color_background || '#f9fafb'}
                className="w-16 h-10"
                readOnly
              />
              <Input
                value={tenant?.brand_color_background || '#f9fafb'}
                className="font-mono"
                readOnly
              />
            </div>
          </div>

          <div>
            <Label htmlFor="textColor">Text Color</Label>
            <div className="flex items-center space-x-3 mt-1">
              <Input
                id="textColor"
                type="color"
                value={tenant?.brand_color_text || '#1f2937'}
                className="w-16 h-10"
                readOnly
              />
              <Input
                value={tenant?.brand_color_text || '#1f2937'}
                className="font-mono"
                readOnly
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>
            Here you can perform destructive actions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="destructive">Delete account</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
