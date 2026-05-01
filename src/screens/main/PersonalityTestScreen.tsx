// filepath: src/screens/main/PersonalityTestScreen.tsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'PersonalityTest'>;

// Sample questions for the psychometric test
const sampleQuestions = [
  {
    id: 1,
    question: "During a conflict, you prefer to:",
    options: [
      { label: "Lead from the frontlines", value: "warrior" },
      { label: "Command from behind the lines", value: "strategist" },
    ],
  },
  {
    id: 2,
    question: "When faced with injustice, you:",
    options: [
      { label: "Take immediate action", value: "action" },
      { label: "Plan a careful response", value: "calculated" },
    ],
  },
  {
    id: 3,
    question: "Your strength lies in:",
    options: [
      { label: "Physical courage", value: "brave" },
      { label: "Mental fortitude", value: "wise" },
    ],
  },
];

function PersonalityTestScreen({ navigation }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Test complete - navigate to result
      navigation.navigate('HeroResult');
    }
  };

  const question = sampleQuestions[currentQuestion];

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        Question {currentQuestion + 1} of {sampleQuestions.length}
      </Text>
      
      <Text style={styles.question}>{question.question}</Text>
      
      <View style={styles.options}>
        {question.options.map((option, index) => (
          <Button
            key={index}
            title={option.label}
            onPress={() => handleAnswer(option.value)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  progress: {
    fontSize: 14,
    color: '#666',
    marginTop: 50,
    marginBottom: 20,
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  options: {
    gap: 15,
  },
});

export default PersonalityTestScreen;