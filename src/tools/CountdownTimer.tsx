import React, { useState, useEffect, useCallback } from 'react';
import { Timer, Bell, RotateCcw, PartyPopper } from 'lucide-react';

export default function CountdownTimer() {
  const [targetDate, setTargetDate] = useState('');
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0, total: 0 });
  const [isExpired, setIsExpired] = useState(false);
  const [initialDistance, setInitialDistance] = useState(0);

  const calculateTimeLeft = useCallback(() => {
    if (!targetDate) return;

    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const distance = target - now;

    if (distance <= 0) {
      setIsExpired(true);
      setTimeLeft({ d: 0, h: 0, m: 0, s: 0, total: 0 });
      return true; // Finished
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
    
    // Set initial distance for progress bar
    const startDistance = new Date(targetDate).getTime() - new Date().getTime();
    setInitialDistance(startDistance);

    // Run once immediately
    calculateTimeLeft();

    const interval = setInterval(() => {
      const done = calculateTimeLeft();
      if (done) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, calculateTimeLeft]);

  const progress = initialDistance > 0 
    ? Math.min(100, Math.max(0, 100 - (timeLeft.total / initialDistance) * 100)) 
    : 0;

  return (
    <div className="max-w-3xl mx-auto p-4 font-sans">
      <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        
        {/* Header with Background Accent */}
        <div className="relative p-10 text-center bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/40 animate-pulse">
            <Timer className="text-white w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Event Countdown</h2>
          
          <div className="mt-8 max-w-xs mx-auto">
            <input
              type="datetime-local"
              value={targetDate}
              onChange={(e) => {
                setTargetDate(e.target.value);
                setIsExpired(false);
              }}
              className="w-full p-4 bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-2xl dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-sm font-bold text-center transition-all"
            />
          </div>
        </div>

        <div className="p-10">
          {!targetDate ? (
            <div className="py-12 text-center">
              <Bell className="mx-auto w-12 h-12 text-slate-300 mb-4" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Set a date to begin the count</p>
            </div>
          ) : isExpired ? (
            <div className="py-12 text-center animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <PartyPopper className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-2">TIME'S UP!</h3>
              <p className="text-slate-500 mb-8">The wait is over. Your event has started.</p>
              <button 
                onClick={() => setTargetDate('')}
                className="flex items-center gap-2 mx-auto px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all"
              >
                <RotateCcw size={16} /> Reset Timer
              </button>
            </div>
          ) : (
            <>
              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full mb-12 overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-1000 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Countdown Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'Days', val: timeLeft.d },
                  { label: 'Hours', val: timeLeft.h },
                  { label: 'Minutes', val: timeLeft.m },
                  { label: 'Seconds', val: timeLeft.s }
                ].map((unit) => (
                  <div key={unit.label} className="relative group">
                    <div className="bg-slate-50 dark:bg-slate-800/30 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 text-center transition-all group-hover:scale-105 group-hover:border-blue-400/30">
                      <div className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-2 tabular-nums">
                        {unit.val.toString().padStart(2, '0')}
                      </div>
                      <div className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">
                        {unit.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/30 text-center">
           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
             Precision Timekeeper Engine • System Version 3.14
           </p>
        </div>
      </div>
    </div>
  );
}