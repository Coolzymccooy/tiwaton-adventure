
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { View } from './types';
import type { FamilyProfile } from './types';
import { StorageService } from './services/storage';
import { I18nProvider } from './i18n/I18nProvider';
import { SyncService } from './services/sync';

// Pages
import Home from './pages/Home';
import StoriesPage from './pages/Stories';
import DrawingPage from './pages/Drawing';
import ActivitiesPage from './pages/Activities';
import GamesPage from './pages/Games';
import CountdownPage from './pages/Countdown';
import Login, { ViewMode } from './pages/Login';
import Landing from './pages/Landing';
import ParentDashboard from './pages/ParentDashboard';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.LANDING);
  const [profile, setProfile] = useState<FamilyProfile | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [loginInitialView, setLoginInitialView] = useState<ViewMode>('SIGN_IN_ENTRY');

  const resolveView = (candidate?: string | null): View => {
    if (candidate && Object.values(View).includes(candidate as View)) {
      return candidate as View;
    }
    return View.HOME;
  };

  useEffect(() => {
    const hasProfiles = StorageService.hasProfiles();
    if (!hasProfiles) {
      setCurrentView(View.LANDING);
    } else {
        const active = StorageService.getCurrentProfile();
        if (active) {
            setProfile(active);
            const maybeView = StorageService.getLastView();
            setCurrentView(resolveView(maybeView));
            if (active.mode === 'PARENT') setIsAdminMode(true);
        } else {
            setCurrentView(View.LANDING);
        }
    }
  }, []);

  useEffect(() => {
    if (!profile) return;
    StorageService.setLastView(currentView);
    const snapshot = StorageService.buildSnapshot(profile.id, currentView);
    SyncService.sendSnapshot(snapshot);
  }, [profile, currentView]);

  const handleLogin = async (p: FamilyProfile) => {
      StorageService.setCurrentProfile(p.id);
      const snapshot = await SyncService.fetchSnapshot(p.id);
      if (snapshot) {
        StorageService.applySnapshot(snapshot);
      }
      const active = StorageService.getCurrentProfile() || p;
      setProfile(active);
      setIsAdminMode(active.mode === 'PARENT');
      setCurrentView(resolveView(snapshot?.lastView));
  };

  const handleLogout = () => {
      setProfile(null);
      setIsAdminMode(false);
      StorageService.setCurrentProfile('');
      setCurrentView(View.LANDING);
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

  const renderView = () => {
    if (currentView === View.LANDING) {
        return <Landing onAction={handleLandingAction} activeProfile={profile} />;
    }

    if (currentView === View.LOGIN) {
        return <Login 
          onLogin={handleLogin} 
          initialViewMode={loginInitialView} 
          onBackToLanding={() => setCurrentView(View.LANDING)}
        />;
    }

    if (!profile) return <Login onLogin={handleLogin} initialViewMode={loginInitialView} onBackToLanding={() => setCurrentView(View.LANDING)} />; 

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
      case View.PARENT_DASHBOARD:
        return <ParentDashboard onBack={() => setCurrentView(View.HOME)} />;
      case View.STORIES:
        return <StoriesPage />;
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
        childName={profile?.childName || ''}
        onLogout={handleLogout}
      >
        {renderView()}
      </Layout>
    </I18nProvider>
  );
};

export default App;
