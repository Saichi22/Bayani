import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import { COLORS } from '../../styles/colors';
import { FONTS } from '../../styles/typography';
import { useHeroScoring } from '../../hooks/useHeroScoring';
import { ScoredQuestion } from '../../store/heroScoring';
import { allQuestions, OPTION_LABELS, PARTS } from '../../data/questions';

type Props = NativeStackScreenProps<MainStackParamList, 'PersonalityTest'>;

const bayaniBackground = require('../../assets/images/bayaniBackground.png');

const screenSteps = [
  { id: 'test', label: 'Pagsubok', iconName: 'pencil' },
  { id: 'demographic', label: 'Propilo', iconName: 'user' },
  { id: 'camera', label: 'Larawan', iconName: 'camera' },
  { id: 'result', label: 'Resulta', iconName: 'star' },
];
const CURRENT_SCREEN_INDEX = 0;

// ── Baybayin Accent Strip ─────────────────────────────────────────────────────
function BaybayinStrip() {
  return (
    <View style={styles.baybayinStrip}>
      <Text style={styles.baybayinText}>ᜊᜌᜈᜒ · ᜉᜋᜈ · ᜃᜐᜌᜐᜌᜈ · ᜉᜒᜎᜒᜉᜒᜈᜎ ·</Text>
    </View>
  );
}

