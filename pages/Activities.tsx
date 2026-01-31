
import React, { useState, useEffect, useRef } from 'react';
import { StorageService } from '../services/storage';
import { AIService } from '../services/ai';
import { AudioService } from '../services/audio';
import { View } from '../types';
import { 
  Loader2, BrainCircuit, Trophy, Star, Music, Book, 
  ArrowRight, Check, X, ArrowLeft, Zap, ScrollText, Music2, Goal, 
  AlertCircle, RefreshCcw, Flame, Crown, Sparkles, Lock, Home
} from 'lucide-react';

interface ActivitiesPageProps {
    onNavigate?: (view: View) => void;
}

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  funnyComment?: string;
}

const BIBLE_WORLDS = [
  { id: 'creation', label: 'The Beginning', icon: '🌍', desc: 'Creation & Eden', badge: 'Genesis Star' },
  { id: 'heroes', label: 'Ancient Heroes', icon: '🚢', desc: 'Noah & Moses', badge: 'Ark Builder' },
  { id: 'brave', label: 'Brave Hearts', icon: '🦁', desc: 'David & Daniel', badge: 'Lion Heart' },
  { id: 'miracles', label: 'Jesus’ Miracles', icon: '🍞', desc: 'Water & Bread', badge: 'Healer' },
  { id: 'promise', label: 'The Big Promise', icon: '🕊️', desc: 'Easter & Beyond', badge: 'Spirit Guide' }
];

