import { useState } from 'react';
import { CalendarDays } from 'lucide-react';

export default function DaysBetweenDates() {
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');

  let diffDays = null;
  if (date1 && date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
        <CalendarDays className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      </div>

      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Start Date</label>
          <input
            type="date"
            value={date1}
            onChange={(e) => setDate1(e.target.value)}
            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none text-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">End Date</label>
          <input
            type="date"
            value={date2}
            onChange={(e) => setDate2(e.target.value)}
            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none text-lg"
          />
        </div>
      </div>

      {diffDays !== null && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-2xl border border-blue-100 dark:border-blue-800/30 text-center">
          <div className="text-6xl font-black text-blue-600 dark:text-blue-400 mb-2">{diffDays}</div>
          <div className="text-xl font-bold text-blue-800 dark:text-blue-300">Days Difference</div>
        </div>
      )}
    </div>
  );
}
