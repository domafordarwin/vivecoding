-- Create admin account for testing
-- Password: admin1234

INSERT INTO users (
  id,
  email,
  username,
  password_hash,
  provider,
  role,
  must_change_password,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'admin@skillup.local',
  'admin',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyVpLMjJqFhe',
  'email',
  'admin',
  false,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE 
SET 
  role = 'admin',
  must_change_password = false,
  password_hash = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyVpLMjJqFhe';

-- Verify admin account
SELECT email, username, role, must_change_password 
FROM users 
WHERE username = 'admin';
