import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform, I18nManager, Image } from 'react-native';
import SuccessModal from '../modals/SuccessModal';
import { getCurrentUser, clearUserSession, formatUserName } from './auth/AuthUtils';
import { addSampleNotifications } from '../utils/NotificationUtils';
import { getUserAffiliation, getUserBadge, clearAllAffiliations } from '../utils/AffiliationManager';

const Option = ({ icon, label, right, onPress }) => (
  <TouchableOpacity style={styles.optionRow} onPress={onPress} activeOpacity={0.7}>
    <Text style={styles.optionIcon}>{icon}</Text>
    <Text style={styles.optionLabel}>{label}</Text>
    {right && (
      typeof right === 'string' ? (
        <Text style={styles.optionRight}>{right}</Text>
      ) : (
        right
      )
    )}
  </TouchableOpacity>
);

const ProfileScreen = ({ navigation }) => {

  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [notificationCount, setNotificationCount] = useState(global.notifications?.length || 0);

  const currentUser = getCurrentUser();
  const isLoggedIn = !!currentUser;
  
  // Get affiliation information
  const getCurrentUserAffiliation = () => {
    if (!isLoggedIn || !currentUser) return null;
    return getUserAffiliation(currentUser.email);
  };
  
  const getCurrentUserBadge = () => {
    if (!isLoggedIn || !currentUser) return null;
    return getUserBadge(currentUser.email);
  };
  
  const affiliation = getCurrentUserAffiliation();
  const userBadge = getCurrentUserBadge();
  
  // Debug logging
  console.log('ProfileScreen Debug:', {
    isLoggedIn,
    currentUser: currentUser?.email,
    affiliation,
    userBadge
  });
  
  // Note: Affiliation is now purely manual - users must explicitly affiliate with organizations
  // No automatic affiliation creation
  
  // Note: Users start with no affiliations by default
  // Only show affiliations if they were explicitly created

  // Update notification count when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setNotificationCount(global.notifications?.length || 0);
    });

    return unsubscribe;
  }, [navigation]);

  const handleSellOption = (option) => {
    setSellModalVisible(false);
    console.log('Selected sell option:', option);
    // Handle different sell options here
  };

  const handleLogout = () => {
    clearUserSession();
    setSuccessModalVisible(true);
  };

  const handleSignIn = () => {
    navigation.navigate('SignInScreen', {
      returnScreen: 'ProfileScreen'
    });
  };

  const handleSignUp = () => {
    navigation.navigate('SignUpScreen');
  };



  return (
    <SafeAreaView style={[styles.safeArea, { direction: 'ltr' }]}>
      <View style={[styles.container, { direction: 'ltr' }]}>
        {/* iOS blue status bar area */}
        {Platform.OS === 'ios' && <SafeAreaView style={{ backgroundColor: '#900C3F' }} />}
        <View style={styles.headerGradient}>
          {isLoggedIn ? (
            <>
              <View style={styles.profileNameContainer}>
                <Text style={styles.profileName}>{formatUserName(currentUser)}</Text>
                {userBadge && (
                  <Image 
                    source={userBadge.type === 'organization' ? require('../assets/images/goldtick.png') : require('../assets/images/bluetick.png')}
                    style={styles.badgeIcon}
                  />
                )}
              </View>
              {affiliation && (
                <Text style={styles.affiliationText}>
                  Affiliated with {affiliation.organizationName}
                </Text>
              )}
              <TouchableOpacity style={styles.viewProfileBtn}>
                <Text style={styles.viewProfileText}>View Profile </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.profileName}>Guest User</Text>
              <View style={styles.authButtons}>
                <TouchableOpacity style={styles.signInBtn} onPress={handleSignIn}>
                  <Text style={styles.signInBtnText}>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.signUpBtn} onPress={handleSignUp}>
                  <Text style={styles.signUpBtnText}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
        <ScrollView contentContainerStyle={[styles.scrollContainer, { direction: 'ltr' }]} style={{ direction: 'ltr' }} showsVerticalScrollIndicator={false}>
          {/* Personal Section */}
          <Text style={styles.sectionTitle}>Personal</Text>
          <Option icon={'📄'} label="My Activity" right={'▼'} />
          <Option icon={'📄'} label="My Credits" />
          <Option icon={'🤍'} label="Alerts" right={'▼'} />
          <Option 
            icon={'🔔'} 
            label="Notifications" 
            right={notificationCount > 0 ? (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>{notificationCount}</Text>
              </View>
            ) : undefined} 
            onPress={() => navigation.navigate('NotificationScreen')} 
          />
          <Option icon={'⚙️'} label="Theme" />
          <Option icon={'🗂️'} label="Choose Language" />
          <Option icon={'🏢'} label="Affiliation & Badges" onPress={() => navigation.navigate('AffiliationScreen')} />
          {__DEV__ && (
            <Option icon={'🧪'} label="Add Test Notifications" onPress={() => {
              addSampleNotifications();
              // Force re-render to update notification count
              navigation.setParams({ refresh: Date.now() });
            }} />
          )}
          {__DEV__ && (
            <Option icon={'🧹'} label="Clear All Affiliations (Test)" onPress={() => {
              clearAllAffiliations();
              // Force re-render
              setTimeout(() => {
                navigation.setParams({ refresh: Date.now() });
              }, 100);
            }} />
          )}
          <View style={styles.sectionDivider} />
          {/* Products Section */}
          <Text style={styles.sectionTitle}>Products</Text>
          <Option icon={'🚗'} label="Sell My Car" />
          <Option icon={'🚗'} label="Buy Used Car" />
          <Option icon={'🚗'} label="Buy New Car" />
          {/* Authentication Section */}
          {isLoggedIn ? (
            <>
              <Text style={styles.sectionTitle}>Account</Text>
              <Option icon={'👤'} label="Edit Profile" />
              <Option icon={'🔒'} label="Change Password" />
              <Option icon={'📧'} label="Email Preferences" />
              <View style={styles.sectionDivider} />
              {/* Logout button */}
              <TouchableOpacity style={styles.logoutRow} activeOpacity={0.7} onPress={handleLogout}>
                <Text style={styles.logoutIcon}>🔓</Text>
                <Text style={styles.logoutLabel}>Logout</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.sectionTitle}>Account</Text>
              <Option icon={'🔐'} label="Sign In to your account" onPress={handleSignIn} />
              <Option icon={'📝'} label="Create new account" onPress={handleSignUp} />
              <View style={styles.sectionDivider} />
            </>
          )}
        </ScrollView>


      </View>
      


      {/* Success Modal */}
      <SuccessModal
        visible={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        title="Logged Out Successfully!"
        message="You have been logged out of your account."
        action="dismiss"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#900C3F', paddingBottom: 40, direction: 'ltr' },
  container: { flex: 1, backgroundColor: '#f9fafd', direction: 'ltr' },
  headerGradient: {
    backgroundColor: '#900C3F',
    paddingTop: 36,
    paddingBottom: 28,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  profileName: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  badgeIcon: {
    width: 24,
    height: 24,
    marginLeft: 8,
  },
  affiliationText: {
    color: '#dbeafe',
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  viewProfileBtn: {
    marginTop: 2,
  },
  viewProfileText: {
    color: '#dbeafe',
    fontSize: 16,
    fontWeight: '500',
  },
  arrow: {
    color: '#dbeafe',
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContainer: {
    paddingTop: 18,
    paddingHorizontal: 0,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 17,
    color: '#888',
    fontWeight: '600',
    marginLeft: 20,
    marginTop: 18,
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    direction: 'ltr',
  },
  optionIcon: {
    fontSize: 22,
    marginRight: 18,
    width: 28,
    textAlign: 'center',
  },
  optionLabel: {
    fontSize: 16,
    color: '#222',
    flex: 1,
    fontWeight: '500',
  },
  optionRight: {
    fontSize: 18,
    color: '#bbb',
    marginLeft: 8,
  },
  notificationBadge: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  notificationCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  sectionDivider: {
    height: 10,
    backgroundColor: '#f1f5f9',
    width: '100%',
    marginVertical: 10,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginTop: 18,
    marginBottom: 18,
    justifyContent: 'flex-start',
    direction: 'ltr',
  },
  logoutIcon: {
    fontSize: 22,
    marginRight: 18,
    width: 28,
    textAlign: 'center',
    color: '#e11d48',
  },
  logoutLabel: {
    fontSize: 16,
    color: '#e11d48',
    fontWeight: '700',
  },
  authButtons: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12,
    direction: 'ltr',
  },
  signInBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  signInBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  signUpBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  signUpBtnText: {
    color: '#900C3F',
    fontSize: 14,
    fontWeight: '600',
  },

});

export default ProfileScreen; 