
import type { Story, Activity, Drawing, GameStat, ParentComment, CountdownEvent } from '../types';


// Keys
const KEYS = {
  PROFILE: 'tiwaton_profile',
  STORIES: 'tiwaton_stories',
  ACTIVITIES: 'tiwaton_activities',
  DRAWINGS: 'tiwaton_drawings',
  GAME_STATS: 'tiwaton_stats',
  COMMENTS: 'tiwaton_comments',
  EVENTS: 'tiwaton_events'
};

// Optimized delay for snappier performance while keeping async signature
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const StorageService = {
  // Profile
  getProfile: () => {
    const stored = localStorage.getItem(KEYS.PROFILE);
    return stored ? JSON.parse(stored) : { familyCode: '', childName: '' };
  },
  saveProfile: (profile: { familyCode: string; childName: string }) => {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  },

  // Stories
  getStories: async (): Promise<Story[]> => {
    await delay(50); // Reduced from 200ms
    const stored = localStorage.getItem(KEYS.STORIES);
    return stored ? JSON.parse(stored) : [];
  },
  addStory: async (story: Story) => {
    await delay(100); // Reduced from 300ms
    const stories = await StorageService.getStories();
    stories.unshift(story);
    localStorage.setItem(KEYS.STORIES, JSON.stringify(stories));
  },

  // Drawings
  getDrawings: async (): Promise<Drawing[]> => {
    await delay(50); // Reduced from 200ms
    const stored = localStorage.getItem(KEYS.DRAWINGS);
    return stored ? JSON.parse(stored) : [];
  },
  saveDrawing: async (drawing: Drawing) => {
    await delay(150); // Reduced from 500ms
    const list = await StorageService.getDrawings();
    list.unshift(drawing);
    if (list.length > 20) list.pop(); 
    localStorage.setItem(KEYS.DRAWINGS, JSON.stringify(list));
  },

  // Game Stats & Quiz Progress
  getGameStats: (): GameStat => {
    const stored = localStorage.getItem(KEYS.GAME_STATS);
    const defaultStats: GameStat = { 
      xp: 0, 
      level: 1, 
      badges: [],
      quizProgress: [
        { category: 'Bible', level: 1, unlocked: true },
        { category: 'Music', level: 1, unlocked: true },
        { category: 'Football', level: 1, unlocked: true }
      ],
      // New Progressive Fields
      mathLevel: 1,
      mathProgress: 0,
      emojiLevel: 1,
      emojiProgress: 0
    };
    
    if (!stored) return defaultStats;
    
    const parsed = JSON.parse(stored);
    // Deep merge to ensure new fields exist on old data
    return { ...defaultStats, ...parsed };
  },
  
  saveGameStats: (stats: GameStat) => {
    localStorage.setItem(KEYS.GAME_STATS, JSON.stringify(stats));
  },

  // Parent Comments
  getComments: (): ParentComment[] => {
    const stored = localStorage.getItem(KEYS.COMMENTS);
    return stored ? JSON.parse(stored) : [
      { id: '1', text: "We are so proud of you!", author: "Mom", timestamp: Date.now() }
    ];
  },
  addComment: (text: string, author: string) => {
    const comments = StorageService.getComments();
    comments.unshift({ id: Date.now().toString(), text, author, timestamp: Date.now() });
    if (comments.length > 10) comments.pop();
    localStorage.setItem(KEYS.COMMENTS, JSON.stringify(comments));
    return comments;
  },

  // Countdown Events
  getEvents: (): CountdownEvent[] => {
    const stored = localStorage.getItem(KEYS.EVENTS);
    return stored ? JSON.parse(stored) : [];
  },
  addEvent: (name: string, date: string, email?: string) => {
    const events = StorageService.getEvents();
    const newEvent = { id: Date.now().toString(), name, date, notificationEmail: email };
    const updated = [...events, newEvent].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    localStorage.setItem(KEYS.EVENTS, JSON.stringify(updated));
    return updated;
  },
  removeEvent: (id: string) => {
    const events = StorageService.getEvents().filter(e => e.id !== id);
    localStorage.setItem(KEYS.EVENTS, JSON.stringify(events));
    return events;
  }
};