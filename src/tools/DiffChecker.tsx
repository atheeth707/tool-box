import { useState } from 'react';
import { SplitSquareHorizontal } from 'lucide-react';

export default function DiffChecker() {
  const [text1, setText1] = useState('Apple\nBanana\nCherry\nDate');
  const [text2, setText2] = useState('Apple\nBlueberry\nCherry\nDragonfruit');

  const lines1 = text1.split('\n');
  const lines2 = text2.split('\n');
  const maxLines = Math.max(lines1.length, lines2.length);

  const diff = [];
  for (let i = 0; i < maxLines; i++) {
    const l1 = lines1[i];
    const l2 = lines2[i];
    
    if (l1 === l2) {
      diff.push({ type: 'equal', text: l1, line: i + 1 });
    } else {
      if (l1 !== undefined) diff.push({ type: 'removed', text: l1, line: i + 1 });
      if (l2 !== undefined) diff.push({ type: 'added', text: l2, line: i + 1 });
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-xl">
            <SplitSquareHorizontal className="text-indigo-600 dark:text-indigo-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">Text Diff Checker</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Original Text</label>
            <textarea
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              className="w-full h-64 p-5 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-indigo-500 outline-none font-mono text-sm resize-none whitespace-pre"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Modified Text</label>
            <textarea
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              className="w-full h-64 p-5 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-indigo-500 outline-none font-mono text-sm resize-none whitespace-pre"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Differences</h3>
          <div className="bg-gray-900 rounded-2xl overflow-hidden font-mono text-sm text-gray-300">
            {diff.map((d, i) => (
              <div 
                key={i} 
                className={`flex px-4 py-1 ${
                  d.type === 'added' ? 'bg-green-900/40 text-green-400' : 
                  d.type === 'removed' ? 'bg-red-900/40 text-red-400' : 
                  'hover:bg-gray-800'
                }`}
              >
                <div className="w-12 text-gray-600 select-none border-r border-gray-700 mr-4 text-right pr-4">
                  {d.type === 'added' ? '+' : d.type === 'removed' ? '-' : d.line}
                </div>
                <div className="whitespace-pre-wrap break-all">{d.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
