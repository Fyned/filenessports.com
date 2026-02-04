-- ============================================
-- Products ve Product Images RLS Politikaları
-- ============================================

-- Products tablosu için INSERT/UPDATE/DELETE politikaları
CREATE POLICY "Authenticated can insert products" ON products
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated can update products" ON products
FOR UPDATE TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated can delete products" ON products
FOR DELETE TO authenticated
USING (true);

-- Product Images tablosu için INSERT/UPDATE/DELETE politikaları
CREATE POLICY "Authenticated can insert product_images" ON product_images
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated can update product_images" ON product_images
FOR UPDATE TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated can delete product_images" ON product_images
FOR DELETE TO authenticated
USING (true);

-- Categories tablosu için INSERT/UPDATE/DELETE politikaları (eğer yoksa)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated can insert categories'
  ) THEN
    CREATE POLICY "Authenticated can insert categories" ON categories
    FOR INSERT TO authenticated WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated can update categories'
  ) THEN
    CREATE POLICY "Authenticated can update categories" ON categories
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated can delete categories'
  ) THEN
    CREATE POLICY "Authenticated can delete categories" ON categories
    FOR DELETE TO authenticated USING (true);
  END IF;
END $$;

-- Banners tablosu için INSERT/UPDATE/DELETE politikaları (eğer yoksa)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated can insert banners'
  ) THEN
    CREATE POLICY "Authenticated can insert banners" ON banners
    FOR INSERT TO authenticated WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated can update banners'
  ) THEN
    CREATE POLICY "Authenticated can update banners" ON banners
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated can delete banners'
  ) THEN
    CREATE POLICY "Authenticated can delete banners" ON banners
    FOR DELETE TO authenticated USING (true);
  END IF;
END $$;

-- Blog Posts tablosu için INSERT/UPDATE/DELETE politikaları (eğer yoksa)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated can insert blog_posts'
  ) THEN
    CREATE POLICY "Authenticated can insert blog_posts" ON blog_posts
    FOR INSERT TO authenticated WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated can update blog_posts'
  ) THEN
    CREATE POLICY "Authenticated can update blog_posts" ON blog_posts
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated can delete blog_posts'
  ) THEN
    CREATE POLICY "Authenticated can delete blog_posts" ON blog_posts
    FOR DELETE TO authenticated USING (true);
  END IF;
END $$;
