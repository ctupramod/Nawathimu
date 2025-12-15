import React from 'react';
import { ShieldCheck, Calendar, Flame, ArrowRight, Droplets, Wind, Sparkles, CheckCircle2, Users } from 'lucide-react';
import { User, CheckInLog, AiAdvice, Language, AppView } from '../types';
import RecoveryTimeline from './RecoveryTimeline';
import { t } from '../utils/translations';

interface DashboardProps {
  user: User;
  daysClean: number;
  logs: CheckInLog[];
  lastAdvice: AiAdvice | null;
  onCheckInClick: () => void;
  onChangeView: (view: AppView) => void;
  lang: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ user, daysClean, logs, lastAdvice, onCheckInClick, onChangeView, lang }) => {
  return (
    <div className="p-6 pb-24 max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('welcome', lang)}, {user.name}</h1>
          <p className="text-emerald-400 text-sm font-medium flex items-center gap-1">
             <ShieldCheck size={14} /> {t('fighting', lang)} {user.addiction}
          </p>
        </div>
        <div className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
          <span className="text-amber-400 font-bold text-sm">{user.coins} XP</span>
        </div>
      </div>

      {/* Big Counter */}
      <div className="glass-panel p-8 rounded-3xl text-center relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500"></div>
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all duration-500"></div>
        
        <p className="text-slate-400 font-medium uppercase tracking-wider text-xs">{t('streak', lang)}</p>
        <div className="text-7xl font-bold text-white my-2 tracking-tighter drop-shadow-xl font-mono">
          {daysClean}
        </div>
        <p className="text-emerald-400 font-medium text-lg">{t('cleanDays', lang)}</p>
      </div>

      {/* Action Button */}
      <button
        onClick={onCheckInClick}
        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 p-1 rounded-2xl shadow-xl shadow-emerald-900/30 transition-transform active:scale-95 hover:shadow-emerald-500/20"
      >
        <div className="bg-slate-900/50 hover:bg-transparent transition-colors rounded-xl p-4 flex items-center justify-between backdrop-blur-sm">
           <div className="flex items-center gap-3">
             <div className="bg-white/20 p-2 rounded-lg">
               <CheckCircle2 className="text-white" size={24} />
             </div>
             <div className="text-left">
               <p className="font-bold text-white">{t('dailyCheckIn', lang)}</p>
               <p className="text-xs text-emerald-100">{t('getHelp', lang)}</p>
             </div>
           </div>
           <ArrowRight className="text-white opacity-50" />
        </div>
      </button>

      {/* Current Stage Timeline (Compact) */}
      <RecoveryTimeline daysClean={daysClean} addiction={user.addiction} lang={lang} compact={true} />

      {/* Community Card */}
      <button 
        onClick={() => onChangeView(AppView.COMMUNITY)}
        className="w-full bg-slate-800/50 hover:bg-slate-800 p-4 rounded-2xl border border-slate-700 flex items-center justify-between transition-colors"
      >
         <div className="flex items-center gap-3">
            <div className="bg-blue-900/30 p-2 rounded-lg">
                <Users className="text-blue-400" size={20} />
            </div>
            <div className="text-left">
                <p className="font-bold text-white">{t('community', lang)}</p>
                <p className="text-xs text-slate-400">Connect with anonymous peers</p>
            </div>
         </div>
         <ArrowRight className="text-slate-500" size={18} />
      </button>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
         <div className="glass-panel p-4 rounded-2xl">
            <Calendar className="text-blue-400 mb-2" size={20} />
            <p className="text-xs text-slate-500">Started</p>
            <p className="font-bold text-slate-200">{new Date(user.quitDate).toLocaleDateString()}</p>
         </div>
         <div className="glass-panel p-4 rounded-2xl">
            <Flame className="text-orange-400 mb-2" size={20} />
            <p className="text-xs text-slate-500">Check-ins</p>
            <p className="font-bold text-slate-200">{logs.length}</p>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;