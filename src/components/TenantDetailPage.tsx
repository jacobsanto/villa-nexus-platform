
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Building2, Calendar, Palette, Mail, Phone, Globe, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tenant } from "@/types";

const TenantDetailPage = () => {
  const { tenantId } = useParams<{ tenantId: string }>();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
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
    } catch (error) {
      console.error('Error fetching tenant:', error);
      toast({
        title: "Error",
        description: "Failed to load tenant details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
            <p className="text-gray-400">Loading tenant details...</p>
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
      <div className="max-w-6xl mx-auto">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">-</p>
                <p className="text-gray-300 text-sm">Users</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">-</p>
                <p className="text-gray-300 text-sm">Properties</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">-</p>
                <p className="text-gray-300 text-sm">Bookings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TenantDetailPage;
