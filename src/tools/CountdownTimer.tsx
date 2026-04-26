import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

export default function CountdownTimer() {
  const [targetDate, setTargetDate] = useState('');
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!targetDate) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(interval);
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
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
      <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
        <Timer className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      </div>

      <div className="mb-10">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Select Target Date & Time</label>
        <input
          type="datetime-local"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          className="w-full md:w-auto p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none text-lg font-bold text-center"
        />
      </div>

      {targetDate && (
        isExpired ? (
          <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-800/30">
            <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">Countdown Expired!</h3>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Days', value: timeLeft.d },
              { label: 'Hours', value: timeLeft.h },
              { label: 'Minutes', value: timeLeft.m },
              { label: 'Seconds', value: timeLeft.s }
            ].map(unit => (
              <div key={unit.label} className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                <div className="text-4xl md:text-5xl font-black text-blue-600 dark:text-blue-400 mb-2">{unit.value.toString().padStart(2, '0')}</div>
                <div className="text-sm font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider">{unit.label}</div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
