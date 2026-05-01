import React, { useState, useEffect } from 'react';
import { SmilePlus, Copy, Zap, AlertCircle } from 'lucide-react';

// Emojis with the highest compatibility rates
const EMOJIS = ['😀', '😍', '🤔', '🫠', '🤡', '👽', '🤖', '🐱', '🐶', '🦊', '💩', '👻', '🔥', '🌈', '💖', '✨', '🍕', '🥑', '🤠', '🥳', '😎', '🤮', '🤯', '🌙'];

const EmojiCombiner: React.FC = () => {
  const [left, setLeft] = useState('🐱');
  const [right, setRight] = useState('🤠');
  const [imgUrl, setImgUrl] = useState('');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [copyStatus, setCopyStatus] = useState(false);

  const getEmojiCode = (emoji: string) => {
    return Array.from(emoji)
      .map(c => c.codePointAt(0)?.toString(16))
      .filter(Boolean)
      .join('-u');
  };

  useEffect(() => {
    setStatus('loading');
    const code1 = getEmojiCode(left);
    const code2 = getEmojiCode(right);
    const sorted = [code1, code2].sort();
    
    // Attempting the most stable Gstatic path for 2026
    const url = `https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u${sorted[0]}/u${sorted[0]}_u${sorted[1]}.png`;
    setImgUrl(url);
  }, [left, right]);

  const handleCopy = () => {
    navigator.clipboard.writeText(imgUrl);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  return (
    <div className="p-4 max-w-5xl mx-auto font-sans dark:bg-slate-950 transition-colors">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg rotate-3">
          <SmilePlus className="w-8 h-8 text-black" />
        </div>
        <h1 className="text-3xl font-black dark:text-white uppercase tracking-tighter">AI Emoji Mixer</h1>
        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-2">Verified Gstatic Engine • 2026 Edition</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Selection Interface */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
              {EMOJIS.map(e => (
                <button 
                  key={`l-${e}`} 
                  onClick={() => setLeft(e)}
                  className={`text-2xl p-3 rounded-xl transition-all ${left === e ? 'bg-yellow-400 scale-110 shadow-md' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
              {EMOJIS.map(e => (
                <button 
                  key={`r-${e}`} 
                  onClick={() => setRight(e)}
                  className={`text-2xl p-3 rounded-xl transition-all ${right === e ? 'bg-orange-400 scale-110 shadow-md' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Display Panel */}
        <div className="bg-gray-50 dark:bg-black rounded-[40px] border-2 border-gray-200 dark:border-gray-800 p-10 flex flex-col items-center justify-center relative shadow-2xl min-h-[450px]">
          
          <div className="flex items-center gap-4 mb-10 z-10">
            <span className="text-4xl">{left}</span>
            <Zap size={20} className="text-yellow-500 fill-yellow-500" />
            <span className="text-4xl">{right}</span>
          </div>

          <div className="relative w-56 h-56 flex items-center justify-center">
            {status === 'loading' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            
            {status === 'error' ? (
              <div className="text-center animate-in fade-in zoom-in">
                <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                <p className="text-xs font-black dark:text-white uppercase">Combo Unavailable</p>
                <button onClick={() => {setLeft('🐱'); setRight('🤠')}} className="text-[10px] text-blue-500 font-bold uppercase mt-2 underline">Try Classic Pair</button>
              </div>
            ) : (
              <img 
                src={imgUrl} 
                alt="Mixed Emoji"
                className={`w-full h-full object-contain transition-all duration-500 ${status === 'success' ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
                onLoad={() => setStatus('success')}
                onError={() => setStatus('error')}
              />
            )}
          </div>

          <button 
            onClick={handleCopy}
            disabled={status !== 'success'}
            className="mt-10 w-full py-4 bg-gray-900 dark:bg-white dark:text-black text-white rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all disabled:opacity-20"
          >
            {copyStatus ? "Link Copied!" : "Copy Mixed Emoji"}
          </button>

          <div className="absolute top-4 right-4 flex gap-1">
             <div className={`w-2 h-2 rounded-full ${status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmojiCombiner;