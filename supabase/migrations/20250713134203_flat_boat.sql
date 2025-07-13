/*
  # Complete RLS Policy Configuration

  1. Security Setup
    - Enable RLS on all tables
    - Create comprehensive policies for all operations
    - Ensure proper access control for authenticated users

  2. Tables Covered
    - profiles: User profile management
    - user_plans: User data plan management  
    - data_plans: Public data plan access
    - usage_records: User usage tracking
    - wallet_transactions: User wallet operations
    - referrals: Referral system
    - vpn_servers: Public VPN server access
    - vpn_sessions: User VPN session management

  3. Policy Types
    - SELECT: Read access policies
    - INSERT: Create access policies  
    - UPDATE: Modify access policies
    - DELETE: Remove access policies (where needed)
*/

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE vpn_servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vpn_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

DROP POLICY IF EXISTS "Users can read own plan" ON user_plans;
DROP POLICY IF EXISTS "Users can insert own plan" ON user_plans;
DROP POLICY IF EXISTS "Users can update own plan" ON user_plans;

DROP POLICY IF EXISTS "Public can read active data plans" ON data_plans;

DROP POLICY IF EXISTS "Users can read own usage" ON usage_records;
DROP POLICY IF EXISTS "Users can insert own usage" ON usage_records;

DROP POLICY IF EXISTS "Users can read own transactions" ON wallet_transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON wallet_transactions;

DROP POLICY IF EXISTS "Users can read own referrals" ON referrals;

DROP POLICY IF EXISTS "Authenticated users can read active servers" ON vpn_servers;

DROP POLICY IF EXISTS "Users can read own sessions" ON vpn_sessions;
DROP POLICY IF EXISTS "Users can insert own sessions" ON vpn_sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON vpn_sessions;

-- PROFILES table policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- USER_PLANS table policies
CREATE POLICY "Users can read own plan"
  ON user_plans
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own plan"
  ON user_plans
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plan"
  ON user_plans
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DATA_PLANS table policies (public read access)
CREATE POLICY "Anyone can read active data plans"
  ON data_plans
  FOR SELECT
  TO public
  USING (is_active = true);

-- USAGE_RECORDS table policies
CREATE POLICY "Users can read own usage"
  ON usage_records
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage"
  ON usage_records
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- WALLET_TRANSACTIONS table policies
CREATE POLICY "Users can read own transactions"
  ON wallet_transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON wallet_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- REFERRALS table policies
CREATE POLICY "Users can read own referrals"
  ON referrals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Users can insert referrals"
  ON referrals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = referrer_id);

-- VPN_SERVERS table policies (public read access)
CREATE POLICY "Anyone can read active servers"
  ON vpn_servers
  FOR SELECT
  TO public
  USING (status = 'active');

-- VPN_SESSIONS table policies
CREATE POLICY "Users can read own sessions"
  ON vpn_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON vpn_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON vpn_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);