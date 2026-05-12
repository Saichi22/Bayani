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
        <Text style={styles.sectionTitle}>Katulad mo na Bayani</Text>
        <Text style={styles.placeholder}>Kumpletuhin ang pagsusuri upang makita ang iyong katulad.</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Demograpiya</Text>
        <Text style={styles.placeholder}>Ayusin ang iyong profile upang mapabuti ang mga tugma.</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Naitala na mga Bayani</Text>
        <Text style={styles.placeholder}>Koleksyon ng iyong mga bayani</Text>
      </View>
      
      <Button title="Logout" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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