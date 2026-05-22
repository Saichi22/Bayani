import { useCallback } from 'react';
import { useAuthStore } from '../store/authStore';

import {
  HeroKey,
  HeroScoreMap,
  ScoredQuestion,
  computeHeroMaxScores,
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
} from '../store/heroScoring';

// ─────────────────────────────────────────────────────────────────────────────

export function useHeroScoring() {
  const heroScores    = useAuthStore(s => s.heroScores) as HeroScoreMap;
  const setHeroScores = useAuthStore(s => s.setHeroScores);
  const resetPoints   = useAuthStore(s => s.resetPoints);

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
      const current = useAuthStore.getState().heroScores as HeroScoreMap;
      const updated = processAnswer(current, question, optionId);
      setHeroScores(updated);
    },
    [setHeroScores],
  );

  /**
   * Call this when the user CHANGES a previous answer.
   * Pass the old optionId so its points are subtracted first,
   * then the new optionId's points are added.
   *
   * FIX: previously subtracted points manually without respecting
   * `pointOverride`, causing incorrect scores when overrides are set.
   * Now uses `resolvePoints` for both the subtraction and the award.
   *
   * @example
   * replaceAnswer(question, 'A', 'C'); // was A, now C
   */
  const replaceAnswer = useCallback(
    (question: ScoredQuestion, previousOptionId: string, newOptionId: string) => {
      const current = useAuthStore.getState().heroScores as HeroScoreMap;
      const pts     = resolvePoints(question.part, question.pointOverride);

      // Subtract previous option's points.
      const prevOption = question.options.find(o => o.id === previousOptionId);
      let working = { ...current };
      if (prevOption) {
        for (const hero of prevOption.heroes) {
          working[hero] = Math.max(0, (working[hero] ?? 0) - pts);
        }
      }

      // Award new option's points via the shared helper.
      const newOption = question.options.find(o => o.id === newOptionId);
      if (newOption) {
        working = awardPoints(working, newOption.heroes, pts);
      }

      setHeroScores(working);
    },
    [setHeroScores],
  );

  /**
   * Submit all answers from a single screen at once.
   * Prefer this over calling recordAnswer in a loop.
   */
  const submitScreen = useCallback(
    (questions: ScoredQuestion[], answers: Record<string, string>) => {
      const current = useAuthStore.getState().heroScores as HeroScoreMap;
      const updated = processAllAnswers(current, questions, answers);
      setHeroScores(updated);
    },
    [setHeroScores],
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
      const current = useAuthStore.getState().heroScores as HeroScoreMap;
      const updated = awardPoints(current, heroes, points);
      setHeroScores(updated);
    },
    [setHeroScores],
  );

  /**
   * Compute the per-hero maximum possible scores for a given question set.
   * Pass `allQuestions` from your data file to get the full ceiling map.
   */
  const heroMaxScores = useCallback(
    (questions: ScoredQuestion[]) => computeHeroMaxScores(questions),
    [],
  );

  // ── Reset ─────────────────────────────────────────────────────────────────

  /** Clear all scores and start fresh (e.g. retake assessment). */
  const resetScores = useCallback(() => {
    resetPoints();
  }, [resetPoints]);

  // ── Read-only derived values ──────────────────────────────────────────────

  /** All heroes sorted best-match first. */
  const ranked = rankHeroes(heroScores);

  /** Top N heroes (default 3) — use on result screen. */
  const topHeroes = (n = 3) => getTopHeroes(heroScores, n);

  /** The single best-match hero, or null if no answers yet. */
  const primaryHero = getPrimaryHero(heroScores);

  /** Percentage of maxPossible each hero has scored (for progress bars). */
  const percentages = (maxPossible: number) =>
    getScorePercentages(heroScores, maxPossible);

  /** Raw total points across all heroes. */
  const total = totalPoints(heroScores);

  // ── Utility ───────────────────────────────────────────────────────────────

  /**
   * Merge an externally-built score map into the current store scores.
   * Handy if you computed scores offline (e.g. in a background job)
   * and want to add them to the running total.
   */
  const mergeExternalScores = useCallback(
    (external: HeroScoreMap) => {
      const current = useAuthStore.getState().heroScores as HeroScoreMap;
      const merged  = mergeScores(current, external);
      setHeroScores(merged);
    },
    [setHeroScores],
  );

  return {
    // State
    heroScores,
    total,
    ranked,
    primaryHero,

    // Raw store setter — used by DemographicProfileScreen to commit the
    // demographic bonus atomically without going through processAnswer.
    setHeroScores,
    heroMaxScores,

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