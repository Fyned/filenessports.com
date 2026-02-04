-- ============================================
-- Kupon/İndirim Sistemi
-- ============================================

-- Kuponlar tablosu
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  max_discount_amount DECIMAL(10,2), -- Yüzdelik indirimlerde maksimum indirim tutarı
  max_uses INT, -- Toplam kullanım limiti (null = sınırsız)
  max_uses_per_user INT DEFAULT 1, -- Kullanıcı başına limit
  used_count INT DEFAULT 0,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  applies_to VARCHAR(20) DEFAULT 'all' CHECK (applies_to IN ('all', 'categories', 'products')),
  applicable_ids UUID[] DEFAULT '{}', -- Geçerli kategori veya ürün ID'leri
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kupon kullanım kayıtları
CREATE TABLE IF NOT EXISTS coupon_usages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  discount_amount DECIMAL(10,2) NOT NULL,
  used_at TIMESTAMPTZ DEFAULT NOW()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_coupon_usages_coupon ON coupon_usages(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usages_user ON coupon_usages(user_id);

-- RLS Politikaları
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usages ENABLE ROW LEVEL SECURITY;

-- Herkes aktif kuponları okuyabilir (doğrulama için)
CREATE POLICY "Anyone can read active coupons" ON coupons
FOR SELECT USING (is_active = true);

-- Authenticated kullanıcılar kupon yönetebilir (admin)
CREATE POLICY "Authenticated can manage coupons" ON coupons
FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

-- Kullanıcılar kendi kupon kullanımlarını görebilir
CREATE POLICY "Users can read own coupon usages" ON coupon_usages
FOR SELECT USING (user_id = auth.uid());

-- Sistem kupon kullanımı kaydedebilir
CREATE POLICY "System can insert coupon usages" ON coupon_usages
FOR INSERT TO authenticated
WITH CHECK (true);

-- updated_at trigger
CREATE OR REPLACE FUNCTION update_coupons_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_coupons_updated_at
BEFORE UPDATE ON coupons
FOR EACH ROW EXECUTE FUNCTION update_coupons_updated_at();

-- Orders tablosuna kupon alanı ekle (eğer yoksa)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_id UUID REFERENCES coupons(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_code VARCHAR(50);

-- Örnek kuponlar
INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, valid_until, is_active)
VALUES
  ('HOSGELDIN10', 'Yeni üyelere %10 indirim', 'percentage', 10, 100, NOW() + INTERVAL '1 year', true),
  ('YILBASI50', 'Yılbaşı indirimi 50 TL', 'fixed', 50, 200, '2026-01-15', true),
  ('KARGO', '500 TL ve üzeri alışverişlerde 30 TL indirim', 'fixed', 30, 500, NOW() + INTERVAL '6 months', true)
ON CONFLICT (code) DO NOTHING;
