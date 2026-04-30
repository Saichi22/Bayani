import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
} from 'react-native';

const SignupScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.formTitle}>Sign Up</Text>
      <Text style={styles.label}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholder="Olivia Wilson"
        placeholderTextColor="rgba(255,255,255,0.6)"
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholder="hello@reallygreatsite.com"
        placeholderTextColor="rgba(255,255,255,0.6)"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        placeholder="••••••"
        placeholderTextColor="rgba(255,255,255,0.6)"
        secureTextEntry
      />
      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        placeholder="••••••"
        placeholderTextColor="rgba(255,255,255,0.6)"
        secureTextEntry
      />
      <Pressable style={styles.confirmButton} onPress={() => {}}>
        <Text style={styles.confirmButtonText}>Confirm</Text>
      </Pressable>
      <Text style={styles.footerText}>Already have an account? Sign In</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 14,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  confirmButton: {
    borderWidth: 1.5,
    borderColor: '#fff',
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});

export default SignupScreen;
