import { DataPlan, UsageRecord, WalletTransaction, VPNConnection, UserStats, User, UserPlan, ReferralData } from '@/types';

export const mockUser: User = {
  id: '1',
  email: 'john.doe@example.com',
  name: 'John Doe',
  phone: '+234 801 234 5678',
  created_at: '2024-01-15T10:30:00Z',
  referral_code: 'JOHN2024',
  referral_earnings: 125.50,
};

export const mockUserPlan: UserPlan = {
  id: '1',
  userId: '1',
  planType: 'free',
  dataBalance: 2048, // 2GB remaining from 3GB free plan
  expiryDate: '2025-01-20T00:00:00Z', // 30 days from signup
  isActive: true,
};

export const mockReferralData: ReferralData = {
  code: 'JOHN2024',
  totalReferrals: 12,
  totalEarnings: 125.50,
  pendingEarnings: 25.00,
};

export const mockDataPlans: DataPlan[] = [
  {
    id: 'free',
    name: 'Free Starter',
    type: 'free',
    dataAmount: 3072, // 3GB
    price: 0,
    validity: 30,
    description: 'Perfect for getting started - 3GB free for 30 days',
    features: ['3GB data for 30 days', 'Basic speed', 'Standard support', 'One-time offer'],
  },
  {
    id: 'payg',
    name: 'Pay As You Go',
    type: 'payg',
    dataAmount: 0,
    price: 0.2,
    validity: 30,
    description: 'Flexible usage with per-MB billing from wallet balance',
    features: ['₦0.20 per MB', 'No daily limits', 'High-speed connection', 'Priority support'],
    popular: true,
  },
  {
    id: 'bundle-1gb',
    name: '1GB Bundle',
    type: 'bundle',
    dataAmount: 1024,
    price: 150,
    validity: 7,
    description: 'Great value for regular users',
    features: ['1GB data', '7 days validity', 'High-speed connection', 'Priority support'],
  },
  {
    id: 'bundle-5gb',
    name: '5GB Bundle',
    type: 'bundle',
    dataAmount: 5120,
    price: 650,
    validity: 30,
    description: 'Perfect for heavy users and streaming',
    features: ['5GB data', '30 days validity', 'Ultra-high speed', 'Premium support'],
  },
  {
    id: 'bundle-10gb',
    name: '10GB Bundle',
    type: 'bundle',
    dataAmount: 10240,
    price: 1200,
    validity: 30,
    description: 'Ultimate data package for power users',
    features: ['10GB data', '30 days validity', 'Ultra-high speed', 'Premium support', 'Priority network'],
  },
];

export const mockUsageRecords: UsageRecord[] = [
  {
    id: '1',
    userId: '1',
    amount: 45.2,
    timestamp: '2024-12-20T14:30:00Z',
    activity: 'YouTube streaming',
    cost: 9.04,
  },
  {
    id: '2',
    userId: '1',
    amount: 12.8,
    timestamp: '2024-12-20T13:15:00Z',
    activity: 'WhatsApp messaging',
    cost: 2.56,
  },
  {
    id: '3',
    userId: '1',
    amount: 78.5,
    timestamp: '2024-12-20T11:45:00Z',
    activity: 'Instagram browsing',
    cost: 15.70,
  },
  {
    id: '4',
    userId: '1',
    amount: 23.1,
    timestamp: '2024-12-20T10:20:00Z',
    activity: 'Google search',
    cost: 4.62,
  },
  {
    id: '5',
    userId: '1',
    amount: 156.3,
    timestamp: '2024-12-19T16:30:00Z',
    activity: 'Netflix streaming',
    cost: 31.26,
  },
];

export const mockWalletTransactions: WalletTransaction[] = [
  {
    id: '1',
    userId: '1',
    type: 'credit',
    amount: 500,
    description: 'Wallet top-up via Paystack',
    timestamp: '2024-12-20T09:00:00Z',
    status: 'completed',
    reference: 'gdd_1703059200000_123456',
  },
  {
    id: '2',
    userId: '1',
    type: 'debit',
    amount: 31.92,
    description: 'Data usage charges (PAYG)',
    timestamp: '2024-12-20T14:35:00Z',
    status: 'completed',
  },
  {
    id: '3',
    userId: '1',
    type: 'credit',
    amount: 25.00,
    description: 'Referral earnings from @jane_doe',
    timestamp: '2024-12-19T15:20:00Z',
    status: 'completed',
  },
  {
    id: '4',
    userId: '1',
    type: 'debit',
    amount: 150,
    description: '1GB Bundle purchase',
    timestamp: '2024-12-18T12:10:00Z',
    status: 'completed',
  },
];

export const mockVPNConnection: VPNConnection = {
  isConnected: false,
  serverLocation: 'Lagos, Nigeria',
  ipAddress: '197.149.89.42',
  connectionTime: undefined,
  dataUsed: 0,
  speed: {
    download: 0,
    upload: 0,
  },
};

export const mockUserStats: UserStats = {
  totalDataUsed: 2847.3,
  totalSpent: 1250.75,
  sessionsCount: 47,
  averageSessionDuration: 28,
};

export const mockWalletBalance = 468.08;