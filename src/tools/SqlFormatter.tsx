import { useState } from 'react';
import { Database, Copy } from 'lucide-react';

export default function SqlFormatter() {
  const [sql, setSql] = useState('');
  const [formatted, setFormatted] = useState('');

  const formatSql = () => {
    if (!sql.trim()) return setFormatted('');
    
    let out = sql
      .replace(/\\s+/g, ' ') // collapse spaces
      .replace(/\\s(SELECT|FROM|WHERE|INNER JOIN|LEFT JOIN|RIGHT JOIN|GROUP BY|ORDER BY|HAVING|LIMIT|INSERT INTO|VALUES|UPDATE|SET)\\s/gi, '\\n$1 ')
      .replace(/^(SELECT|FROM|WHERE|INNER JOIN|LEFT JOIN|RIGHT JOIN|GROUP BY|ORDER BY|HAVING|LIMIT|INSERT INTO|VALUES|UPDATE|SET)\\s/gi, '$1 ')
      .replace(/,\\s/g, ',\\n  ');
      
    // uppercase keywords
    const keywords = ['SELECT', 'FROM', 'WHERE', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'AND', 'OR', 'AS', 'ON'];
    keywords.forEach(kw => {
      const re = new RegExp(`\\b${kw}\\b`, 'gi');
      out = out.replace(re, kw);
    });

    setFormatted(out.trim());
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl">
            <Database className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">SQL Formatter</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Raw SQL Query</label>
            <textarea
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              placeholder="SELECT id, name FROM users WHERE active = 1"
              className="w-full h-96 p-5 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none font-mono text-sm resize-none whitespace-pre"
            />
            <button onClick={formatSql} className="w-full mt-4 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors">
              Format SQL
            </button>
          </div>
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Formatted Output</label>
            <textarea
              value={formatted}
              readOnly
              className="w-full h-96 p-5 bg-gray-900 border-2 border-gray-800 rounded-2xl text-blue-400 outline-none font-mono text-sm resize-none whitespace-pre"
            />
            {formatted && (
              <button onClick={() => navigator.clipboard.writeText(formatted)} className="absolute bottom-4 right-4 p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl shadow-sm transition-colors">
                <Copy size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
