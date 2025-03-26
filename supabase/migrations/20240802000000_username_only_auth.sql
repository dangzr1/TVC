-- Create a new auth schema for username-only authentication
CREATE SCHEMA IF NOT EXISTS auth_custom;

-- Create a users table in the auth_custom schema
CREATE TABLE IF NOT EXISTS auth_custom.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  pin_hash TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Create a sessions table
CREATE TABLE IF NOT EXISTS auth_custom.sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth_custom.users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth_custom.users(id) ON DELETE CASCADE
);

-- Create a public users table that mirrors the auth_custom.users table
CREATE TABLE IF NOT EXISTS public.users_custom (
  id UUID PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sign_in TIMESTAMP WITH TIME ZONE,
  CONSTRAINT fk_auth_user FOREIGN KEY (id) REFERENCES auth_custom.users(id) ON DELETE CASCADE
);

-- Enable RLS on the users_custom table
ALTER TABLE public.users_custom ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow users to read their own data
CREATE POLICY "Users can read their own data"
  ON public.users_custom
  FOR SELECT
  USING (auth.uid() = id);

-- Create a policy to allow admins to read all data
CREATE POLICY "Admins can read all data"
  ON public.users_custom
  FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');
