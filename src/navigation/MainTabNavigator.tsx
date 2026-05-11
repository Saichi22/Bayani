// filepath: src/navigation/MainTabNavigator.tsx
import React from 'react';
import { Platform } from 'react-native'; // Added Platform to handle iOS/Android differences
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import Icon from 'react-native-vector-icons/FontAwesome';

import HomeScreen from '../screens/main/HomeScreen';
import AssessmentScreen from '../screens/main/AssessmentScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

import { COLORS } from '../styles/colors';
import { FONTS } from '../styles/typography';

const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        // 1. Remove fixed heights and let it auto-scale
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopWidth: 1,
          borderTopColor: '#000000',
        },
        // 2. Use 'position: relative' to ensure it doesn't sink
        tabBarLabelStyle: {
          fontFamily: FONTS.PoppinsRegular,
          fontSize: 11,
          paddingBottom: 5,
        },

        tabBarIcon: ({ color, size }) => {
          let iconName: string = 'home';
          if (route.name === 'Assessment') iconName = 'shield';
          if (route.name === 'Profile') iconName = 'user';

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Assessment" component={AssessmentScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default MainTabNavigator;