const CATEGORY_META = {
    Bible: { label: 'Bible Quest', color: 'from-amber-600 to-orange-800', accent: 'text-amber-400', icon: ScrollText, music: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3' },
    Music: { label: 'Melody Master', color: 'from-pink-600 to-rose-800', accent: 'text-pink-400', icon: Music2, music: 'https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3' },
    Football: { label: 'Football Pro', color: 'from-emerald-600 to-teal-800', accent: 'text-emerald-400', icon: Goal, music: 'https://cdn.pixabay.com/download/audio/2022/02/12/audio_f5f661d431.mp3' }
};

const CorrectionCard: React.FC<{ 
  question: Question; 
  selectedIndex: number; 
  onNext: () => void 
}> = ({ question, selectedIndex, onNext }) => {
    useEffect(() => {
        AudioService.speak(`Incorrect. ${question.explanation}`);
    }, [question]);

    return (
        <div className="absolute inset-x-0 bottom-0 top-[20%] z-[60] bg-slate-950/95 backdrop-blur-3xl rounded-t-[3rem] border-t-4 border-rose-500 p-6 sm:p-10 flex flex-col animate-slide-up shadow-[0_-40px_100px_rgba(244,63,94,0.3)]">
            <div className="flex-1 overflow-y-auto custom-scrollbar mb-4">
                <div className="flex items-center gap-3 mb-4 text-rose-400">
                    <X size={32} className="bg-rose-500/20 p-1.5 rounded-xl" />
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter">Incorrect</h3>
                </div>
                
                <p className="text-white text-lg mb-6 font-medium leading-tight opacity-90">
                    Choosing <span className="text-rose-400 font-black italic">"{question.options[selectedIndex]}"</span> {question.funnyComment || "doesn't quite match the story this time!"}
                </p>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-4">
                   <p className="text-emerald-400 font-black text-[9px] uppercase tracking-[0.3em] mb-2">The Correct Answer Is</p>
                   <h4 className="text-2xl font-black text-white mb-2 italic tracking-tight">{question.options[question.correctIndex]}</h4>
                   <p className="text-slate-300 text-sm leading-relaxed font-sans">{question.explanation}</p>
                </div>
            </div>

            <button 
                onClick={onNext}
                className="w-full py-5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xl rounded-2xl shadow-[0_6px_0_rgb(159,18,57)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3"
            >
                CONTINUE JOURNEY <ArrowRight size={22}/>
            </button>
        </div>
    );
};

const ActivitiesPage: React.FC<ActivitiesPageProps> = ({ onNavigate }) => {
  const profile = StorageService.getCurrentProfile();
  const [mode, setMode] = useState<'MENU' | 'PLAYING'>('MENU');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showCorrection, setShowCorrection] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [selectedWorldId, setSelectedWorldId] = useState('creation');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stats = StorageService.getGameStats();
  const bibleProgress = stats.quizProgress.find(p => p.category === 'Bible')?.bibleWorldLevel || 0;

  useEffect(() => { 
    return () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
    };
  }, []);

  const startLevel = async (worldId: string) => {
    const world = BIBLE_WORLDS.find(w => w.id === worldId);
    setSelectedWorldId(worldId);
    setLoading(true);
    setMode('PLAYING');
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setShowCorrection(false);
    setSelectedOption(null);
    setShowVictory(false);
    
    if (audioRef.current) {
        audioRef.current.pause();
    }
    audioRef.current = new Audio(CATEGORY_META.Bible.music);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.05;
    audioRef.current.play().catch(() => {});

    AudioService.speak(`${world?.label} Tournament. Let's find out how much you know!`);
    
    try {
        const q = await AIService.generateQuiz('Bible', 1, world?.label, profile?.age || 6);
        if (q && q.length > 0) {
            setQuestions(q);
            setLoading(false);
            setTimeout(() => AudioService.speak(q[0].question), 800);
        } else {
            throw new Error("No questions generated.");
        }
    } catch (e) {
        console.error("Failed to load quiz", e);
        setLoading(false);
        setMode('MENU');
        alert("The magic scrolls are dusty! Please try again.");
    }
  };

  const handleAnswer = (index: number) => {
    if (selectedOption !== null || questions.length === 0) return;
    setSelectedOption(index);
    const isCorrect = index === questions[currentIndex].correctIndex;
    
    if (isCorrect) {
      AudioService.playEffect('correct');
      setScore(s => s + 1);
      setStreak(s => s + 1);
      const currentQ = questions[currentIndex];
      AudioService.speak(currentQ.funnyComment || "Brilliant! Correct!");
      
      setTimeout(() => {
          advanceToNext();
      }, 1500);
    } else {
      AudioService.playEffect('wrong');
      setStreak(0);
      setShowCorrection(true);
    }
  };

  const advanceToNext = () => {
    setShowCorrection(false);
    setSelectedOption(null);
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setTimeout(() => AudioService.speak(questions[nextIdx].question), 500);
    } else {
      const passed = score >= 3;
      if (passed) {
         const newStats = { ...stats };
         const bibleIdx = newStats.quizProgress.findIndex(p => p.category === 'Bible');
         const currentWorldIdx = BIBLE_WORLDS.findIndex(w => w.id === selectedWorldId);
         
         if (bibleIdx >= 0) {
            newStats.quizProgress[bibleIdx].bibleWorldLevel = Math.max(newStats.quizProgress[bibleIdx].bibleWorldLevel || 0, currentWorldIdx + 1);
         }
         
         newStats.xp += 150;
         const badge = BIBLE_WORLDS[currentWorldIdx].badge;
         if (!newStats.badges.includes(badge)) newStats.badges.push(badge);
         
         StorageService.saveGameStats(newStats);
         setShowVictory(true);
         AudioService.speak(`Masterful! You earned the ${badge} badge!`);
      } else {
          setMode('MENU');
          AudioService.speak("Tough round! Let's study more and try again.");
      }
    }
  };

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center p-10 text-center space-y-8 animate-fade-in bg-[#050810]">
        <div className="relative">
            <Loader2 className="w-24 h-24 text-indigo-400 animate-spin"/>
            <div className="absolute inset-0 flex items-center justify-center text-3xl">📜</div>
        </div>
        <div>
            <h2 className="text-3xl font-display text-white mb-2 animate-pulse tracking-tight">Gathering Ancient Scrolls...</h2>
            <p className="text-indigo-400 font-black uppercase tracking-widest text-[10px]">Preparing your mission</p>
        </div>
    </div>
  );

  if (mode === 'PLAYING' && questions.length > 0) {
    const q = questions[currentIndex];
    const world = BIBLE_WORLDS.find(w => w.id === selectedWorldId);
    
    return (
      <div className="h-full flex flex-col relative animate-fade-in bg-[#050810] overflow-hidden">
        {showVictory && (
            <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/95 p-8 backdrop-blur-3xl animate-fade-in">
                <div className="text-center max-w-sm animate-float">
                    <div className="text-8xl mb-8 drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]">{world?.icon}</div>
                    <h2 className="text-5xl font-display text-yellow-400 mb-2 italic tracking-tighter uppercase">Victory!</h2>
                    <p className="text-white text-lg font-bold mb-6">You Conquered {world?.label}!</p>
                    <div className="bg-indigo-600/30 p-6 rounded-[2rem] border border-white/10 mb-6">
                        <div className="flex items-center justify-center gap-3 text-white font-black text-3xl mb-1">
                             <Zap className="text-yellow-300" /> +150
                        </div>
                        <p className="text-indigo-300 font-black uppercase text-[9px] tracking-widest">XP EARNED</p>
                    </div>
                    <button onClick={() => setMode('MENU')} className="w-full py-5 bg-yellow-500 hover:bg-yellow-400 text-black font-black text-xl rounded-2xl shadow-[0_6px_0_rgb(161,98,7)] transition-all active:scale-95">RETURN TO HUB</button>
                </div>
            </div>
        )}

        {showCorrection && q && (
            <CorrectionCard question={q} selectedIndex={selectedOption!} onNext={advanceToNext} />
        )}

        {/* HUD - Compact */}
        <div className="flex justify-between items-center p-4 pt-2 z-10 shrink-0">
            <button onClick={() => { setMode('MENU'); if(audioRef.current) audioRef.current.pause(); }} className="p-3 bg-slate-900 border border-white/10 rounded-2xl text-white hover:bg-slate-800 transition-all shadow-xl"><ArrowLeft size={20}/></button>
            <div className="text-center">
                <h3 className="font-display text-2xl text-white italic tracking-tighter">{world?.label}</h3>
                <div className="flex items-center justify-center gap-1.5 mt-0.5">
                    <div className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-full text-[8px] font-black uppercase tracking-widest border border-indigo-500/20">Quest {currentIndex + 1}/{questions.length}</div>
                    {streak > 1 && <div className="px-2 py-0.5 bg-orange-500/10 text-orange-400 rounded-full text-[8px] font-black uppercase tracking-widest border border-orange-500/20 flex items-center gap-1"><Flame size={8}/> {streak} Streak</div>}
                </div>
            </div>
            <div className="p-3 bg-slate-900 border border-white/10 rounded-2xl text-yellow-400 font-black flex items-center gap-1.5 shadow-xl text-sm">
                <Trophy size={16}/> {score}
            </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 flex gap-1.5 mb-4 shrink-0">
            {questions.map((_, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${i < currentIndex ? 'bg-emerald-400' : i === currentIndex ? 'bg-white animate-pulse' : 'bg-slate-900'}`}/>
            ))}
        </div>

        {/* Question Area - True to View */}
        <div className="flex-1 px-4 pb-6 flex flex-col justify-center items-center gap-4 sm:gap-6 max-w-xl mx-auto w-full overflow-hidden">
            <div className="relative shrink-0">
                <div className={`text-7xl sm:text-8xl transition-all duration-500 drop-shadow-2xl ${selectedOption !== null ? (selectedOption === q.correctIndex ? 'animate-bounce scale-110' : 'animate-shake opacity-40') : 'animate-float'}`}>
                    {selectedOption === null ? (['📜','🗺️','🔭','🎒'][currentIndex % 4]) : (selectedOption === q.correctIndex ? '✨' : '🤕')}
                </div>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-3xl p-6 sm:p-8 rounded-[2.5rem] border-2 border-white/5 shadow-2xl relative text-center w-full shrink-0">
                <p className="text-2xl sm:text-3xl font-black text-white leading-tight italic tracking-tighter drop-shadow-lg">{q.question}</p>
            </div>

            <div className="grid gap-2.5 w-full overflow-y-auto custom-scrollbar pr-1 max-h-[45%]">
                {q.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === q.correctIndex;
                    return (
                        <button 
                            key={idx}
                            disabled={selectedOption !== null}
                            onClick={() => handleAnswer(idx)}
                            className={`group relative p-4 sm:p-5 rounded-2xl border-2 text-left font-black text-lg sm:text-xl transition-all flex items-center gap-4 shadow-lg active:scale-95 ${
                                selectedOption === null 
                                    ? 'bg-slate-900/40 border-slate-800 hover:border-indigo-500' 
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

  return (
    <div className="h-full flex flex-col p-4 animate-fade-in custom-scrollbar overflow-y-auto bg-[#050810]">
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => onNavigate && onNavigate(View.HOME)} 
            className="flex items-center gap-2 bg-slate-900/60 border border-white/10 px-4 py-2 rounded-xl text-slate-400 hover:text-white transition-all text-xs font-black uppercase tracking-widest"
          >
             <Home size={16}/> EXIT TO HUB
          </button>
          <div className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full text-indigo-400 text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
             <BrainCircuit size={12}/> Academic Center
          </div>
      </div>

      <header className="text-center mb-8">
        <h1 className="font-display text-6xl text-white italic tracking-tighter drop-shadow-2xl mb-2">Bible Quest</h1>
        <p className="text-slate-500 text-lg font-medium tracking-tight px-4">Journey through history's greatest adventures!</p>
      </header>

      {/* World Selection Grid - Optimized */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-20 max-w-6xl mx-auto w-full">
          {BIBLE_WORLDS.map((world, idx) => {
              const isUnlocked = idx <= bibleProgress;
              const isCurrent = idx === bibleProgress;
              return (
                  <button 
                    key={world.id}
                    disabled={!isUnlocked}
                    onClick={() => startLevel(world.id)}
                    className={`group relative p-8 rounded-[3rem] border-2 transition-all flex flex-col items-center text-center overflow-hidden shadow-2xl ${
                        isUnlocked 
                            ? (isCurrent ? 'bg-indigo-600 border-indigo-400 hover:scale-105' : 'bg-slate-900 border-slate-800 hover:border-indigo-500 hover:-translate-y-2') 
                            : 'bg-slate-950/50 border-slate-900 opacity-40 grayscale pointer-events-none'
                    }`}
                  >
                      {!isUnlocked && <Lock className="absolute top-6 right-6 text-slate-700" size={20}/>}
                      {isUnlocked && isCurrent && <Sparkles className="absolute top-6 right-6 text-yellow-300 animate-pulse" size={20}/>}
                      
                      <div className="text-7xl mb-4 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-6 drop-shadow-xl">{world.icon}</div>
                      <h3 className="text-2xl font-black text-white italic tracking-tighter mb-1 uppercase leading-tight">{world.label}</h3>
                      <p className="text-indigo-400 font-black text-[9px] uppercase tracking-widest opacity-60 group-hover:opacity-100">{world.desc}</p>
                      
                      {isUnlocked && stats.badges.includes(world.badge) && (
                          <div className="mt-6 px-3 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border border-yellow-400/30 flex items-center gap-1.5">
                             <Crown size={10}/> {world.badge}
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
