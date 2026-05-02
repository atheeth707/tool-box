import React, { useState } from 'react';

const BackgroundRemoverAI: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const spaceUrl = "https://atheeth777-bg-remover.hf.space";

  return (
    <div className="p-2 md:p-4 max-w-full mx-auto font-sans dark:bg-slate-950 transition-colors">
      <style>
        {`
          :root { --bg-rm-surface: #f9f9f9; --bg-rm-text: #1a1a1a; --bg-rm-border: #ddd; }
          @media (prefers-color-scheme: dark) {
            :root { --bg-rm-surface: #111827; --bg-rm-text: #f3f4f6; --bg-rm-border: #374151; }
          }
        `}
      </style>
      <h2 className="text-2xl font-black text-center mb-4 bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">AI Background Remover</h2>
      <div style={{ 
        position: 'relative', width: '100%', height: '600px', 
        border: '1px solid var(--bg-rm-border)', borderRadius: '16px', 
        overflow: 'hidden', backgroundColor: 'var(--bg-rm-surface)' 
      }}>
        {isLoading && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-rm-surface)', zIndex: 1 }}>
            <p className="text-sm" style={{ color: 'var(--bg-rm-text)' }}>Readying the eraser...</p>
          </div>
        )}
        <iframe src={spaceUrl} onLoad={() => setIsLoading(false)} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen />
      </div>
    </div>
  );
};
export default BackgroundRemoverAI;