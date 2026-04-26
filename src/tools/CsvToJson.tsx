import { useState } from 'react';
import { FileDown, Download, Copy } from 'lucide-react';

export default function CsvToJson() {
  const [csv, setCsv] = useState('name,age,city\\nAlice,28,New York\\nBob,34,London');
  const [json, setJson] = useState('');

  const convert = () => {
    if (!csv.trim()) return setJson('');
    try {
      const lines = csv.split('\\n').map(l => l.trim()).filter(l => l);
      if (lines.length < 2) return setJson('[]');
      
      const headers = lines[0].split(',').map(h => h.trim());
      const result = [];

      for (let i = 1; i < lines.length; i++) {
        const obj: any = {};
        const currentLine = lines[i].split(',');
        
        for (let j = 0; j < headers.length; j++) {
          let val = currentLine[j]?.trim();
          // Convert to number if possible
          if (val && !isNaN(Number(val))) val = Number(val) as any;
          obj[headers[j]] = val;
        }
        result.push(obj);
      }
      setJson(JSON.stringify(result, null, 2));
    } catch (e) {
      setJson('Error parsing CSV');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl">
            <FileDown className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">CSV to JSON</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Paste CSV Data</label>
            <textarea
              value={csv}
              onChange={(e) => setCsv(e.target.value)}
              className="w-full h-[400px] p-5 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none font-mono text-sm resize-none whitespace-pre"
            />
            <button onClick={convert} className="w-full mt-4 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors">
              Convert to JSON
            </button>
          </div>
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">JSON Output</label>
            <textarea
              value={json}
              readOnly
              className="w-full h-[400px] p-5 bg-gray-900 border-2 border-gray-800 rounded-2xl text-green-400 outline-none font-mono text-sm resize-none whitespace-pre"
            />
            {json && !json.startsWith('Error') && (
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <button onClick={() => navigator.clipboard.writeText(json)} className="p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl shadow-sm transition-colors">
                  <Copy size={20} />
                </button>
                <a 
                  href={`data:application/json;charset=utf-8,${encodeURIComponent(json)}`} 
                  download="data.json"
                  className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-colors"
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
