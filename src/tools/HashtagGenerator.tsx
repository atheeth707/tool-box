import { useState } from 'react';
import { Hash, Copy } from 'lucide-react';

export default function HashtagGenerator() {
  const [keyword, setKeyword] = useState('');

  const prefixes = ['#', '#best', '#top', '#daily', '#viral', '#trending', '#love', '#learn', '#pro', '#master'];
  const suffixes = ['tips', 'hacks', 'guide', 'tutorial', 'life', 'style', 'goals', 'vibes', 'community', 'world'];

  const generate = () => {
    if (!keyword) return [];
    const clean = keyword.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    if (!clean) return [];

    const tags = new Set<string>();
    tags.add(`#${clean}`);
    
    prefixes.forEach(p => tags.add(`${p}${clean}`));
    suffixes.forEach(s => tags.add(`#${clean}${s}`));
    
    // Add some random combo tags
    for(let i=0; i<5; i++) {
      const p = prefixes[Math.floor(Math.random() * prefixes.length)].replace('#', '');
      const s = suffixes[Math.floor(Math.random() * suffixes.length)];
      tags.add(`#${p}${clean}${s}`);
    }

    return Array.from(tags);
  };

  const tags = generate();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Hash className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold dark:text-white mb-2">Hashtag Generator</h2>
        <p className="text-gray-500 mb-8">Type a keyword to instantly generate a block of related hashtags for Instagram/TikTok.</p>

        <div className="max-w-md mx-auto">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter a keyword (e.g. fitness, coding)"
            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none text-lg text-center font-bold"
          />
        </div>
      </div>

      {tags.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-700 relative">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-500 uppercase tracking-wider">Generated Tags ({tags.length})</h3>
            <button onClick={() => navigator.clipboard.writeText(tags.join(' '))} className="text-blue-600 hover:text-blue-700 font-bold flex items-center bg-blue-100 px-4 py-2 rounded-lg">
              <Copy size={16} className="mr-2"/> Copy All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((t, i) => (
              <span key={i} className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-blue-600 dark:text-blue-400 font-medium shadow-sm">
                {t}
              </span>
            ))}
          </div>
          <div className="mt-6 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-mono text-sm text-gray-600 dark:text-gray-400 break-all">
            {tags.join(' ')}
          </div>
        </div>
      )}
    </div>
  );
}
