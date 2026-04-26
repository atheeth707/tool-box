import { useState } from 'react';
import { Receipt } from 'lucide-react';

export default function GstCalculator() {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('18');
  const [mode, setMode] = useState<'add' | 'remove'>('add');

  const numAmount = Number(amount) || 0;
  const numRate = Number(rate) || 0;

  let netAmount = 0;
  let gstAmount = 0;
  let totalAmount = 0;

  if (mode === 'add') {
    netAmount = numAmount;
    gstAmount = (numAmount * numRate) / 100;
    totalAmount = netAmount + gstAmount;
  } else {
    totalAmount = numAmount;
    netAmount = numAmount / (1 + numRate / 100);
    gstAmount = totalAmount - netAmount;
  }

  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;

  const rates = ['0', '5', '12', '18', '28'];

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
        <Receipt className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      </div>

      <div className="flex justify-center space-x-4 mb-8">
        <button 
          onClick={() => setMode('add')}
          className={`px-6 py-3 rounded-xl font-bold transition-colors ${mode === 'add' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
        >
          Add GST (+ Tax)
        </button>
        <button 
          onClick={() => setMode('remove')}
          className={`px-6 py-3 rounded-xl font-bold transition-colors ${mode === 'remove' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
        >
          Remove GST (- Tax)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">
            {mode === 'add' ? 'Net Amount (Excl. GST)' : 'Total Amount (Incl. GST)'}
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none text-xl font-bold"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">GST Rate (%)</label>
          <div className="flex space-x-2">
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none text-xl font-bold"
            />
          </div>
          <div className="flex gap-2 mt-3">
            {rates.map(r => (
              <button key={r} onClick={() => setRate(r)} className={`px-3 py-1 rounded-lg text-sm font-medium ${rate === r ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                {r}%
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4">
        <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
          <span>Net Amount</span>
          <span className="font-semibold">₹{netAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-blue-600 dark:text-blue-400">
          <span>GST Amount ({rate}%)</span>
          <span className="font-semibold">+ ₹{gstAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-gray-500 dark:text-gray-500 text-sm pl-4 border-l-2 border-gray-200 dark:border-gray-700">
          <span>CGST ({numRate/2}%)</span>
          <span>₹{cgst.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-gray-500 dark:text-gray-500 text-sm pl-4 border-l-2 border-gray-200 dark:border-gray-700">
          <span>SGST ({numRate/2}%)</span>
          <span>₹{sgst.toFixed(2)}</span>
        </div>
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900 dark:text-white">Total Amount</span>
          <span className="text-3xl font-black text-blue-600 dark:text-blue-400">₹{totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
