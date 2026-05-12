// filepath: src/screens/main/HeroResultScreen.tsx
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
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import { COLORS } from '../../styles/colors';
import { FONTS } from '../../styles/typography';
import AssessmentHeader from '../../components/AssessmentHeader';

type Props = NativeStackScreenProps<MainStackParamList, 'HeroResult'>;

// ── Mock hero data ────────────────────────────────────────────────────────────
const hero = {
  name: 'Jose Rizal',
  tagline: 'Ilustrado · Manunulat · Bayani ng Bansa',
  era: '1861 – 1896',
  tag: 'ILUSTRADO',
  description:
    'Your personality aligns with the national hero of the Philippines. Like Rizal, you value education, intellect, and peaceful reform. You believe that the pen is mightier than the sword.',
  traits: [
    { iconName: 'book', label: 'Makatalino', sublabel: 'Intellectual' },
    { iconName: 'pencil', label: 'Malikhaing', sublabel: 'Creative' },
    { iconName: 'heart', label: 'Makatao', sublabel: 'Humanist' },
    { iconName: 'globe', label: 'Makabayan', sublabel: 'Nationalist' },
  ],
  matchScore: 92,
};

// ── Trait badge ───────────────────────────────────────────────────────────────
function TraitBadge({ item }: { item: (typeof hero.traits)[0] }) {
  return (
    <View style={styles.traitBadge}>
      <View style={styles.traitIconWrap}>
        <Icon name={item.iconName} size={14} color={COLORS.primary} />
      </View>
      <Text style={styles.traitLabel}>{item.label}</Text>
      <Text style={styles.traitSublabel}>{item.sublabel}</Text>
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function HeroResultScreen({ navigation }: Props) {
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(30)).current;
  const portraitScale = useRef(new Animated.Value(0.85)).current;
  const portraitFade = useRef(new Animated.Value(0)).current;
  const scoreAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(portraitFade, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(portraitScale, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(contentFade, {
        toValue: 1,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.spring(contentSlide, {
        toValue: 0,
        delay: 300,
        tension: 55,
        useNativeDriver: true,
      }),
      Animated.timing(scoreAnim, {
        toValue: hero.matchScore,
        duration: 1200,
        delay: 500,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Ang aking Bayani ay si ${hero.name}! Alamin ang sa iyo sa BAYANI app. 🇵🇭`,
      });
    } catch {}
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
        translucent={false}
      />

      {/* ── Shared header — step 3 (0-based) = 100 % progress ── */}
      <AssessmentHeader
        currentStep={3}
        title="RESULTA"
        baybayinLabel="ᜇᜒᜊᜎ"
        subtitle="★ Iyong Bayani ★"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Portrait card ── */}
        <Animated.View
          style={[
            styles.portraitCard,
            { opacity: portraitFade, transform: [{ scale: portraitScale }] },
          ]}
        >
          {/* Decorative corner accents */}
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />

          {/* Tag */}
          <View style={styles.heroTag}>
            <Text style={styles.heroTagText}>{hero.tag}</Text>
          </View>

          {/* Portrait placeholder — replace with actual Image */}
          <View style={styles.portraitPlaceholder}>
            <Icon name="user-circle" size={72} color={COLORS.primaryLight} />
            <Text style={styles.portraitPlaceholderLabel}>
              AI Transformed Image
            </Text>
          </View>

          {/* Era badge */}
          <View style={styles.eraBadge}>
            <Icon name="calendar" size={10} color={COLORS.primaryLight} />
            <Text style={styles.eraText}> {hero.era}</Text>
          </View>
        </Animated.View>

        {/* ── Hero name & match score ── */}
        <Animated.View
          style={[
            styles.nameCard,
            { opacity: contentFade, transform: [{ translateY: contentSlide }] },
          ]}
        >
          <View style={styles.cardOrnRow}>
            <View style={styles.cardOrnLine} />
            <Text style={styles.cardOrnStar}>✦</Text>
            <View style={styles.cardOrnLine} />
          </View>

          <Text style={styles.heroName}>{hero.name}</Text>
          <Text style={styles.heroTagline}>{hero.tagline}</Text>

          {/* Match score bar */}
          <View style={styles.matchRow}>
            <View style={styles.matchLabelRow}>
              <Icon name="star" size={11} color={COLORS.primaryLight} />
              <Text style={styles.matchLabel}> Antas ng Pagkakatugma</Text>
            </View>
            <Animated.Text style={styles.matchScore}>
              {scoreAnim.interpolate({
                inputRange: [0, hero.matchScore],
                outputRange: ['0%', `${hero.matchScore}%`],
              })}
            </Animated.Text>
          </View>
          <View style={styles.matchBarBg}>
            <Animated.View
              style={[
                styles.matchBarFill,
                {
                  width: scoreAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            >
              <View style={styles.matchSheen} />
            </Animated.View>
          </View>

          <Text style={styles.heroDescription}>{hero.description}</Text>
        </Animated.View>

        {/* ── Traits grid ── */}
        <Animated.View
          style={[
            styles.traitsSection,
            { opacity: contentFade, transform: [{ translateY: contentSlide }] },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionBay}>ᜃᜆᜄᜈ᜔</Text>
            <Text style={styles.sectionTitle}>Mga Katangian Mo</Text>
          </View>
          <View style={styles.traitsGrid}>
            {hero.traits.map((t, i) => (
              <TraitBadge key={i} item={t} />
            ))}
          </View>
        </Animated.View>

        {/* ── Action buttons ── */}
        <Animated.View
          style={[
            styles.actionsWrap,
            { opacity: contentFade, transform: [{ translateY: contentSlide }] },
          ]}
        >
          <View style={styles.ctaOrnRow}>
            <View style={styles.ornLine} />
            <Text style={styles.ctaOrnText}>✦ SUSUNOD NA HAKBANG ✦</Text>
            <View style={styles.ornLine} />
          </View>

          {/* Primary: save to collection */}
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('MainTabs')}
            activeOpacity={0.85}
          >
            <Icon name="bookmark" size={15} color={COLORS.textContrast} />
            <Text style={styles.primaryBtnText}> I-save sa Koleksyon</Text>
          </TouchableOpacity>

          {/* Secondary row */}
          <View style={styles.secondaryRow}>
            <TouchableOpacity style={styles.secondaryBtn} onPress={handleShare}>
              <Icon name="share-alt" size={14} color={COLORS.primary} />
              <Text style={styles.secondaryBtnText}> Ibahagi</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => navigation.navigate('PersonalityTest')}
            >
              <Icon name="repeat" size={13} color={COLORS.primary} />
              <Text style={styles.secondaryBtnText}> Ulit-Araling</Text>
            </TouchableOpacity>
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
  scrollContent: { paddingHorizontal: 16, paddingTop: 8 },

  // ── Portrait card ──
  portraitCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.secondary,
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
    marginBottom: 16,
    position: 'relative',
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  corner: { position: 'absolute', width: 20, height: 20 },
  cornerTL: {
    top: 10,
    left: 10,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: COLORS.primaryLight,
    borderRadius: 2,
  },
  cornerTR: {
    top: 10,
    right: 10,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: COLORS.primaryLight,
    borderRadius: 2,
  },
  cornerBL: {
    bottom: 10,
    left: 10,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: COLORS.primaryLight,
    borderRadius: 2,
  },
  cornerBR: {
    bottom: 10,
    right: 10,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: COLORS.primaryLight,
    borderRadius: 2,
  },
  heroTag: {
    position: 'absolute',
    top: 14,
    right: 36,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  heroTagText: {
    fontFamily: FONTS.PoppinsBold,
    fontSize: 8,
    color: COLORS.textContrast,
    letterSpacing: 1.5,
  },
  portraitPlaceholder: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: COLORS.background,
    borderWidth: 3,
    borderColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 10,
  },
  portraitPlaceholderLabel: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 10,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  eraBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  eraText: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 11,
    color: COLORS.textSecondary,
  },

  // ── Name card ──
  nameCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
    marginBottom: 14,
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
  heroName: {
    fontFamily: FONTS.kawitBold,
    fontSize: 28,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  heroTagline: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 11,
    color: COLORS.primaryLight,
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 18,
  },

  // Match score
  matchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  matchLabelRow: { flexDirection: 'row', alignItems: 'center' },
  matchLabel: {
    fontFamily: FONTS.PoppinsBold,
    fontSize: 10,
    color: COLORS.textSecondary,
    letterSpacing: 1.2,
  },
  matchScore: {
    fontFamily: FONTS.kawitBold,
    fontSize: 16,
    color: COLORS.primary,
  },
  matchBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    overflow: 'hidden',
    marginBottom: 16,
  },
  matchBarFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    overflow: 'hidden',
  },
  matchSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
  },

  heroDescription: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 21,
    textAlign: 'center',
  },

  // ── Traits ──
  traitsSection: { marginBottom: 14 },
  sectionHeader: { marginBottom: 12 },
  sectionBay: {
    fontFamily: FONTS.baybayin,
    fontSize: 10,
    color: COLORS.primaryLight,
    letterSpacing: 3,
    marginBottom: -1,
  },
  sectionTitle: {
    fontFamily: FONTS.kawitBold,
    fontSize: 17,
    color: COLORS.primary,
  },
  traitsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  traitBadge: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
    padding: 14,
    alignItems: 'center',
    gap: 6,
  },
  traitIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#fff5f0',
    borderWidth: 1,
    borderColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  traitLabel: {
    fontFamily: FONTS.PoppinsBold,
    fontSize: 12,
    color: COLORS.primary,
  },
  traitSublabel: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 10,
    color: COLORS.textSecondary,
  },

  // ── Actions ──
  actionsWrap: { gap: 10 },
  ctaOrnRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ornLine: { flex: 1, height: 1, backgroundColor: COLORS.secondary },
  ctaOrnText: {
    fontFamily: FONTS.PoppinsBold,
    fontSize: 8,
    color: COLORS.primaryLight,
    letterSpacing: 1.5,
  },
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
  secondaryRow: { flexDirection: 'row', gap: 10 },
  secondaryBtn: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
  },
  secondaryBtnText: {
    color: COLORS.primary,
    fontFamily: FONTS.PoppinsBold,
    fontSize: 13,
  },
});
