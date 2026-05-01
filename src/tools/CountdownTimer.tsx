import React, { useState, useEffect, useCallback } from 'react';
import { Timer, Calendar, Clock, RotateCcw, PartyPopper } from 'lucide-react';

export default function CountdownTimer() {
  // Sets default end time to 1 hour from now for immediate testing
  const [targetDate, setTargetDate] = useState(() => {
    const date = new Date();
    date.setHours(date.getHours() + 1);
    return date.toISOString().slice(0, 16);
  });

  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [isExpired, setIsExpired] = useState(false);
  const [startTime] = useState(new Date().getTime());

  const calculateTimeLeft = useCallback(() => {
    if (!targetDate) return;

    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const distance = target - now;

    if (distance <= 0) {
      setIsExpired(true);
      setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
      return;
    }

    setIsExpired(false);
    setTimeLeft({
      d: Math.floor(distance / (1000 * 60 * 60 * 24)),
      h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      s: Math.floor((distance % (1000 * 60)) / 1000)
    });
  }, [targetDate]);

  useEffect(() => {
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [calculateTimeLeft]);

  const getProgress = () => {
    if (isExpired) return 100;
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const total = target - startTime;
    const elapsed = now - startTime;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 font-sans">
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-8 md:p-12">
        
        {/* Input Control Section */}
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl mb-6">
            <Clock className="text-blue-600 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black dark:text-white uppercase tracking-tight mb-6">Set End Timing</h2>
          
          <div className="relative group max-w-sm mx-auto">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
            <input
              type="datetime-local"
              value={targetDate}
              min={new Date().toISOString().slice(0, 16)}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-2xl dark:text-white focus:border-blue-600 outline-none font-bold text-lg cursor-pointer"
            />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3">Click the input or the icon to open the picker</p>
        </div>

        {/* Display Section */}
        {isExpired ? (
          <div className="text-center py-10 animate-in zoom-in duration-500">
            <PartyPopper className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-4xl font-black dark:text-white mb-2">FINISHED</h3>
            <button 
              onClick={() => setTargetDate('')}
              className="mt-4 px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2 mx-auto"
            >
              <RotateCcw size={14} /> New Timer
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Progress Bar */}
            <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-1000 ease-linear"
                style={{ width: `${getProgress()}%` }}
              />
            </div>

            {/* Numbers Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Days', val: timeLeft.d },
                { label: 'Hours', val: timeLeft.h },
                { label: 'Min', val: timeLeft.m },
                { label: 'Sec', val: timeLeft.s }
              ].map((unit) => (
                <div key={unit.label} className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                  <div className="text-4xl font-black dark:text-white tabular-nums">{unit.val.toString().padStart(2, '0')}</div>
                  <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">{unit.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}