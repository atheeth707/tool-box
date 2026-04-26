import { useState } from 'react';
import { Hash, Copy, RefreshCw } from 'lucide-react';

export default function RandomNumberGenerator() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [results, setResults] = useState<number[]>([]);
  const [animating, setAnimating] = useState(false);

  const generate = () => {
    if (min >= max) return alert('Min must be less than Max');
    setAnimating(true);
    
    // Fake animation
    let ticks = 0;
    const interval = setInterval(() => {
      setResults(Array.from({ length: count }).map(() => Math.floor(Math.random() * (max - min + 1)) + min));
      ticks++;
      if (ticks > 10) {
        clearInterval(interval);
        setAnimating(false);
      }
    }, 50);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl">
            <Hash className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">Random Number Generator</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Min Value</label>
            <input type="number" value={min} onChange={(e) => setMin(Number(e.target.value))} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none font-bold" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Max Value</label>
            <input type="number" value={max} onChange={(e) => setMax(Number(e.target.value))} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none font-bold" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Quantity</label>
            <input type="number" min="1" max="1000" value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none font-bold" />
          </div>
        </div>

        <button onClick={generate} disabled={animating} className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-2xl font-bold text-lg transition-colors flex items-center justify-center shadow-lg shadow-blue-500/30">
          <RefreshCw size={20} className={`mr-2 ${animating ? 'animate-spin' : ''}`} /> Generate Numbers
        </button>
      </div>

      {results.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-700 relative">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-500 uppercase tracking-wider">Results</h3>
            <button onClick={() => navigator.clipboard.writeText(results.join(', '))} className="text-blue-600 hover:text-blue-700 font-bold flex items-center">
              <Copy size={16} className="mr-1"/> Copy
            </button>
          </div>
          <div className="flex flex-wrap gap-3 max-h-[400px] overflow-y-auto">
            {results.map((n, i) => (
              <div key={i} className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-mono font-bold text-xl dark:text-white shadow-sm">
                {n}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
