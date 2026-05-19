// filepath: src/screens/main/DemographicProfileScreen.tsx
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
  TextInput,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import { COLORS } from '../../styles/colors';
import { FONTS } from '../../styles/typography';
import AssessmentHeader from '../../components/AssessmentHeader';

type Props = NativeStackScreenProps<MainStackParamList, 'DemographicProfile'>;

const bayaniBackground = require('../../assets/images/bayaniBackground.png');

// ── Data ──────────────────────────────────────────────────────────────────────
const ethnicities = [
  'Ilocano',
  'Tagalog',
  'Visayan',
  'Kapampangan',
  'Bicolano',
  'Igorot',
  'Moro',
  'Other',
];

const regions = [
  'Metro Manila',
  'Ilocos Region',
  'Cagayan Valley',
  'Central Luzon',
  'CALABARZON',
  'Mimaropa',
  'Bicol Region',
  'Western Visayas',
  'Central Visayas',
  'Eastern Visayas',
  'Zamboanga Peninsula',
  'Northern Mindanao',
  'Davao Region',
  'SOCCSKSARGEN',
  'Caraga',
  'BARMM',
];

// ── Styled Picker wrapper ─────────────────────────────────────────────────────
function FieldCard({
  iconName,
  label,
  sublabel,
  children,
  filled,
}: {
  iconName: string;
  label: string;
  sublabel: string;
  children: React.ReactNode;
  filled: boolean;
}) {
  return (
    <View style={[styles.fieldCard, filled && styles.fieldCardFilled]}>
      <View style={styles.fieldHeader}>
        <View style={[styles.fieldIconWrap, filled && styles.fieldIconWrapFilled]}>
          <Icon
            name={iconName}
            size={15}
            color={filled ? COLORS.textContrast : COLORS.primary}
          />
        </View>
        <View style={styles.fieldLabelCol}>
          <Text style={styles.fieldLabel}>{label}</Text>
          <Text style={styles.fieldSublabel}>{sublabel}</Text>
        </View>
        {filled && (
          <View style={styles.fieldCheckWrap}>
            <Icon name="check-circle" size={18} color={COLORS.primary} />
          </View>
        )}
      </View>
      <View style={[styles.pickerWrap, filled && styles.pickerWrapFilled]}>
        {children}
      </View>
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function DemographicProfileScreen({ navigation }: Props) {
  const [ethnicity, setEthnicity] = useState('');
  const [region, setRegion] = useState('');
  const [search, setSearch] = useState('');

  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(24)).current;

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

  const canProceed = ethnicity !== '' && region !== '';

  const handleSave = () => {
    if (canProceed) navigation.navigate('Camera');
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
        {/* ── Shared header — step 1 (0-based) = 50 % progress ── */}
        <AssessmentHeader
          currentStep={1}
          title="PROPILO"
          baybayinLabel="ᜉᜒᜎᜒᜉᜒᜈᜎ"
          subtitle="★ Demographic Profile ★"
          onBack={() => navigation.goBack()}
          actionLabel="Susunod"
          actionEnabled={canProceed}
          onAction={handleSave}
          actionIconName="arrow-right"
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Intro card ── */}
          <Animated.View
            style={[
              styles.introCard,
              { opacity: contentFade, transform: [{ translateY: contentSlide }] },
            ]}
          >
            <View style={styles.cardOrnRow}>
              <View style={styles.cardOrnLine} />
              <Text style={styles.cardOrnStar}>✦</Text>
              <View style={styles.cardOrnLine} />
            </View>
            <Text style={styles.introTitle}>
              Sabihin Mo sa Amin{"\n"}ang Iyong Ugat
            </Text>
            <Text style={styles.introBody}>
              Your background helps us find the hero whose story resonates most
              deeply with yours.
            </Text>
          </Animated.View>

          {/* ── Ethnicity field ── */}
          <Animated.View
            style={{
              opacity: contentFade,
              transform: [{ translateY: contentSlide }],
            }}
          >
            <FieldCard
              iconName="users"
              label="Etnisidad"
              sublabel="Ethnicity"
              filled={ethnicity !== ''}
            >
              <View style={styles.listContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search"
                  placeholderTextColor={COLORS.textSecondary}
                  value={search}
                  onChangeText={setSearch}
                />
                <ScrollView style={styles.optionsList} nestedScrollEnabled>
                  {ethnicities
                    .filter(e => e.toLowerCase().includes(search.toLowerCase()))
                    .map(e => {
                      const selected = ethnicity === e;
                      return (
                        <TouchableOpacity
                          key={e}
                          style={[
                            styles.ethCard,
                            selected && styles.ethCardSelected,
                          ]}
                          onPress={() => setEthnicity(e)}
                          activeOpacity={0.8}
                        >
                          <View style={styles.ethLeft}>
                            <Text
                              style={[
                                styles.ethText,
                                selected && styles.ethTextSelected,
                              ]}
                            >
                              {e}
                            </Text>
                          </View>
                          <View style={styles.ethRight}>
                            {selected ? (
                              <View style={styles.selectedDot}>
                                <Icon name="check" size={12} color="#fff" />
                              </View>
                            ) : (
                              <View style={styles.unselectedDot} />
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                </ScrollView>
              </View>
            </FieldCard>

            {/* ── Region field ── */}
            <FieldCard
              iconName="map-marker"
              label="Lokasyon"
              sublabel="Current Region"
              filled={region !== ''}
            >
              <View style={styles.regionWrap}>
                {/* Island group pills removed per design request */}

                <View style={styles.provinceListWrap}>
                  <ScrollView nestedScrollEnabled>
                    {regions.map((r, i) => {
                      const selected = region === r;
                      return (
                        <TouchableOpacity
                          key={r}
                          style={[
                            styles.provinceRow,
                            selected && styles.provinceRowSelected,
                          ]}
                          onPress={() => setRegion(r)}
                          activeOpacity={0.8}
                        >
                          <View style={styles.provinceIndex}>
                            <Text style={styles.provinceIndexText}>
                              {String(i + 1).padStart(2, '0')}
                            </Text>
                          </View>
                          <Text style={styles.provinceText}>{r}</Text>
                          <View style={styles.radioWrap}>
                            {selected ? (
                              <View style={styles.radioSelected} />
                            ) : (
                              <View style={styles.radio} />
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>
            </FieldCard>
          </Animated.View>

          {/* ── Completion hint ── */}
          {!canProceed && (
            <View style={styles.hintRow}>
              <Icon name="info-circle" size={12} color={COLORS.primaryLight} />
              <Text style={styles.hintText}>
                Piliin ang parehong field para magpatuloy.
              </Text>
            </View>
          )}

          {/* ── CTA ── */}
          <View style={styles.ctaWrap}>
            {canProceed && (
              <View style={styles.ctaOrnRow}>
                <View style={styles.ornLine} />
                <Text style={styles.ctaOrnText}>✦ HANDA NA ✦</Text>
                <View style={styles.ornLine} />
              </View>
            )}
            <TouchableOpacity
              style={[styles.ctaBtn, !canProceed && styles.ctaBtnDisabled]}
              onPress={handleSave}
              disabled={!canProceed}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.ctaBtnText,
                  !canProceed && styles.ctaBtnTextDisabled,
                ]}
              >
                I-save at Magpatuloy
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 60 }} />
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
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

  // ── Field cards ──
  fieldCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
    marginBottom: 14,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  fieldCardFilled: {
    borderColor: COLORS.primary,
    backgroundColor: '#fff8f5',
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  fieldIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#fff5f0',
    borderWidth: 1,
    borderColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldIconWrapFilled: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  fieldLabelCol: { flex: 1 },
  fieldLabel: {
    fontFamily: FONTS.kawitBold,
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 1,
  },
  fieldSublabel: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 10,
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  fieldCheckWrap: { paddingRight: 2 },
  pickerWrap: {
    borderTopWidth: 1,
    borderTopColor: COLORS.secondary,
    backgroundColor: COLORS.background,
    paddingTop: 12,
  },
  pickerWrapFilled: {
    borderTopColor: '#f0d5c8',
    backgroundColor: '#fff5f0',
  },
  picker: {
    height: 52,
    color: COLORS.textSecondary,
    fontFamily: FONTS.PoppinsRegular,
  },

  // ── Hint ──
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 4,
    marginBottom: 14,
  },
  hintText: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 11,
    color: COLORS.primaryLight,
    fontStyle: 'italic',
  },

  // ── CTA ──
  ctaWrap: { marginTop: 4 },
  ctaOrnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  ornLine: { flex: 1, height: 1, backgroundColor: COLORS.secondary },
  ctaOrnText: {
    fontFamily: FONTS.PoppinsBold,
    fontSize: 9,
    color: COLORS.primaryLight,
    letterSpacing: 2,
  },
  ctaBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  ctaBtnDisabled: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.secondary,
  },
  ctaBtnText: {
    color: COLORS.textContrast,
    fontFamily: FONTS.PoppinsBold,
    fontSize: 15,
    letterSpacing: 0.5,
  },
  ctaBtnTextDisabled: {
    color: COLORS.textSecondary,
  },

  // ── New UI styles
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  searchInput: {
    height: 48,
    borderRadius: 28,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#f2d6c8',
    marginBottom: 12,
    color: COLORS.primary,
    fontFamily: FONTS.PoppinsRegular,
  },
  optionsList: { maxHeight: 260, paddingRight: 6 },
  ethCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 10,
    backgroundColor: 'transparent',
  },
  ethCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#f6e9e1',
  },
  ethLeft: { flexDirection: 'row', alignItems: 'center' },
  ethText: {
    fontFamily: FONTS.PoppinsRegular,
    color: COLORS.primary,
    fontSize: 16,
    marginLeft: 4,
  },
  ethTextSelected: {
    color: '#7a2d14',
  },
  ethRight: { width: 36, alignItems: 'center', justifyContent: 'center' },
  selectedDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unselectedDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.6,
    borderColor: '#e9c9ba',
    backgroundColor: 'transparent',
  },
  regionWrap: { paddingHorizontal: 12, paddingBottom: 8 },
  /* island pills removed */
  provinceListWrap: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  provinceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  provinceRowSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#fff6f2',
  },
  provinceIndex: {
    width: 44,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  provinceIndexText: { fontFamily: FONTS.PoppinsBold, color: COLORS.primary },
  provinceText: {
    flex: 1,
    fontFamily: FONTS.PoppinsRegular,
    color: COLORS.primary,
  },
  radioWrap: { width: 36, alignItems: 'center' },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
  },
  radioSelected: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.primary,
  },
});
