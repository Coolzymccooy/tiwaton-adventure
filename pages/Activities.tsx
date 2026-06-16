
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StorageService } from '../services/storage';
import { AIService } from '../services/ai';
import { AudioService } from '../services/audio';
import { View } from '../types';
import {
  BrainCircuit, Trophy, Star,
  ArrowRight, X, ArrowLeft, Zap, ScrollText, Music2, Goal,
  Flame, Crown, Sparkles, Lock, Home, Timer, Infinity, ChevronRight
} from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';
import { BIBLE_BANK, type WorldId } from '../data/bible-questions';
import {
  getQuestions, markAnswered, SCROLL_TIERS,
  getWorldTierProgress, completeWorldTier, getEternalHighScore, setEternalHighScore,
  cacheAIQuestions, type PlayableQuestion, type ScrollTier
} from '../services/question-engine';

interface ActivitiesPageProps {
  onNavigate?: (view: View) => void;
}

// Re-use the PlayableQuestion type as our Question interface
type Question = PlayableQuestion;

const BIBLE_WORLDS = [
  { id: 'creation' as WorldId, label: 'The Beginning', icon: '🌅', desc: 'Creation & Eden', badge: 'Genesis Star' },
  { id: 'patriarchs' as WorldId, label: 'Patriarch Promise', icon: '🛕', desc: 'Abraham & Sarah', badge: 'Promise Keeper' },
  { id: 'exodus' as WorldId, label: 'Exodus Trail', icon: '🔥', desc: 'Moses & the Wilderness', badge: 'Desert Guide' },
  { id: 'judges' as WorldId, label: 'Judges & Courage', icon: '🛡️', desc: 'Deborah to Samson', badge: 'Courage Shield' },
  { id: 'kings' as WorldId, label: 'Kingdom Builders', icon: '👑', desc: 'David, Solomon & the Temple', badge: 'Royal Honor' },
  { id: 'prophets' as WorldId, label: 'Voice of Prophets', icon: '📜', desc: 'Isaiah, Jeremiah & Hope', badge: 'Prophet Quill' },
  { id: 'gospels' as WorldId, label: 'Good News', icon: '✝️', desc: 'Jesus & Miracles', badge: 'Good News Badge' },
  { id: 'earlyChurch' as WorldId, label: 'Early Church', icon: '✨', desc: 'Acts & Letters', badge: 'Faith Flame' },
  { id: 'wisdom' as WorldId, label: 'Proverbs & Wisdom', icon: '🧠', desc: 'Solomon & Job', badge: 'Wisdom Owl' },
  { id: 'exile' as WorldId, label: 'Exile & Lions', icon: '🦁', desc: 'Daniel & The Furnace', badge: 'Lion Tamer' },
  { id: 'return' as WorldId, label: 'The Wall Builder', icon: '🧱', desc: 'Nehemiah & Ezra', badge: 'Master Builder' },
  { id: 'parables' as WorldId, label: 'Parables', icon: '🌾', desc: 'Stories of Jesus', badge: 'Story Sower' },
  { id: 'passion' as WorldId, label: 'The Passion', icon: '🍷', desc: 'The Garden & Cross', badge: 'Atonement Cup' },
  { id: 'resurrection' as WorldId, label: 'He is Risen', icon: '🕊️', desc: 'The Empty Tomb', badge: 'Risen Glory' },
  { id: 'holySpirit' as WorldId, label: 'Pentecost Fire', icon: '🌪️', desc: 'The Holy Spirit', badge: 'Spirit Wind' },
  { id: 'revelation' as WorldId, label: 'The Revelation', icon: '👁️', desc: 'Alpha & Omega', badge: 'Omega Crown' },
  { id: 'heroes' as WorldId, label: 'Heroes of Faith', icon: '🦸', desc: 'David vs Goliath', badge: 'Hero Shield' },
  { id: 'womenOfFaith' as WorldId, label: 'Women of Faith', icon: '👸', desc: 'Esther & Ruth', badge: 'Faith Queen' }
];

