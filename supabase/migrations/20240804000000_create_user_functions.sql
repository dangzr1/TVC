-- Create function to create a user with password
CREATE OR REPLACE FUNCTION public.create_user_with_password(
  p_username TEXT,
  p_password TEXT,
  p_email TEXT,
  p_first_name TEXT,
  p_last_name TEXT,
  p_role TEXT DEFAULT 'client'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Insert the new user
  INSERT INTO public.users (
    id,
    username,
    password_hash,
    email,
    first_name,
    last_name,
    role,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    p_username,
    crypt(p_password, gen_salt('bf')),
    p_email,
    p_first_name,
    p_last_name,
    p_role,
    NOW(),
    NOW()
  )
  RETURNING id INTO new_user_id;
  
  RETURN new_user_id;
END;
$$;

-- Ensure users table has all required columns
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'client';

-- Enable realtime for users table
alter publication supabase_realtime add table public.users;