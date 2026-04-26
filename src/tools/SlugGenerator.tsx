import { useState } from 'react';
import { Copy } from 'lucide-react';

export default function SlugGenerator() {
  const [text, setText] = useState('');

  const slug = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-2">Enter Title or Text</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. 10 Best Ways to Make Money Online in 2024!"
          className="w-full p-5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none text-xl shadow-sm"
        />
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-700">
        <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">Generated URL Slug</label>
        <div className="flex items-center space-x-4">
          <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 font-mono text-lg text-blue-600 dark:text-blue-400 overflow-x-auto whitespace-nowrap">
            {slug || 'your-url-slug-will-appear-here'}
          </div>
          <button 
            onClick={() => navigator.clipboard.writeText(slug)}
            className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-sm shrink-0"
          >
            <Copy size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
