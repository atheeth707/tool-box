import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Sparkles, Paperclip, ImageIcon, Video, Code } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const handleInitialClick = () => {
    // Redirect to the full AI screen immediately
    navigate('/agent');
  };

  return (
    <div className="space-y-12">
      {/* --- NEW CHAT UI HERO --- */}
      <section className="relative pt-10 pb-16 flex flex-col items-center">
        <div className="text-center mb-10 space-y-4">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter">
            What can I <span className="text-blue-600">create</span> for you?
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Generate images, code, or video in seconds.
          </p>
        </div>

        {/* Mock Chat Input Bar */}
        <div 
          onClick={handleInitialClick}
          className="w-full max-w-3xl bg-white dark:bg-[#0f0f0f] border-2 border-gray-100 dark:border-white/10 p-4 rounded-3xl shadow-2xl cursor-text hover:border-blue-500/50 transition-all group"
        >
          <div className="flex items-end gap-3">
            <div className="p-3 text-gray-400">
              <Paperclip size={22} />
            </div>
            
            <div className="flex-grow py-3 text-gray-400 text-lg">
              Message the Agentic AI...
            </div>

            <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <Send size={22} />
            </div>
          </div>
          
          {/* Action Pills */}
          <div className="flex gap-2 mt-4 ml-2">
             <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-white/5 rounded-full text-xs font-bold text-gray-500 border border-gray-100 dark:border-white/5">
                <ImageIcon size={14} className="text-purple-500"/> Generate Image
             </div>
             <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-white/5 rounded-full text-xs font-bold text-gray-500 border border-gray-100 dark:border-white/5">
                <Video size={14} className="text-pink-500"/> Create Video
             </div>
          </div>
        </div>
      </section>

      {/* --- REGULAR TOOLS SECTION --- */}
      <section id="categories-section">
        {/* Your existing Trending and Categories mapping here */}
      </section>
    </div>
  );
}