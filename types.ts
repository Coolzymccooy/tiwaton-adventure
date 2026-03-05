
export enum View {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  HOME = 'HOME',
  STORIES = 'STORIES',
  DRAWING = 'DRAWING',
  ACTIVITIES = 'ACTIVITIES',
  GAMES = 'GAMES',
  COUNTDOWN = 'COUNTDOWN',
  PARENT_DASHBOARD = 'PARENT_DASHBOARD',
  TEACHER_DASHBOARD = 'TEACHER_DASHBOARD'
}

export type AppMode = 'KIDS' | 'STUDIO' | 'PARENT' | 'TEACHER';

export type UserRole = 'SUPERADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

export interface UserProfile {
  id: string;
  name: string; // Used to be childName
  role: UserRole;
  schoolId?: string; // Tenant Identifier
  classId?: string;  // Classroom Sub-Tenant

  avatar: string;
  mode: AppMode;
  age: number;
  email?: string; // For Admin/Teacher login
  pin?: string;
  password?: string;
  recoveryKey?: string;

  // Firebase specific fields
  active?: boolean;
  tenantId?: string;
  guardianUids?: string[];
  gameStats?: GameStat;
}

// Keep the old exported interface locally mapped in case of legacy local storage
export type FamilyProfile = UserProfile;

export interface Story {
  id: string;
  title: string;
  content: string;
  isUserCreated: boolean;
  author?: string;
  visualAssets?: string[];
}

export type MathPlanet =
  | 'Numbers' | 'Operations' | 'Fractions' | 'Time' | 'Money' | 'Data' | 'Logic'
  | 'Geometry' | 'Measurements' | 'Patterns' | 'Multiplication' | 'Division'
  | 'Probability' | 'Decimals' | 'Percentages' | 'Algebra' | 'WordProblems'
  | 'RomanNumerals' | 'Ratios' | 'NumberBonds' | 'EvensOdds';

export interface PlanetProgress {
  planet: MathPlanet;
  stars: number;
  unlocked: boolean;
  highScore: number;
  level?: number;
}

export interface GameStat {
  xp: number;
  level: number;
  badges: string[];
  quizProgress: {
    category: string;
    level: number;
    unlocked: boolean;
    bibleWorldLevel?: number;
  }[];
  mathLevel: number;
  mathPlanetProgress: PlanetProgress[];
  dailyChallengeCompleted?: string;
  coins: number;
  wordQuestProgress?: {
    level: number;
    unlocked: boolean;
  };
}

export interface Drawing {
  id: string;
  dataUrl: string;
  author: string;
  timestamp: number;
  isMagic?: boolean;
}

export interface CountdownEvent {
  id: string;
  name: string;
  date: string;
  notificationEmail?: string;
}

export interface ParentComment {
  id: string;
  text: string;
  author: string;
  timestamp: number;
}
