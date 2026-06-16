/**
 * Analytics Engine — computes rich, real-time analytics from local profile data.
 * No external API needed. All stats derived from GameStat, drawings, and progress tracking.
 */

import type { FamilyProfile, GameStat, Drawing } from '../types';
import { getMountainProgress } from './math-engine';
import { getDrawingStats, getDrawingTierProgress } from './drawing-engine';

// ─── Per-Profile Analytics ───

export interface ProfileAnalytics {
  id: string;
  name: string;
  avatar: string;
  age: number;
  role: string;

  // Core metrics
  xp: number;
  level: number;
  coins: number;
  badges: string[];

  // Skill scores (0-100 scale)
  skills: {
    math: number;
    art: number;
    quiz: number;
    reading: number;
    games: number;
  };

  // Math breakdown
  math: {
    level: number;
    planetsUnlocked: number;
    planetsTotal: number;
    totalStars: number;
    maxStars: number;
    mountainStage: number;
    mountainCompleted: boolean;
    summitHighScore: number;
  };

  // Quiz breakdown
  quiz: {
    worldsCompleted: number;
    worldsTotal: number;
    totalBadges: number;
    highestWorldLevel: number;
  };

  // Art breakdown
  art: {
    drawingsCount: number;
    tier: number;
    promptsCompleted: number;
    promptsTotal: number;
    missionsCompleted: number;
    missionsTotal: number;
  };

  // Word Quest
  wordQuest: {
    level: number;
    unlocked: boolean;
  };

  // Engagement
  engagement: {
    dailyChallengeToday: boolean;
    streakEstimate: number; // rough estimate from data
  };
}

export interface DashboardAnalytics {
  // Aggregate KPIs
  totalXP: number;
  totalCoins: number;
  totalDrawings: number;
  totalBadges: number;
  averageLevel: number;
  highestLevel: number;
  activeMembers: number;

  // Skill distribution across all members
  avgSkills: {
    math: number;
    art: number;
    quiz: number;
    reading: number;
    games: number;
  };

  // Top performers
  topByXP: { name: string; avatar: string; xp: number }[];
  topByMath: { name: string; avatar: string; score: number }[];
  topByArt: { name: string; avatar: string; score: number }[];

  // Category breakdown
  categoryBreakdown: { category: string; emoji: string; total: number; avg: number }[];

  // Per-profile analytics
  profiles: ProfileAnalytics[];
}

// ─── Skill Score Calculators ───

function calcMathSkill(stats: GameStat | undefined): number {
  if (!stats) return 0;
  let score = 0;
  score += Math.min(stats.mathLevel * 8, 30); // math level: up to 30
  const planets = stats.mathPlanetProgress || [];
  const unlocked = planets.filter(p => p.unlocked).length;
  const totalStars = planets.reduce((s, p) => s + p.stars, 0);
  score += Math.min(unlocked * 5, 25); // planets unlocked: up to 25
  score += Math.min(totalStars * 2, 25); // stars earned: up to 25
  score += Math.min(stats.level * 2, 20); // general level: up to 20
  return Math.min(100, Math.round(score));
}

function calcArtSkill(drawingCount: number): number {
  const tierProgress = getDrawingTierProgress();
  const dStats = getDrawingStats();
  let score = 0;
  score += Math.min(drawingCount * 5, 30); // drawings created: up to 30
  score += tierProgress * 15; // tier progress: up to 45
  score += Math.min(dStats.completedPrompts * 2, 15); // prompts: up to 15
  score += Math.min(dStats.completedMissions * 5, 10); // missions: up to 10
  return Math.min(100, Math.round(score));
}

function calcQuizSkill(stats: GameStat | undefined): number {
  if (!stats) return 0;
  let score = 0;
  const qp = stats.quizProgress || [];
  const completed = qp.filter(q => q.level >= 3).length;
  const totalLevel = qp.reduce((s, q) => s + q.level, 0);
  score += Math.min(completed * 10, 40); // worlds completed: up to 40
  score += Math.min(totalLevel * 3, 30); // total levels: up to 30
  score += Math.min(stats.badges.length * 5, 30); // badges: up to 30
  return Math.min(100, Math.round(score));
}

function calcReadingSkill(stats: GameStat | undefined): number {
  if (!stats) return 0;
  const wq = stats.wordQuestProgress;
  let score = 0;
  if (wq) {
    score += wq.unlocked ? 20 : 0;
    score += Math.min(wq.level * 10, 80);
  }
  return Math.min(100, Math.round(score));
}

function calcGamesSkill(stats: GameStat | undefined): number {
  if (!stats) return 0;
  let score = 0;
  score += Math.min(stats.xp / 50, 30); // XP-based: up to 30
  score += Math.min(stats.level * 5, 30); // level-based: up to 30
  score += Math.min(stats.coins / 20, 20); // coins-based: up to 20
  score += Math.min(stats.badges.length * 5, 20); // badges: up to 20
  return Math.min(100, Math.round(score));
}

// ─── Main Analytics Computer ───

