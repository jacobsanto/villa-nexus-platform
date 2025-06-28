
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Save, Settings, Building2, Palette, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tenant } from "@/types";

const TenantSettingsPage = () => {
  const { tenantId } = useParams<{ tenantId: string }>();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    status: 'active' as 'active' | 'inactive',
    contact_email: '',
    phone_number: '',
    address: '',
    website: '',
    vat_number: '',
    brand_color_primary: '#4f46e5',
    brand_color_secondary: '#7c3aed',
    brand_color_background: '#f9fafb',
    brand_color_text: '#1f2937',
    brand_font_family: 'Inter, sans-serif'
  });
  const { toast } = useToast();

  const fetchTenant = async () => {
    if (!tenantId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', tenantId)
        .single();

      if (error) {
        throw error;
      }

      const typedTenant: Tenant = {
        ...data,
        status: data.status as 'active' | 'inactive'
      };

      setTenant(typedTenant);
      setFormData({
        name: typedTenant.name,
        status: typedTenant.status,
        contact_email: typedTenant.contact_email || '',
        phone_number: typedTenant.phone_number || '',
        address: typedTenant.address || '',
        website: typedTenant.website || '',
        vat_number: typedTenant.vat_number || '',
        brand_color_primary: typedTenant.brand_color_primary,
        brand_color_secondary: typedTenant.brand_color_secondary,
        brand_color_background: typedTenant.brand_color_background,
        brand_color_text: typedTenant.brand_color_text,
        brand_font_family: typedTenant.brand_font_family
      });
    } catch (error) {
      console.error('Error fetching tenant:', error);
      toast({
        title: "Error",
        description: "Failed to load tenant settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!tenantId) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('tenants')
        .update({
          name: formData.name,
          status: formData.status,
          contact_email: formData.contact_email || null,
          phone_number: formData.phone_number || null,
          address: formData.address || null,
          website: formData.website || null,
          vat_number: formData.vat_number || null,
          brand_color_primary: formData.brand_color_primary,
          brand_color_secondary: formData.brand_color_secondary,
          brand_color_background: formData.brand_color_background,
          brand_color_text: formData.brand_color_text,
          brand_font_family: formData.brand_font_family
        })
        .eq('id', tenantId);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Tenant settings updated successfully",
      });

      // Refresh tenant data
      await fetchTenant();
    } catch (error) {
      console.error('Error updating tenant:', error);
      toast({
        title: "Error",
        description: "Failed to update tenant settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchTenant();
  }, [tenantId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <p className="text-gray-400">Loading tenant settings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <p className="text-gray-400">Tenant not found</p>
            <Link to="/super-admin/dashboard">
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to={`/super-admin/tenants/${tenant.id}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Details
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-white">
              Settings for Tenant: {tenant.name}
            </h1>
          </div>
          <Button 
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <div className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-300">Company Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>
              
              <div>
                <Label htmlFor="status" className="text-gray-300">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: 'active' | 'inactive') => setFormData({...formData, status: value})}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="contact_email" className="text-gray-300">Contact Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  placeholder="contact@company.com"
                />
              </div>
              
              <div>
                <Label htmlFor="phone_number" className="text-gray-300">Phone Number</Label>
                <Input
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div>
                <Label htmlFor="website" className="text-gray-300">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  placeholder="https://www.company.com"
                />
              </div>
              
              <div>
                <Label htmlFor="address" className="text-gray-300">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  placeholder="123 Main St, City, State 12345"
                />
              </div>
              
              <div>
                <Label htmlFor="vat_number" className="text-gray-300">VAT Number</Label>
                <Input
                  id="vat_number"
                  value={formData.vat_number}
                  onChange={(e) => setFormData({...formData, vat_number: e.target.value})}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  placeholder="VAT123456"
                />
              </div>
            </CardContent>
          </Card>

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
        </div>
      </div>
    </div>
  );
};

export default TenantSettingsPage;
