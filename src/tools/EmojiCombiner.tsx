import React, { useState } from 'react';
import { SmilePlus, Copy } from 'lucide-react';

const EmojiCombiner: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Using a highly-rated Emoji Kitchen implementation on Hugging Face
  const spaceUrl = "https://valerios-emojikitchen.hf.space";

  return (
    <div className="p-4 max-w-6xl mx-auto font-sans dark:bg-slate-950 transition-colors">
      <style>
        {`
          :root {
            --emoji-bg: #ffffff;
            --emoji-text: #1a1a1a;
            --emoji-border: #ddd;
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --emoji-bg: #111827;
              --emoji-text: #f3f4f6;
              --emoji-border: #374151;
            }
          }
        `}
      </style>

      <div className="mb-6 text-center">
        <div className="w-16 h-16 bg-yellow-50 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <SmilePlus className="w-8 h-8 text-yellow-500" />
        </div>
        <h1 className="text-2xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent uppercase tracking-tight">
          AI Emoji Kitchen
        </h1>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1 font-bold">
          Mix two emojis to create something new
        </p>
      </div>
      
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '900px', 
        border: '1px solid var(--emoji-border)', 
        borderRadius: '24px', 
        overflow: 'hidden',
        backgroundColor: 'var(--emoji-bg)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        {isLoading && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--emoji-bg)',
            zIndex: 1
          }}>
            <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xs font-black uppercase tracking-tighter" style={{ color: 'var(--emoji-text)' }}>
              Heating up the kitchen...
            </p>
          </div>
        )}

        <iframe
          src={spaceUrl}
          onLoad={() => setIsLoading(false)}
          style={{ width: '100%', height: '100%', border: 'none' }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Emoji Combiner Engine"
        />
      </div>
      
      <div className="mt-6 flex justify-center gap-3">
        <span className="text-[9px] font-bold px-3 py-1.5 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400 rounded-full">
          Gboard Engine Compatible
        </span>
        <span className="text-[9px] font-bold px-3 py-1.5 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 rounded-full">
          Instant Export
        </span>
      </div>
    </div>
  );
};

export default EmojiCombiner;