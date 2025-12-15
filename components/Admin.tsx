import React, { useState, useEffect } from 'react';
import { User, AdminConfig, SRI_LANKA_CITIES } from '../types';
import { StorageService } from '../services/storage';
import { Save, Plus, Trash, Users, BookOpen, AlertTriangle, Map } from 'lucide-react';

const Admin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [config, setConfig] = useState<AdminConfig>({ emergencyContacts: [], herbalRemedies: [] });
  const [activeTab, setActiveTab] = useState<'users' | 'resources' | 'reports'>('users');

  useEffect(() => {
    setUsers(StorageService.getUsers());
    setConfig(StorageService.getConfig());
  }, []);

  const handleSaveConfig = () => {
    StorageService.saveConfig(config);
    alert("Configuration Saved!");
  };

  const addContact = () => {
    setConfig({
      ...config,
      emergencyContacts: [...config.emergencyContacts, { name: 'New Contact', number: '000' }]
    });
  };

  const addRemedy = () => {
    setConfig({
      ...config,
      herbalRemedies: [...config.herbalRemedies, { name: 'New Herb', description: 'Description' }]
    });
  };

  const deleteItem = (type: 'contact' | 'remedy', index: number) => {
    if (type === 'contact') {
      const newContacts = [...config.emergencyContacts];
      newContacts.splice(index, 1);
      setConfig({ ...config, emergencyContacts: newContacts });
    } else {
      const newRemedies = [...config.herbalRemedies];
      newRemedies.splice(index, 1);
      setConfig({ ...config, herbalRemedies: newRemedies });
    }
  };

  // Generate City Report
  const cityStats = SRI_LANKA_CITIES.map(city => {
    const cityUsers = users.filter(u => u.city === city);
    const count = cityUsers.length;
    // Count common addictions in this city
    const addictions: {[key: string]: number} = {};
    cityUsers.forEach(u => {
        addictions[u.addiction] = (addictions[u.addiction] || 0) + 1;
    });
    const topAddiction = Object.entries(addictions).sort((a,b) => b[1] - a[1])[0]?.[0] || 'None';
    
    return { city, count, topAddiction };
  }).filter(stat => stat.count > 0).sort((a,b) => b.count - a.count);

  return (
    <div className="p-6 pb-24 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Admin Dashboard</h1>

      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        <button onClick={() => setActiveTab('users')} className={`px-4 py-3 rounded-lg flex items-center gap-2 font-bold whitespace-nowrap ${activeTab === 'users' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
          <Users size={18} /> Users
        </button>
        <button onClick={() => setActiveTab('reports')} className={`px-4 py-3 rounded-lg flex items-center gap-2 font-bold whitespace-nowrap ${activeTab === 'reports' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
          <Map size={18} /> Regional Reports
        </button>
        <button onClick={() => setActiveTab('resources')} className={`px-4 py-3 rounded-lg flex items-center gap-2 font-bold whitespace-nowrap ${activeTab === 'resources' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
          <BookOpen size={18} /> Resources
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="space-y-4">
          {users.map((u, i) => (
            <div key={i} className="bg-slate-800 p-4 rounded-xl flex justify-between items-center">
              <div>
                <p className="font-bold text-white">{u.username} <span className="text-slate-500 text-xs">({u.city})</span></p>
                <p className="text-xs text-emerald-400">Fighting: {u.addiction} | Lvl {u.level}</p>
              </div>
              <div className="text-right text-xs text-slate-500">
                <p>Joined: {new Date(u.quitDate).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-6">
            <h2 className="text-lg font-bold text-white mb-4">High Priority Areas</h2>
            <div className="space-y-4">
                {cityStats.length === 0 && <p className="text-slate-500">No user data available yet.</p>}
                {cityStats.map((stat, i) => (
                    <div key={i} className="bg-slate-800 p-5 rounded-xl border-l-4 border-emerald-500">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white">{stat.city}</h3>
                            <span className="bg-emerald-900/50 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">
                                {stat.count} Users
                            </span>
                        </div>
                        <div className="mt-2 text-sm text-slate-400">
                            Primary Issue: <span className="text-rose-400 font-bold">{stat.topAddiction}</span>
                        </div>
                        <div className="w-full bg-slate-700 h-1.5 mt-3 rounded-full overflow-hidden">
                           <div className="bg-emerald-500 h-full" style={{ width: `${Math.min(100, stat.count * 10)}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="space-y-8">
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-rose-400 flex items-center gap-2"><AlertTriangle size={18} /> Emergency Contacts</h3>
                <button onClick={addContact} className="text-emerald-400 hover:bg-slate-700 p-1 rounded"><Plus size={20} /></button>
             </div>
             <div className="space-y-3">
                {config.emergencyContacts.map((c, i) => (
                    <div key={i} className="flex gap-2 items-center">
                        <input value={c.name} onChange={(e) => {const arr = [...config.emergencyContacts]; arr[i].name = e.target.value; setConfig({...config, emergencyContacts: arr});}} className="bg-slate-900 p-2 rounded text-sm text-white flex-1 border border-slate-700" />
                        <input value={c.number} onChange={(e) => {const arr = [...config.emergencyContacts]; arr[i].number = e.target.value; setConfig({...config, emergencyContacts: arr});}} className="bg-slate-900 p-2 rounded text-sm text-emerald-400 w-32 border border-slate-700" />
                        <button onClick={() => deleteItem('contact', i)} className="text-slate-500 hover:text-red-400"><Trash size={16} /></button>
                    </div>
                ))}
             </div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-emerald-400 flex items-center gap-2"><BookOpen size={18} /> Herbal & Practical Remedies</h3>
                <button onClick={addRemedy} className="text-emerald-400 hover:bg-slate-700 p-1 rounded"><Plus size={20} /></button>
             </div>
             <div className="space-y-4">
                {config.herbalRemedies.map((r, i) => (
                    <div key={i} className="flex gap-2 items-start">
                        <div className="flex-1 space-y-2">
                            <input value={r.name} onChange={(e) => {const arr = [...config.herbalRemedies]; arr[i].name = e.target.value; setConfig({...config, herbalRemedies: arr});}} className="bg-slate-900 p-2 rounded text-sm text-white w-full border border-slate-700 font-bold" placeholder="Name" />
                            <textarea value={r.description} onChange={(e) => {const arr = [...config.herbalRemedies]; arr[i].description = e.target.value; setConfig({...config, herbalRemedies: arr});}} className="bg-slate-900 p-2 rounded text-xs text-slate-300 w-full border border-slate-700" placeholder="Description" />
                        </div>
                        <button onClick={() => deleteItem('remedy', i)} className="text-slate-500 hover:text-red-400 mt-2"><Trash size={16} /></button>
                    </div>
                ))}
             </div>
          </div>
          <button onClick={handleSaveConfig} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"><Save size={20} /> Save Changes</button>
        </div>
      )}
    </div>
  );
};

export default Admin;