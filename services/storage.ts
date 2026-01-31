
import type { Story, Drawing, GameStat, PlanetProgress, MathPlanet, CountdownEvent, FamilyProfile } from '../types';

const KEYS = {
  PROFILES: 'tiwaton_profiles',
  CURRENT_PROFILE_ID: 'tiwaton_current_profile',
  STORIES: 'tiwaton_stories',
  DRAWINGS: 'tiwaton_drawings',
  GAME_STATS: 'tiwaton_stats', 
  COMMENTS: 'tiwaton_comments',
  EVENTS: 'tiwaton_events',
  USAGE: 'tiwaton_usage'
};

export const StorageService = {
  getProfiles: (): FamilyProfile[] => {
    const stored = localStorage.getItem(KEYS.PROFILES);
    return stored ? JSON.parse(stored) : [];
  },
  
  hasProfiles: (): boolean => {
    const profiles = StorageService.getProfiles();
    return profiles.length > 0;
  },

  getCurrentProfile: (): FamilyProfile | null => {
    const profiles = StorageService.getProfiles();
    const currentId = localStorage.getItem(KEYS.CURRENT_PROFILE_ID);
    return profiles.find(p => p.id === currentId) || null;
  },

  setCurrentProfile: (id: string) => {
    localStorage.setItem(KEYS.CURRENT_PROFILE_ID, id);
  },

  updateProfile: (updated: FamilyProfile) => {
    const profiles = StorageService.getProfiles();
    const index = profiles.findIndex(p => p.id === updated.id);
    if (index !== -1) {
      profiles[index] = updated;
      localStorage.setItem(KEYS.PROFILES, JSON.stringify(profiles));
    }
  },

  createParentProfile: (name: string, email: string, pin: string) => {
      const profiles = StorageService.getProfiles();
      const parent: FamilyProfile = { 
          id: 'admin', 
          childName: name, 
          avatar: '🛡️', 
          mode: 'PARENT', 
          age: 99, 
          email,
          pin,
          recoveryKey: `TIWA-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
      };
      profiles.unshift(parent);
      localStorage.setItem(KEYS.PROFILES, JSON.stringify(profiles));
      return parent;
  },

  createChildProfile: (name: string, age: number, password?: string) => {
    const profiles = StorageService.getProfiles();
    const newProfile: FamilyProfile = {
        id: Date.now().toString(),
        childName: name,
        age: age,
        mode: age >= 9 ? 'STUDIO' : 'KIDS',
        avatar: ['🦁','🦄','🚀','🦖','🐼','🐨', '🐵', '🦊'][Math.floor(Math.random()*8)],
        password: password || '123' 
    };
    profiles.push(newProfile);
    localStorage.setItem(KEYS.PROFILES, JSON.stringify(profiles));
    return newProfile;
  },

  getGameStats: (): GameStat => {
    const stored = localStorage.getItem(KEYS.GAME_STATS);
    const PLANETS: MathPlanet[] = ['Numbers', 'Operations', 'Fractions', 'Time', 'Money', 'Data'];
    const defaultPlanetProgress: PlanetProgress[] = PLANETS.map(p => ({
      planet: p,
      stars: 0,
      unlocked: p === 'Numbers' || p === 'Operations',
      highScore: 0
    }));

    const defaultStats: GameStat = { 
      xp: 0, level: 1, badges: [], coins: 0,
      quizProgress: [
        { category: 'Bible', level: 1, unlocked: true },
        { category: 'Music', level: 1, unlocked: true },
        { category: 'Football', level: 1, unlocked: true }
      ],
      mathLevel: 1,
      mathPlanetProgress: defaultPlanetProgress,
      wordQuestProgress: { level: 1, unlocked: true }
    };
    
    if (!stored) return defaultStats;
    const parsed = JSON.parse(stored);
    return { ...defaultStats, ...parsed };
  },
  
  saveGameStats: (stats: GameStat) => {
    localStorage.setItem(KEYS.GAME_STATS, JSON.stringify(stats));
  },

  trackUsage: (profileId: string, view: string, seconds: number) => {
    const raw = localStorage.getItem(KEYS.USAGE);
    const data = raw ? JSON.parse(raw) : {};
    if (!data[profileId]) data[profileId] = {};
    data[profileId][view] = (data[profileId][view] || 0) + seconds;
    localStorage.setItem(KEYS.USAGE, JSON.stringify(data));
  },

  getFamilyUsage: () => JSON.parse(localStorage.getItem(KEYS.USAGE) || '{}'),

  getDrawings: async () => JSON.parse(localStorage.getItem(KEYS.DRAWINGS) || '[]'),
  saveDrawing: async (d: Drawing) => {
    const list = await StorageService.getDrawings();
    list.unshift(d);
    localStorage.setItem(KEYS.DRAWINGS, JSON.stringify(list.slice(0, 100)));
  },

  getStories: async () => JSON.parse(localStorage.getItem(KEYS.STORIES) || '[]'),
  addStory: async (s: Story) => {
    const list = await StorageService.getStories();
    list.unshift(s);
    localStorage.setItem(KEYS.STORIES, JSON.stringify(list));
  },

  getComments: () => JSON.parse(localStorage.getItem(KEYS.COMMENTS) || '[]'),
  addComment: (text: string, author: string) => {
    const list = StorageService.getComments();
    list.unshift({ id: Date.now().toString(), text, author, timestamp: Date.now() });
    localStorage.setItem(KEYS.COMMENTS, JSON.stringify(list));
  },

  getEvents: () => JSON.parse(localStorage.getItem(KEYS.EVENTS) || '[]'),
  addEvent: (name: string, date: string, email?: string) => {
    const list = [...StorageService.getEvents(), { id: Date.now().toString(), name, date, notificationEmail: email }];
    localStorage.setItem(KEYS.EVENTS, JSON.stringify(list));
    return list;
  },
  removeEvent: (id: string) => {
    const list = StorageService.getEvents().filter(e => e.id !== id);
    localStorage.setItem(KEYS.EVENTS, JSON.stringify(list));
    return list;
  }
};
