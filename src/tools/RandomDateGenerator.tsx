import { useState } from 'react';
import { Dices, Copy } from 'lucide-react';

export default function RandomDateGenerator() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [result, setResult] = useState('');

  const generate = () => {
    if (!start || !end) return;
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    
    if (e > s) {
      const randomTime = s + Math.random() * (e - s);
      const d = new Date(randomTime);
      setResult(d.toLocaleString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    } else {
      setResult('Error: End date must be after start date');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
      <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
        <Dices className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Start Date</label>
          <input
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none font-bold"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">End Date</label>
          <input
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none font-bold"
          />
        </div>
      </div>

      <button 
        onClick={generate}
        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xl transition-colors shadow-lg shadow-blue-500/30 mb-8"
      >
        Generate Random Date
      </button>

      {result && (
        <div className="relative bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className={`text-xl font-bold ${result.startsWith('Error') ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
            {result}
          </div>
          {!result.startsWith('Error') && (
            <button onClick={() => navigator.clipboard.writeText(result)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-blue-600 transition-colors">
              <Copy size={20} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
