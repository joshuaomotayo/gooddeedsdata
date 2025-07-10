// Database constants for consistent UUID references
export const DATA_PLAN_IDS = {
  FREE: '550e8400-e29b-41d4-a716-446655440001',
  PAYG: '550e8400-e29b-41d4-a716-446655440002',
  BUNDLE_1GB: '550e8400-e29b-41d4-a716-446655440003',
  BUNDLE_5GB: '550e8400-e29b-41d4-a716-446655440004',
  BUNDLE_10GB: '550e8400-e29b-41d4-a716-446655440005',
} as const;

export const PLAN_TYPES = {
  FREE: 'free',
  PAYG: 'payg',
  BUNDLE: 'bundle',
} as const;

export const TRANSACTION_TYPES = {
  CREDIT: 'credit',
  DEBIT: 'debit',
} as const;

export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;