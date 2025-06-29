
-- Create function to get tenants with user count
CREATE OR REPLACE FUNCTION public.get_tenants_with_user_count()
RETURNS TABLE (
  id UUID,
  name TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  brand_color_primary TEXT,
  brand_color_secondary TEXT,
  brand_color_background TEXT,
  brand_color_text TEXT,
  brand_font_family TEXT,
  phone_number TEXT,
  logo_url TEXT,
  contact_email TEXT,
  address TEXT,
  website TEXT,
  vat_number TEXT,
  user_count BIGINT
)
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT 
    t.*,
    COALESCE(COUNT(p.id), 0) as user_count
  FROM public.tenants t
  LEFT JOIN public.profiles p ON t.id = p.tenant_id
  GROUP BY t.id
  ORDER BY t.created_at DESC;
$$;

-- Create secure function to delete tenant and all associated data
CREATE OR REPLACE FUNCTION public.delete_tenant(tenant_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_role TEXT;
  result JSON;
BEGIN
  -- Check if the current user has super_admin role
  SELECT role INTO current_user_role
  FROM public.profiles
  WHERE id = auth.uid();
  
  IF current_user_role != 'super_admin' THEN
    result := json_build_object(
      'success', false,
      'error', 'Unauthorized: Only super admins can delete tenants'
    );
    RETURN result;
  END IF;
  
  -- Check if tenant exists
  IF NOT EXISTS (SELECT 1 FROM public.tenants WHERE id = tenant_id) THEN
    result := json_build_object(
      'success', false,
      'error', 'Tenant not found'
    );
    RETURN result;
  END IF;
  
  -- Delete the tenant (CASCADE will handle all related data)
  DELETE FROM public.tenants WHERE id = tenant_id;
  
  result := json_build_object(
    'success', true,
    'message', 'Tenant and all associated data deleted successfully'
  );
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    result := json_build_object(
      'success', false,
      'error', SQLERRM
    );
    RETURN result;
END;
$$;
