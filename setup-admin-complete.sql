-- ============================================
-- Admin 계정 생성 - 한 번에 실행하기
-- ============================================

-- Step 1: role 컬럼 추가 (이미 있어도 에러 안 남)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT false;

-- Step 2: Admin 계정 생성
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
)
ON CONFLICT (email) DO UPDATE 
SET role = 'admin',
    password_hash = '$2b$12$1N4LdAmViAiyPV0sg/KjquU49UY/vhRVaCrGjLF1uQPAUWYyQ3zdq';

-- Step 3: 확인
SELECT email, username, role, provider, created_at 
FROM users 
WHERE username = 'admin';
