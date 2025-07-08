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
import { 
  mockVPNConnection, 
  mockWalletBalance, 
  mockUsageRecords, 
  mockUserPlan,
  mockReferralData 
} from '@/lib/mockData';
import { VPNConnection, UserPlan, ReferralData } from '@/types';

export default function HomeScreen() {
  const { user, loading } = useAuth();
  const [connection, setConnection] = useState<VPNConnection>(mockVPNConnection);
  const [walletBalance, setWalletBalance] = useState(mockWalletBalance);
  const [userPlan, setUserPlan] = useState<UserPlan>(mockUserPlan);
  const [referralData, setReferralData] = useState<ReferralData>(mockReferralData);
  const [showPayment, setShowPayment] = useState(false);
  const [showReferral, setShowReferral] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login');
    }
  }, [user, loading]);

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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return null;
  }

  // Calculate today's usage
  const today = new Date().toDateString();
  const todayUsage = mockUsageRecords
    .filter(record => new Date(record.timestamp).toDateString() === today)
    .reduce((total, record) => total + record.amount, 0);

  const totalUsage = mockUsageRecords.reduce((total, record) => total + record.amount, 0);
  const totalCost = mockUsageRecords.reduce((total, record) => total + (record.cost || 0), 0);

  const handleToggleConnection = () => {
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
      if (userPlan.planType === 'payg' && walletBalance < 1) {
        Alert.alert('Insufficient Balance', 'Please top up your wallet to use Pay As You Go.');
        return;
      }
      
      if (userPlan.planType !== 'payg' && userPlan.dataBalance <= 0) {
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

  const handlePlanChange = (planType: 'free' | 'payg' | 'bundle') => {
    if (planType === userPlan.planType) return;

    if (planType === 'free' && userPlan.planType !== 'free') {
      Alert.alert(
        'Cannot Switch to Free Plan',
        'Free plan is only available for new users for the first 30 days.'
      );
      return;
    }

    if (planType === 'payg') {
      // Pause current data if switching from bundle
      if (userPlan.planType === 'bundle' && userPlan.dataBalance > 0) {
        setUserPlan(prev => ({
          ...prev,
          planType: 'payg',
          pausedData: prev.dataBalance,
          dataBalance: 0,
        }));
        Alert.alert(
          'Switched to Pay As You Go',
          `Your ${(userPlan.dataBalance / 1024).toFixed(1)}GB data has been paused. You can switch back anytime to continue using it.`
        );
      } else {
        setUserPlan(prev => ({ ...prev, planType: 'payg' }));
        Alert.alert('Switched to Pay As You Go', 'Data usage will now be charged from your wallet balance.');
      }
    } else if (planType === 'bundle') {
      // Restore paused data if available
      if (userPlan.pausedData && userPlan.pausedData > 0) {
        setUserPlan(prev => ({
          ...prev,
          planType: 'bundle',
          dataBalance: prev.pausedData || 0,
          pausedData: 0,
        }));
        Alert.alert(
          'Switched to Data Bundle',
          `Your paused ${((userPlan.pausedData || 0) / 1024).toFixed(1)}GB data has been restored.`
        );
      } else {
        setUserPlan(prev => ({ ...prev, planType: 'bundle' }));
        router.push('/(tabs)/plans');
      }
    }
  };

  const handlePaymentSuccess = (amount: number, reference: string) => {
    setWalletBalance(prev => prev + amount);
    
    // Add 2% to referrer if user was referred
    if (user.referred_by) {
      const referralEarning = amount * 0.02;
      setReferralData(prev => ({
        ...prev,
        pendingEarnings: prev.pendingEarnings + referralEarning,
        totalEarnings: prev.totalEarnings + referralEarning,
      }));
    }
  };

  const handleUseReferralEarnings = () => {
    if (referralData.pendingEarnings > 0) {
      setWalletBalance(prev => prev + referralData.pendingEarnings);
      setReferralData(prev => ({
        ...prev,
        pendingEarnings: 0,
      }));
      Alert.alert(
        'Earnings Added!',
        `₦${referralData.pendingEarnings.toFixed(2)} has been added to your wallet balance.`
      );
    }
  };

  const handleBuyData = () => {
    router.push('/(tabs)/plans');
  };

  const handleRefer = () => {
    setShowReferral(!showReferral);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning!</Text>
          <Text style={styles.subtitle}>Stay connected with GoodDeeds Data</Text>
        </View>

        <PlanSwitcher 
          currentPlan={userPlan}
          onPlanChange={handlePlanChange}
        />

        <ConnectionCard 
          connection={connection} 
          onToggleConnection={handleToggleConnection}
        />

        <UsageCard
          todayUsage={todayUsage}
          totalUsage={totalUsage}
          dailyLimit={userPlan.planType === 'free' ? 100 : undefined}
          cost={totalCost}
          dataBalance={userPlan.dataBalance}
          planType={userPlan.planType}
        />

        <WalletCard
          balance={walletBalance}
          onTopUp={() => setShowPayment(true)}
          onBuyData={handleBuyData}
          onRefer={handleRefer}
        />

        {showReferral && (
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
    fontFamily: 'Inter-Regular',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
});