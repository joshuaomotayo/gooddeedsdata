import { DataPlan, UsageRecord, WalletTransaction, VPNConnection, UserStats, User } from '@/types';

export const mockUser: User = {
  id: '1',
  email: 'john.doe@example.com',
  name: 'John Doe',
  phone: '+234 801 234 5678',
  createdAt: '2024-01-15T10:30:00Z',
};

export const mockDataPlans: DataPlan[] = [
  {
    id: 'free',
    name: 'Free Daily',
    type: 'free',
    dataAmount: 100,
    price: 0,
    validity: 1,
    description: 'Perfect for light browsing and staying connected',
    features: ['100MB daily limit', 'Basic speed', 'Standard support'],
  },
  {
    id: 'payg',
    name: 'Pay As You Go',
    type: 'payg',
    dataAmount: 0,
    price: 0.2,
    validity: 30,
    description: 'Flexible usage with per-MB billing',
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
    description: 'Wallet top-up via bank transfer',
    timestamp: '2024-12-20T09:00:00Z',
    status: 'completed',
  },
  {
    id: '2',
    userId: '1',
    type: 'debit',
    amount: 31.92,
    description: 'Data usage charges',
    timestamp: '2024-12-20T14:35:00Z',
    status: 'completed',
  },
  {
    id: '3',
    userId: '1',
    type: 'credit',
    amount: 200,
    description: 'Wallet top-up via card',
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