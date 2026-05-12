import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Image,
  Animated,
  Dimensions,
  StatusBar,
  FlatList,
  Platform,
} from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { COLORS } from '../../styles/colors';
import { FONTS } from '../../styles/typography';

const { width } = Dimensions.get('window');
const CARD_W = width * 0.52;

// ── Mock data ─────────────────────────────────────────────────────────────────
const HEROES = [
  {
    id: '1',
    name: 'Jose Rizal',
    subtitle: 'National Hero',
    tag: 'ILUSTRADO',
    era: '1861–1896',
    image: require('../../assets/images/portrait.png'),
  },
  {
    id: '2',
    name: 'Andres Bonifacio',
    subtitle: 'Father of the Revolution',
    tag: 'KATIPUNAN',
    era: '1863–1897',
    image: {
      uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Andres_Bonifacio.jpg/440px-Andres_Bonifacio.jpg',
    },
  },
  {
    id: '3',
    name: 'Gabriela Silang',
    subtitle: 'Ilocos Revolt Leader',
    tag: 'WARRIOR',
    era: '1731–1763',
    image: {
      uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Gabriela_Cariño_Silang.jpg/440px-Gabriela_Cariño_Silang.jpg',
    },
  },
];

const FUN_FACTS = [
  'The first Philippine flag was sewn by Marcela Agoncillo in Hong Kong in 1898.',
  'Jose Rizal spoke more than 20 languages and dialects.',
  'Andres Bonifacio founded the Katipunan in 1892 in secret.',
];

const CATEGORIES = [
  { id: '1', label: 'Heroes', icon: '⚔️' },
  { id: '2', label: 'Events', icon: '📜' },
  { id: '3', label: 'Culture', icon: '🌺' },
  { id: '4', label: 'Artifacts', icon: '🏺' },
];

