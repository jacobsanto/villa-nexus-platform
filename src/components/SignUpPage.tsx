import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff, User, Building2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import LoginPageHeader from "./LoginPageHeader";

interface TenantCreationResult {
  success: boolean;
  tenant_id?: string;
  error?: string;
}

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    companyName: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('🚀 Starting sign up process...');
      
      // Step 1: Create the tenant first
      const { data: tenantData, error: tenantError } = await supabase.rpc('handle_new_tenant', {
        company_name: formData.companyName
      });

      if (tenantError) {
        console.error('❌ Tenant creation error:', tenantError);
        throw tenantError;
      }

      // Parse tenant result with proper type handling
      let tenantResult: TenantCreationResult;
      try {
        if (tenantData && typeof tenantData === 'object' && !Array.isArray(tenantData)) {
          tenantResult = tenantData as unknown as TenantCreationResult;
        } else if (typeof tenantData === 'string') {
          tenantResult = JSON.parse(tenantData) as TenantCreationResult;
        } else {
          throw new Error('Invalid tenant creation response format');
        }
      } catch (parseError) {
        console.error('❌ Error parsing tenant result:', parseError);
        throw new Error('Invalid response format from server');
      }

      if (!tenantResult?.success || !tenantResult.tenant_id) {
        const errorMessage = tenantResult?.error || 'Failed to create company';
        throw new Error(errorMessage);
      }

      console.log('✅ Tenant created successfully:', tenantResult.tenant_id);

      // Step 2: Create the user with tenant metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: formData.fullName,
            role: 'admin',
            tenant_id: tenantResult.tenant_id
          }
        }
      });

      if (authError) {
        console.error('❌ Auth error:', authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error('User creation failed');
      }

      console.log('✅ User created successfully:', authData.user.id);

      setSuccess(true);
      toast({
        title: "Sign Up Successful!",
        description: "Your account and company have been created. Please log in.",
      });
      
      // Reset form
      setFormData({
        email: '',
        password: '',
        fullName: '',
        companyName: ''
      });
      
      // Navigate to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      console.error('💥 Sign up error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="w-full max-w-md">
          <LoginPageHeader />
          <Card className="shadow-lg border-0">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl text-center">Account Created!</CardTitle>
              <CardDescription className="text-center">
                Your company and account have been successfully created. You can now sign in.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <Link to="/login" className="text-blue-600 hover:underline">
                  Go to Sign In
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <LoginPageHeader />

        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">Create Your Account</CardTitle>
            <CardDescription className="text-center">
              Start your property management journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Enter your company name"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="pl-10"
                    required
                    disabled={loading}
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
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="pl-10 pr-10"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/login" className="text-blue-600 hover:underline text-sm">
                Already have an account? Sign In
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Powered by <span className="font-semibold text-gray-700">Arivio</span></p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
