import React from 'react';
import { Home, Book, UserCircle, Settings } from 'lucide-react';
import { AppView, Language } from '../types';
import { t } from '../utils/translations';

interface NavigationProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  lang: Language;
  isAdmin: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onChangeView, lang, isAdmin }) => {
  const navItems = [
    { view: AppView.DASHBOARD, icon: Home, label: t('dashboard', lang) },
    { view: AppView.JOURNAL, icon: Book, label: t('journal', lang) },
    { view: AppView.PROFILE, icon: UserCircle, label: t('profile', lang) },
  ];

  if (isAdmin) {
    navItems.push({ view: AppView.ADMIN, icon: Settings, label: t('adminPanel', lang) });
  }

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 pb-safe pt-2 px-2 z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = currentView === item.view || 
                             (item.view === AppView.DASHBOARD && (currentView === AppView.CHECKIN || currentView === AppView.GAMES || currentView === AppView.COMMUNITY));
            
            return (
              <button
                key={item.view}
                onClick={() => onChangeView(item.view)}
                className={`flex flex-col items-center justify-center w-16 transition-all duration-300 ${
                  isActive ? 'text-emerald-400 -translate-y-2' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <div className={`p-2 rounded-full transition-colors ${isActive ? 'bg-emerald-500/20' : ''}`}>
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] mt-1 font-medium ${isActive ? 'opacity-100' : 'opacity-0'} truncate w-full text-center`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sidebar Navigation */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-slate-900 border-r border-slate-800 p-6 z-50">
        <div className="mb-8">
           <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-200">
            Rise & Recover
          </h1>
        </div>
        
        <div className="space-y-4">
          {navItems.map((item) => {
            const isActive = currentView === item.view || 
                             (item.view === AppView.DASHBOARD && (currentView === AppView.CHECKIN || currentView === AppView.GAMES || currentView === AppView.COMMUNITY));
            return (
              <button
                key={item.view}
                onClick={() => onChangeView(item.view)}
                className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30' 
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <item.icon size={20} />
                <span className="font-bold">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-auto pt-6 border-t border-slate-800 text-xs text-slate-500">
           © 2024 Rise & Recover
        </div>
      </nav>
    </>
  );
};

export default Navigation;