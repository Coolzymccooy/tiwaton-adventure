import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock, Plus, Trash2, Mail, Bell, Sparkles, Star, ChevronDown, ChevronUp, Rocket } from 'lucide-react';
import { StorageService } from '../services/storage';
import type { CountdownEvent, EventCategory } from '../types';
import { useI18n } from '../i18n/I18nProvider';

// ─── Category Config ───

const CATEGORY_CONFIG: Record<EventCategory, { emoji: string; gradient: string; border: string; bg: string }> = {
  birthday: { emoji: '🎂', gradient: 'from-pink-500 to-rose-500', border: 'border-pink-500', bg: 'bg-pink-500/10' },
  holiday: { emoji: '🎄', gradient: 'from-emerald-500 to-green-500', border: 'border-emerald-500', bg: 'bg-emerald-500/10' },
  trip: { emoji: '✈️', gradient: 'from-sky-500 to-cyan-500', border: 'border-sky-500', bg: 'bg-sky-500/10' },
  school: { emoji: '📚', gradient: 'from-amber-500 to-yellow-500', border: 'border-amber-500', bg: 'bg-amber-500/10' },
  church: { emoji: '⛪', gradient: 'from-violet-500 to-purple-500', border: 'border-violet-500', bg: 'bg-violet-500/10' },
  sports: { emoji: '⚽', gradient: 'from-orange-500 to-red-500', border: 'border-orange-500', bg: 'bg-orange-500/10' },
  family: { emoji: '👨‍👩‍👧‍👦', gradient: 'from-teal-500 to-emerald-500', border: 'border-teal-500', bg: 'bg-teal-500/10' },
  custom: { emoji: '🌟', gradient: 'from-indigo-500 to-blue-500', border: 'border-indigo-500', bg: 'bg-indigo-500/10' },
};

// ─── Quick Templates ───

interface QuickTemplate {
  name: { en: string; de: string };
  category: EventCategory;
  emoji: string;
  daysFromNow?: number;
}

const QUICK_TEMPLATES: QuickTemplate[] = [
  { name: { en: 'My Birthday', de: 'Mein Geburtstag' }, category: 'birthday', emoji: '🎂' },
  { name: { en: 'Christmas', de: 'Weihnachten' }, category: 'holiday', emoji: '🎄' },
  { name: { en: 'Summer Vacation', de: 'Sommerferien' }, category: 'trip', emoji: '🏖️' },
  { name: { en: 'Easter', de: 'Ostern' }, category: 'holiday', emoji: '🐣' },
  { name: { en: 'School Trip', de: 'Schulausflug' }, category: 'school', emoji: '🚌' },
  { name: { en: 'Sports Day', de: 'Sporttag' }, category: 'sports', emoji: '🏅' },
  { name: { en: 'Family Reunion', de: 'Familientreffen' }, category: 'family', emoji: '🤗' },
  { name: { en: 'Church Camp', de: 'Kirchencamp' }, category: 'church', emoji: '⛺' },
  { name: { en: 'Halloween', de: 'Halloween' }, category: 'holiday', emoji: '🎃' },
  { name: { en: 'Movie Night', de: 'Filmabend' }, category: 'family', emoji: '🍿' },
];

// ─── Helpers ───

function getTimeLeft(dateStr: string) {
  const now = new Date();
  const target = new Date(dateStr + 'T23:59:59');
  const diff = target.getTime() - now.getTime();

  if (diff < 0) return { days: 0, hours: 0, minutes: 0, passed: true, totalMs: diff };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { days, hours, minutes, passed: false, totalMs: diff };
}

function getSection(days: number, passed: boolean): 'today' | 'tomorrow' | 'week' | 'upcoming' | 'past' {
  if (passed) return 'past';
  if (days === 0) return 'today';
  if (days === 1) return 'tomorrow';
  if (days <= 7) return 'week';
  return 'upcoming';
}

function getMotivation(days: number, t: (k: string) => string): string {
  if (days <= 1) return t('countdown.almostThere');
  if (days <= 3) return t('countdown.getReady');
  if (days <= 7) return t('countdown.soExciting');
  if (days <= 30) return t('countdown.cantWait');
  return t('countdown.wayToGo');
}

