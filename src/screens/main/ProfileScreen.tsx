// filepath: src/screens/main/ProfileScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  Image,
} from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { COLORS } from '../../styles/colors';
import { FONTS } from '../../styles/typography';

type Props = BottomTabScreenProps<MainTabParamList, 'Profile'>;

const bayaniBackground = require('../../assets/images/bayaniBackground.png');
const heroPreview = require('../../assets/images/hero.png');
const demographicsPreview = require('../../assets/images/bayaniPortrait.png');
const savedPreview = require('../../assets/images/portrait.png');

const PROFILE_CARDS = [
  {
    id: 'hero-match',
    title: 'Your Hero Match',
    subtitle: 'Complete the assessment to see your match.',
    tag: 'ILUSTRADO',
    meta: 'Assessment',
    image: heroPreview,
  },
  {
    id: 'demographics',
    title: 'Demographics',
    subtitle: 'Set your profile to refine matches.',
    tag: 'PROFILE',
    meta: 'Profile Setup',
    image: demographicsPreview,
  },
  {
    id: 'saved-heroes',
    title: 'Saved Heroes',
    subtitle: 'Your hero collection.',
    tag: 'COLLECTION',
    meta: 'Library',
    image: savedPreview,
  },
];

function ProfileScreen() {
  const logout = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user);

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
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerWrap}>
            <Text style={styles.headerTitle}>Profile</Text>
            <Text style={styles.headerSubtitle}>Your Bayani journey</Text>
            <Text style={styles.greetingText}>
              Mabuhay, {user?.name || 'Bayani'}!
            </Text>
          </View>

          {PROFILE_CARDS.map(card => (
            <View key={card.id} style={styles.profileCard}>
              <View style={styles.cardImageWrap}>
                <Image source={card.image} style={styles.cardImage} />
                <View style={styles.cardImageOverlay} />
                <View style={styles.cardTag}>
                  <Text style={styles.cardTagText}>{card.tag}</Text>
                </View>
              </View>
              <View style={styles.cardMetaWrap}>
                <Text style={styles.cardMeta}>{card.meta}</Text>
                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundImage: {
    flex: 1,
    paddingTop: 12,
  },
  backgroundImageStyle: {
    opacity: 0.70,
    resizeMode: 'cover',
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  headerWrap: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: FONTS.kawitBold,
    fontSize: 24,
    color: COLORS.primary,
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  greetingText: {
    fontFamily: FONTS.PoppinsBold,
    fontSize: 16,
    color: COLORS.primary,
    marginTop: 10,
    letterSpacing: 0.4,
  },
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  cardImageWrap: {
    height: 140,
    backgroundColor: COLORS.background,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: COLORS.primary,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  cardTagText: {
    fontFamily: FONTS.PoppinsBold,
    fontSize: 10,
    color: COLORS.textContrast,
    letterSpacing: 1,
  },
  cardMetaWrap: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  cardMeta: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 10,
    color: COLORS.primaryLight,
    letterSpacing: 1,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontFamily: FONTS.kawitBold,
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  logoutButton: {
    marginTop: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  logoutText: {
    fontFamily: FONTS.PoppinsBold,
    fontSize: 14,
    color: COLORS.textContrast,
    letterSpacing: 0.5,
  },
});

export default ProfileScreen;