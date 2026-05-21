import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
  StatusBar,
  ImageBackground,
  Image,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { COLORS } from '../../styles/colors';
import { FONTS } from '../../styles/typography';

type Props = BottomTabScreenProps<MainTabParamList, 'Assessment'>;

// ── How It Works steps ────────────────────────────────────────────────────────
const HOW_IT_WORKS = [
  {
    id: '1',
    iconName: 'question-circle',
    title: 'Answer the Questions',
    body: 'Answer situational dilemmas drawn from real historical events.',
  },
  {
    id: '2',
    iconName: 'shield',
    title: 'Choose Your Path',
    body: 'Choose between courage in combat or wisdom in command.',
  },
  {
    id: '3',
    iconName: 'trophy',
    title: 'Meet Your Hero',
    body: 'Get matched with a historical Filipino hero who shares your spirit.',
  },
];

// ── Nav options ───────────────────────────────────────────────────────────────
const NAV_CARDS = [
  {
    id: 'test',
    iconName: 'pencil',
    label: 'Start Test',
    sublabel: 'Personality Test',
    screen: 'PersonalityTest' as keyof MainStackParamList,
    primary: true,
  },
  {
    id: 'demo',
    iconName: 'user',
    label: 'Set Up Profile',
    sublabel: 'Demographic Profile',
    screen: 'DemographicProfile' as keyof MainStackParamList,
    primary: false,
  },
];

