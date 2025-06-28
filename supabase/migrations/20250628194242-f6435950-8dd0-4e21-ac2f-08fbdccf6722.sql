
-- First, drop ALL existing policies on profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view profiles in their own tenant" ON profiles;
DROP POLICY IF EXISTS "Tenants can view their own profiles" ON profiles;
DROP POLICY IF EXISTS "Users can create profiles for their tenant" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profiles" ON profiles;
DROP POLICY IF EXISTS "Users can delete their own profiles" ON profiles;

-- Drop ALL existing policies on tenants table
DROP POLICY IF EXISTS "Super admins can view all tenants" ON tenants;
DROP POLICY IF EXISTS "Users can view their own tenant" ON tenants;
DROP POLICY IF EXISTS "Tenants can view themselves" ON tenants;

-- Create new, secure policy that allows users to only read their own profile
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Fix Tenant RLS Policy: Allow super_admins to see all tenants
CREATE POLICY "Super admins can view all tenants"
ON tenants FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'super_admin'
  )
);

-- Allow regular users to view their own tenant
CREATE POLICY "Users can view their own tenant"
ON tenants FOR SELECT
USING (
  id IN (
    SELECT tenant_id FROM profiles 
    WHERE id = auth.uid()
  )
);

-- Create the critical handle_new_tenant function for atomic sign-up
CREATE OR REPLACE FUNCTION public.handle_new_tenant(
  company_name TEXT,
  user_email TEXT,
  user_password TEXT,
  user_full_name TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_tenant_id UUID;
  new_user_id UUID;
  result JSON;
BEGIN
  -- Create new tenant
  INSERT INTO public.tenants (name, status)
  VALUES (company_name, 'active')
  RETURNING id INTO new_tenant_id;

  -- Create new user using Admin API
  SELECT auth.admin_create_user(
    email := user_email,
    password := user_password,
    email_confirm := true,
    user_metadata := json_build_object(
      'full_name', user_full_name,
      'role', 'admin',
      'tenant_id', new_tenant_id::text
    )
  ) INTO new_user_id;

  -- Return success result
  result := json_build_object(
    'success', true,
    'tenant_id', new_tenant_id,
    'user_id', new_user_id
  );

  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    -- Return error result
    result := json_build_object(
      'success', false,
      'error', SQLERRM
    );
    RETURN result;
END;
$$;
