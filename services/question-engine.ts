/**
 * Question Engine — instant-load, no-repeat, infinite-depth quiz system.
 *
 * Flow:
 * 1. Serve questions instantly from the local BIBLE_BANK
 * 2. Background-fetch AI questions and cache to localStorage
 * 3. On next play, merge local + cached AI questions (deduped)
 * 4. Track answered question hashes to avoid repeats
 * 5. Generate transformed questions (reverse, sequence, verse-fill)
 */

import type { BibleQuestion, WorldId, Difficulty } from '../data/bible-questions';

export interface PlayableQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  funnyComment?: string;
  hash: string;
  difficulty: Difficulty;
}

// Simple hash for dedup
function qHash(text: string): string {
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = ((h << 5) - h + text.charCodeAt(i)) | 0;
  }
  return 'q' + Math.abs(h).toString(36);
}

// Fisher-Yates shuffle
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Convert a BibleQuestion to a PlayableQuestion with shuffled options */
function toPlayable(bq: BibleQuestion, locale: 'en' | 'de'): PlayableQuestion {
  const opts = [...bq.o[locale]];
  const correctAnswer = opts[bq.ci];

  // Shuffle options
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }

  return {
    question: bq.q[locale],
    options: opts,
    correctIndex: opts.indexOf(correctAnswer),
    explanation: bq.ex[locale],
    funnyComment: bq.fc?.[locale],
    hash: qHash(bq.q.en), // always hash on English for consistency
    difficulty: bq.d,
  };
}

