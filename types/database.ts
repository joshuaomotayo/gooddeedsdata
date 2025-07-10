export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          phone: string | null;
          referral_code: string;
          referred_by: string | null;
          referral_earnings: number;
          wallet_balance: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          phone?: string | null;
          referral_code?: string;
          referred_by?: string | null;
          referral_earnings?: number;
          wallet_balance?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          phone?: string | null;
          referral_code?: string;
          referred_by?: string | null;
          referral_earnings?: number;
          wallet_balance?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      data_plans: {
        Row: {
          id: string;
          name: string;
          type: 'free' | 'payg' | 'bundle';
          data_amount: number;
          price: number;
          validity_days: number;
          description: string | null;
          features: string[] | null;
          is_popular: boolean;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: 'free' | 'payg' | 'bundle';
          data_amount?: number;
          price?: number;
          validity_days?: number;
          description?: string | null;
          features?: string[] | null;
          is_popular?: boolean;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: 'free' | 'payg' | 'bundle';
          data_amount?: number;
          price?: number;
          validity_days?: number;
          description?: string | null;
          features?: string[] | null;
          is_popular?: boolean;
          is_active?: boolean;
          created_at?: string;
        };
      };
      user_plans: {
        Row: {
          id: string;
          user_id: string;
          plan_type: 'free' | 'payg' | 'bundle';
          current_plan_id: string | null;
          data_balance: number;
          paused_data: number;
          expiry_date: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_type?: 'free' | 'payg' | 'bundle';
          current_plan_id?: string | null;
          data_balance?: number;
          paused_data?: number;
          expiry_date?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_type?: 'free' | 'payg' | 'bundle';
          current_plan_id?: string | null;
          data_balance?: number;
          paused_data?: number;
          expiry_date?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      usage_records: {
        Row: {
          id: string;
          user_id: string;
          session_id: string | null;
          amount: number;
          activity: string;
          cost: number;
          server_id: string | null;
          timestamp: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_id?: string | null;
          amount: number;
          activity?: string;
          cost?: number;
          server_id?: string | null;
          timestamp?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_id?: string | null;
          amount?: number;
          activity?: string;
          cost?: number;
          server_id?: string | null;
          timestamp?: string;
        };
      };
      wallet_transactions: {
        Row: {
          id: string;
          user_id: string;
          type: 'credit' | 'debit';
          amount: number;
          description: string;
          reference: string | null;
          status: 'pending' | 'completed' | 'failed';
          metadata: Record<string, any> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'credit' | 'debit';
          amount: number;
          description: string;
          reference?: string | null;
          status?: 'pending' | 'completed' | 'failed';
          metadata?: Record<string, any> | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'credit' | 'debit';
          amount?: number;
          description?: string;
          reference?: string | null;
          status?: 'pending' | 'completed' | 'failed';
          metadata?: Record<string, any> | null;
          created_at?: string;
        };
      };
      vpn_servers: {
        Row: {
          id: string;
          name: string;
          location: string;
          ip_address: string;
          port: number;
          protocol: 'openvpn' | 'wireguard';
          config_template: string | null;
          max_connections: number;
          current_connections: number;
          status: 'active' | 'maintenance' | 'disabled';
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          location: string;
          ip_address: string;
          port?: number;
          protocol?: 'openvpn' | 'wireguard';
          config_template?: string | null;
          max_connections?: number;
          current_connections?: number;
          status?: 'active' | 'maintenance' | 'disabled';
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          location?: string;
          ip_address?: string;
          port?: number;
          protocol?: 'openvpn' | 'wireguard';
          config_template?: string | null;
          max_connections?: number;
          current_connections?: number;
          status?: 'active' | 'maintenance' | 'disabled';
          created_at?: string;
        };
      };
      vpn_sessions: {
        Row: {
          id: string;
          user_id: string;
          server_id: string;
          client_ip: string | null;
          connected_at: string;
          disconnected_at: string | null;
          data_used: number;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          server_id: string;
          client_ip?: string | null;
          connected_at?: string;
          disconnected_at?: string | null;
          data_used?: number;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          server_id?: string;
          client_ip?: string | null;
          connected_at?: string;
          disconnected_at?: string | null;
          data_used?: number;
          is_active?: boolean;
        };
      };
      referrals: {
        Row: {
          id: string;
          referrer_id: string;
          referred_id: string;
          earnings_total: number;
          last_earning_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          referrer_id: string;
          referred_id: string;
          earnings_total?: number;
          last_earning_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          referrer_id?: string;
          referred_id?: string;
          earnings_total?: number;
          last_earning_at?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}