import { useState } from 'react';
import { Copy, FileJson, AlertCircle } from 'lucide-react';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const format = () => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError('');
        return;
      }
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const minify = () => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex space-x-3">
          <button onClick={format} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-colors font-medium flex items-center"><FileJson size={18} className="mr-2"/> Format / Prettify</button>
          <button onClick={minify} className="px-6 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors font-medium">Minify</button>
        </div>
        <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="px-4 py-2 text-gray-500 hover:text-red-500 font-medium">Clear All</button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-200 dark:border-red-800/30 flex items-center">
          <AlertCircle size={20} className="mr-3 shrink-0" />
          <span className="font-mono text-sm">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="relative">
          <label className="absolute top-0 left-0 bg-gray-200 dark:bg-gray-700 px-4 py-1 rounded-br-xl rounded-tl-3xl text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your raw JSON here..."
            className="w-full h-[500px] p-6 pt-10 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-3xl focus:border-blue-500 outline-none font-mono text-sm dark:text-white shadow-sm resize-none"
          />
        </div>
        <div className="relative">
          <label className="absolute top-0 left-0 bg-blue-100 dark:bg-blue-900 px-4 py-1 rounded-br-xl rounded-tl-3xl text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300">Output</label>
          <textarea
            value={output}
            readOnly
            placeholder="Formatted JSON will appear here..."
            className="w-full h-[500px] p-6 pt-10 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-3xl outline-none font-mono text-sm dark:text-white shadow-sm resize-none"
          />
          {output && (
            <button onClick={() => navigator.clipboard.writeText(output)} className="absolute bottom-6 right-6 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-colors" title="Copy output">
              <Copy size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
