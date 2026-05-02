import React, { useState, useEffect } from 'react';

// Extend the window interface for TypeScript to recognize Google Translate
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

const AIImageGenerator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const spaceUrl = "https://baidu-ernie-image-turbo.hf.space";

  useEffect(() => {
    // 1. Define the Google Translate init function
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { 
          pageLanguage: 'auto', 
          includedLanguages: 'en', // You can add more like 'hi,es,fr'
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false 
        },
        'google_translate_element'
      );
    };

    // 2. Inject the Google Translate Script
    const addScript = document.createElement('script');
    addScript.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    addScript.async = true;
    document.body.appendChild(addScript);

    return () => {
      // Optional: Cleanup if the component unmounts
      const script = document.querySelector('script[src*="translate_a"]');
      if (script) document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="p-4 max-w-6xl mx-auto font-sans dark:bg-slate-950 transition-colors min-h-screen">
      <style>
        {`
          :root { --img-bg: #f9f9f9; --img-text: #1a1a1a; --img-border: #ddd; }
          @media (prefers-color-scheme: dark) {
            :root { --img-bg: #111827; --img-text: #f3f4f6; --img-border: #374151; }
          }
          /* Clean up the Google Translate header bar */
          .goog-te-banner-frame.skiptranslate { display: none !important; }
          body { top: 0px !important; }
          .goog-te-gadget-simple {
            background: transparent !important;
            border: 1px solid var(--img-border) !important;
            padding: 4px 8px !important;
            border-radius: 8px !important;
            color: var(--img-text) !important;
          }
        `}
      </style>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-black text-center dark:text-white">AI Image Generator</h2>
        
        {/* The Translation Widget */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Translate:</span>
          <div id="google_translate_element" className="rounded-lg shadow-sm" />
        </div>
      </div>

      <div style={{ 
        position: 'relative', width: '100%', height: '850px', 
        border: '1px solid var(--img-border)', borderRadius: '16px', 
        overflow: 'hidden', backgroundColor: 'var(--img-bg)',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        {isLoading && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--img-bg)', zIndex: 1 }}>
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-medium" style={{ color: 'var(--img-text)' }}>Waking up the Image Engine...</p>
            </div>
          </div>
        )}
        <iframe 
          src={spaceUrl} 
          onLoad={() => setIsLoading(false)} 
          style={{ width: '100%', height: '100%', border: 'none' }} 
          allowFullScreen 
          title="AI Generator"
        />
      </div>

      <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Pro Tip:</strong> Because the AI is inside an iframe, standard scripts may not catch every word. If buttons remain in the original language, right-click anywhere and select <strong>"Translate to English"</strong> in your browser to force a full translation.
        </p>
      </div>
    </div>
  );
};

export default AIImageGenerator;