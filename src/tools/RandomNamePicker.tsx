import { useState } from 'react';
import { Users, Play } from 'lucide-react';

export default function RandomNamePicker() {
  const [names, setNames] = useState('');
  const [winner, setWinner] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);

  const pick = () => {
    const nameList = names.split('\n').filter(n => n.trim() !== '');
    if (nameList.length < 2) return alert('Please enter at least 2 names.');
    
    setPicking(true);
    setWinner(null);

    let ticks = 0;
    const interval = setInterval(() => {
      setWinner(nameList[Math.floor(Math.random() * nameList.length)]);
      ticks++;
      if (ticks > 20) {
        clearInterval(interval);
        setPicking(false);
      }
    }, 100);
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl">
            <Users className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">Enter Names</h2>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Enter one name per line.</p>
        
        <textarea
          value={names}
          onChange={(e) => setNames(e.target.value)}
          placeholder="Alice&#10;Bob&#10;Charlie..."
          className="flex-1 w-full min-h-[300px] p-5 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none resize-none text-lg mb-6"
        />
        
        <button 
          onClick={pick} 
          disabled={picking}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-2xl font-bold text-lg transition-colors flex items-center justify-center shadow-lg shadow-blue-500/30"
        >
          <Play size={20} className="mr-2" /> {picking ? 'Picking...' : 'Pick a Winner'}
        </button>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center min-h-[400px]">
        {winner ? (
          <div className={`transition-all duration-300 ${picking ? 'scale-90 opacity-70' : 'scale-110 opacity-100'}`}>
            <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
              {picking ? 'Selecting...' : 'The Winner Is'}
            </div>
            <div className={`text-4xl md:text-6xl font-black break-all px-4 ${picking ? 'text-gray-800 dark:text-gray-200' : 'text-blue-600 dark:text-blue-400'}`}>
              {winner}
            </div>
            {!picking && (
              <div className="mt-8 animate-bounce">
                🎉🎊🎉
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-400 dark:text-gray-500 font-medium">
            Add names and click "Pick a Winner"
          </div>
        )}
      </div>
    </div>
  );
}
