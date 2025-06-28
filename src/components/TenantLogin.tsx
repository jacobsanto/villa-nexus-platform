
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TenantLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  // Mock tenant data - in real app this would come from Supabase
  const mockTenant = {
    name: 'Coastal Properties',
    logo: null,
    primaryColor: '#0ea5e9'
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - in real app this would authenticate with Supabase
    console.log('Login attempt:', credentials);
    
    // Navigate to dashboard after successful login
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        {/* Tenant Branding */}
        <div className="text-center mb-8">
          <div 
            className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-4"
            style={{ backgroundColor: mockTenant.primaryColor }}
          >
            {mockTenant.logo ? (
              <img src={mockTenant.logo} alt={mockTenant.name} className="w-12 h-12 rounded-xl" />
            ) : (
              <Building2 className="w-8 h-8" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{mockTenant.name}</h1>
          <p className="text-gray-600">Property Management Portal</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={credentials.email}
                    onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full mt-6 h-11 text-base font-medium"
                style={{ backgroundColor: mockTenant.primaryColor }}
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <a 
                href="#" 
                className="text-sm hover:underline"
                style={{ color: mockTenant.primaryColor }}
              >
                Forgot your password?
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Powered by <span className="font-semibold text-gray-700">Arivio</span></p>
        </div>
      </div>
    </div>
  );
};

export default TenantLogin;
