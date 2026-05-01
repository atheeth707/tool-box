import React, { useState, useEffect } from 'react';
import { SmilePlus, Copy, Search, Sparkles } from 'lucide-react';

// A curated list of "Global" emojis that Google has mapped to almost every other emoji
const BASE_EMOJIS = ['😀', '😍', '🤔', '🫠', '🤡', '👽', '🐱', '🐶', '💩', '🔥', '💖', '🌟', '🍕', '🥑', '🤠', '🥳'];
const MODIFIERS = ['🔥', '✨', '☁️', '🌈', '❄️', '🖤', '👻', '🤖', '🐱', '🐧', '🦉', '🦄', '🍎', '🍓', '🍕', '🎈'];

const EmojiCombiner: React.FC = () => {
  const [leftEmoji, setLeftEmoji] = useState('🐱');
  const [rightEmoji, setRightEmoji] = useState('🤠');
  const [resultUrl, setResultUrl] = useState('');
  const [copyStatus, setCopyStatus] = useState(false);
  const [imgStatus, setImgStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  const getEmojiHex = (emoji: string) => {
    return Array.from(emoji)
      .map(char => char.codePointAt(0)?.toString(16))
      .filter(Boolean)
      .join('-u');
  };

  useEffect(() => {
    setImgStatus('loading');
    const hex1 = getEmojiHex(leftEmoji);
    const hex2 = getEmojiHex(rightEmoji);
    
    // Sort to match Google's storage naming convention
    const sortedHex = [hex1, hex2].sort();
    
    // Using the most stable 2026 Gstatic endpoint
    const url = `https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u${sortedHex[0]}/u${sortedHex[0]}_u${sortedHex[1]}.png`;
    setResultUrl(url);
  }, [leftEmoji, rightEmoji]);

  const handleCopy = () => {
    navigator.clipboard.writeText(resultUrl);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  return (
    <div className="p-4 max-w-5xl mx-auto font-sans dark:bg-slate-950 transition-colors">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-yellow-50 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <SmilePlus className="w-8 h-8 text-yellow-500" />
        </div>
        <h1 className="text-3xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent uppercase tracking-tighter">
          Emoji Kitchen Pro
        </h1>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-2 font-bold">
          Native Engine • All Devices Compatible
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Selectors */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-sm">
            <label className="text-[10px] font-black uppercase text-gray-400 mb-4 block tracking-widest">Base Character</label>
            <div className="grid grid-cols-8 gap-2">
              {BASE_EMOJIS.map(e => (
                <button 
                  key={`l-${e}`} 
                  onClick={() => setLeftEmoji(e)}
                  className={`text-2xl p-3 rounded-2xl transition-all ${leftEmoji === e ? 'bg-yellow-400 scale-110 shadow-lg' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-sm">
            <label className="text-[10px] font-black uppercase text-gray-400 mb-4 block tracking-widest">Effect / Modifier</label>
            <div className="grid grid-cols-8 gap-2">
              {MODIFIERS.map(e => (
                <button 
                  key={`r-${e}`} 
                  onClick={() => setRightEmoji(e)}
                  className={`text-2xl p-3 rounded-2xl transition-all ${rightEmoji === e ? 'bg-orange-400 scale-110 shadow-lg' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Display */}
        <div className="bg-gray-50 dark:bg-black rounded-[32px] border-2 border-gray-200 dark:border-gray-800 p-8 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="flex items-center gap-4 mb-10 z-10">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-sm text-3xl">{leftEmoji}</div>
            <span className="font-black text-gray-300">X</span>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-sm text-3xl">{rightEmoji}</div>
          </div>

          <div className="relative w-56 h-56 flex items-center justify-center z-10">
            {imgStatus === 'loading' && (
              <div className="absolute animate-pulse text-yellow-500"><Sparkles size={48} /></div>
            )}
            
            {imgStatus === 'error' ? (
              <div className="text-center">
                <div className="text-5xl mb-4">👻</div>
                <p className="text-[10px] font-bold text-gray-500 uppercase">Combo Hidden</p>
                <button onClick={() => {setLeftEmoji('🐱'); setRightEmoji('🤠');}} className="mt-2 text-xs text-blue-500 font-bold">Reset Tool</button>
              </div>
            ) : (
              <img 
                src={resultUrl} 
                alt="Combined" 
                className={`w-full h-full object-contain transition-all duration-500 ${imgStatus === 'loaded' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
                onLoad={() => setImgStatus('loaded')}
                onError={() => setImgStatus('error')}
              />
            )}
          </div>

          <button 
            onClick={handleCopy}
            disabled={imgStatus !== 'loaded'}
            className="mt-10 w-full py-4 bg-gray-900 dark:bg-white dark:text-black text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-20"
          >
            {copyStatus ? "Copied to Clipboard" : "Copy Image Link"}
          </button>
          
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"></div>
        </div>
      </div>
    </div>
  );
};

export default EmojiCombiner;