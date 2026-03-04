
import React, { useState, useEffect, useMemo } from 'react';
import { StorageService } from '../services/storage';
import { getInsightsSummary, InsightSummary } from '../services/insights';
import { FamilyProfile, Drawing } from '../types';
import {
  Users, Activity, Star, MessageSquare, Trash2,
  ChevronRight, ArrowLeft, BarChart3, Clock,
  TrendingUp, Eye, Sparkles, Heart, LayoutDashboard,
  Palette, Edit2, Key, Save
} from 'lucide-react';

interface TeacherDashboardProps {
  onBack: () => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onBack }) => {
  const [profiles, setProfiles] = useState<FamilyProfile[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [newComment, setNewComment] = useState('');
  const [usageData, setUsageData] = useState<any>({});
  const [insights, setInsights] = useState<InsightSummary | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [errorIndex, setErrorIndex] = useState(0);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentAge, setNewStudentAge] = useState('');
  const [newStudentPass, setNewStudentPass] = useState('');

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPass, setEditPass] = useState('');

  useEffect(() => {
    const p = StorageService.getProfiles();
    setProfiles(p);

    if (p.length > 0 && !selectedChildId) {
      setSelectedChildId(p[0].id);
    }

    const loadData = async () => {
      const d = await StorageService.getDrawings();
      setDrawings(d);
      setUsageData(StorageService.getFamilyUsage());
    };
    loadData();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadInsights = async () => {
      if (cancelled) return;
      setInsightsLoading(true);
      try {
        const summary = await getInsightsSummary();
        if (!cancelled) {
          setInsights(summary);
        }
      } finally {
        if (!cancelled) {
          setInsightsLoading(false);
        }
      }
    };
    loadInsights();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedProfile = profiles.find(p => p.id === selectedChildId);
  const childDrawings = drawings.filter(d => d.author === selectedProfile?.name);
  const childUsage = selectedChildId ? usageData[selectedChildId] || {} : {};

  const totalArtCount = drawings.length;
  const totalPlayMinutes = Math.round(
    (Object.values(usageData) as any[]).reduce((total: number, childStats: any): number => {
      const childTotal = (Object.values(childStats) as any[]).reduce((sum: number, val: any): number => sum + (Number(val) || 0), 0);
      return total + childTotal;
    }, 0) / 60
  );

  const topViews = useMemo(() => {
    if (!insights) return [];
    return Object.entries(insights.viewMetrics)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 4);
  }, [insights]);

  const errorsList = insights?.recentErrors || [];

  const formatTimestamp = (value: number) =>
    new Date(value).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const formatViewLabel = (value: string) => {
    if (!value) return 'Unknown';
    const cleaned = value.replace(/^View\\./i, '');
    return cleaned.replace(/_/g, ' ');
  };

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

  const handleAddStudent = () => {
    if (!newStudentName || !newStudentPass) return;
    const teacher = profiles.find(p => p.role === 'TEACHER');
    if (!teacher) return;

    StorageService.createChildProfile(newStudentName, parseInt(newStudentAge) || 6, newStudentPass, teacher.classId, teacher.schoolId);
    setProfiles(StorageService.getProfiles());
    setNewStudentName(''); setNewStudentAge(''); setNewStudentPass('');
    setShowAddStudent(false);
  };

  const deleteChild = (id: string) => {
    if (id === 'admin') {
      alert("Cannot delete the Master Hub account.");
      return;
    }
    if (confirm("Permanently remove this child profile? This cannot be undone.")) {
      const all = StorageService.getProfiles();
      const updated = all.filter(p => p.id !== id);
      localStorage.setItem('tiwaton_profiles', JSON.stringify(updated));
      setProfiles(updated);
      if (selectedChildId === id) setSelectedChildId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-32 px-4">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-slide-up">
        <StatCard icon={<LayoutDashboard className="text-indigo-400" />} label="Total Class Play" value={`${totalPlayMinutes}m`} color="indigo" />
        <StatCard icon={<Palette className="text-pink-400" />} label="Class Creations" value={totalArtCount} color="pink" />
        <StatCard icon={<Users className="text-emerald-400" />} label="Enrolled Students" value={profiles.length - 1} color="emerald" />
        <StatCard icon={<Star className="text-amber-400" />} label="Global Class Rank" value="Top 5%" color="amber" />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/50 p-6 sm:p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
        <div>
          <h2 className="text-4xl font-display text-white mb-2">Teacher Hub Insights</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
            <Activity size={14} className="text-indigo-400" /> Classroom Management Portal
          </p>
        </div>
        <button
          onClick={onBack}
          className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-[1.5rem] text-white font-black flex items-center gap-2 transition-all shadow-xl active:scale-95"
        >
          <ArrowLeft size={18} /> BACK TO HUB
        </button>
      </div>

      <section className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <InsightStat
            label="Telemetry Captured"
            value={insights?.totalEvents ?? '—'}
            detail="Events logged across sessions"
            icon={<BarChart3 size={20} className="text-indigo-400" />}
            loading={insightsLoading}
          />
          <InsightStat
            label="Avg View Duration"
            value={insights?.averageDuration ? `${insights.averageDuration}s` : '—'}
            detail="Heartbeat samples per view"
            icon={<Clock size={20} className="text-emerald-400" />}
            loading={insightsLoading}
          />
          <InsightStat
            label="Failures Recorded"
            value={insights?.failureCount ?? 0}
            detail="Errors captured per view"
            icon={<MessageSquare size={20} className="text-rose-400" />}
            loading={insightsLoading}
          />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-slate-900/60 border border-white/5 rounded-[2.5rem] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">Most-Visited Flows</h4>
              {insightsLoading && <span className="text-[10px] uppercase tracking-[0.3em] text-indigo-400">refreshing</span>}
            </div>
            {insightsLoading ? (
              <p className="text-sm text-slate-500 italic">Loading insight data...</p>
            ) : topViews.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No telemetry yet.</p>
            ) : (
              <div className="space-y-3">
                {topViews.map(([view, meta]) => (
                  <div key={view} className="flex flex-col gap-1 p-3 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center justify-between text-sm uppercase tracking-[0.3em] text-slate-400">
                      <span>{formatViewLabel(view)}</span>
                      <span className="text-xs text-slate-500">{meta.failures} errors</span>
                    </div>
                    <div className="flex items-center justify-between text-white font-black">
                      <span className="text-lg">{meta.count} visits</span>
                      <span className="text-sm text-slate-400">{meta.avgDuration}s avg</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-slate-900/60 border border-white/5 rounded-[2.5rem] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">Recent Errors</h4>
              {insightsLoading && <span className="text-[10px] uppercase tracking-[0.3em] text-indigo-400">waiting</span>}
            </div>
            {insightsLoading ? (
              <p className="text-sm text-slate-500 italic">Collecting telemetry...</p>
            ) : errorsList.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No errors logged yet.</p>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                {errorsList.map((error) => (
                  <div key={`${error.view}-${error.timestamp}`} className="p-3 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-white text-sm font-black tracking-tight">{error.error}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-[0.4em] mt-2">
                      <span>{formatViewLabel(error.view)}</span>
                      <span>{error.event}</span>
                      <span>{formatTimestamp(error.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between ml-4">
            <h3 className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Classroom Roster</h3>
            <button
              onClick={() => setShowAddStudent(!showAddStudent)}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-colors shadow-lg"
            >
              + ADD STUDENT
            </button>
          </div>

          {showAddStudent && (
            <div className="bg-slate-900 border border-indigo-500/30 rounded-[2.5rem] p-6 space-y-4 shadow-2xl animate-scale-in">
              <h4 className="text-white font-black italic">New Student</h4>
              <input value={newStudentName} onChange={e => setNewStudentName(e.target.value)} placeholder="Student First Name" className="w-full bg-slate-800 rounded-xl p-3 text-white outline-none focus:border-indigo-500 border border-slate-700 text-sm" />
              <div className="flex gap-2">
                <input type="number" value={newStudentAge} onChange={e => setNewStudentAge(e.target.value)} placeholder="Age" className="w-1/3 bg-slate-800 rounded-xl p-3 text-white outline-none focus:border-indigo-500 border border-slate-700 text-sm" />
                <input value={newStudentPass} onChange={e => setNewStudentPass(e.target.value)} placeholder="Secret Password" className="flex-1 bg-slate-800 rounded-xl p-3 text-white outline-none focus:border-indigo-500 border border-slate-700 text-sm" />
              </div>
              <button
                onClick={handleAddStudent}
                disabled={!newStudentName || !newStudentPass}
                className="w-full py-3 bg-emerald-600 disabled:opacity-50 hover:bg-emerald-500 text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all"
              >
                Register Student
              </button>
            </div>
          )}
          {profiles.map(p => (
            <div
              key={p.id}
              onClick={() => { setSelectedChildId(p.id); setIsEditing(false); }}
              className={`p-6 rounded-[2.5rem] border-2 cursor-pointer transition-all flex items-center justify-between group ${selectedChildId === p.id ? 'bg-indigo-600 border-indigo-400 shadow-xl scale-[1.02]' : 'bg-slate-900 border-slate-800 hover:border-slate-600'
                }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-5xl group-hover:scale-110 transition-transform">{p.avatar}</span>
                <div>
                  <p className={`font-black text-xl uppercase tracking-tighter ${selectedChildId === p.id ? 'text-white' : 'text-slate-300'}`}>
                    {p.name}
                  </p>
                  <p className={`text-[10px] font-bold ${selectedChildId === p.id ? 'text-indigo-200' : 'text-slate-500'}`}>
                    {p.role === 'TEACHER' ? 'TEACHER (YOU)' : `STUDENT • AGE ${p.age}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); deleteChild(p.id); }}
                  className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
                <ChevronRight className={selectedChildId === p.id ? 'text-white' : 'text-slate-700'} />
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Progress & Management */}
        <div className="lg:col-span-8 space-y-8">
          {!selectedProfile ? (
            <div className="h-full flex items-center justify-center bg-slate-900/30 rounded-[3rem] border-2 border-dashed border-slate-800 p-10 sm:p-20 text-center text-slate-500 italic">
              Select a profile to manage their journey
            </div>
          ) : (
            <div className="animate-fade-in space-y-8">

              {/* Credential Management Area */}
              <div className="bg-slate-900 p-6 sm:p-10 rounded-[3rem] border-2 border-indigo-500/20 shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-center mb-8">
                  <h4 className="text-2xl font-black text-white italic tracking-tight flex items-center gap-3">
                    <Key className="text-indigo-400" /> Security Settings
                  </h4>
                  {!isEditing ? (
                    <button onClick={() => { setIsEditing(true); setEditName(selectedProfile.name); setEditPass(''); }} className="px-6 py-2 bg-slate-800 text-white rounded-full font-bold text-xs hover:bg-slate-700">EDIT PROFILE</button>
                  ) : (
                    <button onClick={() => setIsEditing(false)} className="px-6 py-2 bg-rose-900/20 text-rose-400 rounded-full font-bold text-xs">CANCEL</button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 mb-2 block">Display Name</label>
                        <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl p-4 text-white outline-none focus:border-indigo-500" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 mb-2 block">{selectedProfile.role === 'TEACHER' ? 'New 4-Digit PIN' : 'New Password'}</label>
                        <input
                          type={selectedProfile.role === 'TEACHER' ? 'password' : 'text'}
                          maxLength={selectedProfile.role === 'TEACHER' ? 4 : 20}
                          value={editPass}
                          onChange={e => setEditPass(e.target.value)}
                          placeholder="Leave blank to keep current"
                          className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl p-4 text-white outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    <button onClick={handleUpdateProfile} className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white font-black text-lg flex items-center justify-center gap-3 shadow-xl">
                      <Save size={20} /> SAVE UPDATES
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-950 p-6 rounded-2xl border border-white/5">
                      <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Status</p>
                      <p className="text-white font-black uppercase text-xs tracking-widest">{selectedProfile.role === 'TEACHER' ? 'ADMIN (TEACHER)' : 'STUDENT'}</p>
                    </div>
                    <div className="bg-slate-950 p-6 rounded-2xl border border-white/5">
                      <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Login Identifiers</p>
                      <p className="text-white font-black uppercase text-xs tracking-widest">{selectedProfile.role === 'TEACHER' ? 'EMAIL/PIN' : 'NAME/PASS'}</p>
                    </div>
                    <div className="bg-slate-950 p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                      <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">{selectedProfile.role === 'TEACHER' ? 'School ID' : 'Class Code'}</p>
                      <p className="text-white font-black uppercase text-[10px] tracking-widest truncate">{selectedProfile.role === 'TEACHER' ? selectedProfile.schoolId : selectedProfile.classId || 'Unassigned'}</p>
                      <div className="absolute inset-0 bg-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm cursor-pointer" onClick={() => navigator.clipboard.writeText(selectedProfile.classId || '')}>
                        <span className="text-[10px] font-black text-white px-3 py-1 bg-indigo-600 rounded-full">COPY ID</span>
                      </div>
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

              {/* Gallery Snapshots */}
              <div className="space-y-6">
                <div className="flex justify-between items-end px-4">
                  <h4 className="text-slate-500 font-black uppercase tracking-widest text-[10px]">{selectedProfile.role === 'TEACHER' ? 'Recent Class Creations' : 'Recent Creations'}</h4>
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

              {/* Quick Logic Handout UI */}
              {selectedProfile.role !== 'TEACHER' && (
                <div className="bg-sky-900/20 border-2 border-sky-500/20 rounded-[3rem] p-8 mt-8 flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-20 h-20 shrink-0 bg-sky-500/10 rounded-full flex items-center justify-center">
                    <MessageSquare size={32} className="text-sky-400" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h4 className="text-2xl font-black text-white italic">Student Login Handout</h4>
                    <p className="text-sm text-slate-400 mt-1">Copy these credentials for the student so they can log in via the School portal.</p>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs font-mono select-all p-3 bg-black/40 rounded-xl border border-white/5 items-center">
                      <span className="text-slate-500">Name:</span> <span className="text-sky-300 font-black">{selectedProfile.name}</span>
                      <span className="text-slate-700 px-2">|</span>
                      <span className="text-slate-500">Code:</span> <span className="text-amber-300 font-black">{selectedProfile.classId}</span>
                      <span className="text-slate-700 px-2">|</span>
                      <span className="text-slate-500">Pass:</span> <span className="text-rose-300 font-black">{selectedProfile.password}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: any) => (
  <div className="bg-slate-900 p-6 sm:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group hover:bg-slate-800 transition-all">
    <div className={`absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all`}>{icon}</div>
    <div className="relative z-10">
      <div className="mb-6">{icon}</div>
      <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] mb-2">{label}</p>
      <p className="text-3xl font-black text-white uppercase tracking-tighter leading-none">{value}</p>
    </div>
  </div>
);

const InsightStat = ({
  label,
  value,
  detail,
  icon,
  loading,
}: {
  label: string;
  value: string | number;
  detail?: string;
  icon: React.ReactNode;
  loading?: boolean;
}) => (
  <div className="bg-slate-900/60 border border-white/5 rounded-[2.5rem] p-6 shadow-2xl flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-slate-500">
        {icon}
        <span>{label}</span>
      </div>
      {loading && <span className="text-[10px] uppercase tracking-[0.3em] text-indigo-400">updating</span>}
    </div>
    <p className="text-3xl font-black text-white uppercase tracking-tighter">{loading ? '–––' : value}</p>
    {detail && <p className="text-slate-400 text-sm leading-relaxed">{detail}</p>}
  </div>
);

export default TeacherDashboard;
