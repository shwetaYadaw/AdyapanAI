-- Create admin user with password: admin123
-- Password hash: $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86.Khf5SH6K (admin123)
INSERT INTO "User" (id, email, password, "firstName", "lastName", role, "isActive", "createdAt", "updatedAt")
VALUES (
  'admin-001',
  'admin@adyapan.com',
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86.Khf5SH6K',
  'Admin',
  'User',
  'admin',
  true,
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;
