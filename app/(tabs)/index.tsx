import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ConnectionCard from '@/components/ConnectionCard';
import UsageCard from '@/components/UsageCard';
import WalletCard from '@/components/WalletCard';
import { mockVPNConnection, mockWalletBalance, mockUsageRecords } from '@/lib/mockData';
import { VPNConnection } from '@/types';

export default function HomeScreen() {
  const [connection, setConnection] = useState<VPNConnection>(mockVPNConnection);
  const [walletBalance] = useState(mockWalletBalance);

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

  const handleTopUp = () => {
    Alert.alert('Top Up Wallet', 'Redirecting to payment options...');
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning!</Text>
          <Text style={styles.subtitle}>Stay connected with GoodDeeds Data</Text>
        </View>

        <ConnectionCard 
          connection={connection} 
          onToggleConnection={handleToggleConnection}
        />

        <UsageCard
          todayUsage={todayUsage}
          totalUsage={totalUsage}
          dailyLimit={100} // Free plan daily limit
          cost={totalCost}
        />

        <WalletCard
          balance={walletBalance}
          onTopUp={handleTopUp}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Powered by cloud infrastructure for reliable internet access
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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