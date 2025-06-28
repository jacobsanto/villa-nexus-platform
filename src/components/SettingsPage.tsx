
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Users, CreditCard, Shield } from "lucide-react";

const SettingsPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Tenant Account Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account preferences, team members, and integrations.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              General Settings
            </CardTitle>
            <CardDescription>Company information and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Company Name</label>
              <p className="text-sm text-gray-600">Your Property Company</p>
            </div>
            <div>
              <label className="text-sm font-medium">Primary Color</label>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <p className="text-sm text-gray-600">#0ea5e9</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Edit Settings</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Team Members
            </CardTitle>
            <CardDescription>Manage your team access and roles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Active Members</span>
              <Badge>12</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Pending Invites</span>
              <Badge variant="outline">2</Badge>
            </div>
            <Button variant="outline" size="sm">Manage Team</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Billing & Subscription
            </CardTitle>
            <CardDescription>Manage your subscription and payment methods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Current Plan</span>
              <Badge>Professional</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Next Billing</span>
              <span className="text-sm text-gray-600">Jan 15, 2024</span>
            </div>
            <Button variant="outline" size="sm">Manage Billing</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Security & Privacy
            </CardTitle>
            <CardDescription>Account security and data privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Two-Factor Auth</span>
              <Badge className="bg-green-100 text-green-800">Enabled</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Data Backup</span>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            <Button variant="outline" size="sm">Security Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
