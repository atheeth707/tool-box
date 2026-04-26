import { useState } from 'react';
import { Key, Copy, RefreshCw } from 'lucide-react';

export default function TokenGenerator() {
  const [token, setToken] = useState('');
  const [format, setFormat] = useState<'hex' | 'base64' | 'url-safe'>('hex');
  const [bytes, setBytes] = useState(32);

  const generate = () => {
    const array = new Uint8Array(bytes);
    crypto.getRandomValues(array);

    if (format === 'hex') {
      setToken(Array.from(array).map(b => b.toString(16).padStart(2, '0')).join(''));
    } else if (format === 'base64') {
      const binString = Array.from(array, x => String.fromCharCode(x)).join('');
      setToken(btoa(binString));
    } else if (format === 'url-safe') {
      const binString = Array.from(array, x => String.fromCharCode(x)).join('');
      setToken(btoa(binString).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''));
    }
  };

  // Generate on mount
  useState(() => generate());

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-8">
      <div className="flex items-center justify-center mb-8">
        <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-full">
          <Key className="w-10 h-10 text-amber-600 dark:text-amber-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Length (Bytes of Entropy)</label>
          <select value={bytes} onChange={(e) => setBytes(Number(e.target.value))} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-amber-500 outline-none font-bold">
            <option value={16}>16 Bytes (128-bit)</option>
            <option value={32}>32 Bytes (256-bit)</option>
            <option value={64}>64 Bytes (512-bit)</option>
            <option value={128}>128 Bytes (1024-bit)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Output Format</label>
          <select value={format} onChange={(e) => setFormat(e.target.value as any)} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-amber-500 outline-none font-bold">
            <option value="hex">Hexadecimal</option>
            <option value="base64">Base64</option>
            <option value="url-safe">Base64 URL-Safe</option>
          </select>
        </div>
      </div>

      <div className="relative">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Generated API Token / Secret</label>
        <textarea
          readOnly
          value={token}
          className="w-full h-32 p-5 bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-100 dark:border-amber-800/30 rounded-2xl text-amber-700 dark:text-amber-400 font-mono text-lg font-bold outline-none resize-none break-all"
        />
        <button onClick={() => navigator.clipboard.writeText(token)} className="absolute bottom-4 right-4 p-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-sm transition-colors">
          <Copy size={20} />
        </button>
      </div>

      <button onClick={generate} className="w-full py-4 bg-gray-900 hover:bg-black dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-2xl font-bold text-lg transition-colors flex items-center justify-center">
        <RefreshCw size={20} className="mr-2" /> Generate New Token
      </button>
    </div>
  );
}
