import { useState } from 'react';
import { Landmark } from 'lucide-react';

export default function LoanCalculator() {
  const [price, setPrice] = useState('250000');
  const [downPayment, setDownPayment] = useState('50000');
  const [rate, setRate] = useState('5.5');
  const [years, setYears] = useState('30');

  const pPrice = Number(price) || 0;
  const dPayment = Number(downPayment) || 0;
  const r = Number(rate) || 0;
  const y = Number(years) || 0;

  const principal = Math.max(0, pPrice - dPayment);
  const months = y * 12;
  const monthlyRate = r / 12 / 100;

  let emi = 0;
  let totalPayment = 0;
  let totalInterest = 0;

  if (principal > 0 && r > 0 && months > 0) {
    emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    totalPayment = emi * months;
    totalInterest = totalPayment - principal;
  }

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-7 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-xl">
            <Landmark className="text-emerald-600 dark:text-emerald-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">Loan Calculator</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Total Property/Car Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-emerald-500 outline-none text-lg font-bold"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Down Payment</label>
            <input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-emerald-500 outline-none text-lg font-bold"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Interest Rate (%)</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-emerald-500 outline-none text-lg font-bold"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Loan Term (Years)</label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-emerald-500 outline-none text-lg font-bold"
            />
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 bg-gray-50 dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center space-y-6">
        <div className="text-center p-6 bg-emerald-600 rounded-2xl text-white shadow-lg shadow-emerald-500/20">
          <div className="text-sm font-medium opacity-80 uppercase tracking-wider mb-1">Monthly Payment</div>
          <div className="text-4xl font-black">${emi.toFixed(2)}</div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3">
            <span className="text-gray-600 dark:text-gray-400 font-medium">Loan Amount</span>
            <span className="font-bold dark:text-white">${principal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center p-3 border-t border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400 font-medium">Total Interest</span>
            <span className="font-bold text-amber-500">${totalInterest.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center p-3 border-t border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400 font-medium">Total Loan Paid</span>
            <span className="font-bold dark:text-white">${totalPayment.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center p-3 border-t border-gray-200 dark:border-gray-700">
            <span className="text-gray-900 dark:text-white font-bold">Total Cost (incl. Down)</span>
            <span className="font-black text-emerald-600 dark:text-emerald-400">${(totalPayment + dPayment).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
