
import React, { useState, useEffect, useMemo } from 'react';
import { StorageService } from '../services/storage';
import { getInsightsSummary, InsightSummary } from '../services/insights';
import { FamilyProfile, Drawing, EnglishProgress, DailyLearningPath } from '../types';
import { computeDashboardAnalytics, computeProfileAnalytics, type DashboardAnalytics, type ProfileAnalytics } from '../services/analytics-engine';
import {
  Users, Activity, Star, Trash2,
  ChevronRight, ArrowLeft, BarChart3, Clock,
  TrendingUp, Eye, Sparkles, Heart, LayoutDashboard,
  Palette, Edit2, Key, Save, BookOpen, Languages,
  Flame, CheckCircle2, Trophy, Zap, Target,
  Gamepad2, PenTool, Brain, Crown, Shield,
  ChevronDown, ChevronUp,
} from 'lucide-react';
import { getTodayChallenges, isChallengeCompleted, getTodayCompletionCount } from '../services/daily-challenges';

interface ParentDashboardProps {
  onBack: () => void;
}

// ─── Skill Radar (CSS-based pentagon) ───

const SkillRadar: React.FC<{ skills: ProfileAnalytics['skills']; size?: number }> = ({ skills, size = 160 }) => {
  const categories = [
    { key: 'math', label: 'Math', color: '#818cf8', icon: '🔢' },
    { key: 'art', label: 'Art', color: '#f472b6', icon: '🎨' },
    { key: 'quiz', label: 'Quiz', color: '#34d399', icon: '📚' },
    { key: 'reading', label: 'Read', color: '#fbbf24', icon: '📖' },
    { key: 'games', label: 'Games', color: '#fb923c', icon: '🎮' },
  ] as const;

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2;
    const dist = (value / 100) * r;
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) };
  };

  const points = categories.map((c, i) => getPoint(i, skills[c.key]));
  const polygon = points.map(p => `${p.x},${p.y}`).join(' ');

  // Grid rings
  const rings = [25, 50, 75, 100];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Grid */}
      {rings.map(ring => {
        const pts = categories.map((_, i) => getPoint(i, ring));
        return <polygon key={ring} points={pts.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />;
      })}
      {/* Axis lines */}
      {categories.map((_, i) => {
        const pt = getPoint(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={pt.x} y2={pt.y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />;
      })}
      {/* Data polygon */}
      <polygon points={polygon} fill="rgba(99,102,241,0.2)" stroke="rgba(129,140,248,0.8)" strokeWidth="2" />
      {/* Data points */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill={categories[i].color} stroke="white" strokeWidth="1.5" />
      ))}
      {/* Labels */}
      {categories.map((c, i) => {
        const pt = getPoint(i, 125);
        return (
          <text key={c.key} x={pt.x} y={pt.y} textAnchor="middle" dominantBaseline="middle"
            className="fill-slate-400 text-[9px] font-bold uppercase">
            {c.icon} {skills[c.key]}
          </text>
        );
      })}
    </svg>
  );
};

// ─── Progress Bar ───

const ProgressBar: React.FC<{ value: number; max: number; color: string; label?: string }> = ({ value, max, color, label }) => {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div>
      {label && <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
        <span>{label}</span><span>{value}/{max}</span>
      </div>}
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ease-out ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

// ─── Stat KPI Card ───

const KPICard: React.FC<{
  icon: React.ReactNode; label: string; value: string | number;
  subtext?: string; gradient: string;
}> = ({ icon, label, value, subtext, gradient }) => (
  <div className={`relative overflow-hidden rounded-2xl border border-white/5 p-5 bg-gradient-to-br ${gradient} shadow-xl group hover:scale-[1.02] transition-all`}>
    <div className="absolute -top-6 -right-6 opacity-10 scale-150">{icon}</div>
    <div className="relative z-10">
      <div className="mb-3 opacity-80">{icon}</div>
      <p className="text-[10px] text-white/60 font-black uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black text-white leading-none">{value}</p>
      {subtext && <p className="text-[10px] text-white/40 mt-1">{subtext}</p>}
    </div>
  </div>
);

// ─── Leaderboard Row ───

const LeaderRow: React.FC<{ rank: number; name: string; avatar: string; score: string | number; highlight?: boolean }> = ({ rank, name, avatar, score, highlight }) => (
  <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${highlight ? 'bg-indigo-500/10 border border-indigo-500/20' : 'bg-white/[0.03] border border-white/5'}`}>
    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${rank === 1 ? 'bg-amber-500 text-black' : rank === 2 ? 'bg-slate-400 text-black' : rank === 3 ? 'bg-orange-700 text-white' : 'bg-slate-800 text-slate-400'}`}>
      {rank}
    </span>
    <span className="text-2xl">{avatar}</span>
    <span className="flex-1 text-sm font-bold text-white truncate">{name}</span>
    <span className="text-sm font-black text-indigo-300">{score}</span>
  </div>
);

