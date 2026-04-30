export type MBTIDimension = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';

export interface Question {
  id: string;
  text: string;
  options: {
    label: string;
    dimension: MBTIDimension;
    weight: number;
  }[];
}

export const mbtiQuestions: Question[] = [
  {
    id: 'q1',
    text: 'At a party do you:',
    options: [
      { label: 'Interact with many, including strangers', dimension: 'E', weight: 1 },
      { label: 'Interact with a few, known to you', dimension: 'I', weight: 1 },
    ],
  },
  {
    id: 'q2',
    text: 'Are you more:',
    options: [
      { label: 'Realistic than speculative', dimension: 'S', weight: 1 },
      { label: 'Speculative than realistic', dimension: 'N', weight: 1 },
    ],
  },
  {
    id: 'q3',
    text: 'Is it worse to:',
    options: [
      { label: 'Have your "head in the clouds"', dimension: 'S', weight: 1 },
      { label: 'Be "in a rut"', dimension: 'N', weight: 1 },
    ],
  },
  {
    id: 'q4',
    text: 'Are you more impressed by:',
    options: [
      { label: 'Principles', dimension: 'T', weight: 1 },
      { label: 'Emotions', dimension: 'F', weight: 1 },
    ],
  },
  {
    id: 'q5',
    text: 'Are more drawn toward the:',
    options: [
      { label: 'Convincing', dimension: 'T', weight: 1 },
      { label: 'Touching', dimension: 'F', weight: 1 },
    ],
  },
  {
    id: 'q6',
    text: 'Do you prefer to work:',
    options: [
      { label: 'To deadlines', dimension: 'J', weight: 1 },
      { label: 'Just "whenever"', dimension: 'P', weight: 1 },
    ],
  },
  {
    id: 'q7',
    text: 'Do you tend to choose:',
    options: [
      { label: 'Rather carefully', dimension: 'J', weight: 1 },
      { label: 'Somewhat impulsively', dimension: 'P', weight: 1 },
    ],
  },
  // Add remaining standard MBTI questions here...
];

export function calculateMBTI(answers: { dimension: MBTIDimension; weight: number }[]): string {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0,
  };

  answers.forEach((ans) => {
    scores[ans.dimension] += ans.weight;
  });

  const type1 = scores.E >= scores.I ? 'E' : 'I';
  const type2 = scores.S >= scores.N ? 'S' : 'N';
  const type3 = scores.T >= scores.F ? 'T' : 'F';
  const type4 = scores.J >= scores.P ? 'J' : 'P';

  return `${type1}${type2}${type3}${type4}`;
}
