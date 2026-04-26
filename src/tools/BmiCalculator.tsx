import { useState } from 'react';
import { Activity } from 'lucide-react';

export default function BmiCalculator() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const h = Number(height) / 100; // cm to m
  const w = Number(weight);
  
  let bmi = 0;
  if (h > 0 && w > 0) {
    bmi = w / (h * h);
  }

  let category = '';
  let color = '';
  
  if (bmi > 0) {
    if (bmi < 18.5) { category = 'Underweight'; color = 'text-blue-500'; }
    else if (bmi < 24.9) { category = 'Normal weight'; color = 'text-green-500'; }
    else if (bmi < 29.9) { category = 'Overweight'; color = 'text-amber-500'; }
    else { category = 'Obese'; color = 'text-red-500'; }
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
        <Activity className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      </div>

      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Height (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none text-xl font-bold text-center"
            placeholder="175"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Weight (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none text-xl font-bold text-center"
            placeholder="70"
          />
        </div>
      </div>

      {bmi > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 text-center space-y-2">
          <div className="text-gray-500 dark:text-gray-400 font-medium">Your BMI is</div>
          <div className={`text-5xl font-black ${color}`}>{bmi.toFixed(1)}</div>
          <div className={`text-lg font-bold ${color}`}>{category}</div>
        </div>
      )}
    </div>
  );
}
