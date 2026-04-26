import { useState, useEffect } from 'react';
import { ShieldCheck, Copy } from 'lucide-react';

export default function Sha256Generator() {
  const [input, setInput] = useState('');
  const [hash, setHash] = useState('');

  useEffect(() => {
    if (!input) {
      setHash('');
      return;
    }

    const generateHash = async () => {
      const msgBuffer = new TextEncoder().encode(input);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setHash(hashHex);
    };

    generateHash();
  }, [input]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-xl">
            <ShieldCheck className="text-emerald-600 dark:text-emerald-400" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold dark:text-white">SHA-256 Hash Generator</h2>
            <p className="text-sm text-gray-500">Secure, one-way cryptographic hash function.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Input Text</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type or paste text here to generate SHA-256 hash..."
              className="w-full h-40 p-5 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-emerald-500 outline-none text-lg shadow-inner resize-none"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">SHA-256 Output (64 chars)</label>
            <textarea
              readOnly
              value={hash}
              placeholder="Hash will appear here..."
              className="w-full h-24 p-5 bg-emerald-50 dark:bg-emerald-900/10 border-2 border-emerald-100 dark:border-emerald-800/30 rounded-2xl text-emerald-700 dark:text-emerald-400 font-mono text-lg font-bold outline-none resize-none break-all"
            />
            {hash && (
              <button onClick={() => navigator.clipboard.writeText(hash)} className="absolute bottom-4 right-4 p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition-colors">
                <Copy size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
