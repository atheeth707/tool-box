import React, { useState, useEffect } from 'react';
import { SmilePlus, Copy, RotateCcw } from 'lucide-react';

// Expanded list of emojis known to have many combinations
const EMOJIS = [
  '😀', '🤣', '🤡', '🤥', '🫠', '👽', '🤖', '🐱', 
  '🐶', '🦁', '🐢', '🦄', '💩', '👻', '🔥', '☁️', 
  '🌈', '💖', '✨', '🍎', '🥑', '🍕', '🤠', '🥳'
];

const EmojiCombiner: React.FC = () => {
  const [leftEmoji, setLeftEmoji] = useState('🐱');
  const [rightEmoji, setRightEmoji] = useState('🤠');
  const [resultUrl, setResultUrl] = useState('');
  const [copyStatus, setCopyStatus] = useState(false);
  const [hasError, setHasError] = useState(false);

  const getEmojiHex = (emoji: string) => {
    // Standardize hex codes for Gstatic format
    return Array.from(emoji)
      .map(char => char.codePointAt(0)?.toString(16))
      .filter(Boolean)
      .join('-u');
  };

  useEffect(() => {
    setHasError(false);
    const hex1 = getEmojiHex(leftEmoji);
    const hex2 = getEmojiHex(rightEmoji);
    
    // Google's backend often requires the emoji codes to be sorted
    // to match their file storage naming convention
    const sortedHex = [hex1, hex2].sort();
    
    const url = `https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u${sortedHex[0]}/u${sortedHex[0]}_u${sortedHex[1]}.png`;
    setResultUrl(url);
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
          All Browsers • No Iframe • Instant Load
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white dark:bg-gray-900 p-8 rounded-[32px] border border-gray-200 dark:border-gray-800 shadow-xl">
        
        {/* Selection Area */}
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-bold uppercase text-gray-400 mb-2 block tracking-widest">Base Emoji</label>
            <div className="grid grid-cols-6 gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl">
              {EMOJIS.map(e => (
                <button 
                  key={`left-${e}`} 
                  onClick={() => setLeftEmoji(e)}
                  className={`text-2xl p-2 rounded-xl transition-all ${leftEmoji === e ? 'bg-yellow-400 shadow-lg scale-110' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-gray-400 mb-2 block tracking-widest">Modifier</label>
            <div className="grid grid-cols-6 gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl">
              {EMOJIS.map(e => (
                <button 
                  key={`right-${e}`} 
                  onClick={() => setRightEmoji(e)}
                  className={`text-2xl p-2 rounded-xl transition-all ${rightEmoji === e ? 'bg-orange-400 shadow-lg scale-110' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result Area */}
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-black rounded-[24px] border-2 border-dashed border-gray-200 dark:border-gray-800 min-h-[400px]">
          <div className="flex items-center gap-6 mb-8">
            <span className="text-4xl animate-bounce" style={{ animationDelay: '0s' }}>{leftEmoji}</span>
            <span className="text-xl font-black text-gray-300">+</span>
            <span className="text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>{rightEmoji}</span>
          </div>

          <div className="relative h-48 w-48 flex items-center justify-center">
            {!hasError ? (
              <img 
                src={resultUrl} 
                alt="Emoji Mix" 
                className="w-48 h-48 object-contain transition-transform hover:scale-110 duration-300"
                onError={() => setHasError(true)}
              />
            ) : (
              <div className="text-center">
                <div className="text-4xl mb-2">😵‍💫</div>
                <p className="text-[10px] font-bold text-gray-500 uppercase">Combo not found</p>
                <button 
                  onClick={() => {setLeftEmoji('😀'); setRightEmoji('🔥');}}
                  className="mt-2 text-[10px] text-yellow-500 underline uppercase"
                >
                  Try a classic mix
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={handleCopy}
            disabled={hasError}
            className="mt-10 flex items-center gap-2 px-8 py-3 bg-gray-900 dark:bg-white dark:text-black text-white rounded-full font-black text-xs uppercase transition-all active:scale-95 disabled:opacity-30"
          >
            {copyStatus ? "Copied Link!" : "Copy Image Link"}
            <Copy size={14} />
          </button>
        </div>
      </div>

      <p className="mt-8 text-[9px] text-center text-gray-500 font-bold uppercase tracking-[0.2em]">
        Browser-Safe • Gstatic Direct Assets • 2026 Edition
      </p>
    </div>
  );
};

export default EmojiCombiner;