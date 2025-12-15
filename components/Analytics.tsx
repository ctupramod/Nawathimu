import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { CheckInLog } from '../types';

interface AnalyticsProps {
  logs: CheckInLog[];
}

const Analytics: React.FC<AnalyticsProps> = ({ logs }) => {
  // Process data for chart
  const data = logs.slice(-7).map(log => ({
    date: new Date(log.date).toLocaleDateString('en-US', { weekday: 'short' }),
    mood: log.mood,
    cravings: log.cravings
  }));

  if (logs.length === 0) {
    return (
      <div className="p-6 max-w-md mx-auto flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">📊</span>
        </div>
        <h3 className="text-xl font-semibold text-white">No Data Yet</h3>
        <p className="text-slate-400 mt-2">Complete your daily check-ins to see your recovery trends here.</p>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Recovery Trends</h2>

      <div className="glass-panel rounded-2xl p-4 mb-6">
        <h3 className="text-sm font-medium text-emerald-400 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Mood Improvement
        </h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis hide domain={[0, 10]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="mood" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorMood)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-4">
        <h3 className="text-sm font-medium text-rose-400 mb-4 flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-rose-500"></span> Cravings Intensity
        </h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorCravings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis hide domain={[0, 10]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="cravings" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorCravings)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
