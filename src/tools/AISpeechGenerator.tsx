import React, { useState } from 'react';

const AISpeechGenerator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const proxyUrl = "https://translate.google.com/translate?sl=auto&tl=en&u=https://hexgrad-kokoro-tts.hf.space";

  return (
    <div className="p-4 max-w-6xl mx-auto font-sans dark:bg-slate-950 transition-colors">
      <style>
        {`
          :root { --tts-bg: #f9f9f9; --tts-text: #1a1a1a; --tts-border: #ddd; }
          @media (prefers-color-scheme: dark) {
            :root { --tts-bg: #111827; --tts-text: #f3f4f6; --tts-border: #374151; }
          }
          .tts-container {
            position: relative; width: 100%; height: 800px;
            border: 1px solid var(--tts-border); border-radius: 16px;
            overflow: hidden; background-color: var(--tts-bg);
          }
          .tts-iframe {
            width: 100%; height: calc(100% + 45px);
            border: none; margin-top: -45px;
          }
        `}
      </style>

      <h2 className="text-2xl font-black text-center mb-4 dark:text-white">AI Speech Generator</h2>
      
      <div className="tts-container">
        {isLoading && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--tts-bg)', zIndex: 10 }}>
            <p className="text-sm dark:text-white">Loading Voice Engine...</p>
          </div>
        )}
        <iframe 
          src={proxyUrl} 
          onLoad={() => setIsLoading(false)} 
          className="tts-iframe"
          allow="autoplay"
          title="Speech AI"
        />
      </div>
    </div>
  );
};

// THIS IS THE MISSING LINE CAUSING YOUR BUILD ERROR
export default AISpeechGenerator;