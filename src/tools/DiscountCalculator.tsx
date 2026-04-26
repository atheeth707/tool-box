import { useState } from 'react';
import { Tag } from 'lucide-react';

export default function DiscountCalculator() {
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');

  const origPrice = Number(price);
  const discPercent = Number(discount);
  
  const savings = (origPrice * discPercent) / 100;
  const finalPrice = origPrice - savings;

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
        <Tag className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      </div>

      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Original Price ($)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none text-xl font-bold text-center"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Discount (%)</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none text-xl font-bold text-center"
            placeholder="20"
          />
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-500 dark:text-gray-400 font-medium">Original Price</span>
          <span className="text-gray-900 dark:text-white font-semibold">${origPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-green-600 dark:text-green-400">
          <span className="font-medium">Savings</span>
          <span className="font-semibold">-${savings.toFixed(2)}</span>
        </div>
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900 dark:text-white">Final Price</span>
          <span className="text-3xl font-black text-blue-600 dark:text-blue-400">${finalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
