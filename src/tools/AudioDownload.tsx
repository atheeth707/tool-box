import React from 'react';

export default function MyInstantsEmbed() {
  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
        <h1 className="font-bold">Trending Instant Sounds</h1>
        <a 
          href="https://tool-box-free.vercel.app/tool/report" 
          className="text-xs underline"
        >
          Any Tool Not Works? Report Here
        </a>
      </div>
      <div className="flex-1 overflow-hidden">
        <iframe
          src="https://www.myinstants.com/en/index/in/"
          title="MyInstants Embed"
          className="w-full h-full border-none"
          allow="autoplay"
        />
      </div>
    </div>
  );
}