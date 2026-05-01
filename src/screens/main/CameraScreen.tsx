// filepath: src/screens/main/CameraScreen.tsx
import React, { useState, useRef } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'Camera'>;

function CameraScreen({ navigation }: Props) {
  const [photoTaken, setPhotoTaken] = useState(false);

  const handleTakePhoto = () => {
    // TODO: Implement actual camera functionality
    // For now, simulate taking a photo
    Alert.alert(
      "Camera",
      "Camera functionality would be implemented here using react-native-camera or expo-camera",
      [
        {
          text: "Simulate Photo",
          onPress: () => {
            setPhotoTaken(true);
          },
        },
      ]
    );
  };

  const handleTransform = () => {
    if (photoTaken) {
      navigation.navigate('HeroResult');
    } else {
      Alert.alert("Error", "Please take a photo first");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Face Transform</Text>
      <Text style={styles.subtitle}>
        Take a photo to transform into your matched hero
      </Text>

      <View style={styles.cameraPlaceholder}>
        {photoTaken ? (
          <Text style={styles.placeholderText}>Photo Captured ✓</Text>
        ) : (
          <Text style={styles.placeholderText}>Camera Preview</Text>
        )}
      </View>

      <Button
        title={photoTaken ? "Retake Photo" : "Take Photo"}
        onPress={handleTakePhoto}
      />

      {photoTaken && (
        <View style={styles.transformButton}>
          <Button
            title="Transform to Hero"
            onPress={handleTransform}
          />
        </View>
      )}
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
  cameraPlaceholder: {
    height: 300,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 18,
    color: '#666',
  },
  transformButton: {
    marginTop: 15,
  },
});

export default CameraScreen;