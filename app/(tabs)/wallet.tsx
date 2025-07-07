import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, CreditCard, Smartphone, Building } from 'lucide-react-native';
import { mockWalletBalance, mockWalletTransactions } from '@/lib/mockData';
import { WalletTransaction } from '@/types';

export default function WalletScreen() {
  const topUpAmounts = [100, 200, 500, 1000, 2000, 5000];

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleTopUp = (amount: number) => {
    Alert.alert(
      'Top Up Wallet',
      `Add ₦${amount} to your wallet?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => handlePaymentMethod(amount) }
      ]
    );
  };

  const handlePaymentMethod = (amount: number) => {
    Alert.alert(
      'Payment Method',
      'Choose your preferred payment method:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Bank Transfer', onPress: () => processPayment(amount, 'Bank Transfer') },
        { text: 'Card Payment', onPress: () => processPayment(amount, 'Card Payment') },
        { text: 'USSD', onPress: () => processPayment(amount, 'USSD') }
      ]
    );
  };

  const processPayment = (amount: number, method: string) => {
    Alert.alert(
      'Payment Processing',
      `Processing ₦${amount} payment via ${method}...`,
      [{ text: 'OK' }]
    );
  };

  const renderTransaction = ({ item }: { item: WalletTransaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionIcon}>
        {item.type === 'credit' ? (
          <ArrowDownLeft size={20} color="#059669" strokeWidth={2} />
        ) : (
          <ArrowUpRight size={20} color="#DC2626" strokeWidth={2} />
        )}
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        <Text style={styles.transactionTime}>{formatTime(item.timestamp)}</Text>
      </View>
      <Text style={[
        styles.transactionAmount,
        { color: item.type === 'credit' ? '#059669' : '#DC2626' }
      ]}>
        {item.type === 'credit' ? '+' : '-'}₦{item.amount.toFixed(2)}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Wallet</Text>
          <Text style={styles.subtitle}>
            Manage your balance and transactions
          </Text>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Wallet size={24} color="#2563EB" strokeWidth={2} />
            <Text style={styles.balanceLabel}>Current Balance</Text>
          </View>
          <View style={styles.balanceAmount}>
            <Text style={styles.currency}>₦</Text>
            <Text style={styles.balance}>{mockWalletBalance.toFixed(2)}</Text>
          </View>
        </View>

        {/* Quick Top-up */}
        <View style={styles.topUpContainer}>
          <Text style={styles.sectionTitle}>Quick Top-up</Text>
          <View style={styles.topUpGrid}>
            {topUpAmounts.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={styles.topUpButton}
                onPress={() => handleTopUp(amount)}
              >
                <Text style={styles.topUpAmount}>₦{amount}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentMethodsContainer}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          <View style={styles.paymentMethods}>
            <TouchableOpacity style={styles.paymentMethod}>
              <CreditCard size={20} color="#2563EB" strokeWidth={2} />
              <Text style={styles.paymentMethodText}>Card Payment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.paymentMethod}>
              <Building size={20} color="#059669" strokeWidth={2} />
              <Text style={styles.paymentMethodText}>Bank Transfer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.paymentMethod}>
              <Smartphone size={20} color="#7C3AED" strokeWidth={2} />
              <Text style={styles.paymentMethodText}>USSD</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <FlatList
            data={mockWalletTransactions}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
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
  balanceCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  balanceAmount: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currency: {
    fontSize: 24,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: 'Inter-SemiBold',
    marginRight: 4,
  },
  balance: {
    fontSize: 36,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  topUpContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  topUpGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  topUpButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: '30%',
    alignItems: 'center',
  },
  topUpAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    fontFamily: 'Inter-SemiBold',
  },
  paymentMethodsContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  paymentMethods: {
    gap: 12,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  paymentMethodText: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Inter-Medium',
  },
  transactionsContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  transactionTime: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});