import React, { useState, useEffect, useRef } from 'react';
import { Timer, Zap, Target, RefreshCw, Keyboard } from 'lucide-react';

const SAMPLE_TEXT = "The quick brown fox jumps over the lazy dog near the river.";

export default function TypingTest() {
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFinished, setIsFinished] = useState(false);
  const [seconds, setSeconds] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Logic: Real-time validation and Timer Management
  useEffect(() => {
    if (input.length === 1 && !startTime) {
      setStartTime(Date.now());
      timerRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }

    if (input.length > 0) {
      // Calculate Accuracy
      const correctChars = input.split('').filter((char, i) => char === SAMPLE_TEXT[i]).length;
      setAccuracy(Math.round((correctChars / input.length) * 100));
    }

    if (input === SAMPLE_TEXT && !isFinished) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsFinished(true);
      
      const timeTakenMinutes = (Date.now() - (startTime || Date.now())) / 1000 / 60;
      // Standard WPM: (characters / 5) / time
      const calculatedWpm = Math.round((SAMPLE_TEXT.length / 5) / timeTakenMinutes);
      setWpm(calculatedWpm);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [input, startTime, isFinished]);

  const resetTest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setInput('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsFinished(false);
    setSeconds(0);
  };

  // Logic: Character-by-character color grading
  const renderText = () => {
    return SAMPLE_TEXT.split('').map((char, index) => {
      let color = "text-slate-400"; // Default
      if (index < input.length) {
        color = input[index] === char ? "text-emerald-500" : "text-rose-500 bg-rose-500/10";
      }
      return (
        <span key={index} className={`${color} transition-colors duration-150 border-b-2 ${index === input.length ? 'border-indigo-500' : 'border-transparent'}`}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* Metrics Dashboard */}
      <div className="grid grid-cols-3 gap-4">
        <MetricCard icon={<Timer size={16}/>} label="Time" value={`${seconds}s`} color="text-indigo-500" />
        <MetricCard icon={<Target size={16}/>} label="Accuracy" value={`${accuracy}%`} color="text-emerald-500" />
        <MetricCard icon={<Zap size={16}/>} label="Live WPM" value={wpm > 0 ? wpm : '--'} color="text-amber-500" />
      </div>

      {/* Main Test Area */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden">
        <div className="mb-8 text-2xl font-mono leading-relaxed select-none tracking-tight">
          {renderText()}
        </div>

        <textarea
          value={input}
          disabled={isFinished}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-6 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-3xl dark:text-white focus:border-indigo-500 outline-none text-lg font-mono transition-all resize-none h-32"
          placeholder="The clock starts when you type the first letter..."
        />

        <div className="mt-6 flex justify-between items-center">
          <div className="flex items-center gap-2 text-slate-400">
            <Keyboard size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Mechanical Logic Engine</span>
          </div>
          <button 
            onClick={resetTest}
            className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white rounded-2xl transition-all font-black text-xs uppercase tracking-widest"
          >
            <RefreshCw size={14} /> Reset
          </button>
        </div>
      </div>

      {/* Result Overlay */}
      {isFinished && (
        <div className="bg-emerald-500 text-white p-6 rounded-3xl shadow-xl shadow-emerald-500/20 flex justify-between items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <h3 className="font-black uppercase tracking-tighter text-xl">Test Complete!</h3>
            <p className="text-emerald-100 text-xs font-bold uppercase">Great job! You typed at {wpm} words per minute.</p>
          </div>
          <div className="text-4xl font-black">{wpm} <span className="text-sm">WPM</span></div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string | number, color: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <span className={color}>{icon}</span>
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</span>
      </div>
      <div className={`text-xl font-black dark:text-white`}>{value}</div>
    </div>
  );
}