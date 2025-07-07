import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check, Star } from 'lucide-react-native';
import { DataPlan } from '@/types';

interface PlanCardProps {
  plan: DataPlan;
  onSelect: (plan: DataPlan) => void;
  isSelected?: boolean;
}

export default function PlanCard({ plan, onSelect, isSelected = false }: PlanCardProps) {
  const formatDataAmount = (mb: number) => {
    if (mb === 0) return 'Unlimited';
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(0)}GB`;
    }
    return `${mb}MB`;
  };

  const formatPrice = () => {
    if (plan.type === 'free') return 'Free';
    if (plan.type === 'payg') return `₦${plan.price}/MB`;
    return `₦${plan.price}`;
  };

  const getPlanColor = () => {
    switch (plan.type) {
      case 'free': return '#059669';
      case 'payg': return '#2563EB';
      case 'bundle': return '#7C3AED';
      default: return '#6B7280';
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        isSelected && styles.selectedContainer,
        plan.popular && styles.popularContainer
      ]} 
      onPress={() => onSelect(plan)}
    >
      {plan.popular && (
        <View style={styles.popularBadge}>
          <Star size={12} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.popularText}>Popular</Text>
        </View>
      )}

      <View style={styles.header}>
        <Text style={styles.planName}>{plan.name}</Text>
        <View style={[styles.typeIndicator, { backgroundColor: getPlanColor() }]} />
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.price}>{formatPrice()}</Text>
        {plan.type !== 'free' && plan.type !== 'payg' && (
          <Text style={styles.validity}>Valid for {plan.validity} days</Text>
        )}
      </View>

      <Text style={styles.dataAmount}>{formatDataAmount(plan.dataAmount)}</Text>
      <Text style={styles.description}>{plan.description}</Text>

      <View style={styles.features}>
        {plan.features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Check size={16} color="#059669" strokeWidth={2} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity 
        style={[
          styles.selectButton, 
          { backgroundColor: isSelected ? getPlanColor() : '#F3F4F6' }
        ]}
        onPress={() => onSelect(plan)}
      >
        <Text style={[
          styles.selectButtonText, 
          { color: isSelected ? '#FFFFFF' : '#374151' }
        ]}>
          {isSelected ? 'Selected' : 'Select Plan'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedContainer: {
    borderColor: '#2563EB',
  },
  popularContainer: {
    borderColor: '#F59E0B',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: 20,
    backgroundColor: '#F59E0B',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  typeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  priceContainer: {
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  validity: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  dataAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
    lineHeight: 20,
  },
  features: {
    gap: 8,
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Inter-Regular',
    flex: 1,
  },
  selectButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});