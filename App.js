/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform, TextInput, I18nManager } from 'react-native';
import SplashScreen from './app/screens/SplashScreen';
import Home from './app/screens/Home';
import SearchUsedCars from './app/screens/SearchUsedCars';
import CarDetailScreen from './app/screens/CarDetailScreen';
import CarListScreen from './app/screens/CarListScreen';
import BrandModelsScreen from './app/screens/BrandModelsScreen';
import ProfileScreen from './app/screens/ProfileScreen';
import AdsScreen from './app/screens/AdsScreen';
import ChatScreen from './app/screens/ChatScreen';
import CarComparisonScreen from './app/screens/CarComparisonScreen';
import ChoosePlanScreen from './app/screens/selling/car/ChoosePlanScreen';
import SellYourCarScreen from './app/screens/selling/car/SellYourCarScreen';
import BikeChoosePlanScreen from './app/screens/selling/bike/ChoosePlanScreen';
import AutoPartsChoosePlanScreen from './app/screens/selling/autoparts/ChoosePlanScreen';
import SignInScreen from './app/screens/auth/SignInScreen';
import SignUpScreen from './app/screens/auth/SignUpScreen';
import NotificationScreen from './app/screens/NotificationScreen';
import NotificationBanner from './app/components/NotificationBanner';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createStackNavigator();

// Initialize global state
global.notifications = [];
global.carListings = {};

// Force LTR layout direction to prevent iOS RTL flipping
if (Platform.OS === 'ios') {
  I18nManager.forceRTL(false);
  I18nManager.allowRTL(false);
  
  // Global TextInput configuration for iOS RTL handling
  TextInput.defaultProps = {
    ...TextInput.defaultProps,
    textAlign: 'left',
    textAlignVertical: 'center',
    writingDirection: 'ltr',
  };
}

export default function App() {
  const [currentNotification, setCurrentNotification] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  // Listen for new notifications
  useEffect(() => {
    const checkForNewNotifications = () => {
      if (global.notifications && global.notifications.length > 0) {
        const latestNotification = global.notifications[0];
        if (!latestNotification.shown) {
          setCurrentNotification(latestNotification);
          setShowNotification(true);
          latestNotification.shown = true;
        }
      }
    };

    // Check every 2 seconds for new notifications
    const interval = setInterval(checkForNewNotifications, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const handleNotificationDismiss = () => {
    setShowNotification(false);
    setCurrentNotification(null);
  };

  const handleNotificationPress = (notification) => {
    setShowNotification(false);
    setCurrentNotification(null);
    
    // Navigate to the car detail if it's a bid notification
    if (notification.car) {
      // You would need to access navigation here, but for now we'll just mark as read
      notification.read = true;
    }
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="SplashScreen"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="SearchUsedCars" component={SearchUsedCars} />
          <Stack.Screen name="CarDetailScreen" component={CarDetailScreen} />
          <Stack.Screen name="CarListScreen" component={CarListScreen} />
          <Stack.Screen name="BrandModelsScreen" component={BrandModelsScreen} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AdsScreen" component={AdsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
          <Stack.Screen name="CarComparisonScreen" component={CarComparisonScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ChoosePlanScreen" component={ChoosePlanScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SellYourCarScreen" component={SellYourCarScreen} options={{ headerShown: false }} />
          <Stack.Screen name="BikeChoosePlanScreen" component={BikeChoosePlanScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AutoPartsChoosePlanScreen" component={AutoPartsChoosePlanScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SignInScreen" component={SignInScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }} />
          <Stack.Screen name="NotificationScreen" component={NotificationScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
        
        {/* Global Notification Banner */}
        <NotificationBanner
          visible={showNotification}
          notification={currentNotification}
          onDismiss={handleNotificationDismiss}
          onPress={handleNotificationPress}
        />
      </NavigationContainer>
    </SafeAreaProvider>
  );
} 