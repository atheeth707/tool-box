import { useState } from 'react';
import { Dices, Copy, Check, Calendar as CalendarIcon } from 'lucide-react';

export default function RandomDateGenerator() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (!start || !end) return;
    
    // Set hours to midnight to ensure accurate day-to-day comparison
    const s = new Date(start).setHours(0, 0, 0, 0);
    const e = new Date(end).setHours(0, 0, 0, 0);
    
    if (e >= s) {
      // Calculate random time between the two dates
      const randomTime = s + Math.random() * (e - s);
      const d = new Date(randomTime);
      
      // Format to display only the date
      setResult(d.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }));
    } else {
      setResult('Error: End date must be after start date');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 text-center">
        
        {/* Header Icon */}
        <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-3 shadow-inner">
          <Dices className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
        </div>

        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">Date Shuffler</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-10 font-medium">Pick a range to generate a random day.</p>

        {/* Input Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="relative">
            <label className="block text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2 ml-1 text-left">From</label>
            <div className="relative">
              <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
              <input
                type="date" // Changed from datetime-local
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-2xl dark:text-white focus:border-indigo-500 outline-none font-bold transition-all"
              />
            </div>
          </div>
          <div className="relative">
            <label className="block text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2 ml-1 text-left">To</label>
            <div className="relative">
              <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
              <input
                type="date" // Changed from datetime-local
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-2xl dark:text-white focus:border-indigo-500 outline-none font-bold transition-all"
              />
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button 
          onClick={generate}
          disabled={!start || !end}
          className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white rounded-2xl font-black text-xl transition-all shadow-xl shadow-indigo-500/20 active:scale-[0.98] mb-10"
        >
          Shuffle Date
        </button>

        {/* Result Area */}
        {result && (
          <div className="group relative bg-slate-50 dark:bg-slate-950 p-10 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 transition-all hover:border-indigo-400/50">
            <div className={`text-2xl font-bold leading-tight ${result.startsWith('Error') ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
              {result}
            </div>
            
            {!result.startsWith('Error') && (
              <button 
                onClick={handleCopy} 
                className={`absolute -top-4 -right-4 p-4 rounded-2xl shadow-lg transition-all active:scale-90 ${
                  copied ? 'bg-green-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-400 hover:text-indigo-600'
                }`}
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}