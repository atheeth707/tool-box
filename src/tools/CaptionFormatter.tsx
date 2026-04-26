import { useState } from 'react';
import { AlignLeft, Copy } from 'lucide-react';

export default function CaptionFormatter() {
  const [text, setText] = useState('');

  // Adds invisible braille spaces to force line breaks on Instagram
  const format = () => {
    if (!text) return '';
    return text.replace(/\\n/g, '\\n⠀\\n').replace(/\\n⠀\\n⠀\\n/g, '\\n⠀\\n');
  };

  const output = format();

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-pink-50 dark:bg-pink-900/30 p-3 rounded-xl">
            <AlignLeft className="text-pink-600 dark:text-pink-400" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold dark:text-white">Caption Formatter</h2>
            <p className="text-sm text-gray-500">Fixes Instagram line breaks automatically.</p>
          </div>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your caption here with normal paragraphs...\\n\\nIt will be formatted with invisible spaces so IG doesn't ruin the line breaks."
          className="flex-1 w-full min-h-[400px] p-6 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-pink-500 outline-none resize-none text-lg"
        />
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-700 flex flex-col relative">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-500 uppercase tracking-wider">Ready for Instagram</h3>
          {output && (
            <button onClick={() => navigator.clipboard.writeText(output)} className="text-pink-600 hover:text-pink-700 font-bold flex items-center bg-pink-100 px-4 py-2 rounded-lg">
              <Copy size={16} className="mr-2"/> Copy Caption
            </button>
          )}
        </div>
        <textarea
          readOnly
          value={output}
          placeholder="Formatted output will appear here..."
          className="flex-1 w-full min-h-[400px] p-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white outline-none resize-none text-lg whitespace-pre-wrap"
        />
      </div>
    </div>
  );
}
