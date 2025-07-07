export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  createdAt: string;
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