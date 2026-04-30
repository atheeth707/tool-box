import React, { useState } from 'react';

const ImageGenerator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Hugging Face Space URL[cite: 20]
  const spaceUrl = "https://atheeth777-ai-text-to-image.hf.space";

  // Shared styles using CSS variables for theme support[cite: 20]
  const themeStyles = {
    '--bg-color': '#f9f9f9',
    '--text-main': '#1a1a1a',
    '--text-muted': '#666',
    '--border-color': '#ddd',
    '--container-bg': '#ffffff',
    '--shadow': '0 4px 6px rgba(0,0,0,0.1)',
  } as React.CSSProperties;

  return (
    <div style={{ 
      ...themeStyles,
      width: '100%', 
      maxWidth: '1000px', 
      margin: '0 auto', 
      padding: '20px',
      color: 'var(--text-main)'
    }}>
      {/* Dark Mode Styles Injection */}
      <style>
        {`
          @media (prefers-color-scheme: dark) {
            :target, div {
              --bg-color: #111827;
              --text-main: #f3f4f6;
              --text-muted: #9ca3af;
              --border-color: #374151;
              --container-bg: #1f2937;
              --shadow: 0 4px 6px rgba(0,0,0,0.4);
            }
          }
        `}
      </style>

      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>AI Image Generator[cite: 20]</h2>
      
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '700px', 
        border: '1px solid var(--border-color)', 
        borderRadius: '12px', 
        overflow: 'hidden',
        boxShadow: 'var(--shadow)',
        backgroundColor: 'var(--container-bg)'
      }}>
        {isLoading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-color)',
            zIndex: 1
          }}>
            <p style={{ color: 'var(--text-main)' }}>Waking up the AI... Please wait 30 seconds.[cite: 20]</p>
          </div>
        )}

        <iframe
          src={spaceUrl}
          onLoad={() => setIsLoading(false)}
          style={{ width: '100%', height: '100%', border: 'none' }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="AI Image Generator Space"
        />
      </div>
      
      <p style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
        Free unlimited use powered by Hugging Face Infrastructure.[cite: 20]
      </p>
    </div>
  );
};

export default ImageGenerator;