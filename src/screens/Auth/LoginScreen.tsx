import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
  Image,
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

function LoginScreen() {
  const { signIn, signInWithGoogle } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const handleLogin = async () => {
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
      <MaskedView
        style={{ height: 25, width: '100%' }} // Height should be slightly larger than fontSize
        maskElement={
          <Text style={[styles.subtitle, { backgroundColor: 'transparent' }]}>
            Mabuhay
          </Text>
        }
      >
        {' '}
        <LinearGradient
          colors={['#1e1d6d', '#9b1300']}
          start={{ x: 0.5, y: 0 }} // Top center
          end={{ x: 0.5, y: 1 }} // Bottom center
          style={{ flex: 1 }}
        />
      </MaskedView>
      <MaskedView
        style={{ height: 85, width: '100%' }} // Height should be slightly larger than fontSize
        maskElement={
          <Text style={[styles.title, { backgroundColor: 'transparent' }]}>
            Bayani
          </Text>
        }
      >
        <LinearGradient
          colors={['#1e1d6d', '#9b1300']}
          start={{ x: 0.5, y: 0 }} // Top center
          end={{ x: 0.5, y: 1 }} // Bottom center
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
        start={{ x: 1, y: 1 }} // Top Left
        end={{ x: 0, y: 0 }} // Bottom Right
        style={styles.formContainer}
      >
        <Text style={styles.formTitle}>Log In</Text>
        <Text style={styles.TextInput}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="JaneDoe@example.com"
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
        <View style={styles.rowContainer}>
          <View style={styles.rememberMeContainer}>
            <View style={styles.checkboxPlaceholder} />
            <Text style={styles.rememberMeText}>Remember me</Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[
            styles.customButton,
            {
              width: '50%',
              alignSelf: 'center',
            },
          ]}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity
          style={[styles.customButton, { marginBottom: 10 }]}
          onPress={handleGoogleLogin}
        >
          <Icon
            name="google"
            size={20}
            color="white"
            style={{ marginRight: 10 }}
          />
          <Text
            style={[styles.buttonText, { fontFamily: FONTS.PoppinsRegular }]}
          >
            Sign in with Google
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signupContainer}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.footerText}>
            Don’t have an account?{' '}
            <Text style={styles.signupLink}>Sign up</Text>
          </Text>
        </TouchableOpacity>
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
    marginTop: -600, // Adjust to overlap the form
    marginBottom: -650, // Adjust to overlap the form
    zIndex: 1, // Keeps it below the form if needed, but order handles this
  },
  formContainer: {
    backgroundColor: COLORS.primaryLight,
    borderTopLeftRadius: 50, // Rounded top corners
    borderTopRightRadius: 50,
    paddingHorizontal: 50,
    paddingTop: 10,
    width: '100%',
    height: '70%',
    top: '38%',
    marginTop: -170,
    zIndex: 2, // Ensures it appears above the background and image
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
    fontSize: 38,
    marginBottom: -5,
    color: COLORS.textContrast,
  },
  TextInput: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 16,
    marginBottom: 3,
    color: COLORS.textContrast,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 15,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15, // Space before the Confirm button
    marginTop: -5, // Pull it slightly closer to the password input
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxPlaceholder: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Subtle fill
  },
  rememberMeText: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
  },
  forgotPasswordText: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5, // Adjust space above and below the divider
    width: '100%',
  },
  line: {
    flex: 1, // This makes the line take up all available horizontal space
    height: 1, // Thickness of the line
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent white
  },
  orText: {
    marginHorizontal: 10,
    color: '#fff',
    fontFamily: FONTS.PoppinsRegular, // Using your Poppins font
    fontSize: 14,
  },
  customButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#fff',
    paddingVertical: 7,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',

    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: FONTS.PoppinsBold, // Using your new Poppins font!
    fontSize: 16,
  },
  signupContainer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.8)', // Slightly dimmed white
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 14,
  },
  signupLink: {
    color: '#fff',
    fontFamily: FONTS.PoppinsBold,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
