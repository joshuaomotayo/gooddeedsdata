import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Wallet, Plus, Zap, Users } from 'lucide-react-native';

interface WalletCardProps {
  balance: number;
  onTopUp: () => void;
  onBuyData: () => void;
  onRefer: () => void;
}

export default function WalletCard({ balance, onTopUp, onBuyData, onRefer }: WalletCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Wallet size={24} color="#2563EB" strokeWidth={2} />
          <Text style={styles.title}>Wallet Balance</Text>
        </View>
        <TouchableOpacity style={styles.topUpButton} onPress={onTopUp}>
          <Plus size={16} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.topUpText}>Top Up</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.balanceContainer}>
        <Text style={styles.currency}>₦</Text>
        <Text style={styles.balance}>{balance.toFixed(2)}</Text>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton} onPress={onRefer}>
          <View style={[styles.actionIcon, { backgroundColor: '#F3E8FF' }]}>
            <Users size={16} color="#7C3AED" strokeWidth={2} />
          </View>
          <Text style={styles.actionText}>Refer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onBuyData}>
          <View style={[styles.actionIcon, { backgroundColor: '#FEF3C7' }]}>
            <Zap size={16} color="#F59E0B" strokeWidth={2} />
          </View>
          <Text style={styles.actionText}>Buy Data</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onTopUp}>
          <View style={[styles.actionIcon, { backgroundColor: '#EFF6FF' }]}>
            <Plus size={16} color="#2563EB" strokeWidth={2} />
          </View>
          <Text style={styles.actionText}>Top Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Nunito-SemiBold',
  },
  topUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  topUpText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Nunito-SemiBold',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  currency: {
    fontSize: 24,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: 'Nunito-SemiBold',
    marginRight: 4,
  },
  balance: {
    fontSize: 36,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Nunito-Bold',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    color: '#374151',
    fontFamily: 'Nunito-Medium',
  },
});