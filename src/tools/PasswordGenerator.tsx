import { useState } from 'react';
import { Copy, RefreshCw } from 'lucide-react';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  const generate = () => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const nums = '0123456789';
    const syms = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    
    let chars = '';
    if (options.uppercase) chars += upper;
    if (options.lowercase) chars += lower;
    if (options.numbers) chars += nums;
    if (options.symbols) chars += syms;
    
    if (!chars) return setPassword('');
    
    let pass = '';
    for (let i = 0; i < length; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pass);
  };

  const copy = () => {
    if (password) navigator.clipboard.writeText(password);
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="relative mb-8">
        <input 
          type="text" 
          value={password} 
          readOnly 
          className="w-full bg-gray-50 dark:bg-gray-900 text-2xl p-5 rounded-2xl font-mono text-center border border-gray-200 dark:border-gray-700 dark:text-white outline-none"
          placeholder="Click generate"
        />
        <button onClick={copy} className="absolute right-3 top-3 p-2 bg-white dark:bg-gray-800 rounded-lg text-gray-500 hover:text-blue-600 shadow-sm border border-gray-100 dark:border-gray-700 dark:hover:text-blue-400 transition-colors">
          <Copy size={20} />
        </button>
      </div>
      
      <div className="mb-8">
        <label className="flex justify-between text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          <span>Password Length</span>
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 px-2 py-0.5 rounded">{length}</span>
        </label>
        <input 
          type="range" 
          min="8" max="64" 
          value={length} 
          onChange={(e) => setLength(parseInt(e.target.value))}
          className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
      </div>

      <div className="space-y-4 mb-8">
        {Object.entries(options).map(([key, value]) => (
          <label key={key} className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <span className="capitalize">{key}</span>
            <input 
              type="checkbox" 
              checked={value} 
              onChange={() => setOptions(o => ({ ...o, [key]: !o[key as keyof typeof options] }))}
              className="rounded-md text-blue-600 focus:ring-blue-500 h-5 w-5 border-gray-300 dark:border-gray-600 dark:bg-gray-900"
            />
          </label>
        ))}
      </div>

      <button 
        onClick={generate}
        className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg transition-colors shadow-lg shadow-blue-500/30"
      >
        <RefreshCw size={20} />
        <span>Generate Password</span>
      </button>
    </div>
  );
}
