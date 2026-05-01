import React, { useState, useEffect, useCallback } from 'react';
import { Timer, Bell, RotateCcw, PartyPopper, Calendar } from 'lucide-react';

export default function CountdownTimer() {
  const [targetDate, setTargetDate] = useState('');
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0, total: 0 });
  const [isExpired, setIsExpired] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  const calculateTimeLeft = useCallback(() => {
    if (!targetDate) return true;

    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const distance = target - now;

    if (distance <= 0) {
      setIsExpired(true);
      setTimeLeft({ d: 0, h: 0, m: 0, s: 0, total: 0 });
      return true;
    }

    setIsExpired(false);
    setTimeLeft({
      d: Math.floor(distance / (1000 * 60 * 60 * 24)),
      h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      s: Math.floor((distance % (1000 * 60)) / 1000),
      total: distance
    });
    return false;
  }, [targetDate]);

  useEffect(() => {
    if (!targetDate) return;
    
    // Logic: Set the 'Start' as exactly right now when the user picks a date
    setStartTime(new Date().getTime());

    calculateTimeLeft();
    const interval = setInterval(() => {
      const done = calculateTimeLeft();
      if (done) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, calculateTimeLeft]);

  // Progress calculation: Based on Current Time vs Start Time vs Target
  const getProgress = () => {
    if (!startTime || !targetDate || isExpired) return 100;
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const totalDuration = target - startTime;
    const elapsed = now - startTime;
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };

  return (
    <div className="max-w-3xl mx-auto p-4 font-sans">
      <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        
        <div className="p-10 text-center bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
          <div className="flex justify-center gap-4 mb-6">
            <div className="px-4 py-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Date</p>
              <p className="text-sm font-black dark:text-white">{new Date().toLocaleDateString()}</p>
            </div>
            <div className="px-4 py-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Time</p>
              <p className="text-sm font-black dark:text-white">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>

          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center justify-center gap-2">
            <Calendar className="text-blue-600" size={24} /> Set End Timing
          </h2>
          
          <div className="mt-6 max-w-xs mx-auto">
            <input
              type="datetime-local"
              value={targetDate}
              min={new Date().toISOString().slice(0, 16)} // Prevents selecting past dates
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full p-4 bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none text-sm font-bold text-center transition-all"
            />
          </div>
        </div>

        <div className="p-10">
          {!targetDate ? (
            <div className="py-12 text-center opacity-40">
              <Timer className="mx-auto w-12 h-12 mb-4" />
              <p className="font-bold uppercase tracking-widest text-xs">Waiting for end date...</p>
            </div>
          ) : isExpired ? (
            <div className="py-12 text-center animate-bounce">
              <PartyPopper className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-4xl font-black dark:text-white">COMPLETED</h3>
              <button onClick={() => setTargetDate('')} className="mt-6 text-blue-600 font-bold uppercase text-xs tracking-widest">Set New Timer</button>
            </div>
          ) : (
            <>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full mb-12 overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000 ease-linear"
                  style={{ width: `${getProgress()}%` }}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Days', val: timeLeft.d },
                  { label: 'Hours', val: timeLeft.h },
                  { label: 'Minutes', val: timeLeft.m },
                  { label: 'Seconds', val: timeLeft.s }
                ].map((unit) => (
                  <div key={unit.label} className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-[28px] border border-slate-100 dark:border-slate-800 text-center">
                    <div className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tabular-nums">
                      {unit.val.toString().padStart(2, '0')}
                    </div>
                    <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">
                      {unit.label}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}