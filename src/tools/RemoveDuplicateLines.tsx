import { useState } from 'react';
import { Copy, Trash2 } from 'lucide-react';

export default function RemoveDuplicateLines() {
  const [text, setText] = useState('');
  const [removedCount, setRemovedCount] = useState(0);

  const process = () => {
    const lines = text.split('\n');
    const unique = [...new Set(lines)];
    setRemovedCount(lines.length - unique.length);
    setText(unique.join('\n'));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="text-gray-600 dark:text-gray-300 font-medium">
          Lines removed: <span className="text-blue-600 dark:text-blue-400 font-bold">{removedCount}</span>
        </div>
        <div className="space-x-3">
          <button onClick={() => { setText(''); setRemovedCount(0); }} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors font-medium">Clear</button>
          <button onClick={process} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-colors font-medium">Remove Duplicates</button>
        </div>
      </div>
      
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your list here (one item per line)..."
          className="w-full h-96 p-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-3xl focus:ring-0 focus:border-blue-500 resize-y dark:text-white text-lg shadow-sm outline-none transition-colors whitespace-pre"
        />
        <button onClick={() => navigator.clipboard.writeText(text)} className="absolute bottom-6 right-6 p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl shadow-sm transition-colors" title="Copy to clipboard">
          <Copy size={20} />
        </button>
      </div>
    </div>
  );
}
