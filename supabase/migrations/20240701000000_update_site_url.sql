-- Update the site URL in auth.identities
-- This will make the OAuth flow display a more professional URL

-- First, set the site URL in the auth.config table
UPDATE auth.config
SET site_url = 'https://thevendorsconnect.com'
WHERE site_url IS NULL OR site_url = '';

-- You can also set a redirect URL if needed
UPDATE auth.config
SET redirect_urls = ARRAY['https://thevendorsconnect.com', 'https://www.thevendorsconnect.com', 'http://localhost:5173']::text[]
WHERE redirect_urls IS NULL OR redirect_urls = '{}'::text[];
