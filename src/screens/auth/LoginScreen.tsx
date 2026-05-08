import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
  Image,
  Keyboard,
  Animated,
  Platform,
  Dimensions,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../../styles/colors';
import { FONTS } from '../../styles/typography';

const bayaniBackground = require('../../assets/images/bayaniBackground.png');
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

function LoginScreen() {
  const { signIn, signInWithGoogle } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const formOffset = useRef(new Animated.Value(0)).current;

  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const show = Keyboard.addListener(showEvent, e => {
      Animated.spring(formOffset, {
        toValue: -(e.endCoordinates.height * 0.6),
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

  const handleLogin = async () => {
    Keyboard.dismiss();
    try {
      if (!email || !password) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
      await signIn(email, password);
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      Alert.alert('Google Sign-In Failed', 'Something went wrong');
    }
  };

  return (
    <ImageBackground
      source={bayaniBackground}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Title area — completely untouched by keyboard logic */}
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

      {/* Portrait image — completely untouched by keyboard logic */}
      <Image
        source={require('../../assets/images/bayaniPortrait.png')}
        style={styles.overlapImage}
        resizeMode="contain"
      />

      {/* Only the form animates — translateY never affects siblings */}
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
          <Text style={styles.formTitle}>Log In</Text>

          {/* Email */}
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Juan@example.com"
            placeholderTextColor="#c07e5f"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            returnKeyType="next"
          />

          {/* Password */}
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="••••••••"
              placeholderTextColor="#c07e5f"
              secureTextEntry={!isPasswordVisible}
              value={password}
              onChangeText={setPassword}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <Icon
                name={isPasswordVisible ? 'eye' : 'eye-slash'}
                size={16}
                color="#c07e5f"
              />
            </TouchableOpacity>
          </View>

          {/* Remember me + Forgot password */}
          <View style={styles.rowContainer}>
            <TouchableOpacity
              style={styles.rememberMeContainer}
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.7}
            >
              <View
                style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
              >
                {rememberMe && <Icon name="check" size={11} color="#fff" />}
              </View>
              <Text style={styles.rememberMeText}>Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Confirm button */}
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.line} />
          </View>

          {/* Google sign in */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogin}
            activeOpacity={0.8}
          >
            <Icon
              name="google"
              size={18}
              color="white"
              style={{ marginRight: 10 }}
            />
            <Text
              style={[styles.buttonText, { fontFamily: FONTS.PoppinsRegular }]}
            >
              Sign in with Google
            </Text>
          </TouchableOpacity>

          {/* Sign up link */}
          <TouchableOpacity
            style={styles.signupContainer}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.footerText}>
              Don't have an account?{' '}
              <Text style={styles.signupLink}>Sign up</Text>
            </Text>
          </TouchableOpacity>
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
    top: '-15%',
    marginTop: -390,
    marginBottom: -400,
    zIndex: 1,
  },

  // Wrapper handles positioning; formContainer handles only visuals
  formWrapper: {
    width: '100%',
    position: 'absolute',
    bottom: -90,
    zIndex: 2,
  },
  formContainer: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 50,
    paddingTop: 18,
    paddingBottom: 10,
    width: '100%',
    // height is driven by content — no fixed top/marginTop needed
    minHeight: SCREEN_HEIGHT * 0.61,
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
    marginBottom: 8,
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
    borderRadius: 14,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 15,
    marginBottom: 12,
    fontSize: 15,
    color: '#3a1a0a',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  eyeButton: {
    position: 'absolute',
    right: 14,
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 14,
    marginTop: -2,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#fff',
    borderRadius: 5,
    marginRight: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderColor: '#fff',
  },
  rememberMeText: {
    color: '#fff',
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 12,
  },
  forgotPasswordText: {
    color: '#fff',
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  confirmButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#fff',
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '52%',
    alignSelf: 'center',
    marginBottom: 4,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  orText: {
    marginHorizontal: 10,
    color: '#fff',
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 13,
  },
  googleButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#fff',
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: FONTS.PoppinsBold,
    fontSize: 15,
  },
  signupContainer: {
    alignItems: 'center',
    paddingBottom: 12,
  },
  footerText: {
    color: 'rgba(255,255,255,0.8)',
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 13,
  },
  signupLink: {
    color: '#fff',
    fontFamily: FONTS.PoppinsBold,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
