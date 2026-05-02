import React, { useState, useEffect, useRef } from 'react';

const FaceSwapAI: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadStatus, setLoadStatus] = useState("Waking up the engine...");
  const spaceUrl = "https://linoyts-flux2-klein-face-swap.hf.space";
  
  // Use 'any' cast to bypass Vercel build checks (TS2339)
  const GradioApp = 'gradio-app' as any;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 1. Faster Script Loading
    const script = document.createElement('script');
    script.type = 'module';
    script.src = "https://gradio.s3-us-west-2.amazonaws.com/5.24.0/gradio.js";
    script.async = true;
    
    script.onload = () => {
      // 2. Status Updates to keep user engaged during long HF cold starts
      timerRef.current = setTimeout(() => setLoadStatus("Loading Neural Layers..."), 3000);
      setTimeout(() => setLoadStatus("Finalizing Interface..."), 7000);
      
      // We check for the custom element to be defined before hiding loader
      customElements.whenDefined('gradio-app').then(() => {
        setIsLoading(false);
      });
    };
    
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) document.head.removeChild(script);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="p-4 max-w-6xl mx-auto font-sans dark:bg-slate-950 transition-colors min-h-screen">
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
            min-height: 850px;
            display: block;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          }
        `}
      </style>

      <div className="mb-6 text-center">
        <h2 className="text-3xl font-black bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent uppercase">
          AI Face Swap
        </h2>
      </div>

      <div className="relative w-full">
        {isLoading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-slate-950 rounded-3xl h-[850px]">
            <div className="flex flex-col items-center gap-4">
               <div className="w-14 h-14 border-4 border-orange-500/10 border-t-orange-500 rounded-full animate-spin"></div>
               <div className="text-center">
                 <p className="text-lg font-bold text-slate-800 dark:text-slate-200">
                   {loadStatus}
                 </p>
                 <p className="text-xs text-slate-500 mt-1 animate-pulse">
                   Hugging Face is initializing the GPU...
                 </p>
               </div>
            </div>
          </div>
        )}

        <GradioApp 
          src={spaceUrl} 
          theme_mode="auto"
          initial_height="850px"
        />
      </div>
    </div>
  );
};

export default FaceSwapAI;