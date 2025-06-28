
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Building2, Users, Settings, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface Tenant {
  id: string;
  name: string;
  logo?: string;
  primaryColor: string;
  guestyApiKey: string;
  createdAt: string;
  status: 'active' | 'inactive';
  userCount: number;
  propertyCount: number;
}

const SuperAdminDashboard = () => {
  const [tenants, setTenants] = useState<Tenant[]>([
    {
      id: '1',
      name: 'Coastal Properties',
      primaryColor: '#0ea5e9',
      guestyApiKey: 'encrypted_key_123',
      createdAt: '2024-01-15',
      status: 'active',
      userCount: 12,
      propertyCount: 45
    },
    {
      id: '2',
      name: 'Mountain View Rentals',
      primaryColor: '#10b981',
      guestyApiKey: 'encrypted_key_456',
      createdAt: '2024-02-03',
      status: 'active',
      userCount: 8,
      propertyCount: 23
    }
  ]);

  const [newTenant, setNewTenant] = useState({
    name: '',
    primaryColor: '#0ea5e9',
    guestyApiKey: ''
  });

  const handleAddTenant = () => {
    const tenant: Tenant = {
      id: Date.now().toString(),
      name: newTenant.name,
      primaryColor: newTenant.primaryColor,
      guestyApiKey: newTenant.guestyApiKey,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active',
      userCount: 0,
      propertyCount: 0
    };

    setTenants([...tenants, tenant]);
    setNewTenant({ name: '', primaryColor: '#0ea5e9', guestyApiKey: '' });
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
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Super Admin
            </Badge>
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
              <div className="text-2xl font-bold">{tenants.reduce((sum, t) => sum + t.userCount, 0)}</div>
              <p className="text-xs text-muted-foreground">Across all tenants</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tenants.reduce((sum, t) => sum + t.propertyCount, 0)}</div>
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Tenant
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Tenant</DialogTitle>
                    <DialogDescription>
                      Create a new property management company account
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="tenant-name">Company Name</Label>
                      <Input
                        id="tenant-name"
                        value={newTenant.name}
                        onChange={(e) => setNewTenant({...newTenant, name: e.target.value})}
                        placeholder="e.g., Coastal Properties"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="primary-color">Primary Brand Color</Label>
                      <Input
                        id="primary-color"
                        type="color"
                        value={newTenant.primaryColor}
                        onChange={(e) => setNewTenant({...newTenant, primaryColor: e.target.value})}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guesty-key">Guesty API Key</Label>
                      <Input
                        id="guesty-key"
                        type="password"
                        value={newTenant.guestyApiKey}
                        onChange={(e) => setNewTenant({...newTenant, guestyApiKey: e.target.value})}
                        placeholder="Enter encrypted API key"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handleAddTenant} 
                    className="w-full"
                    disabled={!newTenant.name || !newTenant.guestyApiKey}
                  >
                    Create Tenant
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tenants.map((tenant) => (
                <div key={tenant.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: tenant.primaryColor }}
                    >
                      {tenant.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{tenant.name}</h3>
                      <p className="text-sm text-gray-500">Created {tenant.createdAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{tenant.userCount}</p>
                      <p className="text-xs text-gray-500">Users</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{tenant.propertyCount}</p>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
