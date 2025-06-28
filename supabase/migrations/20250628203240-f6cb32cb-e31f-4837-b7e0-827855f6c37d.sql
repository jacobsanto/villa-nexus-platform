
-- Update the handle_new_tenant function to only create the tenant
-- Remove the auth.admin_create_user call since it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_new_tenant(
  company_name TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_tenant_id UUID;
  result JSON;
BEGIN
  -- Create new tenant
  INSERT INTO public.tenants (name, status)
  VALUES (company_name, 'active')
  RETURNING id INTO new_tenant_id;

  -- Return success result with tenant_id
  result := json_build_object(
    'success', true,
    'tenant_id', new_tenant_id
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
