
-- Create the bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  guest_name TEXT,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  number_of_guests SMALLINT DEFAULT 1,
  total_revenue NUMERIC(10,2),
  status TEXT NOT NULL DEFAULT 'confirmed',
  source TEXT DEFAULT 'Arivio',
  external_id TEXT
);

-- Create indexes for better query performance
CREATE INDEX idx_bookings_tenant_id ON public.bookings(tenant_id);
CREATE INDEX idx_bookings_property_id ON public.bookings(property_id);
CREATE INDEX idx_bookings_check_in_date ON public.bookings(check_in_date);
CREATE INDEX idx_bookings_check_out_date ON public.bookings(check_out_date);

-- Enable Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view bookings that belong to their tenant
CREATE POLICY "Users can view bookings in their tenant" 
  ON public.bookings 
  FOR SELECT 
  USING (
    tenant_id IN (
      SELECT tenant_id 
      FROM public.profiles 
      WHERE id = auth.uid()
    )
  );

-- RLS Policy: Users can insert bookings for their own tenant
CREATE POLICY "Users can create bookings for their tenant" 
  ON public.bookings 
  FOR INSERT 
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id 
      FROM public.profiles 
      WHERE id = auth.uid()
    )
  );

-- RLS Policy: Tenant admins can update bookings within their tenant
CREATE POLICY "Tenant admins can update bookings in their tenant" 
  ON public.bookings 
  FOR UPDATE 
  USING (
    tenant_id IN (
      SELECT tenant_id 
      FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- RLS Policy: Tenant admins can delete bookings within their tenant
CREATE POLICY "Tenant admins can delete bookings in their tenant" 
  ON public.bookings 
  FOR DELETE 
  USING (
    tenant_id IN (
      SELECT tenant_id 
      FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );
