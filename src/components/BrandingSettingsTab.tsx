
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tenant } from "@/types";
import { Palette } from "lucide-react";
import LogoUploader from "./LogoUploader";

interface BrandingSettingsTabProps {
  tenant: Tenant;
  onUpdate: () => void;
}

const BrandingSettingsTab = ({ tenant, onUpdate }: BrandingSettingsTabProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    brand_color_primary: tenant.brand_color_primary,
    brand_color_secondary: tenant.brand_color_secondary,
    brand_color_background: tenant.brand_color_background,
    brand_color_text: tenant.brand_color_text,
    brand_font_family: tenant.brand_font_family
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('tenants')
        .update({
          brand_color_primary: formData.brand_color_primary,
          brand_color_secondary: formData.brand_color_secondary,
          brand_color_background: formData.brand_color_background,
          brand_color_text: formData.brand_color_text,
          brand_font_family: formData.brand_font_family
        })
        .eq('id', tenant.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Branding settings updated successfully",
      });

      onUpdate();
    } catch (error) {
      console.error('Error updating branding:', error);
      toast({
        title: "Error",
        description: "Failed to update branding settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Logo Upload Section */}
      <LogoUploader 
        tenantId={tenant.id} 
        currentLogoUrl={tenant.logo_url || undefined}
        onUpdate={onUpdate}
      />

      {/* Branding Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Brand Colors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brand_color_primary" className="text-gray-300">Primary Color</Label>
                <div className="flex items-center space-x-3">
                  <Input
                    id="brand_color_primary"
                    type="color"
                    value={formData.brand_color_primary}
                    onChange={(e) => setFormData({...formData, brand_color_primary: e.target.value})}
                    className="w-16 h-10 bg-white/10 border-white/20"
                  />
                  <Input
                    value={formData.brand_color_primary}
                    onChange={(e) => setFormData({...formData, brand_color_primary: e.target.value})}
                    className="bg-white/10 border-white/20 text-white font-mono"
                    placeholder="#4f46e5"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="brand_color_secondary" className="text-gray-300">Secondary Color</Label>
                <div className="flex items-center space-x-3">
                  <Input
                    id="brand_color_secondary"
                    type="color"
                    value={formData.brand_color_secondary}
                    onChange={(e) => setFormData({...formData, brand_color_secondary: e.target.value})}
                    className="w-16 h-10 bg-white/10 border-white/20"
                  />
                  <Input
                    value={formData.brand_color_secondary}
                    onChange={(e) => setFormData({...formData, brand_color_secondary: e.target.value})}
                    className="bg-white/10 border-white/20 text-white font-mono"
                    placeholder="#7c3aed"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="brand_color_background" className="text-gray-300">Background Color</Label>
                <div className="flex items-center space-x-3">
                  <Input
                    id="brand_color_background"
                    type="color"
                    value={formData.brand_color_background}
                    onChange={(e) => setFormData({...formData, brand_color_background: e.target.value})}
                    className="w-16 h-10 bg-white/10 border-white/20"
                  />
                  <Input
                    value={formData.brand_color_background}
                    onChange={(e) => setFormData({...formData, brand_color_background: e.target.value})}
                    className="bg-white/10 border-white/20 text-white font-mono"
                    placeholder="#f9fafb"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="brand_color_text" className="text-gray-300">Text Color</Label>
                <div className="flex items-center space-x-3">
                  <Input
                    id="brand_color_text"
                    type="color"
                    value={formData.brand_color_text}
                    onChange={(e) => setFormData({...formData, brand_color_text: e.target.value})}
                    className="w-16 h-10 bg-white/10 border-white/20"
                  />
                  <Input
                    value={formData.brand_color_text}
                    onChange={(e) => setFormData({...formData, brand_color_text: e.target.value})}
                    className="bg-white/10 border-white/20 text-white font-mono"
                    placeholder="#1f2937"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="brand_font_family" className="text-gray-300">Font Family</Label>
              <Select 
                value={formData.brand_font_family} 
                onValueChange={(value: string) => setFormData({...formData, brand_font_family: value})}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter, sans-serif">Inter</SelectItem>
                  <SelectItem value="Roboto, sans-serif">Roboto</SelectItem>
                  <SelectItem value="Open Sans, sans-serif">Open Sans</SelectItem>
                  <SelectItem value="Lato, sans-serif">Lato</SelectItem>
                  <SelectItem value="Montserrat, sans-serif">Montserrat</SelectItem>
                  <SelectItem value="Poppins, sans-serif">Poppins</SelectItem>
                  <SelectItem value="Source Sans Pro, sans-serif">Source Sans Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {loading ? 'Saving...' : 'Save Branding Settings'}
        </Button>
      </form>
    </div>
  );
};

export default BrandingSettingsTab;
