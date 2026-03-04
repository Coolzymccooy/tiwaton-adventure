
import React, { useEffect, useState } from 'react';
import { View } from '../types';
import { BookOpen, Palette, BrainCircuit, Gamepad2, CalendarClock, Home, Volume2, VolumeX } from 'lucide-react';
import { StorageService } from '../services/storage';
import { AudioService } from '../services/audio';
import { useI18n } from '../i18n/I18nProvider';
import { SyncService } from '../services/sync';
import { getLogoUrl } from './logo';

interface LayoutProps {
  currentView: View;
  onNavigate: (view: View) => void;
  children: React.ReactNode;
  name: string;
  onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ currentView, onNavigate, children, name, onLogout }) => {
  // Usage Tracking Effect
  useEffect(() => {
    const profile = StorageService.getCurrentProfile();
    if (!profile || currentView === View.PARENT_DASHBOARD || currentView === View.TEACHER_DASHBOARD || currentView === View.LOGIN || currentView === View.LANDING) return;

    const interval = setInterval(() => {
      StorageService.trackUsage(profile.id, currentView, 10);
      SyncService.logTelemetry({ profileId: profile.id, view: currentView, event: 'view-heartbeat', durationSeconds: 10 });
    }, 10000);

    return () => clearInterval(interval);
  }, [currentView]);

  const navItems = [
    { view: View.HOME, icon: Home, label: 'HUB', tooltip: 'Return to Hub' },
    { view: View.STORIES, icon: BookOpen, label: 'STORY', tooltip: 'Bible Stories' },
    { view: View.DRAWING, icon: Palette, label: 'ART', tooltip: 'Magic Art Studio' },
    { view: View.ACTIVITIES, icon: BrainCircuit, label: 'QUIZ', tooltip: 'Knowledge Quests' },
    { view: View.GAMES, icon: Gamepad2, label: 'PLAY', tooltip: 'Arcade Zone' },
    { view: View.COUNTDOWN, icon: CalendarClock, label: 'DATE', tooltip: 'Family Events' },
  ];

  const isDrawingMode = currentView === View.DRAWING;
  const isLandingMode = currentView === View.LANDING;
  const isLoginMode = currentView === View.LOGIN;
  const showNav = !isLandingMode && !isLoginMode && !isDrawingMode;
  const { locale, setLocale, t } = useI18n();
  const [isTTS, setIsTTS] = useState(false); // default off

  useEffect(() => {
    // Sync initial state with service (which defaults OFF)
    setIsTTS((AudioService as any).private?.ttsEnabled || false);
  }, []);

  const handleToggleTTS = () => {
    const newState = AudioService.toggleTTS();
    setIsTTS(newState);
  };

  const handleLogoClick = () => {
    onNavigate(View.HOME);
  };

  return (
    <div className="h-full w-full bg-[#050810] text-slate-100 flex flex-col font-sans overflow-hidden relative">

      {/* Immersive Edge-to-Edge Cinematic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[120vw] h-[120vw] bg-indigo-950/20 rounded-full blur-[160px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[120vw] h-[120vw] bg-purple-950/20 rounded-full blur-[160px] animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] bg-blue-950/10 rounded-full blur-[200px]"></div>
      </div>

      {/* Dynamic Top Header - Adapts to safe areas */}
      {showNav && (
        <header className="shrink-0 z-50 bg-[#050810]/40 backdrop-blur-3xl border-b border-white/5 flex items-center justify-center pt-[calc(env(safe-area-inset-top)+1rem)] pb-4 px-6 sm:px-12">
          <div className="w-full flex justify-between items-center">
            <div
              className="flex items-center cursor-pointer group active:scale-95 transition-transform"
              onClick={handleLogoClick}
              data-tooltip="Return to Tiwaton Hub"
            >
              <div className="w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center group-hover:scale-105 transition-transform drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                {getLogoUrl() ? (
                  <img src={getLogoUrl()!} alt="Tiwaton mark" className="w-full h-full object-contain" />
                ) : (
                  <span className="font-display text-white font-bold text-3xl">T</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {name && (
                <div className="flex items-center gap-3 bg-slate-900/60 px-4 py-2 rounded-full border border-white/5 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 shadow-inner">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></div>
                  <span className="hidden sm:inline">{name}'S ADVENTURE</span>
                  <span className="sm:hidden">{name}</span>
                </div>
              )}

              <button
                onClick={handleToggleTTS}
                data-tooltip={isTTS ? "Disable Voice" : "Enable Voice"}
                className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all ${isTTS
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  }`}
              >
                {isTTS ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>

              <button
                onClick={() => setLocale(locale === 'en' ? 'de' : 'en')}
                className="px-4 py-2 bg-white/10 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-[0.3em] text-white hover:bg-white/20 transition-all"
              >
                {t('shared.languageButton')}
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Viewport - Fills the entire screen */}
      <main
        className={`flex-1 w-full relative z-10 overflow-y-auto overflow-x-hidden transition-all duration-500 ${!showNav ? 'p-0' : 'p-4 sm:p-12 pb-32 sm:pb-28 custom-scrollbar'}`}
      >
        {children}
      </main>

      {/* Smart Nav - Floats professionally across all device widths */}
      {showNav && (
        <nav className="fixed bottom-6 left-6 right-6 lg:left-1/2 lg:-translate-x-1/2 lg:w-fit lg:min-w-[40rem] bg-slate-900/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] sm:rounded-[3rem] shadow-[0_30px_80px_rgba(0,0,0,0.8)] p-2 sm:p-3 z-50 animate-slide-up mb-[env(safe-area-inset-bottom)]">
          <div className="flex justify-around items-center h-14 sm:h-20 gap-1">
            {navItems.map((item) => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => onNavigate(item.view)}
                  data-tooltip={item.tooltip}
                  className={`flex flex-col items-center justify-center px-4 sm:px-8 h-full rounded-[2rem] transition-all duration-500 relative group active:scale-90 ${isActive ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                    }`}
                >
                  {isActive && (
                    <div className="absolute -top-1 w-8 sm:w-10 h-1 bg-indigo-400 rounded-full shadow-[0_0_20px_rgba(129,140,248,0.8)] animate-pulse"></div>
                  )}
                  <item.icon size={isActive ? 28 : 22} strokeWidth={isActive ? 3 : 2} className={`transition-all duration-500 ${isActive ? '-translate-y-1 scale-110 text-white' : ''}`} />
                  <span className={`hidden sm:block text-[8px] font-black uppercase tracking-[0.15em] mt-1.5 transition-all duration-300 ${isActive ? 'text-white opacity-100' : 'text-slate-600 opacity-60'}`}>
                    {item.label}
                  </span>

                  <div className="absolute inset-0 bg-white/5 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};

export default Layout;
