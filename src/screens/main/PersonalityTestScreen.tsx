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

type Props = NativeStackScreenProps<MainStackParamList, 'PersonalityTest'>;

const bayaniBackground = require('../../assets/images/bayaniBackground.png');

// ── Full Question Bank ────────────────────────────────────────────────────────

const allQuestions: ScoredQuestion[] = [
  // ── PART 1: UGALI ──
  {
    id: 'p1_q1',
    part: 'PART_1',
    question: 'When you enter a new environment where you do not know anyone, how do you usually behave?',
    options: [
      { id: 'A', label: 'A', heroes: ['gen_antonio_luna', 'graciano_lopez_jaena', 'andres_bonifacio'] },
      { id: 'B', label: 'B', heroes: ['jose_rizal', 'emilio_jacinto', 'leonor_rivera'] },
      { id: 'C', label: 'C', heroes: ['felipe_agoncillo', 'mariano_ponce', 'galicano_apacible'] },
      { id: 'D', label: 'D', heroes: ['apolinario_mabini', 'marcelo_del_pilar', 'epifanio_de_los_santos'] },
      { id: 'E', label: 'E', heroes: ['rafael_palma', 'francisco_baltazar', 'fernando_guerrero'] },
      { id: 'F', label: 'F', heroes: ['panday_pira', 'artemio_ricarte', 'gen_emilio_aguinaldo'] },
      { id: 'G', label: 'G', heroes: ['apolinario_mabini', 'jose_ma_panganiban', 'jacinto_zamora'] },
    ],
  },
  {
    id: 'p1_q2',
    part: 'PART_1',
    question: 'When approaching an important task or responsibility, how do you typically regulate your actions?',
    options: [
      { id: 'A', label: 'A', heroes: ['andres_bonifacio', 'gen_antonio_luna', 'lapu_lapu'] },
      { id: 'B', label: 'B', heroes: ['gen_gregorio_del_pilar', 'diego_silang', 'artemio_ricarte'] },
      { id: 'C', label: 'C', heroes: ['apolinario_mabini', 'jose_rizal', 'panday_pira'] },
      { id: 'D', label: 'D', heroes: ['marcelo_del_pilar', 'epifanio_de_los_santos', 'mariano_ponce'] },
      { id: 'E', label: 'E', heroes: ['gen_emilio_aguinaldo', 'felipe_agoncillo', 'galicano_apacible'] },
      { id: 'F', label: 'F', heroes: ['juan_luna', 'leona_florentino', 'francisco_baltazar'] },
      { id: 'G', label: 'G', heroes: ['rafael_palma', 'pedro_paterno', 'julian_felipe'] },
    ],
  },
  {
    id: 'p1_q3',
    part: 'PART_1',
    question: 'How do you typically make important decisions?',
    options: [
      { id: 'A', label: 'A', heroes: ['apolinario_mabini', 'epifanio_de_los_santos', 'marcelo_del_pilar'] },
      { id: 'B', label: 'B', heroes: ['andres_bonifacio', 'emilio_jacinto', 'gen_gregorio_del_pilar'] },
      { id: 'C', label: 'C', heroes: ['gregoria_de_jesus', 'leonor_rivera', 'melchora_aquino'] },
      { id: 'D', label: 'D', heroes: ['jose_rizal', 'rafael_palma', 'mariano_ponce'] },
      { id: 'E', label: 'E', heroes: ['gen_emilio_aguinaldo', 'galicano_apacible', 'marcela_agoncillo'] },
      { id: 'F', label: 'F', heroes: ['felipe_agoncillo', 'graciano_lopez_jaena', 'fernando_guerrero'] },
      { id: 'G', label: 'G', heroes: ['lapu_lapu', 'diego_silang', 'gabriela_silang', 'francisco_dagohoy'] },
    ],
  },
  {
    id: 'p1_q4',
    part: 'PART_1',
    question: 'In a group setting, what role do you naturally take?',
    options: [
      { id: 'A', label: 'A', heroes: ['gen_antonio_luna', 'gen_emilio_aguinaldo', 'lapu_lapu'] },
      { id: 'B', label: 'B', heroes: ['graciano_lopez_jaena', 'andres_bonifacio', 'gabriela_silang'] },
      { id: 'C', label: 'C', heroes: ['apolinario_mabini', 'marcelo_del_pilar', 'emilio_jacinto'] },
      { id: 'D', label: 'D', heroes: ['gregoria_de_jesus', 'agueda_esteban', 'marina_dizon', 'marcela_agoncillo'] },
      { id: 'E', label: 'E', heroes: ['juan_luna', 'panday_pira', 'francisco_baltazar', 'leona_florentino'] },
      { id: 'F', label: 'F', heroes: ['jose_rizal', 'epifanio_de_los_santos', 'jose_palma'] },
      { id: 'G', label: 'G', heroes: ['melchora_aquino', 'trinidad_tecson', 'leonor_rivera'] },
    ],
  },
  {
    id: 'p1_q5',
    part: 'PART_1',
    question: 'When facing challenges or setbacks, how do you typically respond?',
    options: [
      { id: 'A', label: 'A', heroes: ['apolinario_mabini', 'gen_emilio_aguinaldo', 'felipe_agoncillo'] },
      { id: 'B', label: 'B', heroes: ['gen_antonio_luna', 'andres_bonifacio', 'francisco_dagohoy'] },
      { id: 'C', label: 'C', heroes: ['jose_rizal', 'marcelo_del_pilar', 'mariano_ponce'] },
      { id: 'D', label: 'D', heroes: ['gregoria_de_jesus', 'melchora_aquino', 'leonor_rivera'] },
      { id: 'E', label: 'E', heroes: ['gen_gregorio_del_pilar', 'lapu_lapu', 'rajah_sulayman', 'artemio_ricarte'] },
      { id: 'F', label: 'F', heroes: ['juan_luna', 'francisco_baltazar', 'leona_florentino', 'jose_palma'] },
      { id: 'G', label: 'G', heroes: ['emilio_jacinto', 'fernando_guerrero', 'jacinto_zamora', 'mariano_gomez'] },
    ],
  },
  {
    id: 'p1_q6',
    part: 'PART_1',
    question: 'Which statement best describes your general outlook in life?',
    options: [
      { id: 'A', label: 'A', heroes: ['jose_rizal', 'emilio_jacinto', 'graciano_lopez_jaena'] },
      { id: 'B', label: 'B', heroes: ['apolinario_mabini', 'felipe_agoncillo', 'mariano_ponce'] },
      { id: 'C', label: 'C', heroes: ['andres_bonifacio', 'gen_gregorio_del_pilar', 'francisco_dagohoy'] },
      { id: 'D', label: 'D', heroes: ['juan_luna', 'francisco_baltazar', 'leona_florentino', 'epifanio_de_los_santos'] },
      { id: 'E', label: 'E', heroes: ['melchora_aquino', 'gregoria_de_jesus', 'trinidad_tecson'] },
      { id: 'F', label: 'F', heroes: ['panday_pira', 'rafael_palma', 'galicano_apacible', 'marcela_agoncillo'] },
      { id: 'G', label: 'G', heroes: ['marcelo_del_pilar', 'jose_burgos', 'isabelo_de_los_reyes', 'jacinto_zamora'] },
    ],
  },

  // ── PART 2: KATANGIAN ──
  {
    id: 'p2_q7',
    part: 'PART_2',
    question: 'When conflict arises, what is your natural response?',
    options: [
      { id: 'A', label: 'A', heroes: ['jose_rizal', 'felipe_agoncillo', 'jose_burgos'] },
      { id: 'B', label: 'B', heroes: ['gen_antonio_luna', 'lapu_lapu', 'diego_silang'] },
      { id: 'C', label: 'C', heroes: ['apolinario_mabini', 'gen_emilio_aguinaldo', 'panday_pira'] },
      { id: 'D', label: 'D', heroes: ['marcelo_del_pilar', 'graciano_lopez_jaena', 'juan_luna'] },
      { id: 'E', label: 'E', heroes: ['andres_bonifacio', 'trinidad_tecson', 'artemio_ricarte'] },
      { id: 'F', label: 'F', heroes: ['melchora_aquino', 'gregoria_de_jesus', 'mariano_gomez'] },
      { id: 'G', label: 'G', heroes: ['emilio_jacinto', 'isabelo_de_los_reyes', 'epifanio_de_los_santos'] },
    ],
  },
  {
    id: 'p2_q8',
    part: 'PART_2',
    question: 'What kind of strength do you admire most in a hero?',
    options: [
      { id: 'A', label: 'A', heroes: ['melchora_aquino', 'leonor_rivera', 'agueda_esteban'] },
      { id: 'B', label: 'B', heroes: ['jose_rizal', 'apolinario_mabini', 'emilio_jacinto'] },
      { id: 'C', label: 'C', heroes: ['gen_gregorio_del_pilar', 'lapu_lapu', 'rajah_sulayman'] },
      { id: 'D', label: 'D', heroes: ['gen_antonio_luna', 'panday_pira', 'artemio_ricarte'] },
      { id: 'E', label: 'E', heroes: ['apolinario_mabini', 'gregoria_de_jesus', 'francisco_dagohoy'] },
      { id: 'F', label: 'F', heroes: ['graciano_lopez_jaena', 'marcelo_del_pilar', 'jose_palma'] },
      { id: 'G', label: 'G', heroes: ['gen_gregorio_del_pilar', 'jose_burgos', 'jacinto_zamora', 'mariano_gomez'] },
    ],
  },
  {
    id: 'p2_q9',
    part: 'PART_2',
    question: 'Which quality do you think is most important when leading others?',
    options: [
      { id: 'A', label: 'A', heroes: ['melchora_aquino', 'leonor_rivera', 'marcela_agoncillo'] },
      { id: 'B', label: 'B', heroes: ['apolinario_mabini', 'marcelo_del_pilar', 'mariano_ponce'] },
      { id: 'C', label: 'C', heroes: ['andres_bonifacio', 'gen_gregorio_del_pilar', 'lapu_lapu'] },
      { id: 'D', label: 'D', heroes: ['gen_antonio_luna', 'gen_emilio_aguinaldo', 'rajah_sulayman'] },
      { id: 'E', label: 'E', heroes: ['graciano_lopez_jaena', 'emilio_jacinto', 'gabriela_silang'] },
      { id: 'F', label: 'F', heroes: ['jose_rizal', 'felipe_agoncillo', 'jose_burgos'] },
      { id: 'G', label: 'G', heroes: ['gen_emilio_aguinaldo', 'diego_silang', 'galicano_apacible'] },
    ],
  },
  {
    id: 'p2_q10',
    part: 'PART_2',
    question: 'When you disagree with something, what feels most natural to you?',
    options: [
      { id: 'A', label: 'A', heroes: ['jose_rizal', 'felipe_agoncillo', 'mariano_gomez'] },
      { id: 'B', label: 'B', heroes: ['graciano_lopez_jaena', 'gen_antonio_luna', 'diego_silang'] },
      { id: 'C', label: 'C', heroes: ['marcelo_del_pilar', 'emilio_jacinto', 'isabelo_de_los_reyes'] },
      { id: 'D', label: 'D', heroes: ['juan_luna', 'leona_florentino', 'jose_palma', 'francisco_baltazar'] },
      { id: 'E', label: 'E', heroes: ['andres_bonifacio', 'trinidad_tecson', 'agueda_esteban'] },
      { id: 'F', label: 'F', heroes: ['apolinario_mabini', 'gregoria_de_jesus', 'galicano_apacible'] },
      { id: 'G', label: 'G', heroes: ['epifanio_de_los_santos', 'mariano_ponce', 'rafael_palma'] },
    ],
  },
  {
    id: 'p2_q11',
    part: 'PART_2',
    question: 'In a group, are you more comfortable…',
    options: [
      { id: 'A', label: 'A', heroes: ['gen_antonio_luna', 'gen_emilio_aguinaldo', 'lakandula'] },
      { id: 'B', label: 'B', heroes: ['graciano_lopez_jaena', 'andres_bonifacio', 'gabriela_silang'] },
      { id: 'C', label: 'C', heroes: ['apolinario_mabini', 'emilio_jacinto', 'marcelo_del_pilar'] },
      { id: 'D', label: 'D', heroes: ['panday_pira', 'artemio_ricarte', 'marina_dizon'] },
      { id: 'E', label: 'E', heroes: ['melchora_aquino', 'trinidad_tecson', 'marcela_agoncillo'] },
      { id: 'F', label: 'F', heroes: ['jose_rizal', 'epifanio_de_los_santos', 'mariano_ponce'] },
      { id: 'G', label: 'G', heroes: ['juan_luna', 'francisco_baltazar', 'leona_florentino', 'panday_pira'] },
    ],
  },
  {
    id: 'p2_q12',
    part: 'PART_2',
    question: 'How do you deal with someone who has hurt you or someone you love?',
    options: [
      { id: 'A', label: 'A', heroes: ['jose_rizal', 'leonor_rivera', 'melchora_aquino'] },
      { id: 'B', label: 'B', heroes: ['gen_antonio_luna', 'andres_bonifacio', 'diego_silang'] },
      { id: 'C', label: 'C', heroes: ['gen_emilio_aguinaldo', 'apolinario_mabini', 'galicano_apacible'] },
      { id: 'D', label: 'D', heroes: ['juan_luna', 'emilio_jacinto', 'leona_florentino'] },
      { id: 'E', label: 'E', heroes: ['gregoria_de_jesus', 'agueda_esteban', 'marina_dizon', 'trinidad_tecson'] },
      { id: 'F', label: 'F', heroes: ['gen_gregorio_del_pilar', 'gabriela_silang', 'artemio_ricarte'] },
      { id: 'G', label: 'G', heroes: ['marcelo_del_pilar', 'epifanio_de_los_santos', 'isabelo_de_los_reyes'] },
    ],
  },

  // ── PART 3: PAGSUBOK ──
  {
    id: 'p3_q13',
    part: 'PART_3',
    question: 'You are in the middle of a battle. The situation suddenly worsens and your group needs help. What do you do?',
    options: [
      { id: 'A', label: 'A', heroes: ['gen_gregorio_del_pilar', 'lapu_lapu', 'rajah_sulayman'] },
      { id: 'B', label: 'B', heroes: ['gen_antonio_luna', 'gen_emilio_aguinaldo', 'artemio_ricarte'] },
      { id: 'C', label: 'C', heroes: ['apolinario_mabini', 'marcelo_del_pilar', 'mariano_ponce'] },
      { id: 'D', label: 'D', heroes: ['gen_antonio_luna', 'panday_pira', 'diego_silang'] },
      { id: 'E', label: 'E', heroes: ['andres_bonifacio', 'emilio_jacinto', 'gabriela_silang'] },
      { id: 'F', label: 'F', heroes: ['melchora_aquino', 'gregoria_de_jesus', 'agueda_esteban'] },
      { id: 'G', label: 'G', heroes: ['jose_rizal', 'epifanio_de_los_santos', 'fernando_guerrero'] },
    ],
  },
  {
    id: 'p3_q14',
    part: 'PART_3',
    question: 'You discover that one of your most trusted allies has betrayed your group. How do you handle it?',
    options: [
      { id: 'A', label: 'A', heroes: ['jose_rizal', 'felipe_agoncillo', 'leonor_rivera'] },
      { id: 'B', label: 'B', heroes: ['andres_bonifacio', 'trinidad_tecson', 'gregoria_de_jesus'] },
      { id: 'C', label: 'C', heroes: ['gen_antonio_luna', 'graciano_lopez_jaena', 'diego_silang'] },
      { id: 'D', label: 'D', heroes: ['apolinario_mabini', 'epifanio_de_los_santos', 'mariano_ponce'] },
      { id: 'E', label: 'E', heroes: ['gen_emilio_aguinaldo', 'galicano_apacible', 'rafael_palma'] },
      { id: 'F', label: 'F', heroes: ['marcelo_del_pilar', 'isabelo_de_los_reyes', 'jose_ma_panganiban'] },
      { id: 'G', label: 'G', heroes: ['emilio_jacinto', 'artemio_ricarte', 'panday_pira'] },
    ],
  },
  {
    id: 'p3_q15',
    part: 'PART_3',
    question: 'You are warned not to speak against the government, or you may be punished. What will you do?',
    options: [
      { id: 'A', label: 'A', heroes: ['jose_burgos', 'mariano_gomez', 'jacinto_zamora'] },
      { id: 'B', label: 'B', heroes: ['jose_rizal', 'marcelo_del_pilar', 'mariano_ponce'] },
      { id: 'C', label: 'C', heroes: ['jose_rizal', 'juan_luna', 'francisco_baltazar', 'leona_florentino'] },
      { id: 'D', label: 'D', heroes: ['marcelo_del_pilar', 'graciano_lopez_jaena', 'isabelo_de_los_reyes'] },
      { id: 'E', label: 'E', heroes: ['andres_bonifacio', 'emilio_jacinto', 'trinidad_tecson'] },
      { id: 'F', label: 'F', heroes: ['felipe_agoncillo', 'rafael_palma', 'galicano_apacible'] },
      { id: 'G', label: 'G', heroes: ['epifanio_de_los_santos', 'jose_ma_panganiban', 'fernando_guerrero'] },
    ],
  },
  {
    id: 'p3_q16',
    part: 'PART_3',
    question: 'Your movement is close to success, but achieving it will require your life. Will you accept it?',
    options: [
      { id: 'A', label: 'A', heroes: ['gen_gregorio_del_pilar', 'jose_burgos', 'lapu_lapu'] },
      { id: 'B', label: 'B', heroes: ['jose_rizal', 'andres_bonifacio', 'emilio_jacinto'] },
      { id: 'C', label: 'C', heroes: ['apolinario_mabini', 'gen_emilio_aguinaldo', 'galicano_apacible'] },
      { id: 'D', label: 'D', heroes: ['rafael_palma', 'mariano_ponce', 'felipe_agoncillo'] },
      { id: 'E', label: 'E', heroes: ['gregoria_de_jesus', 'leonor_rivera', 'marcela_agoncillo'] },
      { id: 'F', label: 'F', heroes: ['apolinario_mabini', 'epifanio_de_los_santos', 'mariano_ponce'] },
      { id: 'G', label: 'G', heroes: ['jose_rizal', 'epifanio_de_los_santos', 'francisco_baltazar'] },
    ],
  },
  {
    id: 'p3_q17',
    part: 'PART_3',
    question: 'You witness a powerful person abusing someone vulnerable in your community. You are the only witness. What will you do?',
    options: [
      { id: 'A', label: 'A', heroes: ['gen_antonio_luna', 'lapu_lapu', 'diego_silang'] },
      { id: 'B', label: 'B', heroes: ['melchora_aquino', 'agueda_esteban', 'gregoria_de_jesus'] },
      { id: 'C', label: 'C', heroes: ['felipe_agoncillo', 'jose_burgos', 'mariano_gomez'] },
      { id: 'D', label: 'D', heroes: ['marcelo_del_pilar', 'epifanio_de_los_santos', 'isabelo_de_los_reyes'] },
      { id: 'E', label: 'E', heroes: ['jose_rizal', 'graciano_lopez_jaena', 'emilio_jacinto'] },
      { id: 'F', label: 'F', heroes: ['andres_bonifacio', 'trinidad_tecson', 'artemio_ricarte'] },
      { id: 'G', label: 'G', heroes: ['epifanio_de_los_santos', 'mariano_ponce', 'fernando_guerrero'] },
    ],
  },
  {
    id: 'p3_q18',
    part: 'PART_3',
    question: 'You discover confidential information that could change the course of history but revealing it is dangerous. Who do you prioritize?',
    options: [
      { id: 'A', label: 'A', heroes: ['jose_rizal', 'graciano_lopez_jaena', 'jose_burgos'] },
      { id: 'B', label: 'B', heroes: ['andres_bonifacio', 'gen_gregorio_del_pilar', 'gregoria_de_jesus'] },
      { id: 'C', label: 'C', heroes: ['epifanio_de_los_santos', 'rafael_palma', 'francisco_baltazar'] },
      { id: 'D', label: 'D', heroes: ['melchora_aquino', 'agueda_esteban', 'trinidad_tecson'] },
      { id: 'E', label: 'E', heroes: ['felipe_agoncillo', 'apolinario_mabini', 'mariano_ponce'] },
      { id: 'F', label: 'F', heroes: ['juan_luna', 'leona_florentino', 'jose_palma', 'fernando_guerrero'] },
      { id: 'G', label: 'G', heroes: ['jose_rizal', 'emilio_jacinto', 'artemio_ricarte'] },
    ],
  },
];

