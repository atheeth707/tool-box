import { useState } from 'react';

export default function WordCounter() {
  const [text, setText] = useState('');

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const lines = text ? text.split('\n').length : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Words', value: words },
          { label: 'Characters', value: chars },
          { label: 'No Spaces', value: charsNoSpaces },
          { label: 'Lines', value: lines },
        ].map(stat => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 text-center shadow-sm">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{stat.value.toLocaleString()}</div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>
      
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here to begin counting..."
          className="w-full h-96 p-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-3xl focus:ring-0 focus:border-blue-500 resize-y dark:text-white text-lg shadow-sm outline-none transition-colors"
        />
        {text && (
          <button 
            onClick={() => setText('')}
            className="absolute bottom-6 right-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-medium transition-colors"
          >
            Clear Text
          </button>
        )}
      </div>
    </div>
  );
}
