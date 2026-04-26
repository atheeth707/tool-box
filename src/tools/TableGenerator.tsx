import { useState } from 'react';
import { Table, Plus, Trash2, Download } from 'lucide-react';

export default function TableGenerator() {
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(4);
  const [data, setData] = useState<string[][]>(Array(4).fill(Array(3).fill('')));

  const handleCellChange = (r: number, c: number, val: string) => {
    const newData = data.map((row, i) => i === r ? row.map((cell, j) => j === c ? val : cell) : row);
    setData(newData);
  };

  const addRow = () => {
    setData([...data, Array(cols).fill('')]);
    setRows(r => r + 1);
  };

  const addCol = () => {
    setData(data.map(row => [...row, '']));
    setCols(c => c + 1);
  };

  const downloadCsv = () => {
    const csv = data.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
    const link = document.createElement('a');
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    link.download = 'table.csv';
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl">
              <Table className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <h2 className="text-2xl font-bold dark:text-white">Table Generator</h2>
          </div>
          <div className="flex space-x-3">
            <button onClick={downloadCsv} className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors">
              <Download size={18} className="mr-2" /> Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto border-2 border-gray-200 dark:border-gray-700 rounded-2xl">
          <table className="w-full border-collapse bg-white dark:bg-gray-900">
            <tbody>
              {data.map((row, r) => (
                <tr key={r} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
                  {row.map((cell, c) => (
                    <td key={c} className="border-r border-gray-200 dark:border-gray-700 last:border-0 p-0">
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) => handleCellChange(r, c, e.target.value)}
                        className={`w-full p-4 bg-transparent outline-none dark:text-white ${r === 0 ? 'font-bold bg-gray-50 dark:bg-gray-800' : ''}`}
                        placeholder={r === 0 ? `Header ${c + 1}` : `Row ${r}, Col ${c + 1}`}
                      />
                    </td>
                  ))}
                  <td className="w-12 p-0 bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
                    <button onClick={() => {
                      if (rows <= 1) return;
                      setData(data.filter((_, i) => i !== r));
                      setRows(r => r - 1);
                    }} className="w-full h-full flex justify-center items-center text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex space-x-4 mt-6">
          <button onClick={addRow} className="flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold transition-colors">
            <Plus size={18} className="mr-2" /> Add Row
          </button>
          <button onClick={addCol} className="flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold transition-colors">
            <Plus size={18} className="mr-2" /> Add Column
          </button>
        </div>
      </div>
    </div>
  );
}
