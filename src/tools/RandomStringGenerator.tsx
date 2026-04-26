import { useState } from 'react';
import { RefreshCw, Copy } from 'lucide-react';

export default function RandomStringGenerator() {
  const [length, setLength] = useState(32);
  const [count, setCount] = useState(1);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
  });
  const [results, setResults] = useState<string[]>([]);

  const generate = () => {
    let chars = '';
    if (options.uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (options.numbers) chars += '0123456789';
    if (options.symbols) chars += '!@#$%^&*()_+~|}{[]:;?><,./-=';
    
    if (!chars) return setResults(['Please select at least one character type']);

    const newStrings = [];
    for (let i = 0; i < count; i++) {
      let str = '';
      // Use crypto for better randomness
      const randomValues = new Uint32Array(length);
      crypto.getRandomValues(randomValues);
      for (let j = 0; j < length; j++) {
        str += chars[randomValues[j] % chars.length];
      }
      newStrings.push(str);
    }
    setResults(newStrings);
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
        <h2 className="text-2xl font-bold dark:text-white mb-6">Settings</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">String Length</label>
            <input type="number" min="1" max="2048" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none font-bold" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">How Many?</label>
            <input type="number" min="1" max="100" value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none font-bold" />
          </div>
        </div>

        <div className="space-y-3 pt-4">
          {Object.entries(options).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-blue-300 dark:hover:border-blue-800 transition-colors">
              <span className="capitalize">{key}</span>
              <input type="checkbox" checked={value} onChange={() => setOptions(o => ({ ...o, [key]: !o[key as keyof typeof options] }))} className="w-5 h-5 rounded text-blue-600" />
            </label>
          ))}
        </div>

        <button onClick={generate} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg transition-colors flex items-center justify-center mt-6">
          <RefreshCw size={20} className="mr-2" /> Generate Strings
        </button>
      </div>

      <div className="bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-800 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white">Results ({results.length})</h3>
          {results.length > 0 && !results[0].startsWith('Please') && (
            <button onClick={() => navigator.clipboard.writeText(results.join('\n'))} className="flex items-center text-sm bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
              <Copy size={16} className="mr-2" /> Copy All
            </button>
          )}
        </div>
        
        <div className="flex-1 bg-gray-950 border border-gray-800 rounded-2xl p-6 overflow-y-auto font-mono text-sm text-green-400 space-y-3 max-h-[500px]">
          {results.length > 0 ? results.map((str, i) => (
            <div key={i} className="break-all pb-3 border-b border-gray-800/50 last:border-0 last:pb-0">{str}</div>
          )) : (
            <div className="text-gray-600 flex h-full items-center justify-center">Click generate...</div>
          )}
        </div>
      </div>
    </div>
  );
}
