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
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import { COLORS } from '../../styles/colors';
import { FONTS } from '../../styles/typography';
import AssessmentHeader from '../../components/AssessmentHeader';

type Props = NativeStackScreenProps<MainStackParamList, 'Camera'>;

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
  const [photoTaken, setPhotoTaken] = useState(false);

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
    if (photoTaken) return;
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
  }, [photoTaken]);

  const handleTakePhoto = () => {
    Alert.alert(
      'Kumuha ng Larawan',
      'Camera functionality will be implemented using react-native-camera or expo-camera.',
      [
        { text: 'I-simulate', onPress: () => setPhotoTaken(true) },
        { text: 'Kanselahin', style: 'cancel' },
      ],
    );
  };

  const handleTransform = () => {
    if (photoTaken) navigation.navigate('HeroResult');
    else Alert.alert('Walang Larawan', 'Kumuha muna ng larawan.');
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
        translucent={false}
      />

      {/* ── Shared header — step 2 (0-based) = 75 % progress ── */}
      <AssessmentHeader
        currentStep={2}
        title="LARAWAN"
        baybayinLabel="ᜎᜇᜏᜈ᜔"
        subtitle="★ AI Face Transform ★"
        onBack={() => navigation.goBack()}
        actionLabel={photoTaken ? 'Susunod' : undefined}
        actionEnabled={photoTaken}
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
              Maging Bayani{'\n'}sa Isang Kisap-Mata
            </Text>
            <Text style={styles.introBody}>
              Our AI will transform your photo into the likeness of your matched
              historical Filipino hero.
            </Text>
          </View>

          {/* ── Camera viewfinder ── */}
          <View
            style={[styles.viewfinder, photoTaken && styles.viewfinderDone]}
          >
            {/* Corner brackets */}
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />

            {photoTaken ? (
              <View style={styles.capturedState}>
                <View style={styles.capturedIconCircle}>
                  <Icon name="check" size={32} color={COLORS.textContrast} />
                </View>
                <Text style={styles.capturedLabel}>Nakunan na!</Text>
                <Text style={styles.capturedSublabel}>
                  Handa na para sa AI transformation
                </Text>
              </View>
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
          {!photoTaken && (
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
                photoTaken && styles.secondaryOutlineBtn,
              ]}
              onPress={handleTakePhoto}
              activeOpacity={0.85}
            >
              <Icon
                name={photoTaken ? 'repeat' : 'camera'}
                size={16}
                color={photoTaken ? COLORS.primary : COLORS.textContrast}
              />
              <Text
                style={[
                  styles.primaryBtnText,
                  photoTaken && styles.secondaryOutlineBtnText,
                ]}
              >
                {' '}
                {photoTaken ? 'Kumuha Ulit' : 'Kumuha ng Larawan'}
              </Text>
            </TouchableOpacity>

            {photoTaken && (
              <>
                <View style={styles.ctaOrnRow}>
                  <View style={styles.ornLine} />
                  <Text style={styles.ctaOrnText}>✦ HANDA NA ✦</Text>
                  <View style={styles.ornLine} />
                </View>
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
              </>
            )}
          </View>
        </Animated.View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
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
  // Captured state
  capturedState: { alignItems: 'center', gap: 10 },
  capturedIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  capturedLabel: {
    fontFamily: FONTS.kawitBold,
    fontSize: 18,
    color: COLORS.primary,
  },
  capturedSublabel: {
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
