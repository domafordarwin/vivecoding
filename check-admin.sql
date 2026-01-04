-- Check if admin user exists and has correct role

SELECT 
  id,
  email,
  username,
  role,
  provider,
  created_at
FROM users
WHERE email = 'admin@skillup.local' OR username = 'admin';
