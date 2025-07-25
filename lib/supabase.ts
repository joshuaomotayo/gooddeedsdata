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
      .eq('id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No profile found, return null
        return null;
      }
      throw error;
    }
    return data;
  },

  // Create user profile
  async createUserProfile(userId: string, email: string, name?: string) {
    // First check if profile already exists
    const existingProfile = await this.getUserProfile(userId);
    if (existingProfile) {
      return existingProfile;
    }

    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email,
        name: name || '',
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get user plan
  async getUserPlan(userId: string) {
    // First check if user plan exists, if not create it
    let { data, error } = await supabase
      .from('user_plans')
      .select(`
        *,
        current_plan:data_plans(*)
      `)
      .eq('user_id', userId)
      .single();
    
    if (error && error.code === 'PGRST116') {
      // No plan exists, create one
      await this.createUserPlan(userId);
      // Try again
      const result = await supabase
        .from('user_plans')
        .select(`
          *,
          current_plan:data_plans(*)
        `)
        .eq('user_id', userId)
        .single();
      
      data = result.data;
      error = result.error;
    }
    
    if (error) {
      console.error('Error fetching user plan:', error);
      return null;
    }
    return data;
  },

  // Create initial user plan (updated)
  async createUserPlan(userId: string) {
    // Check if plan already exists
    const { data, error } = await supabase
      .from('user_plans')
      .select(`
        *,
        current_plan:data_plans(*)
      `)
      .eq('user_id', userId)
      .single();
    
    if (!error) {
      // Plan already exists
      return data;
    }

    // Create new plan
    const { data: newPlan, error: createError } = await supabase
      .from('user_plans')
      .insert({
        user_id: userId,
        plan_type: 'free',
        data_balance: 3072, // 3GB free
        expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single();
    
    if (createError) throw createError;
    return newPlan;
  },

  // Get data plans
  async getDataPlans() {
    const { data, error } = await supabase
      .from('data_plans')
      .select('*')
      .eq('is_active', true)
      .order('price');
    
    if (error) throw error;
    return data || [];
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
    return data || [];
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
    return data || [];
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
    return data || [];
  },

  // Get referral data
  async getReferralData(userId: string) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('referral_code, referral_earnings')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.error('Error fetching referral profile:', profileError);
      return {
        code: 'LOADING...',
        totalReferrals: 0,
        totalEarnings: 0,
        pendingEarnings: 0
      };
    }

    const { data: referrals, error: referralsError } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', userId);
    
    if (referralsError) {
      console.error('Error fetching referrals:', referralsError);
    }

    return {
      code: profile.referral_code || 'LOADING...',
      totalReferrals: referrals?.length || 0,
      totalEarnings: referrals?.reduce((sum, ref) => sum + Number(ref.earnings_total), 0) || 0,
      pendingEarnings: Number(profile.referral_earnings) || 0
    };
  },

  // Update user profile
  async updateProfile(userId: string, updates: { name?: string; phone?: string }) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};