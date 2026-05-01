import React, { useState } from 'react';
import { ChefHat, Copy, RefreshCw } from 'lucide-react';

const EmojiChef: React.FC = () => {
  const [emoji1, setEmoji1] = useState('🐱');
  const [emoji2, setEmoji2] = useState('🍕');
  const [copyStatus, setCopyStatus] = useState(false);

  // Using a stable open-source API that maps directly to Google's assets
  const mixUrl = `https://emojik.vercel.app/s/${emoji1}_${emoji2}?size=256`;

  const handleCopy = () => {
    navigator.clipboard.writeText(mixUrl);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-slate-100 dark:border-slate-800 font-sans">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-2xl">
          <ChefHat className="text-orange-500 w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight dark:text-white">Emoji Kitchen</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Gstatic Embed</p>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-black rounded-[24px] p-8 flex flex-col items-center justify-center min-h-[320px] relative overflow-hidden">
        {/* Ingredient Display */}
        <div className="flex items-center gap-4 mb-8 z-10">
          <span className="text-3xl animate-bounce">{emoji1}</span>
          <div className="w-8 h-[2px] bg-slate-200 dark:bg-slate-800" />
          <span className="text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>{emoji2}</span>
        </div>

        {/* The Resulting Mix */}
        <div className="relative group">
          <div className="absolute inset-0 bg-orange-400/20 rounded-full blur-2xl group-hover:bg-orange-400/40 transition-all" />
          <img 
            src={mixUrl} 
            alt="Emoji Mix" 
            className="w-40 h-40 object-contain relative z-10 transition-transform group-hover:scale-110 duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://fonts.gstatic.com/s/e/notoemoji/latest/1f635_200d_1f4ab/512.webp";
            }}
          />
        </div>

        <button 
          onClick={handleCopy}
          className="mt-8 px-6 py-3 bg-slate-900 dark:bg-white dark:text-black text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 z-10"
        >
          {copyStatus ? "Link Cooked!" : "Copy Image URL"}
        </button>
      </div>

      <div className="mt-6 grid grid-cols-6 gap-2">
         {['😀','🫠','👽','🐱','🐶','🦊','👻','🔥','💖','✨','🍕','🥑'].map(e => (
           <button 
            key={e}
            onClick={() => setEmoji1(e)}
            className={`p-2 text-xl rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${emoji1 === e ? 'bg-orange-100 dark:bg-orange-900/50 scale-110 shadow-sm' : ''}`}
           >
             {e}
           </button>
         ))}
      </div>
    </div>
  );
};

export default EmojiChef;