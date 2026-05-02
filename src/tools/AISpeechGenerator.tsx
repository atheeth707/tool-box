import React, { useState } from 'react';

const AISpeechGenerator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const spaceUrl = "https://hexgrad-kokoro-tts.hf.space";

  return (
    <div className="p-4 max-w-6xl mx-auto font-sans dark:bg-slate-950 transition-colors">
      <style>
        {`
          :root { --tts-surface: #f9f9f9; --tts-text: #1a1a1a; --tts-border: #ddd; }
          @media (prefers-color-scheme: dark) {
            :root { --tts-surface: #111827; --tts-text: #f3f4f6; --tts-border: #374151; }
          }
        `}
      </style>

      <h2 className="text-2xl font-black text-center mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
        AI Text-to-Speech
      </h2>

      <div style={{ 
        position: 'relative', width: '100%', height: '900px', 
        border: '1px solid var(--tts-border)', borderRadius: '16px', 
        overflow: 'hidden', backgroundColor: 'var(--tts-surface)' 
      }}>
        {isLoading && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--tts-surface)', zIndex: 1 }}>
            <div className="flex flex-col items-center gap-3">
               <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
               <p className="text-sm font-medium" style={{ color: 'var(--tts-text)' }}>
                 Loading Voice Engine...
               </p>
            </div>
          </div>
        )}
        <iframe 
          src={spaceUrl} 
          onLoad={() => setIsLoading(false)} 
          style={{ width: '100%', height: '100%', border: 'none' }} 
          allow="autoplay; clipboard-write; encrypted-media; fullscreen"
          title="Kokoro TTS AI"
        />
      </div>
    </div>
  );
};

export default AISpeechGenerator;