import React, { useState, useEffect } from 'react';

const AISpeechGenerator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const spaceUrl = "https://k2-fsa-text-to-speech.hf.space";
  const GradioApp = 'gradio-app' as any;

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = "https://gradio.s3-us-west-2.amazonaws.com/5.24.0/gradio.js";
    script.async = true;
    script.onload = () => { setTimeout(() => setIsLoading(false), 800); };
    document.head.appendChild(script);
    return () => { if (document.head.contains(script)) document.head.removeChild(script); };
  }, []);

  return (
    <div className="p-2 md:p-4 max-w-full mx-auto font-sans dark:bg-slate-950 transition-colors">
      <style>
        {`
          :root { --tts-bg: #ffffff; --tts-border: #e5e7eb; --tts-accent: #06b6d4; }
          @media (prefers-color-scheme: dark) {
            :root { --tts-bg: #0f172a; --tts-border: #1e293b; --tts-accent: #22d3ee; }
          }
          gradio-app {
            border-radius: 24px;
            overflow: hidden;
            border: 1px solid var(--tts-border);
            background: var(--tts-bg);
            min-height: 600px;
            display: block;
            box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
          }
        `}
      </style>

      <div className="mb-8 text-center">
        <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent uppercase tracking-tight">Voice Studio</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Premium Text-to-Speech Synthesis</p>
      </div>

      <div className="relative w-full">
        {isLoading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-slate-950 rounded-3xl h-[600px]">
            <div className="flex flex-col items-center gap-6">
               <div className="relative">
                  <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center"><div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping"></div></div>
               </div>
               <div className="text-center">
                 <p className="text-lg font-bold text-slate-800 dark:text-slate-200">Waking up the Voice Engine...</p>
                 <p className="text-xs text-slate-500 mt-1">Preparing models for high-quality speech</p>
               </div>
            </div>
          </div>
        )}
        <GradioApp src={spaceUrl} theme_mode="auto" initial_height="600px" />
      </div>

      <div className="mt-10 flex justify-center items-center gap-4">
        <div className="h-[1px] w-12 bg-slate-200 dark:bg-slate-800"></div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Free & Unlimited Access</p>
        <div className="h-[1px] w-12 bg-slate-200 dark:bg-slate-800"></div>
      </div>
    </div>
  );
};

export default AISpeechGenerator;