import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform, I18nManager } from 'react-native';
import SellModal from '../modals/SellModal';
import AuthModal from '../modals/AuthModal';
import SuccessModal from '../modals/SuccessModal';
import { isUserLoggedIn, getCurrentUser, clearUserSession, formatUserName } from './auth/AuthUtils';
import { addSampleNotifications } from '../utils/NotificationUtils';

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
  const [sellModalVisible, setSellModalVisible] = useState(false);
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [notificationCount, setNotificationCount] = useState(global.notifications?.length || 0);

  const currentUser = getCurrentUser();
  const isLoggedIn = isUserLoggedIn();

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
    navigation.navigate('SignInScreen');
  };

  const handleSignUp = () => {
    navigation.navigate('SignUpScreen');
  };

  const handleSellButtonPress = () => {
    if (!isUserLoggedIn()) {
      setAuthModalVisible(true);
      return;
    }
    
    setSellModalVisible(true);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { direction: 'ltr' }]}>
      <View style={[styles.container, { direction: 'ltr' }]}>
        {/* iOS blue status bar area */}
        {Platform.OS === 'ios' && <SafeAreaView style={{ backgroundColor: '#900C3F' }} />}
        <View style={styles.headerGradient}>
          {isLoggedIn ? (
            <>
              <Text style={styles.profileName}>{formatUserName(currentUser)}</Text>
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
          {__DEV__ && (
            <Option icon={'🧪'} label="Add Test Notifications" onPress={() => {
              addSampleNotifications();
              // Force re-render to update notification count
              navigation.setParams({ refresh: Date.now() });
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

        {/* Bottom Navigation Bar */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.bottomNavIcon}>🏠</Text>
            <Text style={styles.bottomNavLabel}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigation.navigate('AdsScreen')}>
            <Text style={styles.bottomNavIcon}>📢</Text>
            <Text style={styles.bottomNavLabel}>My Ads</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sellNowButton} onPress={handleSellButtonPress}>
            <Text style={styles.sellNowPlus}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigation.navigate('ChatScreen')}>
            <Text style={styles.bottomNavIcon}>💬</Text>
            <Text style={styles.bottomNavLabel}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomNavItem}>
            <Text style={styles.bottomNavIcon}>☰</Text>
            <Text style={styles.bottomNavLabelActive}>More</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Sell Modal */}
      <SellModal
        visible={sellModalVisible}
        onClose={() => setSellModalVisible(false)}
        onSelectOption={handleSellOption}
        navigation={navigation}
      />

      {/* Auth Modal */}
      <AuthModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
        onSignIn={() => {
          setAuthModalVisible(false);
          navigation.navigate('SignInScreen', {
            returnScreen: 'ProfileScreen',
            returnParams: route.params,
            action: 'sell'
          });
        }}
        onSignUp={() => {
          setAuthModalVisible(false);
          navigation.navigate('SignUpScreen', {
            returnScreen: 'ProfileScreen',
            returnParams: route.params,
            action: 'sell'
          });
        }}
        action="sell"
        navigation={navigation}
      />

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
  // Bottom Navigation Styles
  bottomNav: { 
    position: 'absolute', 
    left: 0, 
    right: 0, 
    bottom: 0, 
    height: 70, 
    backgroundColor: '#fff', 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    borderTopWidth: 1, 
    borderTopColor: '#eee', 
    zIndex: 10, 
    elevation: 10,
    direction: 'ltr'
  },
  bottomNavItem: { 
    alignItems: 'center', 
    flex: 1 
  },
  bottomNavIcon: { 
    fontSize: 24, 
    marginBottom: 2 
  },
  bottomNavLabel: { 
    fontSize: 12, 
    color: '#888' 
  },
  bottomNavLabelActive: { 
    fontSize: 12, 
    color: '#900C3F', 
    fontWeight: '700' 
  },
  sellNowButton: { 
    width: 62, 
    height: 62, 
    borderRadius: 31, 
    backgroundColor: '#900C3F', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 30, 
    zIndex: 20, 
    elevation: 6, 
    shadowColor: '#900C3F', 
    shadowOpacity: 0.18, 
    shadowRadius: 8, 
    shadowOffset: { width: 0, height: 2 } 
  },
  sellNowPlus: { 
    color: '#fff', 
    fontSize: 36, 
    fontWeight: 'bold', 
    marginTop: -2 
  },
});

export default ProfileScreen; 