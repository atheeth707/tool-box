import { useState } from 'react';
import { Dices } from 'lucide-react';

export default function DiceRoller() {
  const [diceCount, setDiceCount] = useState(1);
  const [results, setResults] = useState<number[]>([]);
  const [rolling, setRolling] = useState(false);

  const roll = () => {
    setRolling(true);
    setTimeout(() => {
      const newResults = Array.from({ length: diceCount }).map(() => Math.floor(Math.random() * 6) + 1);
      setResults(newResults);
      setRolling(false);
    }, 500);
  };

  const getDiceDots = (num: number) => {
    const dots = [];
    for(let i=0; i<num; i++) dots.push(<div key={i} className="w-3 h-3 bg-gray-800 dark:bg-gray-900 rounded-full"></div>);
    return dots;
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
      <div className="flex justify-center items-center space-x-4 mb-8">
        <label className="font-semibold text-gray-700 dark:text-gray-300">Number of Dice:</label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5, 6].map(num => (
            <button 
              key={num}
              onClick={() => setDiceCount(num)}
              className={`w-10 h-10 rounded-xl font-bold transition-colors ${diceCount === num ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[200px] flex flex-wrap justify-center gap-6 mb-8">
        {results.length > 0 ? results.map((res, i) => (
          <div key={i} className={`w-24 h-24 bg-white dark:bg-gray-200 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-300 flex flex-wrap items-center justify-center p-4 gap-1 ${rolling ? 'animate-bounce' : ''}`}>
            {getDiceDots(res)}
          </div>
        )) : (
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400">
            <Dices size={32} />
          </div>
        )}
      </div>

      <button 
        onClick={roll}
        disabled={rolling}
        className="px-12 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-2xl font-bold text-xl transition-colors shadow-lg shadow-blue-500/30"
      >
        {rolling ? 'Rolling...' : 'Roll Dice'}
      </button>

      {results.length > 0 && !rolling && (
        <div className="mt-6 text-lg font-bold text-gray-600 dark:text-gray-400">
          Total: <span className="text-blue-600 dark:text-blue-400">{results.reduce((a,b)=>a+b,0)}</span>
        </div>
      )}
    </div>
  );
}
