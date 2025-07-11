import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChartBar as BarChart3, TrendingUp, Database } from 'lucide-react-native';

interface UsageCardProps {
  todayUsage: number;
  totalUsage: number;
  dailyLimit?: number;
  cost: number;
  dataBalance: number;
  planType: 'free' | 'payg' | 'bundle';
}

export default function UsageCard({ 
  todayUsage, 
  totalUsage, 
  dailyLimit, 
  cost, 
  dataBalance,
  planType 
}: UsageCardProps) {
  const formatDataSize = (mb: number) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)} GB`;
    }
    return `${mb.toFixed(0)} MB`;
  };

  const usagePercentage = dailyLimit ? (todayUsage / dailyLimit) * 100 : 0;

  const getPlanStatusText = () => {
    switch (planType) {
      case 'free':
        return 'Free Plan Active';
      case 'payg':
        return 'Pay As You Go';
      case 'bundle':
        return 'Data Bundle Active';
      default:
        return '';
    }
  };

  const getPlanStatusColor = () => {
    switch (planType) {
      case 'free':
        return '#059669';
      case 'payg':
        return '#2563EB';
      case 'bundle':
        return '#7C3AED';
      default:
        return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BarChart3 size={24} color="#2563EB" strokeWidth={2} />
        <Text style={styles.title}>Data Usage</Text>
        <View style={[styles.planBadge, { backgroundColor: getPlanStatusColor() }]}>
          <Text style={styles.planBadgeText}>{getPlanStatusText()}</Text>
        </View>
      </View>

      {planType !== 'payg' && dataBalance > 0 && (
        <View style={styles.dataBalanceContainer}>
          <Database size={20} color="#7C3AED" strokeWidth={2} />
          <Text style={styles.dataBalanceText}>
            {formatDataSize(dataBalance)} remaining
          </Text>
        </View>
      )}

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatDataSize(todayUsage)}</Text>
          <Text style={styles.statLabel}>Today</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatDataSize(totalUsage)}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>₦{cost.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Cost</Text>
        </View>
      </View>

      {dailyLimit && planType === 'free' && (
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Daily Limit (Free Plan)</Text>
            <Text style={styles.progressText}>
              {formatDataSize(todayUsage)} / {formatDataSize(dailyLimit)}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${Math.min(usagePercentage, 100)}%`,
                  backgroundColor: usagePercentage > 90 ? '#DC2626' : usagePercentage > 70 ? '#F59E0B' : '#059669'
                }
              ]} 
            />
          </View>
          <Text style={[styles.percentageText, { color: usagePercentage > 90 ? '#DC2626' : '#6B7280' }]}>
            {usagePercentage.toFixed(0)}% used
          </Text>
        </View>
      )}

      <View style={styles.trendContainer}>
        <TrendingUp size={16} color="#059669" strokeWidth={2} />
        <Text style={styles.trendText}>12% less than yesterday</Text>
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
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Nunito-SemiBold',
    flex: 1,
  },
  planBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  planBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Nunito-SemiBold',
  },
  dataBalanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F3E8FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  dataBalanceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C3AED',
    fontFamily: 'Nunito-SemiBold',
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
    fontFamily: 'Nunito-Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Nunito-Regular',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Nunito-Medium',
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Nunito-Regular',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 12,
    textAlign: 'right',
    fontFamily: 'Nunito-Medium',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trendText: {
    fontSize: 12,
    color: '#059669',
    fontFamily: 'Nunito-Medium',
  },
});