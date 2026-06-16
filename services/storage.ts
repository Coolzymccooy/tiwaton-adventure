import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db, auth } from './firebase';
import type { Story, Drawing, GameStat, PlanetProgress, MathPlanet, CountdownEvent, FamilyProfile, EnglishProgress, DailyLearningPath } from '../types';

const STORAGE_KEYS = {
  TENANT: 'tiwaton_tenant_id',
  PROFILE: 'tiwaton_profile_id',
  PROFILES: 'tiwaton_profiles_cache',
  LAST_VIEW: 'tiwaton_last_view',
  ENGLISH_PROGRESS: 'tiwaton_english_progress_cache',
  DAILY_PATH: 'tiwaton_daily_learning_path_cache',
  LEARNING_STREAK: 'tiwaton_learning_streak_cache'
};

const safeStorage = {
  getItem: (k: string) => { try { return localStorage.getItem(k); } catch (_e) { return null; } },
  setItem: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch (_e) { } },
  removeItem: (k: string) => { try { localStorage.removeItem(k); } catch (_e) { } }
};

let currentTenantId: string | null = safeStorage.getItem(STORAGE_KEYS.TENANT);
let currentProfileId: string | null = safeStorage.getItem(STORAGE_KEYS.PROFILE);
let cachedProfiles: FamilyProfile[] = JSON.parse(safeStorage.getItem(STORAGE_KEYS.PROFILES) || '[]');

type ChildIndexRecord = {
  tenantId: string;
  childId: string;
  password: string;
  profile?: FamilyProfile;
};

const buildIndexProfile = (profile: FamilyProfile): FamilyProfile => ({
  id: profile.id,
  name: profile.name,
  role: profile.role,
  schoolId: profile.schoolId,
  classId: profile.classId ?? null,
  avatar: profile.avatar,
  mode: profile.mode,
  age: profile.age,
  password: profile.password,
  tenantId: profile.tenantId,
  guardianUids: profile.guardianUids ?? [],
  active: profile.active ?? true
});


const normalizeChildIndexKey = (name: string) =>
  name.trim().toLowerCase().replace(/\s+/g, ' ');

const buildFallbackChildProfile = (name: string, data: ChildIndexRecord): FamilyProfile => ({
  id: data.childId,
  name: name.trim(),
  role: 'STUDENT',
  avatar: '🧒',
  mode: 'KIDS',
  age: 8,
  password: data.password || '123',
  tenantId: data.tenantId,
  guardianUids: [],
  active: true
});

const getLocalEnglishProgress = (childId: string): EnglishProgress[] => {
  try {
    const all = JSON.parse(safeStorage.getItem(STORAGE_KEYS.ENGLISH_PROGRESS) || '{}');
    return Array.isArray(all[childId]) ? all[childId] : [];
  } catch {
    return [];
  }
};

const setLocalEnglishProgress = (childId: string, entries: EnglishProgress[]) => {
  try {
    const all = JSON.parse(safeStorage.getItem(STORAGE_KEYS.ENGLISH_PROGRESS) || '{}');
    all[childId] = entries.slice(0, 100);
    safeStorage.setItem(STORAGE_KEYS.ENGLISH_PROGRESS, JSON.stringify(all));
  } catch {
    // Ignore local cache write limits; Firestore write can still succeed.
  }
};

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const getLocalDailyPaths = (): Record<string, DailyLearningPath> => {
  try {
    return JSON.parse(safeStorage.getItem(STORAGE_KEYS.DAILY_PATH) || '{}');
  } catch {
    return {};
  }
};

const setLocalDailyPaths = (paths: Record<string, DailyLearningPath>) => {
  try {
    safeStorage.setItem(STORAGE_KEYS.DAILY_PATH, JSON.stringify(paths));
  } catch {
    // Ignore cache quota/storage restrictions; the path can be rebuilt on next load.
  }
};

const getDailyPathCacheKey = (childId: string, date = getTodayKey()) => `${childId}:${date}`;

const getLocalLearningStreaks = (): Record<string, { lastCompletedDate: string; count: number }> => {
  try {
    return JSON.parse(safeStorage.getItem(STORAGE_KEYS.LEARNING_STREAK) || '{}');
  } catch {
    return {};
  }
};

const setLocalLearningStreaks = (streaks: Record<string, { lastCompletedDate: string; count: number }>) => {
  try {
    safeStorage.setItem(STORAGE_KEYS.LEARNING_STREAK, JSON.stringify(streaks));
  } catch {
    // Ignore local cache quota/storage restrictions.
  }
};

const getPreviousDateKey = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};

