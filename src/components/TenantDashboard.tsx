
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Bell,
  Settings,
  LogOut,
  Menu
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTenant } from "@/contexts/TenantContext";

const TenantDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { profile, signOut } = useAuth();
  const { tenant } = useTenant();

  const handleSignOut = async () => {
    await signOut();
  };

  // Use real tenant data or fallback
  const tenantData = tenant || {
    name: 'Your Property Company',
    logo_url: null,
    primary_color: '#0ea5e9'
  };

  const stats = [
    {
      title: "Total Properties",
      value: "45",
      change: "+12%",
      trend: "up",
      icon: Building2
    },
    {
      title: "Active Bookings",
      value: "128",
      change: "+8%",
      trend: "up",
      icon: Calendar
    },
    {
      title: "Team Members",
      value: "12",
      change: "+2",
      trend: "up",
      icon: Users
    },
    {
      title: "Monthly Revenue",
      value: "$48,392",
      change: "+23%",
      trend: "up",
      icon: DollarSign
    }
  ];

  const recentActivity = [
    { type: "booking", message: "New booking for Ocean View Villa", time: "2 minutes ago" },
    { type: "maintenance", message: "Maintenance request completed at Beach House", time: "1 hour ago" },
    { type: "team", message: "Sarah Johnson joined your team", time: "3 hours ago" },
    { type: "payment", message: "Payment received for Mountain Cabin", time: "5 hours ago" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: tenantData.primary_color }}
                >
                  {tenantData.logo_url ? (
                    <img src={tenantData.logo_url} alt={tenantData.name} className="w-6 h-6 rounded" />
                  ) : (
                    <Building2 className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{tenantData.name}</h1>
                  <p className="text-sm text-gray-500 hidden sm:block">Property Management Dashboard</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600 hidden sm:inline">
                Welcome, {profile?.full_name}
              </span>
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
          <p className="text-gray-600">Here's what's happening with your properties today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  {stat.change} from last month
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                style={{ borderColor: tenantData.primary_color, color: tenantData.primary_color }}
              >
                <Building2 className="mr-2 h-4 w-4" />
                Add New Property
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                style={{ borderColor: tenantData.primary_color, color: tenantData.primary_color }}
              >
                <Calendar className="mr-2 h-4 w-4" />
                View Calendar
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                style={{ borderColor: tenantData.primary_color, color: tenantData.primary_color }}
              >
                <Users className="mr-2 h-4 w-4" />
                Manage Team
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                style={{ borderColor: tenantData.primary_color, color: tenantData.primary_color }}
              >
                <DollarSign className="mr-2 h-4 w-4" />
                Financial Reports
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates across your properties</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: tenantData.primary_color }}
                    ></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integration Status */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Integration Status</CardTitle>
            <CardDescription>Connected services and APIs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Guesty API</h3>
                  <p className="text-sm text-gray-500">Property management integration</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Connected</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TenantDashboard;
