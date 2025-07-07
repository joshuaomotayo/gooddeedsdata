import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PlanCard from '@/components/PlanCard';
import { mockDataPlans } from '@/lib/mockData';
import { DataPlan } from '@/types';

export default function PlansScreen() {
  const [selectedPlan, setSelectedPlan] = useState<DataPlan | null>(null);

  const handleSelectPlan = (plan: DataPlan) => {
    setSelectedPlan(plan);
    
    if (plan.type === 'free') {
      Alert.alert(
        'Free Plan Selected',
        'You are now on the Free Daily plan with 100MB daily limit.',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Plan Selected',
        `You selected ${plan.name}. Proceed to payment?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Pay Now', onPress: () => handlePayment(plan) }
        ]
      );
    }
  };

  const handlePayment = (plan: DataPlan) => {
    Alert.alert(
      'Payment',
      `Processing payment of ₦${plan.price} for ${plan.name}...`,
      [{ text: 'OK' }]
    );
  };

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
          {mockDataPlans.map((plan) => (
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
            <Text style={styles.infoItem}>• Flexible payment options</Text>
            <Text style={styles.infoItem}>• 24/7 customer support</Text>
          </View>
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