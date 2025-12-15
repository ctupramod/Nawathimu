import React, { useState } from 'react';
import { 
  ChevronDown, ChevronUp, Sun, Brain, Moon, Heart, 
  CheckCircle2, Lock, Droplets, Zap, Coffee 
} from 'lucide-react';
import { Language } from '../types';
import { t } from '../utils/translations';

interface RecoveryTimelineProps {
  daysClean: number;
  addiction: string;
  lang: Language;
  compact?: boolean; // New prop for Dashboard view
}

interface Phase {
  id: string;
  name: string;
  range: string;
  minDays: number;
  maxDays: number;
  symptoms: string[];
  helpers: { title: string; desc: string; icon: React.ReactNode }[];
}

const RecoveryTimeline: React.FC<RecoveryTimelineProps> = ({ daysClean, lang, compact = false }) => {
  // Define phases using translation keys
  const phases: Phase[] = [
    {
      id: 'acute',
      name: t('phase_acute', lang),
      range: 'Days 1-7',
      minDays: 0,
      maxDays: 7,
      symptoms: [t('sym_cravings', lang), t('sym_flu_like', lang) || t('sym_sweating', lang), t('sym_irritability', lang), t('sym_anxiety', lang)],
      helpers: [
        { title: t('tip_hydro', lang), desc: t('tip_hydro_desc', lang), icon: <Droplets size={18} className="text-blue-400" /> },
        { title: t('tip_rest', lang), desc: t('tip_rest_desc', lang), icon: <Moon size={18} className="text-indigo-400" /> },
        { title: t('tip_showers', lang), desc: t('tip_showers_desc', lang), icon: <Coffee size={18} className="text-orange-400" /> }
      ]
    },
    {
      id: 'post-acute',
      name: t('phase_post_acute', lang),
      range: 'Days 8-14',
      minDays: 8,
      maxDays: 14,
      symptoms: [t('sym_irritability', lang), t('sym_fatigue', lang), t('sym_cravings', lang), t('sym_brain_fog', lang)],
      helpers: [
        { title: t('tip_exercise', lang), desc: t('tip_exercise_desc', lang), icon: <Zap size={18} className="text-yellow-400" /> },
        { title: t('tip_snack', lang), desc: t('tip_snack_desc', lang), icon: <Coffee size={18} className="text-emerald-400" /> },
        { title: t('tip_distract', lang), desc: t('tip_distract_desc', lang), icon: <Sun size={18} className="text-amber-400" /> }
      ]
    },
    {
      id: 'subacute',
      name: t('phase_subacute', lang),
      range: 'Days 15-30',
      minDays: 15,
      maxDays: 30,
      symptoms: [t('sym_depression', lang), t('sym_insomnia', lang), t('sym_brain_fog', lang), t('sym_cravings', lang)],
      helpers: [
        { title: t('tip_walk', lang), desc: t('tip_walk_desc', lang), icon: <Sun size={18} className="text-amber-400" /> },
        { title: t('tip_omega', lang), desc: t('tip_omega_desc', lang), icon: <Brain size={18} className="text-pink-400" /> },
        { title: t('tip_rest', lang), desc: t('tip_rest_desc', lang), icon: <Moon size={18} className="text-indigo-400" /> },
        { title: t('tip_connect', lang), desc: t('tip_connect_desc', lang), icon: <Heart size={18} className="text-rose-400" /> }
      ]
    },
    {
      id: 'early-recovery',
      name: t('phase_early', lang),
      range: 'Days 31-90',
      minDays: 31,
      maxDays: 90,
      symptoms: [t('sym_fatigue', lang), t('sym_depression', lang)],
      helpers: [
        { title: t('tip_routine', lang), desc: t('tip_routine_desc', lang), icon: <CheckCircle2 size={18} className="text-emerald-400" /> },
        { title: 'Mindfulness', desc: 'Meditation.', icon: <Brain size={18} className="text-blue-400" /> },
        { title: 'Social Hobbies', desc: 'Join clubs.', icon: <Heart size={18} className="text-rose-400" /> }
      ]
    },
    {
      id: 'maintenance',
      name: t('phase_maint', lang),
      range: 'Days 90+',
      minDays: 91,
      maxDays: 99999,
      symptoms: [t('sym_cravings', lang)],
      helpers: [
        { title: t('tip_mentor', lang), desc: t('tip_mentor_desc', lang), icon: <Heart size={18} className="text-rose-400" /> },
        { title: 'Goals', desc: 'Focus on career.', icon: <Zap size={18} className="text-yellow-400" /> }
      ]
    }
  ];

  // Determine current phase index
  const currentPhaseIndex = phases.findIndex(p => daysClean >= p.minDays && daysClean <= p.maxDays);
  // Default to last phase if daysClean is very high, or first if 0
  const activeIndex = currentPhaseIndex === -1 ? (daysClean > 90 ? phases.length - 1 : 0) : currentPhaseIndex;

  const [expandedPhase, setExpandedPhase] = useState<number | null>(compact ? activeIndex : activeIndex);

  const togglePhase = (index: number) => {
    if (expandedPhase === index) {
      setExpandedPhase(null);
    } else {
      setExpandedPhase(index);
    }
  };

  // If compact mode, filter to only active phase
  const phasesToRender = compact ? [phases[activeIndex]] : phases;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white mb-2">{t('timeline_title', lang)}</h2>
      
      {phasesToRender.map((phase, i) => {
        // Map back to original index for full logic if needed, but for display we rely on phase data
        const index = compact ? activeIndex : i;
        const isActive = index === activeIndex;
        const isPast = index < activeIndex;
        const isExpanded = expandedPhase === index;

        return (
          <div 
            key={phase.id}
            className={`rounded-2xl transition-all duration-300 overflow-hidden border ${
              isActive 
                ? 'bg-[#1e1b4b] border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
                : isPast 
                  ? 'bg-slate-900/50 border-emerald-900/30' 
                  : 'bg-slate-900/30 border-slate-800'
            }`}
          >
            {/* Header */}
            <div 
              onClick={() => togglePhase(index)}
              className="p-4 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {isPast ? (
                  <CheckCircle2 className="text-emerald-500" size={20} />
                ) : isActive ? (
                  <div className="w-5 h-5 rounded-full border-2 border-indigo-400 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse"></div>
                  </div>
                ) : (
                  <Lock className="text-slate-600" size={20} />
                )}
                
                <div>
                  <h3 className={`font-bold text-sm ${isActive ? 'text-indigo-200' : isPast ? 'text-emerald-200/70' : 'text-slate-500'}`}>
                    {phase.name}
                  </h3>
                  <p className={`text-xs ${isActive ? 'text-indigo-400' : 'text-slate-600'}`}>
                    {phase.range}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isActive && (
                  <span className="bg-indigo-600/20 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-500/30">
                    {t('you_are_here', lang)}
                  </span>
                )}
                {isExpanded ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
              </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                {/* Symptoms Tags */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t('common_symptoms', lang)}</p>
                  <div className="flex flex-wrap gap-2">
                    {phase.symptoms.map(s => (
                      <span key={s} className="text-xs bg-slate-800/80 text-slate-300 px-2 py-1 rounded-md border border-slate-700/50">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* What Helps List */}
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t('what_helps', lang)}</p>
                  <div className="space-y-2">
                    {phase.helpers.map((h, k) => (
                      <div key={k} className="flex items-start gap-3 bg-slate-800/40 p-3 rounded-xl border border-slate-700/30 hover:bg-slate-800/60 transition-colors">
                        <div className="bg-slate-900 p-2 rounded-lg shrink-0">
                          {h.icon}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-200">{h.title}</p>
                          <p className="text-xs text-slate-400 leading-relaxed">{h.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RecoveryTimeline;