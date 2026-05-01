import React, { useState, useEffect, useRef } from 'react';
import { Timer, Zap, Target, RefreshCw, Keyboard, Play } from 'lucide-react';

const SAMPLE_TEXT = "The quick brown fox jumps over the lazy dog near the river.";

export default function TypingTest() {
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFinished, setIsFinished] = useState(false);
  const [seconds, setSeconds] = useState(0);
  
  // Using 'any' for the ref type ensures no environment conflicts with NodeJS vs Browser
  const timerRef = useRef<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (isFinished) return;

    // Trigger timer on the very first character
    if (val.length === 1 && !startTime) {
      const now = Date.now();
      setStartTime(now);
      
      // Clear any existing intervals before starting a new one
      if (timerRef.current) window.clearInterval(timerRef.current);
      
      timerRef.current = window.setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }

    setInput(val);
  };

  useEffect(() => {
    // Real-time Accuracy and Completion Check
    if (input.length > 0) {
      const correctChars = input.split('').filter((char, i) => char === SAMPLE_TEXT[i]).length;
      setAccuracy(Math.round((correctChars / input.length) * 100));
    }

    if (input === SAMPLE_TEXT && !isFinished) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setIsFinished(true);
      
      const endTime = Date.now();
      const durationInMinutes = (endTime - (startTime || endTime)) / 60000;
      const finalWpm = Math.round((SAMPLE_TEXT.length / 5) / durationInMinutes);
      setWpm(finalWpm || 0);
    }
  }, [input, isFinished, startTime]);

  // Clean up timer on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const resetTest = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
    setInput('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsFinished(false);
    setSeconds(0);
  };

  const renderText = () => {
    return SAMPLE_TEXT.split('').map((char, index) => {
      let color = "text-slate-400";
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
      <div className="grid grid-cols-3 gap-4">
        <MetricCard icon={<Timer size={16}/>} label="Time" value={`${seconds}s`} color="text-indigo-500" />
        <MetricCard icon={<Target size={16}/>} label="Accuracy" value={`${accuracy}%`} color="text-emerald-500" />
        <MetricCard icon={<Zap size={16}/>} label="WPM" value={wpm > 0 ? wpm : '--'} color="text-amber-500" />
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800">
        <div className="mb-8 text-2xl font-mono leading-relaxed select-none tracking-tight">
          {renderText()}
        </div>

        <div className="relative">
          <textarea
            value={input}
            disabled={isFinished}
            onChange={handleInputChange}
            className="w-full p-6 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-3xl dark:text-white focus:border-indigo-500 outline-none text-lg font-mono transition-all resize-none h-32"
            placeholder="Type the text above to start..."
            spellCheck={false}
          />
          {!startTime && !isFinished && (
            <div className="absolute bottom-4 right-6 flex items-center gap-2 text-indigo-500 animate-pulse">
              <Play size={14} fill="currentColor" />
              <span className="text-[10px] font-black uppercase tracking-widest">Ready to Start</span>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-between items-center">
          <div className="flex items-center gap-2 text-slate-400">
            <Keyboard size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Engine v2.2 Fixed</span>
          </div>
          <button 
            onClick={resetTest}
            className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white rounded-2xl transition-all font-black text-xs uppercase tracking-widest"
          >
            <RefreshCw size={14} /> Reset Test
          </button>
        </div>
      </div>

      {isFinished && (
        <div className="bg-indigo-600 text-white p-8 rounded-[2.5rem] shadow-xl shadow-indigo-500/20 flex justify-between items-center animate-in fade-in zoom-in duration-300">
          <div>
            <h3 className="font-black uppercase tracking-tighter text-2xl">Results Captured</h3>
            <p className="text-indigo-100 text-xs font-bold uppercase mt-1">Accuracy: {accuracy}% | Speed: {wpm} WPM</p>
          </div>
          <div className="text-5xl font-black">{wpm} <span className="text-sm block text-right text-indigo-300">WPM</span></div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string | number, color: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className={color}>{icon}</span>
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</span>
      </div>
      <div className="text-2xl font-black dark:text-white leading-none">{value}</div>
    </div>
  );
}