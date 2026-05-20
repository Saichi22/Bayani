import { api } from '../api/client';
import { HeroScoreMap, rankHeroes } from '../store/heroScoring';

// ─── PAYLOAD SHAPE ────────────────────────────────────────────────────────────

export interface HeroWinner {
  hero: string;
  score: number;
}

export interface AssessmentPayload {
  submittedAt: string;
  result: HeroWinner | HeroWinner[];

  /** Whether more than one hero tied for first place */
  isTie: boolean;

  /** Demographic selections */
  demographic: {
    ethnicity: string;
    region: string;
  };
}

function resolveWinners(heroScores: HeroScoreMap): HeroWinner[] {
  const ranked = rankHeroes(heroScores);
  if (ranked.length === 0) return [];

  const topScore = ranked[0].score;
  return ranked
    .filter(r => r.score === topScore)
    .map(r => ({ hero: r.hero, score: r.score }));
}

export function buildAssessmentPayload(
  heroScores: HeroScoreMap,
  ethnicity: string,
  region: string,
): AssessmentPayload {
  const winners = resolveWinners(heroScores);
  const isTie   = winners.length > 1;

  return {
    submittedAt: new Date().toISOString(),
    result:      isTie ? winners : (winners[0] ?? null),
    isTie,
    demographic: { ethnicity, region },
  };
}

export interface SendResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

export async function sendAssessmentPayload(
  heroScores: HeroScoreMap,
  ethnicity: string,
  region: string,
): Promise<SendResult> {
  const payload = buildAssessmentPayload(heroScores, ethnicity, region);

  if (__DEV__) {
    console.log('[assessmentPayload] Sending:', JSON.stringify(payload, null, 2));
  }

  try {
    const res = await api.post('/assessment/submit', payload);
    return { success: true, data: res.data };
  } catch (err: any) {
    const message: string =
      err?.response?.data?.message ??
      err?.message ??
      'Unknown error';

    if (__DEV__) {
      console.error('[assessmentPayload] POST failed:', {
        status:  err?.response?.status,
        message,
        payload,
      });
    }

    return { success: false, error: message };
  }
}