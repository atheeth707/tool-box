import { useState } from 'react';
import { CreditCard } from 'lucide-react';

export default function EmiCalculator() {
  const [principal, setPrincipal] = useState('100000');
  const [rate, setRate] = useState('10');
  const [tenure, setTenure] = useState('1');
  const [tenureType, setTenureType] = useState<'years' | 'months'>('years');

  const p = Number(principal) || 0;
  const r = Number(rate) || 0;
  const t = Number(tenure) || 0;

  const months = tenureType === 'years' ? t * 12 : t;
  const monthlyRate = r / 12 / 100;

  let emi = 0;
  let totalPayment = 0;
  let totalInterest = 0;

  if (p > 0 && r > 0 && months > 0) {
    emi = (p * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    totalPayment = emi * months;
    totalInterest = totalPayment - p;
  } else if (p > 0 && months > 0 && r === 0) {
    emi = p / months;
    totalPayment = p;
  }

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl">
            <CreditCard className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">EMI Calculator</h2>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Loan Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="w-full p-4 pl-8 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none text-xl font-bold"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Interest Rate (% P.A.)</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none text-xl font-bold"
          />
        </div>

        <div>
          <div className="flex justify-between items-end mb-2 ml-1">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Loan Tenure</label>
            <div className="flex bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
              <button onClick={() => setTenureType('years')} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${tenureType === 'years' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}>Years</button>
              <button onClick={() => setTenureType('months')} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${tenureType === 'months' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}>Months</button>
            </div>
          </div>
          <input
            type="number"
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none text-xl font-bold"
          />
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center space-y-8">
        <div className="text-center">
          <div className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Monthly EMI</div>
          <div className="text-5xl font-black text-blue-600 dark:text-blue-400">${emi.toFixed(2)}</div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400 font-medium">Principal Amount</span>
            <span className="font-bold dark:text-white">${p.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400 font-medium">Total Interest</span>
            <span className="font-bold text-amber-500">${totalInterest.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30">
            <span className="text-blue-800 dark:text-blue-300 font-bold">Total Payment</span>
            <span className="font-black text-blue-600 dark:text-blue-400">${totalPayment.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
