// filepath: src/screens/auth/LoginScreen.tsx
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useAuth } from '../../navigation/RootNavigator';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();

  const handleLogin = () => {
    // TODO: Implement actual login logic
    login();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bayani</Text>
      <Text style={styles.subtitle}>Login to discover your heroic legacy</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
      />
      
      <Button title="Login" onPress={handleLogin} />
      
      <Text style={styles.link} onPress={() => navigation.navigate('ForgotPassword')}>
        Forgot Password?
      </Text>
      
      <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
        Don't have an account? Register
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  link: {
    marginTop: 15,
    textAlign: 'center',
    color: '#007AFF',
    fontSize: 16,
  },
});

export default LoginScreen;