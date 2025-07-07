import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, SafeAreaView } from 'react-native';
import { ChartBar as BarChart3, Clock, Smartphone, TrendingUp } from 'lucide-react-native';
import { mockUsageRecords, mockUserStats } from '@/lib/mockData';
import { UsageRecord } from '@/types';

export default function UsageScreen() {
  const formatDataSize = (mb: number) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)} GB`;
    }
    return `${mb.toFixed(0)} MB`;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const renderUsageItem = ({ item }: { item: UsageRecord }) => (
    <View style={styles.usageItem}>
      <View style={styles.usageHeader}>
        <Text style={styles.usageActivity}>{item.activity}</Text>
        <Text style={styles.usageAmount}>{formatDataSize(item.amount)}</Text>
      </View>
      <View style={styles.usageFooter}>
        <Text style={styles.usageTime}>
          {formatDate(item.timestamp)} at {formatTime(item.timestamp)}
        </Text>
        {item.cost && (
          <Text style={styles.usageCost}>₦{item.cost.toFixed(2)}</Text>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Usage Analytics</Text>
          <Text style={styles.subtitle}>
            Track your data consumption and spending
          </Text>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <BarChart3 size={24} color="#2563EB" strokeWidth={2} />
            <Text style={styles.statValue}>{formatDataSize(mockUserStats.totalDataUsed)}</Text>
            <Text style={styles.statLabel}>Total Used</Text>
          </View>
          <View style={styles.statCard}>
            <TrendingUp size={24} color="#059669" strokeWidth={2} />
            <Text style={styles.statValue}>₦{mockUserStats.totalSpent.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Smartphone size={24} color="#7C3AED" strokeWidth={2} />
            <Text style={styles.statValue}>{mockUserStats.sessionsCount}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.statCard}>
            <Clock size={24} color="#F59E0B" strokeWidth={2} />
            <Text style={styles.statValue}>{mockUserStats.averageSessionDuration}m</Text>
            <Text style={styles.statLabel}>Avg. Session</Text>
          </View>
        </View>

        {/* Recent Usage */}
        <View style={styles.recentUsageContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <FlatList
            data={mockUsageRecords}
            renderItem={renderUsageItem}
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  recentUsageContainer: {
    backgroundColor: '#FFFFFF',
    margin: 20,
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
  usageItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  usageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  usageActivity: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    fontFamily: 'Inter-Medium',
    flex: 1,
  },
  usageAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
    fontFamily: 'Inter-SemiBold',
  },
  usageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  usageTime: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  usageCost: {
    fontSize: 12,
    color: '#059669',
    fontFamily: 'Inter-Medium',
  },
});