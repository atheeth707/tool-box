import { useState } from 'react';
import { CalendarClock, Copy } from 'lucide-react';

export default function CronGenerator() {
  const [min, setMin] = useState('*');
  const [hour, setHour] = useState('*');
  const [dayM, setDayM] = useState('*');
  const [month, setMonth] = useState('*');
  const [dayW, setDayW] = useState('*');

  const cron = `${min} ${hour} ${dayM} ${month} ${dayW}`;

  const presets = [
    { label: 'Every Minute', val: ['*', '*', '*', '*', '*'] },
    { label: 'Every Hour', val: ['0', '*', '*', '*', '*'] },
    { label: 'Every Day at Midnight', val: ['0', '0', '*', '*', '*'] },
    { label: 'Every Sunday', val: ['0', '0', '*', '*', '0'] },
    { label: 'Every Month on 1st', val: ['0', '0', '1', '*', '*'] },
  ];

  const applyPreset = (p: string[]) => {
    setMin(p[0]); setHour(p[1]); setDayM(p[2]); setMonth(p[3]); setDayW(p[4]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-teal-50 dark:bg-teal-900/30 p-3 rounded-xl">
            <CalendarClock className="text-teal-600 dark:text-teal-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">Cron Expression Generator</h2>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-gray-100 dark:border-gray-700">
          {presets.map(p => (
            <button key={p.label} onClick={() => applyPreset(p.val)} className="px-4 py-2 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-bold transition-colors">
              {p.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Minute (0-59)</label>
            <input type="text" value={min} onChange={e => setMin(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl dark:text-white focus:border-teal-500 outline-none font-mono text-center text-lg" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Hour (0-23)</label>
            <input type="text" value={hour} onChange={e => setHour(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl dark:text-white focus:border-teal-500 outline-none font-mono text-center text-lg" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Day (Month)</label>
            <input type="text" value={dayM} onChange={e => setDayM(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl dark:text-white focus:border-teal-500 outline-none font-mono text-center text-lg" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Month (1-12)</label>
            <input type="text" value={month} onChange={e => setMonth(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl dark:text-white focus:border-teal-500 outline-none font-mono text-center text-lg" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Day (Week)</label>
            <input type="text" value={dayW} onChange={e => setDayW(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl dark:text-white focus:border-teal-500 outline-none font-mono text-center text-lg" />
          </div>
        </div>

        <div className="bg-teal-50 dark:bg-teal-900/20 p-8 rounded-2xl border border-teal-200 dark:border-teal-800/30 text-center relative">
          <div className="text-sm font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider mb-4">Generated Cron</div>
          <div className="text-5xl md:text-6xl font-black text-teal-600 dark:text-teal-400 font-mono tracking-widest">{cron}</div>
          <button onClick={() => navigator.clipboard.writeText(cron)} className="absolute top-4 right-4 p-3 bg-teal-100 hover:bg-teal-200 dark:bg-teal-900/50 dark:hover:bg-teal-800 text-teal-700 dark:text-teal-300 rounded-xl transition-colors">
            <Copy size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
