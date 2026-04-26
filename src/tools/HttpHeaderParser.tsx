import { useState } from 'react';
import { Server, LayoutList } from 'lucide-react';

export default function HttpHeaderParser() {
  const [input, setInput] = useState('HTTP/2 200 OK\\ndate: Mon, 01 Jan 2024 12:00:00 GMT\\ncontent-type: text/html; charset=utf-8\\ncache-control: private, max-age=0\\nserver: cloudflare');

  const parseHeaders = () => {
    if (!input.trim()) return [];
    const lines = input.split('\\n');
    return lines.map(l => {
      const idx = l.indexOf(':');
      if (idx > -1) {
        return { key: l.slice(0, idx).trim(), val: l.slice(idx + 1).trim() };
      }
      return { key: 'Status/Info', val: l.trim() }; // For HTTP/1.1 200 OK lines
    }).filter(h => h.val !== '');
  };

  const headers = parseHeaders();

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl">
            <Server className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">Raw HTTP Headers</h2>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste raw HTTP request or response headers here..."
          className="flex-1 w-full min-h-[400px] p-6 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none resize-none font-mono text-sm whitespace-pre"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-xl">
            <LayoutList className="text-green-600 dark:text-green-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">Parsed Output</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto max-h-[400px] pr-2">
          {headers.length > 0 ? (
            <div className="space-y-3">
              {headers.map((h, i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">{h.key}</div>
                  <div className="font-mono text-sm text-gray-900 dark:text-gray-200 break-all">{h.val}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
              Paste headers to see parsed output
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
