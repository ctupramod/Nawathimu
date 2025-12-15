import React, { useState } from 'react';
import { User, Language, AdminConfig } from '../types';
import { t } from '../utils/translations';
import { LogOut, Globe, Phone, Shield, User as UserIcon, MapPin, Calendar, Edit2, Save } from 'lucide-react';
import { StorageService } from '../services/storage';

interface ProfileProps {
  user: User;
  lang: Language;
  setLang: (lang: Language) => void;
  onLogout: () => void;
  onUpdateUser: (u: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, lang, setLang, onLogout, onUpdateUser }) => {
  const config = StorageService.getConfig();
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [newQuitDate, setNewQuitDate] = useState(user.quitDate.split('T')[0]);

  const handleUpdateDate = () => {
    const updatedUser = { ...user, quitDate: new Date(newQuitDate).toISOString() };
    
    // Save to storage
    const users = StorageService.getUsers();
    const index = users.findIndex(u => u.username === user.username);
    if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem('rr_users', JSON.stringify(users));
        onUpdateUser(updatedUser);
        setIsEditingDate(false);
    }
  };

  return (
    <div className="p-6 pb-24 max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white mb-2">{t('profile', lang)}</h1>

      {/* User Card */}
      <div className="glass-panel p-6 rounded-3xl gap-4 bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center border-4 border-slate-800 shadow-xl">
            <span className="text-2xl font-bold text-white">{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
            <h2 className="text-xl font-bold text-white">{user.name}</h2>
            <p className="text-emerald-400 text-sm flex items-center gap-1">
                <Shield size={12} /> {user.addiction} Free
            </p>
            <p className="text-slate-500 text-xs flex items-center gap-1 mt-1">
                <MapPin size={10} /> {user.city}
            </p>
            </div>
        </div>

        {/* Date Edit Section */}
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
            <div className="flex justify-between items-center">
                <p className="text-xs text-slate-400 mb-1 flex items-center gap-1"><Calendar size={12}/> Clean Since</p>
                {!isEditingDate && (
                    <button onClick={() => setIsEditingDate(true)} className="text-emerald-400 p-1">
                        <Edit2 size={14} />
                    </button>
                )}
            </div>
            
            {isEditingDate ? (
                <div className="flex gap-2 items-center mt-1">
                    <input 
                        type="date" 
                        value={newQuitDate}
                        onChange={(e) => setNewQuitDate(e.target.value)}
                        className="bg-slate-800 text-white text-sm rounded px-2 py-1 flex-1"
                    />
                    <button onClick={handleUpdateDate} className="bg-emerald-600 text-white p-1.5 rounded-lg">
                        <Save size={14} />
                    </button>
                </div>
            ) : (
                <p className="font-bold text-white">{new Date(user.quitDate).toLocaleDateString()}</p>
            )}
        </div>
      </div>

      {/* Language Settings */}
      <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700">
        <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
           <Globe size={16} className="text-blue-400" /> {t('language', lang)}
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {(['en', 'si', 'ta'] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                lang === l 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' 
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {l === 'en' ? 'English' : l === 'si' ? 'සිංහල' : 'தமிழ்'}
            </button>
          ))}
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700">
        <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
           <Phone size={16} className="text-rose-400" /> {t('emergency', lang)}
        </h3>
        <div className="space-y-3">
          {config.emergencyContacts.map((contact, idx) => (
            <div key={idx} className="flex justify-between items-center bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <span className="text-sm text-slate-200">{contact.name}</span>
              <a href={`tel:${contact.number}`} className="bg-rose-900/30 text-rose-400 text-xs px-3 py-1.5 rounded-full font-bold hover:bg-rose-900/50 transition-colors">
                {contact.number}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="w-full bg-slate-800 hover:bg-red-900/20 hover:text-red-400 text-slate-400 font-medium py-4 rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-700 hover:border-red-900/50"
      >
        <LogOut size={18} /> {t('logout', lang)}
      </button>

      <div className="text-center text-xs text-slate-600 mt-4">
        Rise & Recover v1.1.0
      </div>
    </div>
  );
};

export default Profile;