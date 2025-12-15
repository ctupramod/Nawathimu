import React, { useState } from 'react';
import { User, Language, AdminConfig, SRI_LANKA_CITIES } from '../types';
import { t } from '../utils/translations';
import { LogOut, Globe, Phone, Shield, User as UserIcon, MapPin, Calendar, Edit2, Save, X, Mail } from 'lucide-react';
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
  const [isEditing, setIsEditing] = useState(false);
  
  // Initialize form state
  const [formData, setFormData] = useState({
    name: user.name,
    addiction: user.addiction,
    city: user.city,
    ageRange: user.ageRange,
    email: user.email || '',
    phone: user.phone || '',
    quitDate: user.quitDate.split('T')[0]
  });

  const handleSave = () => {
    const updatedUser: User = {
        ...user,
        name: formData.name,
        addiction: formData.addiction,
        city: formData.city,
        ageRange: formData.ageRange,
        email: formData.email,
        phone: formData.phone,
        quitDate: new Date(formData.quitDate).toISOString()
    };
    
    // Save to storage
    const users = StorageService.getUsers();
    const index = users.findIndex(u => u.username === user.username);
    if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem('rr_users', JSON.stringify(users));
        onUpdateUser(updatedUser);
        setIsEditing(false);
    }
  };

  const handleCancel = () => {
    // Reset form to current user data
    setFormData({
        name: user.name,
        addiction: user.addiction,
        city: user.city,
        ageRange: user.ageRange,
        email: user.email || '',
        phone: user.phone || '',
        quitDate: user.quitDate.split('T')[0]
    });
    setIsEditing(false);
  };

  return (
    <div className="p-6 pb-24 max-w-md mx-auto space-y-6">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-white">{t('profile', lang)}</h1>
         {!isEditing && (
             <button onClick={() => setIsEditing(true)} className="bg-slate-800 p-2 rounded-lg text-emerald-400 border border-slate-700 hover:bg-slate-700">
                 <Edit2 size={18} />
             </button>
         )}
      </div>

      {/* User Card / Edit Form */}
      <div className="glass-panel p-6 rounded-3xl gap-4 bg-gradient-to-br from-slate-800 to-slate-900 relative">
        {isEditing ? (
            <div className="space-y-4 animate-in fade-in">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-white">Edit Profile</h3>
                    <button onClick={handleCancel} className="text-slate-400 hover:text-white"><X size={20}/></button>
                </div>
                
                {/* Name */}
                <div>
                    <label className="text-xs text-slate-400 ml-1">Name</label>
                    <input 
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm"
                    />
                </div>

                {/* Addiction */}
                <div>
                    <label className="text-xs text-slate-400 ml-1">Addiction</label>
                    <select
                        value={formData.addiction}
                        onChange={e => setFormData({...formData, addiction: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm"
                    >
                        <option value="Alcohol">Alcohol</option>
                        <option value="Methamphetamine">Methamphetamine</option>
                        <option value="Opioids">Heroin/Opioids</option>
                        <option value="Cannabis">Cannabis</option>
                        <option value="Nicotine">Nicotine</option>
                    </select>
                </div>

                 {/* Quit Date */}
                <div>
                    <label className="text-xs text-slate-400 ml-1">Clean Since</label>
                    <input 
                        type="date" 
                        value={formData.quitDate}
                        onChange={e => setFormData({...formData, quitDate: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm"
                    />
                </div>

                 {/* Age & City */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs text-slate-400 ml-1">Age Range</label>
                        <select
                            value={formData.ageRange}
                            onChange={e => setFormData({...formData, ageRange: e.target.value})}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm"
                        >
                            <option value="Under 18">Under 18</option>
                            <option value="18-24">18-24</option>
                            <option value="25-34">25-34</option>
                            <option value="35-44">35-44</option>
                            <option value="45-54">45-54</option>
                            <option value="55+">55+</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 ml-1">City</label>
                        <select
                            value={formData.city}
                            onChange={e => setFormData({...formData, city: e.target.value})}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm"
                        >
                            {SRI_LANKA_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                {/* Contact Info */}
                <div>
                    <label className="text-xs text-slate-400 ml-1">Email</label>
                    <input 
                        type="email" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm"
                        placeholder="Optional"
                    />
                </div>
                 <div>
                    <label className="text-xs text-slate-400 ml-1">Phone</label>
                    <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm"
                        placeholder="Optional"
                    />
                </div>

                <button onClick={handleSave} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 mt-4">
                    <Save size={18} /> Save Changes
                </button>
            </div>
        ) : (
            <>
                {/* View Mode */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-full bg-emerald-600 flex items-center justify-center border-4 border-slate-800 shadow-xl shrink-0">
                        <span className="text-3xl font-bold text-white">{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">{user.name}</h2>
                        <div className="flex flex-col gap-1 mt-1">
                            <p className="text-emerald-400 text-sm flex items-center gap-1 font-medium">
                                <Shield size={12} /> {user.addiction} Free
                            </p>
                            <p className="text-slate-400 text-xs flex items-center gap-1">
                                <MapPin size={10} /> {user.city}
                            </p>
                            <p className="text-slate-500 text-xs flex items-center gap-1">
                                <UserIcon size={10} /> {user.ageRange}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 space-y-3">
                     <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                        <p className="text-xs text-slate-400 flex items-center gap-2"><Calendar size={14}/> Clean Since</p>
                        <p className="font-bold text-white text-sm">{new Date(user.quitDate).toLocaleDateString()}</p>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                        <p className="text-xs text-slate-400 flex items-center gap-2"><Mail size={14}/> Email</p>
                        <p className="font-bold text-white text-sm">{user.email || 'Not set'}</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-xs text-slate-400 flex items-center gap-2"><Phone size={14}/> Phone</p>
                        <p className="font-bold text-white text-sm">{user.phone || 'Not set'}</p>
                    </div>
                </div>
            </>
        )}
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

      <div className="text-center text-xs text-slate-600 mt-4 flex flex-col gap-1 items-center justify-center">
        <span className="text-red-500 font-bold font-['Noto_Sans_Sinhala']">මුට්ටිය.කොම්</span>
        <span>© 2024 Muttiya.com</span>
      </div>
    </div>
  );
};

export default Profile;