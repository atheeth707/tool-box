import { Instagram, ExternalLink, Zap, ShieldCheck, Sparkles, MessageSquare } from 'lucide-react';

export default function InstaCaptionGenerator() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      {/* Main Feature Card */}
      <div className="relative overflow-hidden bg-white dark:bg-gray-800 p-10 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 text-center">
        {/* Instagram-style Gradient Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-3xl flex items-center justify-center mx-auto mb-8 -rotate-3 shadow-lg shadow-pink-500/20">
            <Instagram className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
            AI Instagram Caption Gen
          </h2>
          
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Stop struggling with what to write. Use our high-conversion engine powered by 
            <span className="text-pink-600 font-bold ml-1">VEED.io</span> to create viral captions in seconds.
          </p>

          {/* Value Propositions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl flex items-center gap-3 border border-gray-100 dark:border-gray-700">
              <Zap className="text-yellow-500 w-5 h-5" />
              <span className="text-sm font-bold dark:text-gray-200">Instant AI</span>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl flex items-center gap-3 border border-gray-100 dark:border-gray-700">
              <ShieldCheck className="text-blue-500 w-5 h-5" />
              <span className="text-sm font-bold dark:text-gray-200">No Signup</span>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl flex items-center gap-3 border border-gray-100 dark:border-gray-700">
              <Sparkles className="text-pink-500 w-5 h-5" />
              <span className="text-sm font-bold dark:text-gray-200">Free Access</span>
            </div>
          </div>

          {/* Action Button */}
          <a 
            href="https://www.veed.io/tools/script-generator/instagram-caption-generator" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-5 rounded-2xl font-black text-xl transition-all shadow-2xl shadow-pink-600/30 hover:scale-[1.02] active:scale-95"
          >
            Generate Captions Now <ExternalLink size={24} />
          </a>
          
          <p className="mt-6 text-xs text-gray-400 uppercase tracking-widest font-bold">
            External AI Tool • Trusted by Creators
          </p>
        </div>
      </div>

      {/* Helpful Tip Section */}
      <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
        <h4 className="font-bold dark:text-white mb-2 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-pink-500" /> 
          Maximizing Engagement
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Instagram captions that start with a <strong>strong hook</strong> (the first 125 characters) perform 40% better. Use the VEED generator to create 3 variations: one short/punchy, one storytelling-focused, and one with a clear Call to Action (CTA).
        </p>
      </div>
    </div>
  );
}