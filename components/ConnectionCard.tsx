import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Wifi, WifiOff, MapPin, Clock, Activity } from 'lucide-react-native';
import { VPNConnection } from '@/types';

interface ConnectionCardProps {
  connection: VPNConnection;
  onToggleConnection: () => void;
}

export default function ConnectionCard({ connection, onToggleConnection }: ConnectionCardProps) {
  const { isConnected, serverLocation, ipAddress, connectionTime, speed } = connection;

  const formatConnectionTime = (time?: string) => {
    if (!time) return '00:00:00';
    const start = new Date(time);
    const now = new Date();
    const diff = Math.floor((now.getTime() - start.getTime()) / 1000);
    
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatSpeed = (speedMbps: number) => {
    if (speedMbps >= 1) {
      return `${speedMbps.toFixed(1)} Mbps`;
    }
    return `${(speedMbps * 1000).toFixed(0)} Kbps`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          {isConnected ? (
            <Wifi size={24} color="#059669" strokeWidth={2} />
          ) : (
            <WifiOff size={24} color="#DC2626" strokeWidth={2} />
          )}
          <Text style={[styles.statusText, { color: isConnected ? '#059669' : '#DC2626' }]}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.toggleButton, { backgroundColor: isConnected ? '#DC2626' : '#2563EB' }]}
          onPress={onToggleConnection}
        >
          <Text style={styles.toggleButtonText}>
            {isConnected ? 'Disconnect' : 'Connect'}
          </Text>
        </TouchableOpacity>
      </View>

      {isConnected && (
        <View style={styles.connectionDetails}>
          <View style={styles.detailRow}>
            <MapPin size={16} color="#6B7280" strokeWidth={2} />
            <Text style={styles.detailText}>{serverLocation}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>IP Address:</Text>
            <Text style={styles.detailValue}>{ipAddress}</Text>
          </View>
          <View style={styles.detailRow}>
            <Clock size={16} color="#6B7280" strokeWidth={2} />
            <Text style={styles.detailText}>{formatConnectionTime(connectionTime)}</Text>
          </View>
        </View>
      )}

      {isConnected && (
        <View style={styles.speedContainer}>
          <View style={styles.speedItem}>
            <Activity size={16} color="#2563EB" strokeWidth={2} />
            <Text style={styles.speedLabel}>Download</Text>
            <Text style={styles.speedValue}>{formatSpeed(speed.download)}</Text>
          </View>
          <View style={styles.speedDivider} />
          <View style={styles.speedItem}>
            <Activity size={16} color="#059669" strokeWidth={2} />
            <Text style={styles.speedLabel}>Upload</Text>
            <Text style={styles.speedValue}>{formatSpeed(speed.upload)}</Text>
          </View>
        </View>
      )}
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
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Nunito-SemiBold',
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  toggleButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Nunito-SemiBold',
  },
  connectionDetails: {
    gap: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Nunito-Regular',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Nunito-Regular',
  },
  detailValue: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    fontFamily: 'Nunito-Medium',
  },
  speedContainer: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  speedItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  speedDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  speedLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Nunito-Regular',
  },
  speedValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Nunito-SemiBold',
  },
});