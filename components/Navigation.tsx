import React from 'react';
import { Home, ClipboardCheck, Book, Gamepad2, Settings, UserCircle } from 'lucide-react';
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
    { view: AppView.CHECKIN, icon: ClipboardCheck, label: t('checkIn', lang) },
    { view: AppView.GAMES, icon: Gamepad2, label: t('games', lang) },
    { view: AppView.PROFILE, icon: UserCircle, label: t('profile', lang) },
  ];

  if (isAdmin) {
    navItems.push({ view: AppView.ADMIN, icon: Settings, label: t('adminPanel', lang) });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 pb-safe pt-2 px-2 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto h-16">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => onChangeView(item.view)}
              className={`flex flex-col items-center justify-center w-14 transition-all duration-300 ${
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
  );
};

export default Navigation;