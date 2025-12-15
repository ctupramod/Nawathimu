import React from 'react';
import { CheckInLog, Language, User } from '../types';
import Analytics from './Analytics';
import RecoveryTimeline from './RecoveryTimeline';
import { t } from '../utils/translations';
import { Book } from 'lucide-react';

interface JournalProps {
  logs: CheckInLog[];
  user: User;
  daysClean: number;
  lang: Language;
}

const Journal: React.FC<JournalProps> = ({ logs, user, daysClean, lang }) => {
  return (
    <div className="p-6 pb-24 max-w-md mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-purple-900/30 p-3 rounded-full">
            <Book className="text-purple-400" size={24} />
        </div>
        <h1 className="text-2xl font-bold text-white">{t('journal', lang)}</h1>
      </div>

      {/* Analytics Section */}
      <div className="space-y-4">
         <Analytics logs={logs} />
      </div>

      {/* Full Timeline Section */}
      <div className="pt-6 border-t border-slate-800">
         <h2 className="text-xl font-bold text-white mb-4">{t('fullTimeline', lang)}</h2>
         <RecoveryTimeline daysClean={daysClean} addiction={user.addiction} lang={lang} compact={false} />
      </div>
    </div>
  );
};

export default Journal;