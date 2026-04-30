import { useState } from 'react';
import { Type, Copy, ExternalLink, Sparkles } from 'lucide-react';

export default function YtTitleGenerator() {
  const [keyword, setKeyword] = useState('');
  
  const templates = [
    "The Ultimate Guide to [X] in 2024",
    "I Tried [X] For 30 Days (Here's What Happened)",
    "Stop Doing [X] (Do This Instead)",
    "Why [X] Is Destroying Your Productivity",
    "How To Master [X] As A Beginner",
    "10 Secrets About [X] You Didn't Know",
    "[X] Explained In 5 Minutes",
    "The Truth About [X]",
    "I Built A [X] Empire From Scratch",
    "Is [X] Worth It? (Honest Review)",
    "How I Use [X] To Make $10k/Month",
    "The Only [X] Tutorial You Will Ever Need",
    "Top 5 Mistakes People Make With [X]",
    "What Nobody Tells You About [X]",
    "Mastering [X]: Step-by-Step Tutorial"
  ];

  const titles = keyword ? templates.map(t => t.replace(/\[X\]/g, keyword.charAt(0).toUpperCase() + keyword.slice(1))) : [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* vidIQ Recommendation Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 to-orange-500 p-6 rounded-3xl shadow-lg border border-red-400/20 group">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-white">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black">Want AI-Powered Viral Titles?</h3>
              <p className="text-red-100 text-sm">Try the official <span className="font-bold">vidIQ AI Generator</span> — Free & No Signup Required!</p>
            </div>
          </div>
          <a 
            href="https://vidiq.com/ai-title-generator/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white text-red-600 px-6 py-3 rounded-2xl font-bold hover:bg-gray-100 transition-all shadow-xl hover:scale-105"
          >
            Open vidIQ <ExternalLink size={18} />
          </a>
        </div>
        {/* Decorative background circle */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Type className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-2xl font-bold dark:text-white mb-2">YouTube Title Generator</h2>
        <p className="text-gray-500 mb-8">Generate highly clickable, viral title ideas based on your main keyword.</p>

        <div className="max-w-md mx-auto">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter your main topic (e.g. React, Fitness, Crypto)"
            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-red-500 outline-none text-lg text-center font-bold"
          />
        </div>
      </div>

      {titles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {titles.map((title, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex justify-between items-center group hover:border-red-300 transition-colors">
              <span className="font-bold text-gray-900 dark:text-white">{title}</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(title);
                  // Optional: You could add a "Copied!" toast here
                }} 
                className="p-2 text-gray-400 hover:text-red-600 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
              >
                <Copy size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}