import React, { useState, useEffect } from 'react';
import { User, AppView, CheckInLog, AiAdvice, Language, SymptomRecord } from './types';
import { StorageService } from './services/storage';
import Navigation from './components/Navigation';
import Achievements from './components/Achievements';
import CheckIn from './components/CheckIn';
import Journal from './components/Journal';
import Games from './components/Games';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Community from './components/Community';
import Admin from './components/Admin';
import Profile from './components/Profile';

const App: React.FC = () => {
  // --- State ---
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>(AppView.AUTH);
  const [logs, setLogs] = useState<CheckInLog[]>([]);
  const [lastAdvice, setLastAdvice] = useState<AiAdvice | null>(null);
  const [lang, setLang] = useState<Language>('en');

  // --- Derived State ---
  const calculateDaysClean = () => {
    if (!user) return 0;
    const start = new Date(user.quitDate);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 3600 * 24));
  };
  
  const daysClean = calculateDaysClean();

  // Load logs on login
  useEffect(() => {
    if (user) {
        setLogs(StorageService.getUserLogs(user.username));
    }
  }, [user]);

  // --- Handlers ---
  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    setView(AppView.AUTH);
    setLogs([]);
    setLastAdvice(null);
  };

  const handleCheckInComplete = (mood: number, cravings: number, symptoms: SymptomRecord[], notes: string, advice: any) => {
    if (!user) return;
    const newLog: CheckInLog = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mood,
      cravings,
      symptoms,
      notes
    };
    
    StorageService.saveUserLog(user.username, newLog);
    setLogs(prev => [...prev, newLog]);
    
    const newAdvice: AiAdvice = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      symptoms: symptoms.map(s => s.name).join(', '),
      advice: advice.practicalTips,
      encouragement: advice.encouragement
    };
    
    setLastAdvice(newAdvice);
    
    // Reward mechanism
    // In a real app we would update the user record in storage too
    setUser({ ...user, coins: user.coins + 50 });
  };

  const handleGameReward = (amount: number) => {
    if (user) setUser({ ...user, coins: user.coins + amount });
  };

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-900/20 rounded-full blur-3xl"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {view === AppView.AUTH && (
          <Auth onLogin={handleLogin} lang={lang} setLang={setLang} />
        )}
        
        {view !== AppView.AUTH && user && (
          <>
            {view === AppView.DASHBOARD && (
              <Dashboard 
                user={user} 
                daysClean={daysClean} 
                logs={logs} 
                lastAdvice={lastAdvice} 
                onCheckInClick={() => setView(AppView.CHECKIN)} 
                onChangeView={setView}
                lang={lang}
              />
            )}
            
            {view === AppView.CHECKIN && (
              <CheckIn 
                userAddiction={user.addiction} 
                daysClean={daysClean} 
                onComplete={handleCheckInComplete} 
                onExit={() => setView(AppView.DASHBOARD)}
                lang={lang}
              />
            )}

            {view === AppView.JOURNAL && (
                <Journal logs={logs} user={user} daysClean={daysClean} lang={lang} />
            )}

            {view === AppView.GAMES && (
                <Games lang={lang} onReward={handleGameReward} />
            )}

            {view === AppView.ACHIEVEMENTS && <Achievements daysClean={daysClean} />}
            {view === AppView.COMMUNITY && <Community user={user} lang={lang} />}
            {view === AppView.PROFILE && <Profile user={user} lang={lang} setLang={setLang} onLogout={handleLogout} onUpdateUser={setUser} />}
            {view === AppView.ADMIN && user.isAdmin && <Admin />}
            
            <Navigation 
                currentView={view} 
                onChangeView={setView} 
                lang={lang} 
                isAdmin={!!user.isAdmin}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default App;