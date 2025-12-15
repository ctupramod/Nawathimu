import React, { useState } from 'react';
import { Loader2, Sparkles, AlertCircle, Info, Plus, ChevronDown, ChevronRight, Activity, Heart, Brain, Search, Home, CheckCircle2 } from 'lucide-react';
import { SYMPTOM_CATEGORIES, Language, SymptomRecord, AiAdvice } from '../types';
import { generateRecoveryAdvice } from '../services/geminiService';
import { t } from '../utils/translations';

interface CheckInProps {
  userAddiction: string;
  daysClean: number;
  onComplete: (mood: number, cravings: number, symptoms: SymptomRecord[], notes: string, advice: any) => void;
  onExit: () => void;
  lang: Language;
}

const CheckIn: React.FC<CheckInProps> = ({ userAddiction, daysClean, onComplete, onExit, lang }) => {
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState(5);
  const [cravings, setCravings] = useState(5);
  const [selectedSymptomKeys, setSelectedSymptomKeys] = useState<string[]>([]);
  const [symptomDetails, setSymptomDetails] = useState<SymptomRecord[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [notes, setNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'Physical' | 'Emotional' | 'Mental'>('Physical');
  const [resultAdvice, setResultAdvice] = useState<any>(null);

  const toggleSymptomSelection = (key: string, category: 'Physical' | 'Emotional' | 'Mental' | 'Other') => {
    if (selectedSymptomKeys.includes(key)) {
      setSelectedSymptomKeys(prev => prev.filter(k => k !== key));
      setSymptomDetails(prev => prev.filter(s => s.id !== key));
    } else {
      setSelectedSymptomKeys(prev => [...prev, key]);
      setSymptomDetails(prev => [...prev, {
        id: key,
        name: key.startsWith('custom_') ? key.replace('custom_', '') : t(`sym_${key}`, lang),
        category: category,
        severity: 5
      }]);
    }
  };

  const addCustomSymptom = () => {
    if (customSymptom.trim()) {
      const key = `custom_${customSymptom.trim()}`;
      toggleSymptomSelection(key, 'Other');
      setCustomSymptom('');
    }
  };

  const updateSeverity = (id: string, severity: number) => {
    setSymptomDetails(prev => prev.map(s => s.id === id ? { ...s, severity } : s));
  };

  const handleSubmit = async () => {
    setIsGenerating(true);
    const symptomsString = symptomDetails.map(s => `${s.name} (${s.severity}/10)`).join(", ");
    
    try {
      const advice = await generateRecoveryAdvice(userAddiction, daysClean, symptomsString, notes);
      setResultAdvice(advice);
      // Save data via parent but don't close view yet
      onComplete(mood, cravings, symptomDetails, notes, advice);
      setStep(4); // Move to summary screen
    } catch (e) {
      console.error(e);
      const fallback = { 
        practicalTips: ["Stay hydrated", "Rest well", "Call a friend"], 
        encouragement: "Stay strong!" 
      };
      setResultAdvice(fallback);
      onComplete(mood, cravings, symptomDetails, notes, fallback);
      setStep(4);
    } finally {
      setIsGenerating(false);
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Physical': return <Activity size={18} />;
      case 'Emotional': return <Heart size={18} />;
      case 'Mental': return <Brain size={18} />;
      default: return <Info size={18} />;
    }
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] px-6 text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
          <Loader2 className="w-16 h-16 text-emerald-400 animate-spin relative z-10" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">{t('analyzing', lang)}</h2>
        <p className="text-slate-400">{t('aiPrompt', lang)}</p>
      </div>
    );
  }

  // Step 4: Summary / Result Screen
  if (step === 4 && resultAdvice) {
    return (
        <div className="p-6 max-w-md mx-auto pb-24 animate-in slide-in-from-bottom-5 fade-in duration-500">
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                    <CheckCircle2 className="text-white w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-white">{t('checkin_complete', lang)}</h2>
                <p className="text-slate-400 mt-2">{t('here_is_advice', lang)}</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-amber-500 mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="text-amber-400" size={20} />
                    <h3 className="font-bold text-white text-lg">Daily Insight</h3>
                </div>
                <p className="text-slate-200 text-lg italic leading-relaxed mb-6">"{resultAdvice.encouragement}"</p>
                
                <div className="space-y-3">
                    {resultAdvice.practicalTips.map((tip: string, i: number) => (
                        <div key={i} className="flex gap-3 items-start bg-slate-800/50 p-4 rounded-xl">
                            <div className="bg-emerald-900/40 p-1.5 rounded-full mt-0.5 text-emerald-400 font-bold text-xs w-6 h-6 flex items-center justify-center shrink-0">
                                {i + 1}
                            </div>
                            <p className="text-slate-300">{tip}</p>
                        </div>
                    ))}
                </div>
            </div>

            <button 
                onClick={onExit}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-700"
            >
                <Home size={20} /> {t('go_home', lang)}
            </button>
        </div>
    );
  }

  // Original Steps 1-3
  return (
    <div className="p-6 max-w-md mx-auto pb-24">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">{t('dailyCheckIn', lang)}</h2>
        <span className="text-slate-500 text-sm">{t('step', lang)} {step}/3</span>
      </div>

      {step === 1 && (
        <div className="space-y-8 animate-float" style={{ animationDuration: '0s' }}>
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
            <label className="block text-slate-300 mb-4 font-bold flex items-center gap-2">
                <span className="text-2xl">😊</span> {t('howFeeling', lang)}
            </label>
            <input type="range" min="1" max="10" value={mood} onChange={(e) => setMood(parseInt(e.target.value))} className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
            <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium"><span>Awful</span><span className="text-emerald-400">{mood}/10</span><span>Great</span></div>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
            <label className="block text-slate-300 mb-4 font-bold flex items-center gap-2">
                <span className="text-2xl">🔥</span> {t('cravingsIntensity', lang)}
            </label>
            <input type="range" min="1" max="10" value={cravings} onChange={(e) => setCravings(parseInt(e.target.value))} className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500" />
            <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium"><span>None</span><span className="text-rose-400">{cravings}/10</span><span>Extreme</span></div>
          </div>

          <button onClick={() => setStep(2)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-900/50 transition-all active:scale-95">{t('next', lang)}</button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6" style={{ animationDuration: '0s' }}>
          <p className="text-slate-400 text-sm mb-4">{t('strugglingWith', lang)}</p>
          <div className="flex p-1 bg-slate-800 rounded-xl mb-4">
            {(['Physical', 'Emotional', 'Mental'] as const).map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${activeCategory === cat ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}>
                    {getCategoryIcon(cat)} {t(`cat_${cat}`, lang)}
                </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 h-[300px] overflow-y-auto content-start pr-1">
            {SYMPTOM_CATEGORIES[activeCategory].map((symKey: string) => {
              const isSelected = selectedSymptomKeys.includes(symKey);
              return (
                <button key={symKey} onClick={() => toggleSymptomSelection(symKey, activeCategory)} className={`relative p-3 rounded-xl text-left transition-all border ${isSelected ? 'bg-emerald-600/20 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-slate-800 border-slate-700 hover:bg-slate-750'}`}>
                  <div className="flex items-start justify-between mb-1">
                      <span className={`text-sm font-bold ${isSelected ? 'text-emerald-400' : 'text-slate-200'}`}>{t(`sym_${symKey}`, lang)}</span>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
                  </div>
                </button>
              );
            })}
            <div className="col-span-2 mt-2 bg-slate-800 p-3 rounded-xl border border-slate-700 border-dashed flex gap-2">
                <input type="text" placeholder={t('add_custom', lang)} className="bg-transparent flex-1 text-sm text-white focus:outline-none" value={customSymptom} onChange={(e) => setCustomSymptom(e.target.value)} />
                <button onClick={addCustomSymptom} className="bg-emerald-600 p-1 rounded-lg text-white"><Plus size={16} /></button>
            </div>
          </div>
          <div className="flex gap-4 pt-4 border-t border-slate-800">
            <button onClick={() => setStep(1)} className="w-1/3 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all">{t('back', lang)}</button>
            <button onClick={() => setStep(3)} className="w-2/3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-900/50 transition-all active:scale-95">{t('next', lang)}</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-2">
             <p className="text-slate-300 font-bold">{t('rate_symptoms', lang)}</p>
             <span className="text-xs text-slate-500">{symptomDetails.length} selected</span>
          </div>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 pb-20">
             {symptomDetails.map((sym) => (
                <div key={sym.id} className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                             <span className="font-bold text-white">{sym.name}</span>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${sym.severity < 4 ? 'bg-emerald-500/20 text-emerald-400' : sym.severity < 7 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                            {sym.severity < 4 ? t('mild', lang) : sym.severity < 7 ? t('moderate', lang) : t('severe', lang)}
                        </span>
                    </div>
                    <input type="range" min="1" max="10" value={sym.severity} onChange={(e) => updateSeverity(sym.id, parseInt(e.target.value))} className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${sym.severity < 4 ? 'bg-slate-700 accent-emerald-500' : sym.severity < 7 ? 'bg-slate-700 accent-yellow-500' : 'bg-slate-700 accent-red-500'}`} />
                </div>
             ))}
             {symptomDetails.length === 0 && <div className="text-center p-8 bg-slate-800/30 rounded-xl border border-slate-700 border-dashed"><p className="text-slate-500 text-sm">No specific symptoms selected.</p></div>}
             <div className="mt-6">
                <label className="block text-slate-300 mb-2 font-medium text-sm">{t('notes', lang)}</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t('notesPlaceholder', lang)} className="w-full h-24 bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 text-sm"></textarea>
             </div>
          </div>
          <div className="fixed bottom-24 left-0 right-0 px-6 max-w-md mx-auto">
            <div className="flex gap-4 bg-slate-900 pt-4">
                <button onClick={() => setStep(2)} className="w-1/3 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all">{t('back', lang)}</button>
                <button onClick={handleSubmit} className="w-2/3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-900/50 transition-all active:scale-95 flex items-center justify-center gap-2"><Sparkles size={20} /> {t('finish', lang)}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckIn;