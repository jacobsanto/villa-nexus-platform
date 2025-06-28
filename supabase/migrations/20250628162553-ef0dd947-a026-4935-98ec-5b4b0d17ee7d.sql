
-- Create tenants table
CREATE TABLE public.tenants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT NOT NULL DEFAULT '#0ea5e9',
  guesty_api_key TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive'))
);

-- Create profiles table that extends auth.users
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tenants table
-- Super admins can see all tenants
CREATE POLICY "Super admins can view all tenants" 
  ON public.tenants 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'super_admin'
    )
  );

-- Super admins can insert tenants
CREATE POLICY "Super admins can create tenants" 
  ON public.tenants 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'super_admin'
    )
  );

-- Super admins can update tenants
CREATE POLICY "Super admins can update tenants" 
  ON public.tenants 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'super_admin'
    )
  );

-- Tenant users can view their own tenant
CREATE POLICY "Users can view their own tenant" 
  ON public.tenants 
  FOR SELECT 
  USING (
    id IN (
      SELECT tenant_id FROM public.profiles 
      WHERE profiles.id = auth.uid()
    )
  );

-- RLS Policies for profiles table
-- Users can view their own profile
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (id = auth.uid());

-- Super admins can view all profiles
CREATE POLICY "Super admins can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles AS p 
      WHERE p.id = auth.uid() 
      AND p.role = 'super_admin'
    )
  );

-- Super admins can insert profiles
CREATE POLICY "Super admins can create profiles" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles AS p 
      WHERE p.id = auth.uid() 
      AND p.role = 'super_admin'
    )
  );

-- Super admins can update profiles
CREATE POLICY "Super admins can update profiles" 
  ON public.profiles 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles AS p 
      WHERE p.id = auth.uid() 
      AND p.role = 'super_admin'
    )
  );

-- Function to handle new user signup - creates profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'New User'),
    'member'
  );
  RETURN NEW;
END;
$$;

-- Trigger to automatically create profile when user signs up
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample data for testing
INSERT INTO public.tenants (id, name, primary_color, guesty_api_key, status) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Coastal Properties', '#0ea5e9', 'encrypted_key_123', 'active'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Mountain View Rentals', '#10b981', 'encrypted_key_456', 'active');
