// ─────────────────────────────────────────────────────────────────────────────
// useHeroScoring.ts
// React hook — the ONLY place screens need to touch for scoring.
// Bridges the pure engine functions to the Zustand authStore.
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback } from 'react';
import { useAuthStore } from '../store/authStore'; // ← adjust path as needed

import {
  HeroKey,
  HeroScoreMap,
  ScoredQuestion,
  AssessmentPart,
} from './heroScoring.types';

import {
  processAnswer,
  processAllAnswers,
  awardPoints,
  rankHeroes,
  getTopHeroes,
  getPrimaryHero,
  getScorePercentages,
  mergeScores,
  totalPoints,
  resolvePoints,
} from './heroScoring.engine';

// ─────────────────────────────────────────────────────────────────────────────

export function useHeroScoring() {
  const heroScores   = useAuthStore(s => s.heroScores) as HeroScoreMap;
  const setHeroScores = useAuthStore(s => s.setHeroScores);
  const resetPoints  = useAuthStore(s => s.resetPoints);

  // ── Single-answer recording ───────────────────────────────────────────────

  /**
   * Call this every time the user selects an answer option.
   * It recalculates the hero score map and pushes it to the store.
   *
   * @example — inside PersonalityTestScreen
   * const { recordAnswer } = useHeroScoring();
   * // on option press:
   * recordAnswer(question, selectedOptionId);
   */
  const recordAnswer = useCallback(
    (question: ScoredQuestion, optionId: string) => {
      const updated = processAnswer(heroScores, question, optionId);
      setHeroScores(updated);
    },
    [heroScores, setHeroScores],
  );

  /**
   * Call this when the user CHANGES a previous answer.
   * Pass the old optionId so its points are subtracted first,
   * then the new optionId's points are added.
   *
   * @example
   * replaceAnswer(question, 'A', 'C'); // was A, now C
   */
  const replaceAnswer = useCallback(
    (
      question: ScoredQuestion,
      previousOptionId: string,
      newOptionId: string,
    ) => {
      const pts = resolvePoints(question.part, question.pointOverride);

      // Subtract old answer's heroes
      const prevOption = question.options.find(o => o.id === previousOptionId);
      let working = { ...heroScores };
      if (prevOption) {
        for (const hero of prevOption.heroes) {
          working[hero] = Math.max(0, (working[hero] ?? 0) - pts);
        }
      }

      // Add new answer's heroes
      const newOption = question.options.find(o => o.id === newOptionId);
      if (newOption) {
        working = awardPoints(working, newOption.heroes, pts);
      }

      setHeroScores(working);
    },
    [heroScores, setHeroScores],
  );

  // ── Bulk recording (submit entire screen at once) ─────────────────────────

  /**
   * Process all answers for a screen in one shot.
   * Useful if you want to hold answers in local state and only
   * commit to the store when the user presses "Submit".
   *
   * @example — end of PersonalityTestScreen
   * submitScreen(part1Questions, localAnswers);
   * navigation.navigate('DemographicProfile');
   */
  const submitScreen = useCallback(
    (questions: ScoredQuestion[], answers: Record<string, string>) => {
      const updated = processAllAnswers(heroScores, questions, answers);
      setHeroScores(updated);
    },
    [heroScores, setHeroScores],
  );

  // ── Direct point award (for Demographic choices, bonuses, etc.) ──────────

  /**
   * Award a fixed number of points directly to a list of heroes.
   * Use this for demographic choices, special bonuses, or any
   * scenario that doesn't fit the question/option pattern.
   *
   * @example — inside DemographicProfileScreen
   * const { awardHeroPoints } = useHeroScoring();
   * awardHeroPoints(['jose_rizal', 'emilio_jacinto'], 1);
   */
  const awardHeroPoints = useCallback(
    (heroes: HeroKey[], points: number) => {
      const updated = awardPoints(heroScores, heroes, points);
      setHeroScores(updated);
    },
    [heroScores, setHeroScores],
  );

  // ── Reset ─────────────────────────────────────────────────────────────────

  /** Clear all scores and start fresh (e.g. retake assessment). */
  const resetScores = useCallback(() => {
    resetPoints();
  }, [resetPoints]);

  // ── Read-only derived values ──────────────────────────────────────────────

  /** All heroes sorted best-match first. */
  const ranked       = rankHeroes(heroScores);

  /** Top N heroes (default 3) — use on result screen. */
  const topHeroes    = (n = 3) => getTopHeroes(heroScores, n);

  /** The single best-match hero, or null if no answers yet. */
  const primaryHero  = getPrimaryHero(heroScores);

  /** Percentage of maxPossible each hero has scored (for progress bars). */
  const percentages  = (maxPossible: number) =>
    getScorePercentages(heroScores, maxPossible);

  /** Raw total points across all heroes. */
  const total        = totalPoints(heroScores);

  // ── Utility ───────────────────────────────────────────────────────────────

  /**
   * Merge an externally-built score map into the current store scores.
   * Handy if you computed scores offline (e.g. in a background job)
   * and want to add them to the running total.
   */
  const mergeExternalScores = useCallback(
    (external: HeroScoreMap) => {
      const merged = mergeScores(heroScores, external);
      setHeroScores(merged);
    },
    [heroScores, setHeroScores],
  );

  return {
    // State
    heroScores,
    total,
    ranked,
    primaryHero,

    // Actions
    recordAnswer,
    replaceAnswer,
    submitScreen,
    awardHeroPoints,
    resetScores,
    mergeExternalScores,

    // Lazy derived
    topHeroes,
    percentages,
  };
}