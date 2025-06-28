
-- First, let's see what data is causing the constraint violation
-- and fix it before applying the constraint

-- Update any profiles that have role 'super_admin' but have a tenant_id
-- (these should have NULL tenant_id)
UPDATE public.profiles 
SET tenant_id = NULL 
WHERE role = 'super_admin' AND tenant_id IS NOT NULL;

-- For profiles that are NOT super_admin but have NULL tenant_id,
-- we need to handle this carefully. Let's first check if there are any such records
-- and if so, we'll need to either assign them to a tenant or change their role

-- Since we can't automatically assign a tenant, let's temporarily set these to super_admin
-- if they have NULL tenant_id (the admin can fix this later)
UPDATE public.profiles 
SET role = 'super_admin' 
WHERE role != 'super_admin' AND tenant_id IS NULL;

-- Now let's create the security definer function
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

-- Drop any existing constraint that requires tenant_id for all users
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS tenant_id_not_null;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_tenant_id_check;

-- Add new smart constraint that allows super_admins to have NULL tenant_id
-- but requires tenant_id for all other roles
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_tenant_id_role_check 
CHECK (
  (role = 'super_admin' AND tenant_id IS NULL) OR 
  (role != 'super_admin' AND tenant_id IS NOT NULL)
);

-- Drop existing RLS policies on tenants table that might conflict
DROP POLICY IF EXISTS "Super admins can view all tenants" ON public.tenants;
DROP POLICY IF EXISTS "Users can view their own tenant" ON public.tenants;
DROP POLICY IF EXISTS "Super admins can create tenants" ON public.tenants;
DROP POLICY IF EXISTS "Super admins can update tenants" ON public.tenants;

-- Create updated RLS policies for tenants table
-- Super admins can view all tenants
CREATE POLICY "Super admins can view all tenants" 
  ON public.tenants 
  FOR SELECT 
  USING (public.get_user_role(auth.uid()) = 'super_admin');

-- Super admins can insert tenants
CREATE POLICY "Super admins can create tenants" 
  ON public.tenants 
  FOR INSERT 
  WITH CHECK (public.get_user_role(auth.uid()) = 'super_admin');

-- Super admins can update tenants
CREATE POLICY "Super admins can update tenants" 
  ON public.tenants 
  FOR UPDATE 
  USING (public.get_user_role(auth.uid()) = 'super_admin');

-- Tenant users can view their own tenant
CREATE POLICY "Users can view their own tenant" 
  ON public.tenants 
  FOR SELECT 
  USING (
    id IN (
      SELECT tenant_id FROM public.profiles 
      WHERE id = auth.uid()
    )
  );

-- Drop existing RLS policies on profiles table that might cause recursion
DROP POLICY IF EXISTS "Super admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can create profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create updated RLS policies for profiles table using the security definer function
-- Users can view their own profile
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (id = auth.uid());

-- Super admins can view all profiles
CREATE POLICY "Super admins can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (public.get_user_role(auth.uid()) = 'super_admin');

-- Super admins can insert profiles (for creating new users)
CREATE POLICY "Super admins can create profiles" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (public.get_user_role(auth.uid()) = 'super_admin');

-- Super admins can update profiles
CREATE POLICY "Super admins can update profiles" 
  ON public.profiles 
  FOR UPDATE 
  USING (public.get_user_role(auth.uid()) = 'super_admin');

-- Allow users to update their own profile (for basic info changes)
CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (id = auth.uid());
