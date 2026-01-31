
export enum View {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  HOME = 'HOME',
  STORIES = 'STORIES',
  DRAWING = 'DRAWING',
  ACTIVITIES = 'ACTIVITIES',
  GAMES = 'GAMES',
  COUNTDOWN = 'COUNTDOWN',
  PARENT_DASHBOARD = 'PARENT_DASHBOARD'
}

export type AppMode = 'KIDS' | 'STUDIO' | 'PARENT';

export interface FamilyProfile {
  id: string;
  childName: string;
  avatar: string;
  mode: AppMode;
  age: number;
  email?: string; // New: Required for Admin setup/reset
  pin?: string; 
  password?: string; 
  recoveryKey?: string; 
}

export interface Story {
  id: string;
  title: string;
  content: string;
  isUserCreated: boolean;
  author?: string;
  visualAssets?: string[]; 
}

export type MathPlanet = 'Numbers' | 'Operations' | 'Fractions' | 'Time' | 'Money' | 'Data' | 'Logic';

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
