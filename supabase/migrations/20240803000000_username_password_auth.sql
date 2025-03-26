-- Enable username and password authentication

-- Create auth function for username/password login
CREATE OR REPLACE FUNCTION public.handle_username_password_auth(username text, password text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id uuid;
  user_role text;
  result json;
BEGIN
  -- Check if the user exists and password matches
  SELECT id, role INTO user_id, user_role
  FROM public.users
  WHERE username = handle_username_password_auth.username
  AND password_hash = crypt(handle_username_password_auth.password, password_hash);
  
  IF user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Invalid username or password');
  END IF;
  
  -- Return user information
  RETURN json_build_object(
    'success', true,
    'user_id', user_id,
    'role', user_role
  );
END;
$$;

-- Ensure the users table has username and password_hash columns
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Add pgcrypto extension if not exists for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add a test user with username 'walkaway' and password 'Dn249118++'
INSERT INTO public.users (id, email, role, username, password_hash, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'walkaway@example.com', 'admin', 'walkaway', crypt('Dn249118++', gen_salt('bf')), NOW(), NOW())
ON CONFLICT (username) 
DO UPDATE SET 
  password_hash = crypt('Dn249118++', gen_salt('bf')),
  role = 'admin',
  updated_at = NOW();

-- Enable row level security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own data
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
CREATE POLICY "Users can view their own data"
ON public.users
FOR SELECT
USING (auth.uid() = id);

-- Create policy to allow users to update their own data
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
CREATE POLICY "Users can update their own data"
ON public.users
FOR UPDATE
USING (auth.uid() = id);

-- Create policy to allow admins to view all data
DROP POLICY IF EXISTS "Admins can view all data" ON public.users;
CREATE POLICY "Admins can view all data"
ON public.users
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create policy to allow admins to update all data
DROP POLICY IF EXISTS "Admins can update all data" ON public.users;
CREATE POLICY "Admins can update all data"
ON public.users
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Enable realtime for users table
alter publication supabase_realtime add table public.users;