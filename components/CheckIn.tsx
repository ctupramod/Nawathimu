import React, { useState } from 'react';
import { Loader2, Sparkles, Info, Plus, Activity, Heart, Brain, Home, CheckCircle2, Share2 } from 'lucide-react';
import { SYMPTOM_CATEGORIES, Language, SymptomRecord } from '../types';
import { generateRecoveryAdvice } from '../services/geminiService';
import { t } from '../utils/translations';
import ShareModal from './ShareModal';

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
  const [showShareModal, setShowShareModal] = useState(false);

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
      onComplete(mood, cravings, symptomDetails, notes, advice);
      setStep(4);
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
      <div className="flex flex-col items-center justify-center h-[80vh] px-6 text-center md:ml-64">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
          <Loader2 className="w-16 h-16 text-emerald-400 animate-spin relative z-10" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">{t('analyzing', lang)}</h2>
        <p className="text-slate-400 text-lg max-w-lg mx-auto">{t('aiPrompt', lang)}</p>
      </div>
    );
  }

  // Step 4: Summary / Result Screen
  if (step === 4 && resultAdvice) {
    return (
        <div className="p-6 md:p-12 md:ml-64 max-w-5xl mx-auto pb-24 animate-in slide-in-from-bottom-5 fade-in duration-500">
            {showShareModal && (
                <ShareModal 
                    daysClean={daysClean} 
                    addiction={userAddiction} 
                    streak={daysClean} // Assuming streak ~ daysClean for simple logic, passed prop logic handles exact streak in App
                    onClose={() => setShowShareModal(false)} 
                />
            )}
            
            <div className="text-center mb-10">
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                    <CheckCircle2 className="text-white w-10 h-10" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">{t('checkin_complete', lang)}</h2>
                <p className="text-slate-400 mt-3 text-lg">{t('here_is_advice', lang)}</p>
            </div>

            <div className="glass-panel p-8 rounded-3xl border-l-4 border-l-amber-500 mb-8 max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="text-amber-400" size={24} />
                    <h3 className="font-bold text-white text-xl">Daily Insight</h3>
                </div>
                <p className="text-slate-200 text-xl italic leading-relaxed mb-8 font-serif">"{resultAdvice.encouragement}"</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {resultAdvice.practicalTips.map((tip: string, i: number) => (
                        <div key={i} className="flex flex-col gap-3 bg-slate-800/50 p-5 rounded-2xl hover:bg-slate-800/80 transition-colors border border-slate-700">
                            <div className="bg-emerald-900/40 p-2 rounded-full w-8 h-8 flex items-center justify-center shrink-0 self-start">
                                <span className="text-emerald-400 font-bold text-sm">{i + 1}</span>
                            </div>
                            <p className="text-slate-300 font-medium">{tip}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <button 
                    onClick={() => setShowShareModal(true)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/40"
                >
                    <Share2 size={20} /> Share Progress
                </button>
                <button 
                    onClick={onExit}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-700"
                >
                    <Home size={20} /> {t('go_home', lang)}
                </button>
            </div>
        </div>
    );
  }

  // Original Steps 1-3
  return (
    <div className="p-6 md:p-12 md:ml-64 max-w-7xl mx-auto pb-24 min-h-screen flex flex-col">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">{t('dailyCheckIn', lang)}</h2>
        <span className="text-slate-400 font-medium bg-slate-800 px-4 py-1 rounded-full">{t('step', lang)} {step}/3</span>
      </div>

      {step === 1 && (
        <div className="space-y-8 animate-in fade-in max-w-4xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 flex flex-col justify-between h-full hover:border-emerald-500/50 transition-colors">
                <div>
                    <label className="block text-slate-200 mb-6 font-bold text-xl flex items-center gap-3">
                        <span className="text-3xl">😊</span> {t('howFeeling', lang)}
                    </label>
                    <div className="flex justify-between text-sm text-slate-500 mb-2 font-bold px-1">
                        <span>Awful</span><span>Great</span>
                    </div>
                    <input type="range" min="1" max="10" value={mood} onChange={(e) => setMood(parseInt(e.target.value))} className="w-full h-4 bg-slate-700 rounded-full appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-all" />
                </div>
                <div className="mt-6 text-center">
                    <span className="text-4xl font-bold text-emerald-400">{mood}</span>
                    <span className="text-slate-500">/10</span>
                </div>
            </div>

            <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 flex flex-col justify-between h-full hover:border-rose-500/50 transition-colors">
                <div>
                    <label className="block text-slate-200 mb-6 font-bold text-xl flex items-center gap-3">
                        <span className="text-3xl">🔥</span> {t('cravingsIntensity', lang)}
                    </label>
                    <div className="flex justify-between text-sm text-slate-500 mb-2 font-bold px-1">
                        <span>None</span><span>Extreme</span>
                    </div>
                    <input type="range" min="1" max="10" value={cravings} onChange={(e) => setCravings(parseInt(e.target.value))} className="w-full h-4 bg-slate-700 rounded-full appearance-none cursor-pointer accent-rose-500 hover:accent-rose-400 transition-all" />
                </div>
                <div className="mt-6 text-center">
                    <span className="text-4xl font-bold text-rose-400">{cravings}</span>
                    <span className="text-slate-500">/10</span>
                </div>
            </div>
          </div>

          <button onClick={() => setStep(2)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-5 rounded-2xl shadow-lg shadow-emerald-900/50 transition-all active:scale-95 text-lg">{t('next', lang)}</button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col h-full animate-in fade-in">
          <p className="text-slate-400 text-lg mb-6">{t('strugglingWith', lang)}</p>
          
          <div className="flex flex-col md:flex-row gap-8 flex-1">
            {/* Sidebar Categories (Desktop) / Tabs (Mobile) */}
            <div className="md:w-64 shrink-0 flex md:flex-col gap-2 bg-slate-800/30 p-2 rounded-2xl h-fit md:sticky md:top-4">
                {(['Physical', 'Emotional', 'Mental'] as const).map(cat => (
                    <button 
                        key={cat} 
                        onClick={() => setActiveCategory(cat)} 
                        className={`flex-1 md:flex-none py-4 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center md:justify-start gap-3 ${activeCategory === cat ? 'bg-slate-700 text-white shadow-lg border border-slate-600' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}
                    >
                        {getCategoryIcon(cat)} 
                        <span>{t(`cat_${cat}`, lang)}</span>
                    </button>
                ))}
            </div>

            {/* Symptoms Grid */}
            <div className="flex-1 flex flex-col gap-6">
                {/* On Desktop: No fixed height scroll, utilize full width. On Mobile: Can keep scrolling if needed but usually better to let page scroll */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {SYMPTOM_CATEGORIES[activeCategory].map((symKey: string) => {
                    const isSelected = selectedSymptomKeys.includes(symKey);
                    return (
                        <button 
                            key={symKey} 
                            onClick={() => toggleSymptomSelection(symKey, activeCategory)} 
                            className={`relative p-5 rounded-2xl text-left transition-all border group h-full flex flex-col justify-between ${isSelected ? 'bg-emerald-600/20 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-slate-500'}`}
                        >
                            <div>
                                <div className="flex items-start justify-between mb-2">
                                    <span className={`text-base font-bold ${isSelected ? 'text-emerald-400' : 'text-slate-200'}`}>{t(`sym_${symKey}`, lang)}</span>
                                    {isSelected && <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />}
                                </div>
                                <p className={`text-xs leading-relaxed ${isSelected ? 'text-emerald-200/70' : 'text-slate-500'} group-hover:text-slate-400`}>
                                    {t(`sym_${symKey}_desc`, lang)}
                                </p>
                            </div>
                        </button>
                    );
                    })}
                </div>
                
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 border-dashed flex gap-3 items-center mt-2">
                    <Plus size={20} className="text-slate-500" />
                    <input type="text" placeholder={t('add_custom', lang)} className="bg-transparent flex-1 text-sm text-white focus:outline-none placeholder:text-slate-600" value={customSymptom} onChange={(e) => setCustomSymptom(e.target.value)} />
                    <button onClick={addCustomSymptom} className="bg-emerald-600 px-4 py-2 rounded-lg text-white text-xs font-bold hover:bg-emerald-500">Add</button>
                </div>

                 <div className="flex gap-4 pt-6 mt-auto">
                    <button onClick={() => setStep(1)} className="w-1/3 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all border border-slate-700">{t('back', lang)}</button>
                    <button onClick={() => setStep(3)} className="w-2/3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-900/50 transition-all active:scale-95">{t('next', lang)}</button>
                </div>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 max-w-5xl mx-auto w-full animate-in fade-in">
          <div className="flex justify-between items-center mb-2">
             <p className="text-slate-300 font-bold text-xl">{t('rate_symptoms', lang)}</p>
             <span className="text-sm text-slate-500 bg-slate-800 px-3 py-1 rounded-full">{symptomDetails.length} selected</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
             {symptomDetails.map((sym) => (
                <div key={sym.id} className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700">
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-white text-lg">{sym.name}</span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${sym.severity < 4 ? 'bg-emerald-500/20 text-emerald-400' : sym.severity < 7 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                            {sym.severity < 4 ? t('mild', lang) : sym.severity < 7 ? t('moderate', lang) : t('severe', lang)}
                        </span>
                    </div>
                    <input type="range" min="1" max="10" value={sym.severity} onChange={(e) => updateSeverity(sym.id, parseInt(e.target.value))} className={`w-full h-3 rounded-lg appearance-none cursor-pointer ${sym.severity < 4 ? 'bg-slate-700 accent-emerald-500' : sym.severity < 7 ? 'bg-slate-700 accent-yellow-500' : 'bg-slate-700 accent-red-500'}`} />
                    <div className="flex justify-between mt-2 text-xs text-slate-500 font-bold">
                        <span>1</span><span>10</span>
                    </div>
                </div>
             ))}
             {symptomDetails.length === 0 && (
                <div className="col-span-full text-center py-10 border border-dashed border-slate-700 rounded-2xl">
                    <p className="text-slate-500">No symptoms selected. You can proceed if you're feeling good!</p>
                </div>
             )}
          </div>

          <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700">
            <label className="block text-slate-300 mb-3 font-medium text-lg">{t('notes', lang)}</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t('notesPlaceholder', lang)} className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-emerald-500 text-base resize-none"></textarea>
          </div>

          <div className="flex gap-4 pt-4">
             <button onClick={() => setStep(2)} className="w-1/3 bg-slate-800 hover:bg-slate-700 text-white font-bold py-5 rounded-2xl transition-all border border-slate-700">{t('back', lang)}</button>
             <button onClick={handleSubmit} className="w-2/3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold py-5 rounded-2xl shadow-lg shadow-emerald-900/50 transition-all active:scale-95 flex items-center justify-center gap-2"><Sparkles size={20} /> {t('finish', lang)}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckIn;