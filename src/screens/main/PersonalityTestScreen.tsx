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
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import { COLORS } from '../../styles/colors';
import { FONTS } from '../../styles/typography';

type Props = NativeStackScreenProps<MainStackParamList, 'PersonalityTest'>;

// ── Questions ─────────────────────────────────────────────────────────────────
const sampleQuestions = [
  {
    id: 1,
    question: 'During a conflict, you prefer to:',
    optionA: 'Lead from the frontlines',
    optionB: 'Command from behind the lines',
    valueA: 'warrior',
    valueB: 'strategist',
  },
  {
    id: 2,
    question: 'When faced with injustice, you:',
    optionA: 'Take immediate action',
    optionB: 'Plan a careful response',
    valueA: 'action',
    valueB: 'calculated',
  },
  {
    id: 3,
    question: 'Your strength lies in:',
    optionA: 'Physical courage',
    optionB: 'Mental fortitude',
    valueA: 'brave',
    valueB: 'wise',
  },
  {
    id: 4,
    question: 'In leading others, you:',
    optionA: 'Lead by example',
    optionB: 'Inspire through vision',
    valueA: 'example',
    valueB: 'vision',
  },
  {
    id: 5,
    question: 'When facing adversity, you:',
    optionA: 'Push forward relentlessly',
    optionB: 'Adapt your approach',
    valueA: 'relentless',
    valueB: 'adaptive',
  },
];

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
  iconName,
  selected,
  onPress,
}: {
  label: string;
  text: string;
  iconName: string;
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
          {/* Label badge */}
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

          {/* Option icon */}
          <View style={styles.optionIconWrap}>
            <Icon
              name={iconName}
              size={14}
              color={selected ? COLORS.primary : COLORS.textSecondary}
            />
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
  index,
  isLast,
  answer,
  onAnswer,
}: {
  question: (typeof sampleQuestions)[0];
  index: number;
  isLast: boolean;
  answer: string | undefined;
  onAnswer: (id: number, val: string) => void;
}) {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideIn = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.spring(slideIn, {
        toValue: 0,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isAnswered = !!answer;

  return (
    <Animated.View
      style={[
        styles.questionRow,
        { opacity: fadeIn, transform: [{ translateY: slideIn }] },
      ]}
    >
      {/* Timeline column */}
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
            <Text style={styles.numberText}>{index + 1}</Text>
          )}
        </View>
        {!isLast && <View style={styles.dottedLine} />}
      </View>

      {/* Card */}
      <View style={styles.cardColumn}>
        <View
          style={[
            styles.questionCard,
            isAnswered && styles.questionCardAnswered,
          ]}
        >
          {/* Top ornament row */}
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
            Tanong {index + 1}
          </Text>
          <Text style={styles.questionText}>{question.question}</Text>

          <OptionButton
            label="A"
            text={question.optionA}
            iconName="shield"
            selected={answer === question.valueA}
            onPress={() => onAnswer(question.id, question.valueA)}
          />
          <View style={{ height: 10 }} />
          <OptionButton
            label="B"
            text={question.optionB}
            iconName="lightbulb-o"
            selected={answer === question.valueB}
            onPress={() => onAnswer(question.id, question.valueB)}
          />
        </View>

        {!isLast && <View style={{ height: 20 }} />}
      </View>
    </Animated.View>
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
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const scrollRef = useRef<ScrollView>(null);
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-20)).current;

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

  const handleAnswer = (questionId: number, value: string) =>
    setAnswers(prev => ({ ...prev, [questionId]: value }));

  const handleSubmit = () => {
    if (allAnswered) navigation.navigate('HeroResult');
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercentage = (answeredCount / sampleQuestions.length) * 100;
  const allAnswered = answeredCount === sampleQuestions.length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
        translucent={false}
      />

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
            Assessment <Icon name="star" size={8} color={COLORS.primaryLight} />
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
          <Icon
            name="send"
            size={13}
            color={allAnswered ? COLORS.textContrast : COLORS.textSecondary}
          />
          <Text
            style={[
              styles.submitText,
              !allAnswered && styles.submitTextDisabled,
            ]}
          >
            {' '}
            Isumite
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* ── Baybayin strip ── */}
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
            <Text style={styles.progressTotal}>
              {' '}
              / {sampleQuestions.length}
            </Text>
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
        {/* Segment ticks */}
        <View style={styles.tickRow}>
          {sampleQuestions.map((_, i) => (
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
        {sampleQuestions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            index={index}
            isLast={index === sampleQuestions.length - 1}
            answer={answers[question.id]}
            onAnswer={handleAnswer}
          />
        ))}

        {/* All-answered CTA */}
        {allAnswered && (
          <Animated.View style={styles.floatingCta}>
            {/* Ornament above button */}
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
              <Icon name="trophy" size={16} color={COLORS.textContrast} />
              <Text style={styles.ctaBtnText}> Ihayag ang Aking Bayani</Text>
              <Text style={styles.ctaBtnArrow}> ▶</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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

  // ── Header ──
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
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
  submitTextDisabled: {
    color: COLORS.textSecondary,
  },

  // ── Steps ──
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
  stepLabelActive: {
    color: COLORS.primary,
    fontFamily: FONTS.PoppinsBold,
  },
  stepConnector: {
    flex: 1,
    height: 1.5,
    backgroundColor: COLORS.secondary,
    marginHorizontal: 4,
    marginBottom: 18,
  },
  stepConnectorCompleted: {
    backgroundColor: COLORS.primary,
  },

  // ── Progress ──
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
  progressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
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
  tickRow: {
    flexDirection: 'row',
    gap: 6,
  },
  tick: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.secondary,
  },
  tickAnswered: {
    backgroundColor: COLORS.primaryLight,
  },

  // ── Ornament Divider ──
  ornamentDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 8,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.secondary,
  },
  dividerStar: {
    color: COLORS.primaryLight,
    fontSize: 10,
  },

  // ── Scroll / Questions ──
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  // ── Timeline side ──
  sideColumn: {
    width: 44,
    alignItems: 'center',
    paddingTop: 2,
  },
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

  // ── Card ──
  cardColumn: {
    flex: 1,
    marginLeft: 12,
  },
  questionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
    // shadow
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
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: 16,
    lineHeight: 24,
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
  optionBadgeTextSelected: {
    color: COLORS.textContrast,
  },
  optionIconWrap: {
    width: 24,
    alignItems: 'center',
  },
  optionText: {
    flex: 1,
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
  },
  optionTextSelected: {
    fontFamily: FONTS.PoppinsBold,
    color: COLORS.primary,
  },
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
  floatingCta: {
    marginTop: 24,
    marginHorizontal: 4,
  },
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
  ctaBtnArrow: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
  },
});
