-- Create premium_subscriptions table
CREATE TABLE IF NOT EXISTS premium_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('top10', 'top50')),
  position INTEGER NOT NULL,
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'annual')),
  amount DECIMAL(10, 2) NOT NULL,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_cancelled BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create premium_positions table to track available/taken positions
CREATE TABLE IF NOT EXISTS premium_positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tier TEXT NOT NULL CHECK (tier IN ('top10', 'top50')),
  position INTEGER NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(tier, position)
);

-- Create payment_history table
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES premium_subscriptions(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('successful', 'pending', 'failed')),
  description TEXT NOT NULL,
  payment_method TEXT,
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create vendor_profiles table
CREATE TABLE IF NOT EXISTS vendor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  country TEXT DEFAULT 'USA',
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create analytics table to track vendor performance
CREATE TABLE IF NOT EXISTS vendor_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  profile_views INTEGER NOT NULL DEFAULT 0,
  clients_booked INTEGER NOT NULL DEFAULT 0,
  revenue DECIMAL(10, 2) NOT NULL DEFAULT 0,
  conversion_rate DECIMAL(5, 2) NOT NULL DEFAULT 0,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(vendor_id, date)
);

-- Initialize premium positions
DO $$
BEGIN
  -- Initialize Top 10 positions
  FOR i IN 1..10 LOOP
    -- Position 1 costs the most, decreasing as position number increases
    INSERT INTO premium_positions (tier, position, price)
    VALUES ('top10', i, 100 + (10 - i) * 10);
  END LOOP;
  
  -- Initialize Top 50 positions (11-50)
  FOR i IN 11..50 LOOP
    INSERT INTO premium_positions (tier, position, price)
    VALUES ('top50', i, 25);
  END LOOP;
END;
$$;

-- Create function to update premium_positions when subscription changes
CREATE OR REPLACE FUNCTION update_premium_position()
RETURNS TRIGGER AS $$
BEGIN
  -- If a new subscription is created, mark the position as unavailable
  IF TG_OP = 'INSERT' THEN
    UPDATE premium_positions
    SET is_available = FALSE, user_id = NEW.user_id, updated_at = NOW()
    WHERE tier = NEW.tier AND position = NEW.position;
  -- If a subscription is updated (e.g., expired), check if it's being deactivated
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.is_active = TRUE AND NEW.is_active = FALSE THEN
      UPDATE premium_positions
      SET is_available = TRUE, user_id = NULL, updated_at = NOW()
      WHERE tier = OLD.tier AND position = OLD.position;
    END IF;
    -- Note: We don't release the position when a subscription is cancelled but still active
  -- If a subscription is deleted, mark the position as available
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE premium_positions
    SET is_available = TRUE, user_id = NULL, updated_at = NOW()
    WHERE tier = OLD.tier AND position = OLD.position;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for premium_subscriptions
CREATE TRIGGER after_premium_subscription_change
AFTER INSERT OR UPDATE OR DELETE ON premium_subscriptions
FOR EACH ROW EXECUTE FUNCTION update_premium_position();

-- Create RLS policies
ALTER TABLE premium_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_analytics ENABLE ROW LEVEL SECURITY;

-- Premium subscriptions policies
CREATE POLICY "Users can view their own subscriptions"
ON premium_subscriptions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Premium positions policies
CREATE POLICY "Anyone can view premium positions"
ON premium_positions FOR SELECT
TO authenticated
USING (true);

-- Payment history policies
CREATE POLICY "Users can view their own payment history"
ON payment_history FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Vendor profiles policies
CREATE POLICY "Anyone can view vendor profiles"
ON vendor_profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update their own vendor profile"
ON vendor_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vendor profile"
ON vendor_profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Vendor analytics policies
CREATE POLICY "Users can view their own analytics"
ON vendor_analytics FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM vendor_profiles
  WHERE vendor_profiles.id = vendor_analytics.vendor_id
  AND vendor_profiles.user_id = auth.uid()
));
