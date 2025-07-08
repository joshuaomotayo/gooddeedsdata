export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  created_at: string;
  referral_code?: string;
  referred_by?: string;
  referral_earnings?: number;
}

export interface DataPlan {
  id: string;
  name: string;
  type: 'free' | 'payg' | 'bundle';
  dataAmount: number; // in MB
  price: number; // in Naira
  validity: number; // in days
  description: string;
  features: string[];
  popular?: boolean;
}

export interface UsageRecord {
  id: string;
  userId: string;
  amount: number; // in MB
  timestamp: string;
  activity: string;
  cost?: number;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  reference?: string;
}

export interface VPNConnection {
  isConnected: boolean;
  serverLocation: string;
  ipAddress: string;
  connectionTime?: string;
  dataUsed: number; // in MB
  speed: {
    download: number;
    upload: number;
  };
}

export interface UserStats {
  totalDataUsed: number; // in MB
  totalSpent: number; // in Naira
  sessionsCount: number;
  averageSessionDuration: number; // in minutes
}

export interface VPNStatus {
  connected: boolean;
  server_ip?: string;
  server_location?: string;
  connection_time?: number;
  data_used_session: number;
  upload_speed?: number;
  download_speed?: number;
}

export interface UserPlan {
  id: string;
  userId: string;
  planType: 'free' | 'payg' | 'bundle';
  currentPlan?: DataPlan;
  dataBalance: number; // in MB
  expiryDate?: string;
  isActive: boolean;
  pausedData?: number; // paused data when switching to PAYG
}

export interface ReferralData {
  code: string;
  totalReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
}

export interface PaystackResponse {
  status: boolean;
  message: string;
  data: {
    reference: string;
    trans: string;
    status: string;
    transaction: string;
    trxref: string;
  };
}