import React, { useState } from 'react';

const BackgroundRemoverAI: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Replace this with your specific Hugging Face embed link
  const spaceUrl = "https://atheeth777-bg-remover.hf.space";

  return (
    <div className="p-4 max-w-5xl mx-auto font-sans dark:bg-slate-950 transition-colors">
      <style>
        {`
          :root {
            --bg-rm-surface: #f9f9f9;
            --bg-rm-text: #1a1a1a;
            --bg-rm-border: #ddd;
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --bg-rm-surface: #111827;
              --bg-rm-text: #f3f4f6;
              --bg-rm-border: #374151;
            }
          }
        `}
      </style>

      <div className="mb-6 text-center">
        <h1 className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
          AI Background Remover
        </h1>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">
          Instant high-quality image masking
        </p>
      </div>
      
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '550px', 
        border: '1px solid var(--bg-rm-border)', 
        borderRadius: '20px', 
        overflow: 'hidden',
        backgroundColor: 'var(--bg-rm-surface)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      }}>
        {isLoading && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-rm-surface)',
            zIndex: 1
          }}>
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-xs font-bold" style={{ color: 'var(--bg-rm-text)' }}>
              Readying the eraser...
            </p>
          </div>
        )}

        <iframe
          src={spaceUrl}
          onLoad={() => setIsLoading(false)}
          style={{ width: '100%', height: '100%', border: 'none' }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="AI Background Remover"
        />
      </div>
      
      <div className="mt-4 flex justify-center gap-4">
        <span className="text-[9px] font-medium px-2 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-md">
          FREE FOREVER
        </span>
        <span className="text-[9px] font-medium px-2 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-md">
          NO SIGNUP[cite: 16]
        </span>
      </div>
    </div>
  );
};

export default BackgroundRemoverAI;