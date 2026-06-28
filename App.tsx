import React, { useState, useEffect, useMemo, useRef } from 'react';
import Layout from './components/Layout';
import { View } from './types';
import type { FamilyProfile } from './types';
import { StorageService } from './services/storage';
import { I18nProvider } from './i18n/I18nProvider';
import { auth } from './services/firebase';
import type { User } from 'firebase/auth';

// Pages
import Home from './pages/Home';
import StoriesPage from './pages/Stories';
import DrawingPage from './pages/Drawing';
import ActivitiesPage from './pages/Activities';
import GamesPage from './pages/Games';
import CountdownPage from './pages/Countdown';
import Login, { ViewMode } from './pages/Login';
import Landing from './pages/Landing';
import TeacherDashboard from './pages/TeacherDashboard';
import ParentDashboard from './pages/ParentDashboard';

const EXPLICIT_LOGOUT_MARKER = 'tiwaton_explicit_logout';

const App: React.FC = () => {
  const safeStorage = {
    getItem: (key: string) => {
      try { return window.localStorage.getItem(key); } catch { return null; }
    },
    setItem: (key: string, value: string) => {
      try { window.localStorage.setItem(key, value); } catch { }
    },
    removeItem: (key: string) => {
      try { window.localStorage.removeItem(key); } catch { }
    }
  };

  const [currentView, setCurrentView] = useState<View>(View.LANDING);
  const [profile, setProfile] = useState<FamilyProfile | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [loginInitialView, setLoginInitialView] = useState<ViewMode>('SIGN_IN_ENTRY');
  // sessionReady starts as TRUE so we show the landing page instantly.
  // Firebase auth resolves in the background and may redirect the user silently.
  const [sessionReady, setSessionReady] = useState(true);
  const authEventVersion = useRef(0);

  const resolveView = (candidate?: string | null): View => {
    if (candidate && Object.values(View).includes(candidate as View)) {
      return candidate as View;
    }
    return View.HOME;
  };


  const restoreCachedLocalSession = () => {
    const cachedActive = StorageService.getCurrentProfile();
    if (!cachedActive) return false;

    setProfile(cachedActive);
    setIsAdminMode(cachedActive.role === 'PARENT' || cachedActive.role === 'TEACHER');
    setCurrentView(resolveView(StorageService.getLastView()));
    return true;
  };

  const bootstrapAuthenticatedSession = async (user: User, eventId: number, mountedRef: { current: boolean }) => {
    const profiles = await StorageService.syncFromFirestore(user.uid);
    if (!mountedRef.current || eventId !== authEventVersion.current) return;

    if (profiles.length === 0) {
      setProfile(null);
      setIsAdminMode(false);
      setCurrentView(View.LANDING);
      setSessionReady(true);
      return;
    }

    const active = StorageService.getCurrentProfile();
    if (active) {
      setProfile(active);
      setCurrentView(resolveView(StorageService.getLastView()));
      setIsAdminMode(active.role === 'PARENT' || active.role === 'TEACHER');
      return;
    }

    setProfile(null);
    setIsAdminMode(false);
    setCurrentView(View.LOGIN);
    setLoginInitialView('USER_GRID');
  };

  useEffect(() => {
    const mountedRef = { current: true };

    // If local cache says we have profiles, resolve immediately without waiting
    // for Firebase - the user sees their hub in < 100ms.
    const cachedProfile = StorageService.getCurrentProfile();
    if (cachedProfile) {
      setProfile(cachedProfile);
      setIsAdminMode(cachedProfile.role === 'PARENT' || cachedProfile.role === 'TEACHER');
      setCurrentView(resolveView(StorageService.getLastView()));
      // Still subscribe to auth to keep session in sync, but don't block render
    }

    const handleAuthState = async (user: User | null) => {
      const eventId = ++authEventVersion.current;

      if (!mountedRef.current) return;

      if (!user) {
        const explicitLogout = safeStorage.getItem(EXPLICIT_LOGOUT_MARKER) === '1';

        if (explicitLogout) {
          safeStorage.removeItem(EXPLICIT_LOGOUT_MARKER);
          StorageService.clearSession();
          setProfile(null);
          setIsAdminMode(false);
          setCurrentView(View.LANDING);
          setSessionReady(true);
          return;
        }

        const resumed = restoreCachedLocalSession();
        if (!resumed) {
          StorageService.clearSession();
          setProfile(null);
          setIsAdminMode(false);
          setCurrentView(View.LANDING);
        }
        setSessionReady(true);
        return;
      }

      try {
        await bootstrapAuthenticatedSession(user, eventId, mountedRef);
      } catch (error) {
        console.error('Session bootstrap failed', error);
        if (!mountedRef.current || eventId !== authEventVersion.current) return;
        setProfile(null);
        setIsAdminMode(false);
        setCurrentView(View.LANDING);
      } finally {
        if (mountedRef.current && eventId === authEventVersion.current) {
          setSessionReady(true);
        }
      }
    };

    const unsubscribe = auth.onAuthStateChanged(handleAuthState);
    return () => {
      mountedRef.current = false;
      authEventVersion.current += 1;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!profile) return;
    StorageService.setLastView(currentView);
  }, [profile, currentView]);

  const handleLogin = async (p: FamilyProfile) => {
    StorageService.setCurrentProfile(p.id);
    const active = StorageService.getCurrentProfile() || p;
    setProfile(active);
    setIsAdminMode(active.mode === 'PARENT' || active.mode === 'TEACHER');
    setCurrentView(resolveView(StorageService.getLastView()));
  };

  const handleLogout = async () => {
    setProfile(null);
    setIsAdminMode(false);
    safeStorage.setItem(EXPLICIT_LOGOUT_MARKER, '1');
    StorageService.clearSession();
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Sign out error', error);
      safeStorage.removeItem(EXPLICIT_LOGOUT_MARKER);
    }
    setCurrentView(View.LANDING);
    setSessionReady(true);
  };

  const handleLandingAction = (action: 'LOGIN' | 'SETUP' | 'RESET' | 'CONTINUE') => {
    if (action === 'CONTINUE' && profile) {
      setCurrentView(View.HOME);
      return;
    }
    if (action === 'LOGIN') {
      setLoginInitialView('SIGN_IN_ENTRY');
    } else if (action === 'SETUP') {
      setLoginInitialView('SETUP_ADMIN');
    } else if (action === 'RESET') {
      setLoginInitialView('FORGOT_FLOW');
    }
    setCurrentView(View.LOGIN);
  };

  // Detect mobile/low-power devices to disable heavy animations
  const isMobileLikeDevice = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const width = window.innerWidth || document.documentElement.clientWidth || 0;
    const coarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const ua = navigator.userAgent || '';
    const mobileUA = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
    return width <= 1024 || coarsePointer || reducedMotion || mobileUA;
  }, []);

  const renderView = () => {
    if (currentView === View.LANDING) {
      return <Landing
        onAction={handleLandingAction}
        activeProfile={profile}
        disableHeavyEffects={isMobileLikeDevice}
        sessionReady={sessionReady}
      />;
    }

    if (currentView === View.LOGIN) {
      return <Login
        onLogin={handleLogin}
        initialViewMode={loginInitialView}
        onBackToLanding={() => setCurrentView(View.LANDING)}
        compactMode={isMobileLikeDevice}
      />;
    }

    if (!profile) return <Login onLogin={handleLogin} initialViewMode={loginInitialView} onBackToLanding={() => setCurrentView(View.LANDING)} compactMode={isMobileLikeDevice} />;

    switch (currentView) {
      case View.HOME:
        return <Home
          onNavigate={setCurrentView}
          profile={profile}
          setProfile={setProfile}
          onLogout={handleLogout}
          isAdminMode={isAdminMode}
          setIsAdminMode={setIsAdminMode}
        />;
      case View.TEACHER_DASHBOARD:
        return <TeacherDashboard onBack={() => setCurrentView(View.HOME)} />;
      case View.PARENT_DASHBOARD:
        return <ParentDashboard onBack={() => setCurrentView(View.HOME)} />;
      case View.STORIES:
        return <StoriesPage onNavigate={setCurrentView} />;
      case View.DRAWING:
        return <DrawingPage onNavigate={setCurrentView} />;
      case View.ACTIVITIES:
        return <ActivitiesPage onNavigate={setCurrentView} />;
      case View.GAMES:
        return <GamesPage />;
      case View.COUNTDOWN:
        return <CountdownPage />;
      default:
        return <Home
          onNavigate={setCurrentView}
          profile={profile}
          setProfile={setProfile}
          onLogout={handleLogout}
          isAdminMode={isAdminMode}
          setIsAdminMode={setIsAdminMode}
        />;
    }
  };

  return (
    <I18nProvider>
      <Layout
        currentView={currentView}
        onNavigate={setCurrentView}
        name={profile?.name || ''}
        onLogout={handleLogout}
      >
        {renderView()}
      </Layout>
    </I18nProvider>
  );
};

export default App;
