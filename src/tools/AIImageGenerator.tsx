import React, { useState } from 'react';

const ImageGenerator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Replace this with your actual Hugging Face Space URL
  const spaceUrl = "https://atheeth777-ai-text-to-image.hf.space";

  return (
    <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>AI Image Generator</h2>
      
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '700px', 
        border: '1px solid #ddd', 
        borderRadius: '12px', 
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
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
            background: '#f9f9f9',
            zIndex: 1
          }}>
            <p>Waking up the AI... Please wait 30 seconds.</p>
          </div>
        )}

        <iframe
          src={spaceUrl}
          onLoad={() => setIsLoading(false)}
          style={{ width: '100%', height: '100%', border: 'none' }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      
      <p style={{ marginTop: '10px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
        Free unlimited use powered by Hugging Face Infrastructure.
      </p>
    </div>
  );
};

export default ImageGenerator;