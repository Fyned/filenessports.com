-- =============================================
-- Wishlist (Favoriler) Tablosu
-- =============================================

CREATE TABLE IF NOT EXISTS wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- RLS politikaları
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Kullanıcı kendi favorilerini görebilir
CREATE POLICY "Users can view own wishlist" ON wishlist
FOR SELECT USING (auth.uid() = user_id);

-- Kullanıcı kendi favorilerine ekleyebilir
CREATE POLICY "Users can add to own wishlist" ON wishlist
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Kullanıcı kendi favorilerinden silebilir
CREATE POLICY "Users can remove from own wishlist" ON wishlist
FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- Customer Addresses (Müşteri Adresleri) Tablosu - Eğer yoksa
-- =============================================

CREATE TABLE IF NOT EXISTS customer_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL, -- "Ev", "İş", vs.
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  postal_code VARCHAR(10),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS politikaları
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;

-- Kullanıcı kendi adreslerini görebilir
CREATE POLICY "Users can view own addresses" ON customer_addresses
FOR SELECT USING (auth.uid() = user_id);

-- Kullanıcı kendi adreslerini ekleyebilir
CREATE POLICY "Users can add own addresses" ON customer_addresses
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Kullanıcı kendi adreslerini güncelleyebilir
CREATE POLICY "Users can update own addresses" ON customer_addresses
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Kullanıcı kendi adreslerini silebilir
CREATE POLICY "Users can delete own addresses" ON customer_addresses
FOR DELETE USING (auth.uid() = user_id);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_product_id ON wishlist(product_id);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_user_id ON customer_addresses(user_id);
