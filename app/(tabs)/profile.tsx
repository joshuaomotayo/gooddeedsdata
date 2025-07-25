import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, TextInput, Modal, Switch, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { User, Settings, CircleHelp as HelpCircle, Shield, Bell, LogOut, ChevronRight, Mail, Phone, Calendar, CreditCard as Edit3, X } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedPhone, setEditedPhone] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState<boolean>(false);
  const [receivesMarketingEmails, setReceivesMarketingEmails] = useState<boolean>(false);
  const [receivesSessionAlerts, setReceivesSessionAlerts] = useState<boolean>(true);
  const [receivesPaymentNotifications, setReceivesPaymentNotifications] = useState<boolean>(true);

  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  const handleSaveProfile = () => {
    if (!user) return;
    
    // Update profile via Supabase
    supabaseHelpers.updateProfile(user.id, {
      name: editedName,
      phone: editedPhone,
    }).then(() => {
      Alert.alert('Profile Updated', 'Your profile has been updated successfully!');
      setShowEditProfile(false);
    }).catch((error) => {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    });
  };

  const handleMenuPress = (sectionTitle: string) => {
    if (expandedSection === sectionTitle) {
      setExpandedSection(null); // Collapse if already expanded
    } else {
      setExpandedSection(sectionTitle); // Expand the pressed section
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: async () => {
          try {
            await signOut();
            router.replace('/auth/login');
          } catch (error) {
            Alert.alert('Error', 'Failed to logout');
          }
        }}
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const menuItems = [
    {
      icon: Settings,
      title: 'Settings',
      subtitle: 'App preferences and configuration',
      onPress: () => handleMenuPress('Settings'),
    },
    {
      icon: Bell,
      title: 'Notifications',
      subtitle: 'Manage your notification preferences',
      onPress: () => handleMenuPress('Notifications'),
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      subtitle: 'Control your privacy settings',
      onPress: () => handleMenuPress('Privacy & Security'),
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      onPress: () => handleMenuPress('Help & Support'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>
            Manage your account and preferences
          </Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Edit3 size={12} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user?.name || user?.email || 'User'}</Text>
            
            <View style={styles.contactInfo}>
              <View style={styles.contactItem}>
                <Mail size={16} color="#6B7280" strokeWidth={2} />
                <Text style={styles.contactText}>{user?.email}</Text>
              </View>
              
              {user?.phone ? (
                <View style={styles.contactItem}>
                  <Phone size={16} color="#6B7280" strokeWidth={2} />
                  <Text style={styles.contactText}>{user.phone}</Text>
                </View>
              ) : null}
              
              <View style={styles.contactItem}>
                <Calendar size={16} color="#6B7280" strokeWidth={2} />
                <Text style={styles.contactText}>
                  Member since {user?.created_at ? formatDate(user.created_at) : 'Recently'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Account Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>47</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>2.8GB</Text>
            <Text style={styles.statLabel}>Data Used</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>₦1,251</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuIcon}>
                <item.icon size={20} color="#2563EB" strokeWidth={2} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" strokeWidth={2} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Expanded Section Content */}
        {expandedSection === 'Settings' && (
          <View style={styles.expandedContent}>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Enable Dark Mode</Text>
              <Switch
                value={isDarkModeEnabled}
                onValueChange={setIsDarkModeEnabled}
              />
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Receive Marketing Emails</Text>
              <Switch
                value={receivesMarketingEmails}
                onValueChange={setReceivesMarketingEmails}
              />
            </View>
          </View>
        )}
        {expandedSection === 'Notifications' && (
          <View style={styles.expandedContent}>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>New Session Alerts</Text>
              <Switch
                value={receivesSessionAlerts}
                onValueChange={setReceivesSessionAlerts}
              />
            </View>
             <View style={styles.settingItem}>
 <Text style={styles.settingLabel}>Payment Notifications</Text>
              <Switch
                value={false} // Placeholder value
                onValueChange={() => {}} // Placeholder handler
              />
            </View>
          </View>
        )}
        {expandedSection === 'Privacy & Security' && (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.expandedContent}
          >
            <Text style={styles.sectionTitle}>Change Password</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Current Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your current password"
                secureTextEntry
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your new password"
                secureTextEntry
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm your new password"
                secureTextEntry
              />
            </View>
            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Change Password</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        )}
        {expandedSection === 'Privacy & Security' && (
          // Note: There was a duplicate Privacy & Security section rendering.
          // This second block is being removed to prevent that.
          // If you intended to have different content here, please clarify.
          null
        )}
        {expandedSection === 'Help & Support' && (
          <View style={styles.expandedContent}>
            <Text style={styles.sectionTitle}>Get in Touch</Text>
            <TouchableOpacity style={styles.helpSupportButton}>
              <Text style={styles.helpButtonText}>Visit Help Center</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.helpSupportButton}>
              <Text style={styles.helpButtonText}>Email Support</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.helpSupportButton}>
              <Text style={styles.helpButtonText}>WhatsApp Support</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#DC2626" strokeWidth={2} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>GoodDeeds Data v1.0.0</Text>
          <Text style={styles.footerText}>© 2024 GoodDeeds Technologies</Text>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={showEditProfile} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={() => setShowEditProfile(false)}>
              <X size={24} color="#6B7280" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={editedName}
                onChangeText={setEditedName}
                placeholder="Enter your full name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={editedPhone}
                onChangeText={setEditedPhone}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  profileCard: {
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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  profileInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  contactInfo: {
    gap: 8,
    alignItems: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  statsContainer: {
    flexDirection: 'row',
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
    fontSize: 20,
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
  menuContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    fontFamily: 'Inter-SemiBold',
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'Inter-Regular',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    fontFamily: 'Inter-Regular',
  },
  saveButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 'auto',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
  expandedContent: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
 },
 helpSupportButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10, // Added spacing between buttons
    marginHorizontal: 20, // Added horizontal margin for consistency
    },

 privacyText: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Inter-Regular',
    marginBottom: 15,
  },
  managePermissionsButton: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  contactInfoText: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
 },
 settingItem: {
 flexDirection: 'row',
 alignItems: 'center',
 justifyContent: 'space-between',
 paddingVertical: 10,
 borderBottomWidth: 1,
 borderBottomColor: '#F3F4F6',
  },
  settingLabel: {
    fontSize: 16,
    color: '#111827',
    fontFamily: 'Inter-Regular',
  },
  togglePlaceholder: {
    width: 40,
    height: 20,
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 15,
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  contactOptionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    fontFamily: 'Inter-Medium',
  },
  contactOptionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  whatsappIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#25D366', // WhatsApp green color
    justifyContent: 'center',
    alignItems: 'center',
  },
  whatsappIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  helpButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
 },
});