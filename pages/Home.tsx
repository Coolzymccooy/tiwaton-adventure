
import React, { useEffect, useState } from 'react';
import { View } from '../types';
import type { DailyLearningPath, DailyLearningTask, FamilyProfile, GameStat, LearningSubject, ParentComment } from '../types';
import { StorageService } from '../services/storage';
import { Palette, MessageCircle, ShieldCheck, LogOut, Lock, Star, Sparkles, TrendingUp, Trophy, ArrowRight, X, CheckCircle2, Clock, Target } from 'lucide-react';
import DailyQuestBanner from '../components/DailyQuestBanner';
import { getTodayChallenges, isChallengeCompleted } from '../services/daily-challenges';
import { useI18n } from '../i18n/I18nProvider';

interface HomeProps {
  onNavigate: (view: View) => void;
  profile: FamilyProfile;
  setProfile: (p: FamilyProfile) => void;
  onLogout: () => void;
  isAdminMode: boolean;
  setIsAdminMode: (val: boolean) => void;
}

const subjectStyles: Record<LearningSubject, { icon: string; label: string; color: string; glow: string }> = {
  ENGLISH: { icon: '📚', label: 'English', color: 'from-violet-500 to-indigo-500', glow: 'bg-violet-500/10 text-violet-300 border-violet-500/20' },
  MATH: { icon: '🧮', label: 'Math', color: 'from-emerald-500 to-teal-500', glow: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
  ART: { icon: '🎨', label: 'Creative', color: 'from-pink-500 to-rose-500', glow: 'bg-pink-500/10 text-pink-300 border-pink-500/20' },
  STORY: { icon: '📖', label: 'Reading', color: 'from-amber-500 to-orange-500', glow: 'bg-amber-500/10 text-amber-300 border-amber-500/20' },
  BIBLE: { icon: '✨', label: 'Wisdom', color: 'from-sky-500 to-cyan-500', glow: 'bg-sky-500/10 text-sky-300 border-sky-500/20' }
};

const todayKey = () => new Date().toISOString().slice(0, 10);

const makeTask = (
  id: string,
  subject: LearningSubject,
  title: string,
  description: string,
  skill: string,
  why: string,
  targetView: View,
  xp: number,
  estimatedMinutes: number
): DailyLearningTask => ({
  id,
  subject,
  title,
  description,
  skill,
  why,
  targetView,
  xp,
  estimatedMinutes,
  completed: false
});

const buildDailyLearningPath = (profile: FamilyProfile, stats: GameStat): DailyLearningPath => {
  const date = todayKey();
  const mathFocus = stats.mathLevel <= 2 ? 'Number Galaxy warm-up' : 'Challenge a new math planet';
  const englishTitle = profile.age <= 8 ? 'Word Explorer Quest' : 'AI English Mission';
  const creativeTask = stats.xp < 500 ? 'Draw your learning hero' : 'Paint today’s adventure scene';
  const englishLevel = stats.wordQuestProgress?.level || 1;
  const focusSkill = englishLevel <= stats.mathLevel ? 'English confidence' : 'Math fluency';

  return {
    id: `path-${profile.id}-${date}`,
    date,
    childId: profile.id,
    childName: profile.name,
    focusSkill,
    streakDay: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    tasks: [
      makeTask('english-quest', 'ENGLISH', englishTitle, 'Practice vocabulary, spelling, or reading in the English Quest.', 'Vocabulary + comprehension', 'Your English level is used to choose a friendly challenge.', View.GAMES, 120, 8),
      makeTask('math-sprint', 'MATH', mathFocus, 'Play one focused math round matched to your current level.', 'Number fluency', 'Your math level decides whether today starts with warm-up or challenge work.', View.GAMES, 100, 7),
      makeTask('creative-draw', 'ART', creativeTask, 'Create a quick picture and save it to your gallery.', 'Creative expression', 'Drawing helps kids explain what they learned in their own way.', View.DRAWING, 90, 6),
      makeTask('story-time', 'STORY', 'Read or build one mini story', 'Reading stamina', 'Short stories improve focus, sequence, and imagination.', View.STORIES, 80, 5),
      makeTask('wisdom-quiz', 'BIBLE', 'Finish one wisdom quiz', 'Complete a short quiz to earn XP and keep your streak alive.', 'Recall + values', 'A quick quiz keeps confidence high without overwhelming the child.', View.ACTIVITIES, 70, 5)
    ]
  };
};

const buildMasterySignals = (stats: GameStat, dailyProgress: number) => {
  const english = Math.min(100, ((stats.wordQuestProgress?.level || 1) - 1) * 18 + dailyProgress * 0.25 + 20);
  const math = Math.min(100, (stats.mathLevel || 1) * 14 + dailyProgress * 0.2 + 18);
  const consistency = Math.min(100, dailyProgress + Math.min(stats.xp, 1000) / 20);
  return [
    { label: 'English Growth', value: Math.round(english), detail: 'Vocabulary, spelling, reading' },
    { label: 'Math Fluency', value: Math.round(math), detail: 'Number sense and problem solving' },
    { label: 'Learning Habit', value: Math.round(consistency), detail: 'Daily path completion and XP' }
  ];
};

const Home: React.FC<HomeProps> = ({ onNavigate, profile, setProfile, onLogout, isAdminMode, setIsAdminMode }) => {
  const [stats, setStats] = useState<GameStat>(StorageService.getGameStats());
  const [comments, setComments] = useState<ParentComment[]>([]);
  const [familyProfiles, setFamilyProfiles] = useState<FamilyProfile[]>([]);
  const [dailyPath, setDailyPath] = useState<DailyLearningPath | null>(null);

  const [pinInput, setPinInput] = useState('');
  const [showPinPad, setShowPinPad] = useState(false);
  const { locale } = useI18n();

  useEffect(() => {
    let cancelled = false;
    const latestStats = StorageService.getGameStats();
    setStats(latestStats);
    setFamilyProfiles(StorageService.getProfiles().sort((a, b) => (a.id === 'admin' ? -1 : 1)));
    StorageService.getComments().then(items => {
      if (!cancelled) setComments(items);
    });

    const cachedPath = StorageService.getDailyLearningPath(profile.id);
    const needsFreshPath = !cachedPath || cachedPath.date !== todayKey() || !cachedPath.focusSkill || cachedPath.tasks.some(task => !task.skill || !task.why);
    const activePath = needsFreshPath ? buildDailyLearningPath(profile, latestStats) : cachedPath;
    if (needsFreshPath) {
      StorageService.saveDailyLearningPath(activePath);
    }
    setDailyPath(activePath);
    return () => {
      cancelled = true;
    };
  }, [profile.id, profile.name]);

  const handleLogoutClick = () => onLogout();

  const handleHqClick = () => {
    if (isAdminMode) {
      if (profile.role === 'TEACHER' || profile.mode === 'TEACHER') onNavigate(View.TEACHER_DASHBOARD);
      else onNavigate(View.PARENT_DASHBOARD);
    }
    else setShowPinPad(true);
  };

  const verifyPinForHQ = () => {
    // Re-fetch profiles directly to ensure we have the latest data
    const allProfiles = StorageService.getProfiles();
    const parent = allProfiles.find(p => p.mode === 'PARENT' || p.mode === 'TEACHER' || p.role === 'TEACHER' || p.id === 'admin');

    if (!parent?.pin) {
      // PIN not yet loaded (Firestore sync still in progress) — ask user to wait
      alert("Still loading credentials. Please try again in a moment.");
      setPinInput('');
      return;
    }

    if (pinInput === parent.pin) {
      setIsAdminMode(true);
      if (parent.role === 'TEACHER' || parent.mode === 'TEACHER') onNavigate(View.TEACHER_DASHBOARD);
      else onNavigate(View.PARENT_DASHBOARD);
      setShowPinPad(false);
      setPinInput('');
    } else {
      alert("Incorrect Parent PIN. Please try again.");
      setPinInput('');
    }
  };

  const closePinPad = () => {
    setShowPinPad(false);
    setPinInput('');
  };

  const handleDailyTaskClick = (task: DailyLearningTask) => {
    const updated = StorageService.completeDailyLearningTask(task.id, profile.id);
    if (updated) setDailyPath(updated);
    onNavigate(task.targetView);
  };

  const completedDailyTasks = dailyPath?.tasks.filter(task => task.completed).length || 0;
  const dailyTaskTotal = dailyPath?.tasks.length || 0;
  const dailyProgress = dailyTaskTotal ? Math.round((completedDailyTasks / dailyTaskTotal) * 100) : 0;
  const masterySignals = buildMasterySignals(stats, dailyProgress);
  const coachNote = dailyPath
    ? `${dailyPath.focusSkill} is today’s focus. Finish ${Math.max(dailyTaskTotal - completedDailyTasks, 0)} more quest${dailyTaskTotal - completedDailyTasks === 1 ? '' : 's'} to protect the streak.`
    : 'Your coach is preparing today’s path.';

  // Mock leaderboard data (in a real app, this would be computed from storage for each user)
  const leaderboardData = familyProfiles.map(p => ({
    name: p.name,
    avatar: p.avatar,
    xp: p.id === profile.id ? stats.xp : Math.floor(Math.random() * 500) + 100,
    id: p.id
  })).sort((a, b) => b.xp - a.xp);

  return (
    <div className="space-y-6 animate-fade-in pb-24 max-w-5xl mx-auto px-4 sm:px-6">

      {/* PIN PAD MODAL */}
      {showPinPad && (
        <div className="fixed inset-0 z-[100] bg-slate-950/98 backdrop-blur-2xl flex items-center justify-center p-4 overflow-y-auto custom-scrollbar">
          <div className="bg-[#0b1120] p-6 sm:p-12 rounded-[3.5rem] border border-white/5 w-full max-w-md text-center shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative animate-scale-in my-8 shrink-0">

            {/* RETURN BUTTON */}
            <button
              onClick={closePinPad}
              className="absolute top-8 right-8 p-3 text-slate-500 hover:text-white transition-colors bg-white/5 rounded-2xl"
              aria-label="Close"
            >
              <X size={24} />
            </button>

            <div className="mb-10">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
                <Lock size={40} className="text-indigo-400" />
              </div>
              <h3 className="text-4xl font-display text-white mb-2 italic tracking-tighter">Admin Only</h3>
              <p className="text-slate-500 text-[10px] uppercase tracking-[0.4em] font-black">Verify Parent Identity</p>
            </div>

            <div className="flex justify-center mb-12 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${pinInput.length > i ? 'bg-indigo-400 border-indigo-400 scale-125 shadow-[0_0_15px_rgba(129,140,248,0.5)]' : 'bg-transparent border-slate-700'}`}></div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-10 max-w-xs mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                <button
                  key={n}
                  onClick={() => pinInput.length < 4 && setPinInput(p => p + n.toString())}
                  className="p-6 bg-slate-900/60 rounded-[1.5rem] text-3xl font-black text-white active:scale-90 hover:bg-slate-800 transition-all border border-white/5"
                >
                  {n}
                </button>
              ))}
              <button onClick={() => setPinInput('')} className="p-6 text-rose-500 font-black text-xs uppercase tracking-widest hover:bg-rose-500/10 rounded-2xl transition-all">CLR</button>
              <button
                onClick={() => pinInput.length < 4 && setPinInput(p => p + '0')}
                className="p-6 bg-slate-900/60 rounded-[1.5rem] text-3xl font-black text-white active:scale-90 hover:bg-slate-800 transition-all border border-white/5"
              >
                0
              </button>
              <button onClick={closePinPad} className="p-6 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-white/5 rounded-2xl transition-all">ESC</button>
            </div>

            <button
              onClick={verifyPinForHQ}
              disabled={pinInput.length < 4}
              className="w-full py-6 bg-indigo-600 disabled:opacity-30 rounded-[2rem] font-black text-2xl hover:bg-indigo-500 text-white shadow-2xl transition-all border-b-4 border-indigo-900 active:translate-y-1 active:border-b-0"
            >
              UNLOCK HUB
            </button>
          </div>
        </div>
      )}

      {/* Profile Header */}
      <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-slate-900 border border-white/5 p-5 sm:p-6 shadow-2xl flex flex-col md:flex-row items-center gap-6">
        <div className="relative shrink-0">
          <div className="text-6xl sm:text-7xl bg-slate-800 rounded-3xl p-4 sm:p-5 border-2 border-indigo-500/30 shadow-2xl">
            {profile.avatar}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-indigo-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-black border-[3px] border-slate-900 text-xs text-center">
            {stats.level}
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h2 className="font-display text-4xl sm:text-5xl text-white mb-2 italic tracking-tighter">Hey, {profile.name}!</h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
            <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20 flex items-center gap-1.5">
              <TrendingUp size={12} /> Level {stats.level}
            </span>
            <span className="px-4 py-1.5 bg-amber-500/10 text-amber-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-500/20 flex items-center gap-1.5">
              <Sparkles size={12} /> {stats.xp} XP
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={handleHqClick} className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3.5 rounded-full text-xs font-black transition-all border-b-4 border-slate-950 active:translate-y-1">
            <ShieldCheck size={18} className={isAdminMode ? "text-emerald-400" : "text-slate-400"} /> {isAdminMode ? 'DASHBOARD' : 'HQ'}
          </button>
          <button onClick={handleLogoutClick} className="p-3.5 bg-slate-800 hover:bg-red-900/30 text-slate-500 hover:text-red-400 rounded-full border-b-4 border-slate-950 active:translate-y-1">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          {/* Personalized Daily Learning Path */}
          {dailyPath && (
            <div className="bg-slate-900 border border-white/5 rounded-[2rem] p-5 sm:p-6 shadow-2xl overflow-hidden relative">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div>
                  <p className="text-[9px] font-black text-indigo-300 uppercase tracking-[0.35em] mb-2 flex items-center gap-2">
                    <Target size={14} /> Personalized Daily Path
                  </p>
                  <h3 className="font-display text-3xl sm:text-4xl text-white italic tracking-tighter">Today’s quests for {profile.name}</h3>
                  <p className="text-xs text-slate-400 font-bold mt-1">A balanced plan across English, math, creativity, reading, and wisdom.</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-center">
                  <p className="text-2xl font-black text-white">{completedDailyTasks}/{dailyTaskTotal}</p>
                  <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Done</p>
                </div>
              </div>

              <div className="relative z-10 mb-5">
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 transition-all duration-700" style={{ width: `${dailyProgress}%` }}></div>
                </div>
                <div className="flex justify-between mt-2 text-[9px] font-black uppercase tracking-widest text-slate-500">
                  <span>{dailyProgress}% complete</span>
                  <span>{dailyPath.tasks.reduce((total, task) => total + task.estimatedMinutes, 0)} min plan</span>
                </div>
              </div>

              <div className="relative z-10 grid sm:grid-cols-2 gap-3">
                {dailyPath.tasks.map(task => {
                  const style = subjectStyles[task.subject];
                  return (
                    <button
                      key={task.id}
                      onClick={() => handleDailyTaskClick(task)}
                      className={`text-left p-4 rounded-2xl border transition-all group ${task.completed ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-950/60 border-white/5 hover:border-indigo-400/50 hover:-translate-y-1'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${style.color} flex items-center justify-center text-2xl shadow-lg shrink-0`}>
                          {task.completed ? <CheckCircle2 size={24} className="text-white" /> : style.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className={`px-2 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest ${style.glow}`}>{style.label}</span>
                            <span className="text-[9px] text-amber-300 font-black">+{task.xp} XP</span>
                          </div>
                          <h4 className="text-white font-black text-sm sm:text-base leading-tight">{task.title}</h4>
                          <p className="text-[11px] text-slate-400 font-semibold leading-snug mt-1">{task.description}</p>
                          <p className="text-[10px] text-indigo-200 font-bold mt-2">{task.skill}</p>
                          <p className="mt-3 flex items-center gap-1.5 text-[9px] text-slate-500 font-black uppercase tracking-widest">
                            <Clock size={12} /> {task.estimatedMinutes} min • {task.completed ? 'Completed' : 'Tap to start'}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="relative z-10 mt-5 grid md:grid-cols-3 gap-3">
                {masterySignals.map(signal => (
                  <div key={signal.label} className="bg-slate-950/60 border border-white/5 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{signal.label}</p>
                      <p className="text-white font-black">{signal.value}%</p>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-indigo-400" style={{ width: `${signal.value}%` }}></div>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold mt-2">{signal.detail}</p>
                  </div>
                ))}
              </div>

              <div className="relative z-10 mt-4 bg-indigo-500/10 border border-indigo-400/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-[9px] text-indigo-300 font-black uppercase tracking-[0.3em]">AI Coach Note</p>
                  <p className="text-sm text-white font-bold mt-1">{coachNote}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-2xl font-black text-amber-300">{dailyPath.streakDay}</p>
                  <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Day streak</p>
                </div>
              </div>
            </div>
          )}

          {/* Featured Quest */}
          <div onClick={() => onNavigate(View.DRAWING)} className="bg-gradient-to-r from-pink-600 to-purple-600 p-1 rounded-3xl shadow-2xl cursor-pointer hover:scale-[1.02] transition-all group">
            <div className="bg-slate-900/80 backdrop-blur-xl p-5 sm:p-8 rounded-[1.8rem] flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 group-hover:scale-125 transition-transform"></div>
              <div className="flex items-center gap-4 sm:gap-6 relative z-10">
                <div className="bg-white/10 p-3.5 sm:p-5 rounded-2xl animate-float"><Palette size={32} className="text-white" /></div>
                <div>
                  <p className="text-[9px] font-black text-pink-300 uppercase tracking-widest mb-1">Today's Star Quest</p>
                  <h3 className="font-display text-2xl sm:text-3xl text-white">"Paint a Neon Jungle!"</h3>
          {/* Featured Daily Quest */}
          {(() => {
            const todayChallenges = getTodayChallenges(3);
            const featured = todayChallenges.find(c => !isChallengeCompleted(c.id)) || todayChallenges[0];
            if (!featured) return null;
            const done = isChallengeCompleted(featured.id);
            const gradients: Record<string, string> = {
              quiz: 'from-amber-600 to-orange-600',
              drawing: 'from-pink-600 to-purple-600',
              games: 'from-emerald-600 to-teal-600',
              stories: 'from-blue-600 to-indigo-600',
              math: 'from-violet-600 to-fuchsia-600',
            };
            const grad = gradients[featured.category] || 'from-pink-600 to-purple-600';
            return (
              <div onClick={() => !done && onNavigate(featured.targetView)} className={`bg-gradient-to-r ${grad} p-1 rounded-3xl shadow-2xl cursor-pointer hover:scale-[1.02] transition-all group`}>
                <div className="bg-slate-900/80 backdrop-blur-xl p-5 sm:p-8 rounded-[1.8rem] flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 group-hover:scale-125 transition-transform"></div>
                  <div className="flex items-center gap-4 sm:gap-6 relative z-10">
                    <div className="bg-white/10 p-3.5 sm:p-5 rounded-2xl animate-float text-4xl">{featured.icon}</div>
                    <div>
                      <p className="text-[9px] font-black text-white/70 uppercase tracking-widest mb-1">Today's Quest</p>
                      <h3 className="font-display text-2xl sm:text-3xl text-white">{featured.title[locale]}</h3>
                      <p className="text-xs text-white/60 mt-1">{featured.description[locale]}</p>
                    </div>
                  </div>
                  <div className={`px-6 py-3 rounded-full font-black text-sm uppercase tracking-widest shadow-xl transition-colors mt-4 md:mt-0 ${done ? 'bg-emerald-500 text-white' : 'bg-white text-slate-900 group-hover:bg-slate-100'}`}>
                    {done ? 'DONE!' : `START +${featured.xpReward} XP`}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Grid Menu */}
          <div className="grid grid-cols-2 gap-6">
            <LaunchCard icon="🧠" label="Brain Quiz" color="bg-indigo-600" onClick={() => onNavigate(View.ACTIVITIES)} />
            <LaunchCard icon="👾" label="Game Zone" color="bg-emerald-600" onClick={() => onNavigate(View.GAMES)} />
            <LaunchCard icon="🎭" label="Art Studio" color="bg-pink-600" onClick={() => onNavigate(View.DRAWING)} />
            <LaunchCard icon="📖" label="Adventures" color="bg-amber-600" onClick={() => onNavigate(View.STORIES)} />
          </div>
        </div>

        {/* Sidebar Area: Daily Quests + Leaderboard */}
        <div className="lg:col-span-4 space-y-6">
          <DailyQuestBanner onNavigate={onNavigate} />
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 sm:p-3 bg-indigo-600/20 rounded-xl"><Trophy className="text-indigo-400" size={20} /></div>
              <div>
                <h4 className="text-xl sm:text-2xl font-black text-white italic tracking-tighter uppercase">Leaderboard</h4>
                <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Global Standings</p>
              </div>
            </div>

            <div className="space-y-3">
              {leaderboardData.map((user, idx) => (
                <div key={user.id} className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${user.name === profile.name ? 'bg-indigo-600 border-indigo-400 shadow-md' : 'bg-slate-800/40 border-white/5'}`}>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-lg font-black text-slate-500 w-4 italic">{idx + 1}</span>
                    <span className="text-2xl sm:text-3xl">{user.avatar}</span>
                    <span className="text-xs font-black text-white uppercase tracking-tighter italic whitespace-pre-wrap truncate max-w-[80px] sm:max-w-[120px]">{user.name}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-black text-white">{user.xp}</p>
                    <p className="text-[8px] font-black text-indigo-300 uppercase tracking-tighter">XP</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate(View.ACTIVITIES)}
              className="w-full mt-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center justify-center gap-2 group transition-all shrink-0"
            >
              GO EARN XP <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Love Note from Parents */}
          {comments.length > 0 && (
            <div className="bg-pink-600/10 border border-pink-500/20 rounded-3xl p-5 sm:p-6 animate-slide-up">
              <MessageCircle className="text-pink-400 mb-3" size={24} />
              <p className="text-lg text-slate-200 font-medium italic leading-snug">"{comments[0].text}"</p>
              <p className="text-[9px] text-pink-400 font-black uppercase tracking-widest mt-4">— From Admin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LaunchCard = ({ icon, label, color, onClick }: any) => (
  <button onClick={onClick} className="group bg-slate-900 p-5 sm:p-8 rounded-[1.8rem] border border-slate-800 hover:border-indigo-500 transition-all hover:-translate-y-2 shadow-2xl relative overflow-hidden flex flex-col items-center">
    <div className={`absolute top-0 left-0 w-full h-1.5 ${color}`}></div>
    <div className="text-5xl sm:text-6xl group-hover:scale-125 transition-transform duration-500 group-hover:rotate-6 mb-3">{icon}</div>
    <span className="font-black text-white uppercase tracking-widest text-[9px] sm:text-[10px] opacity-60 group-hover:opacity-100">{label}</span>
  </button>
);

export default Home;
