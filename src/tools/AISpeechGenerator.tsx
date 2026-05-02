import React, { useState, useEffect } from 'react';

const AISpeechGenerator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const spaceUrl = "https://mrfakename-e2-f5-tts.hf.space";

  // Use 'any' cast to prevent Vercel build errors (TS2339)
  const GradioApp = 'gradio-app' as any;

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = "https://gradio.s3-us-west-2.amazonaws.com/5.24.0/gradio.js";
    script.async = true;
    
    script.onload = () => {
      // Allow a moment for the custom element to register in the DOM
      setTimeout(() => setIsLoading(false), 500);
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
          :root { --tts-bg: #ffffff; --tts-border: #e5e7eb; }
          @media (prefers-color-scheme: dark) {
            :root { --tts-bg: #0f172a; --tts-border: #1e293b; }
          }
          
          gradio-app {
            border-radius: 20px;
            overflow: hidden;
            border: 1px solid var(--tts-border);
            background: var(--tts-bg);
            min-height: 700px;
            display: block;
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
          }
        `}
      </style>

      <div className="mb-8 text-center">
        <h2 className="text-3xl font-black bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent uppercase tracking-tight">
          Neural Text-to-Speech
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
          Advanced E2-F5 Voice Synthesis
        </p>
      </div>

      <div className="relative w-full">
        {/* Professional Loading State */}
        {isLoading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-slate-950 rounded-2xl h-[700px]">
            <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-sm font-bold text-slate-600 dark:text-slate-400 animate-pulse">
              Connecting to AI Model...
            </p>
          </div>
        )}

        {/* The Gradio Web Component */}
        <GradioApp 
          src={spaceUrl} 
          theme_mode="auto"
          initial_height="700px"
        />
      </div>

      <div className="mt-8 text-center">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest">
          Continuous Project Update • Tool 154+ Verified
        </p>
      </div>
    </div>
  );
};

export default AISpeechGenerator;