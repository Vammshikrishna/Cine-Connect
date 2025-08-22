-- Add password field to profiles table for authentication
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Make password_hash required for new users
-- (existing users without passwords will need to set one)
