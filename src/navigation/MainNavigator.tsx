// filepath: src/navigation/MainNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList } from './types';

import MainTabNavigator from './MainTabNavigator';
import PersonalityTestScreen from '../screens/main/PersonalityTestScreen';
import DemographicProfileScreen from '../screens/main/DemographicProfileScreen';
import CameraScreen from '../screens/main/CameraScreen';
import HeroResultScreen from '../screens/main/HeroResultScreen';

const Stack = createNativeStackNavigator<MainStackParamList>();

function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="PersonalityTest" component={PersonalityTestScreen} />
      <Stack.Screen name="DemographicProfile" component={DemographicProfileScreen} />
      <Stack.Screen name="Camera" component={CameraScreen} />
      <Stack.Screen name="HeroResult" component={HeroResultScreen} />
    </Stack.Navigator>
  );
}

export default MainNavigator;