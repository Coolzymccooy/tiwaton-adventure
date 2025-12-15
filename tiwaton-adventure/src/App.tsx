import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { View, type FamilyProfile } from './types';
import { StorageService } from './services/storage';

// Pages
import Home from './pages/Home';
import StoriesPage from './pages/Stories';
import DrawingPage from './pages/Drawing';
import ActivitiesPage from './pages/Activities';
import GamesPage from './pages/Games';
import CountdownPage from './pages/Countdown';



const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [profile, setProfile] = useState<FamilyProfile>({ familyCode: '', childName: '' });

  useEffect(() => {
    // Init local profile
    const p = StorageService.getProfile();
    setProfile(p);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case View.HOME:
        return <Home onNavigate={setCurrentView} profile={profile} setProfile={setProfile} />;
      case View.STORIES:
        return <StoriesPage />;
      case View.DRAWING:
        return <DrawingPage />;
      case View.ACTIVITIES:
        return <ActivitiesPage />;
      case View.GAMES:
        return <GamesPage />;
      case View.COUNTDOWN:
        return <CountdownPage />;
      default:
        return <Home onNavigate={setCurrentView} profile={profile} setProfile={setProfile} />;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      onNavigate={setCurrentView}
      childName={profile.childName}
    >
      {renderView()}
    </Layout>
  );
};

export default App;