import React from 'react';
import { CheckInLog, Language, User } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, BarChart, Bar } from 'recharts';
import RecoveryTimeline from './RecoveryTimeline';
import { t } from '../utils/translations';
import { Book, TrendingUp, CalendarDays, Brain } from 'lucide-react';

interface JournalProps {
  logs: CheckInLog[];
  user: User;
  daysClean: number;
  lang: Language;
}

const Journal: React.FC<JournalProps> = ({ logs, user, daysClean, lang }) => {
  // Process data for charts
  const chartData = logs.slice(-14).map(log => ({
    date: new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    mood: log.mood,
    cravings: log.cravings,
    severity: log.symptoms.reduce((acc, curr) => acc + curr.severity, 0) / (log.symptoms.length || 1)
  }));

  // Reverse logs for history list (newest first)
  const historyLogs = [...logs].reverse();

  return (
    <div className="p-6 pb-24 md:p-8 md:ml-64 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-purple-900/30 p-3 rounded-full">
            <Book className="text-purple-400" size={24} />
        </div>
        <div>
            <h1 className="text-3xl font-bold text-white">{t('journal', lang)}</h1>
            <p className="text-slate-400 text-sm">Track your journey, patterns, and insights.</p>
        </div>
      </div>

      {/* Analytics Section - Desktop Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Mood vs Cravings Chart */}
         <div className="glass-panel p-6 rounded-2xl border border-slate-700">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-400" /> Mood vs Cravings (Last 14 Entries)
            </h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorMoodJournal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorCravingsJournal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis domain={[0, 10]} hide />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                        <Area type="monotone" dataKey="mood" name="Mood" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorMoodJournal)" />
                        <Area type="monotone" dataKey="cravings" name="Cravings" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorCravingsJournal)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
         </div>

         {/* Symptom Severity Chart */}
         <div className="glass-panel p-6 rounded-2xl border border-slate-700">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Brain size={18} className="text-blue-400" /> Avg. Symptom Severity
            </h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{fill: '#334155', opacity: 0.4}} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                        <Bar dataKey="severity" name="Severity" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
         </div>
      </div>

      {/* History Log Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Check-In History List */}
         <div className="lg:col-span-2 space-y-4">
             <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <CalendarDays className="text-slate-400" /> Past Check-Ins
             </h2>
             {historyLogs.length === 0 ? (
                <div className="text-center p-8 bg-slate-800/50 rounded-xl border border-slate-700 border-dashed">
                    <p className="text-slate-500">No check-ins yet. Start your journey today!</p>
                </div>
             ) : (
                 historyLogs.map((log) => (
                    <div key={log.id} className="bg-slate-800/60 rounded-xl border border-slate-700 overflow-hidden">
                        <div className="p-4 bg-slate-800 flex justify-between items-center">
                            <span className="font-bold text-white">{new Date(log.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            <div className="flex gap-2 text-xs">
                                <span className={`px-2 py-1 rounded-full ${log.mood >= 7 ? 'bg-emerald-500/20 text-emerald-400' : log.mood >= 4 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                                    Mood: {log.mood}/10
                                </span>
                            </div>
                        </div>
                        <div className="p-4 space-y-4">
                            {/* Saved AI Advice */}
                            {log.advice ? (
                                <div className="bg-emerald-900/20 p-4 rounded-lg border border-emerald-900/30">
                                    <p className="text-emerald-200 text-sm italic mb-2">"{log.advice.encouragement}"</p>
                                    <ul className="space-y-1">
                                        {log.advice.practicalTips.map((tip, idx) => (
                                            <li key={idx} className="text-slate-300 text-sm flex items-start gap-2">
                                                <span className="text-emerald-500 mt-1">•</span> {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <p className="text-slate-500 text-xs italic">No AI advice recorded for this entry.</p>
                            )}

                            {/* Symptoms Summary */}
                            {log.symptoms.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {log.symptoms.map(s => (
                                        <span key={s.id} className="text-xs bg-slate-700 px-2 py-1 rounded border border-slate-600 text-slate-300">
                                            {s.name} <span className={`font-bold ml-1 ${s.severity > 7 ? 'text-red-400' : 'text-slate-400'}`}>{s.severity}</span>
                                        </span>
                                    ))}
                                </div>
                            )}
                            
                            {log.notes && (
                                <p className="text-sm text-slate-400 border-l-2 border-slate-600 pl-3 italic">
                                    "{log.notes}"
                                </p>
                            )}
                        </div>
                    </div>
                 ))
             )}
         </div>

         {/* Full Timeline (Sticky on Desktop) */}
         <div className="lg:col-span-1">
            <div className="sticky top-6">
                <h2 className="text-xl font-bold text-white mb-4">{t('fullTimeline', lang)}</h2>
                <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800 max-h-[calc(100vh-100px)] overflow-y-auto">
                    <RecoveryTimeline daysClean={daysClean} addiction={user.addiction} lang={lang} compact={false} />
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Journal;