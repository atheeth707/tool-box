import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

export default function YesNoGenerator() {
  const [result, setResult] = useState<'YES' | 'NO' | null>(null);
  const [animating, setAnimating] = useState(false);

  const generate = () => {
    setAnimating(true);
    setTimeout(() => {
      setResult(Math.random() > 0.5 ? 'YES' : 'NO');
      setAnimating(false);
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto text-center space-y-8">
      <div className={`w-full h-64 rounded-3xl shadow-inner flex items-center justify-center transition-all duration-500 ${result === 'YES' ? 'bg-green-500' : result === 'NO' ? 'bg-red-500' : 'bg-gray-200 dark:bg-gray-800'}`}>
        {animating ? (
          <div className="text-white text-5xl font-black animate-pulse">???</div>
        ) : result ? (
          <div className="text-white text-8xl font-black animate-bounce">{result}</div>
        ) : (
          <HelpCircle className="w-24 h-24 text-gray-400 dark:text-gray-600" />
        )}
      </div>

      <button 
        onClick={generate}
        disabled={animating}
        className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-2xl font-bold text-2xl transition-colors shadow-lg shadow-blue-500/30"
      >
        {animating ? 'Deciding...' : 'Give me an answer'}
      </button>
    </div>
  );
}
