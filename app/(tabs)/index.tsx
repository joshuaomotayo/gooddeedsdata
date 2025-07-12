import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import ConnectionCard from '@/components/ConnectionCard';
import UsageCard from '@/components/UsageCard';
import WalletCard from '@/components/WalletCard';
import PlanSwitcher from '@/components/PlanSwitcher';
import ReferralCard from '@/components/ReferralCard';
import PaystackPayment from '@/components/PaystackPayment';
import { supabaseHelpers } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { VPNConnection, UserPlan, ReferralData } from '@/types';
import { Database } from '@/types/database';

type UserPlanData = Database['public']['Tables']['user_plans']['Row'] & {
  current_plan: Database['public']['Tables']['data_plans']['Row'] | null;
};

export default function HomeScreen() {
  const { user, profile, loading } = useAuth();
  const [connection, setConnection] = useState<VPNConnection>({
    isConnected: false,
    serverLocation: 'Lagos, Nigeria',
    ipAddress: '197.149.89.42',
    connectionTime: undefined,
    dataUsed: 0,
    speed: { download: 0, upload: 0 },
  });
  const [userPlan, setUserPlan] = useState<UserPlanData | null>(null);
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [usageRecords, setUsageRecords] = useState<any[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [showReferral, setShowReferral] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login');
    }
  }, [user, loading]);

  useEffect(() => {
    if (user && profile) {
      loadUserData();
    } else if (user && !profile && !loading) {
      // User exists but no profile, create one
      createUserProfileAndPlan();
    }
  }, [user, profile, loading]);

  const createUserProfileAndPlan = async () => {
    if (!user) return;

    try {
      // Create profile
      await supabaseHelpers.createUserProfile(
        user.id,
        user.email!,
        user.user_metadata?.name
      );
      
      // Create user plan
      await supabaseHelpers.createUserPlan(user.id);
      
      // Reload data
      await loadUserData();
    } catch (error) {
      console.error('Error creating user profile/plan:', error);
    }
  };

  // Simulate real-time updates when connected
  useEffect(() => {
    if (!connection.isConnected) return;

    const interval = setInterval(() => {
      setConnection(prev => ({
        ...prev,
        speed: {
          download: 20 + Math.random() * 15,
          upload: 8 + Math.random() * 10,
        },
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [connection.isConnected]);

  const loadUserData = async () => {
    if (!user) return;

    setDataLoading(true);
    try {
      // Load user plan
      const planData = await supabaseHelpers.getUserPlan(user.id);
      setUserPlan(planData);

      // Load usage records
      const usage = await supabaseHelpers.getUsageRecords(user.id, 10);
      setUsageRecords(usage);

      // Load referral data
      const referrals = await supabaseHelpers.getReferralData(user.id);
      setReferralData(referrals);
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load user data. Please try again.');
    } finally {
      setDataLoading(false);
    }
  };

  if (loading || dataLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user || !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Please log in to continue</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Calculate today's usage
  const today = new Date().toDateString();
  const todayUsage = usageRecords
    .filter(record => new Date(record.timestamp).toDateString() === today)
    .reduce((total, record) => total + record.amount, 0);

  const totalUsage = usageRecords.reduce((total, record) => total + record.amount, 0);
  const totalCost = usageRecords.reduce((total, record) => total + (record.cost || 0), 0);

  const handleToggleConnection = async () => {
    if (connection.isConnected) {
      // Disconnect
      setConnection(prev => ({
        ...prev,
        isConnected: false,
        connectionTime: undefined,
        dataUsed: 0,
        speed: { download: 0, upload: 0 },
      }));
      Alert.alert('Disconnected', 'You have been disconnected from GoodDeeds Data network.');
    } else {
      // Check if user has data or balance
      if (userPlan?.plan_type === 'payg' && profile.wallet_balance < 1) {
        Alert.alert('Insufficient Balance', 'Please top up your wallet to use Pay As You Go.');
        return;
      }
      
      if (userPlan?.plan_type !== 'payg' && (userPlan?.data_balance || 0) <= 0) {
        Alert.alert('No Data', 'Please buy a data bundle or switch to Pay As You Go.');
        return;
      }

      // Connect
      setConnection(prev => ({
        ...prev,
        isConnected: true,
        connectionTime: new Date().toISOString(),
        speed: { download: 25.4, upload: 12.8 },
      }));
      Alert.alert('Connected', 'Successfully connected to GoodDeeds Data network!');
    }
  };

  const handlePlanChange = async (planType: 'free' | 'payg' | 'bundle') => {
    if (!userPlan || planType === userPlan.plan_type) return;

    if (planType === 'free' && userPlan.plan_type !== 'free') {
      Alert.alert(
        'Cannot Switch to Free Plan',
        'Free plan is only available for new users for the first 30 days.'
      );
      return;
    }

    try {
      if (planType === 'payg') {
        // Switch to Pay As You Go
        const updates: any = { plan_type: 'payg' };
        
        if (userPlan.plan_type === 'bundle' && userPlan.data_balance > 0) {
          updates.paused_data = userPlan.data_balance;
          updates.data_balance = 0;
        }

        await supabase
          .from('user_plans')
          .update(updates)
          .eq('user_id', user.id);

        await loadUserData();
        Alert.alert('Switched to Pay As You Go', 'Data usage will now be charged from your wallet balance.');
      } else if (planType === 'bundle') {
        // Switch to bundle or restore paused data
        if (userPlan.paused_data && userPlan.paused_data > 0) {
          await supabase
            .from('user_plans')
            .update({
              plan_type: 'bundle',
              data_balance: userPlan.paused_data,
              paused_data: 0,
            })
            .eq('user_id', user.id);

          await loadUserData();
          Alert.alert('Switched to Data Bundle', 'Your paused data has been restored.');
        } else {
          router.push('/(tabs)/plans');
        }
      }
    } catch (error) {
      console.error('Error switching plan:', error);
      Alert.alert('Error', 'Failed to switch plan. Please try again.');
    }
  };

  const handlePaymentSuccess = async (amount: number, reference: string) => {
    try {
      // Add wallet transaction
      await supabaseHelpers.addWalletTransaction(
        user.id,
        'credit',
        amount,
        'Wallet top-up via Paystack',
        reference
      );

      // Reload user data to get updated balance
      await loadUserData();
      
      Alert.alert(
        'Payment Successful!',
        `₦${amount.toFixed(2)} has been added to your wallet.`
      );
    } catch (error) {
      console.error('Error processing payment:', error);
      Alert.alert('Error', 'Payment was successful but failed to update balance. Please contact support.');
    }
  };

  const handleUseReferralEarnings = async () => {
    if (!referralData || referralData.pendingEarnings <= 0) return;

    try {
      // Add referral earnings to wallet
      await supabaseHelpers.addWalletTransaction(
        user.id,
        'credit',
        referralData.pendingEarnings,
        'Referral earnings added to wallet'
      );

      // Reset referral earnings
      await supabase
        .from('profiles')
        .update({ referral_earnings: 0 })
        .eq('id', user.id);

      await loadUserData();
      
      Alert.alert(
        'Earnings Added!',
        `₦${referralData.pendingEarnings.toFixed(2)} has been added to your wallet balance.`
      );
    } catch (error) {
      console.error('Error using referral earnings:', error);
      Alert.alert('Error', 'Failed to add earnings to wallet. Please try again.');
    }
  };

  const handleBuyData = () => {
    router.push('/(tabs)/plans');
  };

  const handleRefer = () => {
    setShowReferral(!showReferral);
  };

  // Convert userPlan to legacy UserPlan format for components
  const legacyUserPlan: UserPlan = {
    id: userPlan?.id || '',
    userId: user.id,
    planType: userPlan?.plan_type || 'free',
    dataBalance: userPlan?.data_balance || 0,
    expiryDate: userPlan?.expiry_date || undefined,
    isActive: userPlan?.is_active || false,
    pausedData: userPlan?.paused_data || 0,
  };

  // Provide default values for profile if not loaded
  const safeProfile = profile || {
    wallet_balance: 0,
    referral_code: 'LOADING...',
    referral_earnings: 0,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning!</Text>
          <Text style={styles.subtitle}>Stay connected with GoodDeeds Data</Text>
        </View>

        <PlanSwitcher 
          currentPlan={legacyUserPlan}
          onPlanChange={handlePlanChange}
        />

        <ConnectionCard 
          connection={connection} 
          onToggleConnection={handleToggleConnection}
        />

        <UsageCard
          todayUsage={todayUsage}
          totalUsage={totalUsage}
          dailyLimit={userPlan?.plan_type === 'free' ? 100 : undefined}
          cost={totalCost}
          dataBalance={userPlan?.data_balance || 0}
          planType={userPlan?.plan_type || 'free'}
        />

        <WalletCard
          balance={safeProfile.wallet_balance}
          onTopUp={() => setShowPayment(true)}
          onBuyData={handleBuyData}
          onRefer={handleRefer}
        />

        {showReferral && referralData && (
          <ReferralCard
            referralData={referralData}
            onUseEarnings={handleUseReferralEarnings}
          />
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Powered by cloud infrastructure for reliable internet access
          </Text>
        </View>
      </ScrollView>

      <PaystackPayment
        visible={showPayment}
        onClose={() => setShowPayment(false)}
        onSuccess={handlePaymentSuccess}
        userEmail={user.email || ''}
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
    fontFamily: 'Nunito-Regular',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Nunito-Bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Nunito-Regular',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    fontFamily: 'Nunito-Regular',
  },
});