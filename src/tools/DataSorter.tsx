import { useState } from 'react';
import { ArrowDownAZ, Upload, Download } from 'lucide-react';

export default function DataSorter() {
  const [csv, setCsv] = useState('');
  const [sortCol, setSortCol] = useState(0);
  const [asc, setAsc] = useState(true);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setCsv(event.target?.result as string);
    reader.readAsText(file);
  };

  let headers: string[] = [];
  let rows: string[][] = [];

  if (csv.trim()) {
    const lines = csv.split('\\n').map(l => l.trim()).filter(l => l);
    if (lines.length > 0) {
      headers = lines[0].split(',');
      for (let i = 1; i < lines.length; i++) {
        rows.push(lines[i].split(','));
      }
    }
  }

  const sortedRows = [...rows].sort((a, b) => {
    const valA = a[sortCol] || '';
    const valB = b[sortCol] || '';
    const numA = Number(valA);
    const numB = Number(valB);
    
    if (!isNaN(numA) && !isNaN(numB)) {
      return asc ? numA - numB : numB - numA;
    }
    return asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  const downloadSorted = () => {
    const out = [headers.join(','), ...sortedRows.map(r => r.join(','))].join('\\n');
    const link = document.createElement('a');
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(out)}`;
    link.download = 'sorted.csv';
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-cyan-50 dark:bg-cyan-900/30 p-3 rounded-xl">
              <ArrowDownAZ className="text-cyan-600 dark:text-cyan-400" size={24} />
            </div>
            <h2 className="text-2xl font-bold dark:text-white">CSV Data Sorter</h2>
          </div>
          
          <label className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors cursor-pointer shadow-sm">
            <Upload size={18} className="mr-2" /> Upload CSV
            <input type="file" className="hidden" accept=".csv" onChange={handleUpload} />
          </label>
        </div>

        {!csv ? (
          <div className="h-64 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl flex items-center justify-center text-gray-400 dark:text-gray-500 font-medium">
            Upload a CSV file to sort its contents
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
              <span className="font-bold text-gray-700 dark:text-gray-300">Sort by:</span>
              <select value={sortCol} onChange={(e) => setSortCol(Number(e.target.value))} className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none dark:text-white font-bold">
                {headers.map((h, i) => <option key={i} value={i}>{h}</option>)}
              </select>
              <select value={asc ? 'asc' : 'desc'} onChange={(e) => setAsc(e.target.value === 'asc')} className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none dark:text-white font-bold">
                <option value="asc">Ascending (A-Z, 0-9)</option>
                <option value="desc">Descending (Z-A, 9-0)</option>
              </select>
              <div className="flex-1"></div>
              <button onClick={downloadSorted} className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors">
                <Download size={16} className="mr-2" /> Download
              </button>
            </div>

            <div className="overflow-x-auto border-2 border-gray-200 dark:border-gray-700 rounded-2xl max-h-[500px]">
              <table className="w-full border-collapse bg-white dark:bg-gray-900 text-sm">
                <thead className="sticky top-0 bg-gray-100 dark:bg-gray-800 border-b-2 border-gray-200 dark:border-gray-700">
                  <tr>
                    {headers.map((h, i) => (
                      <th key={i} className="p-4 text-left font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {sortedRows.map((row, r) => (
                    <tr key={r} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      {row.map((cell, c) => (
                        <td key={c} className="p-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
