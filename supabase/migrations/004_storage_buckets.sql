-- ============================================
-- Create Storage Buckets for Image Uploads
-- ============================================

-- Create products bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Create categories bucket for category images
INSERT INTO storage.buckets (id, name, public)
VALUES ('categories', 'categories', true)
ON CONFLICT (id) DO NOTHING;

-- Create banners bucket for banner images
INSERT INTO storage.buckets (id, name, public)
VALUES ('banners', 'banners', true)
ON CONFLICT (id) DO NOTHING;

-- Create blog bucket for blog post images
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog', 'blog', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Storage Policies
-- ============================================

-- Allow public read access to all buckets
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id IN ('products', 'categories', 'banners', 'blog'));

-- Allow authenticated users to upload to products bucket
CREATE POLICY "Authenticated users can upload products" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'products');

-- Allow authenticated users to upload to categories bucket
CREATE POLICY "Authenticated users can upload categories" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'categories');

-- Allow authenticated users to upload to banners bucket
CREATE POLICY "Authenticated users can upload banners" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'banners');

-- Allow authenticated users to upload to blog bucket
CREATE POLICY "Authenticated users can upload blog" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'blog');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id IN ('products', 'categories', 'banners', 'blog'));

-- ============================================
-- Create blog_posts table if not exists
-- ============================================

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for slug lookups
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, published_at);
