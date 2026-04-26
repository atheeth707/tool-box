import { useState } from 'react';
import { ArrowRightLeft } from 'lucide-react';

const UNITS = {
  length: {
    meters: 1,
    kilometers: 0.001,
    centimeters: 100,
    millimeters: 1000,
    miles: 0.000621371,
    yards: 1.09361,
    feet: 3.28084,
    inches: 39.3701
  },
  weight: {
    kilograms: 1,
    grams: 1000,
    milligrams: 1000000,
    pounds: 2.20462,
    ounces: 35.274
  },
  temperature: {
    celsius: 'C',
    fahrenheit: 'F',
    kelvin: 'K'
  }
};

export default function UnitConverter() {
  const [category, setCategory] = useState<'length'|'weight'|'temperature'>('length');
  const [from, setFrom] = useState('meters');
  const [to, setTo] = useState('feet');
  const [value, setValue] = useState('1');

  const handleCategoryChange = (e: any) => {
    const cat = e.target.value;
    setCategory(cat);
    const keys = Object.keys(UNITS[cat as keyof typeof UNITS]);
    setFrom(keys[0]);
    setTo(keys[1]);
  };

  let result = '';
  if (value && !isNaN(Number(value))) {
    const numVal = Number(value);
    if (category === 'temperature') {
      let c = 0;
      // Convert to Celsius first
      if (from === 'celsius') c = numVal;
      else if (from === 'fahrenheit') c = (numVal - 32) * 5/9;
      else if (from === 'kelvin') c = numVal - 273.15;
      
      // Convert from Celsius to target
      let out = 0;
      if (to === 'celsius') out = c;
      else if (to === 'fahrenheit') out = (c * 9/5) + 32;
      else if (to === 'kelvin') out = c + 273.15;
      
      result = out.toLocaleString(undefined, { maximumFractionDigits: 4 });
    } else {
      const baseValue = numVal / (UNITS[category] as any)[from];
      result = (baseValue * (UNITS[category] as any)[to]).toLocaleString(undefined, { maximumFractionDigits: 6 });
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="mb-10 text-center">
        <select 
          value={category} 
          onChange={handleCategoryChange}
          className="w-full md:w-auto px-8 py-3 bg-gray-100 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 rounded-2xl dark:text-white outline-none capitalize text-xl font-bold text-center appearance-none cursor-pointer"
        >
          <option value="length">📏 Length</option>
          <option value="weight">⚖️ Weight</option>
          <option value="temperature">🌡️ Temperature</option>
        </select>
      </div>

      <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-6">
        <div className="flex-1 w-full bg-gray-50 dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-700">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-transparent text-4xl font-black dark:text-white outline-none mb-4"
            placeholder="0"
          />
          <select 
            value={from} 
            onChange={(e) => setFrom(e.target.value)}
            className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl dark:text-white outline-none capitalize font-medium cursor-pointer"
          >
            {Object.keys(UNITS[category]).map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        
        <div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-full text-blue-600 dark:text-blue-400 shadow-sm z-10 -my-4 md:my-0 md:-mx-4 border-4 border-white dark:border-gray-800">
          <ArrowRightLeft size={28} className="md:rotate-0 rotate-90" />
        </div>

        <div className="flex-1 w-full bg-blue-50 dark:bg-gray-900 p-6 rounded-3xl border border-blue-100 dark:border-gray-700">
          <input
            type="text"
            readOnly
            value={result}
            className="w-full bg-transparent text-4xl font-black text-blue-600 dark:text-blue-400 outline-none mb-4"
            placeholder="0"
          />
          <select 
            value={to} 
            onChange={(e) => setTo(e.target.value)}
            className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl dark:text-white outline-none capitalize font-medium cursor-pointer"
          >
            {Object.keys(UNITS[category]).map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
