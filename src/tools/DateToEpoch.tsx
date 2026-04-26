import { useState, useEffect } from 'react';
import { Hash } from 'lucide-react';

export default function DateToEpoch() {
  const [date, setDate] = useState('');

  // Set initial date to now
  useEffect(() => {
    const now = new Date();
    // Format for datetime-local: YYYY-MM-DDThh:mm
    const tzoffset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(now.getTime() - tzoffset)).toISOString().slice(0,16);
    setDate(localISOTime);
  }, []);

  let seconds = '';
  let ms = '';

  if (date) {
    const d = new Date(date);
    if (!isNaN(d.getTime())) {
      seconds = Math.floor(d.getTime() / 1000).toString();
      ms = d.getTime().toString();
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
        <Hash className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      </div>

      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Local Date & Time</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none text-xl font-bold"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/30 flex justify-between items-center">
          <div>
            <div className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-1">Epoch Timestamp (Seconds)</div>
            <div className="text-3xl font-black text-blue-600 dark:text-blue-400 font-mono">{seconds || '-'}</div>
          </div>
          {seconds && (
            <button onClick={() => navigator.clipboard.writeText(seconds)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors">Copy</button>
          )}
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <div className="text-sm font-bold text-gray-500 mb-1">Epoch Timestamp (Milliseconds)</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white font-mono">{ms || '-'}</div>
          </div>
          {ms && (
            <button onClick={() => navigator.clipboard.writeText(ms)} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium shadow-sm transition-colors">Copy</button>
          )}
        </div>
      </div>
    </div>
  );
}
