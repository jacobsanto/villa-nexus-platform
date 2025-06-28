
-- Create the reports table
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  report_type TEXT NOT NULL,
  filters JSONB
);

-- Create indexes for better query performance
CREATE INDEX idx_reports_tenant_id ON public.reports(tenant_id);
CREATE INDEX idx_reports_report_type ON public.reports(report_type);

-- Enable Row Level Security (RLS)
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view reports that belong to their tenant
CREATE POLICY "Users can view reports in their tenant" 
  ON public.reports 
  FOR SELECT 
  USING (
    tenant_id IN (
      SELECT tenant_id 
      FROM public.profiles 
      WHERE id = auth.uid()
    )
  );

-- RLS Policy: Users can create reports for their own tenant
CREATE POLICY "Users can create reports for their tenant" 
  ON public.reports 
  FOR INSERT 
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id 
      FROM public.profiles 
      WHERE id = auth.uid()
    )
    AND created_by = auth.uid()
  );

-- RLS Policy: Users can only update reports they created
CREATE POLICY "Users can update their own reports" 
  ON public.reports 
  FOR UPDATE 
  USING (created_by = auth.uid());

-- RLS Policy: Users can only delete reports they created
CREATE POLICY "Users can delete their own reports" 
  ON public.reports 
  FOR DELETE 
  USING (created_by = auth.uid());
