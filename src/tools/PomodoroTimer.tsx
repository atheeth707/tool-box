import { useState, useEffect } from 'react';
import { Brain, Coffee, Play, Pause, RotateCcw } from 'lucide-react';

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play sound here if needed
      if (mode === 'work') {
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('work');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggle = () => setIsActive(!isActive);
  
  const reset = () => {
    setIsActive(false);
    setMode('work');
    setTimeLeft(25 * 60);
  };

  const setWork = () => { setIsActive(false); setMode('work'); setTimeLeft(25 * 60); };
  const setBreak = () => { setIsActive(false); setMode('break'); setTimeLeft(5 * 60); };

  const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const s = (timeLeft % 60).toString().padStart(2, '0');
  
  const progress = mode === 'work' ? ((25 * 60 - timeLeft) / (25 * 60)) * 100 : ((5 * 60 - timeLeft) / (5 * 60)) * 100;

  return (
    <div className={`max-w-2xl mx-auto p-10 rounded-3xl shadow-sm border text-center transition-colors duration-500 ${mode === 'work' ? 'bg-rose-50 border-rose-100 dark:bg-rose-900/10 dark:border-rose-900/30' : 'bg-teal-50 border-teal-100 dark:bg-teal-900/10 dark:border-teal-900/30'}`}>
      
      <div className="flex justify-center space-x-4 mb-10">
        <button onClick={setWork} className={`px-6 py-2 rounded-full font-bold flex items-center transition-colors ${mode === 'work' ? 'bg-rose-500 text-white shadow-md' : 'bg-white dark:bg-gray-800 text-gray-500'}`}>
          <Brain size={18} className="mr-2" /> Work
        </button>
        <button onClick={setBreak} className={`px-6 py-2 rounded-full font-bold flex items-center transition-colors ${mode === 'break' ? 'bg-teal-500 text-white shadow-md' : 'bg-white dark:bg-gray-800 text-gray-500'}`}>
          <Coffee size={18} className="mr-2" /> Break
        </button>
      </div>

      <div className="relative w-64 h-64 mx-auto mb-10 flex items-center justify-center">
        <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
          <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white dark:text-gray-800 opacity-50" />
          <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={120 * 2 * Math.PI} strokeDashoffset={120 * 2 * Math.PI * (1 - progress / 100)} className={`transition-all duration-1000 ease-linear ${mode === 'work' ? 'text-rose-500' : 'text-teal-500'}`} />
        </svg>
        <div className={`text-6xl font-black font-mono tracking-tight ${mode === 'work' ? 'text-rose-600 dark:text-rose-400' : 'text-teal-600 dark:text-teal-400'}`}>
          {m}:{s}
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={toggle}
          className={`w-20 h-20 flex items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105 ${mode === 'work' ? 'bg-rose-500 hover:bg-rose-600' : 'bg-teal-500 hover:bg-teal-600'}`}
        >
          {isActive ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
        </button>
        <button
          onClick={reset}
          className="w-20 h-20 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm transition-transform hover:scale-105"
        >
          <RotateCcw size={28} />
        </button>
      </div>
    </div>
  );
}
