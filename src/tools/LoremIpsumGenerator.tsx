import { useState } from 'react';
import { Copy, RefreshCw } from 'lucide-react';

const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

export default function LoremIpsumGenerator() {
  const [paragraphs, setParagraphs] = useState(3);
  const [output, setOutput] = useState('');

  const generate = () => {
    const paras = [];
    for (let i = 0; i < paragraphs; i++) {
      // Slight randomization of length
      const words = LOREM.split(' ');
      const length = Math.floor(Math.random() * 20) + 30;
      let p = '';
      for (let j = 0; j < length; j++) {
        p += words[j % words.length] + ' ';
      }
      p = p.trim() + '.';
      paras.push(i === 0 ? LOREM : p.charAt(0).toUpperCase() + p.slice(1));
    }
    setOutput(paras.join('\n\n'));
  };

  // Generate on mount
  useState(() => generate());

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <label className="font-semibold text-gray-700 dark:text-gray-300">Paragraphs:</label>
          <input 
            type="number" 
            min="1" max="50" 
            value={paragraphs} 
            onChange={(e) => setParagraphs(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-24 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-500 dark:text-white text-center"
          />
        </div>
        <button onClick={generate} className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center transition-colors shadow-sm">
          <RefreshCw size={18} className="mr-2" /> Generate Text
        </button>
      </div>

      <div className="relative">
        <textarea
          value={output}
          readOnly
          className="w-full h-[500px] p-6 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-3xl outline-none dark:text-white text-lg shadow-sm resize-none whitespace-pre-wrap"
        />
        {output && (
          <button onClick={() => navigator.clipboard.writeText(output)} className="absolute bottom-6 right-6 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg transition-colors flex items-center font-bold">
            <Copy size={20} className="mr-2" /> Copy All
          </button>
        )}
      </div>
    </div>
  );
}
