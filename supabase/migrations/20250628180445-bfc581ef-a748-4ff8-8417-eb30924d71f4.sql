
-- Create inventory_items table
CREATE TABLE public.inventory_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  supplier TEXT,
  low_stock_threshold INTEGER,
  description TEXT,
  unit_of_measure TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create stock_levels table
CREATE TABLE public.stock_levels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
  location TEXT NOT NULL,
  current_quantity INTEGER NOT NULL DEFAULT 0,
  par_level INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, item_id, location)
);

-- Add Row Level Security (RLS) to ensure tenants can only see their own data
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_levels ENABLE ROW LEVEL SECURITY;

-- RLS policies for inventory_items
CREATE POLICY "Tenants can view their own inventory items" 
  ON public.inventory_items 
  FOR SELECT 
  USING (tenant_id IN (
    SELECT tenant_id FROM public.profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Tenants can create their own inventory items" 
  ON public.inventory_items 
  FOR INSERT 
  WITH CHECK (tenant_id IN (
    SELECT tenant_id FROM public.profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Tenants can update their own inventory items" 
  ON public.inventory_items 
  FOR UPDATE 
  USING (tenant_id IN (
    SELECT tenant_id FROM public.profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Tenants can delete their own inventory items" 
  ON public.inventory_items 
  FOR DELETE 
  USING (tenant_id IN (
    SELECT tenant_id FROM public.profiles WHERE id = auth.uid()
  ));

-- RLS policies for stock_levels
CREATE POLICY "Tenants can view their own stock levels" 
  ON public.stock_levels 
  FOR SELECT 
  USING (tenant_id IN (
    SELECT tenant_id FROM public.profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Tenants can create their own stock levels" 
  ON public.stock_levels 
  FOR INSERT 
  WITH CHECK (tenant_id IN (
    SELECT tenant_id FROM public.profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Tenants can update their own stock levels" 
  ON public.stock_levels 
  FOR UPDATE 
  USING (tenant_id IN (
    SELECT tenant_id FROM public.profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Tenants can delete their own stock levels" 
  ON public.stock_levels 
  FOR DELETE 
  USING (tenant_id IN (
    SELECT tenant_id FROM public.profiles WHERE id = auth.uid()
  ));

-- Create indexes for better performance
CREATE INDEX idx_inventory_items_tenant_id ON public.inventory_items(tenant_id);
CREATE INDEX idx_inventory_items_category ON public.inventory_items(category);
CREATE INDEX idx_stock_levels_tenant_id ON public.stock_levels(tenant_id);
CREATE INDEX idx_stock_levels_item_id ON public.stock_levels(item_id);
CREATE INDEX idx_stock_levels_location ON public.stock_levels(location);
