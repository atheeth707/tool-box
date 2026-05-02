import React, { useState } from 'react';

const AIChatBot: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const spaceUrl = "https://tencent-hy3-preview.hf.space";

  return (
    <div className="p-2 md:p-4 max-w-full mx-auto font-sans dark:bg-slate-950 transition-colors">
      <style>
        {`
          :root { --chat-bg: #f9f9f9; --chat-text: #1a1a1a; --chat-border: #ddd; }
          @media (prefers-color-scheme: dark) {
            :root { --chat-bg: #111827; --chat-text: #f3f4f6; --chat-border: #374151; }
          }
        `}
      </style>

      <div className="mb-6 text-center">
        <h1 className="text-2xl font-black bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
          Free AI Chat Assistant
        </h1>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">
          Powered by Llama 3 • No Login Required
        </p>
      </div>
      
      <div style={{ 
        position: 'relative', width: '100%', height: '600px', 
        border: '1px solid var(--chat-border)', borderRadius: '20px', 
        overflow: 'hidden', backgroundColor: 'var(--chat-bg)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      }}>
        {isLoading && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--chat-bg)', zIndex: 1 }}>
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-xs font-bold" style={{ color: 'var(--chat-text)' }}>Connecting to AI Brain...</p>
          </div>
        )}

        <iframe
          src={spaceUrl}
          onLoad={() => setIsLoading(false)}
          style={{ width: '100%', height: '100%', border: 'none' }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="AI Chat Bot"
        />
      </div>
      
      <div className="mt-4 flex justify-center gap-4">
        <span className="text-[9px] font-medium px-2 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-md">UNLIMITED ACCESS</span>
        <span className="text-[9px] font-medium px-2 py-1 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-md">OPEN SOURCE</span>
      </div>
    </div>
  );
};

export default AIChatBot;