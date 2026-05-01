import React, { useState, useEffect } from 'react';
import { SmilePlus, Copy, Search } from 'lucide-react';

// This is a curated list of popular emojis that have "Kitchen" combinations
const POPULAR_EMOJIS = ['😀', '🤣', '😍', '🤔', '🫠', '🤡', '👽', '🐱', '🐶', '💩', '🔥', '💖', '🌈', '🍕', '🥑'];

const EmojiCombiner: React.FC = () => {
  const [leftEmoji, setLeftEmoji] = useState('🐱');
  const [rightEmoji, setRightEmoji] = useState('🤠');
  const [resultUrl, setResultUrl] = useState('');
  const [copyStatus, setCopyStatus] = useState(false);

  // Function to generate the Google Gstatic URL for the combination
  const getCombinedEmojiUrl = (e1: string, e2: string) => {
    const code1 = e1.codePointAt(0)?.toString(16);
    const code2 = e2.codePointAt(0)?.toString(16);
    // Google's naming convention for these assets
    return `https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u${code1}/u${code1}_u${code2}.png`;
  };

  useEffect(() => {
    setResultUrl(getCombinedEmojiUrl(leftEmoji, rightEmoji));
  }, [leftEmoji, rightEmoji]);

  const handleCopy = () => {
    navigator.clipboard.writeText(resultUrl);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto font-sans dark:bg-slate-950 transition-colors">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-yellow-50 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <SmilePlus className="w-8 h-8 text-yellow-500" />
        </div>
        <h1 className="text-2xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent uppercase tracking-tight">
          Native Emoji Kitchen
        </h1>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1 font-bold">
          No Redirects • No Blocks • All Devices
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white dark:bg-gray-900 p-8 rounded-[32px] border border-gray-200 dark:border-gray-800 shadow-xl">
        
        {/* Selection Area */}
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-bold uppercase text-gray-400 mb-2 block">First Emoji</label>
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl">
              {POPULAR_EMOJIS.map(e => (
                <button 
                  key={e} 
                  onClick={() => setLeftEmoji(e)}
                  className={`text-2xl p-2 rounded-xl transition-all ${leftEmoji === e ? 'bg-yellow-400 scale-110' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-gray-400 mb-2 block">Second Emoji</label>
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl">
              {POPULAR_EMOJIS.map(e => (
                <button 
                  key={e} 
                  onClick={() => setRightEmoji(e)}
                  className={`text-2xl p-2 rounded-xl transition-all ${rightEmoji === e ? 'bg-orange-400 scale-110' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result Area */}
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-black rounded-[24px] border-2 border-dashed border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl">{leftEmoji}</span>
            <span className="text-xl font-bold text-gray-400">+</span>
            <span className="text-4xl">{rightEmoji}</span>
          </div>

          <div className="relative group">
            <img 
              src={resultUrl} 
              alt="Result" 
              className="w-48 h-48 object-contain transition-transform group-hover:scale-105"
              onError={(e) => {
                // Fallback if specific combo doesn't exist
                (e.target as HTMLImageElement).src = 'https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u1f600/u1f600_u1f600.png';
              }}
            />
          </div>

          <button 
            onClick={handleCopy}
            className="mt-8 flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white dark:text-black text-white rounded-full font-bold text-sm transition-all active:scale-95"
          >
            {copyStatus ? "Link Copied!" : "Copy Image Link"}
            <Copy size={16} />
          </button>
        </div>
      </div>

      <p className="mt-6 text-[9px] text-center text-gray-400 font-bold uppercase tracking-widest">
        Powered by Gstatic Asset Library • 100% Client Side
      </p>
    </div>
  );
};

export default EmojiCombiner;