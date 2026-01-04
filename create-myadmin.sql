-- Create myadmin admin account
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
  'myadmin@skillup.local',
  'myadmin',
  '$2b$12$FhpfGlzpwrI8NBttZ85NJekle5Lo4hdnpZMvUrVDfowZXWUMYoEcW',
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
  password_hash = '$2b$12$FhpfGlzpwrI8NBttZ85NJekle5Lo4hdnpZMvUrVDfowZXWUMYoEcW';

-- Verify
SELECT email, username, role FROM users WHERE username = 'myadmin';