// ─── Animated Ring Component ───

const CountdownRing: React.FC<{ days: number; maxDays?: number; size?: number; color: string }> = ({
  days, maxDays = 365, size = 72, color,
}) => {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, 1 - days / maxDays);
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor"
          strokeWidth="3" className="text-slate-700/50" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color}
          strokeWidth="4" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-black leading-none">{days}</span>
      </div>
    </div>
  );
};

// ─── Celebration Burst ───

const CelebrationBurst: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {Array.from({ length: 12 }).map((_, i) => (
      <div key={i}
        className="absolute text-2xl animate-bounce"
        style={{
          left: `${10 + (i * 7) % 80}%`,
          top: `${5 + (i * 13) % 70}%`,
          animationDelay: `${i * 0.15}s`,
          animationDuration: `${1.5 + (i % 3) * 0.5}s`,
        }}
      >
        {['🎉', '🎊', '✨', '🌟', '🎈', '💫'][i % 6]}
      </div>
    ))}
  </div>
);

// ─── Event Card ───

const EventCard: React.FC<{
  event: CountdownEvent;
  onDelete: (id: string) => void;
  t: (k: string) => string;
}> = ({ event, onDelete, t }) => {
  const time = getTimeLeft(event.date);
  const section = getSection(time.days, time.passed);
  const cat = CATEGORY_CONFIG[event.category || 'custom'];
  const emoji = event.emoji || cat.emoji;
  const isToday = section === 'today';
  const isTomorrow = section === 'tomorrow';

  return (
    <div className={`relative group rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
      isToday ? 'ring-2 ring-amber-400/50 shadow-amber-400/20 shadow-lg' : 'shadow-md'
    }`}>
      {isToday && <CelebrationBurst />}

      <div className={`relative ${cat.bg} backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4`}>
        {/* Top row: emoji + name + bell */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-2xl shrink-0 shadow-lg`}>
              {emoji}
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-white truncate flex items-center gap-2">
                {event.name}
                {event.notificationEmail && <Bell size={12} className="text-amber-400 shrink-0" />}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {new Date(event.date + 'T00:00:00').toLocaleDateString(undefined, {
                  weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
                })}
              </p>
            </div>
          </div>

          <button
            onClick={() => onDelete(event.id)}
            title="Delete Event"
            className="text-slate-600 hover:text-red-400 transition-colors p-1 opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Countdown display */}
        <div className="mt-3 flex items-center justify-between">
          {time.passed ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 bg-slate-700/50 px-3 py-1 rounded-full">
                {t('countdown.past')}
              </span>
            </div>
          ) : isToday ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-amber-300 bg-amber-500/20 px-4 py-1.5 rounded-full animate-pulse">
                {t('countdown.todayLabel')}
              </span>
              <span className="text-xs text-amber-200">{t('countdown.happening')}</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <CountdownRing days={time.days} size={56} color={isToday ? '#fbbf24' : isTomorrow ? '#f97316' : '#818cf8'} />
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-white">{time.days}</span>
                  <span className="text-xs text-slate-400">{t('countdown.sleeps')}</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {getMotivation(time.days, t)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Empty State ───

const EmptyState: React.FC<{
  onQuickAdd: (template: QuickTemplate) => void;
  onCustom: () => void;
  t: (k: string) => string;
  locale: string;
}> = ({ onQuickAdd, onCustom, t, locale }) => (
  <div className="text-center py-8 animate-fade-in">
    <div className="relative inline-block mb-6">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mx-auto">
        <Rocket size={40} className="text-indigo-400" />
      </div>
      <div className="absolute -top-2 -right-2 text-2xl animate-bounce">✨</div>
      <div className="absolute -bottom-1 -left-3 text-xl animate-bounce" style={{ animationDelay: '0.3s' }}>🌟</div>
    </div>

    <h3 className="text-xl font-bold text-white mb-2">{t('countdown.noEvents')}</h3>
    <p className="text-slate-400 text-sm mb-6">{t('countdown.noEventsHint')}</p>

    <div className="mb-4">
      <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 font-bold">{t('countdown.quickAdd')}</p>
      <div className="flex flex-wrap justify-center gap-2">
        {QUICK_TEMPLATES.slice(0, 6).map((tpl) => (
          <button
            key={tpl.name.en}
            onClick={() => onQuickAdd(tpl)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 rounded-xl text-sm transition-all hover:scale-105"
          >
            <span>{tpl.emoji}</span>
            <span className="text-slate-300">{tpl.name[locale as 'en' | 'de'] || tpl.name.en}</span>
          </button>
        ))}
      </div>
    </div>

    <button
      onClick={onCustom}
      className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
    >
      + {t('countdown.orCustom')}
    </button>
  </div>
);

// ─── Section Header ───

const SectionHeader: React.FC<{ label: string; icon: React.ReactNode; count: number }> = ({ label, icon, count }) => (
  <div className="flex items-center gap-2 mt-6 mb-3 first:mt-0">
    <span className="text-slate-500">{icon}</span>
    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
    <span className="text-[10px] text-slate-600 bg-slate-800 px-2 py-0.5 rounded-full">{count}</span>
    <div className="flex-1 h-px bg-slate-800" />
  </div>
);

// ─── Main Page ───

const CountdownPage: React.FC = () => {
  const { t, locale } = useI18n();
  const [events, setEvents] = useState<CountdownEvent[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showPast, setShowPast] = useState(false);

  // Form state
  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCategory, setNewCategory] = useState<EventCategory>('custom');
  const [newEmoji, setNewEmoji] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      const data = await StorageService.getEvents();
      setEvents(Array.isArray(data) ? data : []);
    };
    fetchEvents();
  }, []);

  // Sort and group events
  const grouped = useMemo(() => {
    const sorted = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const groups: Record<string, CountdownEvent[]> = { today: [], tomorrow: [], week: [], upcoming: [], past: [] };

    for (const evt of sorted) {
      const time = getTimeLeft(evt.date);
      const section = getSection(time.days, time.passed);
      groups[section].push(evt);
    }
    return groups;
  }, [events]);

  const activeCount = events.length - grouped.past.length;

  const handleAdd = async () => {
    if (!newName || !newDate) return;
    const updated = await StorageService.addEvent(newName, newDate, newEmail || undefined, newCategory, newEmoji || undefined);
    setEvents(Array.isArray(updated) ? updated : []);
    if (newEmail) {
      alert(locale === 'de'
        ? `Erinnerung geplant! Eine E-Mail wird an ${newEmail} gesendet.`
        : `Reminder scheduled! An email will be sent to ${newEmail} closer to the date.`);
    }
    setNewName('');
    setNewDate('');
    setNewEmail('');
    setNewCategory('custom');
    setNewEmoji('');
    setShowAdd(false);
  };

  const handleQuickAdd = (tpl: QuickTemplate) => {
    setNewName(tpl.name[locale as 'en' | 'de'] || tpl.name.en);
    setNewCategory(tpl.category);
    setNewEmoji(tpl.emoji);
    setShowAdd(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm(locale === 'de' ? 'Event entfernen?' : 'Remove this event?')) {
      const updated = await StorageService.removeEvent(id);
      setEvents(Array.isArray(updated) ? updated : []);
    }
  };

  const renderSection = (key: string, label: string, icon: React.ReactNode, items: CountdownEvent[]) => {
    if (items.length === 0) return null;
    return (
      <div key={key}>
        <SectionHeader label={label} icon={icon} count={items.length} />
        <div className="grid gap-3">
          {items.map(evt => (
            <EventCard key={evt.id} event={evt} onDelete={handleDelete} t={t} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5 animate-fade-in max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-display text-3xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 font-black">
            {t('countdown.title')}
          </h2>
          <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
            {t('countdown.subtitle')}
            {activeCount > 0 && (
              <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-2 py-0.5 rounded-full">
                {activeCount} active
              </span>
            )}
          </p>
        </div>
        {!showAdd && (
          <button
            onClick={() => setShowAdd(true)}
            title="Create New Event"
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-4 py-2.5 rounded-xl font-bold text-white shadow-lg text-sm transition-all hover:scale-105 hover:shadow-indigo-500/25"
          >
            <Plus size={16} /> {t('countdown.addButton')}
          </button>
        )}
      </div>

      {/* Quick template strip (when events exist) */}
      {events.length > 0 && !showAdd && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {QUICK_TEMPLATES.slice(0, 8).map((tpl) => (
            <button
              key={tpl.name.en}
              onClick={() => handleQuickAdd(tpl)}
              className="shrink-0 flex items-center gap-1 px-3 py-1.5 bg-slate-800/60 hover:bg-slate-700 border border-slate-700/50 rounded-full text-xs transition-all hover:scale-105"
            >
              <span>{tpl.emoji}</span>
              <span className="text-slate-400">{tpl.name[locale as 'en' | 'de'] || tpl.name.en}</span>
            </button>
          ))}
        </div>
      )}

      {/* Add Event Form */}
      {showAdd && (
        <div className="bg-slate-800/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-700/50 animate-fade-in shadow-xl">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-400" />
            {t('countdown.addTitle')}
          </h3>
          <div className="space-y-3">
            {/* Name */}
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder={t('countdown.eventNamePlaceholder')}
              title="Event Name"
              className="w-full bg-slate-900/80 border border-slate-600 rounded-xl p-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all text-white"
            />

            {/* Date */}
            <input
              type="date"
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
              title="Event Date"
              min={new Date().toISOString().split('T')[0]}
              className="w-full bg-slate-900/80 border border-slate-600 rounded-xl p-3 text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
            />

            {/* Category selector */}
            <div>
              <label className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2 block">
                {t('countdown.categoryLabel')}
              </label>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(CATEGORY_CONFIG) as EventCategory[]).map((cat) => {
                  const cfg = CATEGORY_CONFIG[cat];
                  const selected = newCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => { setNewCategory(cat); setNewEmoji(cfg.emoji); }}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selected
                          ? `bg-gradient-to-r ${cfg.gradient} text-white shadow-md scale-105`
                          : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      <span>{cfg.emoji}</span>
                      <span className="capitalize">{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-500" size={16} />
              <input
                type="email"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                placeholder={t('countdown.notifyPlaceholder')}
                title="Notification Email"
                className="w-full bg-slate-900/80 border border-slate-600 rounded-xl p-3 pl-10 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all text-white"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleAdd}
                title="Save Event"
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] shadow-lg"
              >
                {t('countdown.saveButton')}
              </button>
              <button
                onClick={() => setShowAdd(false)}
                title="Cancel"
                className="flex-1 bg-slate-700 hover:bg-slate-600 py-2.5 rounded-xl font-bold text-sm transition-colors"
              >
                {t('countdown.cancelButton')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {events.length === 0 && !showAdd && (
        <EmptyState onQuickAdd={handleQuickAdd} onCustom={() => setShowAdd(true)} t={t} locale={locale} />
      )}

      {/* Event Sections */}
      {events.length > 0 && (
        <div className="space-y-1">
          {renderSection('today', t('countdown.todayLabel'), <Star size={14} className="text-amber-400" />, grouped.today)}
          {renderSection('tomorrow', t('countdown.tomorrow'), <Clock size={14} className="text-orange-400" />, grouped.tomorrow)}
          {renderSection('week', t('countdown.thisWeek'), <Calendar size={14} className="text-blue-400" />, grouped.week)}
          {renderSection('upcoming', t('countdown.upcoming'), <Rocket size={14} className="text-indigo-400" />, grouped.upcoming)}

          {/* Past events collapsible */}
          {grouped.past.length > 0 && (
            <div>
              <button
                onClick={() => setShowPast(!showPast)}
                className="flex items-center gap-2 mt-6 mb-3 w-full text-left group"
              >
                <span className="text-slate-600"><Calendar size={14} /></span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('countdown.past')}</span>
                <span className="text-[10px] text-slate-600 bg-slate-800 px-2 py-0.5 rounded-full">{grouped.past.length}</span>
                <div className="flex-1 h-px bg-slate-800" />
                {showPast ? <ChevronUp size={14} className="text-slate-600" /> : <ChevronDown size={14} className="text-slate-600" />}
              </button>
              {showPast && (
                <div className="grid gap-3 opacity-60">
                  {grouped.past.map(evt => (
                    <EventCard key={evt.id} event={evt} onDelete={handleDelete} t={t} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CountdownPage;