export function computeProfileAnalytics(
  profile: FamilyProfile,
  drawings: Drawing[]
): ProfileAnalytics {
  const stats = profile.gameStats;
  const profileDrawings = drawings.filter(d => d.author === profile.name);
  const mountainProgress = getMountainProgress();
  const dStats = getDrawingStats();

  const mathSkill = calcMathSkill(stats);
  const artSkill = calcArtSkill(profileDrawings.length);
  const quizSkill = calcQuizSkill(stats);
  const readingSkill = calcReadingSkill(stats);
  const gamesSkill = calcGamesSkill(stats);

  const qp = stats?.quizProgress || [];
  const planets = stats?.mathPlanetProgress || [];

  return {
    id: profile.id,
    name: profile.name,
    avatar: profile.avatar,
    age: profile.age,
    role: profile.role || 'STUDENT',

    xp: stats?.xp || 0,
    level: stats?.level || 1,
    coins: stats?.coins || 0,
    badges: stats?.badges || [],

    skills: { math: mathSkill, art: artSkill, quiz: quizSkill, reading: readingSkill, games: gamesSkill },

    math: {
      level: stats?.mathLevel || 0,
      planetsUnlocked: planets.filter(p => p.unlocked).length,
      planetsTotal: planets.length,
      totalStars: planets.reduce((s, p) => s + p.stars, 0),
      maxStars: planets.length * 3,
      mountainStage: mountainProgress.stage,
      mountainCompleted: mountainProgress.completed,
      summitHighScore: mountainProgress.summitHighScore,
    },

    quiz: {
      worldsCompleted: qp.filter(q => q.level >= 3).length,
      worldsTotal: qp.length,
      totalBadges: (stats?.badges || []).length,
      highestWorldLevel: qp.reduce((max, q) => Math.max(max, q.bibleWorldLevel || q.level), 0),
    },

    art: {
      drawingsCount: profileDrawings.length,
      tier: getDrawingTierProgress(),
      promptsCompleted: dStats.completedPrompts,
      promptsTotal: dStats.totalPrompts,
      missionsCompleted: dStats.completedMissions,
      missionsTotal: dStats.totalMissions,
    },

    wordQuest: {
      level: stats?.wordQuestProgress?.level || 0,
      unlocked: stats?.wordQuestProgress?.unlocked || false,
    },

    engagement: {
      dailyChallengeToday: stats?.dailyChallengeCompleted === new Date().toISOString().slice(0, 10),
      streakEstimate: Math.min((stats?.level || 0) + (stats?.badges?.length || 0), 30),
    },
  };
}

export function computeDashboardAnalytics(
  profiles: FamilyProfile[],
  drawings: Drawing[]
): DashboardAnalytics {
  const kidProfiles = profiles.filter(p => p.role !== 'PARENT' && p.role !== 'TEACHER' && p.mode !== 'PARENT');
  const allAnalytics = kidProfiles.map(p => computeProfileAnalytics(p, drawings));

  const totalXP = allAnalytics.reduce((s, a) => s + a.xp, 0);
  const totalCoins = allAnalytics.reduce((s, a) => s + a.coins, 0);
  const totalBadges = allAnalytics.reduce((s, a) => s + a.badges.length, 0);
  const levels = allAnalytics.map(a => a.level);
  const averageLevel = levels.length ? Math.round(levels.reduce((s, l) => s + l, 0) / levels.length) : 1;
  const highestLevel = levels.length ? Math.max(...levels) : 1;

  const avgSkills = {
    math: avg(allAnalytics.map(a => a.skills.math)),
    art: avg(allAnalytics.map(a => a.skills.art)),
    quiz: avg(allAnalytics.map(a => a.skills.quiz)),
    reading: avg(allAnalytics.map(a => a.skills.reading)),
    games: avg(allAnalytics.map(a => a.skills.games)),
  };

  const topByXP = [...allAnalytics].sort((a, b) => b.xp - a.xp).slice(0, 5).map(a => ({ name: a.name, avatar: a.avatar, xp: a.xp }));
  const topByMath = [...allAnalytics].sort((a, b) => b.skills.math - a.skills.math).slice(0, 5).map(a => ({ name: a.name, avatar: a.avatar, score: a.skills.math }));
  const topByArt = [...allAnalytics].sort((a, b) => b.skills.art - a.skills.art).slice(0, 5).map(a => ({ name: a.name, avatar: a.avatar, score: a.skills.art }));

  const categoryBreakdown = [
    { category: 'Math', emoji: '🔢', total: allAnalytics.reduce((s, a) => s + a.math.totalStars, 0), avg: avgSkills.math },
    { category: 'Art', emoji: '🎨', total: drawings.length, avg: avgSkills.art },
    { category: 'Quiz', emoji: '📚', total: totalBadges, avg: avgSkills.quiz },
    { category: 'Reading', emoji: '📖', total: allAnalytics.reduce((s, a) => s + a.wordQuest.level, 0), avg: avgSkills.reading },
    { category: 'Games', emoji: '🎮', total: totalXP, avg: avgSkills.games },
  ];

  return {
    totalXP,
    totalCoins,
    totalDrawings: drawings.length,
    totalBadges,
    averageLevel,
    highestLevel,
    activeMembers: kidProfiles.length,
    avgSkills,
    topByXP,
    topByMath,
    topByArt,
    categoryBreakdown,
    profiles: allAnalytics,
  };
}

function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return Math.round(nums.reduce((s, n) => s + n, 0) / nums.length);
}
