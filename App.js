/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './app/screens/Home';
import SearchUsedCars from './app/screens/SearchUsedCars';
import CarDetailScreen from './app/screens/CarDetailScreen';
import CarListScreen from './app/screens/CarListScreen';
import BrandModelsScreen from './app/screens/BrandModelsScreen';
import ProfileScreen from './app/screens/ProfileScreen';
import AdsScreen from './app/screens/AdsScreen';
import ChatScreen from './app/screens/ChatScreen';
import CarComparisonScreen from './app/screens/CarComparisonScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="SearchUsedCars" component={SearchUsedCars} />
          <Stack.Screen name="CarDetailScreen" component={CarDetailScreen} />
          <Stack.Screen name="CarListScreen" component={CarListScreen} />
          <Stack.Screen name="BrandModelsScreen" component={BrandModelsScreen} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AdsScreen" component={AdsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
          <Stack.Screen name="CarComparisonScreen" component={CarComparisonScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
} 