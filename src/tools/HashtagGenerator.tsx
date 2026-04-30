import { Hash, ExternalLink, Zap, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';

export default function HashtagGenerator() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      {/* Main Feature Card */}
      <div className="relative overflow-hidden bg-white dark:bg-gray-800 p-10 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 text-center">
        {/* Background Decorative Gradient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-cyan-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-3 shadow-lg shadow-blue-500/20">
            <Hash className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
            AI Hashtag Generator
          </h2>
          
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Boost your discoverability on TikTok, Instagram, and Reels. Use our 
            <span className="text-blue-600 font-bold ml-1">AI-powered engine</span> to find trending, high-reach tags instantly.
          </p>

          {/* Value Propositions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl flex items-center gap-3 border border-gray-100 dark:border-gray-700">
              <TrendingUp className="text-blue-500 w-5 h-5" />
              <span className="text-sm font-bold dark:text-gray-200">Viral Trends</span>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl flex items-center gap-3 border border-gray-100 dark:border-gray-700">
              <ShieldCheck className="text-emerald-500 w-5 h-5" />
              <span className="text-sm font-bold dark:text-gray-200">No Signup</span>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl flex items-center gap-3 border border-gray-100 dark:border-gray-700">
              <Sparkles className="text-purple-500 w-5 h-5" />
              <span className="text-sm font-bold dark:text-gray-200">Free Access</span>
            </div>
          </div>

          {/* Action Button - Updated with new link */}
          <a 
            href="https://www.veed.io/tools/script-generator/hashtag-generator" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-5 rounded-2xl font-black text-xl transition-all shadow-2xl shadow-blue-600/30 hover:scale-[1.02] active:scale-95"
          >
            Find Viral Hashtags <ExternalLink size={24} />
          </a>
          
          <p className="mt-6 text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black">
            Free Tool • No Signup Required • 2026 Ready
          </p>
        </div>
      </div>

      {/* SEO Strategy Card */}
      <div className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/30">
        <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-600" /> 
          The 3-3-3 Hashtag Strategy
        </h4>
        <p className="text-sm text-blue-800/70 dark:text-blue-400/70 leading-relaxed">
          For maximum growth, use the generator to pick <strong>3 Massive Tags</strong> (1M+ posts), <strong>3 Niche Tags</strong> (100k-500k posts), and <strong>3 Specific Tags</strong> (under 50k posts). This helps the algorithm categorize your content while still giving you a chance to rank.
        </p>
      </div>
    </div>
  );
}