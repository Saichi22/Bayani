// filepath: src/screens/main/HeroResultScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'HeroResult'>;

function HeroResultScreen({ navigation }: Props) {
  // TODO: This would be populated from the assessment results
  const hero = {
    name: "Jose Rizal",
    description: "Your personality aligns with the national hero of the Philippines. Like Rizal, you value education, intellect, and peaceful reform.",
    image: null, // Would be AI-transformed image
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iyong Katugmang Bayani</Text>
      
      <View style={styles.heroCard}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>Larawang Binago ng AI</Text>
        </View>
        
        <Text style={styles.heroName}>{hero.name}</Text>
        <Text style={styles.heroDescription}>{hero.description}</Text>
      </View>

      <Button
        title="Save to Collection"
        onPress={() => {
          // TODO: Save to user's collection
          navigation.navigate('MainTabs');
        }}
      />

      <Button
        title="Retake Assessment"
        onPress={() => {
          navigation.navigate('PersonalityTest');
        }}
      />
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
    textAlign: 'center',
  },
  heroCard: {
    alignItems: 'center',
    marginBottom: 30,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 14,
    color: '#666',
  },
  heroName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  heroDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default HeroResultScreen;