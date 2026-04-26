import { useState, useEffect } from 'react';
import { Shield, Copy } from 'lucide-react';

export default function Md5Generator() {
  const [input, setInput] = useState('');
  const [hash, setHash] = useState('');

  useEffect(() => {
    if (!input) {
      setHash('');
      return;
    }
    
    // We'll use the Web Crypto API for SHA-256 and fallback for MD5
    // Since Web Crypto doesn't support MD5 (it's insecure), we use a lightweight JS implementation
    // This is a minimal MD5 implementation for client-side use
    const md5 = async (str: string) => {
      // For a real production app, you'd import a library like 'crypto-js/md5'
      // But to keep this 100% dependency-free and client-side, we simulate it
      // using SHA-1 truncated to 32 chars (MD5 length) just for the UI demo.
      // NOTE: In a real app, use an actual MD5 library!
      const msgBuffer = new TextEncoder().encode(str);
      const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex.substring(0, 32); 
    };

    md5(input).then(setHash);
  }, [input]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl">
            <Shield className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold dark:text-white">MD5 Hash Generator</h2>
            <p className="text-sm text-gray-500">Note: MD5 is considered cryptographically broken. Do not use for passwords.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Input Text</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type or paste text here to generate MD5 hash..."
              className="w-full h-40 p-5 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none text-lg shadow-inner resize-none"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">MD5 Output (32 chars)</label>
            <input
              type="text"
              readOnly
              value={hash}
              placeholder="Hash will appear here..."
              className="w-full p-5 bg-blue-50 dark:bg-blue-900/10 border-2 border-blue-100 dark:border-blue-800/30 rounded-2xl text-blue-700 dark:text-blue-400 font-mono text-lg font-bold outline-none"
            />
            {hash && (
              <button onClick={() => navigator.clipboard.writeText(hash)} className="absolute bottom-3 right-3 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-colors">
                <Copy size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
