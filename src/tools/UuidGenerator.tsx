import { useState } from 'react';
import { Copy, RefreshCw } from 'lucide-react';

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);

  const generate = () => {
    const newUuids = Array.from({ length: count }).map(() => crypto.randomUUID());
    setUuids(newUuids);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <label className="font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">How many?</label>
          <input 
            type="number" 
            min="1" max="100" 
            value={count} 
            onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-24 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-500 dark:text-white text-center"
          />
        </div>
        <button onClick={generate} className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center transition-colors shadow-sm">
          <RefreshCw size={18} className="mr-2" /> Generate UUIDs
        </button>
      </div>

      {uuids.length > 0 ? (
        <div className="relative">
          <div className="flex justify-between items-center mb-4 px-2">
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Generated UUIDs (v4)</span>
            <button onClick={copyAll} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center">
              <Copy size={16} className="mr-1" /> Copy All
            </button>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 max-h-96 overflow-y-auto font-mono text-gray-800 dark:text-gray-200 text-sm md:text-base space-y-2">
            {uuids.map((uuid, i) => (
              <div key={i} className="py-1 border-b border-gray-200 dark:border-gray-800 last:border-0">{uuid}</div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
          Click generate to create standard v4 UUIDs
        </div>
      )}
    </div>
  );
}
