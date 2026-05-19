// ─────────────────────────────────────────────────────────────────────────────
// heroScoring.ts
// Centralized hero scoring system for Bayani.
// Contains:
// - Types
// - Constants
// - Pure scoring logic
// Store-agnostic and reusable anywhere.
// ─────────────────────────────────────────────────────────────────────────────

// ─── HERO KEYS ───────────────────────────────────────────────────────────────

/**
 * Every answer option maps to one or more heroes.
 * Add new heroes here as the app grows.
 */
export type HeroKey =
  | 'jose_rizal'
  | 'andres_bonifacio'
  | 'gen_antonio_luna'
  | 'apolinario_mabini'
  | 'marcelo_del_pilar'
  | 'graciano_lopez_jaena'
  | 'emilio_jacinto'
  | 'gen_gregorio_del_pilar'
  | 'gen_emilio_aguinaldo'
  | 'gabriela_silang'
  | 'diego_silang'
  | 'melchora_aquino'
  | 'gregoria_de_jesus'
  | 'lapu_lapu'
  | 'juan_luna'
  | 'epifanio_de_los_santos'
  | 'mariano_ponce'
  | 'felipe_agoncillo'
  | 'rafael_palma'
  | 'panday_pira'
  | 'leona_florentino'
  | 'francisco_baltazar'
  | 'trinidad_tecson'
  | 'artemio_ricarte'
  | 'isabelo_de_los_reyes'
  | 'jose_burgos'
  | 'mariano_gomez'
  | 'jacinto_zamora'
  | 'rajah_sulayman'
  | 'lakandula'
  | 'leonor_rivera'
  | 'marcela_agoncillo'
  | 'galicano_apacible'
  | 'jose_ma_panganiban'
  | 'pedro_paterno'
  | 'marina_dizon'
  | 'agueda_esteban'
  | 'francisco_dagohoy'
  | 'teresa_magbanua'
  | 'fernando_guerrero'
  | 'jose_palma'
  | 'julian_felipe';

// ─── SCORE MAP ──────────────────────────────────────────────────────────────

/**
 * Stores hero → score pairs.
 *
 * Example:
 * {
 *   jose_rizal: 5,
 *   andres_bonifacio: 3,
 * }
 */
export type HeroScoreMap = Partial<Record<HeroKey, number>>;

// ─── ASSESSMENT PARTS ───────────────────────────────────────────────────────

export type AssessmentPart =
  | 'PART_1'
  | 'PART_2'
  | 'PART_3'
  | 'DEMO';

/**
 * Default points awarded per question part.
 */
export const POINTS_PER_PART: Record<AssessmentPart, number> = {
  PART_1: 1,
  PART_2: 1,
  PART_3: 1,
  DEMO: 1,
};

// ─── QUESTION TYPES ─────────────────────────────────────────────────────────

/**
 * One answer option in a question.
 */
export interface AnswerOption {
  id: string;
  label: string;
  heroes: HeroKey[];
}

/**
 * One scored question.
 */
export interface ScoredQuestion {
  id: string;
  part: AssessmentPart;
  question: string;
  options: AnswerOption[];

  /**
   * Optional custom point value.
   * Overrides POINTS_PER_PART if present.
   */
  pointOverride?: number;
}

// ─── RESULT TYPES ───────────────────────────────────────────────────────────

/**
 * Ranked hero result.
 */
export interface HeroResult {
  hero: HeroKey;
  score: number;
  rank: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// CORE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Award points to multiple heroes.
 * PURE function — does not mutate original object.
 */
export function awardPoints(
  current: HeroScoreMap,
  heroes: HeroKey[],
  points: number,
): HeroScoreMap {
  const next = { ...current };

  for (const hero of heroes) {
    next[hero] = (next[hero] ?? 0) + points;
  }

  return next;
}

/**
 * Resolve how many points a question is worth.
 */
export function resolvePoints(
  part: AssessmentPart,
  pointOverride?: number,
): number {
  return pointOverride ?? POINTS_PER_PART[part];
}

/**
 * Process a single answer selection.
 */
export function processAnswer(
  current: HeroScoreMap,
  question: ScoredQuestion,
  optionId: string,
): HeroScoreMap {
  const option = question.options.find(o => o.id === optionId);

  if (!option) {
    return current;
  }

  const pts = resolvePoints(question.part, question.pointOverride);

  return awardPoints(current, option.heroes, pts);
}

/**
 * Process all answers from a screen.
 */
export function processAllAnswers(
  current: HeroScoreMap,
  questions: ScoredQuestion[],
  answers: Record<string, string>,
): HeroScoreMap {
  let scores = { ...current };

  for (const question of questions) {
    const selectedId = answers[question.id];

    if (selectedId) {
      scores = processAnswer(scores, question, selectedId);
    }
  }

  return scores;
}

// ─────────────────────────────────────────────────────────────────────────────
// RESULTS / RANKING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Rank heroes highest → lowest.
 */
export function rankHeroes(scores: HeroScoreMap): HeroResult[] {
  return Object.entries(scores)
    .filter(([, score]) => score !== undefined && score > 0)
    .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0))
    .map(([hero, score], index) => ({
      hero: hero as HeroKey,
      score: score ?? 0,
      rank: index,
    }));
}

/**
 * Get top N heroes.
 */
export function getTopHeroes(
  scores: HeroScoreMap,
  n = 3,
): HeroResult[] {
  return rankHeroes(scores).slice(0, n);
}

/**
 * Get the best-matching hero.
 */
export function getPrimaryHero(
  scores: HeroScoreMap,
): HeroResult | null {
  const ranked = rankHeroes(scores);

  return ranked[0] ?? null;
}

/**
 * Convert scores into percentages.
 */
export function getScorePercentages(
  scores: HeroScoreMap,
  maxPossible: number,
): Partial<Record<HeroKey, number>> {
  if (maxPossible <= 0) {
    return {};
  }

  const result: Partial<Record<HeroKey, number>> = {};

  for (const [hero, score] of Object.entries(scores)) {
    result[hero as HeroKey] = Math.round(
      ((score ?? 0) / maxPossible) * 100,
    );
  }

  return result;
}

/**
 * Merge two score maps together.
 */
export function mergeScores(
  a: HeroScoreMap,
  b: HeroScoreMap,
): HeroScoreMap {
  const result = { ...a };

  for (const [hero, score] of Object.entries(b)) {
    const key = hero as HeroKey;

    result[key] = (result[key] ?? 0) + (score ?? 0);
  }

  return result;
}

/**
 * Compute total points across all heroes.
 */
export function totalPoints(scores: HeroScoreMap): number {
  return Object.values(scores).reduce<number>(
    (sum, value) => sum + (value ?? 0),
    0,
  );
}