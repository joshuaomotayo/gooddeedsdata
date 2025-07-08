import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { Paystack } from 'react-native-paystack-webview';
import { X, CreditCard } from 'lucide-react-native';
import { PAYSTACK_PUBLIC_KEY, generatePaymentReference, formatAmountToKobo, verifyPayment } from '@/lib/paystack';
import { PaystackResponse } from '@/types';

interface PaystackPaymentProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (amount: number, reference: string) => void;
  userEmail: string;
  presetAmount?: number;
}

export default function PaystackPayment({ 
  visible, 
  onClose, 
  onSuccess, 
  userEmail,
  presetAmount 
}: PaystackPaymentProps) {
  const [amount, setAmount] = useState(presetAmount?.toString() || '');
  const [loading, setLoading] = useState(false);
  const [showPaystack, setShowPaystack] = useState(false);
  const [paymentReference, setPaymentReference] = useState('');

  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount.toString());
  };

  const handlePayment = () => {
    const numAmount = parseFloat(amount);
    
    if (!numAmount || numAmount < 100) {
      Alert.alert('Invalid Amount', 'Minimum amount is ₦100');
      return;
    }

    if (numAmount > 500000) {
      Alert.alert('Invalid Amount', 'Maximum amount is ₦500,000');
      return;
    }

    const reference = generatePaymentReference();
    setPaymentReference(reference);
    setShowPaystack(true);
  };

  const handlePaystackSuccess = async (response: PaystackResponse) => {
    setShowPaystack(false);
    setLoading(true);

    try {
      const isVerified = await verifyPayment(response.data.reference);
      
      if (isVerified) {
        const numAmount = parseFloat(amount);
        onSuccess(numAmount, response.data.reference);
        Alert.alert(
          'Payment Successful!', 
          `₦${numAmount.toFixed(2)} has been added to your wallet.`
        );
        onClose();
      } else {
        Alert.alert('Payment Failed', 'Payment verification failed. Please contact support.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while processing your payment.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaystackCancel = () => {
    setShowPaystack(false);
    Alert.alert('Payment Cancelled', 'Your payment was cancelled.');
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Top Up Wallet</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.label}>Enter Amount (₦)</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            keyboardType="numeric"
            maxLength={8}
          />

          <Text style={styles.quickAmountLabel}>Quick Amounts</Text>
          <View style={styles.quickAmountGrid}>
            {quickAmounts.map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                style={[
                  styles.quickAmountButton,
                  amount === quickAmount.toString() && styles.quickAmountButtonActive
                ]}
                onPress={() => handleAmountSelect(quickAmount)}
              >
                <Text style={[
                  styles.quickAmountText,
                  amount === quickAmount.toString() && styles.quickAmountTextActive
                ]}>
                  ₦{quickAmount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.paymentInfo}>
            <CreditCard size={20} color="#2563EB" strokeWidth={2} />
            <Text style={styles.paymentInfoText}>
              Secure payment powered by Paystack
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.payButton, loading && styles.payButtonDisabled]}
            onPress={handlePayment}
            disabled={loading || !amount}
          >
            <Text style={styles.payButtonText}>
              {loading ? 'Processing...' : `Pay ₦${amount || '0'}`}
            </Text>
          </TouchableOpacity>
        </View>

        {showPaystack && (
          <Paystack
            paystackKey={PAYSTACK_PUBLIC_KEY}
            amount={formatAmountToKobo(parseFloat(amount))}
            billingEmail={userEmail}
            currency="NGN"
            channels={['card', 'bank', 'ussd', 'qr', 'mobile_money']}
            refNumber={paymentReference}
            billingName="GoodDeeds Data User"
            onCancel={handlePaystackCancel}
            onSuccess={handlePaystackSuccess}
            autoStart={true}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  amountInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  quickAmountLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    fontFamily: 'Inter-Medium',
    marginBottom: 12,
  },
  quickAmountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  quickAmountButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: '30%',
    alignItems: 'center',
  },
  quickAmountButtonActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    fontFamily: 'Inter-SemiBold',
  },
  quickAmountTextActive: {
    color: '#2563EB',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  paymentInfoText: {
    fontSize: 12,
    color: '#2563EB',
    fontFamily: 'Inter-Medium',
  },
  payButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 'auto',
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
});