// ── Option Button ─────────────────────────────────────────────────────────────
function OptionButton({
  label,
  text,
  selected,
  onPress,
}: {
  label: string;
  text: string;
  selected: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(glow, {
      toValue: selected ? 1 : 0,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [selected]);

  const borderColor = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.secondary, COLORS.primary],
  });
  const bgColor = glow.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ffffff', '#fff5f0'],
  });

  const handlePressIn = () =>
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 120,
    }).start();
  const handlePressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 80,
    }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          style={[
            styles.optionButton,
            { borderColor, backgroundColor: bgColor },
          ]}
        >
          <View
            style={[styles.optionBadge, selected && styles.optionBadgeSelected]}
          >
            <Text
              style={[
                styles.optionBadgeText,
                selected && styles.optionBadgeTextSelected,
              ]}
            >
              {label}
            </Text>
          </View>
          <Text
            style={[styles.optionText, selected && styles.optionTextSelected]}
          >
            {text}
          </Text>
          {selected && (
            <View style={styles.checkWrap}>
              <Icon name="check" size={11} color={COLORS.primary} />
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── Question Card ─────────────────────────────────────────────────────────────
function QuestionCard({
  question,
  globalIndex,
  isLast,
  answer,
  onAnswer,
}: {
  question: ScoredQuestion;
  globalIndex: number;
  isLast: boolean;
  answer: string | undefined;
  onAnswer: (id: string, optionId: string) => void;
}) {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideIn = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 400,
        delay: (globalIndex % 6) * 80,
        useNativeDriver: true,
      }),
      Animated.spring(slideIn, {
        toValue: 0,
        delay: (globalIndex % 6) * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isAnswered = !!answer;
  const optionTexts = OPTION_LABELS[question.id] ?? {};

  return (
    <Animated.View
      style={[
        styles.questionRow,
        { opacity: fadeIn, transform: [{ translateY: slideIn }] },
      ]}
    >
      <View style={styles.sideColumn}>
        <View
          style={[
            styles.numberCircle,
            isAnswered && styles.numberCircleAnswered,
          ]}
        >
          {isAnswered ? (
            <Icon name="check" size={14} color={COLORS.textContrast} />
          ) : (
            <Text style={styles.numberText}>{globalIndex + 1}</Text>
          )}
        </View>
        {!isLast && <View style={styles.dottedLine} />}
      </View>

      <View style={styles.cardColumn}>
        <View
          style={[
            styles.questionCard,
            isAnswered && styles.questionCardAnswered,
          ]}
        >
          <View style={styles.cardOrnamentRow}>
            <View style={styles.cardAccentBar} />
            <Text style={styles.cardBaybayin}>ᜊᜌᜈᜒ</Text>
          </View>

          <Text style={styles.questionLabel}>
            <Icon
              name="question-circle"
              size={10}
              color={COLORS.primaryLight}
            />{' '}
            Tanong {globalIndex + 1}
          </Text>
          <Text style={styles.questionText}>{question.question}</Text>

          {question.options.map((option, idx) => (
            <React.Fragment key={option.id}>
              {idx > 0 && <View style={{ height: 8 }} />}
              <OptionButton
                label={option.label}
                text={optionTexts[option.id] ?? option.label}
                selected={answer === option.id}
                onPress={() => onAnswer(question.id, option.id)}
              />
            </React.Fragment>
          ))}
        </View>
        {!isLast && <View style={{ height: 20 }} />}
      </View>
    </Animated.View>
  );
}

// ── Part Section Header ───────────────────────────────────────────────────────
function PartHeader({
  label,
  subtitle,
  partIndex,
}: {
  label: string;
  subtitle: string;
  partIndex: number;
}) {
  return (
    <View style={styles.partHeader}>
      <View style={styles.partHeaderLeft}>
        <Text style={styles.partHeaderNum}>BAHAGI {partIndex + 1}</Text>
        <Text style={styles.partHeaderLabel}>{label.toUpperCase()}</Text>
        <Text style={styles.partHeaderSub}>{subtitle}</Text>
      </View>
      <View style={styles.partHeaderRight}>
        <Text style={styles.partHeaderBaybayin}>ᜊᜌᜈᜒ</Text>
      </View>
    </View>
  );
}

// ── Step Indicator ────────────────────────────────────────────────────────────
function StepIndicator({
  step,
  isActive,
  isCompleted,
  isLast,
}: {
  step: (typeof screenSteps)[0];
  isActive: boolean;
  isCompleted: boolean;
  isLast: boolean;
}) {
  return (
    <React.Fragment>
      <View style={styles.stepItem}>
        <View
          style={[
            styles.stepCircle,
            isActive && styles.stepCircleActive,
            isCompleted && styles.stepCircleCompleted,
          ]}
        >
          <Icon
            name={isCompleted ? 'check' : step.iconName}
            size={13}
            color={
              isActive || isCompleted
                ? COLORS.textContrast
                : COLORS.textSecondary
            }
          />
        </View>
        <Text style={[styles.stepLabel, isActive && styles.stepLabelActive]}>
          {step.label}
        </Text>
      </View>
      {!isLast && (
        <View
          style={[
            styles.stepConnector,
            isCompleted && styles.stepConnectorCompleted,
          ]}
        />
      )}
    </React.Fragment>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function PersonalityTestScreen({ navigation }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const scrollRef = useRef<ScrollView>(null);
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-20)).current;
  const { submitScreen, resetScores } = useHeroScoring();

  useEffect(() => {
    resetScores();
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(headerSlide, {
        toValue: 0,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleAnswer = (questionId: string, optionId: string) =>
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));

  const handleSubmit = () => {
    if (!allAnswered) return;
    submitScreen(allQuestions, answers);
    navigation.navigate('DemographicProfile');
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercentage = (answeredCount / allQuestions.length) * 100;
  const allAnswered = answeredCount === allQuestions.length;

  return (
    <SafeAreaView style={styles.container}>
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
        {/* ── Header ── */}
        <Animated.View
          style={[
            styles.header,
            { opacity: headerFade, transform: [{ translateY: headerSlide }] },
          ]}
        >
          <TouchableOpacity
            style={styles.backCircle}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={16} color={COLORS.primary} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerBaybayin}>ᜉᜋᜈ</Text>
            <Text style={styles.headerTitle}>PAGSUBOK</Text>
            <Text style={styles.headerSub}>
              <Icon name="star" size={8} color={COLORS.primaryLight} /> Bayani
              Assessment{' '}
              <Icon name="star" size={8} color={COLORS.primaryLight} />
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              !allAnswered && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!allAnswered}
          >
            <Text
              style={[
                styles.submitText,
                !allAnswered && styles.submitTextDisabled,
              ]}
            >
              {' '}
              Susunod
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <BaybayinStrip />

        {/* ── Step Indicators ── */}
        <View style={styles.stepsContainer}>
          {screenSteps.map((step, index) => (
            <StepIndicator
              key={step.id}
              step={step}
              isActive={index === CURRENT_SCREEN_INDEX}
              isCompleted={index < CURRENT_SCREEN_INDEX}
              isLast={index === screenSteps.length - 1}
            />
          ))}
        </View>

        {/* ── Progress Bar ── */}
        <View style={styles.progressContainer}>
          <View style={styles.progressMeta}>
            <View style={styles.progressLabelRow}>
              <Icon name="bar-chart" size={11} color={COLORS.primaryLight} />
              <Text style={styles.progressLabel}> Katuparan</Text>
            </View>
            <Text style={styles.progressCount}>
              {answeredCount}
              <Text style={styles.progressTotal}> / {allQuestions.length}</Text>
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progressPercentage}%` as any },
              ]}
            >
              <View style={styles.progressSheen} />
            </View>
          </View>
          <View style={styles.tickRow}>
            {allQuestions.map((_, i) => (
              <View
                key={i}
                style={[styles.tick, i < answeredCount && styles.tickAnswered]}
              />
            ))}
          </View>
        </View>

        {/* ── Ornate divider ── */}
        <View style={styles.ornamentDivider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerStar}>✦</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* ── Question List ── */}
        <ScrollView
          ref={scrollRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {PARTS.map((part, partIndex) => {
            const partQuestions = allQuestions.filter(q => q.part === part.id);
            return (
              <View key={part.id}>
                <PartHeader
                  label={part.label}
                  subtitle={part.subtitle}
                  partIndex={partIndex}
                />

                {partQuestions.map((question, qIndexInPart) => {
                  const globalIndex = allQuestions.findIndex(
                    q => q.id === question.id,
                  );
                  const isLastInPart =
                    qIndexInPart === partQuestions.length - 1;
                  const isLastOverall = globalIndex === allQuestions.length - 1;
                  return (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      globalIndex={globalIndex}
                      isLast={isLastOverall}
                      answer={answers[question.id]}
                      onAnswer={handleAnswer}
                    />
                  );
                })}

                {partIndex < PARTS.length - 1 && (
                  <View style={styles.partDivider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.partDividerText}>✦ ✦ ✦</Text>
                    <View style={styles.dividerLine} />
                  </View>
                )}
              </View>
            );
          })}

          {/* All-answered CTA */}
          {allAnswered && (
            <Animated.View style={styles.floatingCta}>
              <View style={styles.ctaOrnamentRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.ctaOrnamentText}>✦ HANDA NA ✦</Text>
                <View style={styles.dividerLine} />
              </View>
              <TouchableOpacity
                style={styles.ctaBtn}
                onPress={handleSubmit}
                activeOpacity={0.85}
              >
                <Text style={styles.ctaBtnText}> Ihayag ang Aking Bayani</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  backgroundImage: { flex: 1, paddingTop: 12 },
  backgroundImageStyle: { opacity: 0.7, resizeMode: 'cover' },

  baybayinStrip: { backgroundColor: COLORS.primary, paddingVertical: 5 },
  baybayinText: {
    fontFamily: FONTS.baybayin,
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 4,
    textAlign: 'center',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 90,
    paddingHorizontal: 18,
    paddingVertical: 18,
    paddingBottom: -60,
    backgroundColor: COLORS.background,
  },
  backCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: { alignItems: 'center' },
  headerBaybayin: {
    fontFamily: FONTS.baybayin,
    fontSize: 10,
    color: COLORS.primaryLight,
    letterSpacing: 3,
    marginBottom: -2,
  },
  headerTitle: {
    fontFamily: FONTS.kawitBold,
    fontSize: 18,
    letterSpacing: 5,
    color: COLORS.primary,
  },
  headerSub: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 9,
    color: COLORS.textSecondary,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.secondary,
  },
  submitText: {
    color: COLORS.textContrast,
    fontFamily: FONTS.PoppinsBold,
    fontSize: 12,
    letterSpacing: 0.3,
  },
  submitTextDisabled: { color: COLORS.textSecondary },

  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 14,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
  },
  stepItem: { alignItems: 'center', gap: 5 },
  stepCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  stepCircleCompleted: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primaryLight,
  },
  stepLabel: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 8,
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  stepLabelActive: { color: COLORS.primary, fontFamily: FONTS.PoppinsBold },
  stepConnector: {
    flex: 1,
    height: 1.5,
    backgroundColor: COLORS.secondary,
    marginHorizontal: 4,
    marginBottom: 18,
  },
  stepConnectorCompleted: { backgroundColor: COLORS.primary },

  progressContainer: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 10,
    backgroundColor: COLORS.background,
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabelRow: { flexDirection: 'row', alignItems: 'center' },
  progressLabel: {
    fontFamily: FONTS.PoppinsBold,
    fontSize: 10,
    color: COLORS.textSecondary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  progressCount: {
    fontFamily: FONTS.kawitBold,
    fontSize: 15,
    color: COLORS.primary,
  },
  progressTotal: {
    fontFamily: FONTS.PoppinsRegular,
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    overflow: 'hidden',
  },
  progressSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
  },
  tickRow: { flexDirection: 'row', gap: 3 },
  tick: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.secondary,
  },
  tickAnswered: { backgroundColor: COLORS.primaryLight },

  ornamentDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 8,
    gap: 10,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.secondary },
  dividerStar: { color: COLORS.primaryLight, fontSize: 10 },

  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8 },

  // ── Part Header ──
  partHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  partHeaderLeft: { gap: 2 },
  partHeaderNum: {
    fontFamily: FONTS.PoppinsBold,
    fontSize: 8,
    color: COLORS.primaryLight,
    letterSpacing: 2,
  },
  partHeaderLabel: {
    fontFamily: FONTS.kawitBold,
    fontSize: 20,
    color: COLORS.primary,
    letterSpacing: 2,
  },
  partHeaderSub: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 10,
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  partHeaderRight: { opacity: 0.2 },
  partHeaderBaybayin: {
    fontFamily: FONTS.baybayin,
    fontSize: 28,
    color: COLORS.primary,
  },

  partDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 10,
  },
  partDividerText: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 10,
    color: COLORS.primaryLight,
    letterSpacing: 4,
  },

  // ── Question row / card ──
  questionRow: { flexDirection: 'row', alignItems: 'flex-start' },
  sideColumn: { width: 44, alignItems: 'center', paddingTop: 2 },
  numberCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  numberCircleAnswered: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  numberText: {
    fontFamily: FONTS.kawitBold,
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  dottedLine: {
    width: 1.5,
    flex: 1,
    minHeight: 32,
    borderLeftWidth: 1.5,
    borderLeftColor: COLORS.secondary,
    borderStyle: 'dashed',
    marginTop: 6,
    marginBottom: -6,
  },

  cardColumn: { flex: 1, marginLeft: 12 },
  questionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  questionCardAnswered: {
    borderColor: COLORS.primary,
    backgroundColor: '#fff8f5',
  },
  cardOrnamentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardAccentBar: {
    width: 32,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: COLORS.primaryLight,
    opacity: 0.7,
  },
  cardBaybayin: {
    fontFamily: FONTS.baybayin,
    fontSize: 10,
    color: COLORS.secondary,
    letterSpacing: 2,
  },
  questionLabel: {
    fontFamily: FONTS.PoppinsBold,
    fontSize: 9,
    color: COLORS.primaryLight,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  questionText: {
    fontFamily: FONTS.kawitBold,
    fontSize: 15,
    color: COLORS.primary,
    marginBottom: 16,
    lineHeight: 23,
  },

  // ── Options ──
  optionButton: {
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  optionBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionBadgeSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionBadgeText: {
    fontFamily: FONTS.PoppinsBold,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  optionBadgeTextSelected: { color: COLORS.textContrast },
  optionText: {
    flex: 1,
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  optionTextSelected: { fontFamily: FONTS.PoppinsBold, color: COLORS.primary },
  checkWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff0ea',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },

  // ── Bottom CTA ──
  floatingCta: { marginTop: 24, marginHorizontal: 4 },
  ctaOrnamentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  ctaOrnamentText: {
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
  ctaBtnText: {
    color: COLORS.textContrast,
    fontFamily: FONTS.PoppinsBold,
    fontSize: 15,
    letterSpacing: 0.5,
  },
});