const CATEGORY_META = {
  Bible: { label: 'Bible Quest', color: 'from-amber-600 to-orange-800', accent: 'text-amber-400', icon: ScrollText, music: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3' },
};

const CorrectionCard: React.FC<{
  question: Question;
  selectedIndex: number;
  onNext: () => void
}> = ({ question, selectedIndex, onNext }) => {
  const { t } = useI18n();
  useEffect(() => {
    AudioService.speak(`Incorrect. ${question.explanation}`);
  }, [question]);
  const incorrectText = t('activities.incorrectDescription', undefined, { option: question.options[selectedIndex] });
  const funny = question.funnyComment ? ` ${question.funnyComment}` : '';

  return (
    <div className="absolute inset-x-0 bottom-0 top-[20%] z-[60] bg-slate-950/95 backdrop-blur-3xl rounded-t-[3rem] border-t-4 border-rose-500 p-6 sm:p-10 flex flex-col animate-slide-up shadow-[0_-40px_100px_rgba(244,63,94,0.3)]">
      <div className="flex-1 overflow-y-auto custom-scrollbar mb-4">
        <div className="flex items-center gap-3 mb-4 text-rose-400">
          <X size={32} className="bg-rose-500/20 p-1.5 rounded-xl" />
          <h3 className="text-3xl font-black italic uppercase tracking-tighter">{t('activities.incorrectTitle')}</h3>
        </div>
        <p className="text-white text-lg mb-6 font-medium leading-tight opacity-90">
          {incorrectText}{funny}
        </p>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-4">
          <p className="text-emerald-400 font-black text-[9px] uppercase tracking-[0.3em] mb-2">{t('activities.correctionPrompt')}</p>
          <h4 className="text-2xl font-black text-white mb-2 italic tracking-tight">{question.options[question.correctIndex]}</h4>
          <p className="text-slate-300 text-sm leading-relaxed font-sans">{question.explanation}</p>
        </div>
      </div>
      <button onClick={onNext} className="w-full py-5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xl rounded-2xl shadow-[0_6px_0_rgb(159,18,57)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3">
        {t('activities.correctionButton')} <ArrowRight size={22} />
      </button>
    </div>
  );
};

/* ─── Tier Selection Modal ─── */
const TierSelector: React.FC<{
  worldId: WorldId;
  worldLabel: string;
  worldIcon: string;
  onSelect: (tier: ScrollTier) => void;
  onClose: () => void;
  locale: 'en' | 'de';
}> = ({ worldId, worldLabel, worldIcon, onSelect, onClose, locale }) => {
  const completedTier = getWorldTierProgress(worldId);
  const eternalBest = getEternalHighScore(worldId);

  return (
    <div className="fixed inset-0 z-[90] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#0b1120] rounded-[2.5rem] border border-white/5 p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
        <button onClick={onClose} className="absolute top-5 right-5 p-2 text-slate-500 hover:text-white transition-colors bg-white/5 rounded-xl">
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="text-5xl mb-3">{worldIcon}</div>
          <h3 className="text-2xl font-display text-white italic tracking-tighter uppercase">{worldLabel}</h3>
          <p className="text-[9px] text-indigo-400 font-black uppercase tracking-widest mt-1">
            {locale === 'de' ? 'Wähle deine Schriftrolle' : 'Choose Your Scroll'}
          </p>
        </div>

        <div className="space-y-2.5">
          {SCROLL_TIERS.map((tierDef) => {
            const isUnlocked = tierDef.tier === 1 || completedTier >= tierDef.tier - 1;
            const isCompleted = completedTier >= tierDef.tier;
            const isEternal = tierDef.tier === 5;

            return (
              <button
                key={tierDef.tier}
                disabled={!isUnlocked}
                onClick={() => onSelect(tierDef.tier)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border transition-all text-left ${
                  !isUnlocked
                    ? 'bg-slate-950/50 border-slate-900/50 opacity-40 grayscale'
                    : isEternal
                      ? 'bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border-purple-500/30 hover:border-purple-400/50 hover:scale-[1.02]'
                      : isCompleted
                        ? 'bg-emerald-900/20 border-emerald-500/20 hover:border-emerald-400/40 hover:scale-[1.02]'
                        : 'bg-slate-900/60 border-white/10 hover:border-indigo-500 hover:scale-[1.02]'
                }`}
              >
                <span className="text-2xl shrink-0">{tierDef.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-black text-white uppercase tracking-tight">{tierDef.name[locale]}</p>
                    {isCompleted && !isEternal && <Star size={12} className="text-yellow-400 fill-yellow-400" />}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {isEternal
                      ? (locale === 'de' ? `Endlos-Modus · Bestleistung: ${eternalBest}` : `Endless Mode · Best: ${eternalBest}`)
                      : `${tierDef.questionCount} ${locale === 'de' ? 'Fragen' : 'questions'} · ${Math.round(tierDef.passPct * 100)}% ${locale === 'de' ? 'zum Bestehen' : 'to pass'}`
                    }
                  </p>
                </div>
                {!isUnlocked ? (
                  <Lock size={16} className="text-slate-700 shrink-0" />
                ) : (
                  <ChevronRight size={18} className="text-slate-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ─── Main Component ─── */
const ActivitiesPage: React.FC<ActivitiesPageProps> = ({ onNavigate }) => {
  const profile = StorageService.getCurrentProfile();
  const [mode, setMode] = useState<'MENU' | 'TIER_SELECT' | 'PLAYING'>('MENU');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showCorrection, setShowCorrection] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [selectedWorldId, setSelectedWorldId] = useState<WorldId>('creation');
  const [selectedTier, setSelectedTier] = useState<ScrollTier>(1);
  const [eternalTimer, setEternalTimer] = useState(15);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stats = StorageService.getGameStats();
  const bibleProgress = stats.quizProgress.find(p => p.category === 'Bible')?.bibleWorldLevel || 0;
  const { t, locale } = useI18n();

  useEffect(() => {
    return () => {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Background AI prefetch: silently cache fresh questions for later
  const prefetchAI = useCallback((worldId: string, worldLabel: string) => {
    AIService.generateQuiz('Bible', 1, worldLabel, profile?.age || 6)
      .then(aiQuestions => {
        if (aiQuestions && aiQuestions.length > 0) {
          // Convert AI format to BibleQuestion format for caching
          const converted = aiQuestions.map((q: any) => ({
            q: { en: q.question, de: q.question },
            o: { en: q.options, de: q.options },
            ci: q.correctIndex,
            ex: { en: q.explanation, de: q.explanation },
            d: 2 as const, // AI questions are medium difficulty
          }));
          cacheAIQuestions(worldId, converted);
        }
      })
      .catch(() => { /* silent fail */ });
  }, [profile?.age]);

  const openTierSelect = (worldId: WorldId) => {
    setSelectedWorldId(worldId);
    setMode('TIER_SELECT');
  };

  // INSTANT start — no loading spinner, no await
  const startLevel = (worldId: WorldId, tier: ScrollTier) => {
    const world = BIBLE_WORLDS.find(w => w.id === worldId);
    setSelectedWorldId(worldId);
    setSelectedTier(tier);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setShowCorrection(false);
    setSelectedOption(null);
    setShowVictory(false);

    // INSTANT: get questions from local bank — zero network calls
    const q = getQuestions(BIBLE_BANK, worldId, tier, locale);
    setQuestions(q);
    setMode('PLAYING');

    // Start music
    if (audioRef.current) audioRef.current.pause();
    audioRef.current = new Audio(CATEGORY_META.Bible.music);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.05;
    audioRef.current.play().catch(() => {});

    const tierName = SCROLL_TIERS[tier - 1].name[locale];
    AudioService.speak(`${world?.label} — ${tierName}. Let's go!`);
    setTimeout(() => q.length > 0 && AudioService.speak(q[0].question), 800);

    // Eternal scroll: start countdown timer
    if (tier === 5) {
      setEternalTimer(15);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setEternalTimer(prev => {
          if (prev <= 1) return 0; // will be caught in effect
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    }

    // Background: prefetch AI questions for NEXT session (silent, non-blocking)
    if (world) prefetchAI(worldId, world.label);
  };

  // Eternal timer timeout → game over
  useEffect(() => {
    if (selectedTier === 5 && eternalTimer === 0 && mode === 'PLAYING') {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      setEternalHighScore(selectedWorldId, score);
      setShowVictory(true);
      AudioService.speak(`Time's up! Your streak: ${score} questions.`);
    }
  }, [eternalTimer, selectedTier, mode, score, selectedWorldId]);

  const handleAnswer = (index: number) => {
    if (selectedOption !== null || questions.length === 0) return;
    setSelectedOption(index);
    const currentQ = questions[currentIndex];
    const isCorrect = index === currentQ.correctIndex;

    // Mark this question as answered (for no-repeat tracking)
    markAnswered(selectedWorldId, currentQ.hash);

    if (isCorrect) {
      AudioService.playEffect('correct');
      setScore(s => s + 1);
      setStreak(s => s + 1);
      AudioService.speak(currentQ.funnyComment || "Brilliant! Correct!");

      // Reset eternal timer on correct answer
      if (selectedTier === 5) setEternalTimer(15);

      setTimeout(() => advanceToNext(), 1500);
    } else {
      AudioService.playEffect('wrong');
      setStreak(0);
      setShowCorrection(true);

      // Eternal scroll: wrong answer = game over
      if (selectedTier === 5) {
        if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
        setTimeout(() => {
          setShowCorrection(false);
          setEternalHighScore(selectedWorldId, score);
          setShowVictory(true);
          AudioService.speak(`Game over! Your score: ${score}`);
        }, 2500);
        return;
      }
    }
  };

  const advanceToNext = () => {
    setShowCorrection(false);
    setSelectedOption(null);
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setTimeout(() => AudioService.speak(questions[nextIdx].question), 500);
      // Reset timer for eternal
      if (selectedTier === 5) setEternalTimer(15);
    } else if (selectedTier === 5) {
      // Eternal scroll: ran out of batch — game over (won!)
      setEternalHighScore(selectedWorldId, score);
      setShowVictory(true);
      AudioService.speak(`Incredible! You answered every question! Score: ${score}`);
    } else {
      // Normal tier: evaluate pass/fail
      const tierDef = SCROLL_TIERS[selectedTier - 1];
      const minRequired = Math.max(1, Math.ceil(questions.length * tierDef.passPct));
      const passed = score >= minRequired;
      if (passed) {
        completeWorldTier(selectedWorldId, selectedTier);
        const newStats = { ...stats };
        const bibleIdx = newStats.quizProgress.findIndex(p => p.category === 'Bible');
        const currentWorldIdx = BIBLE_WORLDS.findIndex(w => w.id === selectedWorldId);

        if (bibleIdx >= 0) {
          newStats.quizProgress[bibleIdx].bibleWorldLevel = Math.max(
            newStats.quizProgress[bibleIdx].bibleWorldLevel || 0,
            currentWorldIdx + 1
          );
        }

        const xpReward = selectedTier * 50 + 100; // tier 1=150, tier 2=200, etc.
        newStats.xp += xpReward;
        const badge = BIBLE_WORLDS[currentWorldIdx]?.badge;
        if (badge && !newStats.badges.includes(badge)) newStats.badges.push(badge);

        // Streak badges for eternal scroll
        if (selectedTier >= 3) {
          const tierBadge = `${BIBLE_WORLDS[currentWorldIdx]?.label} ${SCROLL_TIERS[selectedTier - 1].name.en}`;
          if (!newStats.badges.includes(tierBadge)) newStats.badges.push(tierBadge);
        }

        StorageService.saveGameStats(newStats);
        setShowVictory(true);
        AudioService.speak(badge ? `Masterful! You earned the ${badge} badge!` : 'Well done!');
      } else {
        setMode('MENU');
        AudioService.speak("Tough round! Let's study more and try again.");
      }
    }
  };

  const exitToMenu = () => {
    setMode('MENU');
    if (audioRef.current) audioRef.current.pause();
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  /* ─── Tier Selection Screen ─── */
  if (mode === 'TIER_SELECT') {
    const world = BIBLE_WORLDS.find(w => w.id === selectedWorldId);
    return (
      <TierSelector
        worldId={selectedWorldId}
        worldLabel={world?.label || ''}
        worldIcon={world?.icon || '📜'}
        onSelect={(tier) => startLevel(selectedWorldId, tier)}
        onClose={() => setMode('MENU')}
        locale={locale}
      />
    );
  }

  /* ─── Playing Screen ─── */
  if (mode === 'PLAYING' && questions.length > 0) {
    const q = questions[currentIndex];
    const world = BIBLE_WORLDS.find(w => w.id === selectedWorldId);
    const tierDef = SCROLL_TIERS[selectedTier - 1];
    const isEternal = selectedTier === 5;
    const xpReward = isEternal ? score * 25 : selectedTier * 50 + 100;

    return (
      <div className="min-h-full flex flex-col relative animate-fade-in bg-[#050810] pb-24">
        {showVictory && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/95 p-6 backdrop-blur-3xl animate-fade-in fixed">
            <div className="text-center max-w-sm animate-float">
              <div className="text-6xl sm:text-7xl mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]">{isEternal ? '♾️' : world?.icon}</div>
              <h2 className="text-4xl sm:text-5xl font-display text-yellow-400 mb-2 italic tracking-tighter uppercase">
                {isEternal ? (locale === 'de' ? 'Ewige Legende!' : 'Eternal Legend!') : t('activities.victoryTitle')}
              </h2>
              {isEternal && (
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-3xl font-black text-white">{score}</p>
                    <p className="text-[8px] text-indigo-400 font-black uppercase tracking-widest">{locale === 'de' ? 'Ergebnis' : 'Score'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-black text-amber-400">{getEternalHighScore(selectedWorldId)}</p>
                    <p className="text-[8px] text-amber-400/70 font-black uppercase tracking-widest">{locale === 'de' ? 'Bestleistung' : 'Best'}</p>
                  </div>
                </div>
              )}
              {!isEternal && <p className="text-white text-base font-bold mb-4">{t('activities.victorySubtitle')}</p>}
              <div className="bg-indigo-600/30 p-5 rounded-3xl border border-white/10 mb-6">
                <div className="flex items-center justify-center gap-2 text-white font-black text-2xl mb-1">
                  <Zap className="text-yellow-300" size={24} /> +{xpReward}
                </div>
                <p className="text-indigo-300 font-black uppercase text-[8px] sm:text-[9px] tracking-widest">{t('activities.victoryXpLabel')}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={exitToMenu} className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white font-black text-base rounded-xl transition-all">
                  {locale === 'de' ? 'Menü' : 'Menu'}
                </button>
                <button onClick={() => startLevel(selectedWorldId, selectedTier)} className="flex-1 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-black text-base rounded-xl shadow-[0_4px_0_rgb(161,98,7)] transition-all active:scale-95">
                  {locale === 'de' ? 'Nochmal' : 'Replay'}
                </button>
              </div>
            </div>
          </div>
        )}

        {showCorrection && q && !isEternal && (
          <CorrectionCard question={q} selectedIndex={selectedOption!} onNext={advanceToNext} />
        )}

        {/* HUD */}
        <div className="flex justify-between items-center p-4 pt-2 z-10 shrink-0">
          <button onClick={exitToMenu} className="p-3 bg-slate-900 border border-white/10 rounded-2xl text-white hover:bg-slate-800 transition-all shadow-xl">
            <ArrowLeft size={20} />
          </button>
          <div className="text-center">
            <h3 className="font-display text-2xl text-white italic tracking-tighter">{world?.label}</h3>
            <div className="flex items-center justify-center gap-1.5 mt-0.5">
              <div className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-full text-[8px] font-black uppercase tracking-widest border border-indigo-500/20">
                {tierDef.icon} {isEternal ? `#${currentIndex + 1}` : `${currentIndex + 1}/${questions.length}`}
              </div>
              {streak > 1 && (
                <div className="px-2 py-0.5 bg-orange-500/10 text-orange-400 rounded-full text-[8px] font-black uppercase tracking-widest border border-orange-500/20 flex items-center gap-1">
                  <Flame size={8} /> {streak}
                </div>
              )}
              {isEternal && (
                <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border flex items-center gap-1 ${
                  eternalTimer <= 5 ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  <Timer size={8} /> {eternalTimer}s
                </div>
              )}
            </div>
          </div>
          <div className="p-3 bg-slate-900 border border-white/10 rounded-2xl text-yellow-400 font-black flex items-center gap-1.5 shadow-xl text-sm">
            <Trophy size={16} /> {score}
          </div>
        </div>

        {/* Progress Bar (non-eternal only) */}
        {!isEternal && (
          <div className="px-6 flex gap-1.5 mb-4 shrink-0">
            {questions.map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${i < currentIndex ? 'bg-emerald-400' : i === currentIndex ? 'bg-white animate-pulse' : 'bg-slate-900'}`} />
            ))}
          </div>
        )}

        {/* Question Area */}
        <div className="flex-1 px-4 pb-6 flex flex-col justify-center items-center gap-4 max-w-xl mx-auto w-full overflow-hidden">
          <div className="relative shrink-0">
            <div className={`text-5xl sm:text-6xl transition-all duration-500 drop-shadow-xl ${selectedOption !== null ? (selectedOption === q.correctIndex ? 'animate-bounce scale-110' : 'animate-shake opacity-40') : 'animate-float'}`}>
              {selectedOption === null ? (['📜', '🗺️', '🔭', '🎒'][currentIndex % 4]) : (selectedOption === q.correctIndex ? '✨' : '🤕')}
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-3xl p-5 sm:p-6 rounded-[2rem] border border-white/5 shadow-xl relative text-center w-full shrink-0">
            <p className="text-xl sm:text-2xl font-black text-white leading-tight italic tracking-tight drop-shadow-md">{q.question}</p>
          </div>

          <div className="grid gap-2 outline-none w-full pr-1">
            {q.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === q.correctIndex;
              return (
                <button
                  key={idx}
                  disabled={selectedOption !== null}
                  onClick={() => handleAnswer(idx)}
                  className={`group relative p-3 sm:p-4 rounded-xl border text-left font-bold text-base sm:text-lg transition-all flex items-center gap-3 shadow-md active:scale-95 ${selectedOption === null
                    ? 'bg-slate-900/40 border-slate-700 hover:border-indigo-500'
                    : (isSelected
                      ? (isCorrect ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-rose-600 border-rose-400 text-white')
                      : (isCorrect ? 'bg-emerald-600 border-emerald-400 text-white' : 'opacity-40 bg-slate-900 border-slate-800'))
                    }`}
                >
                  <span className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center text-indigo-400 font-mono text-[10px] border border-white/5 shrink-0">{String.fromCharCode(65 + idx)}</span>
                  <span className="flex-1">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* ─── World Selection Menu ─── */
  return (
    <div className="h-full flex flex-col p-4 animate-fade-in custom-scrollbar overflow-y-auto bg-[#050810]">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => onNavigate && onNavigate(View.HOME)}
          className="flex items-center gap-1.5 bg-slate-900/60 border border-white/10 px-3 py-1.5 rounded-xl text-slate-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
        >
          <Home size={14} /> EXIT TO HUB
        </button>
        <div className="bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full text-indigo-400 text-[8px] font-black uppercase tracking-[0.3em] flex items-center gap-1.5">
          <BrainCircuit size={10} /> {t('activities.header')}
        </div>
      </div>

      <header className="text-center mb-6">
        <h1 className="font-display text-3xl sm:text-4xl text-white italic tracking-tight drop-shadow-md mb-1">{t('activities.header')}</h1>
        <p className="text-slate-500 text-sm font-medium tracking-tight px-4">{t('activities.description')}</p>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-20 max-w-5xl mx-auto w-full">
        {BIBLE_WORLDS.map((world, idx) => {
          const isUnlocked = idx <= bibleProgress;
          const isCurrent = idx === bibleProgress;
          const tierProgress = getWorldTierProgress(world.id);
          return (
            <button
              key={world.id}
              disabled={!isUnlocked}
              onClick={() => openTierSelect(world.id)}
              className={`group relative p-3 sm:p-4 rounded-[1.5rem] border transition-all flex flex-col items-center text-center overflow-hidden shadow-lg ${isUnlocked
                ? (isCurrent ? 'bg-indigo-600 border-indigo-400 hover:scale-[1.03]' : 'bg-slate-900 border-white/10 hover:border-indigo-500 hover:-translate-y-1')
                : 'bg-slate-950/50 border-slate-900/50 opacity-50 grayscale pointer-events-none'
                }`}
            >
              {!isUnlocked && <Lock className="absolute top-3 right-3 text-slate-700" size={14} />}
              {isUnlocked && isCurrent && <Sparkles className="absolute top-3 right-3 text-yellow-300 animate-pulse" size={14} />}

              <div className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-3 drop-shadow-md">{world.icon}</div>
              <h3 className="text-xs sm:text-sm font-black text-white italic tracking-tight mb-1 uppercase leading-tight">{world.label}</h3>
              <p className="text-indigo-400 font-bold text-[7px] sm:text-[8px] uppercase tracking-widest opacity-70 group-hover:opacity-100 leading-tight">{world.desc}</p>

              {/* Tier progress dots */}
              {isUnlocked && (
                <div className="flex gap-1 mt-2">
                  {SCROLL_TIERS.slice(0, 4).map((td) => (
                    <div key={td.tier} className={`w-2 h-2 rounded-full ${tierProgress >= td.tier ? 'bg-yellow-400' : 'bg-slate-700'}`} />
                  ))}
                  <div className={`w-2 h-2 rounded-full ${tierProgress >= 5 ? 'bg-purple-400' : 'bg-slate-800'}`} />
                </div>
              )}

              {isUnlocked && stats.badges.includes(world.badge) && (
                <div className="mt-1.5 px-2 py-0.5 bg-yellow-400/20 text-yellow-400 rounded-full text-[7px] font-black uppercase tracking-[0.2em] border border-yellow-400/30 flex items-center gap-1">
                  <Crown size={8} /> {world.badge}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .animate-shake { animation: shake 0.2s linear 3; }
      `}</style>
    </div>
  );
};

export default ActivitiesPage;
