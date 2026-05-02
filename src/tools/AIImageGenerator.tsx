import React, { useState } from 'react';

const AIImageGenerator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Original URL: https://baidu-ernie-image-turbo.hf.space
  // We wrap it in a Google Translate proxy that forces English (tl=en)
  const proxyUrl = "https://translate.google.com/translate?sl=auto&tl=en&u=https://baidu-ernie-image-turbo.hf.space";

  return (
    <div className="p-4 max-w-6xl mx-auto font-sans dark:bg-slate-950 transition-colors">
      <style>
        {`
          :root { --img-bg: #f9f9f9; --img-text: #1a1a1a; --img-border: #ddd; }
          @media (prefers-color-scheme: dark) {
            :root { --img-bg: #111827; --img-text: #f3f4f6; --img-border: #374151; }
          }

          /* Hide the Google Translate Header Bar inside the iframe as much as possible */
          .translated-iframe-container {
            position: relative;
            width: 100%;
            height: 900px;
            border: 1px solid var(--img-border);
            border-radius: 16px;
            overflow: hidden;
            background-color: var(--img-bg);
          }

          /* This is a "trick" to hide the Google Translate toolbar if it appears at the top */
          iframe {
            margin-top: -40px; /* Pulls the iframe up to hide the proxy header */
            height: calc(100% + 40px) !important;
          }
        `}
      </style>

      <h2 className="text-2xl font-black text-center mb-4 dark:text-white">AI Image Generator</h2>
      
      <div className="translated-iframe-container">
        {isLoading && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--img-bg)', zIndex: 2 }}>
            <div className="flex flex-col items-center gap-2">
               <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
               <p className="text-sm" style={{ color: 'var(--img-text)' }}>Initializing AI Engine...</p>
            </div>
          </div>
        )}
        
        <iframe 
          src={proxyUrl} 
          onLoad={() => setIsLoading(false)} 
          style={{ width: '100%', border: 'none' }} 
          allowFullScreen 
          title="AI Generator"
        />
      </div>
    </div>
  );
};

export default AIImageGenerator;