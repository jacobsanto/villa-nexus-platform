
-- Create Supabase Storage bucket for tenant logos
-- Note: This bucket should be created as PUBLIC to allow easy display of logos
-- without requiring signed URLs in the tenant applications
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tenant-logos',
  'tenant-logos', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
);

-- Create storage policy to allow public read access to tenant logos
CREATE POLICY "Public read access for tenant logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'tenant-logos');

-- Create storage policy to allow authenticated users to upload tenant logos
CREATE POLICY "Authenticated users can upload tenant logos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'tenant-logos' 
  AND auth.role() = 'authenticated'
);

-- Create storage policy to allow users to update tenant logos
CREATE POLICY "Authenticated users can update tenant logos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'tenant-logos' 
  AND auth.role() = 'authenticated'
);

-- Create storage policy to allow users to delete tenant logos
CREATE POLICY "Authenticated users can delete tenant logos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'tenant-logos' 
  AND auth.role() = 'authenticated'
);

-- Alter the tenants table to add comprehensive business and branding columns
ALTER TABLE public.tenants 
  -- Add business information columns
  ADD COLUMN IF NOT EXISTS contact_email TEXT,
  ADD COLUMN IF NOT EXISTS phone_number TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS website TEXT,
  ADD COLUMN IF NOT EXISTS vat_number TEXT,
  
  -- Add advanced branding columns
  ADD COLUMN IF NOT EXISTS brand_color_primary TEXT DEFAULT '#4f46e5',
  ADD COLUMN IF NOT EXISTS brand_color_secondary TEXT DEFAULT '#7c3aed',
  ADD COLUMN IF NOT EXISTS brand_color_background TEXT DEFAULT '#f9fafb',
  ADD COLUMN IF NOT EXISTS brand_color_text TEXT DEFAULT '#1f2937',
  ADD COLUMN IF NOT EXISTS brand_font_family TEXT DEFAULT 'Inter, sans-serif';

-- Update existing tenants to have the new default branding values
UPDATE public.tenants 
SET 
  brand_color_primary = COALESCE(brand_color_primary, '#4f46e5'),
  brand_color_secondary = COALESCE(brand_color_secondary, '#7c3aed'),
  brand_color_background = COALESCE(brand_color_background, '#f9fafb'),
  brand_color_text = COALESCE(brand_color_text, '#1f2937'),
  brand_font_family = COALESCE(brand_font_family, 'Inter, sans-serif');

-- Drop the old primary_color column if it exists (replace with brand_color_primary)
ALTER TABLE public.tenants DROP COLUMN IF EXISTS primary_color;

-- Drop any old branding JSONB column if it exists
ALTER TABLE public.tenants DROP COLUMN IF EXISTS branding;

-- Ensure logo_url column exists and is TEXT type
ALTER TABLE public.tenants 
  ALTER COLUMN logo_url TYPE TEXT;

-- Add helpful comments to the table columns
COMMENT ON COLUMN public.tenants.contact_email IS 'Primary contact email for the tenant organization';
COMMENT ON COLUMN public.tenants.phone_number IS 'Primary phone number for the tenant organization';
COMMENT ON COLUMN public.tenants.address IS 'Physical address of the tenant organization';
COMMENT ON COLUMN public.tenants.website IS 'Website URL of the tenant organization';
COMMENT ON COLUMN public.tenants.vat_number IS 'VAT/Tax identification number';
COMMENT ON COLUMN public.tenants.brand_color_primary IS 'Primary brand color (hex code)';
COMMENT ON COLUMN public.tenants.brand_color_secondary IS 'Secondary brand color (hex code)';
COMMENT ON COLUMN public.tenants.brand_color_background IS 'Background brand color (hex code)';
COMMENT ON COLUMN public.tenants.brand_color_text IS 'Text brand color (hex code)';
COMMENT ON COLUMN public.tenants.brand_font_family IS 'Primary font family for branding';
COMMENT ON COLUMN public.tenants.logo_url IS 'Path to logo file in tenant-logos storage bucket';
