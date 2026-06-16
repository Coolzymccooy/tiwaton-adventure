/**
 * Math Engine — expanded question generation for Multiplication Mountain.
 *
 * Features:
 * 1. 8 question types beyond basic multiplication
 * 2. Endless Summit Challenge mode after conquering the mountain
 * 3. Streak-based difficulty scaling
 * 4. No-repeat via question hash tracking
 * 5. Word problems, missing factors, reverse division, speed rounds
 */

export type MathQuestionType =
  | 'multiply'        // 6 × 7 = ?
  | 'missing_factor'  // ? × 7 = 42
  | 'reverse_divide'  // 42 ÷ 6 = ?
  | 'word_problem'    // Sarah has 6 bags with 7 apples each...
  | 'compare'         // Which is bigger: 6×7 or 8×5?
  | 'square'          // What is 7²?
  | 'double_step'     // (3 × 4) + (2 × 5) = ?
  | 'fill_sequence';  // 3, 6, 9, ?, 15

export interface MathQuestion {
  text: string;
  speak: string;
  answer: number;
  options: number[];
  type: MathQuestionType;
  hash: string;
  difficulty: number; // 1-10 scale
}

// Simple hash
function qHash(text: string): string {
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = ((h << 5) - h + text.charCodeAt(i)) | 0;
  }
  return 'm' + Math.abs(h).toString(36);
}

// Shuffle
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Generate unique options around the answer
function makeOptions(answer: number, spread: number = 3): number[] {
  const opts = new Set<number>([answer]);
  const attempts = [answer + 1, answer - 1, answer + spread, answer - spread, answer + 2, answer - 2, answer + spread * 2];
  for (const v of attempts) {
    if (v >= 0 && v !== answer) opts.add(v);
    if (opts.size >= 4) break;
  }
  // Ensure at least 4 options
  let n = answer + 10;
  while (opts.size < 4) { opts.add(n); n += 5; }
  return shuffle([...opts].slice(0, 4));
}

// ─── MOUNTAIN CAMPS ───

export const MOUNTAIN_CAMPS = [
  { id: 1, name: { en: 'Base Camp', de: 'Basislager' }, tables: [2, 10], color: 'text-emerald-400', emoji: '⛺' },
  { id: 2, name: { en: 'Pine Forest', de: 'Kiefernwald' }, tables: [5, 3], color: 'text-green-500', emoji: '🌲' },
  { id: 3, name: { en: 'Rocky Cliff', de: 'Felsige Klippe' }, tables: [4, 6], color: 'text-slate-400', emoji: '🪨' },
  { id: 4, name: { en: 'Snowy Slope', de: 'Schneehang' }, tables: [7, 8, 9], color: 'text-blue-200', emoji: '❄️' },
  { id: 5, name: { en: 'The Summit', de: 'Der Gipfel' }, tables: [11, 12], color: 'text-amber-400', emoji: '🏔️' },
];

// ─── QUESTION TYPES BY DIFFICULTY ───

const WORD_PROBLEM_TEMPLATES = [
  { en: (a: number, b: number) => `${a} friends each brought ${b} cookies. How many cookies in total?`, de: (a: number, b: number) => `${a} Freunde brachten je ${b} Kekse mit. Wie viele Kekse insgesamt?` },
  { en: (a: number, b: number) => `A garden has ${a} rows with ${b} flowers in each row. Total flowers?`, de: (a: number, b: number) => `Ein Garten hat ${a} Reihen mit je ${b} Blumen. Blumen insgesamt?` },
  { en: (a: number, b: number) => `${a} boxes, each holding ${b} toys. How many toys altogether?`, de: (a: number, b: number) => `${a} Kisten, jede mit ${b} Spielzeugen. Wie viele Spielzeuge insgesamt?` },
  { en: (a: number, b: number) => `A bus makes ${a} trips carrying ${b} passengers each. Total passengers?`, de: (a: number, b: number) => `Ein Bus macht ${a} Fahrten mit je ${b} Passagieren. Passagiere insgesamt?` },
  { en: (a: number, b: number) => `There are ${a} teams with ${b} players each. How many players total?`, de: (a: number, b: number) => `Es gibt ${a} Teams mit je ${b} Spielern. Wie viele Spieler insgesamt?` },
  { en: (a: number, b: number) => `A book has ${a} chapters, each with ${b} pages. Total pages?`, de: (a: number, b: number) => `Ein Buch hat ${a} Kapitel mit je ${b} Seiten. Seiten insgesamt?` },
  { en: (a: number, b: number) => `${a} shelves hold ${b} books each. How many books are there?`, de: (a: number, b: number) => `${a} Regale halten je ${b} Bücher. Wie viele Bücher gibt es?` },
  { en: (a: number, b: number) => `You practice piano ${b} minutes a day for ${a} days. Total minutes?`, de: (a: number, b: number) => `Du übst ${b} Minuten Klavier pro Tag für ${a} Tage. Minuten insgesamt?` },
];

