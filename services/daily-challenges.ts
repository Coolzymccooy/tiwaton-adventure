// Deterministic daily challenge engine — no server needed
// Uses date-seed to generate the same challenges for everyone on the same day

import { View } from '../types';

export interface DailyChallenge {
  id: string;
  title: { en: string; de: string };
  description: { en: string; de: string };
  icon: string;
  targetView: View;
  xpReward: number;
  coinReward: number;
  /** Key used to check completion in localStorage */
  trackingKey: string;
  category: 'quiz' | 'drawing' | 'games' | 'stories' | 'math';
}

// Simple seeded PRNG (mulberry32)
function seededRng(seed: number) {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function dateSeed(date?: Date): number {
  const d = date || new Date();
  const str = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  }
  return h;
}

// Master pool of challenge templates
const CHALLENGE_POOL: Omit<DailyChallenge, 'id'>[] = [
  // Quiz challenges
  { title: { en: 'Perfect Scholar', de: 'Perfekter Gelehrter' }, description: { en: 'Answer 5 Bible questions without a single mistake', de: 'Beantworte 5 Bibelfragen ohne einen einzigen Fehler' }, icon: '🎯', targetView: View.ACTIVITIES, xpReward: 100, coinReward: 25, trackingKey: 'dc_perfect_scholar', category: 'quiz' },
  { title: { en: 'World Explorer', de: 'Weltentdecker' }, description: { en: 'Complete 2 different Bible worlds today', de: 'Schließe heute 2 verschiedene Bibelwelten ab' }, icon: '🗺️', targetView: View.ACTIVITIES, xpReward: 150, coinReward: 30, trackingKey: 'dc_world_explorer', category: 'quiz' },
  { title: { en: 'Streak Master', de: 'Serienmeister' }, description: { en: 'Get a 5-question answer streak', de: 'Erreiche eine 5-Fragen-Antwortserie' }, icon: '🔥', targetView: View.ACTIVITIES, xpReward: 120, coinReward: 20, trackingKey: 'dc_streak_master', category: 'quiz' },
  { title: { en: 'Scroll Collector', de: 'Schriftrollensammler' }, description: { en: 'Earn a new badge from any Bible world', de: 'Verdiene ein neues Abzeichen aus einer Bibelwelt' }, icon: '📜', targetView: View.ACTIVITIES, xpReward: 200, coinReward: 50, trackingKey: 'dc_scroll_collector', category: 'quiz' },
  { title: { en: 'Speed Sage', de: 'Schneller Weiser' }, description: { en: 'Answer 10 questions in under 3 minutes', de: 'Beantworte 10 Fragen in unter 3 Minuten' }, icon: '⚡', targetView: View.ACTIVITIES, xpReward: 130, coinReward: 30, trackingKey: 'dc_speed_sage', category: 'quiz' },
  { title: { en: 'Knowledge Knight', de: 'Wissensritter' }, description: { en: 'Play the Eternal Scroll and survive 10 rounds', de: 'Spiele die Ewige Schriftrolle und überstehe 10 Runden' }, icon: '⚔️', targetView: View.ACTIVITIES, xpReward: 250, coinReward: 60, trackingKey: 'dc_knowledge_knight', category: 'quiz' },
  { title: { en: 'Bible Blitz', de: 'Bibel-Blitz' }, description: { en: 'Complete any Bible world on Scholar tier or higher', de: 'Schließe eine Bibelwelt auf Gelehrten-Stufe oder höher ab' }, icon: '📚', targetView: View.ACTIVITIES, xpReward: 180, coinReward: 40, trackingKey: 'dc_bible_blitz', category: 'quiz' },

  // Drawing challenges (expanded — 7 entries)
  { title: { en: 'Creation Artist', de: 'Schöpfungskünstler' }, description: { en: 'Draw your favorite Bible scene', de: 'Zeichne deine Lieblings-Bibelszene' }, icon: '🎨', targetView: View.DRAWING, xpReward: 100, coinReward: 20, trackingKey: 'dc_creation_artist', category: 'drawing' },
  { title: { en: 'Studio Star', de: 'Studiostern' }, description: { en: 'Complete a drawing challenge in the Art Studio', de: 'Schließe eine Zeichenherausforderung im Kunststudio ab' }, icon: '⭐', targetView: View.DRAWING, xpReward: 120, coinReward: 25, trackingKey: 'dc_studio_star', category: 'drawing' },
  { title: { en: 'Color Master', de: 'Farbmeister' }, description: { en: 'Use at least 5 different colors in a single drawing', de: 'Verwende mindestens 5 verschiedene Farben in einer Zeichnung' }, icon: '🌈', targetView: View.DRAWING, xpReward: 80, coinReward: 15, trackingKey: 'dc_color_master', category: 'drawing' },
  { title: { en: 'Legend Painter', de: 'Legenden-Maler' }, description: { en: 'Complete a Legend-tier studio mission', de: 'Schließe eine Legenden-Studio-Mission ab' }, icon: '👑', targetView: View.DRAWING, xpReward: 200, coinReward: 40, trackingKey: 'dc_legend_painter', category: 'drawing' },
  { title: { en: 'Animal Artist', de: 'Tier-Künstler' }, description: { en: 'Draw any animal prompt from the challenge bank', de: 'Zeichne eine Tier-Aufgabe aus der Herausforderungsbank' }, icon: '🦁', targetView: View.DRAWING, xpReward: 90, coinReward: 18, trackingKey: 'dc_animal_artist', category: 'drawing' },
  { title: { en: 'Space Painter', de: 'Weltraum-Maler' }, description: { en: 'Draw a space-themed creative prompt', de: 'Zeichne eine Weltraum-Aufgabe' }, icon: '🚀', targetView: View.DRAWING, xpReward: 100, coinReward: 20, trackingKey: 'dc_space_painter', category: 'drawing' },
  { title: { en: 'Bible Scene Artist', de: 'Bibelszenen-Künstler' }, description: { en: 'Draw a Bible scene from the prompt bank', de: 'Zeichne eine Bibelszene aus der Aufgabenbank' }, icon: '📖', targetView: View.DRAWING, xpReward: 120, coinReward: 25, trackingKey: 'dc_bible_artist', category: 'drawing' },

  // Games challenges
  { title: { en: 'Word Warrior', de: 'Wortkrieger' }, description: { en: 'Complete a crossword puzzle in Games', de: 'Löse ein Kreuzworträtsel in Spiele' }, icon: '🧩', targetView: View.GAMES, xpReward: 100, coinReward: 20, trackingKey: 'dc_word_warrior', category: 'games' },
  { title: { en: 'Game Champion', de: 'Spielmeister' }, description: { en: 'Win any 2 games today', de: 'Gewinne heute 2 beliebige Spiele' }, icon: '🏆', targetView: View.GAMES, xpReward: 150, coinReward: 35, trackingKey: 'dc_game_champion', category: 'games' },
  { title: { en: 'Arcade Hero', de: 'Arcade-Held' }, description: { en: 'Score at least 500 points in any arcade game', de: 'Erziele mindestens 500 Punkte in einem Arcade-Spiel' }, icon: '🕹️', targetView: View.GAMES, xpReward: 120, coinReward: 25, trackingKey: 'dc_arcade_hero', category: 'games' },

  // Stories challenges
  { title: { en: 'Story Seeker', de: 'Geschichtensucher' }, description: { en: 'Read or listen to a Bible story', de: 'Lies oder höre eine Bibelgeschichte' }, icon: '📖', targetView: View.STORIES, xpReward: 80, coinReward: 15, trackingKey: 'dc_story_seeker', category: 'stories' },
  { title: { en: 'Tale Teller', de: 'Geschichtenerzähler' }, description: { en: 'Create your own story with drawings', de: 'Erstelle eine eigene Geschichte mit Zeichnungen' }, icon: '✍️', targetView: View.STORIES, xpReward: 150, coinReward: 30, trackingKey: 'dc_tale_teller', category: 'stories' },

  // Math challenges (expanded — 6 entries)
  { title: { en: 'Number Ninja', de: 'Zahlen-Ninja' }, description: { en: 'Complete a math planet level', de: 'Schließe ein Mathe-Planeten-Level ab' }, icon: '🔢', targetView: View.GAMES, xpReward: 100, coinReward: 20, trackingKey: 'dc_number_ninja', category: 'math' },
  { title: { en: 'Mountain Climber', de: 'Bergsteiger' }, description: { en: 'Reach the next camp on Multiplication Mountain', de: 'Erreiche das nächste Lager auf dem Multiplikations-Berg' }, icon: '🏔️', targetView: View.GAMES, xpReward: 150, coinReward: 35, trackingKey: 'dc_mountain_climber', category: 'math' },
  { title: { en: 'Summit Survivor', de: 'Gipfel-Überlebender' }, description: { en: 'Score 10+ in the Summit Challenge', de: 'Erreiche 10+ Punkte in der Gipfel-Herausforderung' }, icon: '⚡', targetView: View.GAMES, xpReward: 200, coinReward: 50, trackingKey: 'dc_summit_survivor', category: 'math' },
  { title: { en: 'Streak Star', de: 'Serien-Star' }, description: { en: 'Get a 10-answer streak in Multiplication Mountain', de: 'Erreiche eine 10er-Serie im Multiplikations-Berg' }, icon: '🔥', targetView: View.GAMES, xpReward: 180, coinReward: 40, trackingKey: 'dc_streak_star', category: 'math' },
  { title: { en: 'Times Table Hero', de: 'Einmaleins-Held' }, description: { en: 'Answer 20 multiplication questions today', de: 'Beantworte heute 20 Multiplikationsaufgaben' }, icon: '✖️', targetView: View.GAMES, xpReward: 130, coinReward: 30, trackingKey: 'dc_times_hero', category: 'math' },
  { title: { en: 'Division Master', de: 'Divisions-Meister' }, description: { en: 'Solve 5 reverse division questions correctly', de: 'Löse 5 umgekehrte Divisionsaufgaben richtig' }, icon: '➗', targetView: View.GAMES, xpReward: 150, coinReward: 35, trackingKey: 'dc_division_master', category: 'math' },
];