// ─── Category Skill Bar ───

const CategoryBar: React.FC<{ emoji: string; label: string; value: number; color: string }> = ({ emoji, label, value, color }) => (
  <div className="flex items-center gap-3">
    <span className="text-lg w-8 text-center">{emoji}</span>
    <div className="flex-1">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
        <span className="text-slate-400">{label}</span>
        <span className="text-white">{value}%</span>
      </div>
      <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-1000 ease-out`} style={{ width: `${value}%` }} />
      </div>
    </div>
  </div>
);

// ─── Main Component ───

const ParentDashboard: React.FC<ParentDashboardProps> = ({ onBack }) => {
  const [profiles, setProfiles] = useState<FamilyProfile[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [englishProgress, setEnglishProgress] = useState<EnglishProgress[]>([]);
  const [dailyPath, setDailyPath] = useState<DailyLearningPath | null>(null);
  const [newComment, setNewComment] = useState('');
  const [usageData, setUsageData] = useState<any>({});
  const [insights, setInsights] = useState<InsightSummary | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [showTech, setShowTech] = useState(false);

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPass, setEditPass] = useState('');

  useEffect(() => {
    const p = StorageService.getProfiles();
    setProfiles(p);
    if (p.length > 0 && !selectedChildId) setSelectedChildId(p[0].id);

    const loadData = async () => {
      const d = await StorageService.getDrawings();
      const usage = await StorageService.getFamilyUsage();
      setDrawings(d);
      setUsageData(usage);
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!selectedChildId) return;
    StorageService.getEnglishProgress(selectedChildId)
      .then(setEnglishProgress)
      .catch(error => {
        console.error('Failed to load English progress', error);
        setEnglishProgress([]);
      });
    setDailyPath(StorageService.getDailyLearningPath(selectedChildId));
  }, [selectedChildId]);

  useEffect(() => {
    let cancelled = false;
    const loadInsights = async () => {
      setInsightsLoading(true);
      try {
        const summary = await getInsightsSummary();
        if (!cancelled) setInsights(summary);
      } finally {
        if (!cancelled) setInsightsLoading(false);
      }
    };
    loadInsights();
    return () => { cancelled = true; };
  }, []);

  // Compute analytics
  const dashboard = useMemo<DashboardAnalytics>(
    () => computeDashboardAnalytics(profiles, drawings),
    [profiles, drawings]
  );

  const selectedProfile = profiles.find(p => p.id === selectedChildId);
  const childDrawings = drawings.filter(d => d.author === selectedProfile?.name);
  const childUsage = selectedChildId ? usageData[selectedChildId] || {} : {};
  const latestEnglish = englishProgress[0];
  const englishAverage = englishProgress.length
    ? Math.round(englishProgress.reduce((sum, item) => sum + (item.accuracy || 0), 0) / englishProgress.length)
    : 0;
  const englishWords = Array.from(new Set(englishProgress.flatMap(item => item.wordsPracticed || []))).slice(0, 6);

  const totalArtCount = drawings.length;
  const totalPlayMinutes = Math.round(
    (Object.values(usageData) as any[]).reduce((total: number, childStats: any): number => {
      const childTotal = (Object.values(childStats) as any[]).reduce((sum: number, val: any): number => sum + (Number(val) || 0), 0);
      return total + childTotal;
    }, 0) / 60
  );

  const selectedAnalytics = useMemo<ProfileAnalytics | null>(
    () => selectedProfile ? computeProfileAnalytics(selectedProfile, drawings) : null,
    [selectedProfile, drawings]
  );

  const topViews = useMemo(() => {
    if (!insights) return [];
    return Object.entries(insights.viewMetrics).sort((a, b) => b[1].count - a[1].count).slice(0, 4);
  }, [insights]);

  const formatViewLabel = (v: string) => (v || 'Unknown').replace(/^View\./i, '').replace(/_/g, ' ');

  const handleUpdateProfile = () => {
    if (!selectedProfile || !editName) return;
    const updated = { ...selectedProfile, name: editName };
    if (editPass) {
      if (selectedProfile.mode === 'PARENT') updated.pin = editPass;
      else updated.password = editPass;
    }
    StorageService.updateProfile(updated);
    setProfiles(StorageService.getProfiles());
    setIsEditing(false);
    alert("Profile successfully updated!");
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedProfile) return;
    StorageService.addComment(newComment, "Admin");
    setNewComment('');
    alert(`Love note sent to ${selectedProfile.name}!`);
  };

  const deleteChild = (id: string) => {
    if (id === 'admin') { alert("Cannot delete the Master Hub account."); return; }
    if (confirm("Permanently remove this child profile? This cannot be undone.")) {
      const all = StorageService.getProfiles();
      const updated = all.filter(p => p.id !== id);
      StorageService.setCachedProfiles(updated);
      setProfiles(updated);
      if (selectedChildId === id) setSelectedChildId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-32 px-4">

      {/* ─── Hero Header ─── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-br from-slate-900/80 to-indigo-900/30 p-6 sm:p-8 rounded-[2.5rem] border border-indigo-500/10 backdrop-blur-xl shadow-2xl">
        <div>
          <h2 className="text-3xl sm:text-4xl font-display text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 font-black">
            Family Command Center
          </h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2 mt-1">
            <Activity size={14} className="text-indigo-400" /> Real-Time Family Analytics
          </p>
        </div>
        <button onClick={onBack}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white font-black flex items-center gap-2 transition-all shadow-xl active:scale-95 text-sm">
          <ArrowLeft size={16} /> BACK TO HUB
        </button>
      </div>

      {/* ─── Top KPI Grid ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPICard icon={<Zap size={22} className="text-indigo-300" />} label="Total XP" value={dashboard.totalXP.toLocaleString()} subtext={`Avg Level ${dashboard.averageLevel}`} gradient="from-indigo-900/60 to-indigo-950/80" />
        <KPICard icon={<Coins size={22} className="text-amber-300" />} label="Coins Earned" value={dashboard.totalCoins.toLocaleString()} subtext={`${dashboard.totalBadges} badges unlocked`} gradient="from-amber-900/40 to-amber-950/60" />
        <KPICard icon={<Palette size={22} className="text-pink-300" />} label="Art Creations" value={dashboard.totalDrawings} subtext="Saved masterpieces" gradient="from-pink-900/40 to-pink-950/60" />
        <KPICard icon={<Users size={22} className="text-emerald-300" />} label="Family Members" value={dashboard.activeMembers} subtext={`Highest: Lv.${dashboard.highestLevel}`} gradient="from-emerald-900/40 to-emerald-950/60" />
      </div>

      {/* ─── Daily Quests ─── */}
      {(() => {
        const todayChallenges = getTodayChallenges(3);
        const completed = getTodayCompletionCount();
        return (
          <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-500/20 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-600/20 rounded-xl"><Flame className="text-amber-400" size={20} /></div>
                <div>
                  <h4 className="text-lg font-black text-white italic tracking-tighter uppercase">Today's Quests</h4>
                  <p className="text-[9px] text-amber-400/70 font-black uppercase tracking-widest">{completed}/{todayChallenges.length} completed</p>
                </div>
              </div>
              {completed === todayChallenges.length && <CheckCircle2 size={22} className="text-emerald-400" />}
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {todayChallenges.map(ch => {
                const done = isChallengeCompleted(ch.id);
                return (
                  <div key={ch.id} className={`flex items-center gap-3 p-3 rounded-xl border ${done ? 'bg-emerald-900/20 border-emerald-500/20' : 'bg-slate-900/40 border-white/5'}`}>
                    <span className="text-2xl">{ch.icon}</span>
                    <div className="min-w-0">
                      <p className={`text-xs font-black uppercase tracking-tight ${done ? 'text-emerald-400 line-through' : 'text-white'}`}>{ch.title.en}</p>
                      <p className="text-[10px] text-slate-500 truncate">{ch.description.en}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* ─── Family Skill Overview ─── */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Skill Breakdown */}
        <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-6 shadow-xl">
          <h4 className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mb-5">Family Skill Breakdown</h4>
          <div className="space-y-4">
            <CategoryBar emoji="🔢" label="Mathematics" value={dashboard.avgSkills.math} color="bg-indigo-500" />
            <CategoryBar emoji="🎨" label="Art & Creativity" value={dashboard.avgSkills.art} color="bg-pink-500" />
            <CategoryBar emoji="📚" label="Bible Knowledge" value={dashboard.avgSkills.quiz} color="bg-emerald-500" />
            <CategoryBar emoji="📖" label="Reading & Words" value={dashboard.avgSkills.reading} color="bg-amber-500" />
            <CategoryBar emoji="🎮" label="Games & Logic" value={dashboard.avgSkills.games} color="bg-orange-500" />
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-6 shadow-xl">
          <h4 className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mb-5 flex items-center gap-2">
            <Trophy size={14} className="text-amber-400" /> XP Leaderboard
          </h4>
          {dashboard.topByXP.length === 0 ? (
            <p className="text-sm text-slate-500 italic py-8 text-center">No XP earned yet. Start adventuring!</p>
          ) : (
            <div className="space-y-2">
              {dashboard.topByXP.map((p, i) => (
                <LeaderRow key={p.name} rank={i + 1} name={p.name} avatar={p.avatar} score={`${p.xp} XP`} highlight={i === 0} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── Technical Insights (Collapsible) ─── */}
      <div className="bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden">
        <button onClick={() => setShowTech(!showTech)}
          className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors">
          <div className="flex items-center gap-3">
            <BarChart3 size={18} className="text-indigo-400" />
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Technical Telemetry</span>
            {insights && <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">LIVE</span>}
          </div>
          {showTech ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
        </button>

        {showTech && (
          <div className="px-5 pb-5 space-y-4 animate-fade-in">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="bg-slate-950/50 border border-white/5 rounded-xl p-4">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Events Logged</p>
                <p className="text-2xl font-black text-white">{insightsLoading ? '...' : insights?.totalEvents ?? '—'}</p>
              </div>
              <div className="bg-slate-950/50 border border-white/5 rounded-xl p-4">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Avg Duration</p>
                <p className="text-2xl font-black text-white">{insightsLoading ? '...' : insights?.averageDuration ? `${insights.averageDuration}s` : '—'}</p>
              </div>
              <div className="bg-slate-950/50 border border-white/5 rounded-xl p-4">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Errors</p>
                <p className="text-2xl font-black text-white">{insightsLoading ? '...' : insights?.failureCount ?? 0}</p>
              </div>
            </div>

            {topViews.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Top Flows</p>
                {topViews.map(([view, meta]) => (
                  <div key={view} className="flex items-center justify-between p-3 bg-white/[0.03] rounded-xl border border-white/5 text-sm">
                    <span className="text-slate-300 font-bold uppercase text-xs tracking-wide">{formatViewLabel(view)}</span>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-indigo-300 font-bold">{meta.count} visits</span>
                      <span className="text-slate-500">{meta.avgDuration}s avg</span>
                      {meta.failures > 0 && <span className="text-rose-400">{meta.failures} err</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── Profile Management Grid ─── */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-slate-500 font-black uppercase tracking-widest text-[10px] ml-4">Family Members</h3>
          {profiles.map(p => (
            <div key={p.id}
              onClick={() => { setSelectedChildId(p.id); setIsEditing(false); }}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between group ${
                selectedChildId === p.id ? 'bg-indigo-600 border-indigo-400 shadow-xl scale-[1.02]' : 'bg-slate-900 border-slate-800 hover:border-slate-600'}`}>
              <div className="flex items-center gap-3">
                <span className="text-4xl group-hover:scale-110 transition-transform">{p.avatar}</span>
                <div>
                  <p className={`font-black text-lg uppercase tracking-tighter ${selectedChildId === p.id ? 'text-white' : 'text-slate-300'}`}>
                    {p.name}
                  </p>
                  <p className={`text-[10px] font-bold ${selectedChildId === p.id ? 'text-indigo-200' : 'text-slate-500'}`}>
                    {p.mode === 'PARENT' ? 'HUB HOST' : `Lv.${p.gameStats?.level || 1} • ${p.age}y`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); deleteChild(p.id); }}
                  className="p-2 text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                <ChevronRight size={16} className={selectedChildId === p.id ? 'text-white' : 'text-slate-700'} />
              </div>
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-8 space-y-6">
          {!selectedProfile || !selectedAnalytics ? (
            <div className="h-full flex items-center justify-center bg-slate-900/30 rounded-2xl border-2 border-dashed border-slate-800 p-16 text-center text-slate-500 italic">
              Select a profile to view their analytics
            </div>
          ) : (
            <div className="animate-fade-in space-y-6">

              {/* Profile Header + Skill Radar */}
              <div className="bg-slate-900 p-6 rounded-2xl border border-indigo-500/20 shadow-xl">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <SkillRadar skills={selectedAnalytics.skills} size={180} />
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-2xl font-black text-white">{selectedAnalytics.name}</h3>
                    <p className="text-sm text-slate-400 mt-1">Level {selectedAnalytics.level} Explorer</p>
                    <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                      <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold">{selectedAnalytics.xp} XP</span>
                      <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold">{selectedAnalytics.coins} Coins</span>
                      <span className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-xs font-bold">{selectedAnalytics.badges.length} Badges</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subject Progress Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Math Card */}
                <div className="bg-slate-900/80 p-5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain size={18} className="text-indigo-400" />
                    <h4 className="text-sm font-black text-white uppercase tracking-tight">Mathematics</h4>
                  </div>
                  <div className="space-y-3">
                    <ProgressBar value={selectedAnalytics.math.planetsUnlocked} max={selectedAnalytics.math.planetsTotal || 6} color="bg-indigo-500" label="Planets Unlocked" />
                    <ProgressBar value={selectedAnalytics.math.totalStars} max={selectedAnalytics.math.maxStars || 18} color="bg-amber-500" label="Stars Earned" />
                    <div className="flex gap-2 mt-2">
                      <div className="flex-1 bg-slate-950 p-3 rounded-xl text-center">
                        <p className="text-lg font-black text-indigo-300">{selectedAnalytics.math.mountainStage}</p>
                        <p className="text-[9px] text-slate-500 uppercase">Mt. Stage</p>
                      </div>
                      <div className="flex-1 bg-slate-950 p-3 rounded-xl text-center">
                        <p className="text-lg font-black text-amber-300">{selectedAnalytics.math.summitHighScore}</p>
                        <p className="text-[9px] text-slate-500 uppercase">Summit Best</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quiz Card */}
                <div className="bg-slate-900/80 p-5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen size={18} className="text-emerald-400" />
                    <h4 className="text-sm font-black text-white uppercase tracking-tight">Bible Quest</h4>
                  </div>
                  <div className="space-y-3">
                    <ProgressBar value={selectedAnalytics.quiz.worldsCompleted} max={selectedAnalytics.quiz.worldsTotal || 5} color="bg-emerald-500" label="Worlds Completed" />
                    <div className="flex gap-2 mt-2">
                      <div className="flex-1 bg-slate-950 p-3 rounded-xl text-center">
                        <p className="text-lg font-black text-emerald-300">{selectedAnalytics.quiz.totalBadges}</p>
                        <p className="text-[9px] text-slate-500 uppercase">Badges</p>
                      </div>
                      <div className="flex-1 bg-slate-950 p-3 rounded-xl text-center">
                        <p className="text-lg font-black text-purple-300">Lv.{selectedAnalytics.quiz.highestWorldLevel}</p>
                        <p className="text-[9px] text-slate-500 uppercase">Highest</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Art Card */}
                <div className="bg-slate-900/80 p-5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 mb-4">
                    <PenTool size={18} className="text-pink-400" />
                    <h4 className="text-sm font-black text-white uppercase tracking-tight">Art Studio</h4>
                  </div>
                  <div className="space-y-3">
                    <ProgressBar value={selectedAnalytics.art.promptsCompleted} max={selectedAnalytics.art.promptsTotal} color="bg-pink-500" label="Prompts Completed" />
                    <ProgressBar value={selectedAnalytics.art.missionsCompleted} max={selectedAnalytics.art.missionsTotal} color="bg-rose-500" label="Missions Done" />
                    <div className="flex gap-2 mt-2">
                      <div className="flex-1 bg-slate-950 p-3 rounded-xl text-center">
                        <p className="text-lg font-black text-pink-300">{selectedAnalytics.art.drawingsCount}</p>
                        <p className="text-[9px] text-slate-500 uppercase">Drawings</p>
                      </div>
                      <div className="flex-1 bg-slate-950 p-3 rounded-xl text-center">
                        <p className="text-lg font-black text-rose-300">Tier {selectedAnalytics.art.tier}</p>
                        <p className="text-[9px] text-slate-500 uppercase">Rank</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Word Quest Card */}
                <div className="bg-slate-900/80 p-5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 mb-4">
                    <Gamepad2 size={18} className="text-amber-400" />
                    <h4 className="text-sm font-black text-white uppercase tracking-tight">Word Quest & Games</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="flex-1 bg-slate-950 p-3 rounded-xl text-center">
                        <p className="text-lg font-black text-amber-300">Lv.{selectedAnalytics.wordQuest.level}</p>
                        <p className="text-[9px] text-slate-500 uppercase">Word Level</p>
                      </div>
                      <div className="flex-1 bg-slate-950 p-3 rounded-xl text-center">
                        <p className="text-lg font-black text-orange-300">{selectedAnalytics.wordQuest.unlocked ? 'YES' : 'NO'}</p>
                        <p className="text-[9px] text-slate-500 uppercase">Unlocked</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-slate-950 p-3 rounded-xl text-center">
                        <p className="text-lg font-black text-emerald-300">{selectedAnalytics.engagement.dailyChallengeToday ? '✅' : '—'}</p>
                        <p className="text-[9px] text-slate-500 uppercase">Daily Done</p>
                      </div>
                      <div className="flex-1 bg-slate-950 p-3 rounded-xl text-center">
                        <p className="text-lg font-black text-indigo-300">{selectedAnalytics.engagement.streakEstimate}</p>
                        <p className="text-[9px] text-slate-500 uppercase">Est. Streak</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-slate-900 p-6 rounded-2xl border border-white/5 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-2">
                    <Key size={16} className="text-indigo-400" /> Security Settings
                  </h4>
                  {!isEditing ? (
                    <button onClick={() => { setIsEditing(true); setEditName(selectedProfile.name); setEditPass(''); }}
                      className="px-4 py-1.5 bg-slate-800 text-white rounded-full font-bold text-[10px] hover:bg-slate-700 uppercase tracking-wider">
                      Edit
                    </button>
                  ) : (
                    <button onClick={() => setIsEditing(false)}
                      className="px-4 py-1.5 bg-rose-900/20 text-rose-400 rounded-full font-bold text-[10px] uppercase tracking-wider">
                      Cancel
                    </button>
                  )}
                </div>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1 block">Display Name</label>
                        <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-indigo-500 text-sm" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1 block">
                          {selectedProfile.mode === 'PARENT' ? 'New PIN' : 'New Password'}
                        </label>
                        <input type={selectedProfile.mode === 'PARENT' ? 'password' : 'text'}
                          maxLength={selectedProfile.mode === 'PARENT' ? 4 : 20}
                          value={editPass} onChange={e => setEditPass(e.target.value)}
                          placeholder="Leave blank to keep"
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-indigo-500 text-sm" />
                      </div>
                    </div>
                    <button onClick={handleUpdateProfile}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg">
                      <Save size={16} /> SAVE UPDATES
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-950 p-4 rounded-xl border border-white/5 text-center">
                      <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Status</p>
                      <p className="text-white font-black text-xs">{selectedProfile.mode === 'PARENT' ? 'ADMIN' : 'EXPLORER'}</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-white/5 text-center">
                      <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Pass Type</p>
                      <p className="text-white font-black text-xs">{selectedProfile.mode === 'PARENT' ? '4-DIGIT PIN' : 'SECRET WORD'}</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-white/5 text-center">
                      <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Recovery</p>
                      <p className="text-white font-black text-[10px]">{selectedProfile.mode === 'PARENT' ? 'EMAIL/KEY' : 'PARENT PIN'}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Activity Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <StatCard icon={<Clock className="text-emerald-400" />} label="Session Time" value={`${Math.round(((Object.values(childUsage) as any[]).reduce((sum: number, val: any): number => sum + (Number(val) || 0), 0) as number) / 60)}m`} color="emerald" />
                <StatCard icon={<TrendingUp className="text-indigo-400" />} label="Preferred Hub" value={Object.keys(childUsage).sort((a, b) => childUsage[b] - childUsage[a])[0] || 'Exploring'} color="indigo" />
                <StatCard icon={<Star className="text-amber-400" />} label="Tournament Badges" value="3 Earned" color="amber" />
              </div>

              <div className="bg-slate-900/70 border border-white/5 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div>
                    <p className="text-[10px] text-sky-400 font-black uppercase tracking-[0.25em]">English Progress</p>
                    <h4 className="text-2xl font-black text-white italic">Reading & Vocabulary Coach</h4>
                  </div>
                  <BookOpen className="text-sky-300" size={32} />
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Missions</p>
                    <p className="text-3xl text-white font-black">{englishProgress.length}</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Accuracy</p>
                    <p className="text-3xl text-emerald-300 font-black">{englishAverage}%</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Latest</p>
                    <p className="text-sm text-white font-black uppercase">{latestEnglish?.mode || 'Not started'}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {englishWords.length > 0 ? englishWords.map(word => (
                    <span key={word} className="px-3 py-1 bg-sky-500/10 text-sky-200 rounded-full text-xs font-bold border border-sky-400/20 flex items-center gap-1">
                      <Languages size={12} /> {word}
                    </span>
                  )) : (
                    <p className="text-slate-500 text-sm">No English missions completed yet.</p>
                  )}
                </div>
              </div>

              <div className="bg-slate-900/70 border border-white/5 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div>
                    <p className="text-[10px] text-indigo-300 font-black uppercase tracking-[0.25em]">Daily Learning Path</p>
                    <h4 className="text-2xl font-black text-white italic">Today’s Personalized Plan</h4>
                  </div>
                  <Sparkles className="text-indigo-300" size={32} />
                </div>
                {dailyPath ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-widest">
                      <span className="px-3 py-1 bg-indigo-500/10 text-indigo-200 rounded-full border border-indigo-400/20">Focus: {dailyPath.focusSkill}</span>
                      <span className="px-3 py-1 bg-amber-500/10 text-amber-200 rounded-full border border-amber-400/20">{dailyPath.streakDay} day streak</span>
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-200 rounded-full border border-emerald-400/20">{dailyPath.tasks.filter(task => task.completed).length}/{dailyPath.tasks.length} done</span>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {dailyPath.tasks.map(task => (
                        <div key={task.id} className="bg-slate-950 p-3 rounded-2xl border border-white/5">
                          <p className="text-white font-black text-sm">{task.completed ? '✅ ' : '⬜ '}{task.title}</p>
                          <p className="text-[10px] text-slate-500 font-bold mt-1">{task.skill} • {task.estimatedMinutes} min</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">No daily path has been opened by this child yet today.</p>
                )}
              </div>

              {/* Gallery Snapshots */}
              <div className="space-y-6">
                <div className="flex justify-between items-end px-4">
                  <h4 className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Recent Creations</h4>
                  <span className="text-indigo-400 font-bold text-xs">{childDrawings.length} Saved Works</span>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  {childDrawings.slice(0, 3).map(drawing => (
                    <div key={drawing.id} className="group relative aspect-square bg-white rounded-3xl overflow-hidden border-2 border-slate-800 hover:border-indigo-500 transition-all shadow-xl">
                      <img src={drawing.dataUrl} className="w-full h-full object-contain" alt="creation" />
                      <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center p-4 text-center transition-all backdrop-blur-sm">
                        <Eye size={24} className="text-white mb-2" />
                        <p className="text-[10px] text-white font-bold uppercase">{new Date(drawing.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                  {childDrawings.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-600 bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-800 italic">
                      No masterpieces to show yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
