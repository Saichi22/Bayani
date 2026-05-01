// filepath: src/screens/main/DemographicProfileScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Picker } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'DemographicProfile'>;

const ethnicities = [
  "Ilocano",
  "Tagalog",
  "Visayan",
  "Kapampangan",
  "Bicolano",
  "Igorot",
  "Moro",
  "Other",
];

const regions = [
  "Metro Manila",
  "Ilocos Region",
  "Cagayan Valley",
  "Central Luzon",
  "CALABARZON",
  "Mimaropa",
  "Bicol Region",
  "Western Visayas",
  "Central Visayas",
  "Eastern Visayas",
  "Zamboanga Peninsula",
  "Northern Mindanao",
  "Davao Region",
  "SOCCSKSARGEN",
  "Caraga",
  "BARMM",
];

function DemographicProfileScreen({ navigation }: Props) {
  const [ethnicity, setEthnicity] = useState("");
  const [region, setRegion] = useState("");

  const handleSave = () => {
    // TODO: Save demographic data
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Demographic Profile</Text>
      <Text style={styles.subtitle}>
        Help us refine your historical hero matching
      </Text>

      <Text style={styles.label}>Ethnicity</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={ethnicity}
          onValueChange={(value) => setEthnicity(value)}
          style={styles.picker}
        >
          <Picker.Item label="Select your ethnicity" value="" />
          {ethnicities.map((e) => (
            <Picker.Item key={e} label={e} value={e} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Current Location</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={region}
          onValueChange={(value) => setRegion(value)}
          style={styles.picker}
        >
          <Picker.Item label="Select your region" value="" />
          {regions.map((r) => (
            <Picker.Item key={r} label={r} value={r} />
          ))}
        </Picker>
      </View>

      <Button title="Save Profile" onPress={handleSave} />
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
});

export default DemographicProfileScreen;