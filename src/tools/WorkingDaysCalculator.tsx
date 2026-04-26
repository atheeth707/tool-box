import { useState } from 'react';
import { Briefcase } from 'lucide-react';

export default function WorkingDaysCalculator() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  let workingDays = 0;
  let totalDays = 0;
  let weekends = 0;

  if (start && end) {
    const sDate = new Date(start);
    const eDate = new Date(end);
    
    if (sDate <= eDate) {
      let current = new Date(sDate);
      while (current <= eDate) {
        totalDays++;
        const day = current.getDay();
        if (day !== 0 && day !== 6) {
          workingDays++;
        } else {
          weekends++;
        }
        current.setDate(current.getDate() + 1);
      }
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
        <Briefcase className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      </div>

      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Start Date</label>
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none text-lg font-bold"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">End Date</label>
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none text-lg font-bold"
          />
        </div>
      </div>

      {totalDays > 0 && (
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/30 text-center">
            <div className="text-5xl font-black text-blue-600 dark:text-blue-400 mb-1">{workingDays}</div>
            <div className="text-sm font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider">Working Days</div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalDays}</div>
              <div className="text-xs font-bold text-gray-500 uppercase mt-1">Total Days</div>
            </div>
            <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{weekends}</div>
              <div className="text-xs font-bold text-gray-500 uppercase mt-1">Weekend Days</div>
            </div>
          </div>
        </div>
      )}
      
      {start && end && totalDays === 0 && (
        <div className="text-center p-4 text-red-500 font-medium bg-red-50 dark:bg-red-900/20 rounded-xl">
          End date must be after start date.
        </div>
      )}
    </div>
  );
}
