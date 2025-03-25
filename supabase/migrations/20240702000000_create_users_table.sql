-- Create users table for persistent user data storage
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT,
  first_name TEXT,
  last_name TEXT,
  company_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sign_in TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- Enable row level security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own data" ON users;
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own data" ON users;
CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Service role can manage all users" ON users;
CREATE POLICY "Service role can manage all users"
  ON users
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Add to realtime publication
alter publication supabase_realtime add table users;
