// filepath: src/screens/main/CameraScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
  StatusBar,
  Alert,
  Image,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import { launchCamera, ImagePickerResponse } from 'react-native-image-picker';
import { api } from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import { COLORS } from '../../styles/colors';
import { FONTS } from '../../styles/typography';
import AssessmentHeader from '../../components/AssessmentHeader';

type Props = NativeStackScreenProps<MainStackParamList, 'Camera'>;

const bayaniBackground = require('../../assets/images/bayaniBackground.png');

// ── Tip row ───────────────────────────────────────────────────────────────────
function TipRow({ iconName, text }: { iconName: string; text: string }) {
  return (
    <View style={styles.tipRow}>
      <View style={styles.tipIconWrap}>
        <Icon name={iconName} size={13} color={COLORS.primary} />
      </View>
      <Text style={styles.tipText}>{text}</Text>
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function CameraScreen({ navigation }: Props) {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [base64Data, setBase64Data] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const user = useAuthStore(state => state.user);

  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(24)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(contentFade, {
        toValue: 1,
        duration: 500,
        delay: 150,
        useNativeDriver: true,
      }),
      Animated.spring(contentSlide, {
        toValue: 0,
        delay: 150,
        tension: 55,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Pulse the camera icon when no photo taken
  useEffect(() => {
    if (photoUri) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [photoUri]);

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

      if (response.didCancel) return;

      if (response.errorCode) {
        Alert.alert(
          'Camera Error',
          response.errorMessage || 'Unknown error occurred',
        );
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
      Alert.alert('Walang Larawan', 'Kumuha muna ng larawan.');
      return;
    }

    setIsLoading(true);
    try {
      const base64Photo = `data:image/jpeg;base64,${base64Data}`;

      const response = await api.post('/mashup/generate-rizal', {
        userId: user?.id || 'anonymous',
        base64Photo,
      });

      const mashupId = response.data.id;
      let status = 'PENDING';
      let imageUrl = null;

      while (status === 'PENDING') {
        await new Promise(resolve => setTimeout(() => resolve(null), 5000));

        const checkRes = await api.get(`/mashup/${mashupId}`);
        status = checkRes.data.status;

        if (status === 'COMPLETED') {
          imageUrl = checkRes.data.imageUrl;
        } else if (status === 'FAILED') {
          throw new Error('Image generation failed');
        }
      }

      navigation.navigate('HeroResult', { imageUrl });
    } catch (error) {
      console.error('Mashup API Error:', error);
      Alert.alert(
        'Transformation Failed',
        'Failed to communicate with the backend or image generation failed.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
        translucent={false}
      />

      <ImageBackground
        source={bayaniBackground}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        {/* ── Shared header — step 2 (0-based) = 75 % progress ── */}
        <AssessmentHeader
          currentStep={2}
          title="LARAWAN"
          baybayinLabel="ᜎᜇᜏᜈ᜔"
          subtitle="★ AI Face Transform ★"
          onBack={() => navigation.goBack()}
          actionLabel={photoUri ? 'Susunod' : undefined}
          actionEnabled={!!photoUri}
          onAction={handleTransform}
          actionIconName="arrow-right"
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={{
              opacity: contentFade,
              transform: [{ translateY: contentSlide }],
            }}
          >
            {/* ── Intro card ── */}
            <View style={styles.introCard}>
              <View style={styles.cardOrnRow}>
                <View style={styles.cardOrnLine} />
                <Text style={styles.cardOrnStar}>✦</Text>
                <View style={styles.cardOrnLine} />
              </View>
              <Text style={styles.introTitle}>
                Maging Bayani{'sa Isang Kisap-Mata'}
              </Text>
              <Text style={styles.introBody}>
                Our AI will transform your photo into the likeness of your matched
                historical Filipino hero.
              </Text>
            </View>

            {/* ── Camera viewfinder ── */}
            <View style={[styles.viewfinder, photoUri && styles.viewfinderDone]}>
              {/* Corner brackets */}
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />

              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.previewImage} />
              ) : (
                <View style={styles.idleState}>
                  <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                    <View style={styles.cameraIconCircle}>
                      <Icon name="camera" size={36} color={COLORS.primary} />
                    </View>
                  </Animated.View>
                  <Text style={styles.idleLabel}>Camera Preview</Text>
                  <Text style={styles.idleSublabel}>
                    Ilagay ang iyong mukha sa loob ng frame
                  </Text>
                </View>
              )}
            </View>

            {/* ── Tips ── */}
            {!photoUri && (
              <View style={styles.tipsCard}>
                <View style={styles.tipsHeader}>
                  <Icon
                    name="lightbulb-o"
                    size={13}
                    color={COLORS.primaryLight}
                  />
                  <Text style={styles.tipsTitle}> MGA TIPS</Text>
                </View>
                <TipRow
                  iconName="sun-o"
                  text="Siguraduhing maliwanag ang iyong paligid."
                />
                <TipRow iconName="eye" text="Tingnan nang diretso ang camera." />
                <TipRow iconName="user" text="Ipakita ang iyong buong mukha." />
              </View>
            )}

            {/* ── Buttons ── */}
            <View style={styles.btnGroup}>
              <TouchableOpacity
                style={[
                  styles.primaryBtn,
                  photoUri && styles.secondaryOutlineBtn,
                ]}
                onPress={handleTakePhoto}
                activeOpacity={0.85}
                disabled={isLoading}
              >
                <Icon
                  name={photoUri ? 'repeat' : 'camera'}
                  size={16}
                  color={photoUri ? COLORS.primary : COLORS.textContrast}
                />
                <Text
                  style={[
                    styles.primaryBtnText,
                    photoUri && styles.secondaryOutlineBtnText,
                  ]}
                >
                  {' '}
                  {photoUri ? 'Kumuha Ulit' : 'Kumuha ng Larawan'}
                </Text>
              </TouchableOpacity>

              {photoUri && (
                <>
                  <View style={styles.ctaOrnRow}>
                    <View style={styles.ornLine} />
                    <Text style={styles.ctaOrnText}>✦ HANDA NA ✦</Text>
                    <View style={styles.ornLine} />
                  </View>

                  {isLoading ? (
                    <View style={styles.loadingBtn}>
                      <ActivityIndicator size="small" color={COLORS.textContrast} />
                      <Text style={styles.primaryBtnText}> Ginagawa...</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.primaryBtn}
                      onPress={handleTransform}
                      activeOpacity={0.85}
                    >
                      <Icon name="magic" size={15} color={COLORS.textContrast} />
                      <Text style={styles.primaryBtnText}>
                        {' '}
                        I-transform sa Bayani
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          </Animated.View>

          <View style={{ height: 60 }} />
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  backgroundImage: {
    flex: 1,
    paddingTop: 12,
  },
  backgroundImageStyle: {
    opacity: 0.70,
    resizeMode: 'cover',
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 4 },

  // ── Intro card ──
  introCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
    marginBottom: 18,
    marginTop: 6,
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  cardOrnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  cardOrnLine: { flex: 1, height: 1, backgroundColor: COLORS.secondary },
  cardOrnStar: { color: COLORS.primaryLight, fontSize: 9 },
  introTitle: {
    fontFamily: FONTS.kawitBold,
    fontSize: 22,
    color: COLORS.primary,
    lineHeight: 28,
    marginBottom: 8,
  },
  introBody: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },

  // ── Viewfinder ──
  viewfinder: {
    height: 280,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  viewfinderDone: {
    borderColor: COLORS.primary,
    backgroundColor: '#fff8f5',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  // Corner brackets
  corner: {
    position: 'absolute',
    width: 22,
    height: 22,
  },
  cornerTL: {
    top: 12,
    left: 12,
    borderTopWidth: 2.5,
    borderLeftWidth: 2.5,
    borderColor: COLORS.primary,
    borderRadius: 2,
  },
  cornerTR: {
    top: 12,
    right: 12,
    borderTopWidth: 2.5,
    borderRightWidth: 2.5,
    borderColor: COLORS.primary,
    borderRadius: 2,
  },
  cornerBL: {
    bottom: 12,
    left: 12,
    borderBottomWidth: 2.5,
    borderLeftWidth: 2.5,
    borderColor: COLORS.primary,
    borderRadius: 2,
  },
  cornerBR: {
    bottom: 12,
    right: 12,
    borderBottomWidth: 2.5,
    borderRightWidth: 2.5,
    borderColor: COLORS.primary,
    borderRadius: 2,
  },
  // Idle state
  idleState: { alignItems: 'center', gap: 10 },
  cameraIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff5f0',
    borderWidth: 2,
    borderColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  idleLabel: {
    fontFamily: FONTS.kawitBold,
    fontSize: 16,
    color: COLORS.primary,
  },
  idleSublabel: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 24,
  },

  // ── Tips ──
  tipsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
    padding: 16,
    marginBottom: 18,
  },
  tipsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  tipsTitle: {
    fontFamily: FONTS.PoppinsBold,
    fontSize: 10,
    color: COLORS.primaryLight,
    letterSpacing: 2,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  tipIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: '#fff5f0',
    borderWidth: 1,
    borderColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipText: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 12,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 18,
  },

  // ── Buttons ──
  btnGroup: { gap: 12 },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  loadingBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
    opacity: 0.8,
  },
  primaryBtnText: {
    color: COLORS.textContrast,
    fontFamily: FONTS.PoppinsBold,
    fontSize: 15,
    letterSpacing: 0.5,
  },
  secondaryOutlineBtn: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.secondary,
  },
  secondaryOutlineBtnText: { color: COLORS.primary },
  ctaOrnRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ornLine: { flex: 1, height: 1, backgroundColor: COLORS.secondary },
  ctaOrnText: {
    fontFamily: FONTS.PoppinsBold,
    fontSize: 9,
    color: COLORS.primaryLight,
    letterSpacing: 2,
  },
});
