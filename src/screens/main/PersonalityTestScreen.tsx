// filepath: src/screens/main/PersonalityTestScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
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

const ORANGE = '#FF8C42';
const LIGHT_ORANGE = '#FFE5D5';

const screenSteps = [
  { id: 'test', label: 'Test', screen: 'PersonalityTest' },
  { id: 'demographic', label: 'Demographic', screen: 'DemographicProfile' },
  { id: 'camera', label: 'Camera', screen: 'Camera' },
  { id: 'result', label: 'Result', screen: 'HeroResult' },
];

function PersonalityTestScreen({ navigation }: Props) {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const currentScreenIndex = 0; // We're on the Test screen (first step)

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (answers[sampleQuestions[currentQuestion].id]) {
      setCurrentQuestion((prev) => Math.min(prev + 1, sampleQuestions.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentQuestion((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length === sampleQuestions.length) {
      navigation.navigate('HeroResult');
    }
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercentage = (answeredCount / sampleQuestions.length) * 100;
  const question = sampleQuestions[currentQuestion];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.submitButton, answeredCount !== sampleQuestions.length && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={answeredCount !== sampleQuestions.length}
        >
          <Text style={[styles.submitText, answeredCount !== sampleQuestions.length && styles.submitTextDisabled]}>
            Submit
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.stepLabel}>
          Screen {currentScreenIndex + 1} of {screenSteps.length}
        </Text>

        <View style={styles.stepRow}>
          {screenSteps.map((step, index) => {
            const isActive = index === currentScreenIndex;
            const isCompleted = index < currentScreenIndex;
            const answeredCount = Object.keys(answers).length;
            const allAnswered = answeredCount === sampleQuestions.length;
            const allowClick = index <= currentScreenIndex && (index === 0 || allAnswered);

            return (
              <TouchableOpacity
                key={step.id}
                style={[
                  styles.stepCircle,
                  isActive && styles.stepCircleActive,
                  isCompleted && !isActive && styles.stepCircleCompleted,
                  !allowClick && styles.stepCircleDisabled,
                ]}
                onPress={() => allowClick && navigation.navigate(step.screen as never)}
                disabled={!allowClick}
              >
                <Text
                  style={[
                    styles.stepCircleText,
                    (isActive || isCompleted) && styles.stepCircleTextActive,
                  ]}
                >
                  {index + 1}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBar, { width: `${(currentScreenIndex / (screenSteps.length - 1)) * 100}%` }]} />
          {screenSteps.slice(1).map((_, index) => (
            <View
              key={`marker-${index}`}
              style={[
                styles.progressMarker,
                { left: `${((index + 1) / screenSteps.length) * 100}%` },
              ]}
            />
          ))}
        </View>
        <Text style={styles.progressText}>
          Test Progress: {Object.keys(answers).length}/{sampleQuestions.length} Answered
        </Text>
      </View>

      <View style={styles.questionWrapper}>
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{question.question}</Text>

          <TouchableOpacity
            style={[
              styles.optionButton,
              answers[question.id] === question.valueA && styles.optionButtonSelected,
            ]}
            onPress={() => handleAnswer(question.id, question.valueA)}
          >
            <View style={styles.optionHeader}>
              <Text style={styles.optionLabel}>A</Text>
              {answers[question.id] === question.valueA && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.optionText}>{question.optionA}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionButton,
              answers[question.id] === question.valueB && styles.optionButtonSelected,
            ]}
            onPress={() => handleAnswer(question.id, question.valueB)}
          >
            <View style={styles.optionHeader}>
              <Text style={styles.optionLabel}>B</Text>
              {answers[question.id] === question.valueB && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.optionText}>{question.optionB}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={[styles.navButton, currentQuestion === 0 && styles.navButtonDisabled]}
          onPress={handlePrevious}
          disabled={currentQuestion === 0}
        >
          <Text style={[styles.navButtonText, currentQuestion === 0 && styles.navButtonTextDisabled]}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButton, !answers[question.id] && styles.navButtonDisabled]}
          onPress={currentQuestion === sampleQuestions.length - 1 ? handleSubmit : handleNext}
          disabled={!answers[question.id]}
        >
          <Text style={[styles.navButtonText, !answers[question.id] && styles.navButtonTextDisabled]}>
            {currentQuestion === sampleQuestions.length - 1 ? 'Submit' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    fontSize: 28,
    color: ORANGE,
    fontWeight: 'bold',
  },
  submitButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: ORANGE,
    borderRadius: 20,
  },
  submitButtonDisabled: {
    borderColor: '#eee',
  },
  submitText: {
    color: ORANGE,
    fontWeight: 'bold',
    fontSize: 14,
  },
  submitTextDisabled: {
    color: '#ccc',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  stepLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  progressBarBackground: {
    position: 'relative',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f1f1f1',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: ORANGE,
  },
  progressMarker: {
    position: 'absolute',
    top: -4,
    width: 2,
    height: 16,
    backgroundColor: '#fff',
    borderColor: '#eee',
    borderWidth: 1,
  },
  progressText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 8,
  },
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#eee',
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
  stepCircleDisabled: {
    opacity: 0.4,
  },
  stepCircleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#888',
  },
  stepCircleTextActive: {
    color: '#fff',
  },
  questionWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 22,
    borderWidth: 2,
    borderColor: ORANGE,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  optionButton: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    backgroundColor: '#f9f9f9',
  },
  optionButtonSelected: {
    backgroundColor: LIGHT_ORANGE,
    borderColor: ORANGE,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ORANGE,
    backgroundColor: LIGHT_ORANGE,
    width: 28,
    height: 28,
    borderRadius: 6,
    textAlign: 'center',
    lineHeight: 28,
  },
  checkmark: {
    fontSize: 20,
    color: ORANGE,
    fontWeight: 'bold',
  },
  optionText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  navButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: ORANGE,
    backgroundColor: '#fff',
  },
  navButtonDisabled: {
    borderColor: '#eee',
    backgroundColor: '#fafafa',
  },
  navButtonText: {
    color: ORANGE,
    fontWeight: 'bold',
  },
  navButtonTextDisabled: {
    color: '#ccc',
  },
});

export default PersonalityTestScreen;
