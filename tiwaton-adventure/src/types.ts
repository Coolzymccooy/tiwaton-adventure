export const View = {
  HOME: 'HOME',
  STORIES: 'STORIES',
  DRAWING: 'DRAWING',
  ACTIVITIES: 'ACTIVITIES',
  GAMES: 'GAMES',
  COUNTDOWN: 'COUNTDOWN',
} as const;

export type View = typeof View[keyof typeof View];

export interface FamilyProfile {
  familyCode: string;
  childName: string;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  isUserCreated: boolean;
  author?: string;
}

export interface QuizProgress {
  category: 'Bible' | 'Music' | 'Football';
  level: number; // 1-10
  unlocked: boolean;
}

export interface GameStat {
  xp: number;
  level: number;
  badges: string[];
  quizProgress: QuizProgress[];
  // New specific tracking
  mathLevel: number;
  mathProgress: number; // 0-10
  emojiLevel: number;
  emojiProgress: number; // 0-10
}

export interface ParentComment {
  id: string;
  text: string;
  author: string; // 'Mom', 'Dad', etc.
  timestamp: number;
}

export interface Drawing {
  id: string;
  dataUrl: string;
  author: string;
  timestamp: number;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Normal';
  completed: boolean;
}

export interface CountdownEvent {
  id: string;
  name: string;
  date: string;
  notificationEmail?: string;
}