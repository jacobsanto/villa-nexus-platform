
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Building2, Users, Settings, Eye, LogOut } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import AddTenantModal from "./AddTenantModal";
import { Tenant } from "@/types";

const SuperAdminDashboard = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { signOut } = useAuth();
  const { toast } = useToast();

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Cast the data to proper types
      const typedTenants: Tenant[] = data.map(tenant => ({
        ...tenant,
        status: tenant.status as 'active' | 'inactive'
      }));

      setTenants(typedTenants);
    } catch (error) {
      console.error('Error fetching tenants:', error);
      toast({
        title: "Error",
        description: "Failed to load tenants",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Arivio</h1>
                <p className="text-sm text-gray-500">Super Admin Panel</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Super Admin
              </Badge>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tenants.length}</div>
              <p className="text-xs text-muted-foreground">Active property management companies</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">Across all tenants</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">Managed properties</p>
            </CardContent>
          </Card>
        </div>

        {/* Tenants Management */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Tenant Management</CardTitle>
                <CardDescription>Manage property management companies using your platform</CardDescription>
              </div>
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Tenant
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading tenants...</p>
              </div>
            ) : tenants.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No tenants found. Add your first tenant to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tenants.map((tenant) => (
                  <div key={tenant.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
                        style={{ backgroundColor: tenant.primary_color }}
                      >
                        {tenant.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{tenant.name}</h3>
                        <p className="text-sm text-gray-500">
                          Created {new Date(tenant.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900">-</p>
                        <p className="text-xs text-gray-500">Users</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900">-</p>
                        <p className="text-xs text-gray-500">Properties</p>
                      </div>
                      <Badge 
                        variant={tenant.status === 'active' ? 'default' : 'secondary'}
                        className={tenant.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {tenant.status}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4 mr-1" />
                          Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Tenant Modal */}
      <AddTenantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTenantAdded={fetchTenants}
      />
    </div>
  );
};

export default SuperAdminDashboard;