// Strip sensitive fields before writing to localStorage
function stripSensitiveForStorage(profiles: FamilyProfile[]): object[] {
  return profiles.map(p => {
    const { pin, password, recoveryKey, ...safe } = p as any;
    return safe;
  });
}

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
    // Only store non-sensitive fields in localStorage — PINs/passwords stay in memory only
    safeStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(stripSensitiveForStorage(profiles)));
  },

  getProfiles: (): FamilyProfile[] => {
    return cachedProfiles;
  },

  hasProfiles: (): boolean => {
    return cachedProfiles.length > 0;
  },

  clearSession: () => {
    currentTenantId = null;
    currentProfileId = null;
    cachedProfiles = [];
    safeStorage.removeItem(STORAGE_KEYS.TENANT);
    safeStorage.removeItem(STORAGE_KEYS.PROFILE);
    safeStorage.removeItem(STORAGE_KEYS.PROFILES);
    safeStorage.removeItem(STORAGE_KEYS.LAST_VIEW);
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
          const indexRef = doc(db, `children_index/${normalizeChildIndexKey(childData.name)}`);
          setDoc(indexRef, {
          const indexData = {
            tenantId: uid,
            childId: childData.id,
            password: childData.password || '123',
            profile: buildIndexProfile(childData)
          }, { merge: true });
          };
          // Fire-and-forget indexing (won't throw or block the load)
          if (childData.classId) {
            const scopedRef = doc(db, `children_index/${normalizeChildIndexKey(childData.name)}_${childData.classId.toLowerCase()}`);
            setDoc(scopedRef, indexData, { merge: true });
          }
          const plainRef = doc(db, `children_index/${normalizeChildIndexKey(childData.name)}`);
          setDoc(plainRef, indexData, { merge: true });
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

    // Keep children_index in sync when student password or name changes
    if (updated.role === 'STUDENT' && updated.name) {
      try {
        const indexKey = updated.classId
          ? normalizeChildIndexKey(updated.name) + '_' + updated.classId.toLowerCase()
          : normalizeChildIndexKey(updated.name);
        const indexRef = doc(db, `children_index/${indexKey}`);
        await setDoc(indexRef, {
          tenantId,
          childId: updated.id,
          password: updated.password || '123',
          profile: buildIndexProfile(updated)
        }, { merge: true });
        // Also update the plain-name key for backward compat
        const plainRef = doc(db, `children_index/${normalizeChildIndexKey(updated.name)}`);
        await setDoc(plainRef, {
          tenantId,
          childId: updated.id,
          password: updated.password || '123',
          profile: buildIndexProfile(updated)
        }, { merge: true });
      } catch (e) {
        console.warn('Could not sync children_index on update', e);
      }
    }

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
    // Use classId-scoped key to prevent name collisions across tenants
    try {
      const indexRef = doc(db, `children_index/${normalizeChildIndexKey(name)}`);
      await setDoc(indexRef, {
      const indexData = {
        tenantId,
        childId,
        password: password || '123',
        profile: buildIndexProfile(newProfile)
      }, { merge: true });
      };
      // Primary key: name + classId (unique per classroom)
      if (classId) {
        const scopedRef = doc(db, `children_index/${normalizeChildIndexKey(name)}_${classId.toLowerCase()}`);
        await setDoc(scopedRef, indexData, { merge: true });
      }
      // Fallback key: plain name (for backward compat & families without classId)
      const plainRef = doc(db, `children_index/${normalizeChildIndexKey(name)}`);
      await setDoc(plainRef, indexData, { merge: true });
    } catch (e) {
      console.warn("Could not save to children_index", e);
    }

    cachedProfiles.push(newProfile);
    StorageService.setCachedProfiles([...cachedProfiles]);
    return newProfile;
  },

  findChildGlobal: async (name: string, pin: string, classCode?: string): Promise<FamilyProfile | null> => {
    try {
      const normalizedName = normalizeChildIndexKey(name);
      // Try classCode-scoped key first (more specific = fewer collisions)
      let indexSnap;
      if (classCode) {
        const scopedRef = doc(db, `children_index/${normalizedName}_${classCode.trim().toLowerCase()}`);
        indexSnap = await getDoc(scopedRef);
      }
      // Fall back to plain name key
      if (!indexSnap?.exists()) {
        const indexRef = doc(db, `children_index/${normalizedName}`);
        indexSnap = await getDoc(indexRef);
      }
      if (!indexSnap.exists()) return null;

      const data = indexSnap.data() as ChildIndexRecord;
      if ((data.password || '').toLowerCase() !== pin.toLowerCase()) return null;

      const resolvedProfile = data.profile ?? buildFallbackChildProfile(name, data);

      StorageService.setTenantContext(data.tenantId);
      StorageService.setCachedProfiles([resolvedProfile]);
      StorageService.setCurrentProfile(resolvedProfile.id);

      if (!data.profile) {
        console.warn('Child index profile snapshot missing; using fallback profile for', normalizedName);
      }

      return resolvedProfile;
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

  /** Fetch drawings for ALL children under this tenant (for dashboards) */
  getAllDrawings: async (): Promise<Drawing[]> => {
    const tenantId = getTenantId();
    if (!tenantId) return [];

    const allDrawings: Drawing[] = [];
    const childrenSnap = await getDocs(collection(db, `tenants/${tenantId}/children`));

    for (const childDoc of childrenSnap.docs) {
      try {
        const drawingsSnap = await getDocs(collection(db, `tenants/${tenantId}/children/${childDoc.id}/drawings`));
        for (const drawDoc of drawingsSnap.docs) {
          allDrawings.push(drawDoc.data() as Drawing);
        }
      } catch (_e) { /* skip inaccessible */ }
    }

    return allDrawings.sort((a, b) => b.timestamp - a.timestamp);
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

  saveEnglishProgress: async (entry: Omit<EnglishProgress, 'id' | 'childId' | 'childName' | 'createdAt'> & Partial<Pick<EnglishProgress, 'id' | 'childId' | 'childName' | 'createdAt'>>) => {
    const tenantId = getTenantId();
    const profile = StorageService.getCurrentProfile();
    const childId = entry.childId || currentProfileId;
    if (!childId) return;

    const payload: EnglishProgress = {
      id: entry.id || `english-${Date.now()}`,
      childId,
      childName: entry.childName || profile?.name || 'Student',
      mode: entry.mode,
      score: entry.score,
      attempts: entry.attempts,
      accuracy: entry.accuracy,
      wordsPracticed: entry.wordsPracticed || [],
      summary: entry.summary,
      xpEarned: entry.xpEarned,
      coinsEarned: entry.coinsEarned,
      createdAt: entry.createdAt || Date.now()
    };

    const localEntries = [payload, ...getLocalEnglishProgress(childId).filter(item => item.id !== payload.id)]
      .sort((a, b) => b.createdAt - a.createdAt);
    setLocalEnglishProgress(childId, localEntries);

    if (!tenantId) return;

    const docRef = doc(db, `tenants/${tenantId}/children/${childId}/englishProgress/${payload.id}`);
    await setDoc(docRef, { ...payload, ownerChildId: childId, createdByUid: auth.currentUser?.uid || childId });
  },

  getEnglishProgress: async (childId?: string): Promise<EnglishProgress[]> => {
    const tenantId = getTenantId();
    const targetChildId = childId || currentProfileId;
    if (!targetChildId) return [];
    const localEntries = getLocalEnglishProgress(targetChildId);
    if (!tenantId) return localEntries.sort((a, b) => b.createdAt - a.createdAt);

    const colRef = collection(db, `tenants/${tenantId}/children/${targetChildId}/englishProgress`);
    try {
      const snapshot = await getDocs(colRef);
      const remoteEntries = snapshot.docs.map(doc => doc.data() as EnglishProgress);
      const merged = [...remoteEntries, ...localEntries]
        .filter((item, index, all) => all.findIndex(other => other.id === item.id) === index)
        .sort((a, b) => b.createdAt - a.createdAt);
      setLocalEnglishProgress(targetChildId, merged);
      return merged;
    } catch (error) {
      console.warn('Using local English progress cache', error);
      return localEntries.sort((a, b) => b.createdAt - a.createdAt);
    }
  },

  getDailyLearningPath: (childId?: string): DailyLearningPath | null => {
    const targetChildId = childId || currentProfileId;
    if (!targetChildId) return null;
    return getLocalDailyPaths()[getDailyPathCacheKey(targetChildId)] || null;
  },

  saveDailyLearningPath: (path: DailyLearningPath) => {
    const paths = getLocalDailyPaths();
    const streak = getLocalLearningStreaks()[path.childId];
    paths[getDailyPathCacheKey(path.childId, path.date)] = {
      ...path,
      streakDay: path.streakDay || streak?.count || 0,
      updatedAt: Date.now()
    };
    setLocalDailyPaths(paths);
  },

  completeDailyLearningTask: (taskId: string, childId?: string): DailyLearningPath | null => {
    const targetChildId = childId || currentProfileId;
    if (!targetChildId) return null;

    const paths = getLocalDailyPaths();
    const key = getDailyPathCacheKey(targetChildId);
    const path = paths[key];
    if (!path) return null;

    const updatedPath: DailyLearningPath = {
      ...path,
      tasks: path.tasks.map(task => task.id === taskId ? { ...task, completed: true } : task),
      updatedAt: Date.now()
    };

    const allComplete = updatedPath.tasks.every(task => task.completed);
    if (allComplete) {
      const streaks = getLocalLearningStreaks();
      const current = streaks[targetChildId];
      const alreadyCountedToday = current?.lastCompletedDate === updatedPath.date;
      const count = alreadyCountedToday
        ? current.count
        : current?.lastCompletedDate === getPreviousDateKey()
          ? current.count + 1
          : 1;
      streaks[targetChildId] = { lastCompletedDate: updatedPath.date, count };
      updatedPath.streakDay = count;
      setLocalLearningStreaks(streaks);
    }

    paths[key] = updatedPath;
    setLocalDailyPaths(paths);
    return updatedPath;
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

  addEvent: async (name: string, date: string, email?: string, category?: import('../types').EventCategory, emoji?: string): Promise<CountdownEvent[]> => {
    const tenantId = getTenantId();
    if (!tenantId) return [];
    const id = 'event-' + Date.now();
    const newEvent: CountdownEvent = { id, name, date, notificationEmail: email, category, emoji };
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
