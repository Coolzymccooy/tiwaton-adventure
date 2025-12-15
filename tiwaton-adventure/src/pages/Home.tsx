import React, { useEffect, useState } from 'react';



import { View } from '../types';
import type { FamilyProfile, GameStat, ParentComment, CountdownEvent } from '../types';

//work in progress my kids
import { StorageService } from '../services/storage';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  Sparkles,
  Trophy,
  Star,
  Gamepad2,
  Palette,
  BrainCircuit,
  MessageCircle,
  Send,
  CalendarClock,
} from 'lucide-react';

interface HomeProps {
  onNavigate: (view: View) => void;
  profile: FamilyProfile;
  setProfile: (p: FamilyProfile) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate, profile, setProfile }) => {
  const [stats, setStats] = useState<GameStat>({ xp: 0, level: 1, badges: [], quizProgress: [], mathLevel: 1, mathProgress: 0, emojiLevel: 1, emojiProgress: 0 });
  const [comments, setComments] = useState<ParentComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [currentTickerIndex, setCurrentTickerIndex] = useState(0);
  const [nextEvent, setNextEvent] = useState<{evt: CountdownEvent, days: number} | null>(null);

  useEffect(() => {
    setStats(StorageService.getGameStats());
    setComments(StorageService.getComments());

    // Find nearest event
    const events = StorageService.getEvents();
    const now = new Date().getTime();
    const upcoming = events
        .map(e => ({ evt: e, diff: new Date(e.date).getTime() - now }))
        .filter(x => x.diff > -86400000) // Include today
        .sort((a,b) => a.diff - b.diff);
    
    if (upcoming.length > 0) {
        const first = upcoming[0];
        const days = Math.ceil(first.diff / (1000 * 60 * 60 * 24));
        setNextEvent({ evt: first.evt, days: Math.max(0, days) });
    }

    const timer = setInterval(() => {
      setCurrentTickerIndex(prev => (prev + 1)); 
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const updated = StorageService.addComment(newComment, "Parent");
    setComments(updated);
    setNewComment('');
    setShowCommentInput(false);
  };

  const getQuizProgress = (cat: string) => {
    const q = stats.quizProgress?.find(p => p.category === cat);
    return q ? q.level : 1;
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      
      {/* --- HERO DASHBOARD --- */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border-2 border-indigo-500/30 p-1 shadow-2xl">
        {/* Animated Background - CSS Optimized */}
        <div className="absolute inset-0 opacity-20 animate-pulse bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-600/30 rounded-full blur-3xl"></div>
        
        <div className="relative bg-slate-800/90 backdrop-blur-md rounded-[20px] p-6 text-center md:text-left">
           <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <h2 className="font-display text-4xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500">
                  Captain {profile.childName || 'Traveler'}
                </h2>
                <p className="text-slate-400 font-bold tracking-wider uppercase text-xs mt-1">
                  Level {stats.level} Explorer • {stats.xp} XP
                </p>
                
                <div className="flex gap-2 mt-4">
                    <div title="Total Badges Earned" className="p-3 bg-slate-900 rounded-xl border border-slate-700 text-center min-w-[70px]">
                        <div className="text-xl">🏆</div>
                        <div className="text-[9px] font-bold text-slate-400 mt-1">{stats.badges.length} BADGES</div>
                    </div>
                     <div title="Current Player Level" className="p-3 bg-slate-900 rounded-xl border border-slate-700 text-center min-w-[70px]">
                        <div className="text-xl">⭐</div>
                        <div className="text-[9px] font-bold text-slate-400 mt-1">{stats.level} LVL</div>
                    </div>
                </div>
              </div>

              {/* Event Stamp */}
              {nextEvent && (
                  <div 
                    onClick={() => onNavigate(View.COUNTDOWN)}
                    title="Go to Events"
                    className="cursor-pointer bg-slate-900/50 p-4 rounded-xl border-2 border-dashed border-pink-500/50 flex flex-col items-center justify-center min-w-[120px] hover:scale-105 transition-transform group"
                  >
                      <span className="text-[10px] text-pink-300 uppercase font-bold tracking-wider mb-1">Up Next</span>
                      <div className="text-3xl font-black text-white leading-none group-hover:text-pink-400 transition-colors">
                          {nextEvent.days}
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Days Left</span>
                      <div className="mt-2 text-xs font-bold text-white text-center line-clamp-1 max-w-[100px]">{nextEvent.evt.name}</div>
                  </div>
              )}
           </div>
        </div>
      </div>

      {/* --- LOVE NOTE TICKER --- */}
      <div className="relative bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl p-1 shadow-lg overflow-hidden group">
         <div className="bg-slate-900/90 backdrop-blur rounded-lg p-3 flex items-center gap-3 relative overflow-hidden h-14">
            <div className="bg-pink-500 text-white p-1.5 rounded-full animate-pulse">
               <MessageCircle size={16} fill="white" />
            </div>
            <div className="flex-1 relative h-full">
               {comments.length > 0 ? (
                  <div className="absolute inset-0 flex items-center transition-all duration-500 transform translate-y-0">
                     <p className="font-bold text-white text-sm md:text-base line-clamp-1">
                       <span className="text-pink-400 mr-2">{comments[currentTickerIndex % comments.length].author}:</span>
                       "{comments[currentTickerIndex % comments.length].text}"
                     </p>
                  </div>
               ) : (
                 <p className="flex items-center text-sm text-slate-400 italic">No messages yet. Parents, leave a note!</p>
               )}
            </div>
            
            <button 
              onClick={() => setShowCommentInput(!showCommentInput)}
              title="Add a Love Note"
              className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-full border border-slate-600 transition-colors shrink-0"
            >
              + Note
            </button>
         </div>

         {/* Hidden Input Field */}
         {showCommentInput && (
            <div className="absolute inset-0 bg-slate-800 z-10 flex items-center p-2 gap-2">
               <input 
                 autoFocus
                 value={newComment}
                 onChange={(e) => setNewComment(e.target.value)}
                 placeholder="Type a love note..."
                 className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-1 text-sm outline-none"
                 onKeyDown={e => e.key === 'Enter' && handleAddComment()}
               />
               <button onClick={handleAddComment} title="Send Note" className="bg-pink-600 p-2 rounded-lg"><Send size={14}/></button>
               <button onClick={() => setShowCommentInput(false)} title="Cancel" className="text-slate-400 px-2"><XIcon/></button>
            </div>
         )}
      </div>

      {/* --- QUICK LAUNCH --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button onClick={() => onNavigate(View.ACTIVITIES)} title="Go to Quiz Arena" className="bg-slate-800 border-b-4 border-indigo-600 p-4 rounded-xl hover:translate-y-1 transition-all flex flex-col items-center gap-2 group">
           <div className="text-4xl group-hover:scale-110 transition-transform">🧠</div>
           <span className="font-bold">Quiz Arena</span>
        </button>
        <button onClick={() => onNavigate(View.GAMES)} title="Go to Arcade Games" className="bg-slate-800 border-b-4 border-emerald-600 p-4 rounded-xl hover:translate-y-1 transition-all flex flex-col items-center gap-2 group">
           <div className="text-4xl group-hover:scale-110 transition-transform">🕹️</div>
           <span className="font-bold">Arcade</span>
        </button>
        <button onClick={() => onNavigate(View.DRAWING)} title="Go to Drawing Studio" className="bg-slate-800 border-b-4 border-pink-600 p-4 rounded-xl hover:translate-y-1 transition-all flex flex-col items-center gap-2 group">
           <div className="text-4xl group-hover:scale-110 transition-transform">🎨</div>
           <span className="font-bold">Studio</span>
        </button>
        <button onClick={() => onNavigate(View.STORIES)} title="Go to Story Library" className="bg-slate-800 border-b-4 border-amber-600 p-4 rounded-xl hover:translate-y-1 transition-all flex flex-col items-center gap-2 group">
           <div className="text-4xl group-hover:scale-110 transition-transform">📚</div>
           <span className="font-bold">Library</span>
        </button>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
        <h3 className="text-amber-400 font-display text-xl mb-4">Adventurer Profile</h3>
        <input 
          value={profile.childName}
          onChange={(e) => {
             const n = { ...profile, childName: e.target.value };
             setProfile(n);
             StorageService.saveProfile(n);
          }}
          className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white outline-none focus:border-indigo-500 transition-colors"
          placeholder="Enter Child Name"
          title="Edit Name"
        />
      </div>

    </div>
  );
};

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18"/><path d="M6 6 18 18"/></svg>
)

export default Home;