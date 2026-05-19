// ─────────────────────────────────────────────────────────────────────────────
// heroScoring.types.ts
// Central type definitions for the Bayani hero-scoring system.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Every answer option in any question maps to one of these keys.
 * Add new heroes here as the question bank grows.
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
  | 'isabel_de_los_reyes'
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

/**
 * A map of HeroKey → accumulated score for a single user session.
 * Keys are only present once at least 1 point has been awarded.
 */
export type HeroScoreMap = Partial<Record<HeroKey, number>>;

// ─── Assessment sections ──────────────────────────────────────────────────────

/**
 * Which assessment screen / part the answer belongs to.
 *
 *  PART_1  →  Ugali   (Personality Test screen)   — 1 pt per hero per answer
 *  PART_2  →  Katangian (still Personality Test)  — 2 pts per hero per answer
 *  PART_3  →  Pagsubok  (still Personality Test)  — 3 pts per hero per answer
 *  DEMO    →  Demographic Profile screen           — configurable bonus pts
 */
export type AssessmentPart = 'PART_1' | 'PART_2' | 'PART_3' | 'DEMO';

/** Points awarded per hero per answer, keyed by part. */
export const POINTS_PER_PART: Record<AssessmentPart, number> = {
  PART_1: 1,
  PART_2: 2,
  PART_3: 3,
  DEMO:   1, // override per-question if needed
};

// ─── Answer option shape ──────────────────────────────────────────────────────

/**
 * One answer choice inside a question.
 *
 * @example
 * {
 *   id: 'A',
 *   label: 'I dive in immediately — action first, adjustments later.',
 *   heroes: ['andres_bonifacio', 'gen_antonio_luna', 'lapu_lapu'],
 * }
 */
export interface AnswerOption {
  /** Single letter or short identifier shown to the user (A–G, etc.) */
  id: string;
  /** The text displayed on screen for this choice */
  label: string;
  /** Heroes that receive points when this option is chosen */
  heroes: HeroKey[];
}

// ─── Question shape ───────────────────────────────────────────────────────────

/**
 * A single question in any part of the assessment.
 */
export interface ScoredQuestion {
  /** Unique question identifier, e.g. "P1_Q1" */
  id: string;
  /** Which assessment part this belongs to — controls point value */
  part: AssessmentPart;
  /** Question text displayed on screen */
  question: string;
  /** All selectable answer options */
  options: AnswerOption[];
  /**
   * Override the default points-per-part value for just this question.
   * Leave undefined to use POINTS_PER_PART[part].
   */
  pointOverride?: number;
}

// ─── Result shape ─────────────────────────────────────────────────────────────

/**
 * Returned by `rankHeroes()` — a sorted list of heroes with their scores.
 */
export interface HeroResult {
  hero: HeroKey;
  score: number;
  /** 0-based rank (0 = top match) */
  rank: number;
}