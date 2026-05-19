// ─────────────────────────────────────────────────────────────────────────────
// demographicScoring.ts
// Maps a user's ethnicity and region selections to hero point bonuses.
//
// Rules:
//   - Ethnicity match  → +1 point per matched hero  (DEMO part weight)
//   - Region match     → +1 point per matched hero  (DEMO part weight)
//   - Both match       → +2 points total (bonuses stack naturally)
//
// Store-agnostic — call awardHeroPoints() from useHeroScoring in the screen.
// ─────────────────────────────────────────────────────────────────────────────

import { HeroKey, HeroScoreMap, awardPoints } from './heroScoring';

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

/** Points awarded per demographic match (mirrors POINTS_PER_PART['DEMO'] = 1). */
export const DEMO_POINTS = 1;

// ─── ETHNICITY MAP ────────────────────────────────────────────────────────────
// Each picker value → heroes who share that ethnic background.
// Source: hero ethnicity data from the hero list document.

export const ETHNICITY_HERO_MAP: Record<string, HeroKey[]> = {
  Tagalog: [
    'andres_bonifacio',     // Tondo, Manila — Filipino/Tagalog
    'emilio_jacinto',       // Manila — Filipino/Tagalog
    'apolinario_mabini',    // Batangas — Filipino/Tagalog
    'gregoria_de_jesus',    // Caloocan — Filipino/Tagalog
    'melchora_aquino',      // Quezon City — Filipino/Tagalog
    'jose_palma',           // Tondo, Manila — Filipino/Tagalog
    'lakandula',            // Tondo, Manila — Filipino/Tagalog
    'rajah_sulayman',       // Manila — Filipino/Tagalog
    'galicano_apacible',    // Batangas — Filipino/Tagalog
    'felipe_agoncillo',     // Batangas — Filipino/Tagalog
    'trinidad_tecson',      // Bulacan — Filipino/Tagalog
    'francisco_baltazar',   // Bulacan — Filipino/Tagalog
    'marcelo_del_pilar',    // Bulacan — Filipino/Tagalog
    'mariano_ponce',        // Bulacan — Filipino/Tagalog
    'panday_pira',          // Pampanga — Filipino (Tagalog/Kapampangan border)
    'agueda_esteban',       // Caloocan — Filipino/Tagalog
    'rafael_palma',         // Manila — Filipino/Tagalog
  ],

  Ilocano: [
    'juan_luna',            // Badoc, Ilocos Norte — Spanish-Filipino/Ilocano
    'artemio_ricarte',      // Batac, Ilocos Norte — Filipino/Ilocano
    'jose_burgos',          // Vigan, Ilocos Sur — Spanish-Filipino/Ilocano
    'leona_florentino',     // Vigan, Ilocos Sur — Spanish-Filipino/Ilocano
    'isabelo_de_los_reyes', // Vigan, Ilocos Sur — Filipino/Ilocano
    'diego_silang',         // Aringay, La Union — Filipino/Ilocano
    'gabriela_silang',      // Santa, Ilocos Sur — Filipino/Ilocano
    'epifanio_de_los_santos', // Malabon, Rizal — Spanish-Filipino (Ilocano heritage)
  ],

  Visayan: [
    'lapu_lapu',            // Mactan, Cebu — Filipino/Visayan
    'graciano_lopez_jaena', // Iloilo — Spanish-Filipino/Visayan (Hiligaynon)
    'teresa_magbanua',      // Iloilo — Filipino/Visayan
    'francisco_dagohoy',    // Bohol — Filipino/Visayan
  ],

  Kapampangan: [
    'panday_pira',          // Pampanga — Filipino/Kapampangan
    'gen_antonio_luna',     // Binondo, Manila (Kapampangan roots)
  ],

  Bicolano: [
    'jose_ma_panganiban',   // Mambulao, Camarines Norte — Filipino/Bicolano
  ],

  // Igorot: no current heroes with Cordillera ethnicity in the dataset
  Igorot: [],

  // Moro: Rajah Sulayman had Islamic/pre-colonial Manila ties
  Moro: [
    'rajah_sulayman',
    'lakandula',
  ],

  // "Other" catches all mixed or unlisted ethnicity — no hero bonus
  Other: [],
};

// ─── REGION MAP ───────────────────────────────────────────────────────────────
// Each region picker value → heroes who were born in or are closely
// associated with that region.