/**
 * Pick N challenges for today using seeded random.
 * Same day = same challenges for everyone.
 */
export function getTodayChallenges(count: number = 3, date?: Date): DailyChallenge[] {
  const seed = dateSeed(date);
  const rng = seededRng(seed);

  // Shuffle pool deterministically
  const pool = [...CHALLENGE_POOL];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // Ensure category diversity: pick from different categories
  const picked: Omit<DailyChallenge, 'id'>[] = [];
  const usedCategories = new Set<string>();

  // First pass: one per category
  for (const ch of pool) {
    if (picked.length >= count) break;
    if (!usedCategories.has(ch.category)) {
      picked.push(ch);
      usedCategories.add(ch.category);
    }
  }

  // Fill remaining if needed
  for (const ch of pool) {
    if (picked.length >= count) break;
    if (!picked.includes(ch)) {
      picked.push(ch);
    }
  }

  const dateStr = (date || new Date()).toISOString().slice(0, 10);
  return picked.map((ch, i) => ({
    ...ch,
    id: `${dateStr}-${i}`,
  }));
}

/** Check if a specific challenge was completed today */
export function isChallengeCompleted(challengeId: string): boolean {
  try {
    const key = `tiwaton_dc_${challengeId}`;
    return localStorage.getItem(key) === 'done';
  } catch { return false; }
}

/** Mark a challenge as completed today */
export function completeChallenge(challengeId: string): void {
  try {
    const key = `tiwaton_dc_${challengeId}`;
    localStorage.setItem(key, 'done');
    // Store today's date so we can clear old ones
    localStorage.setItem(`${key}_date`, new Date().toISOString().slice(0, 10));
  } catch { /* noop */ }
}

/** Clear yesterday's completions */
export function clearStaleCompletions(): void {
  try {
    const today = new Date().toISOString().slice(0, 10);
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('tiwaton_dc_') && key.endsWith('_date')) {
        if (localStorage.getItem(key) !== today) {
          const baseKey = key.replace('_date', '');
          localStorage.removeItem(baseKey);
          localStorage.removeItem(key);
        }
      }
    }
  } catch { /* noop */ }
}

/** Get completion count for today */
export function getTodayCompletionCount(date?: Date): number {
  const challenges = getTodayChallenges(3, date);
  return challenges.filter(c => isChallengeCompleted(c.id)).length;
}
