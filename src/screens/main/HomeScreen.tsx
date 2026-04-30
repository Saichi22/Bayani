// filepath: src/screens/main/HomeScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../../navigation/types';

type Props = BottomTabScreenProps<MainTabParamList, 'Home'>;

function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
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
        <Button 
          title="Take Photo" 
          onPress={() => {}} 
        />
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