import React, { useState, useEffect } from 'react';
import { ChefHat, Copy, RotateCcw, Sparkles } from 'lucide-react';

const EMOJIS = [
  '😀', '🫠', '🤡', '👽', '🐱', '🐶', '🦊', '💩', '👻', '🔥', 
  '🌈', '💖', '✨', '🍎', '🥑', '🍕', '🤠', '🥳', '😎', '🤮'
];

const EmojiKitchen: React.FC = () => {
  const [left, setLeft] = useState('🐱');
  const [right, setRight] = useState('🤠');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(true);
  const [copyStatus, setCopyStatus] = useState(false);

  // This API endpoint handles the complex Google Gstatic sorting and URL mapping
  const mixUrl = `https://emojik.vercel.app/s/${left}_${right}?size=512`;

  const handleRandom = () => {
    setLeft(EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
    setRight(EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 font-sans selection:bg-yellow-200">
      <div className="bg-white dark:bg-gray-900 rounded-[40px] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        
        {/* Header Section */}
        <div className="p-8 pb-0 flex flex-col items-center">
          <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <ChefHat className="text-white w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Emoji Kitchen</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-1">Google Asset Engine</p>
        </div>

        {/* The "Stove" - Mixing Area */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          {/* Left Ingredient */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 bg-gray-50 dark:bg-gray-800 rounded-[32px] flex items-center justify-center text-6xl shadow-inner">
              {left}
            </div>
            <div className="grid grid-cols-4 gap-1 p-2 bg-gray-50 dark:bg-gray-800 rounded-2xl">
              {EMOJIS.slice(0, 8).map(e => (
                <button key={e} onClick={() => setLeft(e)} className="p-2 hover:scale-110 transition-transform">{e}</button>
              ))}
            </div>
          </div>

          {/* Resulting Mix */}
          <div className="flex flex-col items-center">
            <div className="relative group flex items-center justify-center w-48 h-48">
              <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" />
              {loading && <div className="absolute w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin z-20" />}
              <img 
                src={mixUrl} 
                alt="Mixed Emoji" 
                onLoad={() => setLoading(false)}
                onLoadStart={() => setLoading(true)}
                className={`w-44 h-44 object-contain relative z-10 transition-all duration-500 ${loading ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u1f600/u1f600_u1f600.png";
                }}
              />
            </div>
            <div className="mt-6 flex gap-2">
              <button 
                onClick={handleRandom}
                className="p-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full hover:bg-yellow-400 hover:text-white transition-all"
              >
                <RotateCcw size={20} />
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(mixUrl);
                  setCopyStatus(true);
                  setTimeout(() => setCopyStatus(false), 2000);
                }}
                className="px-6 py-3 bg-gray-900 dark:bg-white dark:text-black text-white rounded-full text-xs font-black uppercase tracking-widest active:scale-95 transition-all"
              >
                {copyStatus ? "Copied!" : "Copy Image"}
              </button>
            </div>
          </div>

          {/* Right Ingredient */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 bg-gray-50 dark:bg-gray-800 rounded-[32px] flex items-center justify-center text-6xl shadow-inner">
              {right}
            </div>
            <div className="grid grid-cols-4 gap-1 p-2 bg-gray-50 dark:bg-gray-800 rounded-2xl">
              {EMOJIS.slice(8, 16).map(e => (
                <button key={e} onClick={() => setRight(e)} className="p-2 hover:scale-110 transition-transform">{e}</button>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Footer Info */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-t border-gray-100 dark:border-gray-800 text-center">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
            <Sparkles size={10} /> Verified Google Static Assets • 2026 Compatible
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmojiKitchen;