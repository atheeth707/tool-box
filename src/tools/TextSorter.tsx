import { useState } from 'react';
import { Copy, ArrowDownAZ, ArrowUpZA } from 'lucide-react';

export default function TextSorter() {
  const [text, setText] = useState('');
  const [output, setOutput] = useState('');

  const sortLines = (asc: boolean) => {
    if (!text.trim()) return setOutput('');
    const lines = text.split('\n').filter(l => l.trim() !== '');
    lines.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
    if (!asc) lines.reverse();
    setOutput(lines.join('\n'));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-center space-x-4 mb-6">
        <button onClick={() => sortLines(true)} className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-colors font-bold">
          <ArrowDownAZ size={20} className="mr-2" /> Sort A-Z
        </button>
        <button onClick={() => sortLines(false)} className="flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-xl shadow-sm transition-colors font-bold">
          <ArrowUpZA size={20} className="mr-2" /> Sort Z-A
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="font-semibold text-gray-700 dark:text-gray-300 ml-2">Input List (one item per line)</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Apple&#10;Zebra&#10;Banana..."
            className="w-full h-96 p-5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-3xl focus:border-blue-500 outline-none dark:text-white text-lg shadow-sm resize-none whitespace-pre"
          />
        </div>
        
        <div className="space-y-2 relative">
          <label className="font-semibold text-gray-700 dark:text-gray-300 ml-2">Sorted Result</label>
          <textarea
            value={output}
            readOnly
            className="w-full h-96 p-5 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-3xl outline-none dark:text-white text-lg shadow-sm resize-none whitespace-pre"
          />
          {output && (
            <button onClick={() => navigator.clipboard.writeText(output)} className="absolute bottom-6 right-6 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-colors">
              <Copy size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
