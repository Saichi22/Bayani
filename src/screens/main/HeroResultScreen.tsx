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
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import { COLORS } from '../../styles/colors';
import { FONTS } from '../../styles/typography';
import AssessmentHeader from '../../components/AssessmentHeader';
import { useHeroScoring } from '../../hooks/useHeroScoring';
import { HeroKey } from '../../store/heroScoring';
import { allQuestions } from '../../data/questions';
import { HeroMeta, HERO_CATALOGUE, FALLBACK_HERO, formatHeroKey } from '../../data/heroCatalogue';

type Props = NativeStackScreenProps<MainStackParamList, 'HeroResult'>;

// ── Trait badge ───────────────────────────────────────────────────────────────
function TraitBadge({ item }: { item: HeroMeta['traits'][0] }) {
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

// ── Runner-up badge (small) ───────────────────────────────────────────────────
function RunnerUpBadge({
  heroKey,
  score,
  maxScore,
}: {
  heroKey: HeroKey;
  score: number;
  maxScore: number;
}) {
  const pct  = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const meta = HERO_CATALOGUE[heroKey];

  return (
    <View style={styles.runnerUpBadge}>
      <View style={styles.runnerUpTag}>
        <Text style={styles.runnerUpTagText}>{meta?.tag ?? '—'}</Text>
      </View>
      <Text style={styles.runnerUpName} numberOfLines={1}>
        {meta?.name ?? formatHeroKey(heroKey)}
      </Text>
      <View style={styles.runnerUpBarBg}>
        <View style={[styles.runnerUpBarFill, { width: `${pct}%` as any }]} />
      </View>
      <Text style={styles.runnerUpPct}>{pct}%</Text>
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function HeroResultScreen({ route, navigation }: Props) {
  // Real AI-generated image URL passed from CameraScreen via navigation params.
  const imageUrl = route.params?.imageUrl ?? null;

  const { topHeroes, total, resetScores, heroMaxScores } = useHeroScoring();

  const MATCH_THRESHOLD = 75;
  const maxScoreMap     = heroMaxScores(allQuestions);

  const top3     = topHeroes(3);
  const primary  = top3[0] ?? null;
  const runners  = top3.slice(1);
  const heroMeta = primary ? (HERO_CATALOGUE[primary.hero] ?? FALLBACK_HERO) : FALLBACK_HERO;

  // Per-hero ceiling — a hero appearing in 14 questions has a max of 14, not 18.
  const primaryMaxScore = primary ? (maxScoreMap[primary.hero] ?? 1) : 1;

  // FIX: guard against divide-by-zero and clamp to 100.
  const matchPct =
    primary && primary.score > 0 && primaryMaxScore > 0
      ? Math.min(100, Math.round((primary.score / primaryMaxScore) * 100))
      : 0;

  // ── Animations ───────────────────────────────────────────────────────────
  const contentFade   = useRef(new Animated.Value(0)).current;
  const contentSlide  = useRef(new Animated.Value(30)).current;
  const portraitScale = useRef(new Animated.Value(0.85)).current;
  const portraitFade  = useRef(new Animated.Value(0)).current;
  const scoreAnim     = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(portraitFade,  { toValue: 1,        duration: 700,  useNativeDriver: true  }),
      Animated.spring(portraitScale, { toValue: 1,        tension: 50,    friction: 8, useNativeDriver: true }),
      Animated.timing(contentFade,   { toValue: 1,        duration: 600,  delay: 300,  useNativeDriver: true }),
      Animated.spring(contentSlide,  { toValue: 0,        delay: 300,     tension: 55, useNativeDriver: true }),
      Animated.timing(scoreAnim,     { toValue: matchPct, duration: 1200, delay: 500,  useNativeDriver: false }),
    ]).start();
  }, [matchPct]);

  const hasMatch = matchPct >= MATCH_THRESHOLD;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Ang aking Bayani ay si ${heroMeta.name}! Alamin ang sa iyo sa BAYANI app. 🇵🇭`,
      });
    } catch {}
  };

  const handleRetake = () => {
    resetScores();
    navigation.navigate('PersonalityTest');
  };

  // FIX: when matchPct is 0 the interpolation input range must not be [0, 0].
  // Use a safe upper bound of Math.max(matchPct, 1) only for the input range;
  // the output always maps correctly to '0%'–'<matchPct>%'.
  const scoreAnimInputMax = Math.max(matchPct, 1);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} translucent={false} />

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
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />

          <View style={styles.heroTag}>
            <Text style={styles.heroTagText}>
              {hasMatch ? heroMeta.tag : 'WALANG TUGMA'}
            </Text>
          </View>

          {hasMatch ? (
            imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.portraitImage} />
            ) : (
              <View style={styles.portraitPlaceholder}>
                <Icon name="user-circle" size={72} color={COLORS.primaryLight} />
                <Text style={styles.portraitPlaceholderLabel}>AI Transformed Image</Text>
              </View>
            )
          ) : (
            <View style={styles.portraitPlaceholder}>
              <Icon name="question-circle" size={72} color={COLORS.textSecondary} />
              <Text style={styles.portraitPlaceholderLabel}>Walang Katugmang Bayani</Text>
            </View>
          )}

          <View style={styles.eraBadge}>
            <Icon name="calendar" size={10} color={COLORS.primaryLight} />
            <Text style={styles.eraText}> {hasMatch ? heroMeta.era : '—'}</Text>
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

          <Text style={styles.heroName}>
            {hasMatch ? heroMeta.name : 'Walang Katugmang Bayani'}
          </Text>
          <Text style={styles.heroTagline}>
            {hasMatch ? heroMeta.tagline : 'No hero matched your profile'}
          </Text>

          {/* Match score bar */}
          <View style={styles.matchRow}>
            <View style={styles.matchLabelRow}>
              <Icon name="star" size={11} color={COLORS.primaryLight} />
              <Text style={styles.matchLabel}> Antas ng Pagkakatugma</Text>
            </View>
            <Animated.Text style={styles.matchScore}>
              {scoreAnim.interpolate({
                inputRange:  [0, scoreAnimInputMax],
                outputRange: ['0%', `${matchPct}%`],
              })}
            </Animated.Text>
          </View>
          <View style={styles.matchBarBg}>
            <Animated.View
              style={[
                styles.matchBarFill,
                {
                  width: scoreAnim.interpolate({
                    inputRange:  [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            >
              <View style={styles.matchSheen} />
            </Animated.View>
          </View>

          <Text style={styles.heroDescription}>
            {hasMatch
              ? heroMeta.description
              : 'Your answers did not align closely enough with any single hero. Try retaking the assessment to get a stronger match — your bayani is still out there.'}
          </Text>
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
            {heroMeta.traits.map((t, i) => (
              <TraitBadge key={i} item={t} />
            ))}
          </View>
        </Animated.View>

        {/* ── Runner-up heroes (positions 2 & 3) ── */}
        {hasMatch && runners.length > 0 && (
          <Animated.View
            style={[
              styles.runnersSection,
              { opacity: contentFade, transform: [{ translateY: contentSlide }] },
            ]}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionBay}>ᜊᜌᜈᜒ</Text>
              <Text style={styles.sectionTitle}>Iba pang Katugmang Bayani</Text>
            </View>
            <View style={styles.runnersRow}>
              {runners.map(r => (
                <RunnerUpBadge
                  key={r.hero}
                  heroKey={r.hero}
                  score={r.score}
                  maxScore={maxScoreMap[r.hero] ?? 1}
                />
              ))}
            </View>
          </Animated.View>
        )}

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

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={hasMatch ? () => navigation.navigate('MainTabs') : handleRetake}
            activeOpacity={0.85}
          >
            <Icon
              name={hasMatch ? 'bookmark' : 'repeat'}
              size={15}
              color={COLORS.textContrast}
            />
            <Text style={styles.primaryBtnText}>
              {hasMatch ? ' I-save sa Koleksyon' : ' Ulit-Araling'}
            </Text>
          </TouchableOpacity>

          <View style={styles.secondaryRow}>
            <TouchableOpacity style={styles.secondaryBtn} onPress={handleShare}>
              <Icon name="share-alt" size={14} color={COLORS.primary} />
              <Text style={styles.secondaryBtnText}> Ibahagi</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryBtn} onPress={handleRetake}>
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
  root:          { flex: 1, backgroundColor: COLORS.background, paddingTop: 12 },
  scroll:        { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8 },

  // ── Portrait card ──
  portraitCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24, borderWidth: 2, borderColor: COLORS.secondary,
    alignItems: 'center', paddingVertical: 28, paddingHorizontal: 20,
    marginBottom: 16, position: 'relative', elevation: 4,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12, shadowRadius: 8,
  },
  corner:    { position: 'absolute', width: 20, height: 20 },
  cornerTL:  { top: 10,    left: 10,  borderTopWidth: 2,    borderLeftWidth: 2,  borderColor: COLORS.primaryLight, borderRadius: 2 },
  cornerTR:  { top: 10,    right: 10, borderTopWidth: 2,    borderRightWidth: 2, borderColor: COLORS.primaryLight, borderRadius: 2 },
  cornerBL:  { bottom: 10, left: 10,  borderBottomWidth: 2, borderLeftWidth: 2,  borderColor: COLORS.primaryLight, borderRadius: 2 },
  cornerBR:  { bottom: 10, right: 10, borderBottomWidth: 2, borderRightWidth: 2, borderColor: COLORS.primaryLight, borderRadius: 2 },
  heroTag: {
    position: 'absolute', top: 14, right: 36,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6,
  },
  heroTagText: { fontFamily: FONTS.PoppinsBold, fontSize: 8, color: COLORS.textContrast, letterSpacing: 1.5 },
  portraitImage: {
    width: 180, height: 180, borderRadius: 90,
    borderWidth: 3, borderColor: COLORS.secondary, marginBottom: 10,
  },
  portraitPlaceholder: {
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: COLORS.background,
    borderWidth: 3, borderColor: COLORS.secondary,
    alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10,
  },
  portraitPlaceholderLabel: { fontFamily: FONTS.PoppinsRegular, fontSize: 10, color: COLORS.textSecondary, textAlign: 'center' },
  eraBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 20, borderWidth: 1, borderColor: COLORS.secondary,
  },
  eraText: { fontFamily: FONTS.PoppinsRegular, fontSize: 11, color: COLORS.textSecondary },

  // ── Name card ──
  nameCard: {
    backgroundColor: COLORS.surface, borderRadius: 22,
    padding: 20, borderWidth: 1.5, borderColor: COLORS.secondary,
    marginBottom: 14, elevation: 3,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6,
  },
  cardOrnRow:   { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  cardOrnLine:  { flex: 1, height: 1, backgroundColor: COLORS.secondary },
  cardOrnStar:  { color: COLORS.primaryLight, fontSize: 9 },
  heroName:     { fontFamily: FONTS.kawitBold, fontSize: 28, color: COLORS.primary, textAlign: 'center', marginBottom: 4 },
  heroTagline:  { fontFamily: FONTS.PoppinsRegular, fontSize: 11, color: COLORS.primaryLight, textAlign: 'center', letterSpacing: 1, marginBottom: 18 },

  matchRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  matchLabelRow: { flexDirection: 'row', alignItems: 'center' },
  matchLabel:    { fontFamily: FONTS.PoppinsBold, fontSize: 10, color: COLORS.textSecondary, letterSpacing: 1.2 },
  matchScore:    { fontFamily: FONTS.kawitBold, fontSize: 16, color: COLORS.primary },
  matchBarBg: {
    height: 8, borderRadius: 4, backgroundColor: COLORS.background,
    borderWidth: 1, borderColor: COLORS.secondary, overflow: 'hidden', marginBottom: 16,
  },
  matchBarFill:    { height: '100%', borderRadius: 4, backgroundColor: COLORS.primary, overflow: 'hidden' },
  matchSheen:      { position: 'absolute', top: 0, left: 0, right: 0, height: '40%', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4 },
  heroDescription: { fontFamily: FONTS.PoppinsRegular, fontSize: 13, color: COLORS.textSecondary, lineHeight: 21, textAlign: 'center' },

  // ── Traits ──
  traitsSection: { marginBottom: 14 },
  sectionHeader: { marginBottom: 12 },
  sectionBay:    { fontFamily: FONTS.baybayin, fontSize: 10, color: COLORS.primaryLight, letterSpacing: 3, marginBottom: -1 },
  sectionTitle:  { fontFamily: FONTS.kawitBold, fontSize: 17, color: COLORS.primary },
  traitsGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  traitBadge: {
    flexBasis: '47%', flexGrow: 1,
    backgroundColor: COLORS.surface, borderRadius: 14,
    borderWidth: 1.5, borderColor: COLORS.secondary,
    padding: 14, alignItems: 'center', gap: 6,
  },
  traitIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#fff5f0',
    borderWidth: 1, borderColor: COLORS.secondary,
    alignItems: 'center', justifyContent: 'center',
  },
  traitLabel:    { fontFamily: FONTS.PoppinsBold,   fontSize: 12, color: COLORS.primary    },
  traitSublabel: { fontFamily: FONTS.PoppinsRegular, fontSize: 10, color: COLORS.textSecondary },

  // ── Runner-ups ──
  runnersSection: { marginBottom: 14 },
  runnersRow:     { flexDirection: 'row', gap: 10 },
  runnerUpBadge: {
    flex: 1, backgroundColor: COLORS.surface,
    borderRadius: 14, borderWidth: 1.5, borderColor: COLORS.secondary,
    padding: 12, alignItems: 'center', gap: 6,
  },
  runnerUpTag: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4,
    borderWidth: 1, borderColor: COLORS.secondary,
  },
  runnerUpTagText: { fontFamily: FONTS.PoppinsBold, fontSize: 7, color: COLORS.primaryLight, letterSpacing: 1.2 },
  runnerUpName:    { fontFamily: FONTS.kawitBold, fontSize: 12, color: COLORS.primary, textAlign: 'center' },
  runnerUpBarBg:   { width: '100%', height: 5, borderRadius: 3, backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.secondary, overflow: 'hidden' },
  runnerUpBarFill: { height: '100%', borderRadius: 3, backgroundColor: COLORS.primaryLight },
  runnerUpPct:     { fontFamily: FONTS.PoppinsBold, fontSize: 10, color: COLORS.textSecondary },

  // ── Actions ──
  actionsWrap: { gap: 10 },
  ctaOrnRow:   { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ornLine:     { flex: 1, height: 1, backgroundColor: COLORS.secondary },
  ctaOrnText:  { fontFamily: FONTS.PoppinsBold, fontSize: 8, color: COLORS.primaryLight, letterSpacing: 1.5 },
  primaryBtn: {
    backgroundColor: COLORS.primary, borderRadius: 50, paddingVertical: 16,
    alignItems: 'center', flexDirection: 'row', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.primaryLight,
  },
  primaryBtnText: { color: COLORS.textContrast, fontFamily: FONTS.PoppinsBold, fontSize: 15, letterSpacing: 0.5 },
  secondaryRow:   { flexDirection: 'row', gap: 10 },
  secondaryBtn: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: 50, paddingVertical: 14,
    alignItems: 'center', flexDirection: 'row', justifyContent: 'center',
    borderWidth: 1.5, borderColor: COLORS.secondary,
  },
  secondaryBtnText: { color: COLORS.primary, fontFamily: FONTS.PoppinsBold, fontSize: 13 },
});