/** Get set of previously answered question hashes for a world */
function getAnsweredHashes(worldId: string): Set<string> {
  try {
    const raw = localStorage.getItem(`tiwaton_answered_${worldId}`);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}

/** Record a question hash as answered */
export function markAnswered(worldId: string, hash: string): void {
  try {
    const hashes = getAnsweredHashes(worldId);
    hashes.add(hash);
    localStorage.setItem(`tiwaton_answered_${worldId}`, JSON.stringify([...hashes]));
  } catch { /* noop */ }
}

/** Reset answered history for a world (useful for "play again" after exhaustion) */
export function resetAnswered(worldId: string): void {
  try { localStorage.removeItem(`tiwaton_answered_${worldId}`); } catch { /* noop */ }
}

/** Get cached AI questions from localStorage */
function getCachedAIQuestions(worldId: string): BibleQuestion[] {
  try {
    const raw = localStorage.getItem(`tiwaton_aicache_${worldId}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

/** Cache AI questions to localStorage */
export function cacheAIQuestions(worldId: string, questions: BibleQuestion[]): void {
  try {
    const existing = getCachedAIQuestions(worldId);
    // Dedupe by English question text hash
    const existingHashes = new Set(existing.map(q => qHash(q.q.en)));
    const newOnes = questions.filter(q => !existingHashes.has(qHash(q.q.en)));
    const merged = [...existing, ...newOnes].slice(-50); // keep last 50
    localStorage.setItem(`tiwaton_aicache_${worldId}`, JSON.stringify(merged));
  } catch { /* noop */ }
}

export type ScrollTier = 1 | 2 | 3 | 4 | 5;

export const SCROLL_TIERS = [
  { tier: 1 as ScrollTier, name: { en: 'Apprentice Scroll', de: 'Lehrlings-Schriftrolle' }, icon: '📜', questionCount: 5, passPct: 0.6, difficulties: [1] as Difficulty[], timeLimit: 0 },
  { tier: 2 as ScrollTier, name: { en: 'Scholar Scroll', de: 'Gelehrten-Schriftrolle' }, icon: '📖', questionCount: 7, passPct: 0.7, difficulties: [1, 2] as Difficulty[], timeLimit: 0 },
  { tier: 3 as ScrollTier, name: { en: 'Sage Scroll', de: 'Weisen-Schriftrolle' }, icon: '🧙', questionCount: 7, passPct: 0.75, difficulties: [2] as Difficulty[], timeLimit: 0 },
  { tier: 4 as ScrollTier, name: { en: 'Prophet Scroll', de: 'Propheten-Schriftrolle' }, icon: '⚡', questionCount: 10, passPct: 0.8, difficulties: [2, 3] as Difficulty[], timeLimit: 0 },
  { tier: 5 as ScrollTier, name: { en: 'Eternal Scroll', de: 'Ewige Schriftrolle' }, icon: '♾️', questionCount: 999, passPct: 0, difficulties: [1, 2, 3] as Difficulty[], timeLimit: 15 },
];

/* ─── Question Transformers ─── */
/* Generate new questions algorithmically from existing data */

/** "Which is NOT..." transformer — flip a question to test exclusion */
function transformReverse(bq: BibleQuestion, locale: 'en' | 'de'): PlayableQuestion | null {
  // Only works if the question doesn't already contain "NOT"
  const qText = bq.q[locale];
  if (qText.includes('NOT') || qText.includes('NICHT') || qText.includes('not ')) return null;

  const correctAnswer = bq.o[locale][bq.ci];
  const wrongAnswers = bq.o[locale].filter((_, i) => i !== bq.ci);
  if (wrongAnswers.length < 3) return null;

  // Pick one wrong answer as the "correct" answer to the NOT question
  const notCorrect = wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
  const newOptions = shuffle([correctAnswer, ...wrongAnswers.filter(w => w !== notCorrect), notCorrect].slice(0, 4));

  const prefix = locale === 'de' ? 'Was ist NICHT die Antwort: ' : 'Which is NOT the answer: ';
  return {
    question: prefix + qText,
    options: newOptions,
    correctIndex: newOptions.indexOf(notCorrect),
    explanation: locale === 'de'
      ? `Die richtige Antwort wäre "${correctAnswer}" gewesen. ${bq.ex[locale]}`
      : `The correct answer would have been "${correctAnswer}". ${bq.ex[locale]}`,
    hash: qHash('NOT_' + bq.q.en),
    difficulty: Math.min(3, bq.d + 1) as Difficulty,
  };
}

/** Emoji puzzle transformer — show emojis as clues */
const EMOJI_CLUES: Record<string, { emojis: string; answer: { en: string; de: string } }[]> = {
  creation: [
    { emojis: '🌍✨7️⃣📅', answer: { en: 'Creation', de: 'Schöpfung' } },
    { emojis: '🐍🍎👫🌳', answer: { en: 'The Fall', de: 'Der Sündenfall' } },
    { emojis: '🚢🌧️🐘🐘', answer: { en: 'Noah\'s Ark', de: 'Noahs Arche' } },
    { emojis: '🌈☁️🤝', answer: { en: 'Rainbow Covenant', de: 'Regenbogen-Bund' } },
  ],
  patriarchs: [
    { emojis: '⭐🏜️👴👶', answer: { en: 'Abraham\'s Promise', de: 'Abrahams Verheißung' } },
    { emojis: '👔🌈💰🇪🇬', answer: { en: 'Joseph in Egypt', de: 'Josef in Ägypten' } },
    { emojis: '🤼‍♂️👼🌙', answer: { en: 'Jacob wrestles God', de: 'Jakob ringt mit Gott' } },
  ],
  exodus: [
    { emojis: '👶🧺🏞️👸', answer: { en: 'Baby Moses', de: 'Baby Mose' } },
    { emojis: '🔥🌿👟❌', answer: { en: 'Burning Bush', de: 'Brennender Busch' } },
    { emojis: '🌊✋🚶‍♂️🏃‍♂️', answer: { en: 'Parting the Red Sea', de: 'Teilung des Roten Meeres' } },
    { emojis: '⛰️📜🔟', answer: { en: 'Ten Commandments', de: 'Zehn Gebote' } },
  ],
  gospels: [
    { emojis: '⭐👶🐑🎁🎁🎁', answer: { en: 'Birth of Jesus', de: 'Geburt Jesu' } },
    { emojis: '🍞🐟👥5️⃣0️⃣0️⃣0️⃣', answer: { en: 'Feeding 5000', de: 'Speisung der 5000' } },
    { emojis: '💧🍷🎉💒', answer: { en: 'Water into Wine', de: 'Wasser zu Wein' } },
  ],
  passion: [
    { emojis: '🍞🍷🙏12️⃣', answer: { en: 'Last Supper', de: 'Letztes Abendmahl' } },
    { emojis: '✝️🌑😢💀', answer: { en: 'Crucifixion', de: 'Kreuzigung' } },
  ],
  resurrection: [
    { emojis: '🪨🚫👼😭😃', answer: { en: 'Empty Tomb', de: 'Leeres Grab' } },
    { emojis: '☁️👆👋🌍', answer: { en: 'Ascension', de: 'Himmelfahrt' } },
  ],
};

function generateEmojiQuestion(worldId: string, locale: 'en' | 'de'): PlayableQuestion | null {
  const clues = EMOJI_CLUES[worldId];
  if (!clues || clues.length === 0) return null;

  const clue = clues[Math.floor(Math.random() * clues.length)];
  const correctAns = clue.answer[locale];

  // Gather wrong answers from other clues
  const allAnswers = Object.values(EMOJI_CLUES).flat().map(c => c.answer[locale]).filter(a => a !== correctAns);
  const wrongOpts = shuffle(allAnswers).slice(0, 3);
  const options = shuffle([correctAns, ...wrongOpts]);

  return {
    question: locale === 'de' ? `Welche Bibelgeschichte zeigen diese Emojis? ${clue.emojis}` : `What Bible story do these emojis show? ${clue.emojis}`,
    options,
    correctIndex: options.indexOf(correctAns),
    explanation: locale === 'de' ? `${clue.emojis} = ${correctAns}` : `${clue.emojis} = ${correctAns}`,
    hash: qHash('EMOJI_' + clue.emojis),
    difficulty: 2 as Difficulty,
  };
}

/**
 * Main entry: get questions for a world + tier, instant, no-repeat.
 */
export function getQuestions(
  bank: Record<string, BibleQuestion[]>,
  worldId: WorldId,
  tier: ScrollTier,
  locale: 'en' | 'de',
): PlayableQuestion[] {
  const tierDef = SCROLL_TIERS[tier - 1];
  const answered = getAnsweredHashes(worldId);

  // For Eternal Scroll, pull from ALL worlds
  let pool: BibleQuestion[];
  if (tier === 5) {
    pool = Object.values(bank).flat();
  } else {
    pool = [...(bank[worldId] || [])];
  }

  // Add cached AI questions
  const cached = getCachedAIQuestions(worldId);
  pool = [...pool, ...cached];

  // Filter by difficulty
  pool = pool.filter(q => tierDef.difficulties.includes(q.d));

  // Convert to playable
  let playable = pool.map(q => toPlayable(q, locale));

  // Add transformed questions for tiers 3+ (more variety)
  if (tier >= 3) {
    const sourcePool = bank[worldId] || [];
    // Add "NOT" reverse questions
    for (const bq of sourcePool) {
      const reversed = transformReverse(bq, locale);
      if (reversed) playable.push(reversed);
    }
    // Add emoji questions
    const emoji = generateEmojiQuestion(worldId, locale);
    if (emoji) playable.push(emoji);
  }

  // Remove already-answered (unless pool would be too small)
  const unanswered = playable.filter(q => !answered.has(q.hash));
  if (unanswered.length >= tierDef.questionCount) {
    playable = unanswered;
  }

  // Shuffle and take required count
  playable = shuffle(playable);

  if (tier === 5) {
    // Eternal mode: return a large shuffled batch
    return playable.slice(0, 50);
  }

  return playable.slice(0, tierDef.questionCount);
}

/**
 * Get the highest completed tier for a world.
 * Stored in localStorage per world.
 */
export function getWorldTierProgress(worldId: string): number {
  try {
    return Number(localStorage.getItem(`tiwaton_tier_${worldId}`) || '0');
  } catch { return 0; }
}

/** Record tier completion */
export function completeWorldTier(worldId: string, tier: ScrollTier): void {
  try {
    const current = getWorldTierProgress(worldId);
    if (tier > current) {
      localStorage.setItem(`tiwaton_tier_${worldId}`, String(tier));
    }
  } catch { /* noop */ }
}

/** Get eternal scroll high score */
export function getEternalHighScore(worldId: string): number {
  try {
    return Number(localStorage.getItem(`tiwaton_eternal_${worldId}`) || '0');
  } catch { return 0; }
}

/** Update eternal scroll high score */
export function setEternalHighScore(worldId: string, score: number): void {
  try {
    const current = getEternalHighScore(worldId);
    if (score > current) {
      localStorage.setItem(`tiwaton_eternal_${worldId}`, String(score));
    }
  } catch { /* noop */ }
}
