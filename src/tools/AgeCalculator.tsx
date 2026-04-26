import { useState } from 'react';
import { Calendar } from 'lucide-react';

export default function AgeCalculator() {
  const [dob, setDob] = useState('');
  const [age, setAge] = useState<{ years: number, months: number, days: number } | null>(null);

  const calculate = () => {
    if (!dob) return;
    const birthDate = new Date(dob);
    const today = new Date();
    
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    if (years < 0) {
      setAge(null);
      alert("Birth date cannot be in the future!");
      return;
    }

    setAge({ years, months, days });
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
      <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
        <Calendar className="w-10 h-10 text-blue-600 dark:text-blue-400" />
      </div>
      
      <div className="space-y-6 mb-8">
        <div className="text-left">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Select Date of Birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none text-lg"
          />
        </div>
        <button 
          onClick={calculate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg transition-colors shadow-lg shadow-blue-500/30"
        >
          Calculate Exact Age
        </button>
      </div>

      {age && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-3xl border border-blue-100 dark:border-blue-800/30">
          <div className="text-6xl font-black text-blue-600 dark:text-blue-400 mb-2 tracking-tighter">{age.years}</div>
          <div className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-4">Years Old</div>
          <div className="text-gray-600 dark:text-gray-400 font-medium">
            {age.months} months and {age.days} days
          </div>
        </div>
      )}
    </div>
  );
}
