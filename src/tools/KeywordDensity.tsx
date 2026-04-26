import { useState } from 'react';
import { FileText } from 'lucide-react';

export default function KeywordDensity() {
  const [text, setText] = useState('');

  const getDensity = () => {
    if (!text.trim()) return [];
    
    // Clean text: lowercase, remove punctuation, split by whitespace
    const words = text.toLowerCase().replace(/[^\w\s\u00C0-\u017F]/g, '').split(/\s+/).filter(w => w.length > 0);
    const totalWords = words.length;
    if (totalWords === 0) return [];

    const counts: Record<string, number> = {};
    words.forEach(w => {
      counts[w] = (counts[w] || 0) + 1;
    });

    const sorted = Object.entries(counts)
      .map(([word, count]) => ({ word, count, percent: ((count / totalWords) * 100).toFixed(2) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    return sorted;
  };

  const results = getDensity();
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl">
            <FileText className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">Content Input</h2>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your article or text here to analyze keyword density..."
          className="flex-1 w-full min-h-[400px] p-6 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none resize-none text-lg"
        />
        <div className="mt-4 text-gray-500 dark:text-gray-400 font-medium">Total Words: {wordCount}</div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-bold dark:text-white mb-6">Top Keywords</h3>
        
        {results.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
                  <th className="pb-3 pl-2">Keyword</th>
                  <th className="pb-3 text-right">Count</th>
                  <th className="pb-3 text-right pr-2">Density</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {results.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                    <td className="py-4 pl-2 font-medium text-gray-900 dark:text-white">{item.word}</td>
                    <td className="py-4 text-right text-gray-600 dark:text-gray-300">{item.count}</td>
                    <td className="py-4 text-right pr-2">
                      <span className="inline-block bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-lg font-bold text-sm">
                        {item.percent}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
            Paste text to see analysis
          </div>
        )}
      </div>
    </div>
  );
}
