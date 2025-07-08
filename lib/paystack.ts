import { PaystackResponse } from '@/types';

export const PAYSTACK_PUBLIC_KEY = 'pk_test_f954b9063cf3323e1a1edde8ccda7d35fa1652c1';

export interface PaystackPaymentData {
  email: string;
  amount: number; // in kobo (multiply by 100)
  reference?: string;
  currency?: string;
  channels?: string[];
  metadata?: {
    custom_fields?: Array<{
      display_name: string;
      variable_name: string;
      value: string;
    }>;
  };
}

export const generatePaymentReference = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `gdd_${timestamp}_${random}`;
};

export const verifyPayment = async (reference: string): Promise<boolean> => {
  try {
    // In a real app, this would call your backend to verify with Paystack
    // For now, we'll simulate verification
    console.log('Verifying payment with reference:', reference);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For demo purposes, assume all payments are successful
    return true;
  } catch (error) {
    console.error('Payment verification failed:', error);
    return false;
  }
};

export const formatAmountToKobo = (amount: number): number => {
  return Math.round(amount * 100);
};

export const formatAmountFromKobo = (amount: number): number => {
  return amount / 100;
};