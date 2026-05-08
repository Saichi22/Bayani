import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  ScrollView,
  Keyboard,
  Animated,
  Platform,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../../styles/colors';
import { FONTS } from '../../styles/typography';
import { useAuthStore } from '../../store/authStore'; // adjust path as needed

const bayaniBackground = require('../../assets/images/bayaniBackground.png');
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// ── Validation ────────────────────────────────────────────────────────────────
interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

function validate(
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
): FieldErrors {
  const errors: FieldErrors = {};

  if (!name.trim()) {
    errors.name = 'Full name is required.';
  }

  if (!email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}

// ── Component ─────────────────────────────────────────────────────────────────
function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formOffset = useRef(new Animated.Value(0)).current;
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const register = useAuthStore(state => state.register);

  // ── Keyboard animation ────────────────────────────────────────────────────
  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const show = Keyboard.addListener(showEvent, e => {
      Animated.spring(formOffset, {
        toValue: -(e.endCoordinates.height * 0.65),
        useNativeDriver: true,
        tension: 60,
        friction: 10,
      }).start();
    });

    const hide = Keyboard.addListener(hideEvent, () => {
      Animated.spring(formOffset, {
        toValue: 0,
        useNativeDriver: true,
        tension: 60,
        friction: 10,
      }).start();
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleRegister = async () => {
    console.log('BUTTON PRESSED', { name, email, password, confirmPassword });
    Keyboard.dismiss();

    const fieldErrors = validate(name, email, password, confirmPassword);
    console.log('VALIDATION ERRORS:', fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await register(email, password, name);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Something went wrong. Please try again.';
      setErrors({ general: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const inputStyle = (field: keyof FieldErrors) => [
    styles.input,
    errors[field] ? styles.inputError : null,
  ];

  return (
    <ImageBackground
      source={bayaniBackground}
      style={styles.container}
      resizeMode="cover"
    >
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

      <Animated.View
        style={[
          styles.formWrapper,
          { transform: [{ translateY: formOffset }] },
        ]}
      >
        <LinearGradient
          colors={['#a03f12', '#ffa074']}
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.formContainer}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 60 }}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.formTitle}>Sign Up</Text>

            {/* ── General error ── */}
            {errors.general ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>⚠ {errors.general}</Text>
              </View>
            ) : null}

            {/* ── Full Name ── */}
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={inputStyle('name')}
              placeholder="Juan Dela Cruz"
              placeholderTextColor="#c07e5f"
              value={name}
              onChangeText={text => {
                setName(text);
                if (errors.name) setErrors(e => ({ ...e, name: undefined }));
              }}
            />
            {errors.name ? (
              <Text style={styles.errorText}>{errors.name}</Text>
            ) : null}

            {/* ── Email ── */}
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={inputStyle('email')}
              placeholder="juan@example.com"
              placeholderTextColor="#c07e5f"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={text => {
                setEmail(text);
                if (errors.email) setErrors(e => ({ ...e, email: undefined }));
              }}
            />
            {errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}

            {/* ── Password ── */}
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={inputStyle('password')}
              placeholder="Min. 8 characters"
              placeholderTextColor="#c07e5f"
              secureTextEntry
              value={password}
              onChangeText={text => {
                setPassword(text);
                if (errors.password)
                  setErrors(e => ({ ...e, password: undefined }));
              }}
            />
            {errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}

            {/* ── Confirm Password ── */}
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <TextInput
              style={inputStyle('confirmPassword')}
              placeholder="Repeat your password"
              placeholderTextColor="#c07e5f"
              secureTextEntry
              value={confirmPassword}
              onChangeText={text => {
                setConfirmPassword(text);
                if (errors.confirmPassword)
                  setErrors(e => ({ ...e, confirmPassword: undefined }));
              }}
            />
            {errors.confirmPassword ? (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            ) : null}

            {/* ── Submit ── */}
            <TouchableOpacity
              style={[
                styles.customButton,
                isSubmitting && styles.buttonDisabled,
              ]}
              onPress={handleRegister}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
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
      </Animated.View>
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
    top: '20%',
    marginTop: -600,
    marginBottom: -300,
    zIndex: 1,
  },
  formWrapper: {
    width: '100%',
    position: 'absolute',
    bottom: -90,
    zIndex: 2,
  },
  formContainer: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 40,
    paddingTop: 25,
    width: '100%',
    minHeight: SCREEN_HEIGHT * 0.4,
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
    fontSize: 36,
    marginBottom: 10,
    color: COLORS.textContrast,
  },
  inputLabel: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 14,
    marginBottom: 4,
    color: COLORS.textContrast,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 12,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 15,
    marginBottom: 4,
    fontSize: 14,
    color: '#3a1a0a',
  },
  inputError: {
    borderColor: '#ff4444',
    borderWidth: 1.5,
  },
  errorText: {
    color: '#ffe0d0',
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 11,
    marginBottom: 8,
    marginLeft: 4,
  },
  errorBanner: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  errorBannerText: {
    color: '#ffe0d0',
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 13,
  },
  customButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#fff',
    paddingVertical: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '65%',
    alignSelf: 'center',
    marginTop: 15,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: FONTS.PoppinsBold,
    fontSize: 16,
  },
  signupContainer: {
    marginTop: 20,
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