// ── Decorative Baybayin strip ─────────────────────────────────────────────────
function BaybayinStrip() {
  return (
    <View style={styles.baybayinStrip}>
      <Text style={styles.baybayinText}>ᜊᜌᜊᜈᜒ · ᜉᜋᜈ · ᜃᜐᜌᜐᜌᜈ · ᜉᜒᜎᜒᜉᜒᜈᜎ ·</Text>
    </View>
  );
}
// ── Hero Card ─────────────────────────────────────────────────────────────────
function HeroCard({
  hero,
  onPress,
}: {
  hero: (typeof HEROES)[0];
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      tension: 100,
    }).start();
  const handlePressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 80,
    }).start();

  return (
    <Animated.View style={[styles.heroCard, { transform: [{ scale }] }]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Image
          source={hero.image}
          style={styles.heroImage}
          resizeMode="cover"
        />
        {/* Gradient-like overlay using multiple views */}
        <View style={styles.heroOverlayTop} />
        <View style={styles.heroOverlayBottom} />

        {/* Ornate corner decoration */}
        <View style={styles.heroCornerTL} />
        <View style={styles.heroCornerBR} />

        <View style={styles.heroTag}>
          <Text style={styles.heroTagText}>{hero.tag}</Text>
        </View>

        <View style={styles.heroInfo}>
          <Text style={styles.heroEra}>{hero.era}</Text>
          <Text style={styles.heroName}>{hero.name}</Text>
          <Text style={styles.heroSubtitle}>{hero.subtitle}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── Fact Card ─────────────────────────────────────────────────────────────────
function FactCard({ text }: { text: string }) {
  return (
    <View style={styles.factCard}>
      {/* Left accent bar mimicking document/scroll design */}
      <View style={styles.factAccentBar} />
      <View style={styles.factContent}>
        <View style={styles.factHeaderRow}>
          <Text style={styles.factDot}>✦</Text>
          <Text style={styles.factLabel}>ALAM MO BA?</Text>
          <Text style={styles.factDot}>✦</Text>
        </View>
        <Text style={styles.factText}>{text}</Text>
      </View>
    </View>
  );
}

// ── Stats Row ─────────────────────────────────────────────────────────────────
function StatsRow() {
  return (
    <View style={styles.statsRow}>
      {[
        { value: '150+', label: 'Heroes' },
        { value: '300+', label: 'Events' },
        { value: '50+', label: 'Regions' },
      ].map((s, i) => (
        <View key={i} style={styles.statItem}>
          <Text style={styles.statValue}>{s.value}</Text>
          <Text style={styles.statLabel}>{s.label}</Text>
        </View>
      ))}
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
type Props = BottomTabScreenProps<MainTabParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const user = {
    name: 'Pamana',
    photo: 'https://lh3.googleusercontent.com/a/ACg8ocL...',
  };
  const logout = useAuthStore(state => state.logout);
  const [activeCategory, setActiveCategory] = useState('1');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const bannerScale = useRef(new Animated.Value(1.08)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(bannerScale, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* ── Top bar ── */}
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

      {/* Decorative strip below top bar */}
      <BaybayinStrip />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* ── Hero Banner ── */}
        <Animated.View style={{ transform: [{ scale: bannerScale }] }}>
          <ImageBackground
            source={require('../../assets/images/bayaniPortrait.png')}
            style={styles.banner}
            resizeMode="cover"
          >
            {/* Layered overlays for depth */}
            <View style={styles.bannerOverlayDark} />
            <View style={styles.bannerOverlayColor} />

            {/* Top ornament */}
            <View style={styles.bannerTopOrnament}>
              <View style={styles.ornamentLine} />
              <Text style={styles.ornamentBaybayin}>ᜊᜌᜈᜒ</Text>
              <View style={styles.ornamentLine} />
            </View>

            <Text style={styles.bannerTagline}>Ang Kasaysayan ng</Text>
            <Text style={styles.bannerTitle}>BAYANI</Text>

            {/* Bottom ornament */}
            <View style={styles.bannerBottomOrnament}>
              <Text style={styles.bannerDots}>✦ ✦ ✦</Text>
            </View>
          </ImageBackground>
        </Animated.View>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* ── Discover Card ── */}
          <View style={styles.discoverCard}>
            {/* Ornate top border strip */}
            <View style={styles.discoverOrnament}>
              <View style={styles.ornamentLineShort} />
              <Text style={styles.ornamentStar}>✦</Text>
              <View style={styles.ornamentLineShort} />
            </View>

            <Text style={styles.discoverTitle}>
              Tuklasin ang{'\n'}Inyong Pamana
            </Text>
            <Text style={styles.discoverBody}>
              Isang paglalakbay sa kasaysayan ng Pilipinas. Kilalanin ang mga
              bayaning nagbuwis ng buhay para sa kalayaan.
            </Text>

            <StatsRow />

            <TouchableOpacity
              style={styles.ctaBtn}
              onPress={() => navigation.navigate('Assessment')}
              activeOpacity={0.85}
            >
              {/* Inner ornament on button */}
              <Text style={styles.ctaBtnOrnament}>✦ </Text>
              <Text style={styles.ctaBtnText}>Simulan ang Pagtatasa</Text>
              <Text style={styles.ctaBtnOrnament}> ✦</Text>
            </TouchableOpacity>
          </View>

          {/* ── Featured Heroes ── */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionLeft}>
              <Text style={styles.sectionBaybayin}>ᜊᜌᜈᜒ</Text>
              <Text style={styles.sectionTitle}>Featured Heroes</Text>
            </View>
            <TouchableOpacity style={styles.seeAllBtn}>
              <Text style={styles.seeAllText}>LAHAT ▸</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={HEROES}
            keyExtractor={h => h.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.heroList}
            renderItem={({ item }) => (
              <HeroCard hero={item} onPress={() => {}} />
            )}
          />

          {/* ── Fun Fact ── */}
          <FactCard text={FUN_FACTS[0]} />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    overflow: 'hidden',
  },
  baybayinText: {
    fontFamily: FONTS.baybayin,
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 4,
    textAlign: 'center',
  },

  scroll: { flex: 1 },

  // ── Banner ──
  banner: {
    width: '100%',
    height: 240,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 24,
  },
  bannerOverlayDark: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  bannerOverlayColor: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(191,89,43,0.25)',
  },
  bannerTopOrnament: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 10,
  },
  ornamentLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  ornamentLineShort: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.secondary,
  },
  ornamentBaybayin: {
    fontFamily: FONTS.baybayin,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 4,
  },
  bannerTagline: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 3,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  bannerTitle: {
    fontFamily: FONTS.kawitBold,
    fontSize: 52,
    color: COLORS.textContrast,
    letterSpacing: 8,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  bannerBottomOrnament: { marginTop: 4 },
  bannerDots: {
    color: COLORS.primaryLight,
    fontSize: 12,
    letterSpacing: 8,
  },

  // ── Discover Card ──
  discoverCard: {
    marginHorizontal: 16,
    marginTop: -20, // overlap with banner for layered effect
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
    // Platform shadow
    elevation: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  discoverOrnament: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  ornamentStar: {
    color: COLORS.primaryLight,
    fontSize: 10,
  },
  discoverTitle: {
    fontFamily: FONTS.kawitBold,
    fontSize: 26,
    color: COLORS.primary,
    lineHeight: 32,
    marginBottom: 10,
  },
  discoverBody: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 21,
    marginBottom: 18,
  },

  // ── Stats ──
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.background,
    borderRadius: 14,
    paddingVertical: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  statItem: { alignItems: 'center' },
  statValue: {
    fontFamily: FONTS.kawitBold,
    fontSize: 20,
    color: COLORS.primary,
  },
  statLabel: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  // ── CTA Button ──
  ctaBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    // Inner shadow effect
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  ctaBtnOrnament: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
  },
  ctaBtnText: {
    color: COLORS.textContrast,
    fontFamily: FONTS.PoppinsBold,
    fontSize: 14,
    letterSpacing: 0.5,
  },

  // ── Category Pills ──
  categoryList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 10,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 50,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
  },
  categoryPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryIcon: { fontSize: 14 },
  categoryLabel: {
    fontFamily: FONTS.PoppinsBold,
    fontSize: 12,
    color: COLORS.primary,
    letterSpacing: 0.3,
  },
  categoryLabelActive: {
    color: COLORS.textContrast,
  },

  // ── Section Header ──
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    marginBottom: 14,
    justifyContent: 'space-between',
  },
  sectionLeft: { gap: 0 },
  sectionBaybayin: {
    fontFamily: FONTS.baybayin,
    fontSize: 11,
    color: COLORS.primaryLight,
    letterSpacing: 3,
    marginBottom: -2,
  },
  sectionTitle: {
    fontFamily: FONTS.kawitBold,
    fontSize: 18,
    color: COLORS.primary,
  },
  seeAllBtn: {
    paddingBottom: 2,
  },
  seeAllText: {
    fontFamily: FONTS.PoppinsBold,
    fontSize: 11,
    color: COLORS.primaryLight,
    letterSpacing: 1.5,
  },

  // ── Hero Cards ──
  heroList: { paddingHorizontal: 16, gap: 14, paddingBottom: 4 },
  heroCard: {
    width: CARD_W,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  heroImage: { width: '100%', height: CARD_W * 1.15 },
  heroOverlayTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: CARD_W * 0.3,
    backgroundColor: 'rgba(191,89,43,0.15)',
  },
  heroOverlayBottom: {
    position: 'absolute',
    top: CARD_W * 0.65,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.surface,
    opacity: 0.9,
  },
  // Decorative corner accents
  heroCornerTL: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 14,
    height: 14,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
    borderRadius: 2,
  },
  heroCornerBR: {
    position: 'absolute',
    top: CARD_W * 1.15 - 22,
    right: 8,
    width: 14,
    height: 14,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: COLORS.primaryLight,
    borderRadius: 2,
  },
  heroTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  heroTagText: {
    color: COLORS.textContrast,
    fontFamily: FONTS.PoppinsBold,
    fontSize: 8,
    letterSpacing: 1.5,
  },
  heroInfo: { padding: 12, paddingTop: 6 },
  heroEra: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 9,
    color: COLORS.primaryLight,
    letterSpacing: 1,
    marginBottom: 2,
  },
  heroName: {
    fontFamily: FONTS.kawitBold,
    fontSize: 15,
    color: COLORS.primary,
    marginBottom: 2,
  },
  heroSubtitle: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 10,
    color: COLORS.textSecondary,
    lineHeight: 14,
  },

  // ── Fact Card ──
  factCard: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: COLORS.background,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  factAccentBar: {
    width: 5,
    backgroundColor: COLORS.primary,
  },
  factContent: {
    flex: 1,
    padding: 16,
  },
  factHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  factDot: {
    color: COLORS.primaryLight,
    fontSize: 8,
  },
  factLabel: {
    fontFamily: FONTS.PoppinsBold,
    fontSize: 10,
    color: COLORS.primary,
    letterSpacing: 2,
  },
  factText: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },

  // ── Continue Learning Banner ──
  continueBanner: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  continueTextWrap: { flex: 1 },
  continueLabel: {
    fontFamily: FONTS.PoppinsBold,
    fontSize: 9,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 2,
    marginBottom: 4,
  },
  continueTitle: {
    fontFamily: FONTS.kawitBold,
    fontSize: 16,
    color: COLORS.textContrast,
    marginBottom: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 2,
  },
  progressLabel: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
  },
  continueBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  continueBtnText: {
    color: COLORS.textContrast,
    fontSize: 16,
  },
});
