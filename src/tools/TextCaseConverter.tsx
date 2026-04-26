import { useState } from 'react';
import { Copy } from 'lucide-react';

export default function TextCaseConverter() {
  const [text, setText] = useState('');

  const copy = () => {
    if (text) navigator.clipboard.writeText(text);
  };

  const toSentenceCase = () => {
    setText(text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase()));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap gap-3">
        <button onClick={() => setText(text.toUpperCase())} className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">UPPERCASE</button>
        <button onClick={() => setText(text.toLowerCase())} className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">lowercase</button>
        <button onClick={toSentenceCase} className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">Sentence case</button>
        <button onClick={() => setText(text.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))} className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">Capitalize Each Word</button>
        <button onClick={() => setText(text.split('').map(c => Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase()).join(''))} className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">aLtErNaTiNg cAsE</button>
      </div>
      
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          className="w-full h-80 p-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-3xl focus:ring-0 focus:border-blue-500 resize-y dark:text-white text-lg shadow-sm outline-none transition-colors"
        />
        <button onClick={copy} className="absolute bottom-6 right-6 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-colors" title="Copy to clipboard">
          <Copy size={20} />
        </button>
      </div>
      <p className="text-center text-sm text-gray-500">Processed locally in your browser. No data is sent to our servers.</p>
    </div>
  );
}
