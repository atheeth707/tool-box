import React, { useState, useEffect } from 'react';

const AISpeechGenerator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const spaceUrl = "https://hexgrad-kokoro-tts.hf.space";

  // We define the custom tag as a constant to trick the TS compiler
  const GradioApp = 'gradio-app' as any;

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = "https://gradio.s3-us-west-2.amazonaws.com/5.24.0/gradio.js";
    script.async = true;
    
    script.onload = () => {
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
            min-height: 600px;
            display: block;
          }
        `}
      </style>

      <div className="mb-8 text-center">
        <h2 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent uppercase">
          AI Speech Generator
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
          Powered by Kokoro Neural Engine
        </p>
      </div>

      <div className="relative w-full">
        {isLoading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-slate-950 rounded-2xl h-[600px]">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-sm font-bold text-slate-600 dark:text-slate-400">
              Synchronizing Voice Models...
            </p>
          </div>
        )}

        {/* Using the constant avoids the 'Property does not exist' error */}
        <GradioApp 
          src={spaceUrl} 
          theme_mode="auto"
          initial_height="600px"
        />
      </div>
    </div>
  );
};

export default AISpeechGenerator;