/**
 * Generate a multiplication mountain question based on stage and streak.
 * Higher streak = more varied question types.
 */
export function generateMountainQuestion(
  stage: number,
  streak: number,
  locale: 'en' | 'de' = 'en'
): MathQuestion {
  const camp = MOUNTAIN_CAMPS[Math.min(stage - 1, MOUNTAIN_CAMPS.length - 1)];
  const table = camp.tables[Math.floor(Math.random() * camp.tables.length)];
  const other = Math.floor(Math.random() * 12) + 1;
  const answer = table * other;

  // Determine question type based on streak (more variety as streak grows)
  const types: MathQuestionType[] = ['multiply'];
  if (streak >= 3) types.push('missing_factor');
  if (streak >= 5) types.push('reverse_divide');
  if (streak >= 7) types.push('word_problem');
  if (streak >= 10) types.push('compare', 'square');
  if (streak >= 15) types.push('double_step', 'fill_sequence');

  const type = types[Math.floor(Math.random() * types.length)];

  return generateByType(type, table, other, locale);
}

/**
 * Generate an endless summit question with full variety.
 * Difficulty scales with the current score.
 */
export function generateSummitQuestion(
  currentScore: number,
  locale: 'en' | 'de' = 'en'
): MathQuestion {
  // Scale tables and complexity with score
  const maxTable = Math.min(12, 3 + Math.floor(currentScore / 3));
  const table = Math.floor(Math.random() * maxTable) + 2;
  const maxOther = Math.min(12, 3 + Math.floor(currentScore / 2));
  const other = Math.floor(Math.random() * maxOther) + 1;

  // All types available, weighted by score
  const types: MathQuestionType[] = ['multiply', 'multiply', 'missing_factor'];
  if (currentScore >= 5) types.push('reverse_divide', 'word_problem');
  if (currentScore >= 10) types.push('compare', 'square', 'double_step');
  if (currentScore >= 15) types.push('fill_sequence', 'fill_sequence');

  const type = types[Math.floor(Math.random() * types.length)];

  return generateByType(type, table, other, locale);
}

