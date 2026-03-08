import React, { useEffect, useState } from 'react';
import { View } from '../types';
import { useI18n } from '../i18n/I18nProvider';
import {
  getTodayChallenges,
  isChallengeCompleted,
  clearStaleCompletions,
  type DailyChallenge,
} from '../services/daily-challenges';
import { ArrowRight, CheckCircle2, Flame } from 'lucide-react';

interface Props {
  onNavigate: (view: View) => void;
  compact?: boolean;
}

const DailyQuestBanner: React.FC<Props> = ({ onNavigate, compact }) => {
  const { locale } = useI18n();
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);

  useEffect(() => {
    clearStaleCompletions();
    setChallenges(getTodayChallenges(3));
  }, []);

  if (challenges.length === 0) return null;

  const completedCount = challenges.filter(c => isChallengeCompleted(c.id)).length;
  const allDone = completedCount === challenges.length;

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/20 rounded-2xl p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Flame size={20} className="text-amber-400" />
          <div>
            <p className="text-xs font-black text-amber-400 uppercase tracking-widest">
              {locale === 'de' ? 'Tägliche Quests' : 'Daily Quests'}
            </p>
            <p className="text-[10px] text-slate-400">
              {completedCount}/{challenges.length} {locale === 'de' ? 'erledigt' : 'completed'}
            </p>
          </div>
        </div>
        {!allDone && (
          <div className="flex -space-x-1">
            {challenges.filter(c => !isChallengeCompleted(c.id)).slice(0, 2).map(c => (
              <span key={c.id} className="text-lg">{c.icon}</span>
            ))}
          </div>
        )}
        {allDone && <CheckCircle2 size={20} className="text-emerald-400" />}
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-5 sm:p-6 shadow-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-amber-600/20 rounded-xl">
          <Flame className="text-amber-400" size={20} />
        </div>
        <div>
          <h4 className="text-xl font-black text-white italic tracking-tighter uppercase">
            {locale === 'de' ? 'Tägliche Quests' : 'Daily Quests'}
          </h4>
          <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">
            {completedCount}/{challenges.length} {locale === 'de' ? 'erledigt' : 'completed'}
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {challenges.map(ch => {
          const done = isChallengeCompleted(ch.id);
          return (
            <button
              key={ch.id}
              onClick={() => !done && onNavigate(ch.targetView)}
              disabled={done}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${
                done
                  ? 'bg-emerald-900/20 border-emerald-500/20 opacity-60'
                  : 'bg-slate-800/40 border-white/5 hover:border-amber-500/30 hover:bg-slate-800/70'
              }`}
            >
              <span className="text-2xl shrink-0">{ch.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-black uppercase tracking-tight ${done ? 'text-emerald-400 line-through' : 'text-white'}`}>
                  {ch.title[locale]}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {ch.description[locale]}
                </p>
              </div>
              <div className="shrink-0 text-right">
                {done ? (
                  <CheckCircle2 size={18} className="text-emerald-400" />
                ) : (
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-[9px] font-black text-amber-400">+{ch.xpReward} XP</span>
                    <ArrowRight size={14} className="text-slate-600" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DailyQuestBanner;
