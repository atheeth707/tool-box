import { useState } from 'react';
import { Calculator } from 'lucide-react';

export default function NumberFormatter() {
  const [num, setNum] = useState('1234567.89');
  const [locale, setLocale] = useState('en-US');
  const [currency, setCurrency] = useState('USD');

  const locales = ['en-US', 'en-IN', 'de-DE', 'fr-FR', 'ja-JP'];
  const currencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY'];

  const n = Number(num);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl">
            <Calculator className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">Number Formatter</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-3">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Raw Number</label>
            <input type="number" value={num} onChange={e => setNum(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl dark:text-white focus:border-blue-500 outline-none text-xl font-bold" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Locale</label>
            <select value={locale} onChange={e => setLocale(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl dark:text-white outline-none font-bold">
              {locales.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Currency</label>
            <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl dark:text-white outline-none font-bold">
              {currencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {!isNaN(n) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="text-xs font-bold text-gray-500 uppercase mb-2">Standard (Commas)</div>
              <div className="text-3xl font-black text-gray-900 dark:text-white">{new Intl.NumberFormat(locale).format(n)}</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/30">
              <div className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase mb-2">Currency Format</div>
              <div className="text-3xl font-black text-blue-600 dark:text-blue-400">{new Intl.NumberFormat(locale, { style: 'currency', currency }).format(n)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
