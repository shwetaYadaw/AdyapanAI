-- Fix Admin User Account
-- This SQL script will update the admin@adyapan.com account to ensure it can login

UPDATE "User"
SET 
  "isActive" = true,
  "isEmailVerified" = true,
  "isVerified" = true
WHERE email = 'admin@adyapan.com';

-- Verify the update
SELECT 
  id, 
  email, 
  "firstName", 
  "lastName",
  role,
  "isActive",
  "isEmailVerified",
  "isVerified"
FROM "User" 
WHERE email = 'admin@adyapan.com';