// ── Option label → readable text ──────────────────────────────────────────────

const OPTION_LABELS: Record<string, Record<string, string>> = {
  p1_q1: {
    A: 'I immediately introduce myself and take initiative to meet people.',
    B: 'I find one person and start a genuine one-on-one conversation.',
    C: 'I wait for the right moment, then join naturally when it feels right.',
    D: 'I observe the room carefully before deciding who to approach.',
    E: 'I stay near the edges and only engage if someone approaches me first.',
    F: 'I focus on understanding the environment before I interact with anyone.',
    G: 'I remain quiet and reserved, preferring to be approached.',
  },
  p1_q2: {
    A: 'I dive in immediately — action first, adjustments later.',
    B: 'I make a quick plan then move fast before the moment passes.',
    C: 'I build a solid strategy before taking any action.',
    D: 'I research and gather information thoroughly before starting.',
    E: 'I proceed step by step, adapting as new information comes.',
    F: 'I prepare slowly and carefully, making sure everything is right.',
    G: 'I wait until I feel fully ready, sometimes too long.',
  },
  p1_q3: {
    A: 'Pure logic — I analyze facts and evidence before anything else.',
    B: 'My instincts and moral values guide me above all.',
    C: 'I follow what my heart says, especially for the people I love.',
    D: 'I think deeply about long-term consequences before deciding.',
    E: 'I consult others and factor in collective opinion.',
    F: 'I balance both logic and emotion — neither alone is enough.',
    G: 'I act on urgency — whoever or whatever needs me most right now.',
  },
  p1_q4: {
    A: 'I lead — I naturally direct the group and keep things moving.',
    B: 'I inspire — I motivate the group through words and energy.',
    C: 'I strategize — I think ahead and advise the leader.',
    D: 'I support — I make sure everything behind the scenes runs well.',
    E: 'I create — I contribute independently through my craft or skill.',
    F: 'I document — I record, write, and preserve what the group does.',
    G: 'I nurture — I take care of the people within the group.',
  },
  p1_q5: {
    A: 'I stay calm and immediately look for the next move.',
    B: 'I get more aggressive — setbacks fuel my determination.',
    C: 'I step back, reassess, and come back stronger.',
    D: 'I lean on the people around me for strength.',
    E: 'I stay steady and endure — persistence is my strength.',
    F: 'I channel my feelings into my work or craft.',
    G: 'I feel the weight of it deeply, but I keep going quietly.',
  },
  p1_q6: {
    A: 'I believe the future can be better — progress is always possible.',
    B: 'I am hopeful but realistic — I never ignore the difficulty ahead.',
    C: 'Life is a struggle but that is exactly what makes it meaningful.',
    D: 'I find meaning through creating and leaving something behind.',
    E: 'My purpose is to serve others — my life means little without that.',
    F: 'I work quietly and steadily — results matter more than outlook.',
    G: 'I question everything — truth and justice are worth any cost.',
  },
  p2_q7: {
    A: 'Resolve it through calm dialogue and diplomacy.',
    B: 'Confront it directly and forcefully — no backing down.',
    C: 'Outsmart it — find the strategic angle others miss.',
    D: 'Express opposition through writing, art, or public speech.',
    E: 'Organize others so resistance becomes collective and stronger.',
    F: 'Endure quietly — let your continued existence be the resistance.',
    G: 'Expose it — bring the truth to light so others can judge.',
  },
  p2_q8: {
    A: 'Compassion — caring for others even at personal cost.',
    B: 'Intellect — using the mind as the most powerful weapon.',
    C: 'Courage — acting despite fear, especially in battle.',
    D: 'Discipline — maintaining standards and pushing others to do the same.',
    E: 'Endurance — surviving and continuing when everything says stop.',
    F: 'Eloquence — moving hearts and minds through words.',
    G: 'Sacrifice — willingly giving up what matters most for the cause.',
  },
  p2_q9: {
    A: 'Kindness and genuine care for the people you lead.',
    B: 'Strategic thinking and long-term vision.',
    C: 'Bravery — leading from the front and never asking others to do what you won\'t.',
    D: 'Authority and the ability to command respect.',
    E: 'Inspiration — making people believe in the cause.',
    F: 'Integrity — being someone others can trust completely.',
    G: 'Adaptability — knowing when to change the plan.',
  },
  p2_q10: {
    A: 'Talk privately and calmly — find a compromise without noise.',
    B: 'Stand up publicly and loudly — let everyone know where you stand.',
    C: 'Write about it — an essay, article, or public piece.',
    D: 'Express it through art, poetry, or symbolism.',
    E: 'Organize a collective response — one voice is not enough.',
    F: 'Work quietly behind the scenes to change the situation.',
    G: 'Document it carefully and preserve it for the record.',
  },
  p2_q11: {
    A: 'Leading and making the key decisions.',
    B: 'Being the voice — speaking and inspiring on behalf of the group.',
    C: 'Being the mind — advising and shaping strategy from behind.',
    D: 'Being the hands — doing the critical work that makes the plan real.',
    E: 'Being the heart — keeping morale and unity strong.',
    F: 'Being the record-keeper — documenting and preserving the group\'s work.',
    G: 'Working independently and contributing the result, not the process.',
  },
  p2_q12: {
    A: 'I forgive them — holding on to anger serves no one.',
    B: 'I confront them directly — they need to be held accountable.',
    C: 'I make sure they can never do it again — prevention over revenge.',
    D: 'I channel it into my work — pain becomes purpose.',
    E: 'I protect the others around me first before anything else.',
    F: 'I use it as fuel to fight harder and longer.',
    G: 'I document it — the truth of what happened must be preserved.',
  },
  p3_q13: {
    A: 'Step to the front — your presence alone steadies the group.',
    B: 'Take command immediately and give clear orders.',
    C: 'Fall back briefly, assess the situation, then return with a plan.',
    D: 'Find the weakest point in the enemy and strike there decisively.',
    E: 'Rally your people — remind them what they are fighting for.',
    F: 'Get the vulnerable to safety first before doing anything else.',
    G: 'Document what is happening so the truth survives even if you don\'t.',
  },
  p3_q14: {
    A: 'Speak to them privately first — there may be a reason.',
    B: 'Inform the group immediately to protect everyone.',
    C: 'Confront them openly so the group can witness it.',
    D: 'Observe further and gather proof before acting.',
    E: 'Remove them from the group quietly to minimize damage.',
    F: 'Write or document the betrayal so there is a permanent record.',
    G: 'Use it as a lesson to strengthen the group\'s trust systems.',
  },
  p3_q15: {
    A: 'Speak out anyway — truth matters more than my safety.',
    B: 'Speak out but carefully — choose words that cannot easily be used against me.',
    C: 'Use art, fiction, or poetry to say what cannot be said directly.',
    D: 'Write and publish anonymously or from abroad.',
    E: 'Organize people so the voice becomes collective and harder to silence.',
    F: 'Work within the system quietly to change it from the inside.',
    G: 'Document everything and preserve the truth for future generations.',
  },
  p3_q16: {
    A: 'Yes, without hesitation — the cause is bigger than any one life.',
    B: 'Yes, but only after I have done everything else I can first.',
    C: 'I will find another way — my death should not be necessary.',
    D: 'I will pass the mission to someone more capable of finishing it.',
    E: 'I need to make sure my loved ones are safe before I can decide.',
    F: 'No — my continued life serves the cause better than my death.',
    G: 'I will document everything first so the mission survives even without me.',
  },
  p3_q17: {
    A: 'Confront them directly and immediately, regardless of my own risk.',
    B: 'Get the victim to safety first, then decide what to do next.',
    C: 'Report it to the proper authorities through official channels.',
    D: 'Gather solid evidence before exposing them publicly.',
    E: 'Write about it and make it public so no one can ignore it.',
    F: 'Organize the community so the response is collective.',
    G: 'Document it in detail so the truth is permanently on record.',
  },
  p3_q18: {
    A: 'The nation — everyone deserves to know the truth.',
    B: 'My companions — they trusted me and they come first.',
    C: 'Future generations — I will document it so history knows the truth.',
    D: 'The vulnerable — whoever is most at risk from this information.',
    E: 'Those in power who can act on it most effectively.',
    F: 'I reveal it through art or writing — truth wrapped in a form that protects me.',
    G: 'I share it only with those who will carry it forward after I am gone.',
  },
};

