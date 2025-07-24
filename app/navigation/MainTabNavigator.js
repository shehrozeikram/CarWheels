import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Home from '../screens/Home';
import AdsScreen from '../screens/AdsScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SellModal from '../modals/SellModal';
import AuthModal from '../modals/AuthModal';
import { isUserLoggedIn } from '../screens/auth/AuthUtils';
import { useState } from 'react';

const Tab = createBottomTabNavigator();

// Custom Tab Bar Component
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const [sellModalVisible, setSellModalVisible] = useState(false);
  const [authModalVisible, setAuthModalVisible] = useState(false);

  const handleSellButtonPress = () => {
    if (!isUserLoggedIn()) {
      setAuthModalVisible(true);
      return;
    }
    setSellModalVisible(true);
  };

  const handleSellOption = (option) => {
    setSellModalVisible(false);
    console.log('Selected sell option:', option);
  };

  return (
    <View style={styles.tabBarContainer}>
      {/* Tab Bar Items */}
      <View style={[styles.tabBar, { paddingBottom: insets.bottom }]}>
        {/* Left side tabs */}
        <View style={styles.tabGroup}>
          {state.routes.slice(0, 2).map((route, index) => {
            const { options } = descriptors[route.key];
            const label = options.tabBarLabel || options.title || route.name;
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.tabItem}
              >
                <Text style={styles.tabIcon}>{options.tabBarIcon}</Text>
                <Text style={isFocused ? styles.tabLabelActive : styles.tabLabel}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Center spacer for sell button */}
        <View style={styles.centerSpacer} />

        {/* Right side tabs */}
        <View style={styles.tabGroup}>
          {state.routes.slice(2, 4).map((route, index) => {
            const actualIndex = index + 2; // Adjust index for right side tabs
            const { options } = descriptors[route.key];
            const label = options.tabBarLabel || options.title || route.name;
            const isFocused = state.index === actualIndex;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.tabItem}
              >
                <Text style={styles.tabIcon}>{options.tabBarIcon}</Text>
                <Text style={isFocused ? styles.tabLabelActive : styles.tabLabel}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Sell Button with spacing */}
      <View style={[styles.sellButtonContainer, { bottom: 30 + insets.bottom }]}>
        <TouchableOpacity style={styles.sellButton} onPress={handleSellButtonPress}>
          <Text style={styles.sellButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <SellModal
        visible={sellModalVisible}
        onClose={() => setSellModalVisible(false)}
        onSelectOption={handleSellOption}
        navigation={navigation}
      />

      <AuthModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
        onSignIn={() => {
          setAuthModalVisible(false);
          navigation.navigate('SignInScreen', {
            returnScreen: 'MainTabs',
            action: 'sell'
          });
        }}
        onSignUp={() => {
          setAuthModalVisible(false);
          navigation.navigate('SignUpScreen', {
            returnScreen: 'MainTabs',
            action: 'sell'
          });
        }}
        action="sell"
        navigation={navigation}
      />
    </View>
  );
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: '🏠',
        }}
      />
      <Tab.Screen
        name="Ads"
        component={AdsScreen}
        options={{
          tabBarLabel: 'My Ads',
          tabBarIcon: '📢',
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: '💬',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'More',
          tabBarIcon: '☰',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'relative',
  },
  tabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 70,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    zIndex: 10,
    elevation: 10,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  tabGroup: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  centerSpacer: {
    width: 62, // Same width as sell button
  },
  tabItem: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 8,
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 12,
    color: '#888',
  },
  tabLabelActive: {
    fontSize: 12,
    color: '#900C3F',
    fontWeight: '700',
  },
  sellButtonContainer: {
    position: 'absolute',
    bottom: 30,
    left: '50%',
    marginLeft: -31,
    width: 62,
    height: 62,
    zIndex: 20,
  },
  sellButton: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#900C3F',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#900C3F',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  sellButtonText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: -2,
  },
});

export default MainTabNavigator; 