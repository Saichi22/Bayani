import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore'; // Import your store

type Props = BottomTabScreenProps<MainTabParamList, 'Home'>;

function HomeScreen({ navigation }: Props) {
  // 1. Get the logout function from your store
  const logout = useAuthStore(state => state.logout);

  const handleLogout = async () => {
    try {
      await logout();
      // Usually, the Root Navigator will see the token is gone
      // and automatically show the Auth stack.
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* --- TEMPORARY LOGOUT BUTTON --- */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Bayani</Text>
      <Text style={styles.subtitle}>Discover your heroic legacy</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Take the Assessment</Text>
        <Text style={styles.cardText}>
          Answer psychometric questions to find your historical hero match
        </Text>
        <Button
          title="Start Assessment"
          onPress={() => navigation.navigate('Assessment')}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>AI Face Transform</Text>
        <Text style={styles.cardText}>
          Transform your photo into your matched historical hero
        </Text>
        <Button title="Take Photo" onPress={() => {}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  // Added temporary styles for the logout button
  logoutBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#ff4444',
    padding: 8,
    borderRadius: 8,
    zIndex: 10,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
});

export default HomeScreen;
