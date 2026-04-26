import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => {
        setTime((t) => t + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (ms: number) => {
    const d = new Date(ms);
    const m = d.getUTCMinutes().toString().padStart(2, '0');
    const s = d.getUTCSeconds().toString().padStart(2, '0');
    const msStr = Math.floor(d.getUTCMilliseconds() / 10).toString().padStart(2, '0');
    
    if (d.getUTCHours() > 0) {
      const h = d.getUTCHours().toString().padStart(2, '0');
      return `${h}:${m}:${s}.${msStr}`;
    }
    return `${m}:${s}.${msStr}`;
  };

  const addLap = () => {
    setLaps([...laps, time]);
  };

  const reset = () => {
    setIsActive(false);
    setTime(0);
    setLaps([]);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
        <div className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white font-mono tracking-tight mb-10">
          {formatTime(time)}
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`w-16 h-16 flex items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105 ${isActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isActive ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
          </button>
          
          <button
            onClick={addLap}
            disabled={!isActive}
            className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition-transform hover:scale-105"
          >
            <Flag size={24} />
          </button>

          <button
            onClick={reset}
            className="w-16 h-16 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-transform hover:scale-105"
          >
            <RotateCcw size={24} />
          </button>
        </div>
      </div>

      {laps.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-2">Laps</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {[...laps].reverse().map((lap, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                <span className="text-gray-500 font-bold">Lap {laps.length - i}</span>
                <span className="font-mono font-bold text-gray-900 dark:text-white text-lg">{formatTime(lap)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
