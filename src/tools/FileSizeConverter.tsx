import { useState } from 'react';
import { HardDrive } from 'lucide-react';

export default function FileSizeConverter() {
  const [bytes, setBytes] = useState('1048576'); // 1MB

  const b = Number(bytes) || 0;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-xl">
            <HardDrive className="text-indigo-600 dark:text-indigo-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">File Size Converter</h2>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Input Size in Bytes</label>
          <input type="number" value={bytes} onChange={e => setBytes(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl dark:text-white focus:border-indigo-500 outline-none text-xl font-bold" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Kilobytes (KB)', val: b / 1024 },
            { label: 'Megabytes (MB)', val: b / (1024 ** 2) },
            { label: 'Gigabytes (GB)', val: b / (1024 ** 3) },
            { label: 'Terabytes (TB)', val: b / (1024 ** 4) },
          ].map(unit => (
            <div key={unit.label} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 text-center">
              <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 mb-1">{unit.val < 0.0001 ? '0' : unit.val.toFixed(4)}</div>
              <div className="text-xs font-bold text-gray-500 uppercase">{unit.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
