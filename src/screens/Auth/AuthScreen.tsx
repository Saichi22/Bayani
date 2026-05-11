import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StatusBar,
  StyleSheet,
  Dimensions,
  Pressable,
  Animated,
  Modal,
} from 'react-native';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';

const BG = '#f7f2e8';
const ACCENT = '#bf592b';
const SILHOUETTE_COLOR = '#1a1008';

const { width, height } = Dimensions.get('window');

export default function AuthScreen() {
  const [activeModal, setActiveModal] = useState<'login' | 'signup' | null>(
    null,
  );
  const slideAnim = useRef(new Animated.Value(0)).current;

  const openModal = (type: 'login' | 'signup') => {
    setActiveModal(type);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: false,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setActiveModal(null);
    });
  };

  const slidePosition = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Text block — pushed toward upper-center */}
      <View style={styles.textBlock}>
        <Text style={styles.welcomeText}>WELCOME TO</Text>
        <Text style={styles.titleText}>BAYANI</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <Pressable style={styles.button} onPress={() => openModal('login')}>
          <Text style={styles.buttonText}>LOG-IN</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => openModal('signup')}>
          <Text style={styles.buttonText}>SIGN-UP</Text>
        </Pressable>
      </View>

      {/* Silhouette pinned to the bottom, full width */}
      <Image
        source={require('../../assets/hero.png')}
        style={styles.heroImage}
        resizeMode="cover"
        tintColor={SILHOUETTE_COLOR}
      />

      {/* Bottom Sheet Modal */}
      <Modal
        visible={activeModal !== null}
        transparent
        animationType="none"
        onRequestClose={closeModal}
      >
        <Pressable style={styles.overlay} onPress={closeModal} />
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              transform: [{ translateY: slidePosition }],
            },
          ]}
        >
          {/* Portrait + Header */}
          <View style={styles.sheetHeader}>
            <Image
              source={require('../../assets/portrait.png')}
              style={styles.portrait}
              resizeMode="contain"
            />
            <Text style={styles.sheetTitle}>MABUHAY!</Text>
            <Text style={styles.sheetSubtitle}>PILIPINAS!</Text>
          </View>

          {/* Form Container */}
          <View style={styles.formContainer}>
            {activeModal === 'login' && <LoginScreen />}
            {activeModal === 'signup' && <SignupScreen />}
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'space-between', // text top, image bottom
  },
  textBlock: {
    alignItems: 'center',
    marginTop: height * 0.14, // ~14% from top — sits in upper-center
  },
  welcomeText: {
    fontSize: 13,
    letterSpacing: 3,
    color: '#1a1008',
    fontFamily: 'Poppins',
    fontWeight: '600',
  },
  titleText: {
    fontSize: 58,
    color: ACCENT,
    marginTop: 4,
    fontFamily: 'KawitExtended',
    lineHeight: 64,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    backgroundColor: ACCENT,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 1,
  },
  heroImage: {
    width: width, // full screen width, edge-to-edge
    height: height * 0.42, // ~42% of screen height
    // no margin/padding — flush to the bottom
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: height * 0.7,
    backgroundColor: ACCENT,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingTop: 12,
  },
  sheetHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  portrait: {
    width: 100,
    height: 120,
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 2,
  },
  sheetSubtitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
  },
  formContainer: {
    flex: 1,
  },
});
