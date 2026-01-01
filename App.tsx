import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { getUser } from './utils/storage';

import Home from './screens/Home';
import Onboarding from './screens/Onboarding';
import Profile from './screens/Profile';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App() {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    const loadState = async () => {
      try {
        const user = await getUser();
        setIsOnboardingCompleted(user?.isOnboarded ?? false);
      } catch (e) {
        setIsOnboardingCompleted(false);
      } finally {
        await SplashScreen.hideAsync();
      }
    };
    loadState();
  }, []);

  if (isOnboardingCompleted === null) {
    // Still loading
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        initialRouteName={isOnboardingCompleted ? "Home" : "Onboarding"}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
