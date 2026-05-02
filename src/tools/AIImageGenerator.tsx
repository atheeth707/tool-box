import React, { useState } from 'react';

const AIImageGenerator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const spaceUrl = "https://baidu-ernie-image-turbo.hf.space";

  return (
    <div className="p-2 md:p-4 max-w-full mx-auto font-sans dark:bg-slate-950 transition-colors">
      <style>
        {`
          :root { --img-bg: #f9f9f9; --img-text: #1a1a1a; --img-border: #ddd; }
          @media (prefers-color-scheme: dark) {
            :root { --img-bg: #111827; --img-text: #f3f4f6; --img-border: #374151; }
          }
        `}
      </style>
      <h2 className="text-2xl font-black text-center mb-4 dark:text-white uppercase tracking-tight">AI Image Generator</h2>
      <div style={{ 
        position: 'relative', width: '100%', height: '600px', 
        border: '1px solid var(--img-border)', borderRadius: '16px', 
        overflow: 'hidden', backgroundColor: 'var(--img-bg)' 
      }}>
        {isLoading && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--img-bg)', zIndex: 1 }}>
            <p className="text-sm font-bold" style={{ color: 'var(--img-text)' }}>Loading Image Engine...</p>
          </div>
        )}
        <iframe 
          src={spaceUrl} 
          onLoad={() => setIsLoading(false)} 
          style={{ width: '100%', height: '100%', border: 'none' }} 
          allowFullScreen 
        />
      </div>
    </div>
  );
};

export default AIImageGenerator;