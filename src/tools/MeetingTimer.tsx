import { useState, useEffect } from 'react';
import { Users, Play, Pause, RotateCcw, DollarSign } from 'lucide-react';

export default function MeetingTimer() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [attendees, setAttendees] = useState(5);
  const [hourlyRate, setHourlyRate] = useState(50); // Average hourly rate per person

  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const cost = (seconds / 3600) * attendees * hourlyRate;

  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-rose-50 dark:bg-rose-900/30 p-3 rounded-xl">
            <Users className="text-rose-600 dark:text-rose-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">Meeting Cost Timer</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Number of Attendees</label>
            <input type="number" min="1" value={attendees} onChange={e => setAttendees(Number(e.target.value))} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-rose-500 outline-none font-bold text-xl" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Avg. Hourly Rate ($)</label>
            <input type="number" min="1" value={hourlyRate} onChange={e => setHourlyRate(Number(e.target.value))} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-rose-500 outline-none font-bold text-xl" />
          </div>
        </div>

        <div className="bg-rose-50 dark:bg-rose-900/10 p-10 rounded-3xl border border-rose-100 dark:border-rose-900/30 text-center space-y-8">
          <div>
            <div className="text-sm font-bold text-rose-800 dark:text-rose-400 uppercase tracking-widest mb-2">Meeting Duration</div>
            <div className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white font-mono tracking-tight">{h}:{m}:{s}</div>
          </div>

          <div>
            <div className="text-sm font-bold text-rose-800 dark:text-rose-400 uppercase tracking-widest mb-2">Estimated Cost</div>
            <div className="text-6xl md:text-8xl font-black text-rose-600 dark:text-rose-500 font-mono tracking-tighter flex items-center justify-center">
              <DollarSign size={48} className="mr-1 md:mr-2 opacity-50" />
              {cost.toFixed(2)}
            </div>
          </div>

          <div className="flex justify-center space-x-4 pt-4">
            <button onClick={() => setIsActive(!isActive)} className={`w-20 h-20 flex items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105 ${isActive ? 'bg-amber-500' : 'bg-rose-600'}`}>
              {isActive ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
            </button>
            <button onClick={() => {setIsActive(false); setSeconds(0);}} className="w-20 h-20 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-transform hover:scale-105">
              <RotateCcw size={28} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
