/*
  # Complete GoodDeeds Data Schema Setup

  1. New Tables
    - `profiles` - User profiles with referral system
    - `data_plans` - Available data plans (Free, PAYG, Bundle)
    - `user_plans` - User's current plan and data balance
    - `usage_records` - Data usage tracking
    - `wallet_transactions` - Payment and transaction history
    - `vpn_servers` - VPN server management
    - `vpn_sessions` - Active VPN connections
    - `referrals` - Referral tracking and earnings

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Public read access for active data plans and servers

  3. Automation
    - Auto-create profile and free plan on user signup
    - Auto-update wallet balance on transactions
    - Auto-calculate referral earnings (2% of deposits)
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  referral_code TEXT UNIQUE DEFAULT CONCAT('GDD', UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 6))),
  referred_by UUID REFERENCES profiles(id),
  referral_earnings DECIMAL(10,2) DEFAULT 0.00,
  wallet_balance DECIMAL(10,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Data plans table
CREATE TABLE IF NOT EXISTS data_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('free', 'payg', 'bundle')),
  data_amount INTEGER NOT NULL DEFAULT 0, -- in MB
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  validity_days INTEGER NOT NULL DEFAULT 30,
  description TEXT,
  features JSONB DEFAULT '[]',
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User plans table
CREATE TABLE IF NOT EXISTS user_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('free', 'payg', 'bundle')) DEFAULT 'free',
  current_plan_id UUID REFERENCES data_plans(id),
  data_balance INTEGER DEFAULT 3072, -- 3GB for free plan
  paused_data INTEGER DEFAULT 0,
  expiry_date TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Usage records table
CREATE TABLE IF NOT EXISTS usage_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  session_id UUID,
  amount DECIMAL(10,2) NOT NULL, -- in MB
  activity TEXT DEFAULT 'Internet browsing',
  cost DECIMAL(10,2) DEFAULT 0.00,
  server_id UUID,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wallet transactions table
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  reference TEXT UNIQUE,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- VPN servers table
CREATE TABLE IF NOT EXISTS vpn_servers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  ip_address INET NOT NULL,
  port INTEGER DEFAULT 1194,
  protocol TEXT DEFAULT 'openvpn' CHECK (protocol IN ('openvpn', 'wireguard')),
  config_template TEXT,
  max_connections INTEGER DEFAULT 100,
  current_connections INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'disabled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- VPN sessions table
CREATE TABLE IF NOT EXISTS vpn_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  server_id UUID REFERENCES vpn_servers(id) NOT NULL,
  client_ip INET,
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  disconnected_at TIMESTAMP WITH TIME ZONE,
  data_used INTEGER DEFAULT 0, -- in MB
  is_active BOOLEAN DEFAULT true
);

-- Referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  referred_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  earnings_total DECIMAL(10,2) DEFAULT 0.00,
  last_earning_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(referred_id)
);

-- Insert default data plans with proper UUIDs
INSERT INTO data_plans (id, name, type, data_amount, price, validity_days, description, features, is_popular) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Free Starter', 'free', 3072, 0.00, 30, 'Perfect for getting started - 3GB free for 30 days', '["3GB data for 30 days", "Basic speed", "Standard support", "One-time offer"]', false),
  ('550e8400-e29b-41d4-a716-446655440002', 'Pay As You Go', 'payg', 0, 0.20, 30, 'Flexible usage with per-MB billing from wallet balance', '["₦0.20 per MB", "No daily limits", "High-speed connection", "Priority support"]', true),
  ('550e8400-e29b-41d4-a716-446655440003', '1GB Bundle', 'bundle', 1024, 150.00, 7, 'Great value for regular users', '["1GB data", "7 days validity", "High-speed connection", "Priority support"]', false),
  ('550e8400-e29b-41d4-a716-446655440004', '5GB Bundle', 'bundle', 5120, 650.00, 30, 'Perfect for heavy users and streaming', '["5GB data", "30 days validity", "Ultra-high speed", "Premium support"]', false),
  ('550e8400-e29b-41d4-a716-446655440005', '10GB Bundle', 'bundle', 10240, 1200.00, 30, 'Ultimate data package for power users', '["10GB data", "30 days validity", "Ultra-high speed", "Premium support", "Priority network"]', false);

-- Insert default VPN server
INSERT INTO vpn_servers (name, location, ip_address, port, status) VALUES
  ('Lagos Server 1', 'Lagos, Nigeria', '197.149.89.42', 1194, 'active');

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vpn_servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vpn_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Data plans policies (public read)
CREATE POLICY "Anyone can read active data plans"
  ON data_plans FOR SELECT
  TO authenticated
  USING (is_active = true);

-- User plans policies
CREATE POLICY "Users can read own plan"
  ON user_plans FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own plan"
  ON user_plans FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Usage records policies
CREATE POLICY "Users can read own usage"
  ON usage_records FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own usage"
  ON usage_records FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Wallet transactions policies
CREATE POLICY "Users can read own transactions"
  ON wallet_transactions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own transactions"
  ON wallet_transactions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- VPN servers policies (public read for active servers)
CREATE POLICY "Anyone can read active servers"
  ON vpn_servers FOR SELECT
  TO authenticated
  USING (status = 'active');

-- VPN sessions policies
CREATE POLICY "Users can read own sessions"
  ON vpn_sessions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own sessions"
  ON vpn_sessions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own sessions"
  ON vpn_sessions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Referrals policies
CREATE POLICY "Users can read own referrals"
  ON referrals FOR SELECT
  TO authenticated
  USING (referrer_id = auth.uid() OR referred_id = auth.uid());

-- Functions and Triggers

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', ''));
  
  -- Create initial user plan (free) - using the free plan UUID
  INSERT INTO user_plans (user_id, plan_type, current_plan_id)
  VALUES (NEW.id, 'free', '550e8400-e29b-41d4-a716-446655440001');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE OR REPLACE TRIGGER create_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_for_user();

-- Function to update wallet balance
CREATE OR REPLACE FUNCTION update_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'credit' THEN
    UPDATE profiles 
    SET wallet_balance = wallet_balance + NEW.amount
    WHERE id = NEW.user_id;
  ELSIF NEW.type = 'debit' THEN
    UPDATE profiles 
    SET wallet_balance = wallet_balance - NEW.amount
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update wallet balance on transaction
CREATE OR REPLACE TRIGGER update_wallet_trigger
  AFTER INSERT ON wallet_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_wallet_balance();

-- Function to handle referral earnings
CREATE OR REPLACE FUNCTION handle_referral_earning()
RETURNS TRIGGER AS $$
DECLARE
  referrer_id UUID;
  earning_amount DECIMAL(10,2);
BEGIN
  -- Only process credit transactions (deposits)
  IF NEW.type = 'credit' AND NEW.description LIKE '%top-up%' THEN
    -- Find referrer
    SELECT referred_by INTO referrer_id
    FROM profiles
    WHERE id = NEW.user_id AND referred_by IS NOT NULL;
    
    IF referrer_id IS NOT NULL THEN
      -- Calculate 2% earning
      earning_amount := NEW.amount * 0.02;
      
      -- Add to referrer's earnings
      UPDATE profiles
      SET referral_earnings = referral_earnings + earning_amount
      WHERE id = referrer_id;
      
      -- Update referrals table
      UPDATE referrals
      SET earnings_total = earnings_total + earning_amount,
          last_earning_at = NOW()
      WHERE referrer_id = referrer_id AND referred_id = NEW.user_id;
      
      -- Create earning transaction for referrer
      INSERT INTO wallet_transactions (user_id, type, amount, description, reference)
      VALUES (referrer_id, 'credit', earning_amount, 'Referral earning from ' || NEW.user_id, 'ref_' || NEW.id);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for referral earnings
CREATE OR REPLACE TRIGGER referral_earning_trigger
  AFTER INSERT ON wallet_transactions
  FOR EACH ROW
  EXECUTE FUNCTION handle_referral_earning();