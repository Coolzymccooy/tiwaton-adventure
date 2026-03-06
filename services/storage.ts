import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db, auth } from './firebase';
import type { Story, Drawing, GameStat, PlanetProgress, MathPlanet, CountdownEvent, FamilyProfile } from '../types';

const STORAGE_KEYS = {
  TENANT: 'tiwaton_tenant_id',
  PROFILE: 'tiwaton_profile_id',
  PROFILES: 'tiwaton_profiles_cache',
  LAST_VIEW: 'tiwaton_last_view'
};

const safeStorage = {
  getItem: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  setItem: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { } },
  removeItem: (k: string) => { try { localStorage.removeItem(k); } catch { } }
};

let currentTenantId: string | null = safeStorage.getItem(STORAGE_KEYS.TENANT);
let currentProfileId: string | null = safeStorage.getItem(STORAGE_KEYS.PROFILE);
let cachedProfiles: FamilyProfile[] = JSON.parse(safeStorage.getItem(STORAGE_KEYS.PROFILES) || '[]');

// Helper to ensure auth/tenant context
const getTenantId = () => {
  if (currentTenantId) return currentTenantId;
  return null;
};

export const StorageService = {
  // Initialization & Auth linking
  setTenantContext: (tenantId: string) => {
    currentTenantId = tenantId;
    safeStorage.setItem(STORAGE_KEYS.TENANT, tenantId);
  },

  setCurrentProfile: (id: string) => {
    currentProfileId = id;
    if (id) safeStorage.setItem(STORAGE_KEYS.PROFILE, id);
    else safeStorage.removeItem(STORAGE_KEYS.PROFILE);
  },

  getCurrentProfile: (): FamilyProfile | null => {
    return cachedProfiles.find(p => p.id === currentProfileId) || null;
  },

  setCachedProfiles: (profiles: FamilyProfile[]) => {
    cachedProfiles = profiles;
    safeStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
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

      // Auto-backfill old children into the new global login index
      childrenSnap.docs.forEach(d => {
        const childData = d.data() as FamilyProfile;
        try {
          // Fire-and-forget indexing (won't throw or block the load)
          const indexRef = doc(db, `children_index/${childData.name.toLowerCase()}`);
          setDoc(indexRef, {
            tenantId: uid,
            childId: childData.id,
            password: childData.password || '123'
          }, { merge: true });
        } catch (e) {
          console.warn("Could not index child", childData.name, e);
        }
      });

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

    // Save lightweight index for global sign in
    try {
      const indexRef = doc(db, `children_index/${name.toLowerCase()}`);
      await setDoc(indexRef, {
        tenantId,
        childId,
        password: password || '123'
      }, { merge: true });
    } catch (e) {
      console.warn("Could not save to children_index", e);
    }

    cachedProfiles.push(newProfile);
    StorageService.setCachedProfiles([...cachedProfiles]);
    return newProfile;
  },

  findChildGlobal: async (name: string, pin: string): Promise<FamilyProfile | null> => {
    try {
      const indexRef = doc(db, `children_index/${name.toLowerCase()}`);
      const indexSnap = await getDoc(indexRef);
      if (indexSnap.exists()) {
        const data = indexSnap.data();
        if (data.password.toLowerCase() === pin.toLowerCase()) {
          const profileRef = doc(db, `tenants/${data.tenantId}/children/${data.childId}`);
          const profileSnap = await getDoc(profileRef);
          if (profileSnap.exists()) {
            const p = profileSnap.data() as FamilyProfile;
            StorageService.setTenantContext(data.tenantId);
            StorageService.setCachedProfiles([p]); // Cache this profile locally
            return p;
          }
        }
      }
      return null;
    } catch (e) {
      console.error("Global child fetch error", e);
      return null;
    }
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

  deleteStory: async (storyId: string) => {
    const tenantId = getTenantId();
    if (!tenantId || !currentProfileId) return;
    const { deleteDoc } = await import('firebase/firestore');
    const docRef = doc(db, `tenants/${tenantId}/children/${currentProfileId}/stories/${storyId}`);
    await deleteDoc(docRef);
  },

  getComments: async () => {
    return [];
  },

  addComment: async (text: string, author: string) => {
    // Stub
  },

  getEvents: async (): Promise<CountdownEvent[]> => {
    const tenantId = getTenantId();
    if (!tenantId) return [];
    const colRef = collection(db, `tenants/${tenantId}/events`);
    const snap = await getDocs(colRef);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as CountdownEvent));
  },

  addEvent: async (name: string, date: string, email?: string): Promise<CountdownEvent[]> => {
    const tenantId = getTenantId();
    if (!tenantId) return [];
    const id = 'event-' + Date.now();
    const newEvent: CountdownEvent = { id, name, date, notificationEmail: email };
    const docRef = doc(db, `tenants/${tenantId}/events/${id}`);
    await setDoc(docRef, newEvent);
    return await StorageService.getEvents();
  },

  removeEvent: async (id: string): Promise<CountdownEvent[]> => {
    const tenantId = getTenantId();
    if (!tenantId) return [];
    const docRef = doc(db, `tenants/${tenantId}/events/${id}`);
    // Using simple delete from firestore
    const { deleteDoc } = await import('firebase/firestore');
    await deleteDoc(docRef);
    return await StorageService.getEvents();
  },

  setLastView: (view: string) => {
    safeStorage.setItem(STORAGE_KEYS.LAST_VIEW, view);
  },
  getLastView: () => safeStorage.getItem(STORAGE_KEYS.LAST_VIEW),
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
