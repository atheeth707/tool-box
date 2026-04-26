import { useState } from 'react';
import { FileMinus, Copy } from 'lucide-react';

export default function DuplicateRowRemover() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [removed, setRemoved] = useState(0);

  const process = () => {
    if (!input.trim()) return setOutput('');
    const rows = input.split('\\n');
    const unique = [...new Set(rows.map(r => r.trim()))].filter(r => r);
    setRemoved(rows.length - unique.length);
    setOutput(unique.join('\\n'));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-red-50 dark:bg-red-900/30 p-3 rounded-xl">
              <FileMinus className="text-red-600 dark:text-red-400" size={24} />
            </div>
            <h2 className="text-2xl font-bold dark:text-white">Duplicate Row Remover</h2>
          </div>
          {removed > 0 && (
            <div className="px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 font-bold rounded-xl">
              Removed {removed} duplicates
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Paste Data (Rows)</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-96 p-5 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-red-500 outline-none font-mono text-sm resize-none whitespace-pre"
            />
            <button onClick={process} className="w-full mt-4 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors">
              Remove Duplicates
            </button>
          </div>
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Unique Rows</label>
            <textarea
              value={output}
              readOnly
              className="w-full h-96 p-5 bg-gray-900 border-2 border-gray-800 rounded-2xl text-green-400 outline-none font-mono text-sm resize-none whitespace-pre"
            />
            {output && (
              <button onClick={() => navigator.clipboard.writeText(output)} className="absolute bottom-4 right-4 p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl shadow-sm transition-colors">
                <Copy size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
