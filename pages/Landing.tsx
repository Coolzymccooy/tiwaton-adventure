
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { StorageService } from '../services/storage';
import { View, FamilyProfile } from '../types';
import {
  Rocket, Palette, BookOpen, Gamepad2, Sparkles,
  ShieldCheck, ArrowRight, LogIn, RefreshCcw,
  UserCheck, BrainCircuit, Star, Zap, Trophy,
  Target, GraduationCap, Heart, Clock, ChevronDown,
  MousePointer2, Lightbulb, LayoutDashboard,
  Users, School, CheckCircle2, Mail, KeyRound, UserPlus, Monitor
} from 'lucide-react';

import { useI18n } from '../i18n/I18nProvider';
import { getLogoUrl } from '../components/logo';

interface LandingProps {
  onAction: (action: 'LOGIN' | 'SETUP' | 'RESET' | 'CONTINUE') => void;
  activeProfile: FamilyProfile | null;
  disableHeavyEffects?: boolean;
  sessionReady?: boolean;
}

const SPLASH_WORDS = ["Imagination", "Discovery", "Victory", "Learning", "Creativity", "Adventure"];

const Landing: React.FC<LandingProps> = ({ onAction, activeProfile, disableHeavyEffects = false, sessionReady = true }) => {
  const { t } = useI18n();
  const [hasProfiles, setHasProfiles] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [isSplashing, setIsSplashing] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoUrl = getLogoUrl();
  const heroTemplate = t('landing.heroSubtitle');
  const heroWord = SPLASH_WORDS[wordIndex];
  const heroSegments = heroTemplate.split('{word}');
  const heroBefore = heroSegments[0] || '';
  const heroAfter = heroSegments.slice(1).join('{word}');
  const heroFullSubtitle = `${heroBefore}${heroWord}${heroAfter}`;

  useEffect(() => {
    setHasProfiles(StorageService.hasProfiles());
    const handleScroll = () => {
      if (containerRef.current) {
        setScrollY(containerRef.current.scrollTop);
      }
    };
    const container = containerRef.current;
    container?.addEventListener('scroll', handleScroll);

    // Word Splash Interval
    const splashInterval = setInterval(() => {
      setIsSplashing(false);
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % SPLASH_WORDS.length);
        setIsSplashing(true);
      }, 500);
    }, 3000);

    return () => {
      container?.removeEventListener('scroll', handleScroll);
      clearInterval(splashInterval);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = useMemo(() => [
    {
      icon: <BrainCircuit size={40} />,
      title: t('landing.featureReasoningTitle'),
      desc: t('landing.featureReasoningDesc'),
      color: "from-blue-500 to-indigo-600",
      tag: "SMART",
      tooltip: "Space Math Adventures"
    },
    {
      icon: <Palette size={40} />,
      title: t('landing.featureArtTitle'),
      desc: t('landing.featureArtDesc'),
      color: "from-pink-500 to-rose-600",
      tag: "CREATE",
      tooltip: "Sketch-to-Magic Tool"
    },
    {
      icon: <GraduationCap size={40} />,
      title: t('landing.featureVisionTitle'),
      desc: t('landing.featureVisionDesc'),
      color: "from-amber-500 to-orange-600",
      tag: "LEARN",
      tooltip: "Ancient Bible Quests"
    },
    {
      icon: <Target size={40} />,
      title: t('landing.featureWordTitle'),
      desc: t('landing.featureWordDesc'),
      color: "from-emerald-500 to-teal-600",
      tag: "READ",
      tooltip: "Arcade Word Puzzles"
    }
  ], [t]);


  if (disableHeavyEffects) {
    return (
      <div className="min-h-[100dvh] w-full bg-[#02000a] text-white px-5 py-8 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto space-y-6 bg-[#0b1120] border border-white/10 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-center mb-2">
            {logoUrl ? (
              <img src={logoUrl} alt="Tiwaton mark" className="w-16 h-16 object-contain" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center font-display text-3xl">T</div>
            )}
          </div>
          <h1 className="text-3xl font-display text-center">Adventure Hub</h1>
          <p className="text-sm text-slate-300 text-center">{heroFullSubtitle}</p>

          {!sessionReady && (
            <p className="text-center text-xs text-slate-400">Preparing your session...</p>
          )}

          <button
            onClick={() => {
              if (activeProfile) onAction('CONTINUE');
              else onAction(hasProfiles ? 'LOGIN' : 'SETUP');
            }}
            className="w-full py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 transition-colors"
          >
            {activeProfile ? t('landing.ctaResume') : t('landing.ctaPrimary')}
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onAction('LOGIN')}
              className="py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-sm"
            >
              {t('landing.ctaSecondary')}
            </button>
            <button
              onClick={() => onAction('RESET')}
              className="py-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-sm"
            >
              {t('landing.resetButton')}
            </button>
          </div>

          {/* Mobile Signup Guide */}
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-black text-white text-center">{t('landing.guideTitle')}</h3>
            <p className="text-xs text-slate-400 text-center">{t('landing.guideSubtitle')}</p>

            {/* Parent Path */}
            <div className="bg-white/5 border border-indigo-500/20 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shrink-0">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">{t('landing.guideParentTitle')}</h4>
                  <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">{t('landing.guideParentTag')}</p>
                </div>
              </div>
              <ol className="space-y-2 text-xs text-slate-300 pl-1">
                <li className="flex gap-2"><span className="text-indigo-400 font-black shrink-0">1.</span>{t('landing.guideP1Title')} — <span className="text-slate-500">{t('landing.guideP1Desc')}</span></li>
                <li className="flex gap-2"><span className="text-indigo-400 font-black shrink-0">2.</span>{t('landing.guideP2Title')}</li>
                <li className="flex gap-2"><span className="text-indigo-400 font-black shrink-0">3.</span>{t('landing.guideP3Title')}</li>
                <li className="flex gap-2"><span className="text-indigo-400 font-black shrink-0">4.</span>{t('landing.guideP4Title')}</li>
                <li className="flex gap-2"><span className="text-indigo-400 font-black shrink-0">5.</span>{t('landing.guideP5Title')} — <span className="text-slate-500">{t('landing.guideP5Desc')}</span></li>
                <li className="flex gap-2"><span className="text-indigo-400 font-black shrink-0">6.</span>{t('landing.guideP6Title')}</li>
              </ol>
              <button onClick={() => onAction('SETUP')} className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-bold text-xs uppercase tracking-widest">
                {t('landing.guideParentCta')}
              </button>
            </div>

            {/* School Path */}
            <div className="bg-white/5 border border-teal-500/20 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shrink-0">
                  <School size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">{t('landing.guideSchoolTitle')}</h4>
                  <p className="text-[10px] text-teal-400 font-bold uppercase tracking-widest">{t('landing.guideSchoolTag')}</p>
                </div>
              </div>
              <ol className="space-y-2 text-xs text-slate-300 pl-1">
                <li className="flex gap-2"><span className="text-teal-400 font-black shrink-0">1.</span>{t('landing.guideS1Title')}</li>
                <li className="flex gap-2"><span className="text-teal-400 font-black shrink-0">2.</span>{t('landing.guideS2Title')}</li>
                <li className="flex gap-2"><span className="text-teal-400 font-black shrink-0">3.</span>{t('landing.guideS3Title')}</li>
                <li className="flex gap-2"><span className="text-teal-400 font-black shrink-0">4.</span>{t('landing.guideS4Title')}</li>
                <li className="flex gap-2"><span className="text-teal-400 font-black shrink-0">5.</span>{t('landing.guideS5Title')} — <span className="text-slate-500">{t('landing.guideS5Desc')}</span></li>
                <li className="flex gap-2"><span className="text-teal-400 font-black shrink-0">6.</span>{t('landing.guideS6Title')}</li>
                <li className="flex gap-2"><span className="text-teal-400 font-black shrink-0">7.</span>{t('landing.guideS7Title')}</li>
              </ol>
              <button onClick={() => onAction('SETUP')} className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl text-white font-bold text-xs uppercase tracking-widest">
                {t('landing.guideSchoolCta')}
              </button>
            </div>

            {/* Tips row */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="text-center p-2">
                <ShieldCheck size={16} className="text-emerald-400 mx-auto mb-1" />
                <p className="text-[10px] text-slate-500 font-bold">{t('landing.guideTip1Title')}</p>
              </div>
              <div className="text-center p-2">
                <Gamepad2 size={16} className="text-indigo-400 mx-auto mb-1" />
                <p className="text-[10px] text-slate-500 font-bold">{t('landing.guideTip2Title')}</p>
              </div>
              <div className="text-center p-2">
                <Star size={16} className="text-amber-400 mx-auto mb-1" />
                <p className="text-[10px] text-slate-500 font-bold">{t('landing.guideTip3Title')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-[100dvh] w-full bg-[#02000a] overflow-y-auto overflow-x-hidden relative font-sans custom-scrollbar scroll-smooth"
    >
      {/* --- STUNNING FIXED HEADER --- */}
      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 sm:px-12 py-3 flex items-center justify-between ${scrollY > 50 ? 'bg-[#02000a]/80 backdrop-blur-2xl border-b border-white/10' : 'bg-transparent'}`}>
        <div
          onClick={() => activeProfile ? onAction('CONTINUE') : scrollToSection('hero')}
          className="flex items-center cursor-pointer group active:scale-95 transition-all"
          data-tooltip={activeProfile ? "Back to the Hub" : "Return to Top"}
        >
          <div className="w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            {logoUrl ? (
              <img src={logoUrl} alt="Tiwaton mark" className="w-full h-full object-contain" />
            ) : (
              <span className="font-display text-white font-bold text-3xl">T</span>
            )}
          </div>
        </div>

        <nav className="flex items-center gap-4 sm:gap-10">
          <button onClick={() => scrollToSection('vision')} data-tooltip="App Purpose & Vision" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors hidden md:block">The Vision</button>
          <button onClick={() => scrollToSection('features')} data-tooltip="Explore Hub Features" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors hidden md:block">Features</button>
          <button onClick={() => scrollToSection('events')} data-tooltip="Family Event Tracker" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors hidden md:block">Events</button>
          <button onClick={() => scrollToSection('signup-guide')} data-tooltip="How to Get Started" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors hidden md:block">Guide</button>

          {activeProfile ? (
            <button
              onClick={() => onAction('CONTINUE')}
              data-tooltip={`Resume session as ${activeProfile.name}`}
              className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 border border-emerald-400/50 rounded-full text-[10px] font-black uppercase tracking-widest text-white transition-all active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-2"
            >
              <LayoutDashboard size={14} /> Resume Hub
            </button>
          ) : (
            <button
              onClick={() => onAction('LOGIN')}
              data-tooltip="Login to Explorer Account"
              className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white transition-all active:scale-95 shadow-lg"
            >
              Sign In
            </button>
          )}
        </nav>
      </header>

      {/* Immersive Persistent Galaxy Backdrop */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute top-[-20%] left-[-10%] w-[150vw] h-[150vw] bg-fuchsia-600/20 rounded-full blur-[60px] md:blur-[120px] animate-pulse-slow transform-gpu will-change-transform"
          style={{ transform: `translateY(${scrollY * -0.2}px) translateZ(0)` }}
        ></div>
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[150vw] h-[150vw] bg-cyan-600/20 rounded-full blur-[60px] md:blur-[120px] animate-pulse-slow delay-1000 transform-gpu will-change-transform"
          style={{ transform: `translateY(${scrollY * -0.1}px) translateZ(0)` }}
        ></div>
        <div
          className="absolute top-[20%] right-[10%] w-[80vw] h-[80vw] bg-purple-600/15 rounded-full blur-[50px] md:blur-[100px] animate-pulse-slow delay-500 transform-gpu will-change-transform"
          style={{ transform: `translateY(${scrollY * -0.15}px) translateZ(0)` }}
        ></div>

        {/* Star Particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-twinkle"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.5 + 0.2,
              animationDuration: (Math.random() * 5 + 3) + 's',
              animationDelay: Math.random() * 5 + 's'
            }}
          ></div>
        ))}
      </div>

      {/* --- HERO SECTION --- */}
      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-16 z-10">
        <div className="max-w-7xl w-full text-center space-y-12 mt-12">

          {/* Top Status Capsule */}
          <div className="flex justify-center">
            {activeProfile ? (
              <div className="glass-capsule text-emerald-400 group cursor-pointer border-emerald-500/30" data-tooltip={`Welcome back, ${activeProfile.name}! Click to resume.`} onClick={() => onAction('CONTINUE')}>
                <UserCheck size={16} className="animate-pulse" />
                <span>HI {activeProfile.name.toUpperCase()}! READY TO GO BACK?</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            ) : (
              <div className="glass-capsule text-indigo-300">
                <Sparkles size={16} className="text-yellow-400 animate-spin-slow" />
                <span>{t('landing.sparkleTag')}</span>
              </div>
            )}
          </div>

          {/* ADVENTURE HUB TITLE - FIXED CLIPPING WITH MAXIMAL CLEARANCE */}
          <div className="relative inline-block py-10 sm:py-20 overflow-visible">
            <h1 className="font-display text-[4rem] sm:text-[7rem] md:text-[9.5rem] tracking-tighter leading-[1.1] drop-shadow-[0_0_80px_rgba(192,132,252,0.6)] animate-title-float relative z-10 overflow-visible">
              <span className="bg-clip-text text-transparent bg-gradient-to-br from-cyan-300 via-fuchsia-400 to-purple-600 bg-[length:200%_200%] animate-prismatic-flow block px-4 py-8 sm:py-16">
                Adventure Hub
              </span>
            </h1>
            {/* Glossy Reflection Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-30deg] animate-shimmer pointer-events-none z-20"></div>
          </div>

          <div className="space-y-8 max-w-4xl mx-auto">
            {/* SPLASH WORD SLIDER SUBTEXT */}
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="text-slate-300 text-xl sm:text-3xl font-medium tracking-tight leading-snug">
                {heroBefore}
                <span className="inline-block min-w-[200px] sm:min-w-[300px] px-4">
                  <span className={`inline-block font-black italic text-white text-3xl sm:text-5xl transition-all duration-500 ${isSplashing ? 'opacity-100 scale-100 blur-0 translate-y-0' : 'opacity-0 scale-50 blur-xl translate-y-4'}`}>
                    {heroWord}
                  </span>
                </span>
                {heroAfter}
              </div>
            </div>

            <p className="text-indigo-400 font-black text-xs sm:text-sm tracking-[0.6em] uppercase italic opacity-70">
              {heroFullSubtitle}
            </p>
          </div>

          {/* Central Call to Action */}
          <div className="flex flex-col items-center gap-8 w-full max-w-lg mx-auto pt-4">
            <button
              onClick={() => {
                if (activeProfile) onAction('CONTINUE');
                else onAction(hasProfiles ? 'LOGIN' : 'SETUP');
              }}
              data-tooltip={activeProfile ? "One-click return to your adventure" : "Unlock the Adventure Universe"}
              className={`glossy-button w-full group relative overflow-hidden transition-all duration-700 ${activeProfile ? 'border-emerald-500 shadow-[0_40px_100px_rgba(16,185,129,0.15)] scale-105' : ''}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${activeProfile ? 'from-emerald-500 to-teal-500' : 'from-indigo-500 to-purple-500'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              <span className="relative z-10 flex items-center justify-center gap-4 py-8 group-hover:text-white transition-colors duration-500">
                {activeProfile ? t('landing.ctaResume') : t('landing.ctaPrimary')}
                <Rocket size={32} className={`group-hover:scale-110 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform ${activeProfile ? 'text-emerald-400 group-hover:text-white' : ''}`} />
              </span>
            </button>

            <div className="flex gap-4 w-full">
              <button
                onClick={() => onAction('LOGIN')}
                data-tooltip="Enter Hub with Secret Key"
                className="secondary-glass-button flex-1 group"
              >
                <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-[1.5rem] sm:rounded-[2rem]"></div>
                <div className="relative z-10 flex items-center justify-center gap-2">
                  <LogIn size={18} className="text-indigo-400 group-hover:scale-110 transition-transform" /> {t('landing.ctaSecondary')}
                </div>
              </button>
              <button
                onClick={() => onAction('RESET')}
                data-tooltip="Reset Master Hub Settings"
                className="secondary-glass-button flex-1 group"
              >
                <div className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-[1.5rem] sm:rounded-[2rem]"></div>
                <div className="relative z-10 flex items-center justify-center gap-2">
                  <RefreshCcw size={18} className="text-amber-400 group-hover:rotate-180 transition-transform duration-700" /> {t('landing.resetButton')}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-40 cursor-pointer" onClick={() => scrollToSection('vision')}>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{t('landing.discoverMore')}</span>
          <ChevronDown size={20} className="text-slate-400" />
        </div>
      </section>

      {/* --- WHY TIWATON SECTION --- */}
      <section id="vision" className="relative px-6 py-32 z-10 bg-slate-950/40 backdrop-blur-xl border-y border-white/5">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-widest">
              <Lightbulb size={14} /> THE VISION
            </div>
            <h2 className="font-display text-6xl text-white italic leading-tight">{t('landing.visionTitle')}</h2>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              {t('landing.visionSubtitle')}
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-slate-900/50 rounded-3xl border border-white/5 group hover:border-indigo-500/30 transition-all" data-tooltip="Gamified Learning Logic">
                <Zap className="text-yellow-400 mb-3 group-hover:scale-125 transition-transform" size={24} />
                <h4 className="text-white font-black text-sm uppercase mb-1">Instant Engagement</h4>
                <p className="text-slate-500 text-xs">Captivating visuals keep attention focused on learning.</p>
              </div>
              <div className="p-6 bg-slate-900/50 rounded-3xl border border-white/5 group hover:border-emerald-500/30 transition-all" data-tooltip="Safe Family Environment">
                <ShieldCheck className="text-emerald-400 mb-3 group-hover:scale-125 transition-transform" size={24} />
                <h4 className="text-white font-black text-sm uppercase mb-1">Total Privacy</h4>
                <p className="text-slate-500 text-xs">A local-first family vault. Your data stays on your device.</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-[4rem] border-2 border-white/10 relative overflow-hidden flex items-center justify-center p-12">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
              <div className="relative grid grid-cols-2 gap-4 animate-float">
                <div className="w-24 h-24 bg-slate-800 rounded-3xl flex items-center justify-center text-4xl shadow-2xl border border-white/10 hover:scale-110 transition-transform cursor-pointer" data-tooltip="Character Quests">🦁</div>
                <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center text-4xl shadow-2xl border border-white/20 translate-y-8 hover:scale-110 transition-transform cursor-pointer" data-tooltip="Tech Mini-Games">🚀</div>
                <div className="w-24 h-24 bg-pink-600 rounded-3xl flex items-center justify-center text-4xl shadow-2xl border border-white/20 -translate-y-4 hover:scale-110 transition-transform cursor-pointer" data-tooltip="Creative Art Mode">🎨</div>
                <div className="w-24 h-24 bg-emerald-600 rounded-3xl flex items-center justify-center text-4xl shadow-2xl border border-white/20 translate-y-4 hover:scale-110 transition-transform cursor-pointer" data-tooltip="Puzzle Missions">🧩</div>
              </div>
            </div>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-500/20 blur-[100px] rounded-full animate-pulse delay-700"></div>
          </div>
        </div>
      </section>

      {/* --- FEATURE GRID SECTION --- */}
      <section id="features" className="relative px-6 py-32 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24 space-y-12">
            <h3 className="font-display text-7xl text-white italic tracking-tighter leading-relaxed pb-12 mb-16">The Galactic Features</h3>
            <p className="text-slate-500 text-xl font-medium pt-8">Tools to grow, reason, and create every single day.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div
                key={i}
                data-tooltip={f.tooltip}
                className="group bg-slate-900/40 border border-white/5 p-10 rounded-[3.5rem] hover:bg-slate-900/80 transition-all hover:-translate-y-3 hover:border-white/10 shadow-2xl relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 p-4 font-black text-[10px] tracking-widest bg-gradient-to-br ${f.color} text-white rounded-bl-3xl opacity-40 group-hover:opacity-100 transition-opacity`}>
                  {f.tag}
                </div>
                <div className={`w-20 h-20 bg-gradient-to-br ${f.color} rounded-[2rem] flex items-center justify-center text-white mb-8 shadow-xl group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h4 className="text-2xl font-black text-white italic mb-4 tracking-tighter uppercase leading-tight">{f.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FAMILY CONNECTION (COUNTDOWN) --- */}
      <section id="events" className="relative px-6 py-32 z-10 overflow-hidden">
        <div className="max-w-4xl mx-auto bg-slate-900/60 backdrop-blur-xl p-12 rounded-[4rem] border-2 border-white/5 relative shadow-[0_0_100px_rgba(99,102,241,0.1)] group">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-[50px] group-hover:bg-indigo-500/20 transition-colors"></div>
          <div className="flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
            <div className="relative shrink-0">
              <div className="w-40 h-40 bg-slate-800 rounded-full flex items-center justify-center border-4 border-indigo-400/20 shadow-2xl relative z-10 group-hover:border-indigo-400/40 transition-all">
                <Clock size={64} className="text-indigo-400 animate-pulse-slow" />
              </div>
              <div className="absolute inset-0 bg-indigo-400 blur-3xl opacity-20 animate-pulse"></div>
            </div>
            <div className="space-y-6">
              <h3 className="font-display text-5xl text-white italic">Never Miss a Moment</h3>
              <p className="text-slate-400 text-lg leading-relaxed font-medium">
                Our <span className="text-indigo-400 font-bold">Event Radar</span> tracks family birthdays, holidays, and adventures. Set parent-notified countdowns that build anticipation and excitement for the next big family memory.
              </p>
              <div className="flex gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest" data-tooltip="Core Family Values">
                  <Heart size={14} className="text-rose-500" /> FAMILY FIRST
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest" data-tooltip="Earn Rewards for Progress">
                  <Star size={14} className="text-amber-500" /> STAR REWARDS
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SIGNUP GUIDE SECTION --- */}
      <section id="signup-guide" className="relative px-4 sm:px-6 py-20 sm:py-32 z-10 bg-slate-950/40 backdrop-blur-xl border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-20 space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-widest">
              <Rocket size={14} /> {t('landing.guideTag')}
            </div>
            <h3 className="font-display text-4xl sm:text-6xl text-white italic tracking-tighter leading-tight">{t('landing.guideTitle')}</h3>
            <p className="text-slate-400 text-base sm:text-lg font-medium max-w-2xl mx-auto">{t('landing.guideSubtitle')}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-10">
            {/* Parent / Family Path */}
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl sm:rounded-[3rem] border border-indigo-500/20 p-6 sm:p-10 space-y-6 sm:space-y-8 group hover:border-indigo-500/40 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl sm:rounded-3xl flex items-center justify-center text-white shadow-xl shrink-0">
                  <Users size={28} />
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">{t('landing.guideParentTitle')}</h4>
                  <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest">{t('landing.guideParentTag')}</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { icon: <Rocket size={18} />, step: '1', title: t('landing.guideP1Title'), desc: t('landing.guideP1Desc'), color: 'text-indigo-400' },
                  { icon: <Mail size={18} />, step: '2', title: t('landing.guideP2Title'), desc: t('landing.guideP2Desc'), color: 'text-sky-400' },
                  { icon: <CheckCircle2 size={18} />, step: '3', title: t('landing.guideP3Title'), desc: t('landing.guideP3Desc'), color: 'text-emerald-400' },
                  { icon: <KeyRound size={18} />, step: '4', title: t('landing.guideP4Title'), desc: t('landing.guideP4Desc'), color: 'text-amber-400' },
                  { icon: <UserPlus size={18} />, step: '5', title: t('landing.guideP5Title'), desc: t('landing.guideP5Desc'), color: 'text-pink-400' },
                  { icon: <Monitor size={18} />, step: '6', title: t('landing.guideP6Title'), desc: t('landing.guideP6Desc'), color: 'text-purple-400' },
                ].map((s) => (
                  <div key={s.step} className="flex gap-3 sm:gap-4 items-start">
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 ${s.color}`}>
                      {s.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Step {s.step}</span>
                      </div>
                      <h5 className="text-white font-bold text-sm sm:text-base leading-snug">{s.title}</h5>
                      <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onAction('SETUP')}
                className="w-full py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl sm:rounded-2xl text-white font-black uppercase text-xs sm:text-sm tracking-widest transition-all active:scale-95 shadow-lg"
              >
                {t('landing.guideParentCta')}
              </button>
            </div>

            {/* School / Teacher Path */}
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl sm:rounded-[3rem] border border-teal-500/20 p-6 sm:p-10 space-y-6 sm:space-y-8 group hover:border-teal-500/40 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl sm:rounded-3xl flex items-center justify-center text-white shadow-xl shrink-0">
                  <School size={28} />
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">{t('landing.guideSchoolTitle')}</h4>
                  <p className="text-teal-400 text-xs font-bold uppercase tracking-widest">{t('landing.guideSchoolTag')}</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { icon: <Rocket size={18} />, step: '1', title: t('landing.guideS1Title'), desc: t('landing.guideS1Desc'), color: 'text-teal-400' },
                  { icon: <Mail size={18} />, step: '2', title: t('landing.guideS2Title'), desc: t('landing.guideS2Desc'), color: 'text-sky-400' },
                  { icon: <CheckCircle2 size={18} />, step: '3', title: t('landing.guideS3Title'), desc: t('landing.guideS3Desc'), color: 'text-emerald-400' },
                  { icon: <KeyRound size={18} />, step: '4', title: t('landing.guideS4Title'), desc: t('landing.guideS4Desc'), color: 'text-amber-400' },
                  { icon: <UserPlus size={18} />, step: '5', title: t('landing.guideS5Title'), desc: t('landing.guideS5Desc'), color: 'text-pink-400' },
                  { icon: <GraduationCap size={18} />, step: '6', title: t('landing.guideS6Title'), desc: t('landing.guideS6Desc'), color: 'text-purple-400' },
                  { icon: <Monitor size={18} />, step: '7', title: t('landing.guideS7Title'), desc: t('landing.guideS7Desc'), color: 'text-cyan-400' },
                ].map((s) => (
                  <div key={s.step} className="flex gap-3 sm:gap-4 items-start">
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 ${s.color}`}>
                      {s.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Step {s.step}</span>
                      </div>
                      <h5 className="text-white font-bold text-sm sm:text-base leading-snug">{s.title}</h5>
                      <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onAction('SETUP')}
                className="w-full py-3 sm:py-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 rounded-xl sm:rounded-2xl text-white font-black uppercase text-xs sm:text-sm tracking-widest transition-all active:scale-95 shadow-lg"
              >
                {t('landing.guideSchoolCta')}
              </button>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="mt-10 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: <ShieldCheck size={20} />, title: t('landing.guideTip1Title'), desc: t('landing.guideTip1Desc'), color: 'text-emerald-400' },
              { icon: <Gamepad2 size={20} />, title: t('landing.guideTip2Title'), desc: t('landing.guideTip2Desc'), color: 'text-indigo-400' },
              { icon: <Star size={20} />, title: t('landing.guideTip3Title'), desc: t('landing.guideTip3Desc'), color: 'text-amber-400' },
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3 p-4 sm:p-5 bg-slate-900/40 rounded-2xl border border-white/5">
                <div className={`shrink-0 ${tip.color}`}>{tip.icon}</div>
                <div>
                  <h5 className="text-white font-bold text-sm">{tip.title}</h5>
                  <p className="text-slate-500 text-xs leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="relative px-6 py-40 z-10 text-center">
        <div className="max-w-3xl mx-auto space-y-12">
          <h3 className="font-display text-6xl sm:text-8xl text-white leading-none tracking-tighter">Your Next Adventure Starts Here.</h3>
          <p className="text-slate-500 text-xl font-medium">Unlock the full potential of your family hub today.</p>
          <button
            onClick={() => {
              if (activeProfile) onAction('CONTINUE');
              else onAction(hasProfiles ? 'LOGIN' : 'SETUP');
            }}
            data-tooltip={activeProfile ? "Resume your quest instantly" : "Launch Your Journey"}
            className={`glossy-button max-w-md mx-auto relative group overflow-hidden ${activeProfile ? 'border-emerald-500' : ''}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${activeProfile ? 'from-emerald-500 to-teal-500' : 'from-emerald-500 to-teal-500'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} /><span className="relative z-10 flex items-center justify-center gap-4 py-8 group-hover:text-white transition-colors duration-500">
              {activeProfile ? t('landing.ctaResume') : t('landing.ctaPrimary')} <ArrowRight size={32} className="group-hover:translate-x-2 transition-transform duration-500" />
            </span>
          </button>
        </div>

        <footer className="mt-40 border-t border-white/5 pt-10 pb-20">
          <div className="flex flex-col items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-display text-2xl text-white shadow-2xl">T</div>
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.5em]">{t('landing.footerTag')}</p>
            <div className="flex gap-8 opacity-40">
              <Gamepad2 size={20} className="text-slate-400 hover:text-white transition-colors cursor-pointer" data-tooltip="Spelling & Logic Games" />
              <BookOpen size={20} className="text-slate-400 hover:text-white transition-colors cursor-pointer" data-tooltip="Reading & Adventures" />
              <Palette size={20} className="text-slate-400 hover:text-white transition-colors cursor-pointer" data-tooltip="Creativity Studio" />
            </div>
          </div>
        </footer>
      </section>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.3); }
        }
        .animate-twinkle { animation: twinkle linear infinite; }
        .animate-pulse-slow { animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        
        @keyframes prismatic {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-prismatic-flow { animation: prismatic 6s ease infinite; }

        @keyframes titleFloat {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        .animate-title-float { animation: titleFloat 8s ease-in-out infinite; }

        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-30deg); }
          100% { transform: translateX(200%) skewX(-30deg); }
        }
        .animate-shimmer { animation: shimmer 5s infinite ease-in-out; }

        .glass-capsule {
            @apply inline-flex items-center gap-3 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-[9px] sm:text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl backdrop-blur-md transition-all;
        }
        .glass-capsule:hover {
            @apply bg-white/10 border-white/20;
        }

        .glossy-button {
            @apply relative w-full bg-white text-slate-950 rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden shadow-[0_40px_100px_rgba(255,255,255,0.1)] hover:scale-[1.03] active:scale-95 transition-all duration-500 border-b-[10px] border-slate-300 font-black text-2xl sm:text-4xl italic uppercase tracking-tighter;
        }
        .glossy-button::after {
            content: '';
            @apply absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] translate-x-[-150%] transition-transform duration-1000;
        }
        .glossy-button:hover::after {
            @apply translate-x-[150%];
        }

        .secondary-glass-button {
            @apply relative py-5 bg-slate-900/40 backdrop-blur-xl border-2 border-white/5 rounded-[1.5rem] sm:rounded-[2rem] hover:bg-slate-800 transition-all text-slate-400 hover:text-white flex items-center justify-center gap-2 font-black uppercase text-[10px] tracking-widest overflow-hidden;
        }
      `}</style>
    </div>
  );
};

export default Landing;
