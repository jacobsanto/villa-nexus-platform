
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tenant } from "@/types";
import { Building2, Mail, Phone, Globe, MapPin, FileText } from "lucide-react";

interface ProfileSettingsTabProps {
  tenant: Tenant;
  onUpdate: () => void;
}

const ProfileSettingsTab = ({ tenant, onUpdate }: ProfileSettingsTabProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: tenant.name,
    status: tenant.status,
    contact_email: tenant.contact_email || '',
    phone_number: tenant.phone_number || '',
    address: tenant.address || '',
    website: tenant.website || '',
    vat_number: tenant.vat_number || ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('tenants')
        .update({
          name: formData.name,
          status: formData.status,
          contact_email: formData.contact_email || null,
          phone_number: formData.phone_number || null,
          address: formData.address || null,
          website: formData.website || null,
          vat_number: formData.vat_number || null
        })
        .eq('id', tenant.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile settings updated successfully",
      });

      onUpdate();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Building2 className="w-5 h-5 mr-2" />
            General Information
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
              required
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

      <Button 
        type="submit" 
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        {loading ? 'Saving...' : 'Save Profile Settings'}
      </Button>
    </form>
  );
};

export default ProfileSettingsTab;
