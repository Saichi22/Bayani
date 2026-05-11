// filepath: src/screens/main/PersonalityTestScreen.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'PersonalityTest'>;

// Sample questions for the psychometric test
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

const ORANGE = '#D4704A';
const LIGHT_ORANGE = '#F2DDD4';
const ORANGE_DARK = '#C05A35';

const screenSteps = [
  { id: 'test', label: 'Test' },
  { id: 'demographic', label: 'Demographic' },
  { id: 'camera', label: 'Camera' },
  { id: 'result', label: 'Result' },
];
const CURRENT_SCREEN_INDEX = 0;

function PersonalityTestScreen({ navigation }: Props) {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const scrollRef = useRef<ScrollView>(null);

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length === sampleQuestions.length) {
      navigation.navigate('HeroResult');
    }
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercentage = (answeredCount / sampleQuestions.length) * 100;
  const allAnswered = answeredCount === sampleQuestions.length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backCircle} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.submitButton, !allAnswered && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!allAnswered}
        >
          <Text style={[styles.submitText, !allAnswered && styles.submitTextDisabled]}>
            Submit
          </Text>
        </TouchableOpacity>
      </View>

      {/* Screen Step Indicators */}
      <View style={styles.stepsContainer}>
        <View style={styles.stepRow}>
          {screenSteps.map((step, index) => {
            const isActive = index === CURRENT_SCREEN_INDEX;
            const isCompleted = index < CURRENT_SCREEN_INDEX;
            return (
              <View key={step.id} style={styles.stepItem}>
                <View style={[
                  styles.stepCircle,
                  isActive && styles.stepCircleActive,
                  isCompleted && styles.stepCircleCompleted,
                ]}>
                  <Text style={[
                    styles.stepCircleText,
                    (isActive || isCompleted) && styles.stepCircleTextActive,
                  ]}>
                    {index + 1}
                  </Text>
                </View>
                {index < screenSteps.length - 1 && (
                  <View style={[
                    styles.stepConnector,
                    isCompleted && styles.stepConnectorCompleted,
                  ]} />
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBar, { width: `${progressPercentage}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {answeredCount}/{sampleQuestions.length} Answered
        </Text>
      </View>

      {/* Scrollable Question List */}
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {sampleQuestions.map((question, index) => {
          const isAnswered = !!answers[question.id];
          const isLast = index === sampleQuestions.length - 1;

          return (
            <View key={question.id} style={styles.questionRow}>
              {/* Number + Dotted Line Column */}
              <View style={styles.sideColumn}>
                <View style={[
                  styles.numberCircle,
                  isAnswered && styles.numberCircleAnswered,
                ]}>
                  <Text style={[
                    styles.numberText,
                    isAnswered && styles.numberTextAnswered,
                  ]}>
                    {index + 1}
                  </Text>
                </View>
                {!isLast && <View style={styles.dottedLine} />}
              </View>

              {/* Question Card */}
              <View style={styles.cardColumn}>
                <View style={[
                  styles.questionCard,
                  isAnswered && styles.questionCardAnswered,
                ]}>
                  <Text style={styles.questionText}>{question.question}</Text>

                  {/* Option A */}
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      answers[question.id] === question.valueA && styles.optionButtonSelected,
                    ]}
                    onPress={() => handleAnswer(question.id, question.valueA)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.optionInner}>
                      <View style={[
                        styles.optionBadge,
                        answers[question.id] === question.valueA && styles.optionBadgeSelected,
                      ]}>
                        <Text style={[
                          styles.optionBadgeText,
                          answers[question.id] === question.valueA && styles.optionBadgeTextSelected,
                        ]}>A</Text>
                      </View>
                      <Text style={[
                        styles.optionText,
                        answers[question.id] === question.valueA && styles.optionTextSelected,
                      ]}>
                        {question.optionA}
                      </Text>
                      {answers[question.id] === question.valueA && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>
                  </TouchableOpacity>

                  {/* Option B */}
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      answers[question.id] === question.valueB && styles.optionButtonSelected,
                    ]}
                    onPress={() => handleAnswer(question.id, question.valueB)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.optionInner}>
                      <View style={[
                        styles.optionBadge,
                        answers[question.id] === question.valueB && styles.optionBadgeSelected,
                      ]}>
                        <Text style={[
                          styles.optionBadgeText,
                          answers[question.id] === question.valueB && styles.optionBadgeTextSelected,
                        ]}>B</Text>
                      </View>
                      <Text style={[
                        styles.optionText,
                        answers[question.id] === question.valueB && styles.optionTextSelected,
                      ]}>
                        {question.optionB}
                      </Text>
                      {answers[question.id] === question.valueB && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Spacer below card before next question */}
                {!isLast && <View style={{ height: 16 }} />}
              </View>
            </View>
          );
        })}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F0',
  },

  /* ── Header ── */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: 'transparent',
  },
  backCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: ORANGE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    lineHeight: 26,
  },
  submitButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: ORANGE,
    backgroundColor: 'transparent',
  },
  submitButtonDisabled: {
    borderColor: '#ccc',
  },
  submitText: {
    color: ORANGE,
    fontWeight: '700',
    fontSize: 15,
  },
  submitTextDisabled: {
    color: '#bbb',
  },

  /* ── Screen Steps ── */
  stepsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 2,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#DDD',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    borderColor: ORANGE,
    backgroundColor: ORANGE,
  },
  stepCircleCompleted: {
    borderColor: ORANGE,
    backgroundColor: LIGHT_ORANGE,
  },
  stepCircleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#aaa',
  },
  stepCircleTextActive: {
    color: '#fff',
  },
  stepConnector: {
    flex: 1,
    height: 2,
    backgroundColor: '#DDD',
    marginHorizontal: 4,
  },
  stepConnectorCompleted: {
    backgroundColor: ORANGE,
  },

  /* ── Progress Bar ── */
  progressContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  progressBarBackground: {
    height: 10,
    borderRadius: 6,
    backgroundColor: '#E8D5CC',
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: ORANGE,
  },
  progressText: {
    fontSize: 13,
    color: ORANGE,
    fontWeight: '600',
    textAlign: 'right',
  },

  /* ── Scroll ── */
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  /* ── Question Row (number + card) ── */
  questionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  /* ── Side Column (number bubble + dotted line) ── */
  sideColumn: {
    width: 44,
    alignItems: 'center',
    paddingTop: 4,
  },
  numberCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#C4A090',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  numberCircleAnswered: {
    backgroundColor: ORANGE,
  },
  numberText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  numberTextAnswered: {
    color: '#fff',
  },
  dottedLine: {
    width: 2,
    flex: 1,
    minHeight: 28,
    borderLeftWidth: 2,
    borderLeftColor: '#C4A090',
    borderStyle: 'dashed',
    marginTop: 4,
    marginBottom: -4,
  },

  /* ── Card Column ── */
  cardColumn: {
    flex: 1,
    marginLeft: 10,
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#E8D0C8',
    shadowColor: '#C4A090',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  questionCardAnswered: {
    borderColor: ORANGE,
  },
  questionText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2D1A10',
    marginBottom: 16,
    lineHeight: 24,
  },

  /* ── Options ── */
  optionButton: {
    borderWidth: 1.5,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#FAFAFA',
  },
  optionButtonSelected: {
    backgroundColor: LIGHT_ORANGE,
    borderColor: ORANGE,
  },
  optionInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  optionBadgeSelected: {
    backgroundColor: LIGHT_ORANGE,
  },
  optionBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#888',
  },
  optionBadgeTextSelected: {
    color: ORANGE,
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  optionTextSelected: {
    color: ORANGE_DARK,
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 18,
    color: '#4CAF50',
    marginLeft: 6,
  },
});

export default PersonalityTestScreen;
