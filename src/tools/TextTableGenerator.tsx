import { useState } from 'react';
import { AlignLeft, Copy } from 'lucide-react';

export default function TextTableGenerator() {
  const [csv, setCsv] = useState('Name,Role,City\\nAlice,Engineer,NY\\nBob,Designer,SF');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!csv.trim()) return setOutput('');
    const lines = csv.split('\\n').map(l => l.trim()).filter(l => l);
    const table = lines.map(l => l.split(',').map(c => c.trim()));
    
    // Find max width per column
    const colWidths: number[] = [];
    table.forEach(row => {
      row.forEach((cell, i) => {
        colWidths[i] = Math.max(colWidths[i] || 0, cell.length);
      });
    });

    let res = '';
    const separator = '+' + colWidths.map(w => '-'.repeat(w + 2)).join('+') + '+';
    
    table.forEach((row, i) => {
      if (i === 0) res += separator + '\\n';
      res += '|' + row.map((cell, j) => ' ' + cell.padEnd(colWidths[j], ' ') + ' ').join('|') + '|\\n';
      if (i === 0 || i === table.length - 1) res += separator + '\\n';
    });

    setOutput(res);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-xl">
            <AlignLeft className="text-gray-600 dark:text-gray-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">Text ASCII Table</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Paste CSV Data</label>
            <textarea
              value={csv}
              onChange={(e) => setCsv(e.target.value)}
              className="w-full h-80 p-5 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-gray-500 outline-none font-mono text-sm resize-none whitespace-pre"
            />
            <button onClick={generate} className="w-full mt-4 py-4 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-bold transition-colors">
              Generate ASCII Table
            </button>
          </div>
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Output</label>
            <textarea
              value={output}
              readOnly
              className="w-full h-80 p-5 bg-gray-900 border-2 border-gray-800 rounded-2xl text-green-400 outline-none font-mono text-sm resize-none whitespace-pre"
            />
            {output && (
              <button onClick={() => navigator.clipboard.writeText(output)} className="absolute bottom-4 right-4 p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl shadow-sm transition-colors">
                <Copy size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
