import React, { useState } from 'react';
import { SmilePlus, RefreshCcw, ExternalLink } from 'lucide-react';

const EmojiCombiner: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState(0);

  // This specific Hugging Face Space is configured to allow embedding
  const spaceUrl = "https://huggingface.co/spaces/Maki9/Emoji-Kitchen/embed";

  const refreshIframe = () => {
    setIsLoading(true);
    setKey(prev => prev + 1);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto font-sans dark:bg-slate-950 transition-colors">
      <style>
        {`
          :root { --em-bg: #ffffff; --em-txt: #1a1a1a; --em-brd: #ddd; }
          @media (prefers-color-scheme: dark) {
            :root { --em-bg: #111827; --em-txt: #f3f4f6; --em-brd: #374151; }
          }
        `}
      </style>

      <div className="mb-6 text-center relative">
        <div className="w-16 h-16 bg-yellow-50 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <SmilePlus className="w-8 h-8 text-yellow-500" />
        </div>
        <h1 className="text-2xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent uppercase tracking-tight">
          AI Emoji Kitchen
        </h1>
        
        <div className="absolute right-0 top-0 flex gap-2">
          <button 
            onClick={refreshIframe}
            className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
            title="Reload Engine"
          >
            <RefreshCcw size={18} className={isLoading ? "animate-spin" : ""} />
          </button>
          <a 
            href="https://huggingface.co/spaces/Maki9/Emoji-Kitchen" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-blue-500"
          >
            <ExternalLink size={18} />
          </a>
        </div>
      </div>
      
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '900px', 
        border: '1px solid var(--em-brd)', 
        borderRadius: '24px', 
        overflow: 'hidden',
        backgroundColor: 'var(--em-bg)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900 z-10">
            <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xs font-bold uppercase tracking-tighter dark:text-white">
              Connecting to Kitchen...
            </p>
          </div>
        )}

        <iframe
          key={key}
          src={spaceUrl}
          onLoad={() => setIsLoading(false)}
          // Using standard iframe permissions without the restrictive sandbox
          style={{ width: '100%', height: '100%', border: 'none' }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Emoji Combiner"
        />
      </div>
      
      <div className="mt-4 flex justify-center gap-3">
        <span className="text-[10px] font-bold px-3 py-1.5 bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 rounded-full">
          EMBED ALLOWED
        </span>
        <span className="text-[10px] font-bold px-3 py-1.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400 rounded-full">
          FIREFOX COMPATIBLE
        </span>
      </div>
    </div>
  );
};

export default EmojiCombiner;import React, { useState } from 'react';
import { SmilePlus, RefreshCcw, ExternalLink } from 'lucide-react';

const EmojiCombiner: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState(0);

  // This specific Hugging Face Space is configured to allow embedding
  const spaceUrl = "https://huggingface.co/spaces/Maki9/Emoji-Kitchen/embed";

  const refreshIframe = () => {
    setIsLoading(true);
    setKey(prev => prev + 1);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto font-sans dark:bg-slate-950 transition-colors">
      <style>
        {`
          :root { --em-bg: #ffffff; --em-txt: #1a1a1a; --em-brd: #ddd; }
          @media (prefers-color-scheme: dark) {
            :root { --em-bg: #111827; --em-txt: #f3f4f6; --em-brd: #374151; }
          }
        `}
      </style>

      <div className="mb-6 text-center relative">
        <div className="w-16 h-16 bg-yellow-50 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <SmilePlus className="w-8 h-8 text-yellow-500" />
        </div>
        <h1 className="text-2xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent uppercase tracking-tight">
          AI Emoji Kitchen
        </h1>
        
        <div className="absolute right-0 top-0 flex gap-2">
          <button 
            onClick={refreshIframe}
            className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
            title="Reload Engine"
          >
            <RefreshCcw size={18} className={isLoading ? "animate-spin" : ""} />
          </button>
          <a 
            href="https://huggingface.co/spaces/Maki9/Emoji-Kitchen" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-blue-500"
          >
            <ExternalLink size={18} />
          </a>
        </div>
      </div>
      
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '900px', 
        border: '1px solid var(--em-brd)', 
        borderRadius: '24px', 
        overflow: 'hidden',
        backgroundColor: 'var(--em-bg)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900 z-10">
            <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xs font-bold uppercase tracking-tighter dark:text-white">
              Connecting to Kitchen...
            </p>
          </div>
        )}

        <iframe
          key={key}
          src={spaceUrl}
          onLoad={() => setIsLoading(false)}
          // Using standard iframe permissions without the restrictive sandbox
          style={{ width: '100%', height: '100%', border: 'none' }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Emoji Combiner"
        />
      </div>
      
      <div className="mt-4 flex justify-center gap-3">
        <span className="text-[10px] font-bold px-3 py-1.5 bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 rounded-full">
          EMBED ALLOWED
        </span>
        <span className="text-[10px] font-bold px-3 py-1.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400 rounded-full">
          FIREFOX COMPATIBLE
        </span>
      </div>
    </div>
  );
};

export default EmojiCombiner;