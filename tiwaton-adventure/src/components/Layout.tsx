import React from 'react';
import { View } from '../types';
import {
  BookOpen,
  Palette,
  BrainCircuit,
  Gamepad2,
  CalendarClock,
  Home,
} from 'lucide-react';

interface LayoutProps {
  currentView: View;
  onNavigate: (view: View) => void;
  children: React.ReactNode;
  childName: string;
}

const Layout: React.FC<LayoutProps> = ({
  currentView,
  onNavigate,
  children,
  childName,
}) => {
  const navItems = [
    { view: View.HOME, icon: Home, label: 'HQ' },
    { view: View.STORIES, icon: BookOpen, label: 'Story' },
    { view: View.DRAWING, icon: Palette, label: 'Studio' },
    { view: View.ACTIVITIES, icon: BrainCircuit, label: 'Quiz' },
    { view: View.GAMES, icon: Gamepad2, label: 'Arcade' },
    { view: View.COUNTDOWN, icon: CalendarClock, label: 'Events' },
  ];

  return (
    // PAGE SHELL: centers your whole app so it doesn’t sit left
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden flex justify-center">
      {/* Cinematic Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px]" />
        <div className="absolute top-[20%] right-[20%] w-[200px] h-[200px] bg-amber-500/10 rounded-full blur-[80px] animate-pulse-slow" />
      </div>

      {/* APP FRAME: the centered width container */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col">
        {/* Header (Cinematic Top Bar) */}
        <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 shadow-2xl w-full">
          <div className="w-full px-4 py-3 flex justify-between items-center">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => onNavigate(View.HOME)}
              title="Back to HQ"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.5)] group-hover:scale-105 transition-transform">
                <span className="font-display text-slate-900 font-bold text-lg">
                  TA
                </span>
              </div>
              <div>
                <h1 className="font-display text-xl leading-none text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  Tiwaton
                </h1>
                <p className="text-[10px] text-amber-400 font-bold tracking-widest uppercase">
                  Adventure Hub
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <span
                className="text-xs font-bold text-slate-500 bg-slate-800 px-3 py-1 rounded-full border border-slate-700"
                title="Connection Status"
              >
                Family Online
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full p-4 pb-28 md:pb-8 overflow-y-auto custom-scrollbar">
          {children}
        </main>

        {/* Glassmorphism Bottom Nav */}
        <nav className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-2xl bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-2 z-50">
          <div className="flex justify-around items-center">
            {navItems.map((item) => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => onNavigate(item.view)}
                  title={`Go to ${item.label}`}
                  className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-300 relative group ${
                    isActive
                      ? 'text-white -translate-y-4'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {/* Active Indicator Glow */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-500 to-blue-600 rounded-2xl -z-10 shadow-[0_10px_20px_rgba(79,70,229,0.5)]" />
                  )}

                  <item.icon
                    size={isActive ? 24 : 22}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider ${
                      isActive ? 'opacity-100' : 'opacity-0 scale-0'
                    } transition-all`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Layout;
