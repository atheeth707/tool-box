import { useState, useEffect } from 'react';
import { Calendar, Trash2 } from 'lucide-react';

export default function DailyPlanner() {
  const hours = Array.from({length: 15}, (_, i) => i + 8); // 8 AM to 10 PM
  const [schedule, setSchedule] = useState<Record<number, string>>({});

  useEffect(() => {
    const saved = localStorage.getItem('toolbox_planner');
    if (saved) {
      const data = JSON.parse(saved);
      // Only load if it's the same day
      if (data.date === new Date().toDateString()) {
        setSchedule(data.schedule);
      }
    }
  }, []);

  const update = (hour: number, text: string) => {
    const newSchedule = { ...schedule, [hour]: text };
    setSchedule(newSchedule);
    localStorage.setItem('toolbox_planner', JSON.stringify({ date: new Date().toDateString(), schedule: newSchedule }));
  };

  const clear = () => {
    setSchedule({});
    localStorage.removeItem('toolbox_planner');
  };

  const formatHour = (h: number) => {
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:00 ${ampm}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl">
              <Calendar className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold dark:text-white">Daily Planner</h2>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          <button onClick={clear} className="text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-xl transition-colors flex items-center">
            <Trash2 size={16} className="mr-2" /> Clear All
          </button>
        </div>

        <div className="space-y-3">
          {hours.map(h => (
            <div key={h} className="flex flex-col sm:flex-row sm:items-center bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="w-full sm:w-28 p-4 bg-gray-100 dark:bg-gray-800 text-sm font-bold text-gray-600 dark:text-gray-300 text-center sm:text-right border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700">
                {formatHour(h)}
              </div>
              <input 
                type="text" 
                value={schedule[h] || ''} 
                onChange={e => update(h, e.target.value)}
                placeholder="Plan your hour..."
                className="flex-1 p-4 bg-transparent outline-none dark:text-white font-medium"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