export const REGION_HERO_MAP: Record<string, HeroKey[]> = {
  'Metro Manila': [
    'andres_bonifacio',     // Tondo, Manila
    'emilio_jacinto',       // Manila
    'jose_palma',           // Tondo, Manila
    'lakandula',            // Tondo, Manila
    'rajah_sulayman',       // Manila
    'gregoria_de_jesus',    // Caloocan
    'melchora_aquino',      // Quezon City
    'agueda_esteban',       // Caloocan
    'marina_dizon',         // Manila
    'rafael_palma',         // Manila
    'gen_antonio_luna',     // Binondo, Manila
    'graciano_lopez_jaena', // (worked/published in Manila)
    'epifanio_de_los_santos', // Malabon
    'pedro_paterno',        // Santa Cruz, Manila
    'jacinto_zamora',       // Manila
  ],

  'Ilocos Region': [
    'juan_luna',            // Badoc, Ilocos Norte
    'artemio_ricarte',      // Batac, Ilocos Norte
    'jose_burgos',          // Vigan, Ilocos Sur
    'leona_florentino',     // Vigan, Ilocos Sur
    'isabelo_de_los_reyes', // Vigan, Ilocos Sur
    'diego_silang',         // Aringay, La Union
    'gabriela_silang',      // Santa, Ilocos Sur
  ],

  'Central Luzon': [
    'panday_pira',          // Pampanga
    'mariano_ponce',        // Bulacan
    'trinidad_tecson',      // Bulacan
    'francisco_baltazar',   // Bulacan
    'marcelo_del_pilar',    // Bulacan
    'gen_gregorio_del_pilar', // Bulacan
  ],

  CALABARZON: [
    'jose_rizal',           // Calamba, Laguna
    'apolinario_mabini',    // Batangas
    'galicano_apacible',    // Batangas City
    'felipe_agoncillo',     // Batangas
    'marcela_agoncillo',    // Taal, Batangas
    'leonor_rivera',        // Camiling, Tarlac (nearest region for picker)
    'gen_emilio_aguinaldo', // Cavite
    'mariano_gomez',        // Cavite
    'julian_felipe',        // Cavite
  ],

  'Bicol Region': [
    'jose_ma_panganiban',   // Mambulao, Camarines Norte
  ],

  'Western Visayas': [
    'graciano_lopez_jaena', // Iloilo
    'teresa_magbanua',      // Iloilo
  ],

  'Central Visayas': [
    'lapu_lapu',            // Mactan, Cebu
    'francisco_dagohoy',    // Bohol
  ],

  BARMM: [
    'rajah_sulayman',       // Pre-colonial Manila/BARMM ties
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// PURE SCORING FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Award ethnicity-match points into the current score map.
 * Returns a new score map — does NOT mutate the input.
 *
 * @param current  Existing hero score map from the store.
 * @param ethnicity The ethnicity string selected by the user.
 */
export function applyEthnicityBonus(
  current: HeroScoreMap,
  ethnicity: string,
): HeroScoreMap {
  const heroes = ETHNICITY_HERO_MAP[ethnicity] ?? [];
  if (heroes.length === 0) return { ...current };
  return awardPoints(current, heroes, DEMO_POINTS);
}

/**
 * Award region-match points into the current score map.
 * Returns a new score map — does NOT mutate the input.
 *
 * @param current  Existing hero score map from the store.
 * @param region   The region string selected by the user.
 */
export function applyRegionBonus(
  current: HeroScoreMap,
  region: string,
): HeroScoreMap {
  const heroes = REGION_HERO_MAP[region] ?? [];
  if (heroes.length === 0) return { ...current };
  return awardPoints(current, heroes, DEMO_POINTS);
}

/**
 * Apply BOTH ethnicity and region bonuses in one call.
 * Use this in DemographicProfileScreen's handleSave.
 *
 * @example
 * const updated = applyDemographicBonuses(heroScores, 'Tagalog', 'Metro Manila');
 * setHeroScores(updated);
 */
export function applyDemographicBonuses(
  current: HeroScoreMap,
  ethnicity: string,
  region: string,
): HeroScoreMap {
  let scores = applyEthnicityBonus(current, ethnicity);
  scores = applyRegionBonus(scores, region);
  return scores;
}

// ─────────────────────────────────────────────────────────────────────────────
// DEBUG HELPER (dev-only)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns which heroes would receive bonuses for a given selection.
 * Useful for verifying mappings in development.
 *
 * @example
 * previewDemographicBonuses('Ilocano', 'Ilocos Region');
 * // → { ethnicity: ['juan_luna', ...], region: ['juan_luna', ...], combined: [...] }
 */
export function previewDemographicBonuses(
  ethnicity: string,
  region: string,
): {
  ethnicity: HeroKey[];
  region: HeroKey[];
  combined: HeroKey[];
} {
  const ethHeroes = ETHNICITY_HERO_MAP[ethnicity] ?? [];
  const regHeroes = REGION_HERO_MAP[region] ?? [];
  const combined = [...new Set([...ethHeroes, ...regHeroes])];
  return { ethnicity: ethHeroes, region: regHeroes, combined };
}