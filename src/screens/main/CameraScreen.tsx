// filepath: src/screens/main/CameraScreen.tsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, Image, ActivityIndicator } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import { launchCamera, ImagePickerResponse } from 'react-native-image-picker';
import { api } from '../../api/client';
import { useAuthStore } from '../../store/authStore';

type Props = NativeStackScreenProps<MainStackParamList, 'Camera'>;

function CameraScreen({ navigation }: Props) {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [base64Data, setBase64Data] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const user = useAuthStore(state => state.user);

  const handleTakePhoto = async () => {
    try {
      const response: ImagePickerResponse = await launchCamera({
        mediaType: 'photo',
        cameraType: 'front',
        includeBase64: true,
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
      });

      if (response.didCancel) {
        return;
      }

      if (response.errorCode) {
        Alert.alert('Camera Error', response.errorMessage || 'Unknown error occurred');
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        if (asset.uri && asset.base64) {
          setPhotoUri(asset.uri);
          setBase64Data(asset.base64);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to launch camera');
      console.error(error);
    }
  };

  const handleTransform = async () => {
    if (!base64Data) {
      Alert.alert("Error", "Please take a photo first");
      return;
    }

    setIsLoading(true);
    try {
      // Format base64 to include data URI scheme
      const base64Photo = `data:image/jpeg;base64,${base64Data}`;
      
      const response = await api.post('/mashup/generate-rizal', {
        userId: user?.id || 'anonymous',
        base64Photo: base64Photo,
      });

      const mashupId = response.data.id;
      let status = 'PENDING';
      let imageUrl = null;

      while (status === 'PENDING') {
        // Wait 5 seconds
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Check status
        const checkRes = await api.get(`/mashup/${mashupId}`);
        status = checkRes.data.status;
        
        if (status === 'COMPLETED') {
          imageUrl = checkRes.data.imageUrl;
        } else if (status === 'FAILED') {
          throw new Error("Image generation failed");
        }
      }
      
      navigation.navigate('HeroResult', { imageUrl });
    } catch (error) {
      console.error('Mashup API Error:', error);
      Alert.alert("Transformation Failed", "Failed to communicate with the backend or image generation failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Face Transform</Text>
      <Text style={styles.subtitle}>
        Take a photo to transform into Jose Rizal
      </Text>

      <View style={styles.cameraPlaceholder}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.previewImage} />
        ) : (
          <Text style={styles.placeholderText}>Camera Preview</Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={photoUri ? "Retake Photo" : "Take Photo"}
          onPress={handleTakePhoto}
          disabled={isLoading}
        />
      </View>

      {photoUri && (
        <View style={styles.transformButton}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Button
              title="Transform to Hero"
              onPress={handleTransform}
            />
          )}
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
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderText: {
    fontSize: 18,
    color: '#666',
  },
  buttonContainer: {
    marginBottom: 15,
  },
  transformButton: {
    marginTop: 15,
  },
});

export default CameraScreen;