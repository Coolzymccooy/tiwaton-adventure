import React, { useState, useEffect } from 'react';
import { Calendar, /*Clock,*/ Plus, Trash2, Mail, Bell } from 'lucide-react';
import { StorageService } from '../services/storage';
import type { CountdownEvent } from '../types';


const CountdownPage: React.FC = () => {
  const [events, setEvents] = useState<CountdownEvent[]>([]);
  const [newEventName, setNewEventName] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [notificationEmail, setNotificationEmail] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    setEvents(StorageService.getEvents());
  }, []);

  const handleAdd = () => {
    if (!newEventName || !newEventDate) return;
    const updated = StorageService.addEvent(newEventName, newEventDate, notificationEmail);
    setEvents(updated);
    if (notificationEmail) {
        alert(`Reminder scheduled! An email will be sent to ${notificationEmail} closer to the date.`);
    }
    setNewEventName('');
    setNewEventDate('');
    setNotificationEmail('');
    setShowAdd(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Remove this event?")) {
      const updated = StorageService.removeEvent(id);
      setEvents(updated);
    }
  };

  const calculateTimeLeft = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    if (diff < 0) return { days: 0, hours: 0, passed: true };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return { days, hours, passed: false };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="font-display text-3xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400">
             Events Radar
           </h2>
           <p className="text-slate-400 text-sm">Counting down to fun!</p>
        </div>
        {!showAdd && (
          <button 
            onClick={() => setShowAdd(true)}
            title="Create New Event"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl font-bold text-white shadow-lg text-sm"
          >
            <Plus size={16} /> New Event
          </button>
        )}
      </div>

      {showAdd && (
        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 animate-fade-in">
          <h3 className="text-lg font-bold mb-3">Add Event</h3>
          <div className="space-y-3">
            <input 
              value={newEventName}
              onChange={e => setNewEventName(e.target.value)}
              placeholder="Event Name (e.g. Disney Trip)"
              title="Event Name"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 outline-none focus:border-indigo-500"
            />
            <input 
              type="date"
              value={newEventDate}
              onChange={e => setNewEventDate(e.target.value)}
              title="Event Date"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white outline-none focus:border-indigo-500"
            />
            <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-500" size={16} />
                <input 
                  type="email"
                  value={notificationEmail}
                  onChange={e => setNotificationEmail(e.target.value)}
                  placeholder="Parent Email for Reminders (Optional)"
                  title="Notification Email"
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 pl-10 outline-none focus:border-indigo-500"
                />
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={handleAdd} title="Save Event" className="flex-1 bg-green-600 hover:bg-green-500 py-2 rounded-lg font-bold text-sm">Save & Notify</button>
              <button onClick={() => setShowAdd(false)} title="Cancel" className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded-lg font-bold text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {events.map(evt => {
          const time = calculateTimeLeft(evt.date);
          return (
            <div key={evt.id} className="relative bg-slate-800 border-l-4 border-indigo-500 p-4 rounded-r-xl shadow-md flex justify-between items-center group overflow-hidden">
               {/* Background Glow */}
               <div className="absolute -right-10 -top-10 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl"></div>
               
               <div className="relative z-10">
                 <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {evt.name}
                   {evt.notificationEmail && (
  <span title="Notifications Enabled" className="inline-flex">
    <Bell size={12} className="text-amber-400" />
  </span>
)}
                 </h3>
                 <div className="text-xs text-slate-500 font-mono mt-1">
                   {new Date(evt.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                 </div>
               </div>

               <div className="flex items-center gap-4 relative z-10">
                  {time.passed ? (
                    <span className="text-sm font-bold text-green-400 bg-green-900/30 px-3 py-1 rounded-full">Today!</span>
                  ) : (
                    <div className="text-right">
                       <span className="text-2xl font-black text-indigo-300 block leading-none">{time.days}</span>
                       <span className="text-[10px] text-slate-500 uppercase tracking-widest">Days Left</span>
                    </div>
                  )}
                  <button onClick={() => handleDelete(evt.id)} title="Delete Event" className="text-slate-600 hover:text-red-400 transition-colors">
                     <Trash2 size={18} />
                  </button>
               </div>
            </div>
          );
        })}

        {events.length === 0 && !showAdd && (
          <div className="text-center py-12 opacity-50">
            <Calendar size={48} className="mx-auto mb-4 text-slate-600" />
            <p>No events yet. Start the countdown!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountdownPage;