
-- Create integrations table to store supported PMS platforms
CREATE TABLE public.integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tenant_integrations table to link tenants with their chosen PMS
CREATE TABLE public.tenant_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  integration_id UUID NOT NULL REFERENCES public.integrations(id) ON DELETE CASCADE,
  api_credentials JSONB,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, integration_id)
);

-- Remove the guesty_api_key column from tenants table
ALTER TABLE public.tenants DROP COLUMN IF EXISTS guesty_api_key;

-- Create properties table with generic fields
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  integration_id UUID NOT NULL REFERENCES public.tenant_integrations(id) ON DELETE CASCADE,
  external_id TEXT NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  image_url TEXT,
  bedrooms INTEGER,
  bathrooms INTEGER,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  nightly_rate DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_tenant_integrations_tenant_id ON public.tenant_integrations(tenant_id);
CREATE INDEX idx_tenant_integrations_integration_id ON public.tenant_integrations(integration_id);
CREATE INDEX idx_properties_tenant_id ON public.properties(tenant_id);
CREATE INDEX idx_properties_integration_id ON public.properties(integration_id);
CREATE INDEX idx_properties_external_id ON public.properties(external_id);

-- Enable Row Level Security
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- RLS Policies for integrations table (publicly viewable)
CREATE POLICY "Integrations are viewable by everyone" 
  ON public.integrations 
  FOR SELECT 
  USING (true);

-- RLS Policies for tenant_integrations table
CREATE POLICY "Users can view their own tenant integrations" 
  ON public.tenant_integrations 
  FOR SELECT 
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.profiles 
      WHERE profiles.id = auth.uid()
    )
  );

CREATE POLICY "Tenant admins can manage tenant integrations" 
  ON public.tenant_integrations 
  FOR ALL 
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- RLS Policies for properties table
CREATE POLICY "Users can view their own tenant properties" 
  ON public.properties 
  FOR SELECT 
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.profiles 
      WHERE profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own tenant properties" 
  ON public.properties 
  FOR ALL 
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.profiles 
      WHERE profiles.id = auth.uid()
    )
  );

-- Insert sample integrations data
INSERT INTO public.integrations (name, logo_url, is_active) VALUES
  ('Guesty', 'https://example.com/guesty-logo.png', true),
  ('Hostaway', 'https://example.com/hostaway-logo.png', true),
  ('OwnerRez', 'https://example.com/ownerrez-logo.png', true),
  ('Airbnb', 'https://example.com/airbnb-logo.png', true),
  ('Booking.com', 'https://example.com/booking-logo.png', true);
