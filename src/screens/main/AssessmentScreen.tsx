// filepath: src/screens/main/AssessmentScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';

type Props = BottomTabScreenProps<MainTabParamList, 'Assessment'>;

function AssessmentScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personality Assessment</Text>
      <Text style={styles.subtitle}>
        Discover which historical Filipino hero matches your personality
      </Text>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>How it works:</Text>
        <Text style={styles.infoText}>• Answer situational dilemmas</Text>
        <Text style={styles.infoText}>• Choose between combat or command</Text>
        <Text style={styles.infoText}>• Get matched with a historical hero</Text>
      </View>
      
      <Button 
        title="Start Personality Test" 
        onPress={() => navigation.navigate('PersonalityTest')} 
      />
      
      <View style={styles.divider} />
      
      <Button 
        title="Set Demographic Profile" 
        onPress={() => navigation.navigate('DemographicProfile')} 
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  infoBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  divider: {
    height: 20,
  },
});

export default AssessmentScreen;