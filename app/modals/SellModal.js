import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, SafeAreaView, Platform } from 'react-native';
import { isUserLoggedIn, getAuthPromptMessage } from '../screens/auth/AuthUtils';
import AuthModal from './AuthModal';

const SellModal = ({ visible, onClose, onSelectOption, navigation }) => {
  const [authModalVisible, setAuthModalVisible] = useState(false);
  
  const sellOptions = [
    { id: 'car', label: 'Car', icon: '🚗' },
    { id: 'bike', label: 'Bike', icon: '🏍️' },
    { id: 'autoparts', label: 'Auto Parts', icon: '⚙️' },
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>What do you want to sell?</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {sellOptions.map((option) => (
                              <TouchableOpacity
                  key={option.id}
                  style={styles.optionButton}
                  onPress={() => {
                    onClose();
                    
                    // Check if user is logged in
                    if (!isUserLoggedIn()) {
                      setAuthModalVisible(true);
                      return;
                    }
                    
                    if (navigation) {
                      switch (option.id) {
                        case 'car':
                          navigation.navigate('ChoosePlanScreen');
                          break;
                        case 'bike':
                          navigation.navigate('BikeChoosePlanScreen');
                          break;
                        case 'autoparts':
                          navigation.navigate('AutoPartsChoosePlanScreen');
                          break;
                        default:
                          onSelectOption(option.id);
                      }
                    } else {
                      onSelectOption(option.id);
                    }
                  }}
                >
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>{option.icon}</Text>
                </View>
                <Text style={styles.optionLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Auth Modal */}
      <AuthModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
        onSignIn={() => {
          setAuthModalVisible(false);
          // Get current screen name from navigation state
          const currentRoute = navigation.getState()?.routes[navigation.getState().index];
          const currentScreen = currentRoute?.name || 'MainTabs';
          
          // Check if we're on a MainTabs screen (Home, Ads, Chat, Profile)
          const mainTabsScreens = ['Home', 'Ads', 'Chat', 'Profile'];
          const isOnMainTabs = mainTabsScreens.includes(currentScreen);
          
          // If we're on a MainTabs screen, return to that specific tab
          const returnScreen = isOnMainTabs ? currentScreen : currentScreen;
          const returnParams = currentRoute?.params;
          
          console.log('SellModal: Navigation params:', {
            currentScreen,
            isOnMainTabs,
            returnScreen,
            returnParams
          });
          
          navigation.navigate('SignInScreen', {
            returnScreen: returnScreen,
            returnParams: returnParams,
            action: 'sell'
          });
        }}
        onSignUp={() => {
          setAuthModalVisible(false);
          // Get current screen name from navigation state
          const currentRoute = navigation.getState()?.routes[navigation.getState().index];
          const currentScreen = currentRoute?.name || 'MainTabs';
          
          // Check if we're on a MainTabs screen (Home, Ads, Chat, Profile)
          const mainTabsScreens = ['Home', 'Ads', 'Chat', 'Profile'];
          const isOnMainTabs = mainTabsScreens.includes(currentScreen);
          
          // If we're on a MainTabs screen, return to that specific tab
          const returnScreen = isOnMainTabs ? currentScreen : currentScreen;
          const returnParams = currentRoute?.params;
          
          console.log('SellModal: Navigation params:', {
            currentScreen,
            isOnMainTabs,
            returnScreen,
            returnParams
          });
          
          navigation.navigate('SignUpScreen', {
            returnScreen: returnScreen,
            returnParams: returnParams,
            action: 'sell'
          });
        }}
        action="sell"
        navigation={navigation}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -5 },
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  optionButton: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  icon: {
    fontSize: 28,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
  },
});

export default SellModal; 