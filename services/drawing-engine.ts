/**
 * Drawing Challenge Engine — instant-load, no-repeat, infinite-depth creative system.
 *
 * Flow:
 * 1. Serve challenges instantly from the local DRAWING_PROMPTS bank
 * 2. Track completed prompt IDs to avoid repeats
 * 3. Tier progression: Rookie → Brave → Legend
 * 4. Category filtering for focused sessions
 * 5. Studio missions with goal tracking
 */

import {
  DRAWING_PROMPTS,
  STUDIO_MISSIONS,
  type DrawingPrompt,
  type StudioMission,
  type DrawingDifficulty,
  type DrawingCategory,
} from '../data/drawing-challenges';

// Fisher-Yates shuffle
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── COMPLETED TRACKING ───

function getCompletedPrompts(): Set<string> {
  try {
    const raw = localStorage.getItem('tiwaton_drawing_completed');
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}

export function markPromptCompleted(promptId: string): void {
  try {
    const completed = getCompletedPrompts();
    completed.add(promptId);
    localStorage.setItem('tiwaton_drawing_completed', JSON.stringify([...completed]));
  } catch { /* noop */ }
}

export function resetCompletedPrompts(): void {
  try { localStorage.removeItem('tiwaton_drawing_completed'); } catch { /* noop */ }
}

function getCompletedMissions(): Set<string> {
  try {
    const raw = localStorage.getItem('tiwaton_studio_completed');
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}

export function markMissionCompleted(missionId: string): void {
  try {
    const completed = getCompletedMissions();
    completed.add(missionId);
    localStorage.setItem('tiwaton_studio_completed', JSON.stringify([...completed]));
  } catch { /* noop */ }
}

export function resetCompletedMissions(): void {
  try { localStorage.removeItem('tiwaton_studio_completed'); } catch { /* noop */ }
}

// ─── TIER PROGRESS ───

export type DrawingTier = 1 | 2 | 3;

export const DRAWING_TIERS = [
  { tier: 1 as DrawingTier, name: { en: 'Rookie Canvas', de: 'Anfänger-Leinwand' }, icon: '🎨', difficulty: 'Rookie' as DrawingDifficulty },
  { tier: 2 as DrawingTier, name: { en: 'Brave Brush', de: 'Mutiger Pinsel' }, icon: '🖌️', difficulty: 'Brave' as DrawingDifficulty },
  { tier: 3 as DrawingTier, name: { en: 'Legend Studio', de: 'Legenden-Studio' }, icon: '👑', difficulty: 'Legend' as DrawingDifficulty },
];

export function getDrawingTierProgress(): number {
  try {
    return Number(localStorage.getItem('tiwaton_drawing_tier') || '0');
  } catch { return 0; }
}

export function completeDrawingTier(tier: DrawingTier): void {
  try {
    const current = getDrawingTierProgress();
    if (tier > current) {
      localStorage.setItem('tiwaton_drawing_tier', String(tier));
    }
  } catch { /* noop */ }
}

// ─── CHALLENGE RETRIEVAL ───

/**
 * Get drawing prompts, filtered and shuffled, no repeats.
 */
export function getDrawingPrompts(options?: {
  category?: DrawingCategory;
  difficulty?: DrawingDifficulty;
  count?: number;
}): DrawingPrompt[] {
  const { category, difficulty, count = 10 } = options || {};
  const completed = getCompletedPrompts();

  let pool = [...DRAWING_PROMPTS];

  // Filter by category
  if (category) {
    pool = pool.filter(p => p.category === category);
  }

  // Filter by difficulty
  if (difficulty) {
    pool = pool.filter(p => p.difficulty === difficulty);
  }

  // Remove completed (unless pool too small)
  const uncompleted = pool.filter(p => !completed.has(p.id));
  if (uncompleted.length >= Math.min(count, 3)) {
    pool = uncompleted;
  }

  return shuffle(pool).slice(0, count);
}

/**
 * Get a single random prompt (for the "Challenge Me!" button).
 */
export function getRandomPrompt(options?: {
  category?: DrawingCategory;
  difficulty?: DrawingDifficulty;
}): DrawingPrompt {
  const prompts = getDrawingPrompts({ ...options, count: 1 });
  return prompts[0] || DRAWING_PROMPTS[Math.floor(Math.random() * DRAWING_PROMPTS.length)];
}

/**
 * Get studio missions filtered by difficulty, no repeats.
 */
export function getStudioMissions(difficulty?: DrawingDifficulty): StudioMission[] {
  const completed = getCompletedMissions();

  let pool = [...STUDIO_MISSIONS];

  if (difficulty) {
    pool = pool.filter(m => m.difficulty === difficulty);
  }

  // Remove completed
  const uncompleted = pool.filter(m => !completed.has(m.id));
  if (uncompleted.length >= 3) {
    pool = uncompleted;
  }

  return shuffle(pool);
}

/**
 * Get total stats for display.
 */
export function getDrawingStats(): {
  totalPrompts: number;
  completedPrompts: number;
  totalMissions: number;
  completedMissions: number;
} {
  const completedP = getCompletedPrompts();
  const completedM = getCompletedMissions();
  return {
    totalPrompts: DRAWING_PROMPTS.length,
    completedPrompts: completedP.size,
    totalMissions: STUDIO_MISSIONS.length,
    completedMissions: completedM.size,
  };
}
