import { useState, useEffect } from 'react';
import { UserPlus, Copy, RefreshCw, Hash, Shield, Sparkles } from 'lucide-react';

// Gaming & Insta Symbols
const DECOR = ['×', '々', '么', '亗', '⚡', '🔥', '💎', '☬', '👑', '『', '』', 'ツ', '彡', '父', '๛'];

// Font Style Transformers
const transformStyles = (text: string) => [
  text.toUpperCase(),
  text.toLowerCase(),
  text.split('').join(' '), // S p a c e d
  text.replace(/[a-e]/gi, '×'), // Symbol replacement
  text.replace(/s/gi, '5').replace(/e/gi, '3').replace(/a/gi, '4').replace(/o/gi, '0'), // L33t
];

const ADJECTIVES = ['Shadow', 'Neon', 'Toxic', 'Happy', 'Crazy', 'Silent', 'Cosmic', 'Turbo', 'Hyper', 'Galactic', 'Mystic', 'Crystal', 'Phantom', 'Dark', 'Light', 'Cyber', 'Vicious', 'Immortal'];
const NOUNS = ['Ninja', 'Dragon', 'Wizard', 'Potato', 'Rider', 'Hunter', 'Wolf', 'Ghost', 'Phoenix', 'Samurai', 'Viper', 'Cyborg', 'Panda', 'Knight', 'Raven', 'Slayer', 'Beast'];

export default function NicknameGenerator() {
  const [name, setName] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generate = () => {
    const newNames = [];
    for (let i = 0; i < 12; i++) {
      const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
      const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
      const symbolStart = DECOR[Math.floor(Math.random() * DECOR.length)];
      const symbolEnd = DECOR[Math.floor(Math.random() * DECOR.length)];
      const num = Math.floor(Math.random() * 99);
      
      let base = name && Math.random() > 0.4 ? name : `${adj}${noun}`;
      
      // Apply random font style
      const styles = transformStyles(base);
      base = styles[Math.floor(Math.random() * styles.length)];

      // Construct final username
      const finalNick = `${symbolStart} ${base}${num} ${symbolEnd}`;
      newNames.push(finalNick);
    }
    setResults(newNames);
  };

  useEffect(() => {
    generate();
  }, []);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8 font-sans">
      {/* Header & Input Card */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Shield size={120} className="text-purple-500" />
        </div>

        <div className="relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/30 rounded-full border border-purple-100 dark:border-purple-800/50 mb-2">
            <Sparkles size={16} className="text-purple-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-700 dark:text-purple-300">Gaming & Insta Identity</span>
          </div>
          
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Username Studio</h1>
          
          <div className="max-w-md mx-auto space-y-4">
            <div className="relative group">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={20} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seed Name (e.g. Alex)"
                className="w-full p-5 pl-12 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-3xl dark:text-white focus:border-purple-500 outline-none text-xl font-bold transition-all"
              />
            </div>
            
            <button 
              onClick={generate} 
              className="w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-3xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-purple-500/20 flex items-center justify-center group"
            >
              <RefreshCw size={20} className="mr-3 group-hover:rotate-180 transition-transform duration-500" /> 
              Roll New Styles
            </button>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((nick, i) => (
          <div 
            key={i} 
            onClick={() => copyToClipboard(nick, i)}
            className="group cursor-pointer relative bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-300 flex flex-col items-center justify-center text-center space-y-3"
          >
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Copy size={16} className="text-purple-500" />
            </div>
            
            <span className="text-xl font-black text-slate-800 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors break-all px-2">
              {nick}
            </span>

            {copiedIndex === i ? (
              <span className="text-[10px] font-black uppercase text-green-500 animate-bounce">Copied to Clipboard!</span>
            ) : (
              <span className="text-[10px] font-black uppercase text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">Click to Copy</span>
            )}
          </div>
        ))}
      </div>

      <div className="text-center pb-12">
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Supports Free Fire, PUBG, Instagram, and Discord</p>
      </div>
    </div>
  );
}