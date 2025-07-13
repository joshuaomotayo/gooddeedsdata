/*
  # Fix RLS Policies for App Access

  1. Security Updates
    - Add missing RLS policies for anonymous users to read data plans
    - Fix profile creation policies for new users
    - Ensure proper access controls for all tables

  2. Policy Changes
    - Allow anonymous users to read active data plans
    - Allow authenticated users to create their own profiles
    - Fix user plan access policies
*/

-- Drop existing policies that might be too restrictive
DROP POLICY IF EXISTS "Anyone can read active data plans" ON data_plans;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Data plans - allow everyone to read active plans (needed for plan selection)
CREATE POLICY "Public can read active data plans"
  ON data_plans
  FOR SELECT
  TO public
  USING (is_active = true);

-- Profiles - allow users to create and manage their own profiles
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- User plans - ensure proper access
DROP POLICY IF EXISTS "Users can read own plan" ON user_plans;
DROP POLICY IF EXISTS "Users can update own plan" ON user_plans;

CREATE POLICY "Users can insert own plan"
  ON user_plans
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read own plan"
  ON user_plans
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own plan"
  ON user_plans
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- VPN servers - allow authenticated users to read active servers
DROP POLICY IF EXISTS "Anyone can read active servers" ON vpn_servers;

CREATE POLICY "Authenticated users can read active servers"
  ON vpn_servers
  FOR SELECT
  TO authenticated
  USING (status = 'active');

-- Ensure all tables have RLS enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vpn_servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vpn_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;