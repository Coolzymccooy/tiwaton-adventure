
<<<<<<< codex/fix-dark-screen-on-mobile-app-ceqomh
import React, { useState, useEffect, useMemo, useRef } from 'react';
=======

import React, { useState, useEffect, useMemo, useRef } from 'react';

import React, { useState, useEffect, useMemo } from 'react';

>>>>>>> master
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

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.LANDING);
  const [profile, setProfile] = useState<FamilyProfile | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [loginInitialView, setLoginInitialView] = useState<ViewMode>('SIGN_IN_ENTRY');
  const [sessionReady, setSessionReady] = useState(false);
<<<<<<< codex/fix-dark-screen-on-mobile-app-ceqomh
=======

>>>>>>> master
  const authEventVersion = useRef(0);

  const resolveView = (candidate?: string | null): View => {
    if (candidate && Object.values(View).includes(candidate as View)) {
      return candidate as View;
    }
    return View.HOME;
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
<<<<<<< codex/fix-dark-screen-on-mobile-app-ceqomh
    const mountedRef = { current: true };
    let receivedAuthEvent = false;

    const fallbackTimer = window.setTimeout(() => {
      if (!mountedRef.current || receivedAuthEvent) return;
=======
    let mounted = true;
    let receivedAuthEvent = false;

    const fallbackTimer = window.setTimeout(() => {
      if (!mounted || receivedAuthEvent) return;
>>>>>>> master
      setSessionReady(true);
      setCurrentView(View.LANDING);
    }, 4000);

<<<<<<< codex/fix-dark-screen-on-mobile-app-ceqomh
    const handleAuthState = async (user: User | null) => {
=======
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
>>>>>>> master
      const eventId = ++authEventVersion.current;
      receivedAuthEvent = true;
      clearTimeout(fallbackTimer);

<<<<<<< codex/fix-dark-screen-on-mobile-app-ceqomh
      if (!mountedRef.current) return;
=======
      if (!mounted) return;
>>>>>>> master

      if (!user) {
        StorageService.clearSession();
        setProfile(null);
        setIsAdminMode(false);
        setCurrentView(View.LANDING);
        setSessionReady(true);
        return;
      }

      try {
<<<<<<< codex/fix-dark-screen-on-mobile-app-ceqomh
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
=======
        const profiles = await StorageService.syncFromFirestore(user.uid);
        if (!mounted || eventId !== authEventVersion.current) return;

    const initSession = () => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (!user) {
          StorageService.clearSession();
          setProfile(null);
          setIsAdminMode(false);
          setCurrentView(View.LANDING);
          setSessionReady(true);
          return;
        }

        const profiles = await StorageService.syncFromFirestore(user.uid);

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
        } else {
          setProfile(null);
          setIsAdminMode(false);
          setCurrentView(View.LOGIN);
          setLoginInitialView('USER_GRID');
>>>>>>> master
        }

      } catch (error) {
        console.error('Session bootstrap failed', error);
        if (!mounted || eventId !== authEventVersion.current) return;
        setProfile(null);
        setIsAdminMode(false);
        setCurrentView(View.LANDING);
      } finally {
        if (mounted && eventId === authEventVersion.current) {
          setSessionReady(true);
        }
      }
    });

    return () => {
      mounted = false;
      clearTimeout(fallbackTimer);
      authEventVersion.current += 1;

      setSessionReady(true);
      });

      return unsubscribe;
    };

    const unsubscribe = initSession();
    return () => {

      unsubscribe();
    };
<<<<<<< codex/fix-dark-screen-on-mobile-app-ceqomh

    const unsubscribe = auth.onAuthStateChanged(handleAuthState);

    return () => {
      mountedRef.current = false;
      clearTimeout(fallbackTimer);
      authEventVersion.current += 1;
      unsubscribe();
    };
=======
>>>>>>> master
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
    StorageService.clearSession();

    try {
      await auth.signOut();
    } catch (error) {
      console.error('Sign out error', error);
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

  const isMobileLikeDevice = useMemo(() => {
    if (typeof window === 'undefined') return false;

    const width = window.innerWidth || document.documentElement.clientWidth || 0;
    const coarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
<<<<<<< codex/fix-dark-screen-on-mobile-app-ceqomh
=======

>>>>>>> master
    const ua = navigator.userAgent || '';
    const mobileUA = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);

    return width <= 1024 || coarsePointer || reducedMotion || mobileUA;
<<<<<<< codex/fix-dark-screen-on-mobile-app-ceqomh
=======

    return width <= 900 || coarsePointer || reducedMotion;
>>>>>>> master
  }, []);

  const renderView = () => {
    if (currentView === View.LANDING) {
      return <Landing onAction={handleLandingAction} activeProfile={profile} disableHeavyEffects={isMobileLikeDevice} sessionReady={sessionReady} />;
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
