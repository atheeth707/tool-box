import { useState } from 'react';
import { Calendar } from 'lucide-react';

export default function EpochToDate() {
  const [epoch, setEpoch] = useState('');
  const [isMs, setIsMs] = useState(false);

  let local = '';
  let utc = '';

  if (epoch && !isNaN(Number(epoch))) {
    const d = new Date(isMs ? Number(epoch) : Number(epoch) * 1000);
    if (!isNaN(d.getTime())) {
      local = d.toLocaleString();
      utc = d.toUTCString();
    } else {
      local = 'Invalid timestamp';
      utc = 'Invalid timestamp';
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
        <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      </div>

      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Unix Timestamp</label>
          <input
            type="number"
            value={epoch}
            onChange={(e) => setEpoch(e.target.value)}
            placeholder="e.g. 1672531199"
            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none text-xl font-mono"
          />
        </div>
        
        <div className="flex items-center space-x-3 ml-1">
          <input 
            type="checkbox" 
            id="isms" 
            checked={isMs} 
            onChange={(e) => setIsMs(e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label htmlFor="isms" className="font-medium text-gray-700 dark:text-gray-300 cursor-pointer">Timestamp is in milliseconds</label>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="text-sm font-bold text-gray-500 mb-1">Local Time</div>
          <div className="text-xl font-semibold text-gray-900 dark:text-white">{local || '-'}</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/30">
          <div className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-1">UTC Time</div>
          <div className="text-xl font-semibold text-blue-900 dark:text-blue-100">{utc || '-'}</div>
        </div>
      </div>
    </div>
  );
}
