-- Create admin user in Supabase

INSERT INTO users (
  id,
  email,
  username,
  password_hash,
  provider,
  role,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'admin@skillup.local',
  'admin',
  '$2b$12$1N4LdAmViAiyPV0sg/KjquU49UY/vhRVaCrGjLF1uQPAUWYyQ3zdq',
  'email',
  'admin',
  NOW(),
  NOW()
);
