-- Create new fields in auth.users table for username and PIN
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS pin_hash TEXT;

-- Create a new table for user credentials
CREATE TABLE IF NOT EXISTS public.user_credentials (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  pin_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for user_credentials
ALTER TABLE public.user_credentials ENABLE ROW LEVEL SECURITY;

-- Only allow users to see their own credentials
DROP POLICY IF EXISTS "Users can view own credentials" ON public.user_credentials;
CREATE POLICY "Users can view own credentials"
  ON public.user_credentials FOR SELECT
  USING (auth.uid() = id);

-- Only allow users to update their own credentials
DROP POLICY IF EXISTS "Users can update own credentials" ON public.user_credentials;
CREATE POLICY "Users can update own credentials"
  ON public.user_credentials FOR UPDATE
  USING (auth.uid() = id);

-- Only allow the service role to insert credentials
DROP POLICY IF EXISTS "Service role can insert credentials" ON public.user_credentials;
CREATE POLICY "Service role can insert credentials"
  ON public.user_credentials FOR INSERT
  WITH CHECK (true);

-- Update users table to make role immutable
COMMENT ON COLUMN public.users.role IS 'User role (vendor or client) - immutable after registration';

-- Add realtime for user_credentials
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_credentials;
