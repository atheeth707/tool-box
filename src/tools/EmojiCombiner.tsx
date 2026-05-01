import React, { useState, useEffect } from 'react';
import { SmilePlus, Copy, Zap, Info } from 'lucide-react';

const EMOJIS = ['😀', '😍', '🤔', '🫠', '🤡', '👽', '🤖', '🐱', '🐶', '🦊', '💩', '👻', '🔥', '🌈', '💖', '✨', '🍕', '🥑', '🤠', '🥳', '😎', '🤮', '🤯', '🌙'];

const EmojiCombiner: React.FC = () => {
  const [left, setLeft] = useState('🐱');
  const [right, setRight] = useState('🤠');
  const [isNative, setIsNative] = useState(false); // True if using Google's official image
  const [copyStatus, setCopyStatus] = useState(false);

  // Helper to get hex for Google URL
  const getHex = (emoji: string) => {
    return Array.from(emoji).map(c => c.codePointAt(0)?.toString(16)).filter(Boolean).join('-u');
  };

  const hex1 = getHex(left);
  const hex2 = getHex(right);
  const sorted = [hex1, hex2].sort();
  const googleUrl = `https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u${sorted[0]}/u${sorted[0]}_u${sorted[1]}.png`;

  return (
    <div className="p-4 max-w-5xl mx-auto font-sans dark:bg-slate-950">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg rotate-3">
          <SmilePlus className="w-8 h-8 text-black" />
        </div>
        <h1 className="text-3xl font-black dark:text-white uppercase tracking-tighter">True Emoji Mixer</h1>
        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-2">Hybrid Engine: AI Assets + Dynamic Fusing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-[24px] border border-gray-100 dark:border-gray-800">
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
              {EMOJIS.map(e => (
                <button 
                  key={e} 
                  onClick={() => setLeft(e)}
                  className={`text-2xl p-3 rounded-xl transition-all ${left === e ? 'bg-yellow-400 scale-110 shadow-md' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-[24px] border border-gray-100 dark:border-gray-800">
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
              {EMOJIS.map(e => (
                <button 
                  key={e} 
                  onClick={() => setRight(e)}
                  className={`text-2xl p-3 rounded-xl transition-all ${right === e ? 'bg-orange-400 scale-110 shadow-md' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-black rounded-[40px] border-2 border-gray-200 dark:border-gray-800 p-10 flex flex-col items-center justify-center relative shadow-2xl">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* GOOGLE IMAGE LAYER */}
            <img 
              src={googleUrl} 
              alt="Mix"
              onLoad={() => setIsNative(true)}
              onError={() => setIsNative(false)}
              className={`absolute inset-0 w-full h-full object-contain z-20 transition-opacity duration-300 ${isNative ? 'opacity-100' : 'opacity-0'}`}
            />

            {/* DYNAMIC FUSE LAYER (Always works as fallback) */}
            {!isNative && (
              <div className="relative w-full h-full flex items-center justify-center z-10 animate-in fade-in zoom-in duration-500">
                <span className="text-8xl absolute filter blur-[2px] opacity-40">{left}</span>
                <span className="text-7xl absolute translate-x-2 translate-y-2 mix-blend-overlay">{right}</span>
                <span className="text-8xl absolute brightness-110 contrast-125">{left}</span>
              </div>
            )}
          </div>

          <div className="mt-10 w-full space-y-4">
            <div className="flex justify-between items-center px-4 py-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
              <span className="text-[10px] font-black uppercase text-gray-400">Status</span>
              <span className={`text-[10px] font-black uppercase ${isNative ? 'text-green-500' : 'text-blue-500'}`}>
                {isNative ? 'Official Mix' : 'Dynamic Fusion'}
              </span>
            </div>

            <button 
              onClick={() => {
                navigator.clipboard.writeText(isNative ? googleUrl : `${left}${right}`);
                setCopyStatus(true);
                setTimeout(() => setCopyStatus(false), 2000);
              }}
              className="w-full py-4 bg-gray-900 dark:bg-white dark:text-black text-white rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
            >
              {copyStatus ? "Copied!" : "Copy Result"}
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex flex-wrap justify-center gap-4 opacity-50">
        <div className="flex items-center gap-2 text-[9px] font-bold uppercase"><Zap size={12}/> Instant Mixing</div>
        <div className="flex items-center gap-2 text-[9px] font-bold uppercase"><Info size={12}/> Works on Firefox, Chrome & Mobile</div>
      </div>
    </div>
  );
};

export default EmojiCombiner;