
-- Create damage_reports table
CREATE TABLE public.damage_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  reported_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'reported' CHECK (status IN ('reported', 'assessed', 'resolved')),
  reported_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create damage_report_photos table
CREATE TABLE public.damage_report_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID NOT NULL REFERENCES public.damage_reports(id) ON DELETE CASCADE,
  photo_path TEXT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_damage_reports_tenant_id ON public.damage_reports(tenant_id);
CREATE INDEX idx_damage_reports_property_id ON public.damage_reports(property_id);
CREATE INDEX idx_damage_reports_status ON public.damage_reports(status);
CREATE INDEX idx_damage_report_photos_report_id ON public.damage_report_photos(report_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.damage_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.damage_report_photos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for damage_reports table
-- Users can view all reports within their tenant
CREATE POLICY "Users can view damage reports in their tenant" 
  ON public.damage_reports 
  FOR SELECT 
  USING (
    tenant_id IN (
      SELECT tenant_id 
      FROM public.profiles 
      WHERE id = auth.uid()
    )
  );

-- Any authenticated user within the tenant can create a new report
CREATE POLICY "Users can create damage reports for their tenant" 
  ON public.damage_reports 
  FOR INSERT 
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id 
      FROM public.profiles 
      WHERE id = auth.uid()
    )
    AND reported_by = auth.uid()
  );

-- Only admins can update the status of reports
CREATE POLICY "Admins can update damage reports in their tenant" 
  ON public.damage_reports 
  FOR UPDATE 
  USING (
    tenant_id IN (
      SELECT tenant_id 
      FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Only admins can delete reports
CREATE POLICY "Admins can delete damage reports in their tenant" 
  ON public.damage_reports 
  FOR DELETE 
  USING (
    tenant_id IN (
      SELECT tenant_id 
      FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- RLS Policies for damage_report_photos table
-- Users can view all photos linked to reports within their tenant
CREATE POLICY "Users can view damage report photos in their tenant" 
  ON public.damage_report_photos 
  FOR SELECT 
  USING (
    report_id IN (
      SELECT id 
      FROM public.damage_reports 
      WHERE tenant_id IN (
        SELECT tenant_id 
        FROM public.profiles 
        WHERE id = auth.uid()
      )
    )
  );

-- Users can upload photos to reports within their tenant
CREATE POLICY "Users can upload photos to damage reports in their tenant" 
  ON public.damage_report_photos 
  FOR INSERT 
  WITH CHECK (
    uploaded_by = auth.uid()
    AND report_id IN (
      SELECT id 
      FROM public.damage_reports 
      WHERE tenant_id IN (
        SELECT tenant_id 
        FROM public.profiles 
        WHERE id = auth.uid()
      )
    )
  );

-- Only the user who uploaded a photo can delete it
CREATE POLICY "Users can delete their own uploaded photos" 
  ON public.damage_report_photos 
  FOR DELETE 
  USING (uploaded_by = auth.uid());

-- Create Supabase Storage bucket for damage reports
INSERT INTO storage.buckets (id, name, public)
VALUES ('damage_reports', 'damage_reports', false);

-- Create storage policies for the damage_reports bucket
-- Allow authenticated users to upload photos
CREATE POLICY "Users can upload damage report photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'damage_reports' 
  AND auth.role() = 'authenticated'
);

-- Allow users to view photos from reports in their tenant
CREATE POLICY "Users can view damage report photos in their tenant"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'damage_reports'
  AND auth.role() = 'authenticated'
);

-- Allow users to delete their own uploaded photos
CREATE POLICY "Users can delete their own uploaded photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'damage_reports'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
