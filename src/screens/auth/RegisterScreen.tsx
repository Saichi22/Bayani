import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../../styles/colors';
import { FONTS } from '../../styles/typography';

const bayaniBackground = require('../../assets/images/bayaniBackground.png');

function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const handleRegister = async () => {
    // Implement your registration logic here
    console.log('Registering:', name, email);
  };

  return (
    <ImageBackground
      source={bayaniBackground}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Header Section consistent with Login */}
      <MaskedView
        style={{ height: 25, width: '100%' }}
        maskElement={
          <Text style={[styles.subtitle, { backgroundColor: 'transparent' }]}>
            Mabuhay
          </Text>
        }
      >
        <LinearGradient
          colors={['#1e1d6d', '#9b1300']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{ flex: 1 }}
        />
      </MaskedView>

      <MaskedView
        style={{ height: 85, width: '100%' }}
        maskElement={
          <Text style={[styles.title, { backgroundColor: 'transparent' }]}>
            Bayani
          </Text>
        }
      >
        <LinearGradient
          colors={['#1e1d6d', '#9b1300']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{ flex: 1 }}
        />
      </MaskedView>

      <Image
        source={require('../../assets/images/bayaniPortrait.png')}
        style={styles.overlapImage}
        resizeMode="contain"
      />

      <LinearGradient
        colors={['#a03f12', '#ffa074']}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.formContainer}
      >
        {/* Use ScrollView inside the form so inputs aren't cut off on smaller screens */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <Text style={styles.formTitle}>Sign Up</Text>

          <Text style={styles.TextInput}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Juan Dela Cruz"
            placeholderTextColor="#c07e5f"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.TextInput}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="juan@example.com"
            placeholderTextColor="#c07e5f"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.TextInput}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="********"
            placeholderTextColor="#c07e5f"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.TextInput}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="********"
            placeholderTextColor="#c07e5f"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity
            style={[
              styles.customButton,
              { width: '60%', alignSelf: 'center', marginTop: 10 },
            ]}
            onPress={handleRegister}
          >
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signupContainer}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Text style={styles.signupLink}>Log in</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '120%',
    top: '-10%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  overlapImage: {
    width: 1400,
    height: 1300,
    top: '10%',
    marginTop: -600,
    marginBottom: -650,
    zIndex: 1,
  },
  formContainer: {
    backgroundColor: COLORS.primaryLight,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 40, // Adjusted slightly for registration inputs
    paddingTop: 25,
    width: '100%',
    height: '80%', // Increased height to accommodate more fields
    top: '36%',
    marginTop: -170,
    zIndex: 2,
  },
  title: {
    fontFamily: FONTS.kawitBold,
    fontSize: 85,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONTS.baybayin,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    color: '#666',
  },
  formTitle: {
    fontFamily: FONTS.PoppinsBold,
    fontSize: 38, // Slightly smaller to save space
    marginBottom: -5,
    color: COLORS.textContrast,
  },
  TextInput: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 14,
    marginBottom: 3,
    color: COLORS.textContrast,
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 12,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 15,
    marginBottom: 12,
    fontSize: 14,
    color: '#fff',
  },
  customButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#fff',
    paddingVertical: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: FONTS.PoppinsBold,
    fontSize: 16,
  },
  signupContainer: {
    marginTop: 5,
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 14,
  },
  signupLink: {
    color: '#fff',
    fontFamily: FONTS.PoppinsBold,
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;