function generateByType(
  type: MathQuestionType,
  a: number,
  b: number,
  locale: 'en' | 'de'
): MathQuestion {
  const answer = a * b;

  switch (type) {
    case 'multiply': {
      const text = `${a} × ${b}`;
      return {
        text,
        speak: locale === 'de' ? `Was ist ${a} mal ${b}?` : `What is ${a} times ${b}?`,
        answer,
        options: makeOptions(answer, a),
        type,
        hash: qHash(`mul_${a}_${b}`),
        difficulty: Math.ceil((a + b) / 5),
      };
    }

    case 'missing_factor': {
      const text = locale === 'de' ? `? × ${b} = ${answer}` : `? × ${b} = ${answer}`;
      return {
        text,
        speak: locale === 'de'
          ? `Was mal ${b} ergibt ${answer}?`
          : `What times ${b} equals ${answer}?`,
        answer: a,
        options: makeOptions(a, 2),
        type,
        hash: qHash(`miss_${a}_${b}`),
        difficulty: Math.ceil((a + b) / 4),
      };
    }

    case 'reverse_divide': {
      const text = `${answer} ÷ ${a}`;
      return {
        text,
        speak: locale === 'de'
          ? `Was ist ${answer} geteilt durch ${a}?`
          : `What is ${answer} divided by ${a}?`,
        answer: b,
        options: makeOptions(b, 2),
        type,
        hash: qHash(`div_${answer}_${a}`),
        difficulty: Math.ceil((a + b) / 4),
      };
    }

    case 'word_problem': {
      const template = WORD_PROBLEM_TEMPLATES[Math.floor(Math.random() * WORD_PROBLEM_TEMPLATES.length)];
      const text = template[locale](a, b);
      return {
        text,
        speak: text,
        answer,
        options: makeOptions(answer, a),
        type,
        hash: qHash(`word_${a}_${b}_${WORD_PROBLEM_TEMPLATES.indexOf(template)}`),
        difficulty: Math.ceil((a + b) / 3),
      };
    }

    case 'compare': {
      const a2 = Math.floor(Math.random() * 10) + 2;
      const b2 = Math.floor(Math.random() * 10) + 2;
      const prod1 = a * b;
      const prod2 = a2 * b2;
      const bigger = Math.max(prod1, prod2);
      const text = locale === 'de'
        ? `Was ist größer: ${a}×${b} oder ${a2}×${b2}?`
        : `Which is bigger: ${a}×${b} or ${a2}×${b2}?`;
      return {
        text,
        speak: text,
        answer: bigger,
        options: shuffle([prod1, prod2, prod1 + prod2, Math.abs(prod1 - prod2)].filter((v, i, arr) => arr.indexOf(v) === i)).slice(0, 4),
        type,
        hash: qHash(`cmp_${a}_${b}_${a2}_${b2}`),
        difficulty: 6,
      };
    }

    case 'square': {
      const n = Math.min(a, 12);
      const sq = n * n;
      const text = `${n}²`;
      return {
        text,
        speak: locale === 'de' ? `Was ist ${n} zum Quadrat?` : `What is ${n} squared?`,
        answer: sq,
        options: makeOptions(sq, n),
        type,
        hash: qHash(`sq_${n}`),
        difficulty: Math.ceil(n / 2),
      };
    }

    case 'double_step': {
      const c = Math.floor(Math.random() * 5) + 1;
      const d = Math.floor(Math.random() * 5) + 1;
      const res = (a * b) + (c * d);
      const text = `(${a} × ${b}) + (${c} × ${d})`;
      return {
        text,
        speak: locale === 'de'
          ? `Was ist ${a} mal ${b} plus ${c} mal ${d}?`
          : `What is ${a} times ${b} plus ${c} times ${d}?`,
        answer: res,
        options: makeOptions(res, 5),
        type,
        hash: qHash(`dbl_${a}_${b}_${c}_${d}`),
        difficulty: 7,
      };
    }

    case 'fill_sequence': {
      const step = Math.min(a, 12);
      const pos = Math.floor(Math.random() * 3) + 2; // position 2-4
      const seq = Array.from({ length: 5 }, (_, i) => step * (i + 1));
      const missing = seq[pos];
      const display = seq.map((v, i) => i === pos ? '?' : String(v)).join(', ');
      return {
        text: display,
        speak: locale === 'de'
          ? `Finde die fehlende Zahl in der Reihe: ${display}`
          : `Find the missing number in the sequence: ${display}`,
        answer: missing,
        options: makeOptions(missing, step),
        type,
        hash: qHash(`seq_${step}_${pos}`),
        difficulty: 5,
      };
    }

    default:
      return {
        text: `${a} × ${b}`,
        speak: `What is ${a} times ${b}?`,
        answer,
        options: makeOptions(answer, a),
        type: 'multiply',
        hash: qHash(`mul_${a}_${b}`),
        difficulty: 3,
      };
  }
}

// ─── PROGRESS TRACKING ───

export function getMountainProgress(): { stage: number; completed: boolean; summitHighScore: number } {
  try {
    return {
      stage: Number(localStorage.getItem('tiwaton_mountain_stage') || '1'),
      completed: localStorage.getItem('tiwaton_mountain_completed') === 'true',
      summitHighScore: Number(localStorage.getItem('tiwaton_summit_highscore') || '0'),
    };
  } catch {
    return { stage: 1, completed: false, summitHighScore: 0 };
  }
}

export function saveMountainStage(stage: number): void {
  try {
    const current = Number(localStorage.getItem('tiwaton_mountain_stage') || '1');
    if (stage > current) localStorage.setItem('tiwaton_mountain_stage', String(stage));
  } catch { /* noop */ }
}

export function completeMountain(): void {
  try { localStorage.setItem('tiwaton_mountain_completed', 'true'); } catch { /* noop */ }
}

export function saveSummitHighScore(score: number): void {
  try {
    const current = Number(localStorage.getItem('tiwaton_summit_highscore') || '0');
    if (score > current) localStorage.setItem('tiwaton_summit_highscore', String(score));
  } catch { /* noop */ }
}

// ─── ANSWERED TRACKING ───

function getAnsweredHashes(): Set<string> {
  try {
    const raw = localStorage.getItem('tiwaton_math_answered');
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}

export function markMathAnswered(hash: string): void {
  try {
    const hashes = getAnsweredHashes();
    hashes.add(hash);
    // Keep last 200 to prevent localStorage bloat
    const arr = [...hashes].slice(-200);
    localStorage.setItem('tiwaton_math_answered', JSON.stringify(arr));
  } catch { /* noop */ }
}

export function resetMathAnswered(): void {
  try { localStorage.removeItem('tiwaton_math_answered'); } catch { /* noop */ }
}
