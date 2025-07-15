import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform } from 'react-native';
import SellModal from '../modals/SellModal';

const Option = ({ icon, label, right, onPress }) => (
  <TouchableOpacity style={styles.optionRow} onPress={onPress} activeOpacity={0.7}>
    <Text style={styles.optionIcon}>{icon}</Text>
    <Text style={styles.optionLabel}>{label}</Text>
    {right && <Text style={styles.optionRight}>{right}</Text>}
  </TouchableOpacity>
);

const ProfileScreen = ({ navigation }) => {
  const [sellModalVisible, setSellModalVisible] = useState(false);

  const handleSellOption = (option) => {
    setSellModalVisible(false);
    console.log('Selected sell option:', option);
    // Handle different sell options here
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* iOS blue status bar area */}
        {Platform.OS === 'ios' && <SafeAreaView style={{ backgroundColor: '#2563eb' }} />}
        <View style={styles.headerGradient}>
          <Text style={styles.profileName}>Shehroze Ikram</Text>
          <TouchableOpacity style={styles.viewProfileBtn}>
            <Text style={styles.viewProfileText}>View Profile </Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Personal Section */}
          <Text style={styles.sectionTitle}>Personal</Text>
          <Option icon={'📄'} label="My Activity" right={'▼'} />
          <Option icon={'📄'} label="My Credits" />
          <Option icon={'🤍'} label="Alerts" right={'▼'} />
          <Option icon={'🔔'} label="Notifications" />
          <Option icon={'⚙️'} label="Theme" />
          <Option icon={'🗂️'} label="Choose Language" />
          <View style={styles.sectionDivider} />
          {/* Products Section */}
          <Text style={styles.sectionTitle}>Products</Text>
          <Option icon={'🚗'} label="Sell My Car" />
          <Option icon={'🚗'} label="Buy Used Car" />
          <Option icon={'🚗'} label="Buy New Car" />
          {/* Logout button at the bottom of scrollview */}
          <TouchableOpacity style={styles.logoutRow} activeOpacity={0.7}>
            <Text style={styles.logoutIcon}>🔓</Text>
            <Text style={styles.logoutLabel}>Logout</Text>
          </TouchableOpacity>
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
          <TouchableOpacity style={styles.sellNowButton} onPress={() => setSellModalVisible(true)}>
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
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#193A7A', paddingBottom: 40 },
  container: { flex: 1, backgroundColor: '#f9fafd' },
  headerGradient: {
    backgroundColor: '#193A7A',
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
    elevation: 10 
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
    color: '#2563eb', 
    fontWeight: '700' 
  },
  sellNowButton: { 
    width: 62, 
    height: 62, 
    borderRadius: 31, 
    backgroundColor: '#2563eb', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 30, 
    zIndex: 20, 
    elevation: 6, 
    shadowColor: '#2563eb', 
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