import React, { useState, useEffect } from 'react';

// This tells TypeScript that <gradio-app> is a valid tag
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'gradio-app': any;
    }
  }
}

const AISpeechGenerator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Inject the Gradio script into the document head
    const script = document.createElement('script');
    script.type = 'module';
    script.src = "https://gradio.s3-us-west-2.amazonaws.com/5.24.0/gradio.js";
    script.async = true;
    
    // When the script loads, we can consider the "engine" ready
    script.onload = () => setIsLoading(false);
    
    document.head.appendChild(script);

    return () => {
      // Cleanup the script if the user leaves this page
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="p-4 max-w-6xl mx-auto font-sans dark:bg-slate-950 transition-colors min-h-screen">
      <style>
        {`
          :root { --tts-surface: #ffffff; --tts-border: #e5e7eb; }
          @media (prefers-color-scheme: dark) {
            :root { --tts-surface: #111827; --tts-border: #374151; }
          }
          
          /* Ensures the Gradio component looks good on all screen sizes */
          gradio-app {
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid var(--tts-border);
            background: var(--tts-surface);
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          }
        `}
      </style>

      <div className="mb-6 text-center">
        <h2 className="text-3xl font-black bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent uppercase tracking-tight">
          AI Voice Generator
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          High-fidelity neural speech synthesis (Kokoro v0.19)
        </p>
      </div>

      <div className="relative w-full">
        {isLoading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-2xl h-[500px]">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-bold text-gray-600 dark:text-gray-300 animate-pulse">
              Waking up the Voice Engine...
            </p>
          </div>
        )}

        {/* The Gradio Web Component handles responsiveness better than a standard iframe */}
        <gradio-app 
          src="https://hexgrad-kokoro-tts.hf.space" 
          theme_mode="auto"
        ></gradio-app>
      </div>

      <div className="mt-8 p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
        <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Device Compatibility Note</h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          This tool uses neural synthesis. For the best experience on mobile, ensure your silent switch is off. 
          If the interface doesn't appear, refresh the page to re-initialize the script.
        </p>
      </div>
    </div>
  );
};

export default AISpeechGenerator;