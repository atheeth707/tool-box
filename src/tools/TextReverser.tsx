import { useState } from 'react';
import { Copy, ArrowUpDown } from 'lucide-react';

export default function TextReverser() {
  const [text, setText] = useState('');

  const reversed = text.split('').reverse().join('');
  const reversedWords = text.split(' ').reverse().join(' ');
  const reversedWordsLetters = text.split(' ').map(w => w.split('').reverse().join('')).join(' ');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="font-semibold text-gray-700 dark:text-gray-300 ml-2">Original Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste text here..."
            className="w-full h-64 p-5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-3xl focus:border-blue-500 outline-none dark:text-white text-lg shadow-sm resize-none"
          />
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2 relative">
            <label className="font-semibold text-gray-700 dark:text-gray-300 ml-2">Reversed Characters</label>
            <textarea
              value={reversed}
              readOnly
              className="w-full h-24 p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl outline-none dark:text-white shadow-sm resize-none"
            />
            {reversed && (
              <button onClick={() => navigator.clipboard.writeText(reversed)} className="absolute bottom-4 right-4 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors">
                <Copy size={16} />
              </button>
            )}
          </div>
          
          <div className="space-y-2 relative">
            <label className="font-semibold text-gray-700 dark:text-gray-300 ml-2">Reversed Words</label>
            <textarea
              value={reversedWords}
              readOnly
              className="w-full h-24 p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl outline-none dark:text-white shadow-sm resize-none"
            />
            {reversedWords && (
              <button onClick={() => navigator.clipboard.writeText(reversedWords)} className="absolute bottom-4 right-4 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors">
                <Copy size={16} />
              </button>
            )}
          </div>
          
          <div className="space-y-2 relative">
            <label className="font-semibold text-gray-700 dark:text-gray-300 ml-2">Reversed Both</label>
            <textarea
              value={reversedWordsLetters}
              readOnly
              className="w-full h-24 p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl outline-none dark:text-white shadow-sm resize-none"
            />
            {reversedWordsLetters && (
              <button onClick={() => navigator.clipboard.writeText(reversedWordsLetters)} className="absolute bottom-4 right-4 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors">
                <Copy size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
