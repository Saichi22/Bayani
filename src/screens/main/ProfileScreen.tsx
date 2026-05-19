// filepath: src/screens/main/ProfileScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../../navigation/types';
import { useAuth } from '../../navigation/RootNavigator';

type Props = BottomTabScreenProps<MainTabParamList, 'Profile'>;

function ProfileScreen() {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Hero Match</Text>
        <Text style={styles.placeholder}>Complete the assessment to see your match</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Demographics</Text>
        <Text style={styles.placeholder}>Set your profile to refine matches</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Saved Heroes</Text>
        <Text style={styles.placeholder}>Your hero collection</Text>
      </View>
      
      <Button title="Logout" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 32,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 30,
  },
  section: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  placeholder: {
    fontSize: 14,
    color: '#666',
  },
});

export default ProfileScreen;