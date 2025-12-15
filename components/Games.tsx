import React, { useState, useEffect } from 'react';
import { Gamepad2, Play, Trophy, Wind, Grid } from 'lucide-react';
import { Language, User } from '../types';
import { t } from '../utils/translations';

interface GamesProps {
  lang: Language;
  onReward: (amount: number) => void;
}

const Games: React.FC<GamesProps> = ({ lang, onReward }) => {
  const [activeGame, setActiveGame] = useState<'none' | 'breath' | 'memory'>('none');
  
  // Breath Game State
  const [breathPhase, setBreathPhase] = useState('Inhale');

  // Memory Game State
  const [cards, setCards] = useState<number[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const [gameWon, setGameWon] = useState(false);

  // --- Breath Logic ---
  useEffect(() => {
    if (activeGame !== 'breath') return;
    const cycle = [
      { text: 'Inhale', time: 4000 },
      { text: 'Hold', time: 4000 },
      { text: 'Exhale', time: 4000 }
    ];
    let i = 0;
    const interval = setInterval(() => {
        i = (i + 1) % 3;
        setBreathPhase(cycle[i].text);
    }, 4000);
    return () => clearInterval(interval);
  }, [activeGame]);

  // --- Memory Logic ---
  const startMemoryGame = () => {
    const numbers = [1, 2, 3, 4, 5, 6];
    const deck = [...numbers, ...numbers].sort(() => Math.random() - 0.5);
    setCards(deck);
    setFlipped([]);
    setSolved([]);
    setGameWon(false);
    setActiveGame('memory');
  };

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || solved.includes(index)) return;
    
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
        const [first, second] = newFlipped;
        if (cards[first] === cards[second]) {
            setSolved(prev => [...prev, first, second]);
            setFlipped([]);
            if (solved.length + 2 === cards.length) {
                setGameWon(true);
                onReward(20);
            }
        } else {
            setTimeout(() => setFlipped([]), 1000);
        }
    }
  };

  if (activeGame === 'breath') {
    return (
        <div className="flex flex-col items-center justify-center h-[80vh] p-6 text-center animate-in fade-in">
            <div className={`w-48 h-48 rounded-full border-4 border-emerald-400 flex items-center justify-center mb-8 transition-all duration-[4000ms] ${
                breathPhase === 'Inhale' ? 'scale-125 bg-emerald-900/50' : 
                breathPhase === 'Hold' ? 'scale-125 bg-emerald-900/80' : 
                'scale-90 bg-slate-900'
            }`}>
                <span className="text-2xl font-bold text-white">{breathPhase}</span>
            </div>
            <p className="text-slate-400 mb-8">{t('game_breath_desc', lang)}</p>
            <button onClick={() => { setActiveGame('none'); onReward(10); }} className="bg-slate-700 px-6 py-2 rounded-full text-white">
                Finish (+10 XP)
            </button>
        </div>
    );
  }

  if (activeGame === 'memory') {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center animate-in fade-in">
            <h2 className="text-xl font-bold text-white mb-4">{t('game_memory', lang)}</h2>
            
            {gameWon ? (
                <div className="text-center mb-6">
                    <Trophy className="text-yellow-400 w-16 h-16 mx-auto mb-2 animate-bounce" />
                    <h3 className="text-2xl font-bold text-white">{t('victory', lang)}</h3>
                    <p className="text-emerald-400">+20 XP</p>
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-3 mb-8">
                    {cards.map((card, i) => (
                        <button 
                            key={i} 
                            onClick={() => handleCardClick(i)}
                            className={`w-20 h-24 rounded-lg text-2xl font-bold transition-all duration-300 transform ${
                                flipped.includes(i) || solved.includes(i) 
                                    ? 'bg-emerald-600 text-white rotate-y-180' 
                                    : 'bg-slate-700 text-transparent'
                            }`}
                        >
                            {flipped.includes(i) || solved.includes(i) ? card : '?'}
                        </button>
                    ))}
                </div>
            )}
            
            <button onClick={() => setActiveGame('none')} className="bg-slate-700 px-6 py-2 rounded-full text-white">
                Back to Menu
            </button>
        </div>
    );
  }

  return (
    <div className="p-6 pb-24 max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Gamepad2 className="text-emerald-400" /> {t('games', lang)}
        </h1>

        {/* Breath Card */}
        <div 
            onClick={() => setActiveGame('breath')}
            className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-emerald-500 transition-colors cursor-pointer group"
        >
            <div className="flex justify-between items-center mb-2">
                <div className="bg-blue-900/30 p-3 rounded-full">
                    <Wind className="text-blue-400" size={24} />
                </div>
                <Play className="text-slate-600 group-hover:text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white">{t('game_breath', lang)}</h3>
            <p className="text-sm text-slate-400">{t('game_breath_desc', lang)}</p>
        </div>

        {/* Memory Card */}
        <div 
            onClick={startMemoryGame}
            className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-emerald-500 transition-colors cursor-pointer group"
        >
            <div className="flex justify-between items-center mb-2">
                <div className="bg-purple-900/30 p-3 rounded-full">
                    <Grid className="text-purple-400" size={24} />
                </div>
                <Play className="text-slate-600 group-hover:text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white">{t('game_memory', lang)}</h3>
            <p className="text-sm text-slate-400">{t('game_memory_desc', lang)}</p>
        </div>
    </div>
  );
};

export default Games;