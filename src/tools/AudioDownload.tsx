import React from 'react';

export default function MyInstantsEmbed() {
  return (
    <div className="w-full min-h-screen bg-white dark:bg-gray-900">
      {/* 
        The iframe is set to 100vh (full viewport height).
        'allow="autoplay"' is included so the sound buttons work.
      */}
      <iframe
        src="https://www.myinstants.com/en/index/in/"
        title="MyInstants Soundboard"
        className="w-full h-screen border-none shadow-inner"
        style={{ minHeight: '100vh' }}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
        sandbox="allow-forms allow-popups allow-scripts allow-same-origin"
      />
    </div>
  );
}