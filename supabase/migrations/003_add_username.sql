-- ============================================
-- Add username column to user_profiles
-- ============================================

-- Add username column
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- Create index for faster username lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);

-- Update existing admin user with username
UPDATE user_profiles
SET username = 'admin'
WHERE email = 'admin@fileatolyesi.com';

-- ============================================
-- Note: After running this migration, admin can login with:
-- Username: admin
-- Password: admin123
-- ============================================
