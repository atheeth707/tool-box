import { useState } from 'react';
import { Clock } from 'lucide-react';

export default function TimeDurationCalculator() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  let hours = 0;
  let mins = 0;
  let totalMins = 0;

  if (start && end) {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    
    let diff = (eh * 60 + em) - (sh * 60 + sm);
    if (diff < 0) diff += 24 * 60; // handle overnight
    
    totalMins = diff;
    hours = Math.floor(diff / 60);
    mins = diff % 60;
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
        <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      </div>

      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Start Time</label>
          <input
            type="time"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none text-xl font-bold text-center"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">End Time</label>
          <input
            type="time"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none text-xl font-bold text-center"
          />
        </div>
      </div>

      {start && end && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-2xl border border-blue-100 dark:border-blue-800/30 text-center space-y-2">
          <div className="text-5xl font-black text-blue-600 dark:text-blue-400 mb-1">
            {hours}h {mins}m
          </div>
          <div className="text-sm font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider">Duration</div>
          <div className="text-gray-500 mt-2 text-sm">({totalMins} total minutes)</div>
        </div>
      )}
    </div>
  );
}
