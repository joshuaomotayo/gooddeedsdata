import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Helper functions for common operations
export const supabaseHelpers = {
  // Get user profile
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId);
    
    if (error) throw error;
    return data && data.length > 0 ? data[0] : null;
  },

  // Get user plan
  async getUserPlan(userId: string) {
    const { data, error } = await supabase
      .from('user_plans')
      .select(`
        *,
        current_plan:data_plans(*)
      `)
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get data plans
  async getDataPlans() {
    const { data, error } = await supabase
      .from('data_plans')
      .select('*')
      .eq('is_active', true)
      .order('price');
    
    if (error) throw error;
    return data;
  },

  // Get usage records
  async getUsageRecords(userId: string, limit = 20) {
    const { data, error } = await supabase
      .from('usage_records')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  // Get wallet transactions
  async getWalletTransactions(userId: string, limit = 20) {
    const { data, error } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  // Add wallet transaction
  async addWalletTransaction(userId: string, type: 'credit' | 'debit', amount: number, description: string, reference?: string) {
    const { data, error } = await supabase
      .from('wallet_transactions')
      .insert({
        user_id: userId,
        type,
        amount,
        description,
        reference,
        status: 'completed'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Record data usage
  async recordDataUsage(userId: string, amount: number, activity: string, cost?: number) {
    const { data, error } = await supabase
      .from('usage_records')
      .insert({
        user_id: userId,
        amount,
        activity,
        cost: cost || 0
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get VPN servers
  async getVPNServers() {
    const { data, error } = await supabase
      .from('vpn_servers')
      .select('*')
      .eq('status', 'active')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  // Get referral data
  async getReferralData(userId: string) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('referral_code, referral_earnings')
      .eq('id', userId)
      .single();
    
    if (profileError) throw profileError;

    const { data: referrals, error: referralsError } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', userId);
    
    if (referralsError) throw referralsError;

    return {
      code: profile.referral_code,
      totalReferrals: referrals.length,
      totalEarnings: referrals.reduce((sum, ref) => sum + Number(ref.earnings_total), 0),
      pendingEarnings: Number(profile.referral_earnings)
    };
  }
};