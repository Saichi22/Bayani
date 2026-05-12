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
        tabBarStyle: {
          backgroundColor: '#f8f2e8',
          height: Platform.OS === 'ios' ? 80 : 100, // Adjust height for iOS and Android
        },
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
