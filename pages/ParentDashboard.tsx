
import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storage';
import { FamilyProfile, Drawing, ParentComment } from '../types';
import { 
  Users, Activity, Star, MessageSquare, Trash2, 
  ChevronRight, ArrowLeft, BarChart3, Clock, 
  TrendingUp, Eye, Sparkles, Heart, LayoutDashboard,
  Palette, Edit2, Key, Save
} from 'lucide-react';

interface ParentDashboardProps {
  onBack: () => void;
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ onBack }) => {
  const [profiles, setProfiles] = useState<FamilyProfile[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [newComment, setNewComment] = useState('');
  const [usageData, setUsageData] = useState<any>({});
  
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

  const selectedProfile = profiles.find(p => p.id === selectedChildId);
  const childDrawings = drawings.filter(d => d.author === selectedProfile?.childName);
  const childUsage = selectedChildId ? usageData[selectedChildId] || {} : {};

  const totalArtCount = drawings.length;
  const totalPlayMinutes = Math.round(
    (Object.values(usageData) as any[]).reduce((total: number, childStats: any): number => {
      const childTotal = (Object.values(childStats) as any[]).reduce((sum: number, val: any): number => sum + (Number(val) || 0), 0);
      return total + childTotal;
    }, 0) / 60
  );

  const handleUpdateProfile = () => {
    if (!selectedProfile || !editName) return;
    const updated = { ...selectedProfile, childName: editName };
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
    alert(`Love note sent to ${selectedProfile.childName}!`);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
        <StatCard icon={<LayoutDashboard className="text-indigo-400"/>} label="Total Family Play" value={`${totalPlayMinutes}m`} color="indigo" />
        <StatCard icon={<Palette className="text-pink-400"/>} label="Gallery Creations" value={totalArtCount} color="pink" />
        <StatCard icon={<Users className="text-emerald-400"/>} label="Active Members" value={profiles.length} color="emerald" />
        <StatCard icon={<Heart className="text-rose-400"/>} label="Family Level" value="Level 5" color="rose" />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/50 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
        <div>
          <h2 className="text-4xl font-display text-white mb-2">Family Hub Insights</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
             <Activity size={14} className="text-indigo-400"/> Live Management Portal
          </p>
        </div>
        <button 
          onClick={onBack}
          className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-[1.5rem] text-white font-black flex items-center gap-2 transition-all shadow-xl active:scale-95"
        >
          <ArrowLeft size={18}/> BACK TO HUB
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-slate-500 font-black uppercase tracking-widest text-[10px] ml-4">Family Members</h3>
          {profiles.map(p => (
            <div 
              key={p.id}
              onClick={() => { setSelectedChildId(p.id); setIsEditing(false); }}
              className={`p-6 rounded-[2.5rem] border-2 cursor-pointer transition-all flex items-center justify-between group ${
                selectedChildId === p.id ? 'bg-indigo-600 border-indigo-400 shadow-xl scale-[1.02]' : 'bg-slate-900 border-slate-800 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-5xl group-hover:scale-110 transition-transform">{p.avatar}</span>
                <div>
                  <p className={`font-black text-xl uppercase tracking-tighter ${selectedChildId === p.id ? 'text-white' : 'text-slate-300'}`}>
                    {p.childName}
                  </p>
                  <p className={`text-[10px] font-bold ${selectedChildId === p.id ? 'text-indigo-200' : 'text-slate-500'}`}>
                    {p.mode === 'PARENT' ? 'HUB HOST' : `${p.age} YEARS OLD`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <button 
                   onClick={(e) => { e.stopPropagation(); deleteChild(p.id); }}
                   className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                 >
                   <Trash2 size={16}/>
                 </button>
                 <ChevronRight className={selectedChildId === p.id ? 'text-white' : 'text-slate-700'} />
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Progress & Management */}
        <div className="lg:col-span-8 space-y-8">
          {!selectedProfile ? (
            <div className="h-full flex items-center justify-center bg-slate-900/30 rounded-[3rem] border-2 border-dashed border-slate-800 p-20 text-slate-500 italic">
               Select a profile to manage their journey
            </div>
          ) : (
            <div className="animate-fade-in space-y-8">
               
               {/* Credential Management Area */}
               <div className="bg-slate-900 p-10 rounded-[3rem] border-2 border-indigo-500/20 shadow-2xl relative overflow-hidden">
                   <div className="flex justify-between items-center mb-8">
                       <h4 className="text-2xl font-black text-white italic tracking-tight flex items-center gap-3">
                           <Key className="text-indigo-400"/> Security Settings
                       </h4>
                       {!isEditing ? (
                           <button onClick={() => { setIsEditing(true); setEditName(selectedProfile.childName); setEditPass(''); }} className="px-6 py-2 bg-slate-800 text-white rounded-full font-bold text-xs hover:bg-slate-700">EDIT PROFILE</button>
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
                                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 mb-2 block">{selectedProfile.mode === 'PARENT' ? 'New 4-Digit PIN' : 'New Password'}</label>
                                   <input 
                                        type={selectedProfile.mode === 'PARENT' ? 'password' : 'text'} 
                                        maxLength={selectedProfile.mode === 'PARENT' ? 4 : 20} 
                                        value={editPass} 
                                        onChange={e => setEditPass(e.target.value)} 
                                        placeholder="Leave blank to keep current" 
                                        className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl p-4 text-white outline-none focus:border-indigo-500" 
                                   />
                               </div>
                           </div>
                           <button onClick={handleUpdateProfile} className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white font-black text-lg flex items-center justify-center gap-3 shadow-xl">
                               <Save size={20}/> SAVE UPDATES
                           </button>
                       </div>
                   ) : (
                       <div className="grid grid-cols-3 gap-4">
                           <div className="bg-slate-950 p-6 rounded-2xl border border-white/5">
                               <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Status</p>
                               <p className="text-white font-black uppercase text-xs tracking-widest">{selectedProfile.mode === 'PARENT' ? 'ADMIN' : 'EXPLORER'}</p>
                           </div>
                           <div className="bg-slate-950 p-6 rounded-2xl border border-white/5">
                               <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Pass-Type</p>
                               <p className="text-white font-black uppercase text-xs tracking-widest">{selectedProfile.mode === 'PARENT' ? '4-DIGIT PIN' : 'SECRET WORD'}</p>
                           </div>
                           <div className="bg-slate-950 p-6 rounded-2xl border border-white/5">
                               <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Recovery</p>
                               <p className="text-white font-black uppercase text-[10px] tracking-widest truncate">{selectedProfile.mode === 'PARENT' ? 'EMAIL/KEY' : 'PARENT PIN'}</p>
                           </div>
                       </div>
                   )}
               </div>

               {/* Activity Cards */}
               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <StatCard icon={<Clock className="text-emerald-400"/>} label="Session Time" value={`${Math.round(((Object.values(childUsage) as any[]).reduce((sum: number, val: any): number => sum + (Number(val) || 0), 0) as number) / 60)}m`} color="emerald" />
                  <StatCard icon={<TrendingUp className="text-indigo-400"/>} label="Preferred Hub" value={Object.keys(childUsage).sort((a,b) => childUsage[b] - childUsage[a])[0] || 'Exploring'} color="indigo" />
                  <StatCard icon={<Star className="text-amber-400"/>} label="Tournament Badges" value="3 Earned" color="amber" />
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
                           <Eye size={24} className="text-white mb-2"/>
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

const StatCard = ({ icon, label, value, color }: any) => (
  <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group hover:bg-slate-800 transition-all">
    <div className={`absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all`}>{icon}</div>
    <div className="relative z-10">
      <div className="mb-6">{icon}</div>
      <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] mb-2">{label}</p>
      <p className="text-3xl font-black text-white uppercase tracking-tighter leading-none">{value}</p>
    </div>
  </div>
);

export default ParentDashboard;
