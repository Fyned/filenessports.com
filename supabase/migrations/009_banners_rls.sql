-- Banners RLS Policies
-- Banners herkes tarafından görülebilir olmalı (public)

-- Enable RLS if not already enabled
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public can view active banners" ON banners;
DROP POLICY IF EXISTS "Admins can manage banners" ON banners;

-- Public can view active banners
CREATE POLICY "Public can view active banners" ON banners
  FOR SELECT
  USING (is_active = true);

-- For admin operations, we use service role key in API routes
-- So no need for authenticated user policies here
