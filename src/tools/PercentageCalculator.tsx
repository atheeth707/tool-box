import { useState } from 'react';
import { Percent } from 'lucide-react';

export default function PercentageCalculator() {
  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');
  const [val3, setVal3] = useState('');
  const [val4, setVal4] = useState('');
  const [val5, setVal5] = useState('');
  const [val6, setVal6] = useState('');

  const calc1 = (Number(val1) / 100) * Number(val2);
  const calc2 = (Number(val3) / Number(val4)) * 100;
  const calc3 = ((Number(val6) - Number(val5)) / Math.abs(Number(val5))) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* What is X% of Y? */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-6 dark:text-white flex items-center"><Percent className="mr-2 text-blue-500" size={20}/> What is X% of Y?</h3>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <span className="font-medium text-gray-600 dark:text-gray-300">What is</span>
          <input type="number" value={val1} onChange={e=>setVal1(e.target.value)} className="w-full md:w-32 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-500 dark:text-white text-center" placeholder="X"/>
          <span className="font-medium text-gray-600 dark:text-gray-300">% of</span>
          <input type="number" value={val2} onChange={e=>setVal2(e.target.value)} className="w-full md:w-32 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-500 dark:text-white text-center" placeholder="Y"/>
          <span className="font-bold text-gray-400 dark:text-gray-500">=</span>
          <div className="w-full md:w-48 p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold rounded-xl text-center border border-blue-100 dark:border-blue-800/50">
            {val1 && val2 ? isNaN(calc1) ? 'Error' : calc1.toLocaleString(undefined, {maximumFractionDigits: 4}) : '?'}
          </div>
        </div>
      </div>

      {/* X is what % of Y? */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-6 dark:text-white flex items-center"><Percent className="mr-2 text-green-500" size={20}/> X is what % of Y?</h3>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <input type="number" value={val3} onChange={e=>setVal3(e.target.value)} className="w-full md:w-32 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-green-500 dark:text-white text-center" placeholder="X"/>
          <span className="font-medium text-gray-600 dark:text-gray-300">is what % of</span>
          <input type="number" value={val4} onChange={e=>setVal4(e.target.value)} className="w-full md:w-32 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-green-500 dark:text-white text-center" placeholder="Y"/>
          <span className="font-bold text-gray-400 dark:text-gray-500">=</span>
          <div className="w-full md:w-48 p-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-bold rounded-xl text-center border border-green-100 dark:border-green-800/50">
            {val3 && val4 ? isNaN(calc2) || !isFinite(calc2) ? 'Error' : calc2.toLocaleString(undefined, {maximumFractionDigits: 4}) + '%' : '?'}
          </div>
        </div>
      </div>

      {/* Percentage Increase/Decrease */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-6 dark:text-white flex items-center"><Percent className="mr-2 text-purple-500" size={20}/> Percentage Increase/Decrease</h3>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <span className="font-medium text-gray-600 dark:text-gray-300">From</span>
          <input type="number" value={val5} onChange={e=>setVal5(e.target.value)} className="w-full md:w-32 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-purple-500 dark:text-white text-center" placeholder="A"/>
          <span className="font-medium text-gray-600 dark:text-gray-300">to</span>
          <input type="number" value={val6} onChange={e=>setVal6(e.target.value)} className="w-full md:w-32 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-purple-500 dark:text-white text-center" placeholder="B"/>
          <span className="font-bold text-gray-400 dark:text-gray-500">=</span>
          <div className="w-full md:w-48 p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-bold rounded-xl text-center border border-purple-100 dark:border-purple-800/50">
            {val5 && val6 ? isNaN(calc3) || !isFinite(calc3) ? 'Error' : (calc3 > 0 ? '+' : '') + calc3.toLocaleString(undefined, {maximumFractionDigits: 4}) + '%' : '?'}
          </div>
        </div>
      </div>
    </div>
  );
}
