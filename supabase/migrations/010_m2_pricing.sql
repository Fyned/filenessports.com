-- M² based pricing for custom-sized products (e.g. ceiling nets)
ALTER TABLE products ADD COLUMN is_m2_pricing BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN price_per_m2 DECIMAL(10,2);
ALTER TABLE products ADD COLUMN min_width_cm INTEGER DEFAULT 10;
ALTER TABLE products ADD COLUMN max_width_cm INTEGER DEFAULT 2000;
ALTER TABLE products ADD COLUMN min_height_cm INTEGER DEFAULT 10;
ALTER TABLE products ADD COLUMN max_height_cm INTEGER DEFAULT 2000;

-- Store custom dimensions on order items
ALTER TABLE order_items ADD COLUMN custom_dimensions JSONB;
