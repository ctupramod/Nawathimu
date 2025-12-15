import React from 'react';
import { Trophy, Lock, Star, Award, Zap } from 'lucide-react';
import { Achievement } from '../types';

interface AchievementsProps {
  daysClean: number;
}

const Achievements: React.FC<AchievementsProps> = ({ daysClean }) => {
  const allAchievements: Achievement[] = [
    { id: '1', title: 'The Awakening', description: '24 Hours Clean', icon: 'zap', requiredDays: 1, unlocked: false },
    { id: '2', title: 'Momentum', description: '3 Days Clean', icon: 'star', requiredDays: 3, unlocked: false },
    { id: '3', title: 'First Week', description: '7 Days Strong', icon: 'trophy', requiredDays: 7, unlocked: false },
    { id: '4', title: 'Fortitude', description: '2 Weeks Clean', icon: 'award', requiredDays: 14, unlocked: false },
    { id: '5', title: 'Mastery', description: '30 Days Clean', icon: 'crown', requiredDays: 30, unlocked: false },
    { id: '6', title: 'Rebirth', description: '90 Days Clean', icon: 'sun', requiredDays: 90, unlocked: false },
  ];

  return (
    <div className="p-6 pb-24 max-w-md mx-auto animate-float">
      <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
        <Trophy className="text-amber-400" /> Hall of Triumph
      </h2>
      <p className="text-slate-400 mb-8">Your milestones on the road to recovery.</p>

      <div className="grid grid-cols-2 gap-4">
        {allAchievements.map((ach) => {
          const isUnlocked = daysClean >= ach.requiredDays;
          
          return (
            <div 
              key={ach.id} 
              className={`relative p-4 rounded-xl border transition-all duration-500 ${
                isUnlocked 
                  ? 'bg-gradient-to-br from-emerald-900/40 to-slate-900 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                  : 'bg-slate-800/50 border-slate-700 opacity-60 grayscale'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className={`p-2 rounded-lg ${isUnlocked ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                   {ach.icon === 'zap' && <Zap size={20} />}
                   {ach.icon === 'star' && <Star size={20} fill={isUnlocked ? "white" : "none"} />}
                   {ach.icon === 'trophy' && <Trophy size={20} />}
                   {ach.icon === 'award' && <Award size={20} />}
                   {ach.icon === 'crown' && <Trophy size={20} />}
                   {ach.icon === 'sun' && <Zap size={20} />}
                </div>
                {isUnlocked ? (
                  <span className="text-xs font-bold text-emerald-400 px-2 py-1 bg-emerald-900/30 rounded-full border border-emerald-500/30">
                    UNLOCKED
                  </span>
                ) : (
                  <Lock size={16} className="text-slate-500" />
                )}
              </div>
              
              <h3 className={`font-bold ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>{ach.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{ach.description}</p>
              
              {/* Progress Bar for Locked Items */}
              {!isUnlocked && (
                <div className="w-full bg-slate-700 h-1.5 mt-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-full rounded-full" 
                    style={{ width: `${Math.min(100, (daysClean / ach.requiredDays) * 100)}%` }}
                  ></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;