// ── Step Card ─────────────────────────────────────────────────────────────────
function StepCard({
  step,
  index,
  fadeAnim,
  slideAnim,
}: {
  step: (typeof HOW_IT_WORKS)[0];
  index: number;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}) {
  return (
    <Animated.View
      style={[
        styles.stepCard,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {/* Number + icon column */}
      <View style={styles.stepLeft}>
        <View style={styles.stepNumberCircle}>
          <Text style={styles.stepNumber}>{index + 1}</Text>
        </View>
        {index < HOW_IT_WORKS.length - 1 && (
          <View style={styles.stepVerticalLine} />
        )}
      </View>

      {/* Content */}
      <View style={styles.stepBody}>
        <View style={styles.stepIconRow}>
          <View style={styles.stepIconWrap}>
            <Icon name={step.iconName} size={16} color={COLORS.primary} />
          </View>
          <Text style={styles.stepTitle}>{step.title}</Text>
        </View>
        <Text style={styles.stepBodyText}>{step.body}</Text>
      </View>
    </Animated.View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
function AssessmentScreen() {
  const user = {
    name: 'Pamana',
    photo: 'https://lh3.googleusercontent.com/a/ACg8ocL...',
  };
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const logout = useAuthStore(state => state.logout);

  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-16)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(30)).current;

  // Per-step animations
  const stepAnims = HOW_IT_WORKS.map((_, i) => ({
    fade: useRef(new Animated.Value(0)).current,
    slide: useRef(new Animated.Value(20)).current,
  }));

  useEffect(() => {
    // Header entrance
    Animated.parallel([
      Animated.timing(headerFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(headerSlide, {
        toValue: 0,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();

    // Content card entrance
    Animated.parallel([
      Animated.timing(contentFade, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.spring(contentSlide, {
        toValue: 0,
        delay: 200,
        tension: 55,
        useNativeDriver: true,
      }),
    ]).start();

    // Stagger step cards
    stepAnims.forEach(({ fade, slide }, i) => {
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 1,
          duration: 400,
          delay: 350 + i * 100,
          useNativeDriver: true,
        }),
        Animated.spring(slide, {
          toValue: 0,
          delay: 350 + i * 100,
          tension: 70,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  const handleNavigate = (screen: keyof MainStackParamList) => {
    navigation.navigate(screen as any);
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
        translucent={false}
      />

      {/* ── Top Bar (matches HomeScreen) ── */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuBtn}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>

        <View style={styles.appNameWrap}>
          {/* Baybayin accent above app name */}
          <Text style={styles.appBaybayin}>ᜉᜋᜈ</Text>
          <Text style={styles.appName}>Mabuhay!</Text>
        </View>

        <TouchableOpacity style={styles.avatarBtn} onPress={handleLogout}>
          {user?.photo ? (
            <Image source={{ uri: user.photo }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* ── Baybayin Strip ── */}
      <View style={styles.baybayinStrip}>
        <Text style={styles.baybayinText}>
          ᜊᜌᜊᜈᜒ · ᜉᜋᜈ · ᜃᜐᜌᜐᜌᜈ · ᜉᜒᜎᜒᜉᜒᜈᜎ ·
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Hero Banner ── */}
        <ImageBackground
          source={require('../../assets/images/bayaniPortrait.png')}
          style={styles.heroBanner}
          resizeMode="cover"
        >
          <View style={styles.bannerOverlayDark} />
          <View style={styles.bannerOverlayColor} />

          {/* Top ornament */}
          <View style={styles.bannerTopOrn}>
            <View style={styles.ornLine} />
            <Text style={styles.ornBay}>ᜉᜄ᜔ᜐᜓᜊᜓᜃ᜔</Text>
            <View style={styles.ornLine} />
          </View>

          <Text style={styles.bannerTagline}>Discover Your</Text>
          <Text style={styles.bannerTitle}>PERSONALITY</Text>
          <Text style={styles.bannerDots}>✦ ✦ ✦</Text>
        </ImageBackground>

        {/* ── Intro card ── */}
        <Animated.View
          style={[
            styles.introCard,
            { opacity: contentFade, transform: [{ translateY: contentSlide }] },
          ]}
        >
          {/* Ornament */}
          <View style={styles.cardOrnRow}>
            <View style={styles.cardOrnLine} />
            <Text style={styles.cardOrnStar}>✦</Text>
            <View style={styles.cardOrnLine} />
          </View>

          <Text style={styles.introTitle}>
            Who is the Bayani{'\n'}In Your Heart?
          </Text>
          <Text style={styles.introBody}>
            Discover which historical Filipino hero matches your personality
            through a short but meaningful assessment.
          </Text>

          {/* Stats pill row */}
          <View style={styles.statsPillRow}>
            {[
              { icon: 'clock-o', value: '5 min', label: 'Duration' },
              { icon: 'list-ul', value: '5', label: 'Questions' },
              { icon: 'users', value: '150+', label: 'Heroes' },
            ].map((s, i) => (
              <View key={i} style={styles.statPill}>
                <Icon name={s.icon} size={13} color={COLORS.primaryLight} />
                <Text style={styles.statPillValue}>{s.value}</Text>
                <Text style={styles.statPillLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* ── How it works ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionBay}>ᜉᜄ᜔ᜐᜓᜊᜓᜃ᜔</Text>
          <Text style={styles.sectionTitle}>How It Works</Text>
        </View>

        <View style={styles.stepsWrap}>
          {HOW_IT_WORKS.map((step, i) => (
            <StepCard
              key={step.id}
              step={step}
              index={i}
              fadeAnim={stepAnims[i].fade}
              slideAnim={stepAnims[i].slide}
            />
          ))}
        </View>

        {/* ── CTA cards ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionBay}>ᜊᜌᜈᜒ</Text>
          <Text style={styles.sectionTitle}>Get Started</Text>
        </View>

        {NAV_CARDS.map(card => (
          <TouchableOpacity
            key={card.id}
            style={[styles.navCard, card.primary && styles.navCardPrimary]}
            onPress={() => handleNavigate(card.screen)}
            activeOpacity={0.85}
          >
            <View
              style={[
                styles.navCardIconWrap,
                card.primary && styles.navCardIconWrapPrimary,
              ]}
            >
              <Icon
                name={card.iconName}
                size={20}
                color={card.primary ? COLORS.textContrast : COLORS.primary}
              />
            </View>

            <View style={styles.navCardText}>
              <Text
                style={[
                  styles.navCardLabel,
                  card.primary && styles.navCardLabelPrimary,
                ]}
              >
                {card.label}
              </Text>
              <Text
                style={[
                  styles.navCardSublabel,
                  card.primary && styles.navCardSublabelPrimary,
                ]}
              >
                {card.sublabel}
              </Text>
            </View>

            <Icon
              name="chevron-right"
              size={13}
              color={
                card.primary ? 'rgba(255,255,255,0.6)' : COLORS.primaryLight
              }
            />
          </TouchableOpacity>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 12,
  },

  // ── Top Bar ──
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 8 : 40,
    height: Platform.OS === 'ios' ? 60 : 85,
    paddingBottom: 10,
    backgroundColor: COLORS.background,
    zIndex: 10,
  },
  menuBtn: { padding: 6 },
  menuIcon: { fontSize: 22, color: COLORS.primary },
  appNameWrap: { alignItems: 'center' },
  appBaybayin: {
    fontFamily: FONTS.baybayin,
    fontSize: 10,
    color: COLORS.primaryLight,
    letterSpacing: 2,
    marginBottom: -2,
  },
  appName: {
    fontFamily: FONTS.kawitBold,
    fontSize: 20,
    letterSpacing: 5,
    color: COLORS.primary,
  },
  avatarBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    borderColor: COLORS.primary, // or your preferred gold/brown color
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  // Update your existing placeholder to ensure it fills the button
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.secondary, // Or a nice heritage color
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: FONTS.PoppinsBold,
  },

  // ── Baybayin Strip ──
  baybayinStrip: {
    backgroundColor: COLORS.primary,
    paddingVertical: 5,
  },
  baybayinText: {
    fontFamily: FONTS.baybayin,
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 4,
    textAlign: 'center',
  },

  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 20 },

  // ── Hero Banner ──
  heroBanner: {
    width: '100%',
    height: 200,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 22,
  },
  bannerOverlayDark: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.48)',
  },
  bannerOverlayColor: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(191,89,43,0.22)',
  },
  bannerTopOrn: {
    position: 'absolute',
    top: 18,
    left: 32,
    right: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ornLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  ornBay: {
    fontFamily: FONTS.baybayin,
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 3,
  },
  bannerTagline: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 4,
    position: 'relative',
  },
  bannerTitle: {
    fontFamily: FONTS.kawitBold,
    fontSize: 46,
    color: COLORS.textContrast,
    letterSpacing: 8,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
    position: 'relative',
  },
  bannerDots: {
    color: COLORS.primaryLight,
    fontSize: 11,
    letterSpacing: 8,
    marginTop: 4,
    position: 'relative',
  },

  // ── Intro Card ──
  introCard: {
    marginHorizontal: 16,
    marginTop: -20,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
    elevation: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    zIndex: 2,
  },
  cardOrnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  cardOrnLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.secondary,
  },
  cardOrnStar: {
    color: COLORS.primaryLight,
    fontSize: 9,
  },
  introTitle: {
    fontFamily: FONTS.kawitBold,
    fontSize: 24,
    color: COLORS.primary,
    lineHeight: 30,
    marginBottom: 10,
  },
  introBody: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 21,
    marginBottom: 18,
  },

  // ── Stats Pills ──
  statsPillRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statPill: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  statPillValue: {
    fontFamily: FONTS.kawitBold,
    fontSize: 16,
    color: COLORS.primary,
    marginTop: 2,
  },
  statPillLabel: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 9,
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },

  // ── Section Header ──
  sectionHeader: {
    paddingHorizontal: 18,
    marginTop: 26,
    marginBottom: 14,
  },
  sectionBay: {
    fontFamily: FONTS.baybayin,
    fontSize: 10,
    color: COLORS.primaryLight,
    letterSpacing: 3,
    marginBottom: -2,
  },
  sectionTitle: {
    fontFamily: FONTS.kawitBold,
    fontSize: 18,
    color: COLORS.primary,
  },

  // ── Steps ──
  stepsWrap: {
    paddingHorizontal: 16,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 72,
  },
  stepLeft: {
    width: 44,
    alignItems: 'center',
  },
  stepNumberCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
  },
  stepNumber: {
    fontFamily: FONTS.kawitBold,
    fontSize: 16,
    color: COLORS.textContrast,
  },
  stepVerticalLine: {
    width: 1.5,
    flex: 1,
    minHeight: 28,
    borderLeftWidth: 1.5,
    borderLeftColor: COLORS.secondary,
    borderStyle: 'dashed',
    marginTop: 5,
    marginBottom: 0,
  },
  stepBody: {
    flex: 1,
    marginLeft: 14,
    paddingBottom: 20,
  },
  stepIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 5,
  },
  stepIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#fff5f0',
    borderWidth: 1,
    borderColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTitle: {
    fontFamily: FONTS.PoppinsBold,
    fontSize: 13,
    color: COLORS.primary,
    flex: 1,
  },
  stepBodyText: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },

  // ── Nav Cards ──
  navCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 18,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  navCardPrimary: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryLight,
  },
  navCardIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#fff5f0',
    borderWidth: 1,
    borderColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navCardIconWrapPrimary: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderColor: 'rgba(255,255,255,0.25)',
  },
  navCardText: { flex: 1 },
  navCardLabel: {
    fontFamily: FONTS.kawitBold,
    fontSize: 15,
    color: COLORS.primary,
    marginBottom: 2,
  },
  navCardLabelPrimary: {
    color: COLORS.textContrast,
  },
  navCardSublabel: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  navCardSublabelPrimary: {
    color: 'rgba(255,255,255,0.65)',
  },
});

export default AssessmentScreen;
