import React, { useState } from 'react';
import { 
  ShieldCheck, Calendar, Flame, ArrowRight, CheckCircle2, 
  Users, Gamepad2, Award, TrendingUp, Activity, Share2
} from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { User, CheckInLog, Language, AppView } from '../types';
import RecoveryTimeline from './RecoveryTimeline';
import { t } from '../utils/translations';
import ShareModal from './ShareModal';

interface DashboardProps {
  user: User;
  daysClean: number;
  logs: CheckInLog[];
  onChangeView: (view: AppView) => void;
  lang: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ user, daysClean, logs, onChangeView, lang }) => {
  const [showShareModal, setShowShareModal] = useState(false);

  // Calculate simple mood trend for mini chart
  const moodData = logs.slice(-7).map(log => ({
    mood: log.mood,
    day: new Date(log.date).getDate()
  }));

  const lastCheckIn = new Date(user.lastCheckInDate || 0).toDateString();
  const today = new Date().toDateString();
  const hasCheckedInToday = lastCheckIn === today;

  return (
    <div className="p-6 pb-24 md:p-8 md:ml-64 max-w-7xl mx-auto space-y-6">
      {showShareModal && (
        <ShareModal 
            daysClean={daysClean} 
            addiction={user.addiction} 
            streak={user.currentStreak || 0}
            onClose={() => setShowShareModal(false)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('welcome', lang)}, {user.name}</h1>
          <p className="text-emerald-400 text-sm font-medium flex items-center gap-1 mt-1">
             <ShieldCheck size={16} /> {t('fighting', lang)} {user.addiction}
          </p>
        </div>
        <div className="flex items-center gap-3 bg-slate-800/80 p-2 rounded-full border border-slate-700 w-fit">
          <div className="bg-amber-500/20 p-2 rounded-full">
            <Flame className="text-amber-500" size={20} />
          </div>
          <div className="pr-4">
             <p className="text-xs text-slate-400 uppercase font-bold">Streak</p>
             <p className="text-lg font-bold text-white leading-none">{user.currentStreak || 0} Days</p>
          </div>
          <div className="h-8 w-px bg-slate-700 mx-1"></div>
          <div className="bg-emerald-500/20 p-2 rounded-full">
             <Award className="text-emerald-500" size={20} />
          </div>
          <div className="pr-4">
             <p className="text-xs text-slate-400 uppercase font-bold">Level {user.level}</p>
             <p className="text-lg font-bold text-white leading-none">{user.coins} XP</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column (Hero & Widgets) */}
        <div className="md:col-span-8 space-y-6">
           {/* Hero Card */}
           <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group min-h-[200px] flex items-center">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500"></div>
             <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500 -translate-y-1/2 translate-x-1/4"></div>
             
             {/* Share Button absolute positioned */}
             <button 
                onClick={() => setShowShareModal(true)}
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md transition-all z-20 text-white"
                title="Share Milestone"
             >
                <Share2 size={20} />
             </button>

             <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                    <p className="text-slate-400 font-medium uppercase tracking-wider text-xs mb-2">Total Recovery Time</p>
                    <div className="text-6xl md:text-7xl font-bold text-white tracking-tighter font-mono">
                    {daysClean}
                    </div>
                    <p className="text-emerald-400 font-medium text-lg">{t('cleanDays', lang)}</p>
                </div>

                {/* Mini Mood Chart */}
                <div className="w-full md:w-1/2 h-32 bg-slate-900/40 rounded-xl border border-slate-700/50 p-2">
                    <div className="flex items-center gap-2 mb-2 px-2">
                        <TrendingUp size={14} className="text-emerald-400" />
                        <span className="text-xs font-bold text-slate-400">7 Day Mood Trend</span>
                    </div>
                    <ResponsiveContainer width="100%" height="80%">
                        <AreaChart data={moodData}>
                            <defs>
                                <linearGradient id="colorMoodHero" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="mood" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorMoodHero)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
             </div>
           </div>

           {/* Action Widgets Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Check In Widget */}
              <button
                onClick={() => onChangeView(AppView.CHECKIN)}
                disabled={hasCheckedInToday}
                className={`relative overflow-hidden rounded-2xl p-6 text-left border transition-all duration-300 group ${
                    hasCheckedInToday 
                    ? 'bg-slate-800/50 border-slate-700 opacity-75 cursor-default' 
                    : 'bg-gradient-to-br from-emerald-900/80 to-slate-900 border-emerald-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                 {/* Decorative Pulse Background for Active State */}
                 {!hasCheckedInToday && (
                    <>
                        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl animate-pulse"></div>
                    </>
                 )}

                 <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className={`p-3 rounded-xl shadow-lg transition-transform duration-300 ${
                        hasCheckedInToday 
                            ? 'bg-slate-700 text-slate-400' 
                            : 'bg-emerald-500 text-white group-hover:scale-110 group-hover:rotate-3 shadow-emerald-900/40'
                        }`}>
                        <CheckCircle2 size={24} className={!hasCheckedInToday ? "animate-pulse" : ""} />
                    </div>
                    {!hasCheckedInToday && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full animate-pulse shadow-lg shadow-red-900/50 border border-red-400/50">
                            ACTION REQUIRED
                        </span>
                    )}
                 </div>
                 
                 <h3 className="text-xl font-bold text-white mb-1 relative z-10">{t('dailyCheckIn', lang)}</h3>
                 <p className="text-sm text-slate-300 relative z-10 font-medium">
                    {hasCheckedInToday ? "You're all set for today!" : "Log your symptoms and get daily advice."}
                 </p>
                 
                 {!hasCheckedInToday && (
                    <div className="mt-4 flex items-center text-emerald-400 text-sm font-bold group-hover:gap-2 transition-all relative z-10">
                        Start Now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                 )}
              </button>

              {/* Games Widget */}
              <button
                onClick={() => onChangeView(AppView.GAMES)}
                className="relative overflow-hidden rounded-2xl p-6 text-left border border-indigo-500/30 bg-gradient-to-br from-indigo-900/20 to-slate-900 hover:border-indigo-500/60 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all group"
              >
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-indigo-500 text-white">
                        <Gamepad2 size={24} />
                    </div>
                 </div>
                 <h3 className="text-xl font-bold text-white mb-1">{t('games', lang)}</h3>
                 <p className="text-sm text-slate-400">Distract your mind with quick dopamine-boosting games.</p>
                 <div className="mt-4 flex items-center text-indigo-400 text-sm font-bold group-hover:gap-2 transition-all">
                    Play <ArrowRight size={16} />
                 </div>
              </button>
           </div>
           
           {/* Timeline */}
           <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <RecoveryTimeline daysClean={daysClean} addiction={user.addiction} lang={lang} compact={true} />
           </div>
        </div>

        {/* Right Column (Stats & Community) */}
        <div className="md:col-span-4 space-y-6">
            {/* Quick Stats */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Activity size={18} className="text-blue-400"/> At a Glance
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-xl">
                        <div className="flex items-center gap-3">
                            <Calendar size={18} className="text-slate-400" />
                            <span className="text-slate-300 text-sm">Start Date</span>
                        </div>
                        <span className="font-bold text-white">{new Date(user.quitDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-xl">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 size={18} className="text-slate-400" />
                            <span className="text-slate-300 text-sm">Total Check-ins</span>
                        </div>
                        <span className="font-bold text-white">{logs.length}</span>
                    </div>
                </div>
            </div>

            {/* Share Progress Button */}
            <button
                onClick={() => setShowShareModal(true)}
                className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 p-4 rounded-2xl shadow-lg shadow-pink-900/20 flex items-center justify-between group transition-all"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2.5 rounded-xl text-white">
                        <Share2 size={20} />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-white">Share Progress</h3>
                        <p className="text-xs text-pink-100/80">Create a story for social media</p>
                    </div>
                </div>
                <ArrowRight size={18} className="text-pink-200 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Community Teaser */}
            <button 
                onClick={() => onChangeView(AppView.COMMUNITY)}
                className="w-full bg-slate-800/50 hover:bg-slate-800 p-6 rounded-2xl border border-slate-700 text-left transition-colors group"
            >
                <div className="bg-blue-600/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Users size={24} />
                </div>
                <h3 className="font-bold text-white text-lg">{t('community', lang)}</h3>
                <p className="text-sm text-slate-400 mt-1">Connect with others who understand what you're going through.</p>
                <div className="mt-4 w-full bg-slate-700 h-px group-hover:bg-blue-500/50 transition-colors"></div>
                <div className="mt-3 text-xs text-slate-500 flex justify-between">
                    <span>Online Now</span>
                    <span className="text-green-400 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> 12 Active</span>
                </div>
            </button>
            
            {/* Achievement Mini Teaser (can link to Journal/Awards) */}
            <div className="bg-gradient-to-br from-amber-900/20 to-slate-900 border border-amber-900/30 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-2">
                    <Award className="text-amber-500" />
                    <h3 className="font-bold text-white">Next Milestone</h3>
                </div>
                <p className="text-sm text-slate-400 mb-3">You are close to unlocking "1 Month Clean"!</p>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-3/4"></div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;