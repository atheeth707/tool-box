import React, { useState, useEffect, useCallback } from 'react';
import { Timer, Plus, Minus, RotateCcw, PartyPopper, Clock } from 'lucide-react';

export default function CustomClockTimer() {
  // State for manual hour/minute selection
  const [targetHours, setTargetHours] = useState(new Date().getHours() + 1);
  const [targetMinutes, setTargetMinutes] = useState(0);
  
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [isExpired, setIsExpired] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const calculateTimeLeft = useCallback(() => {
    const now = new Date();
    const target = new Date();
    target.setHours(targetHours, targetMinutes, 0, 0);

    // If the selected time is earlier than 'now', assume it's for tomorrow
    if (target.getTime() <= now.getTime()) {
      target.setDate(target.getDate() + 1);
    }

    const distance = target.getTime() - now.getTime();

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
  }, [targetHours, targetMinutes]);

  useEffect(() => {
    if (!isRunning) return;
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [isRunning, calculateTimeLeft]);

  const adjustTime = (type: 'h' | 'm', amount: number) => {
    setIsRunning(false); // Pause while editing
    if (type === 'h') {
      setTargetHours((prev) => (prev + amount + 24) % 24);
    } else {
      setTargetMinutes((prev) => (prev + amount + 60) % 60);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 font-sans">
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-8 md:p-12">
        
        {/* Manual Clock Selector */}
        <div className="text-center mb-12">
          <div className="inline-flex p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl mb-6">
            <Clock className="text-indigo-600 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black dark:text-white uppercase tracking-tight mb-8">Set End Timing</h2>
          
          <div className="flex items-center justify-center gap-6">
            {/* Hours Control */}
            <div className="flex flex-col items-center gap-2">
              <button onClick={() => adjustTime('h', 1)} className="p-2 hover:text-indigo-600 dark:text-white"><Plus /></button>
              <div className="w-20 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-4xl font-black dark:text-white">
                {targetHours.toString().padStart(2, '0')}
              </div>
              <button onClick={() => adjustTime('h', -1)} className="p-2 hover:text-indigo-600 dark:text-white"><Minus /></button>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Hours</span>
            </div>

            <div className="text-4xl font-black text-slate-300">:</div>

            {/* Minutes Control */}
            <div className="flex flex-col items-center gap-2">
              <button onClick={() => adjustTime('m', 5)} className="p-2 hover:text-indigo-600 dark:text-white"><Plus /></button>
              <div className="w-20 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-4xl font-black dark:text-white">
                {targetMinutes.toString().padStart(2, '0')}
              </div>
              <button onClick={() => adjustTime('m', -5)} className="p-2 hover:text-indigo-600 dark:text-white"><Minus /></button>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Mins</span>
            </div>
          </div>

          <button 
            onClick={() => setIsRunning(true)}
            className="mt-8 px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/30"
          >
            Start Countdown
          </button>
        </div>

        {/* Countdown Display */}
        {isRunning && (
          <div className="pt-10 border-t border-slate-100 dark:border-slate-800">
            {isExpired ? (
              <div className="text-center py-6 animate-bounce">
                <PartyPopper className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <h3 className="text-2xl font-black dark:text-white">TIME IS UP!</h3>
                <button onClick={() => setIsRunning(false)} className="mt-4 text-xs font-bold text-indigo-600 uppercase">Reset</button>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'D', val: timeLeft.d },
                  { label: 'H', val: timeLeft.h },
                  { label: 'M', val: timeLeft.m },
                  { label: 'S', val: timeLeft.s }
                ].map((unit) => (
                  <div key={unit.label} className="bg-slate-900 dark:bg-black p-4 rounded-2xl text-center">
                    <div className="text-2xl font-black text-white tabular-nums">{unit.val.toString().padStart(2, '0')}</div>
                    <div className="text-[8px] font-bold text-indigo-400 uppercase tracking-tighter">{unit.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}