// ── Part metadata ─────────────────────────────────────────────────────────────

const PARTS = [
  { id: 'PART_1', label: 'Ugali', subtitle: 'Personality & Behavior', questionIds: allQuestions.filter(q => q.part === 'PART_1').map(q => q.id) },
  { id: 'PART_2', label: 'Katangian', subtitle: 'Traits of a Hero', questionIds: allQuestions.filter(q => q.part === 'PART_2').map(q => q.id) },
  { id: 'PART_3', label: 'Pagsubok', subtitle: 'Trials of a Hero', questionIds: allQuestions.filter(q => q.part === 'PART_3').map(q => q.id) },
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
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, tension: 120 }).start();
  const handlePressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 80 }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity activeOpacity={1} onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <Animated.View style={[styles.optionButton, { borderColor, backgroundColor: bgColor }]}>
          <View style={[styles.optionBadge, selected && styles.optionBadgeSelected]}>
            <Text style={[styles.optionBadgeText, selected && styles.optionBadgeTextSelected]}>
              {label}
            </Text>
          </View>
          <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{text}</Text>
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
      Animated.timing(fadeIn, { toValue: 1, duration: 400, delay: (globalIndex % 6) * 80, useNativeDriver: true }),
      Animated.spring(slideIn, { toValue: 0, delay: (globalIndex % 6) * 80, useNativeDriver: true }),
    ]).start();
  }, []);

  const isAnswered = !!answer;
  const optionTexts = OPTION_LABELS[question.id] ?? {};

  return (
    <Animated.View style={[styles.questionRow, { opacity: fadeIn, transform: [{ translateY: slideIn }] }]}>
      <View style={styles.sideColumn}>
        <View style={[styles.numberCircle, isAnswered && styles.numberCircleAnswered]}>
          {isAnswered
            ? <Icon name="check" size={14} color={COLORS.textContrast} />
            : <Text style={styles.numberText}>{globalIndex + 1}</Text>
          }
        </View>
        {!isLast && <View style={styles.dottedLine} />}
      </View>

      <View style={styles.cardColumn}>
        <View style={[styles.questionCard, isAnswered && styles.questionCardAnswered]}>
          <View style={styles.cardOrnamentRow}>
            <View style={styles.cardAccentBar} />
            <Text style={styles.cardBaybayin}>ᜊᜌᜈᜒ</Text>
          </View>

          <Text style={styles.questionLabel}>
            <Icon name="question-circle" size={10} color={COLORS.primaryLight} />{' '}
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
function PartHeader({ label, subtitle, partIndex }: { label: string; subtitle: string; partIndex: number }) {
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
        <View style={[styles.stepCircle, isActive && styles.stepCircleActive, isCompleted && styles.stepCircleCompleted]}>
          <Icon
            name={isCompleted ? 'check' : step.iconName}
            size={13}
            color={isActive || isCompleted ? COLORS.textContrast : COLORS.textSecondary}
          />
        </View>
        <Text style={[styles.stepLabel, isActive && styles.stepLabelActive]}>{step.label}</Text>
      </View>
      {!isLast && (
        <View style={[styles.stepConnector, isCompleted && styles.stepConnectorCompleted]} />
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
      Animated.timing(headerFade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(headerSlide, { toValue: 0, tension: 60, useNativeDriver: true }),
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
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} translucent={false} />
      <ImageBackground
        source={bayaniBackground}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        {/* ── Header ── */}
        <Animated.View style={[styles.header, { opacity: headerFade, transform: [{ translateY: headerSlide }] }]}>
          <TouchableOpacity style={styles.backCircle} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={16} color={COLORS.primary} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerBaybayin}>ᜉᜋᜈ</Text>
            <Text style={styles.headerTitle}>PAGSUBOK</Text>
            <Text style={styles.headerSub}>
              <Icon name="star" size={8} color={COLORS.primaryLight} /> Bayani Assessment{' '}
              <Icon name="star" size={8} color={COLORS.primaryLight} />
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, !allAnswered && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!allAnswered}
          >
            <Icon name="send" size={13} color={allAnswered ? COLORS.textContrast : COLORS.textSecondary} />
            <Text style={[styles.submitText, !allAnswered && styles.submitTextDisabled]}> Isumite</Text>
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
            <View style={[styles.progressBarFill, { width: `${progressPercentage}%` as any }]}>
              <View style={styles.progressSheen} />
            </View>
          </View>
          <View style={styles.tickRow}>
            {allQuestions.map((_, i) => (
              <View key={i} style={[styles.tick, i < answeredCount && styles.tickAnswered]} />
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
                <PartHeader label={part.label} subtitle={part.subtitle} partIndex={partIndex} />

                {partQuestions.map((question, qIndexInPart) => {
                  const globalIndex = allQuestions.findIndex(q => q.id === question.id);
                  const isLastInPart = qIndexInPart === partQuestions.length - 1;
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
              <TouchableOpacity style={styles.ctaBtn} onPress={handleSubmit} activeOpacity={0.85}>
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
  backgroundImageStyle: { opacity: 0.70, resizeMode: 'cover' },

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
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5, borderColor: COLORS.secondary,
    justifyContent: 'center', alignItems: 'center',
  },
  headerCenter: { alignItems: 'center' },
  headerBaybayin: {
    fontFamily: FONTS.baybayin, fontSize: 10,
    color: COLORS.primaryLight, letterSpacing: 3, marginBottom: -2,
  },
  headerTitle: {
    fontFamily: FONTS.kawitBold, fontSize: 18,
    letterSpacing: 5, color: COLORS.primary,
  },
  headerSub: {
    fontFamily: FONTS.PoppinsRegular, fontSize: 9,
    color: COLORS.textSecondary, letterSpacing: 1.5, marginTop: 2,
  },
  submitButton: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 22, backgroundColor: COLORS.primary,
    borderWidth: 1, borderColor: COLORS.primaryLight,
  },
  submitButtonDisabled: { backgroundColor: COLORS.surface, borderColor: COLORS.secondary },
  submitText: {
    color: COLORS.textContrast, fontFamily: FONTS.PoppinsBold,
    fontSize: 12, letterSpacing: 0.3,
  },
  submitTextDisabled: { color: COLORS.textSecondary },

  stepsContainer: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 22, paddingVertical: 14,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1, borderBottomColor: COLORS.secondary,
  },
  stepItem: { alignItems: 'center', gap: 5 },
  stepCircle: {
    width: 34, height: 34, borderRadius: 17,
    borderWidth: 1.5, borderColor: COLORS.secondary,
    backgroundColor: COLORS.background,
    justifyContent: 'center', alignItems: 'center',
  },
  stepCircleActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  stepCircleCompleted: { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primaryLight },
  stepLabel: {
    fontFamily: FONTS.PoppinsRegular, fontSize: 8,
    color: COLORS.textSecondary, letterSpacing: 0.5, textAlign: 'center',
  },
  stepLabelActive: { color: COLORS.primary, fontFamily: FONTS.PoppinsBold },
  stepConnector: {
    flex: 1, height: 1.5, backgroundColor: COLORS.secondary,
    marginHorizontal: 4, marginBottom: 18,
  },
  stepConnectorCompleted: { backgroundColor: COLORS.primary },

  progressContainer: {
    paddingHorizontal: 18, paddingTop: 14, paddingBottom: 10,
    backgroundColor: COLORS.background,
  },
  progressMeta: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 8,
  },
  progressLabelRow: { flexDirection: 'row', alignItems: 'center' },
  progressLabel: {
    fontFamily: FONTS.PoppinsBold, fontSize: 10,
    color: COLORS.textSecondary, letterSpacing: 1.5, textTransform: 'uppercase',
  },
  progressCount: { fontFamily: FONTS.kawitBold, fontSize: 15, color: COLORS.primary },
  progressTotal: { fontFamily: FONTS.PoppinsRegular, color: COLORS.textSecondary, fontSize: 13 },
  progressBarBg: {
    height: 8, borderRadius: 4,
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.secondary,
    overflow: 'hidden', marginBottom: 8,
  },
  progressBarFill: {
    height: '100%', borderRadius: 4,
    backgroundColor: COLORS.primary, overflow: 'hidden',
  },
  progressSheen: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: '40%', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4,
  },
  tickRow: { flexDirection: 'row', gap: 3 },
  tick: { flex: 1, height: 3, borderRadius: 2, backgroundColor: COLORS.secondary },
  tickAnswered: { backgroundColor: COLORS.primaryLight },

  ornamentDivider: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 18, paddingVertical: 8, gap: 10,
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
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5, borderColor: COLORS.secondary,
    justifyContent: 'center', alignItems: 'center', zIndex: 1,
  },
  numberCircleAnswered: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  numberText: { fontFamily: FONTS.kawitBold, fontSize: 15, color: COLORS.textSecondary },
  dottedLine: {
    width: 1.5, flex: 1, minHeight: 32,
    borderLeftWidth: 1.5, borderLeftColor: COLORS.secondary,
    borderStyle: 'dashed', marginTop: 6, marginBottom: -6,
  },

  cardColumn: { flex: 1, marginLeft: 12 },
  questionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20, padding: 18,
    borderWidth: 1.5, borderColor: COLORS.secondary,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 4,
  },
  questionCardAnswered: { borderColor: COLORS.primary, backgroundColor: '#fff8f5' },
  cardOrnamentRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 10,
  },
  cardAccentBar: {
    width: 32, height: 2.5, borderRadius: 2,
    backgroundColor: COLORS.primaryLight, opacity: 0.7,
  },
  cardBaybayin: {
    fontFamily: FONTS.baybayin, fontSize: 10,
    color: COLORS.secondary, letterSpacing: 2,
  },
  questionLabel: {
    fontFamily: FONTS.PoppinsBold, fontSize: 9,
    color: COLORS.primaryLight, letterSpacing: 1.5,
    textTransform: 'uppercase', marginBottom: 6,
  },
  questionText: {
    fontFamily: FONTS.kawitBold, fontSize: 15,
    color: COLORS.primary, marginBottom: 16, lineHeight: 23,
  },

  // ── Options ──
  optionButton: {
    borderWidth: 1.5, borderRadius: 14, padding: 12,
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  optionBadge: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: COLORS.background,
    borderWidth: 1.5, borderColor: COLORS.secondary,
    justifyContent: 'center', alignItems: 'center',
  },
  optionBadgeSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  optionBadgeText: { fontFamily: FONTS.PoppinsBold, fontSize: 12, color: COLORS.textSecondary },
  optionBadgeTextSelected: { color: COLORS.textContrast },
  optionText: {
    flex: 1, fontFamily: FONTS.PoppinsRegular,
    fontSize: 12, color: COLORS.textSecondary, lineHeight: 18,
  },
  optionTextSelected: { fontFamily: FONTS.PoppinsBold, color: COLORS.primary },
  checkWrap: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: '#fff0ea',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.secondary,
  },

  // ── Bottom CTA ──
  floatingCta: { marginTop: 24, marginHorizontal: 4 },
  ctaOrnamentRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, marginBottom: 14,
  },
  ctaOrnamentText: {
    fontFamily: FONTS.PoppinsBold, fontSize: 9,
    color: COLORS.primaryLight, letterSpacing: 2,
  },
  ctaBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 50, paddingVertical: 16,
    alignItems: 'center', flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.primaryLight,
  },
  ctaBtnText: {
    color: COLORS.textContrast, fontFamily: FONTS.PoppinsBold,
    fontSize: 15, letterSpacing: 0.5,
  },
});