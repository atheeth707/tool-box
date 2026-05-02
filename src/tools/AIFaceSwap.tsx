import React, { useState, useEffect } from 'react';

const FaceSwapAI: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const spaceUrl = "https://linoyts-flux2-klein-face-swap.hf.space";

  // Bypass TypeScript registry errors for custom elements during Vercel build
  const GradioApp = 'gradio-app' as any;

  useEffect(() => {
    // Injecting the Gradio engine script
    const script = document.createElement('script');
    script.type = 'module';
    script.src = "https://gradio.s3-us-west-2.amazonaws.com/5.24.0/gradio.js";
    script.async = true;
    
    script.onload = () => {
      // Smooth transition once the engine is ready
      setTimeout(() => setIsLoading(false), 1000);
    };
    
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
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
            min-height: 900px;
            display: block;
            box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
          }
        `}
      </style>

      <div className="mb-8 text-center">
        <h2 className="text-3xl font-black bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent uppercase tracking-tighter">
          AI Face Swap
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
          Professional Identity Synthesis via Flux.2
        </p>
      </div>

      <div className="relative w-full">
        {/* Positive "Waking Up" Loading State */}
        {isLoading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-slate-950 rounded-3xl h-[900px]">
            <div className="flex flex-col items-center gap-6">
               <div className="relative">
                  <div className="w-20 h-20 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full animate-ping"></div>
                  </div>
               </div>
               <div className="text-center">
                 <p className="text-xl font-bold text-slate-800 dark:text-slate-200">
                   Waking up the Face Swap Engine...
                 </p>
                 <p className="text-xs text-slate-500 mt-2">
                   Aligning neural layers for seamless synthesis
                 </p>
               </div>
            </div>
          </div>
        )}

        <GradioApp 
          src={spaceUrl} 
          theme_mode="auto"
          initial_height="900px"
        />
      </div>

      <div className="mt-12 flex justify-center items-center gap-6">
        <div className="h-[1px] w-16 bg-slate-200 dark:bg-slate-800"></div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
          Creative Cloud AI • Free Tool
        </p>
        <div className="h-[1px] w-16 bg-slate-200 dark:bg-slate-800"></div>
      </div>
    </div>
  );
};

export default FaceSwapAI;