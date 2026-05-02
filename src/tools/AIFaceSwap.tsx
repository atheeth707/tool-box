import React, { useState, useEffect, useRef } from 'react';

const AIFaceSwap: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadStatus, setLoadStatus] = useState("Waking up the engine...");
  const spaceUrl = "https://alsv-faceswapall.hf.space";
  const timerRef = useRef<any>(null);
  const GradioApp = 'gradio-app' as any;

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = "https://gradio.s3-us-west-2.amazonaws.com/5.24.0/gradio.js";
    script.async = true;
    script.onload = () => {
      timerRef.current = setTimeout(() => setLoadStatus("Loading Neural Layers..."), 4000);
      if (typeof customElements !== 'undefined' && customElements.whenDefined) {
        customElements.whenDefined('gradio-app').then(() => setIsLoading(false));
      } else {
        setTimeout(() => setIsLoading(false), 2000);
      }
    };
    document.head.appendChild(script);
    return () => {
      if (document.head.contains(script)) document.head.removeChild(script);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="p-2 md:p-4 max-w-full mx-auto font-sans dark:bg-slate-950 transition-colors">
      <style>
        {`
          :root { --fs-bg: #ffffff; --fs-border: #e2e8f0; }
          @media (prefers-color-scheme: dark) {
            :root { --fs-bg: #0f172a; --fs-border: #1e293b; }
          }
          gradio-app {
            border-radius: 24px;
            overflow: hidden;
            border: 1px solid var(--fs-border);
            background: var(--fs-bg);
            min-height: 600px;
            display: block;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          }
        `}
      </style>

      <div className="mb-6 text-center">
        <h2 className="text-3xl font-black bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent uppercase tracking-tight">AI Face Swap</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">Professional Identity Synthesis via Flux.2</p>
      </div>

      <div className="relative w-full">
        {isLoading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-slate-950 rounded-3xl h-[600px]">
            <div className="flex flex-col items-center gap-6">
               <div className="relative">
                  <div className="w-16 h-16 border-4 border-orange-500/10 border-t-orange-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center"><div className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></div></div>
               </div>
               <div className="text-center">
                 <p className="text-xl font-bold text-slate-800 dark:text-slate-200">{loadStatus}</p>
                 <p className="text-xs text-slate-500 mt-2 animate-pulse">Hugging Face is initializing the GPU...</p>
               </div>
            </div>
          </div>
        )}
        <GradioApp src={spaceUrl} theme_mode="auto" initial_height="600px" />
      </div>
      <div className="mt-8 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">Free & Unlimited Access • Tool 150+</div>
    </div>
  );
};

export default AIFaceSwap;