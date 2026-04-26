import { useState } from 'react';
import { FileUp, Download, Copy } from 'lucide-react';

export default function JsonToCsv() {
  const [json, setJson] = useState('[\n  {\n    "name": "Alice",\n    "age": 28,\n    "city": "New York"\n  },\n  {\n    "name": "Bob",\n    "age": 34,\n    "city": "London"\n  }\n]');
  const [csv, setCsv] = useState('');

  const convert = () => {
    if (!json.trim()) return setCsv('');
    try {
      const data = JSON.parse(json);
      if (!Array.isArray(data) || data.length === 0) return setCsv('Error: Must be a non-empty array of objects');
      
      const headers = Object.keys(data[0]);
      let result = headers.join(',') + '\\n';

      for (const row of data) {
        result += headers.map(h => {
          let val = row[h];
          if (val === null || val === undefined) val = '';
          if (typeof val === 'string' && val.includes(',')) val = `"${val}"`;
          return val;
        }).join(',') + '\\n';
      }
      
      setCsv(result.trim());
    } catch (e) {
      setCsv('Error parsing JSON. Ensure it is a valid array of objects.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-xl">
            <FileUp className="text-emerald-600 dark:text-emerald-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">JSON to CSV</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Paste JSON Array</label>
            <textarea
              value={json}
              onChange={(e) => setJson(e.target.value)}
              className="w-full h-[400px] p-5 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-emerald-500 outline-none font-mono text-sm resize-none whitespace-pre"
            />
            <button onClick={convert} className="w-full mt-4 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors">
              Convert to CSV
            </button>
          </div>
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">CSV Output</label>
            <textarea
              value={csv}
              readOnly
              className="w-full h-[400px] p-5 bg-gray-900 border-2 border-gray-800 rounded-2xl text-emerald-400 outline-none font-mono text-sm resize-none whitespace-pre"
            />
            {csv && !csv.startsWith('Error') && (
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <button onClick={() => navigator.clipboard.writeText(csv)} className="p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl shadow-sm transition-colors">
                  <Copy size={20} />
                </button>
                <a 
                  href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`} 
                  download="data.csv"
                  className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition-colors"
                >
                  <Download size={20} />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
