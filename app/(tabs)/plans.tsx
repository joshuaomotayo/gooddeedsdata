import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PlanCard from '@/components/PlanCard';
import PaystackPayment from '@/components/PaystackPayment';
import { supabaseHelpers } from '@/lib/supabase';
import { DataPlan } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/types/database';

type DatabaseDataPlan = Database['public']['Tables']['data_plans']['Row'];

export default function PlansScreen() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<DataPlan | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [dataPlans, setDataPlans] = useState<DataPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDataPlans();
  }, []);

  const loadDataPlans = async () => {
    try {
      const plans = await supabaseHelpers.getDataPlans();
      
      // Convert database plans to app format
      const convertedPlans: DataPlan[] = plans.map((plan: DatabaseDataPlan) => ({
        id: plan.id,
        name: plan.name,
        type: plan.type,
        dataAmount: plan.data_amount,
        price: plan.price,
        validity: plan.validity_days,
        description: plan.description || '',
        features: plan.features || [],
        popular: plan.is_popular,
      }));

      setDataPlans(convertedPlans);
    } catch (error) {
      console.error('Error loading data plans:', error);
      Alert.alert('Error', 'Failed to load data plans. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan: DataPlan) => {
    setSelectedPlan(plan);
    
    if (plan.type === 'free') {
      Alert.alert(
        'Free Plan',
        'Free plan is only available for new users for the first 30 days. You can switch to this plan from your home screen if eligible.',
        [{ text: 'OK' }]
      );
    } else if (plan.type === 'payg') {
      Alert.alert(
        'Pay As You Go',
        'Switch to Pay As You Go mode from your home screen. Data will be charged at ₦0.20 per MB from your wallet balance.',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Purchase Data Bundle',
        `Purchase ${plan.name} for ₦${plan.price}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Buy Now', onPress: () => setShowPayment(true) }
        ]
      );
    }
  };

  const handlePaymentSuccess = async (amount: number, reference: string) => {
    if (!selectedPlan || !user) return;

    try {
      // Add wallet transaction for the purchase
      await supabaseHelpers.addWalletTransaction(
        user.id,
        'debit',
        selectedPlan.price,
        `${selectedPlan.name} purchase`,
        reference
      );

      // Update user plan
      const { error: updateError } = await supabase
        .from('user_plans')
        .update({
          plan_type: 'bundle',
          current_plan_id: selectedPlan.id,
          data_balance: selectedPlan.dataAmount,
          expiry_date: new Date(Date.now() + selectedPlan.validity * 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      Alert.alert(
        'Purchase Successful!',
        `${selectedPlan.name} has been activated. You now have ${(selectedPlan.dataAmount / 1024).toFixed(1)}GB of data.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error processing plan purchase:', error);
      Alert.alert('Error', 'Failed to activate plan. Please contact support.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading plans...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Plan</Text>
          <Text style={styles.subtitle}>
            Select the perfect data plan for your internet needs
          </Text>
        </View>

        <View style={styles.plansContainer}>
          {dataPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onSelect={handleSelectPlan}
              isSelected={selectedPlan?.id === plan.id}
            />
          ))}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Why Choose GoodDeeds Data?</Text>
          <View style={styles.infoList}>
            <Text style={styles.infoItem}>• High-speed cloud-powered internet</Text>
            <Text style={styles.infoItem}>• Secure VPN connection</Text>
            <Text style={styles.infoItem}>• Real-time usage monitoring</Text>
            <Text style={styles.infoItem}>• Flexible payment options with Paystack</Text>
            <Text style={styles.infoItem}>• Referral rewards program</Text>
            <Text style={styles.infoItem}>• Switchable plans anytime</Text>
            <Text style={styles.infoItem}>• 24/7 customer support</Text>
          </View>
        </View>
      </ScrollView>

      <PaystackPayment
        visible={showPayment}
        onClose={() => setShowPayment(false)}
        onSuccess={handlePaymentSuccess}
        userEmail={user?.email || ''}
        presetAmount={selectedPlan?.price}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
  },
  plansContainer: {
    paddingBottom: 20,
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  infoList: {
    gap: 8,
  },
  infoItem: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
});