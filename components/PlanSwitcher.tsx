import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Zap, CreditCard, Gift } from 'lucide-react-native';
import { UserPlan } from '@/types';

interface PlanSwitcherProps {
  currentPlan: UserPlan;
  onPlanChange: (planType: 'free' | 'payg' | 'bundle') => void;
}

export default function PlanSwitcher({ currentPlan, onPlanChange }: PlanSwitcherProps) {
  const planOptions = [
    {
      type: 'free' as const,
      name: 'Free',
      icon: Gift,
      color: '#059669',
      description: '3GB for 30 days',
    },
    {
      type: 'payg' as const,
      name: 'Pay As You Go',
      icon: CreditCard,
      color: '#2563EB',
      description: '₦0.20 per MB',
    },
    {
      type: 'bundle' as const,
      name: 'Data Bundle',
      icon: Zap,
      color: '#7C3AED',
      description: 'Fixed packages',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Data Plan Mode</Text>
      <View style={styles.switcherContainer}>
        {planOptions.map((option) => {
          const isActive = currentPlan.planType === option.type;
          const IconComponent = option.icon;
          
          return (
            <TouchableOpacity
              key={option.type}
              style={[
                styles.planOption,
                isActive && { backgroundColor: option.color, borderColor: option.color }
              ]}
              onPress={() => onPlanChange(option.type)}
            >
              <IconComponent 
                size={20} 
                color={isActive ? '#FFFFFF' : option.color} 
                strokeWidth={2} 
              />
              <Text style={[
                styles.planName,
                { color: isActive ? '#FFFFFF' : '#374151' }
              ]}>
                {option.name}
              </Text>
              <Text style={[
                styles.planDescription,
                { color: isActive ? '#FFFFFF' : '#6B7280' }
              ]}>
                {option.description}
              </Text>
            </TouchableOpacity>
          );
        })}
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  switcherContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  planOption: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  planName: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    marginTop: 4,
    textAlign: 'center',
  },
  planDescription: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
    textAlign: 'center',
  },
});