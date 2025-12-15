import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, Shield } from 'lucide-react';
import { User, ChatMessage, Language } from '../types';
import { t } from '../utils/translations';
import { StorageService } from '../services/storage';

interface CommunityProps {
  user: User;
  lang: Language;
}

const Community: React.FC<CommunityProps> = ({ user, lang }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Poll for new messages every 2 seconds (simulating realtime)
    const load = () => setMessages(StorageService.getMessages());
    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      senderUsername: user.username,
      content: newMessage,
      timestamp: new Date().toISOString()
    };
    StorageService.sendMessage(msg);
    setNewMessage('');
    setMessages(StorageService.getMessages());
  };

  return (
    <div className="flex flex-col h-[100dvh] md:ml-64 bg-slate-900 relative">
      <div className="bg-slate-800 p-4 shadow-md z-10 flex justify-between items-center shrink-0">
        <div>
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <Users className="text-emerald-400" size={20} /> {t('community', lang)}
            </h2>
            <p className="text-xs text-slate-400">Anonymous support group</p>
        </div>
        <div className="bg-slate-700 px-3 py-1 rounded-full text-xs text-slate-300 flex items-center gap-1 mr-12 md:mr-0">
            <Shield size={12} className="text-emerald-400" /> Safe Space
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg) => {
          const isMe = msg.senderUsername === user.username;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-3 ${
                isMe 
                  ? 'bg-emerald-600 text-white rounded-tr-none' 
                  : 'bg-slate-700 text-slate-200 rounded-tl-none'
              }`}>
                {!isMe && (
                    <p className="text-[10px] text-emerald-400 font-bold mb-1 opacity-75">
                        User {msg.senderUsername.slice(0, 3)}***
                    </p>
                )}
                <p className="text-sm break-words leading-relaxed">{msg.content}</p>
                <p className="text-[10px] opacity-50 text-right mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <div className="p-4 bg-slate-800 border-t border-slate-700 shrink-0 pb-24 md:pb-6">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('chatPlaceholder', lang)}
            className="flex-1 bg-slate-900 border border-slate-600 rounded-full px-4 py-3 text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
          />
          <button 
            onClick={handleSend}
            className="bg-emerald-600 p-3 rounded-full text-white hover:bg-emerald-500 transition-colors shrink-0 shadow-lg shadow-emerald-900/20"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Community;