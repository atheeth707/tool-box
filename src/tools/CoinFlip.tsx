import { useState } from 'react';

export default function CoinFlip() {
  const [result, setResult] = useState<'Heads' | 'Tails' | null>(null);
  const [flipping, setFlipping] = useState(false);

  const flip = () => {
    if (flipping) return;
    setFlipping(true);
    setResult(null);
    
    setTimeout(() => {
      setResult(Math.random() > 0.5 ? 'Heads' : 'Tails');
      setFlipping(false);
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto text-center space-y-12 py-10">
      <div className="relative w-48 h-48 mx-auto perspective-1000">
        <div className={`w-full h-full rounded-full border-8 border-amber-400 bg-amber-300 shadow-2xl flex items-center justify-center transition-all ${flipping ? 'animate-[spin-y_2s_ease-in-out]' : ''} ${result === 'Tails' ? 'rotate-y-180' : ''}`} style={{ transformStyle: 'preserve-3d' }}>
          {/* Heads Side */}
          <div className="absolute w-full h-full rounded-full bg-amber-300 flex items-center justify-center backface-hidden">
            <span className="text-5xl font-black text-amber-700">H</span>
          </div>
          {/* Tails Side */}
          <div className="absolute w-full h-full rounded-full bg-amber-400 flex items-center justify-center backface-hidden rotate-y-180">
            <span className="text-5xl font-black text-amber-800">T</span>
          </div>
        </div>
      </div>

      <div className="h-16">
        {result && !flipping && (
          <div className="text-4xl font-black text-gray-900 dark:text-white animate-fade-in">
            It's {result}!
          </div>
        )}
      </div>

      <button 
        onClick={flip}
        disabled={flipping}
        className="w-full py-5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded-3xl font-black text-2xl transition-colors shadow-lg shadow-amber-500/40"
      >
        {flipping ? 'Flipping...' : 'Flip Coin'}
      </button>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        @keyframes spin-y {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(1800deg); }
        }
        .animate-fade-in { animation: fadeIn 0.5s ease-in; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
