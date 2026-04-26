import { useState } from 'react';
import { UserPlus, Copy, RefreshCw } from 'lucide-react';

const ADJECTIVES = ['Shadow', 'Neon', 'Toxic', 'Happy', 'Crazy', 'Silent', 'Cosmic', 'Turbo', 'Hyper', 'Galactic', 'Mystic', 'Crystal', 'Phantom', 'Dark', 'Light', 'Cyber'];
const NOUNS = ['Ninja', 'Dragon', 'Wizard', 'Potato', 'Rider', 'Hunter', 'Wolf', 'Ghost', 'Phoenix', 'Samurai', 'Viper', 'Cyborg', 'Panda', 'Knight', 'Raven'];

export default function NicknameGenerator() {
  const [name, setName] = useState('');
  const [results, setResults] = useState<string[]>([]);

  const generate = () => {
    const newNames = [];
    for (let i = 0; i < 10; i++) {
      const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
      const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
      const num = Math.floor(Math.random() * 999);
      
      if (name && Math.random() > 0.5) {
        newNames.push(`${adj}${name}${num}`);
      } else {
        newNames.push(`${adj}${noun}${num}`);
      }
    }
    setResults(newNames);
  };

  // Generate on mount
  useState(() => generate());

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
        <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <UserPlus className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        
        <div className="max-w-md mx-auto space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your real name (optional)"
            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-purple-500 outline-none text-lg text-center font-bold"
          />
          <button onClick={generate} className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold text-lg transition-colors flex items-center justify-center shadow-lg shadow-purple-500/30">
            <RefreshCw size={20} className="mr-2" /> Generate Nicknames
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {results.map((nick, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex justify-between items-center group hover:border-purple-300 transition-colors">
              <span className="font-bold text-lg text-gray-900 dark:text-white">{nick}</span>
              <button onClick={() => navigator.clipboard.writeText(nick)} className="p-2 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors opacity-0 group-hover:opacity-100">
                <Copy size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
