import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Share, Users, Gift, Copy } from 'lucide-react-native';
import { ReferralData } from '@/types';
import { Platform } from 'react-native';

interface ReferralCardProps {
  referralData: ReferralData;
  onUseEarnings: () => void;
}

export default function ReferralCard({ referralData, onUseEarnings }: ReferralCardProps) {
  const [copying, setCopying] = useState(false);

  const handleShare = async () => {
    const shareMessage = `Join GoodDeeds Data with my referral code ${referralData.code} and get started with fast, reliable internet! Download the app and use my code to get bonus data. 🚀`;
    
    try {
      if (Platform.OS === 'web') {
        // Web fallback
        if (navigator.share) {
          await navigator.share({
            title: 'Join GoodDeeds Data',
            text: shareMessage,
            url: 'https://gooddeeds.app',
          });
        } else {
          // Copy to clipboard as fallback
          await navigator.clipboard.writeText(shareMessage);
          Alert.alert('Copied!', 'Referral message copied to clipboard');
        }
      } else {
        // Mobile sharing - use React Native's Share API
        const { Share: RNShare } = require('react-native');
        await RNShare.share({
          message: shareMessage,
          title: 'Join GoodDeeds Data',
        });
      }
    } catch (error) {
      console.log('Share cancelled or failed:', error);
    }
  };

  const handleCopyCode = async () => {
    setCopying(true);
    try {
      if (Platform.OS === 'web') {
        await navigator.clipboard.writeText(referralData.code);
        Alert.alert('Copied!', `Referral code ${referralData.code} copied to clipboard`);
      } else {
        // For mobile, use Expo Clipboard
        const { setStringAsync } = require('expo-clipboard');
        await setStringAsync(referralData.code);
        Alert.alert('Copied!', `Referral code ${referralData.code} copied to clipboard`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to copy referral code');
    } finally {
      setCopying(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Users size={24} color="#7C3AED" strokeWidth={2} />
        <Text style={styles.title}>Referral Program</Text>
      </View>

      <View style={styles.codeContainer}>
        <Text style={styles.codeLabel}>Your Referral Code</Text>
        <View style={styles.codeRow}>
          <Text style={styles.code}>{referralData.code}</Text>
          <TouchableOpacity 
            style={styles.copyButton} 
            onPress={handleCopyCode}
            disabled={copying}
          >
            <Copy size={16} color="#7C3AED" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{referralData.totalReferrals}</Text>
          <Text style={styles.statLabel}>Total Referrals</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>₦{referralData.totalEarnings.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Total Earnings</Text>
        </View>
      </View>

      {referralData.pendingEarnings > 0 && (
        <View style={styles.earningsContainer}>
          <View style={styles.earningsHeader}>
            <Gift size={20} color="#059669" strokeWidth={2} />
            <Text style={styles.earningsText}>
              ₦{referralData.pendingEarnings.toFixed(2)} available to use
            </Text>
          </View>
          <TouchableOpacity style={styles.useEarningsButton} onPress={onUseEarnings}>
            <Text style={styles.useEarningsText}>Use for Data</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        <Share size={20} color="#FFFFFF" strokeWidth={2} />
        <Text style={styles.shareButtonText}>Share Referral Code</Text>
      </TouchableOpacity>

      <Text style={styles.infoText}>
        Earn 2% of every deposit your referrals make for life! 
        Use earnings to buy data or pay-as-you-go charges.
      </Text>
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
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
  },
  codeContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  codeLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  code: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  copyButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  earningsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  earningsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  earningsText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#059669',
    fontFamily: 'Inter-Medium',
  },
  useEarningsButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  useEarningsText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  infoText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 16,
  },
});