import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, AlertTriangle } from 'lucide-react';
import { User, SRI_LANKA_CITIES, Language } from '../types';
import { t } from '../utils/translations';
import { StorageService } from '../services/storage';

interface AuthProps {
  onLogin: (user: User) => void;
  lang: Language;
  setLang: (l: Language) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, lang, setLang }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    addiction: '',
    quitDate: '',
    city: SRI_LANKA_CITIES[0],
    ageRange: '18-24'
  });
  const [showEmailWarning, setShowEmailWarning] = useState(false);

  const handleRegister = () => {
    if (!formData.email && !showEmailWarning) {
        setShowEmailWarning(true);
        return;
    }

    const newUser: User = {
      username: formData.username,
      name: formData.name || formData.username,
      addiction: formData.addiction,
      quitDate: formData.quitDate,
      coins: 0,
      level: 1,
      city: formData.city,
      ageRange: formData.ageRange,
      email: formData.email
    };

    const success = StorageService.registerUser(newUser, formData.password);
    if (success) {
      onLogin(newUser);
    } else {
      alert("Username already exists");
    }
  };

  const handleLogin = () => {
    const user = StorageService.loginUser(formData.username, formData.password);
    if (user) {
      onLogin(user);
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black">
      <div className="absolute top-4 right-4 flex gap-2">
        {(['en', 'si', 'ta'] as Language[]).map(l => (
            <button 
                key={l}
                onClick={() => setLang(l)}
                className={`w-8 h-8 rounded-full font-bold text-xs ${lang === l ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'}`}
            >
                {l.toUpperCase()}
            </button>
        ))}
      </div>

      <div className="w-full max-w-md space-y-8 animate-float">
        <div className="text-center">
          <div className="bg-emerald-500/20 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-6 ring-4 ring-emerald-500/10">
            <ShieldCheck size={40} className="text-emerald-400" />
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-200">
            Rise & Recover
          </h1>
          <p className="text-slate-400 mt-2">{t('welcome', lang)}</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-4 shadow-2xl">
          {/* Common Fields */}
          <div>
            <label className="text-sm font-medium text-slate-300 ml-1">{t('username', lang)} <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full mt-1 bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300 ml-1">{t('password', lang)} <span className="text-red-400">*</span></label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full mt-1 bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>

          {!isLogin && (
            <>
               {/* Registration Fields */}
               <div>
                <label className="text-sm font-medium text-slate-300 ml-1">Name</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full mt-1 bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white"
                />
               </div>
               <div>
                <label className="text-sm font-medium text-slate-300 ml-1">Email / Phone</label>
                <input
                    type="text"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full mt-1 bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white"
                />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-sm font-medium text-slate-300 ml-1">{t('city', lang)}</label>
                    <select
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="w-full mt-1 bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white"
                    >
                        {SRI_LANKA_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="text-sm font-medium text-slate-300 ml-1">{t('age', lang)}</label>
                    <select
                        value={formData.ageRange}
                        onChange={(e) => setFormData({...formData, ageRange: e.target.value})}
                        className="w-full mt-1 bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white"
                    >
                        <option value="Under 18">Under 18</option>
                        <option value="18-24">18-24</option>
                        <option value="25-34">25-34</option>
                        <option value="35-44">35-44</option>
                        <option value="45-54">45-54</option>
                        <option value="55+">55+</option>
                    </select>
                 </div>
               </div>
               <div>
                <label className="text-sm font-medium text-slate-300 ml-1">Addiction</label>
                <select
                    value={formData.addiction}
                    onChange={(e) => setFormData({...formData, addiction: e.target.value})}
                    className="w-full mt-1 bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white"
                >
                    <option value="">Select...</option>
                    <option value="Alcohol">Alcohol</option>
                    <option value="Methamphetamine">Methamphetamine</option>
                    <option value="Opioids">Heroin/Opioids</option>
                    <option value="Cannabis">Cannabis</option>
                    <option value="Nicotine">Nicotine</option>
                </select>
               </div>
               <div>
                 <label className="text-sm font-medium text-slate-300 ml-1">Quit Date</label>
                 <input
                    type="date"
                    value={formData.quitDate}
                    onChange={(e) => setFormData({...formData, quitDate: e.target.value})}
                    className="w-full mt-1 bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white"
                 />
               </div>
            </>
          )}

          {showEmailWarning && !isLogin && (
            <div className="bg-amber-900/40 p-3 rounded-lg border border-amber-600/50 flex gap-2 items-start">
                <AlertTriangle className="text-amber-500 shrink-0" size={18} />
                <div className="text-xs text-amber-100">
                    <p className="font-bold mb-1">Warning</p>
                    <p>{t('contactWarning', lang)}</p>
                    <button 
                        onClick={() => { setShowEmailWarning(false); handleRegister(); }}
                        className="mt-2 text-amber-400 underline"
                    >
                        {t('skipEmail', lang)}
                    </button>
                </div>
            </div>
          )}
          
          <button
            onClick={isLogin ? handleLogin : handleRegister}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl mt-4 shadow-lg shadow-emerald-900/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {isLogin ? t('login', lang) : t('startJourney', lang)} <ArrowRight size={20} />
          </button>

          <p className="text-center text-slate-400 text-sm mt-4">
            {isLogin ? t('noAccount', lang) : t('haveAccount', lang)}{" "}
            <button onClick={() => {setIsLogin(!isLogin); setShowEmailWarning(false);}} className="text-emerald-400 hover:underline">
               {isLogin ? t('register', lang) : t('login', lang)}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;