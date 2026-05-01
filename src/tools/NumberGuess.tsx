import React, { useState, useEffect } from 'react';
import { Target, RefreshCw, Trophy, AlertCircle, Hash, Thermometer } from 'lucide-react';

export default function NumberGuess() {
  const [target, setTarget] = useState(0);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('Enter a number between 1 and 100');
  const [history, setHistory] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [status, setStatus] = useState<'idle' | 'low' | 'high' | 'win'>('idle');

  // Initialize game
  const startNewGame = () => {
    setTarget(Math.floor(Math.random() * 100) + 1);
    setGuess('');
    setMessage('New game started! Guess 1-100');
    setHistory([]);
    setGameOver(false);
    setStatus('idle');
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const checkGuess = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = parseInt(guess);

    if (isNaN(val) || val < 1 || val > 100) {
      setMessage('Please enter a valid number (1-100)');
      return;
    }

    const newHistory = [val, ...history];
    setHistory(newHistory);
    setGuess('');

    if (val === target) {
      setMessage(`CORRECT! It was ${target}! 🏆`);
      setGameOver(true);
      setStatus('win');
    } else if (val < target) {
      setMessage('Too Low! Try a higher number. 👇');
      setStatus('low');
    } else {
      setMessage('Too High! Try a lower number. 👆');
      setStatus('high');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 sm:p-8">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-8 relative overflow-hidden">
        
        {/* Header Area */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl shadow-lg transition-colors ${
              status === 'win' ? 'bg-green-500 shadow-green-500/20' : 'bg-indigo-600 shadow-indigo-500/20'
            }`}>
              {status === 'win' ? <Trophy className="text-white" size={20} /> : <Target className="text-white" size={20} />}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Guess Master</h2>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Logic Engine v1.4</p>
            </div>
          </div>
          <button 
            onClick={startNewGame}
            className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-indigo-600"
            title="Reset Game"
          >
            <RefreshCw size={20} />
          </button>
        </div>

        {/* Display Panel */}
        <div className={`mb-8 p-6 rounded-3xl border-2 transition-all duration-500 text-center ${
          status === 'win' ? 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800' :
          status === 'low' ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800' :
          status === 'high' ? 'bg-orange-50 border-orange-200 dark:bg-orange-900/10 dark:border-orange-800' :
          'bg-slate-50 border-slate-100 dark:bg-slate-950 dark:border-slate-800'
        }`}>
          <p className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight leading-relaxed">
            {message}
          </p>
        </div>

        {/* Input Area */}
        {!gameOver ? (
          <form onSubmit={checkGuess} className="space-y-4">
            <div className="relative group">
              <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input
                type="number"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="00"
                autoFocus
                className="w-full p-5 pl-14 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl dark:text-white focus:border-indigo-500 outline-none font-mono text-2xl transition-all"
              />
            </div>
            <button 
              type="submit"
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20"
            >
              Verify Guess
            </button>
          </form>
        ) : (
          <button 
            onClick={startNewGame}
            className="w-full py-5 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-green-500/20"
          >
            Play Again
          </button>
        )}

        {/* Stats & History */}
        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Thermometer size={14} className="text-slate-400" />
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Attempt History</span>
            </div>
            <span className="text-[10px] font-black text-indigo-500 uppercase">{history.length} Tries</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {history.length === 0 && (
              <p className="text-[10px] text-slate-300 italic">No guesses yet...</p>
            )}
            {history.map((h, i) => (
              <div 
                key={i} 
                className={`px-3 py-1 rounded-lg text-xs font-bold font-mono ${
                  h === target ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {h}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}