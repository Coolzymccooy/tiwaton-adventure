import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db, auth } from './firebase';
import type { Story, Drawing, GameStat, PlanetProgress, MathPlanet, CountdownEvent, FamilyProfile } from '../types';

const STORAGE_KEYS = {
  TENANT: 'tiwaton_tenant_id',
  PROFILE: 'tiwaton_profile_id',
  PROFILES: 'tiwaton_profiles_cache',
  LAST_VIEW: 'tiwaton_last_view'
};

let currentTenantId: string | null = localStorage.getItem(STORAGE_KEYS.TENANT);
let currentProfileId: string | null = localStorage.getItem(STORAGE_KEYS.PROFILE);
let cachedProfiles: FamilyProfile[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '[]');

// Helper to ensure auth/tenant context
const getTenantId = () => {
  if (currentTenantId) return currentTenantId;
  return null;
};

export const StorageService = {
  // Initialization & Auth linking
  setTenantContext: (tenantId: string) => {
    currentTenantId = tenantId;
    localStorage.setItem(STORAGE_KEYS.TENANT, tenantId);
  },

  setCurrentProfile: (id: string) => {
    currentProfileId = id;
    if (id) localStorage.setItem(STORAGE_KEYS.PROFILE, id);
    else localStorage.removeItem(STORAGE_KEYS.PROFILE);
  },

  getCurrentProfile: (): FamilyProfile | null => {
    return cachedProfiles.find(p => p.id === currentProfileId) || null;
  },

  setCachedProfiles: (profiles: FamilyProfile[]) => {
    cachedProfiles = profiles;
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
  },

  getProfiles: (): FamilyProfile[] => {
    return cachedProfiles;
  },

  hasProfiles: (): boolean => {
    return cachedProfiles.length > 0;
  },

  syncFromFirestore: async (uid: string) => {
    try {
      StorageService.setTenantContext(uid);
      const membersSnap = await getDocs(collection(db, `tenants/${uid}/members`));
      const childrenSnap = await getDocs(collection(db, `tenants/${uid}/children`));

      const loadedProfiles: FamilyProfile[] = [
        ...membersSnap.docs.map(d => d.data() as FamilyProfile),
        ...childrenSnap.docs.map(d => d.data() as FamilyProfile)
      ];

      StorageService.setCachedProfiles(loadedProfiles);
      return loadedProfiles;
    } catch (err) {
      console.error("Sync storage err", err);
      return [];
    }
  },

  updateProfile: async (updated: FamilyProfile) => {
    const tenantId = getTenantId();
    if (!tenantId) return;

    const isMember = updated.role !== 'STUDENT';
    const collectionName = isMember ? 'members' : 'children';

    const docRef = doc(db, `tenants/${tenantId}/${collectionName}/${updated.id}`);
    await setDoc(docRef, updated, { merge: true });

    const index = cachedProfiles.findIndex(p => p.id === updated.id);
    if (index !== -1) {
      cachedProfiles[index] = updated;
      StorageService.setCachedProfiles([...cachedProfiles]);
    }
  },

  createParentProfile: async (uid: string, name: string, email: string, pin: string) => {
    const parent: FamilyProfile = {
      id: uid, // Use Firebase Auth UID
      name: name,
      role: 'PARENT',
      avatar: '🛡️',
      mode: 'PARENT',
      age: 99,
      email,
      pin,
      recoveryKey: Math.random().toString(36).substring(2, 10).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
      active: true,
    };

    StorageService.setTenantContext(uid);
    const docRef = doc(db, `tenants/${uid}/members/${uid}`);
    await setDoc(docRef, parent);

    cachedProfiles.unshift(parent);
    StorageService.setCachedProfiles([...cachedProfiles]);
    return parent;
  },

  createTeacherProfile: async (uid: string, name: string, email: string, pin: string) => {
    const schoolId = 'SCH-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const classId = 'CLS-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    const teacher: FamilyProfile = {
      id: uid, // Use Firebase Auth UID
      name: name,
      role: 'TEACHER',
      schoolId,
      classId,
      avatar: '👨‍🏫',
      mode: 'TEACHER',
      age: 99,
      email,
      pin,
      recoveryKey: Math.random().toString(36).substring(2, 10).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
      active: true,
    };

    StorageService.setTenantContext(uid);
    const docRef = doc(db, `tenants/${uid}/members/${uid}`);
    await setDoc(docRef, teacher);

    cachedProfiles.unshift(teacher);
    StorageService.setCachedProfiles([...cachedProfiles]);
    return teacher;
  },

  createChildProfile: async (name: string, age: number, password?: string, classId?: string, schoolId?: string) => {
    const tenantId = getTenantId();
    if (!tenantId) throw new Error("No tenant context");

    const childId = 'child-' + Date.now().toString();
    const newProfile: FamilyProfile = {
      id: childId,
      name: name,
      role: 'STUDENT',
      schoolId: schoolId || currentTenantId || '',
      classId: classId || null,
      age: age,
      mode: age >= 9 ? 'STUDIO' : 'KIDS',
      avatar: ['🦁', '🦄', '🚀', '🦖', '🐼', '🐨', '🐵', '🦊'][Math.floor(Math.random() * 8)],
      password: password || '123',
      tenantId: tenantId,
      guardianUids: [],
      active: true
    };

    const docRef = doc(db, `tenants/${tenantId}/children/${childId}`);
    await setDoc(docRef, newProfile);

    cachedProfiles.push(newProfile);
    StorageService.setCachedProfiles([...cachedProfiles]);
    return newProfile;
  },

  getGameStats: (): GameStat => {
    const profile = StorageService.getCurrentProfile();
    return profile?.gameStats || getDefaultStats();
  },

  saveGameStats: async (stats: GameStat) => {
    const tenantId = getTenantId();
    const profile = StorageService.getCurrentProfile();
    if (!tenantId || !profile) return;

    // Update local cache first
    profile.gameStats = stats;
    StorageService.setCachedProfiles([...cachedProfiles]);

    // Update Firestore
    const collectionName = profile.role !== 'STUDENT' ? 'members' : 'children';
    const docRef = doc(db, `tenants/${tenantId}/${collectionName}/${profile.id}`);
    await updateDoc(docRef, { gameStats: stats });
  },

  trackUsage: async (profileId: string, view: string, seconds: number) => {
    // telemetry...
  },

  getFamilyUsage: async () => {
    return {};
  },

  getDrawings: async (): Promise<Drawing[]> => {
    const tenantId = getTenantId();
    if (!tenantId || !currentProfileId) return [];

    const colRef = collection(db, `tenants/${tenantId}/children/${currentProfileId}/drawings`);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(doc => doc.data() as Drawing).sort((a, b) => b.timestamp - a.timestamp);
  },

  saveDrawing: async (d: Drawing) => {
    const tenantId = getTenantId();
    if (!tenantId || !currentProfileId) return;

    const docRef = doc(db, `tenants/${tenantId}/children/${currentProfileId}/drawings/${d.id}`);
    const payload = { ...d, ownerChildId: currentProfileId, createdByUid: auth.currentUser?.uid || currentProfileId };
    await setDoc(docRef, payload);
  },

  getStories: async (): Promise<Story[]> => {
    const tenantId = getTenantId();
    if (!tenantId || !currentProfileId) return [];

    const colRef = collection(db, `tenants/${tenantId}/children/${currentProfileId}/stories`);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(doc => doc.data() as Story);
  },

  addStory: async (s: Story) => {
    const tenantId = getTenantId();
    if (!tenantId || !currentProfileId) return;

    const docRef = doc(db, `tenants/${tenantId}/children/${currentProfileId}/stories/${s.id}`);
    const payload = { ...s, ownerChildId: currentProfileId, createdByUid: auth.currentUser?.uid || currentProfileId };
    await setDoc(docRef, payload);
  },

  getComments: async () => {
    return [];
  },

  addComment: async (text: string, author: string) => {
    // Stub
  },

  getEvents: async (): Promise<CountdownEvent[]> => {
    return [];
  },

  addEvent: async (name: string, date: string, email?: string) => {
    return [];
  },

  removeEvent: async (id: string) => {
    return [];
  },

  setLastView: (view: string) => {
    localStorage.setItem(STORAGE_KEYS.LAST_VIEW, view);
  },
  getLastView: () => localStorage.getItem(STORAGE_KEYS.LAST_VIEW),
};

function getDefaultStats(): GameStat {
  const PLANETS: MathPlanet[] = ['Numbers', 'Operations', 'Fractions', 'Time', 'Money', 'Data'];
  const defaultPlanetProgress: PlanetProgress[] = PLANETS.map(p => ({
    planet: p,
    stars: 0,
    unlocked: p === 'Numbers' || p === 'Operations',
    highScore: 0
  }));

  return {
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
}
